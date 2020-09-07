var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var http = require("http")
var socketio = require("socket.io");
var querystring = require("querystring");

const PORT = 3000;
var app = express();
const server = http.createServer(app);
var io = socketio(server);

app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    var fileUrl = path.join(__dirname,"public","index.html");
    res.sendFile(fileUrl);
});


app.post("/home",(req,res)=>{
    var username = req.body.username;
    var tmp = querystring.stringify({username:username})
    res.redirect("/chat/"+ tmp);
})

app.get("/chat/:username",(req,res)=>{
    var fileUrl = path.join(__dirname,"public","chat.html");
    res.sendFile(fileUrl);
})

io.on('connection',(socket)=>{
    socket.on("joinRoom",(data)=>{
        console.log(data);
        socket.emit("welcomeUser","Welcome to the Room");
    })
    socket.on("disconnection",()=>{
        console.log("User has left the room");
    })
})


app.listen(PORT,(err)=>{
    if(!err){
        console.log(`Server is running at PORT ${PORT}`);
    }
});