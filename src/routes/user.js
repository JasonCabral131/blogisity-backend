const router = require("express").Router();
const { getPublishedOwner } = require("../controller/blog");
const { authenticator } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/common.middleware");
const {
  gets,
  Update,
  Delete,
  get,
  Create,
  signup,
  resendVerificationEmail,
  emailVerification,
  verifyUser,
  signInUser,
  ChangeUserProfile,
  ChangeUserBackGroundProfile,
  viewWriter,
  getPublishedWriter,
  followUnFollowUser
} = require("./../controller/User");
router.get("/", gets);
router.post("/:id", Update);
router.delete("/:id", Delete);
router.put("/", Create);
router.get("/info/:id", get);
router.put("/sign-up", signup);
router.get("/published", authenticator, getPublishedOwner);
router.get("/resent-email-verfication", authenticator, resendVerificationEmail);
router.put("/verify-user-email-address", emailVerification);
router.get("/verify-user", authenticator, verifyUser);
router.put("/sign-in", signInUser);
router.put("/change-profile", authenticator, upload.single("file") ,ChangeUserProfile);
router.put("/change-background-profile", authenticator, upload.single("file"),ChangeUserBackGroundProfile);
router.get("/view-writer/:id", viewWriter)
router.get("/view-writer-published/:id", getPublishedWriter)
router.put("/follow-unfollow", authenticator, followUnFollowUser)
module.exports = router;
