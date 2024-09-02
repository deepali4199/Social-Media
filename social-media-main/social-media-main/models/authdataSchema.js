const mongoose = require("mongoose");

const plm = require("passport-local-mongoose");



const authmodel = new mongoose.Schema({

    profileimage : {
        type : String ,
        default : "default.jpg",
    } ,

    name: {
        type : String , 
        trim: true ,
        required : [true,"name is required"] ,
        minLength: [4 , "min 4"]
    },

    username: {
        type : String , 
        trim: true ,
        unique : true,
        required : [true,"name is required"] ,
        minLength: [4 , "min 4"]
    },
    email: {
        type : String , 
        trim: true ,
        unique : true,
        lowercase : true,
        required : [true,"name is required"] ,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    password: String ,

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    
    resetPasswordToken: {
        type: Number,
        default: 0,
    },

},{
    timestamps : true
})


authmodel.plugin(plm);


const user = mongoose.model("user" , authmodel);



module.exports = user;


