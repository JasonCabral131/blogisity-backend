const multer = require("multer");
const shortid = require("shortid");
const path = require("path");


exports.validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + "-" + file.originalname);
    },
});
exports.shuffleArray =(array)  =>{
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
exports.upload = multer({ storage });