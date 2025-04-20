const mongoose=requir('mongoose');
const{Schema}=mongoose

const addressScheme=new Schema[{
    userId:{
        type:Schema.Type.ObectId,
        ref:"user",
        required:true
    },
    address:[{
      address:{
        Type:String,
      required:true,
      },
      name:{
        type:String,
        required:true
      },
      city:{
        type:String,
        required:true,
      },
     state:{
        type:String,
        required:true,
      },
      country:{
        type:String,
        required:true,
      },


      landMark:{
        type:String,
        required:true,
    },
    flatNumber:{
        type:Number,
        required:true
    },
    
    pincode:{
        type:Number,
        required:true
    },

    phone:{
        type:Number,
        required:true
    },


    }]

}]


const Address=mongoose.model("Address",addressScheme)
module.exports=Address;