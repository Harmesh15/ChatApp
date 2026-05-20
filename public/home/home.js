const msgInput = document.querySelector('#msgInput');
const sendBtn = document.querySelector('.send-btn');
const userInfo = document.querySelector(".user-info");
const searchEmail = document.querySelector("#new_message");
const form = document.getElementById("searchForm");

const createGroupBtn = document.getElementById("createGroupBtn");
const groupNameInput = document.getElementById("groupNameInput");
const groupList = document.getElementById("groupList");
const fileInput = document.getElementById("fileInput");



const currentId = localStorage.getItem("userId");
let currentChat = null;

const socket = io("http://localhost:8000"
    , {
        auth: {
            token: localStorage.getItem("token")
        }
    });

socket.on("room-joined", (room) => {
    console.log("✅ Room joined confirmed:", room);
    window.roomJoined = true;
});

socket.on("connect_error", (err) => {
    console.log("Connection error:", err.message);
});




socket.on("new-group", ({ groupId, groupName }) => {
    console.log("New group received:", groupName);
    addGroupToList(groupId, groupName);
    socket.emit("join-group", groupId);
});


socket.on("group-message", (data) => {
    if (currentChat?.type !== "group") return;  // 🔥 filter
    renderMessage(data);
});

socket.on("message", (data) => {
    if (currentChat?.type !== "private") return; // 🔥 filter
    renderMessage(data);
});


// function renderMessage(data) {

//     const messageArea = document.getElementById('messageArea');
//     const div = document.createElement("div");
//     console.log("abhi ye object hai item", data)
//     if (data.userId == currentId) {
//         div.className = "message sent";
//     } else {
//         div.className = "message received";
//     }
//     div.innerHTML = `
//                <p>${data.message}</p>
//                <span>${data.name}</span> 
//                 `;

//      if (data.type && data.type.startsWith("image")) {

//         const img = document.createElement("img");
//         img.src = data.mediaUrl;
//         img.width = 200;
//         div.appendChild(img);
//     }

  
//     else if (data.type && data.type.startsWith("video")) {

//         const video = document.createElement("video");
//         video.src = data.mediaUrl;
//         video.controls = true;
//         video.width = 250;
//         div.appendChild(video);
//     }

//     else if (data.mediaUrl) {

//         const a = document.createElement("a");
//         a.href = data.mediaUrl;
//         a.innerText = "Download File";
//         a.target = "_blank";
//         div.appendChild(a);
//     }

//     messageArea.appendChild(div);
//     setTimeout(() => {
//         messageArea.scrollTop = messageArea.scrollHeight;
//     }, 50);
// }



// check render function





function renderMessage(data) {

    const messageArea = document.getElementById('messageArea');
    const div = document.createElement("div");
    console.log("abhi ye object hai item", data)
    if(!data.chatuser){
         if (data.userId == currentId) {
        div.className = "message sent";
    } else {
        div.className = "message received";
    }
    div.innerHTML = `
               <p>${data.message}</p>
               <span>${data.name}</span> 
                `;

    }else{
        if (data.userId == currentId) {
        div.className = "message sent";
    } else {
        div.className = "message received";
    }
    div.innerHTML = `
               <p>${data.message}</p>
               <span>${data.chatuser.name}</span> 
               
                `;
    }
    
     if (data.type && data.type.startsWith("image")) {

        const img = document.createElement("img");
        img.src = data.mediaUrl;
        img.width = 200;
        div.appendChild(img);
    }

  
    else if (data.type && data.type.startsWith("video")) {

        const video = document.createElement("video");
        video.src = data.mediaUrl;
        video.controls = true;
        video.width = 250;
        div.appendChild(video);
    }

    else if (data.mediaUrl) {

        const a = document.createElement("a");
        a.href = data.mediaUrl;
        a.innerText = "Download File";
        a.target = "_blank";
        div.appendChild(a);
    }

    messageArea.appendChild(div);
    setTimeout(() => {
        messageArea.scrollTop = messageArea.scrollHeight;
    }, 50);
}
































//////////////// send button event//////////////////////////////////

sendBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!currentChat) {
        alert("Select chatType first");
        return;
    }
    
    const token = localStorage.getItem('token');

    const file = fileInput.files[0];
     let fileData = null;
     let url = null;
     let type = null;
     
     if(file){
       fileData  = await sendFileData();
       url = fileData.data.fileUrl;
       type = file.type
       console.log(fileData);
     }

    const msg = msgInput.value.trim();
    console.log("file url is ",url);
    // if (msg) {
        const response = await axios.post("/message/newmessage", {
            message: msg,
            roomName: currentChat.id,
            mediaUrl:url,
            type
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    // }    
        console.log({
           mediaUrl: url,
           type: type
        });

        if (currentChat.type === "group") {
            socket.emit("group-message", {
                groupId: currentChat.id,
                message: msgInput.value,
                mediaUrl:url,
                type
            });
        } else {
            socket.emit("message", {
                roomName: currentChat.id,
                message: msgInput.value,
                mediaUrl:url,
                type
            });
        }
        console.log("TYPE:", currentChat.type);
        msgInput.value = ""; // clear input

        // console.log("msg received", response.data);
    // } catch (error) {
    //     console.log(error);
    // }

})


// for upload media to s3 bucket 
async function sendFileData() {
     sendBtn.innerText = "Uploading...";

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("media", file);
    const res = await axios.post("/media/upload", formData);

    fileInput.value = "";
    sendBtn.innerText = "Send";
    return res;

}


