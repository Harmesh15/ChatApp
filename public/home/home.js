const msgInput = document.querySelector('#msgInput');
const sendBtn = document.querySelector('.send-btn');
const userInfo = document.querySelector(".user-info");
const searchEmail = document.querySelector("#new_message");
const form = document.getElementById("searchForm");

const createGroupBtn = document.getElementById("createGroupBtn");
const groupNameInput = document.getElementById("groupNameInput");
const groupList = document.getElementById("groupList");


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


// socket.on("group-message", (data) => {
//     console.log("RECEIVED GROUP MSG:", data);
//     renderMessage(data);
// });

// socket.on("message", (data) => {
//     renderMessage(data);
// });



socket.on("group-message", (data) => {
    if (currentChat?.type !== "group") return;  // 🔥 filter
    renderMessage(data);
});

socket.on("message", (data) => {
    if (currentChat?.type !== "private") return; // 🔥 filter
    renderMessage(data);
});


function renderMessage(item) {
    const messageArea = document.getElementById('messageArea');
    // messageArea.innerHTML = " ";
    const div = document.createElement("div");
    console.log("abhi ye object hai item", item)
    if (item.userId == currentId) {
        div.className = "message sent";
    } else {
        div.className = "message received";
    }
    div.innerHTML = `
               <p>${item.message}</p>
               <span>${item.name}</span> 
               `;
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

    // socket.emit("join-room", window.roomName);

    const token = localStorage.getItem('token');

    console.log("send button hit");

    const msg = msgInput.value.trim();
    if (!msg) return; 

    try {
        const response = await axios.post("/message/newmessage", {
            message:msg,
            roomName: currentChat.id  
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (currentChat.type === "group") {
            socket.emit("group-message", {
                groupId: currentChat.id,
                message: msgInput.value
            });
        } else {
            socket.emit("message", {
                roomName: currentChat.id,
                message: msgInput.value
            });
        }
        console.log("TYPE:", currentChat.type);
        msgInput.value = ""; // clear input

        console.log("msg received", response.data);
    } catch (error) {
        console.log(error);
    }
})


//////////////////// Load Message /////////////////////////

 async function loadmessage(roomId){  

    try {
        // const response = await axios.get("/message/loadmessage");
 
    const response = await axios.get(`/message/loadmessage?room=${roomId}`);

        const messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = " ";

         response.data.response.forEach((item) => {
        
            const div = document.createElement("div");
            if (item.userId == currentId) {
                div.className = "message sent";
            } else {
                div.className = "message received";
            }
            div.innerHTML = `
               <p>${item.message}</p>
               <span>${item.chatuser.name}</span> 
               `;
            messageArea.appendChild(div);
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

function startPrivateChat(searchEmail){
    console.log("start personalchat function Called");

    const myEmail = localStorage.getItem("email");
    const email = searchEmail;

    console.log("myEmail",myEmail,"email",email);

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