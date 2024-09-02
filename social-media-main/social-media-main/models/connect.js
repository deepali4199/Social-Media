const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://shivang12:Shiv4020@shivcluster.u61n5cz.mongodb.net/social?retryWrites=true&w=majority&appName=ShivCluster").then(()=>console.log("Connected!")).catch(()=>{
    console.log("not connected")
});

