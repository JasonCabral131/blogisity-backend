const User = require("./../model/user");
const encryptor = require("simple-encryptor")(process.env.encryptor_key);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Cryptr = require("cryptr");
const Blog = require("./../model/Blog");
const Follower = require("./../model/Followers");
const cryptr = new Cryptr(process.env.encryptor_key);
const randomString = require("random-string");
const { Mailing } = require("./../middleware/mail");
exports.Create = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      lattitude = "",
      longitude = "",
      contact,
      gender,
    } = req.body;
    let profile = { url: "", cloudinary_id: "" };
    if (req.file) {
    }
    const user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      address,
      lattitude,
      longitude,
      contact,
      gender,
      profile,
    });
    const saved = await user.save();
    return res.status(200).json({ user: saved });
  } catch (e) {
    return res.status(400).json({ msg: e });
  }
};

exports.gets = (req, res) => {
  try {
    const { page = 0, query = "" } = req.query;

    const allQuery = [
      {
        name: { $regex: query, $options: "i" },
        email: { $regex: query, $options: "i" },
        onboarding: 1,
      },
    ];
    let finder = null;
    if (isNaN(query)) {
      finder = [...allQuery];
    } else {
      finder =
        query == "" ? [...allQuery] : [...allQuery, { id: parseInt(query) }];
    }
    User.find({
      $or: finder,
    })
      .limit(10)
      .skip(page * 10)
      .exec(function (err, users) {
        if (err) return res.status(400).json({ e: err });
        User.find({
          $or: finder,
        })
          .count()
          .exec(function (err, count) {
            return res.status(200).json({
              users,
              count,
              totalPages: Math.ceil(count / 10),
            });
          });
      });
  } catch (e) {
    return res.status(400).json({ msg: e });
  }
};
exports.Update = (req, res) => { };

exports.Delete = (req, res) => { };
exports.get = (req, res) => {
  try {
    const { page = 0, query = "" } = req.query;
  } catch (e) {
    return res.status(400).json({ msg: "failed to get" });
  }
};
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailExist = await User.findOne({ email }).lean();
    if (emailExist) return res.status(400).json({ msg: "Email Already Exist" });
    const random = randomString({ length: 30 });
    const passwordToken = cryptr.encrypt(
      JSON.stringify({ passwordToken: random, email, password })
    );

    const save = await new User({
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(req.body.password, 10),
      passwordToken: random,
    }).save();
    if (save) {
      console.log(password)
      const token = jwt.sign(
        { onboarding: save.onboarding, email: email.toLowerCase(), password, _id: save._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      let objSender = {
        receiver: email.toLowerCase(),
        subject: "Email Verification",
        content: "",
      };

      let content = `<tr>
                  <td align="center" style="color:#888888;font-size:16px;font-family:'Work Sans',Calibri,sans-serif;">
                      <div style="width: 100%">
                          <p style="margin:20px 0;color:#343a40">Hey ${name}, you're almost ready to start enjoying Blogisity<br>
                          Simply click on the big purple button below to verify your email address.</p>
                      </div>
                  </td>
              </tr>
              <tr>
                    <td align="center" style="padding-top:2rem;color:#888888;font-size:16px;font-family:'Work Sans',Calibri,sans-serif;">
                        <a href="${process.env.url +
        "/verify-email-address/" +
        passwordToken
        }" role="button" style="font-size:14px;padding:.7rem 3rem;background-color:#8f3f9e;color:#fff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://sandbox.miigigs.com/verify-email/e5_7huYeQSbKgSCNvMn/5&amp;source=gmail&amp;ust=1657510101193000&amp;usg=AOvVaw0SVGVh40gUiFrY5IkkHT_d">Verify email address</a>
                     </td>
                </tr>
              `;
      objSender.content = content;
      const sendMail = await Mailing(objSender);
      const user = await User.findOne({ _id: save._id })
        .select("-passwordToken -password")
        .lean();

      return res
        .status(200)
        .json({ msg: "Check your email for onboarding", token, user });
    } else {
      return res.status(400).json({ msg: "Failed to Signup" });
    }
  } catch (e) {
    return res.status(400).json({ msg: "Failed to Signup", error: e });
  }
};

