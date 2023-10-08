const express=require('express');
const mongoose=require('mongoose');

const ImageSchema=new mongoose.Schema({
    
    img:{
        type:String,
        required:true,
    },
})
module.exports=mongoose.model("Image",ImageSchema);