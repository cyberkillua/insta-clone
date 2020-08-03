const express = require("express");
const router = express.Router();
const { Post } = require("../models/posts");
const verifyLogin = require("../middleware/verifyLogin")

router.get("/allpost", verifyLogin, (req, res)=> {
   
    Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(post => {
        res.json({post})
    }).catch(err=>{
        console.log(err)
    })
})
router.get("/followedpost", verifyLogin, (req, res)=> {
   
    Post.find({postedBy:{$in: req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(post => {
        res.json({post})
    }).catch(err=>{
        console.log(err)
    })
})

router.post("/createpost", verifyLogin, (req, res)=> {
    const{title, body, pic} = req.body
    if(!title || !body || !pic){
        return res.status(422).json({error: "Please fill in all the fields" })
    }
  
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({post:result})
    }).catch(err=>{
        console.log(err)
    })
})

router.get("/mypost", verifyLogin, (req, res)=> {
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost => {
        res.json({mypost})
    }).catch(err=> {
        console.log(err)
    })
})

router.put("/like", verifyLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    }, {
        new:true
    })
    .populate("comments.postedBy", "_id name")
    .exec((err, result)=>{
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put("/unlike", verifyLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    }, {
        new:true
    })
    .populate("comments.postedBy", "_id name")
    .exec((err, result)=>{
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put("/comment", verifyLogin, (req, res)=>{
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments:comment}
    }, {
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err, result)=>{
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.delete("/delete/:postId", verifyLogin, (req, res)=> {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err, post) => {
        if(err | !post){
            res.status(422).json({error:err})
        }if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
})

router.delete("/deletecomment/:postId", verifyLogin, (req, res)=> {
    Post.findOneAndUpdate(
        {"comments._id":  req.params.postId},  {
            $pull:{'comments': {_id:  req.params.postId }}
            // $pull: { fruits: { $in: [ "apples", "oranges" ]
        }, {
            new:true
        }
    )
    .populate("comments.postedBy","_id")
     .exec((err, result)=>{
        if(err){
            res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
})







module.exports = router