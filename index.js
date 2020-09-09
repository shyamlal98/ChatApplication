var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var http = require("http");
var socketio = require("socket.io");
var queryString = require("querystring");

var userObj = require("./utils/usersInfo");
var msgObj = require("./utils/messageManagement");

const PORT = 4000;

var app = express();
const server=http.createServer(app);
var io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response)=>{
    var fileUrl = path.join(__dirname, "public", "index.html");
    response.sendFile(fileUrl);
})

app.post("/home", (request, response)=>{
    var userName=request.body.userName;
    var roomName=request.body.roomName;
    // console.log(request.body);
    var temp=queryString.stringify({userName:userName, roomName:roomName});
    response.redirect("/chat?"+temp);
})

app.get("/chat", (request, response)=>{
    var fileUrl = path.join(__dirname, "public", "chat.html");
    response.sendFile(fileUrl);
})

//when a new user joins the chat
io.on("connection", function (socket){
    //when a new user joining in
    socket.on("joinRoom", function (data){
        socket.join(data.roomName);
        console.log(data);
        var obj={userName:data.userName, message:" has joined the room", roomName:data.roomName}
        userObj.newUserJoin(socket.id, data.userName, data.roomName, socket, obj, io);
        // msgObj.postMessage(obj);
        // 

        // userObj.getAllUsers(data.roomName, (p1)=>{
        //     if(p1.length==0)
        //     {
        //         console.log("No users in the room");
        //     }
        //     else
        //     {
        //         if(p1[0].error)
        //         {
        //             console.log(p1[0].error);
        //         }
        //         else
        //         {
        //             io.to(obj.roomName).emit("modifyUsersList", p1);
        //         }
        //     }
        // });
        // io.to(data.roomName).emit("modifyUsersList", usersArr);
    })

    socket.on("disconnect", ()=>{
        console.log("User has left the room");
        userObj.removeUser(socket.id, socket);
    })

    socket.on("message", (obj)=>{
        console.log("Message Recieved", obj);
        msgObj.postMessage(obj);
        io.to(obj.roomName).emit("chatMsg", obj);
        console.log("All messages",msgObj.getAllMessages());

        console.log("All users in the room : ");
        userObj.getAllUsers(obj.roomName, (p1)=>{
            if(p1.length==0)
            {
                console.log("No users in the room");
            }
            else
            {
                if(p1[0].error)
                {
                    console.log(p1[0].error);
                }
                else
                {
                    io.to(obj.roomName).emit("modifyUsersList", p1);
                }
            }
        });
        
    })
})

server.listen(PORT, (err)=>{
    if(!err)
    {
        console.log(`Server running at PORT ${PORT}`);
    }
})
