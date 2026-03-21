const mongoose= require('mongoose');

const users= new mongoose.Schema({
    email: {
        type:String,
        unique:true,
        required: true

    },

    passwordHash: {
        type: String,
        default:null
    },

    role: {
        type: String,
        required: true,
        enum: ['student','alumni']
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationStatus: {
        type :String,
        required: true,
        enum:['pending','auto_verified','manual_pending','veified','rejected']
    },

    verifcationDocUrl: {
        type: String,
        default:null
    },

    oauthProvider: {
        type: String,
        enum: ['google',null],
        default: null
    },

    isActive: {
        type: Boolean,
        default:  true
    },

    lastLoginAt: {

        type:Date,
        default:null

    }},{
        timestamps:true
    

});
Module.exports=mongoose.model('User',userSchema);