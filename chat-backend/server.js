// server.js is used to manage the server(Backend)

//importing express and instantiate the express
const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes')
const User = require('./models/User');
const Message = require('./models/Message')

//Adding rooms in the chatapp
const rooms = ['general', 'tech', 'finance', 'crypto'];
const cors = require('cors');

//To recieve data from the frontend we are encoding it here
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//we use cors() here for frontend and backend communication 
app.use(cors());

app.use('/users', userRoutes)
require('./connection')

//creating the server
const server = require('http').createServer(app);

//creating the port
const PORT = 5001;

//For client server communication we do require socket.io we intialize it here
const io = require('socket.io')(server, {
  cors: {
    //giving the client url and port for establishing the communication
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// To fetchthe messages in the room
async function getLastMessagesFromRoom(room){
  let roomMessages = await Message.aggregate([
    {$match: {to: room}},
    {$group: {_id: '$date', messagesByDate: {$push: '$$ROOT'}}}
  ])
  return roomMessages;
}

// To sort the messages by latest date 
function sortRoomMessagesByDate(messages){
  return messages.sort(function(a, b){
    let date1 = a._id.split('/');
    let date2 = b._id.split('/');

    date1 = date1[2] + date1[0] + date1[1]
    date2 =  date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1
  })
}

// socket connection

io.on('connection', (socket)=> {

  socket.on('new-user', async ()=> {
    const members = await User.find();
    io.emit('new-user', members)
  })

  //Use socket.io to join the room and share messages in it

  socket.on('join-room', async(newRoom, previousRoom)=> {
    socket.join(newRoom);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessagesFromRoom(newRoom);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    socket.emit('room-messages', roomMessages)
  })

  socket.on('message-room', async(room, content, sender, time, date) => {
    const newMessage = await Message.create({content, from: sender, time, date, to: room});
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // sending message to room
    io.to(room).emit('room-messages', roomMessages);
    socket.broadcast.emit('notifications', room)
  })

  // To handle when the user logout and reset the status to offline 
  app.delete('/logout', async(req, res)=> {
    try {
      const {_id, newMessages} = req.body;
      const user = await User.findById(_id);
      user.status = "offline";
      user.newMessages = newMessages;
      await user.save();
      const members = await User.find();
      socket.broadcast.emit('new-user', members);
      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(400).send()
    }
  })

})


app.get('/rooms', (req, res)=> {
  res.json(rooms)
})

//To acknowledge and print the port whether it is connected or not in console.
server.listen(PORT, ()=> {
  console.log('listening to port', PORT)
})
