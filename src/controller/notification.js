const Notification = require("./../model/Notification");

exports.createComment = async(req, res) => {
    try{
        const {message, url, reciever} = req.body;
        
        const saved = await new Notification({
            message,
            url,
            reciever,
            sender: req.user._id
        }).save();
        if(saved){
            return res.status(200).json({msg: "Successfully Created", notification: saved});
        }
        return res.status(400).json({msg: "Failed to created"})
    }catch(e){
        return res.status(400).json({msg: "Failed to created"})
    }
}