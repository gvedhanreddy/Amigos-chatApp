const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

//Creating the  user schema in mongoose

const UserSchema = new mongoose.Schema({
  ////schema for user name in mongodb
  name: {
    type: String,
    required: [true, "Can't be blank"]
  },
  //schema for email in mongodb
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Can't be blank"],
    index: true,
    validate: [isEmail, "invalid email"]
  },
  //schema for password in mongodb
  password: {
    type: String,
    required: [true, "Can't be blank"]
  },
  //schema for image in mongodb
  picture: {
    type: String,
  },
  //schema for messages in mongodb
  newMessages: {
    type: Object,
    default: {}
  },
  //schema for status of the user in mongodb
  status: {
    type: String,
    default: 'online'
  }
}, {minimize: false});

//To hashing the user passsword before it is saved to database
UserSchema.pre('save', function(next){
  const user = this;
  if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) return next(err);

      user.password = hash
      next();
    })

  })

})

//to avoid sending the user password we use this function
UserSchema.methods.toJSON = function(){
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

//function to validate the user credentials by verifying it from the database
UserSchema.statics.findByCredentials = async function(email, password) {
  const user = await User.findOne({email});
  if(!user) throw new Error('invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) throw new Error('invalid email or password')
  return user
}


const User = mongoose.model('User', UserSchema);

module.exports = User