exports.emailVerification = async (req, res) => {
  try {
    const { passToken } = req.body;
    const descrypt = JSON.parse(cryptr.decrypt(passToken));
    if (!descrypt) return res.status(400).json({ msg: "Failed to Verify" });
    const { passwordToken, email, password } = descrypt;

    const userExist = await User.findOne({
      passwordToken,
      onboarding: 0,
    }).lean();
    if (!userExist) return res.status(400).json({ msg: "Failed to Verify" });

    const updating = await User.findOneAndUpdate(
      { passwordToken },
      { $set: { passwordToken: null, onboarding: 1 } },
      { upsert: true }
    );
    if (!updating) return res.status(400).json({ msg: "Failed to Verify" });
    const token = jwt.sign(
      { onboarding: updating.onboarding, email, password, _id: updating._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const user = await User.findOne({ _id: updating._id })
      .select("-passwordToken -password")
      .lean();

    return res
      .status(200)
      .json({ msg: "Check your email for onboarding", token, user });
  } catch (e) {
    return res.status(400).json({ msg: "Failed to Verify" });
  }
};

exports.resendVerificationEmail = async (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const user = await jwt.verify(token, process.env.JWT_SECRET);
      if (!user) {
        return res.status(400).json({ msg: "Failed to send" });
      }
      const userInfo = await User.findOne({ email: user.email });
      if (!userInfo) {
        return res.status(400).json({ msg: "Failed to send" });
      }
      if (userInfo.onboarding == 1) {
        return res.status(400).json({ msg: "User Already Onboarded" });
      }
      const { passwordToken, email, password } = user;
      console.log(email);
      const random = randomString({ length: 30 });
      const passwordTokenNew = cryptr.encrypt(
        JSON.stringify({ passwordToken: random, email, password })
      );
      console.log(passwordTokenNew);
      let objSender = {
        receiver: email,
        subject: "Email Verification",
        content: "",
      };

      let content = `<tr>
                  <td align="center" style="color:#888888;font-size:16px;font-family:'Work Sans',Calibri,sans-serif;">
                      <div style="width: 100%">
                          <p style="margin:20px 0;color:#343a40">Hey ${userInfo.name
        }, you're almost ready to start enjoying Blogisity<br>
                          Simply click on the big purple button below to verify your email address.</p>
                      </div>
                  </td>
              </tr>
              <tr>
                    <td align="center" style="padding-top:2rem;color:#888888;font-size:16px;font-family:'Work Sans',Calibri,sans-serif;">
                        <a href="${process.env.url +
        "/verify-email-address/" +
        passwordTokenNew
        }" role="button" style="font-size:14px;padding:.7rem 3rem;background-color:#8f3f9e;color:#fff;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://sandbox.miigigs.com/verify-email/e5_7huYeQSbKgSCNvMn/5&amp;source=gmail&amp;ust=1657510101193000&amp;usg=AOvVaw0SVGVh40gUiFrY5IkkHT_d">Verify email address</a>
                     </td>
                </tr>
              `;
      objSender.content = content;
      const sendMail = await Mailing(objSender);
      if (sendMail) {
        console.log();
        const updating = await User.findOneAndUpdate(
          { _id: userInfo._id },
          { $set: { passwordToken: random } },
          { upsert: true }
        );

        if (updating) {
          return res
            .status(200)
            .json({ msg: "Email Verification Successfully Send" });
        } else {
          return res.status(400).json({ msg: "Failed to send" });
        }
      }
      return res
        .status(200)
        .json({ msg: "Email Verification Successfully Send" });
    }
  } catch (e) {
    return res.status(400).json({ msg: "Failed to send" });
  }
};
exports.verifyUser = async (req, res) => {
  try {
    const { email, password } = req.user;

    const user = await User.findOne({ email })
      .select("-password -passwordToken")
      .lean();
    const token = jwt.sign(
      { onboarding: user.onboarding, email, password, _id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return res
      .status(200)
      .json({ msg: "Check your email for onboarding", token, user });
  } catch (e) {
    console.log(e)
    // return res.status(400).json({ msg: "Invalid User" });
  }
 };

exports.signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userInfo = await User.findOne({ email:  email.toLowerCase() }).lean();
    if (!userInfo) {
      return res.status(400).json({ msg: "Invalid User" });
    }
    if (userInfo.status > 2) {
      return res.status(400).json({ msg: "Invalid User" });
    }
    const isPassword = await bcrypt.compare(password, userInfo.password);
    if (!isPassword) return res.status(400).json({ msg: "Invalid User" });
    const token = jwt.sign(
      { onboarding: userInfo.onboarding, email, password, _id: userInfo._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    delete userInfo.password;
    delete userInfo.passwordToken;
    return res
      .status(200)
      .json({ msg: "Check your email for onboarding", token, user: userInfo });
  } catch (e) {
    console.log(e)
    return res.status(400).json({ msg: "Invalid User" });
  }
};

exports.getNumberOfPostFollowAndFollowing = async(req, res) => {
  try{
    const Post = await Blog.find({creator: req.user._id}).count().lean();
    const follower = await Follower.find({following: req.user._id}).count().lean();
    const following = await Follower.find({follower: req.user._id}).count().lean()

    return res.status(200).json({Post,follower, following})
  }catch(e){
    return res.status(400).json({msg: "Failed to get"})
  }
}

exports.getUserInfo = async(req, res) => {
  try{
    const {user} = req.query;
    const userInfo = await User.find({_id: user}).select("-password -passwordToken").lean();
    const Post = await Blog.find({creator: user}).count().lean();
    const follower = await Follower.find({following: user}).count().lean();
    const following = await Follower.find({follower: user}).count().lean()

    return res.status(200).json({Post,follower, following, user: userInfo})
  }catch(e){
    return res.status(400).json({msg: "Failed to get"})
  }
}