







const mongoose=require('mongoose');

const{Schema}= mongoose;


const UserSchema=new Schema({

    name:{
        type:String,
        required:true

    },

   email:{
        type:String,
        required:true,
        unique:true

    },
  //   phone: {
  //     type: String,
  //     required: false,
  //     unique: true,
  //     sparse: true,
  //     default: null
  // },
  password: {
    type: String,
  },
  
  googleId: {
    type: String,
    required: false,
    default: undefined,
    unique: true,
    sparse: true
},
    isBlocked:{
        type:Boolean,
        default:false
   },
   isActive:{
     type:Boolean,
     default:false
   },
   
   isAdmin:{
    type:Boolean,
    default:false
  }
   
   ,
   cart:[{
    type:Schema.Types.ObjectId,
    ref:"Cart"
   }],
   wallet:{
    type:Number,
    default:0
   },
  wishlist:[{
    type:Schema.Types.ObjectId,
    ref:"wishlist"

  }],
  orderHistory:[{
    type:Schema.Types.ObjectId,
    ref:"order"
  }],
  createdOn:{
    type:Date,
    Default:Date.now,
  },
  referalcode:{
    type:String,

  },
  redeemed:{
    type:Boolean,
  },
  redeemedUsers:[{
  type:String,
  ref:"user"

  }],
  searchHistory:[{
     category:{
      type:Schema.Types.ObjectId,
      ref:"category"
    },
    brand:{
      type:String,
    },
   searchOn:{
     type:Date,
    default:Date.now
  },
}]

})

// UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });

const User=mongoose.model("user",UserSchema)
module.exports=User