//////////////////// Load Message /////////////////////////


async function loadmessage(roomId) {

    try {
        // const response = await axios.get("/message/loadmessage");

        const response = await axios.get(`/message/loadmessage?room=${roomId}`);

        const messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = " ";

        response.data.response.forEach((data) => {

            //  console.log("reload data",item);
            // const div = document.createElement("div");
            // if (item.userId == currentId) {
            //     div.className = "message sent";
            // } else {
            //     div.className = "message received";
            // }
            // div.innerHTML = `
            //    <p>${item.message}</p>
            //    <span>${item.chatuser.name}</span> 
            //    `;
            // messageArea.appendChild(div);


            renderMessage(data);











        })
    } catch (error) {
        console.log(error);
    }
};



///////////////// Load Users ///////////////////////////////

window.addEventListener("DOMContentLoaded", async (e) => {

    const responseInfo = await axios.get("/message/loadusers");
    const data = responseInfo.data.response;

    const mainul = document.querySelector(".user-list");
    mainul.innerHTML = " ";

    data.forEach((item) => {
        const secList = document.createElement('li');
        secList.className = "user-card";

        const profileDiv = document.createElement('div');
        profileDiv.className = "profileUser";

        const userInfoDiv = document.createElement("div")
        userInfoDiv.className = "user-info";

        userInfoDiv.innerHTML = `
          <h4>${item.name}<h4/>
          <P>${item.message}<P/>
       `
        secList.addEventListener("click", () => {
            startPrivateChat(item.email);
        });

        secList.appendChild(profileDiv);
        secList.appendChild(userInfoDiv);
        mainul.appendChild(secList);
    })
});






////////////////////////// Personal chat function //////////////////////////////

function startPrivateChat(searchEmail) {
    console.log("start personalchat function Called");

    const myEmail = localStorage.getItem("email");
    const email = searchEmail;

    console.log("myEmail", myEmail, "email", email);

    const roomName = [myEmail, email].sort().join("_");

    localStorage.setItem("lastRoom", roomName);

    console.log(roomName)

    socket.emit("join-room", roomName);

    currentChat = {
        type: "private",
        id: roomName
    };

    // window.roomName = roomName;
    alert("Room we join", email);

    loadmessage(roomName);
    console.log("Joined room:", roomName);
}


////////////////// group chat /////////////////////////////

function openGroup(groupId) {

    socket.emit("join-group", groupId);

    currentChat = {
        type: "group",
        id: groupId
    };

    console.log("Opened group:", groupId);

    loadmessage(groupId);
}


// function createGroup() {
//     const groupId = "grp_" + Date.now(); // unique id

//     socket.emit("create-group", {
//         groupId
//     });

//     console.log("Group created:", groupId);
// }



//////////////////  Create Group /////////////////////////

createGroupBtn.addEventListener("click", () => {

    const groupName = groupNameInput.value.trim();

    if (!groupName) {
        alert("Enter group name");
        return;
    }

    // unique groupId
    const groupId = "grp_" + Date.now();

    // backend ko bata
    socket.emit("create-group", {
        groupId,
        groupName
    });

    // current chat set
    currentChat = {
        type: "group",
        id: groupId
    };

    console.log("Group created:", groupId);

    // UI me add karo
    // openGroup(groupId);

    // input clear
    groupNameInput.value = "";
});


function addGroupToList(groupId, groupName) {

    if (document.getElementById(groupId)) return;

    const li = document.createElement("li");
    li.innerHTML = groupName;
    li.className = "group-item";
    li.id = groupId;

    // click pe group open
    li.addEventListener("click", () => {
        openGroup(groupId);
    });
    groupList.appendChild(li);
}




// async function uploadMedia() {

//     const formData = new FormData();
//     formData.append("media", file);

//     const res = await axios.post("/media/upload",formData);

//     const fileUrl = res.data.fileUrl;

//     socket.emit("send_message", {
//         roomName,
//         mediaUrl: fileUrl,
//         sender: userName,
//         type: file.type,
//     });
// }



// socket.on("receive_message", (data) => {

//     const div = document.createElement("div");

//     if (data.type.startsWith("image")) {

//         div.innerHTML = `
//       <img src="${data.mediaUrl}" width="200"/>
//     `;

//     } else if (data.type.startsWith("video")) {

//         div.innerHTML = `
//       <video controls width="250">
//         <source src="${data.mediaUrl}">
//       </video>
//     `;

//     } else {

//         div.innerHTML = `
//       <a href="${data.mediaUrl}" target="_blank">
//         Download File
//       </a>
//     `;
//     }

//     messages.appendChild(div);
// });














///////////////////////////////////////// chek //////////////////////////////////////







// sendBtn.addEventListener("click", async () => {

//     const message = msgInput.value;
//     let mediaUrl = null;
//     let type = null;

//     // FILE UPLOAD
//     if (file) {

//         const formData = new FormData();

//         formData.append("media", file);

//         const res = await axios.post("/media/upload", formData);

//         mediaUrl = res.data.fileUrl;
//         type = file.type;
//     }

//     // SOCKET EMIT
//     socket.emit("send_message", {
//         roomName: currentRoom,
//         sender: "Aman",
//         message,
//         mediaUrl,
//         type,
//     });

//     msgInput.value = "";
//     fileInput.value = "";
// });
