const mongoose = require("mongoose");


// const plm = require("passport-local-mongoose")


const postSchema = new mongoose.Schema({
    title : {
        type :  String,
        trim : true , 
        required : [true , " title is required"],
        minLength: [4, "Title must be atleast 4 characters long"],
    } ,
    media : {
        type : String , 
        required: [true, "Media is required"],
    } , 
    user :{type  : mongoose.Schema.Types.ObjectID , ref: "user"},
    likes : [{ type :mongoose.Schema.Types.ObjectId , ref: "user"}]
},
    { timestamps: true 
})

// authmodel.plugin(plm);


const Post1 = mongoose.model("post", postSchema);

module.exports = Post1;