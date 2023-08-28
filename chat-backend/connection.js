//importing and using mongoose to connect to the database 

const mongoose = require('mongoose');
require('dotenv').config();

// Adding the credentials for establishing the connection with database
mongoose.connect('mongodb+srv://chatappadmin:g3qWsiaDf4jfTYe7@cluster0.mr4ydqg.mongodb.net/?retryWrites=true&w=majority',()=>{
  console.log('Connected to MongoDB Server')
}
)

//Suicide squad credentials

//mongoose.connect('mongodb+srv://chatadmin:aLdKUBDWJeVMrfGg@cluster0.gxpk7a0.mongodb.net/?retryWrites=true&w=majority',()=>{
//console.log('Connected to MongoDB')
//}
//)

//Encrypt password

//mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.s11qz.mongodb.net/chatAppMern?retryWrites=true&w=majority`, ()=> {
//console.log('connected to mongodb')
//})
