const Messenge = require("./../model/Messenges");
const User = require("./../model/user");
const cloudinary = require("./../config/cloudinary");
const Follower = require("./../model/Followers");
exports.sendMessage = async(req, res) => {
    try {
        const {reciever, messenges} = req.body;
        let msgObj = {
            reciever,
            sender: req.user._id,
            messenges,
            photos: [],
            createdAt: new Date()
        }
        if(req.files){
            for(let file of req.files){
                if (process.env.production == "true") {
                    const result = await cloudinary.uploader.upload(file.path);
                    msgObj.photos = [...msgObj.photos, {url: result.secure_url, cloudinary_id:  result.public_id }]
                  } else {
                    const url = process.env.url_public_folder + file.filename;
                    msgObj.photos = [...msgObj.photos, {url, cloudinary_id:  null }]
                  }
            }
        }
        const saved = await new Messenge(msgObj).save();
        return res.status(200).json({msg: "Successfully Send", messenge: saved})
    } catch (error) {
      console.log(error)
        return res.status(400).json({msg: "Failed to messenges"})
    }
}
exports.getMessenges = async(req, res) => {
    try{
        const {reciever} = req.params;
        const user = await User.findOne({_id: reciever}).lean();
        if(user){
            const messenges = await Messenge.find({$or:[
                {
                    sender: reciever,
                    reciever: req.user._id
                },
                {
                    sender: req.user._id,
                    reciever: reciever
                }
            ]}).lean();
            return res.status(200).json({user, messenges})
        }
        return res.status(400).json({msg: "Failed to Get Messenges"})

    }catch(e){
        return res.status(400).json({msg: "Failed to Get Messenges"})
    }
}
exports.getAllWriter = async(req, res) => {
  try{
    const { page = 0} = req.query;
    User.find({onboarding: 1, _id: {$ne: req.user._id}})
      .limit(10)
      .skip(page * 10)
      .exec(function (err, writer) {
        if(err) {
          return res.status(400).json({e: err})};
        User.find({onboarding: 1, _id: {$ne: req.user._id}})
          .count()
          .exec(function (err, count) {
            return res.status(200).json({
              blog: writer,
              count,
              totalPages: Math.ceil(count / 10),
            });
          });
      });
  }catch(e){
    return res.status(400).json({msg: "failed to get writer"})
  }
   
   
}
exports.getAllFollowed = async(req, res) => {
    try{
        const {page = 0} = req.query;
        Follower.find({follower: req.user._id})
        .limit(10)
        .populate("following")
        .skip(page * 10)
        .exec(function (err, writer) {
            if(err) {
                return res.status(400).json({e: err})};
                Follower.find({follower: req.user._id})
                .count()
                .exec(function (err, count) {
                  return res.status(200).json({
                    blog: writer,
                    count,
                    totalPages: Math.ceil(count / 10),
                  });
                });
        })
    }catch(e){
        return res.status(400).json({msg: "failed to get followed user"})
    }
}