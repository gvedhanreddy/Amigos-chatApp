const mongoose = require('mongoose');

//model for chat message in mongodb database
const MessageSchema = new mongoose.Schema({
  content: String,
  from: Object,
  socketid: String,
  time: String,
  date: String,
  to: String
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message
