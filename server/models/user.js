const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default:"https://res.cloudinary.com/killua77/image/upload/v1596099600/default_unviqa.jpg"
    },
    followers: [{type:ObjectId, ref: "User"}],
    following: [{type:ObjectId, ref: "User"}],
})

const User = mongoose.model('User',userSchema)

module.exports = {User}
// mongoose.model(name, schema)