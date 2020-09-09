// alert("hello");

var chatForm = document.getElementById("chatForm");
var chatMsg = document.getElementById("chatMsg");
var chatMessagesDiv = document.getElementById("chatMessagesDiv");
var participantsList = document.getElementById("participantsList");

// console.log(Qs.parse(location.search));
var userObject=Qs.parse(location.search,{ignoreQueryPrefix: true});
var userName = userObject.userName;
var roomName = userObject.roomName;
console.log("Username : ",userName);

const socket = io();
socket.emit("joinRoom", {userName:userName, roomName:roomName});
socket.on("welcomeUser", (msg)=>{
    chatMessagesDiv.innerHTML += `<h3 class='title' style="color:black;">${msg}</h3>`;
})

socket.on("chatMsg", (obj)=>{
    console.log(obj);
    formatMsg(obj);
})

socket.on("modifyUserJoinnMsg", (obj)=>{
    var paraElement = document.createElement("p");
    var str=obj.userName+" "+obj.message;
    var pTextNode = document.createTextNode(str);
    paraElement.appendChild(pTextNode);
    chatMessagesDiv.appendChild(paraElement);
})

socket.on("modifyUsersList", (usersArr)=>{
    participantsList.innerHTML="";
    for(var i=0; i<usersArr.length; i++)
    {
        var str =`<div class="media w-50 mb-3 p-info"><img src="images/user.jpg" alt="user" width="50" class="rounded-circle">
        <div class="media-body ml-3">
          <p class="small text-muted">${usersArr[i].userName}</p>
        </div>
      </div>`;
        
        var liElement = document.createElement("li");
        // var user = usersArr[i].userName;
        // var liTextNode = document.createTextNode(user);
        // liElement.appendChild(liTextNode);
        liElement.innerHTML=str;
        participantsList.appendChild(liElement);
    }
})

function formatMsg(obj)
{
    var paraElement = document.createElement("div");
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    var day = today.toLocaleString('default', { month: 'short' })+' '+today.getDate();
    var str =`<div class="media w-50 mb-3"><img src="images/user.jpg" alt="user" width="50" class="rounded-circle">
    <div class="media-body ml-3">
      <div class="bg-light rounded py-2 px-3 mb-2">
        <p class="text-small mb-0 text-muted">${obj.message}</p>
      </div>
      <p class="small text-muted">${time} | ${day} | By ${obj.userName}</p>
    </div>
  </div>`;

    // var str=obj.userName+" : "+obj.message;
    // var pTextNode = document.createTextNode(str);
    // paraElement.appendChild(pTextNode);
    paraElement.innerHTML = str;
    chatMessagesDiv.appendChild(paraElement);
    
}

function sendMessageEventHandeler()
{
    socket.emit("message", {message:chatMsg.value, userName:userName, roomName:roomName});
}