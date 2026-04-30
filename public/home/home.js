const msgInput = document.querySelector('#msgInput');
const sendBtn = document.querySelector('.send-btn');
const userInfo = document.querySelector(".user-info");
const searchEmail = document.querySelector("#new_message");
const form = document.getElementById("searchForm");

const currentId = localStorage.getItem("userId");

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

socket.on("message", (data) => {
    renderMessage(data);
});

function renderMessage(item) {
    const messageArea = document.getElementById('messageArea');
    // messageArea.innerHTML = " ";
    const div = document.createElement("div");
        console.log("abhi ye object hai item",item)
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

sendBtn.addEventListener("click", async (e) => {
    e.preventDefault();

//     if (!window.roomName) {
//     alert("Pehle room join karo");
//     return;
// }   

   socket.emit("join-room", window.roomName);
   
    const token = localStorage.getItem('token');
    console.log("send button hit");

    const obj = {
        message: msgInput.value.trim()
    }
    try {
        const response = await axios.post("/message/newmessage",obj,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        
        // socket.emit("message", response.data.response,window.roomName); // pahle 

    socket.emit("message", {
       message: msgInput.value,
        roomName: window.roomName // ya undefined
    });

        msgInput.value = ""; // clear input

        console.log("msg received", response.data);
    } catch (error) {
        console.log(error);
    }

})



window.addEventListener("DOMContentLoaded", async (e) => {
    try {
        const response = await axios.get("/message/loadmessage");

        const messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = " ";

        const data = response.data.response;
        data.forEach((item) => {
            // renderMessage(item)
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
});





form.addEventListener("submit", search);
async function search(event) {
    event.preventDefault();

       console.log("SEARCH FUNCTION CALLED");

    const myEmail = localStorage.getItem("email");
    const email = searchEmail.value;

    const roomName = [myEmail, email].sort().join("_");

    socket.emit("join-room", roomName);

    window.roomName = roomName;
    alert("Room we join",email);

    console.log("Joined room:", roomName);
}



window.addEventListener("DOMContentLoaded", async (e) => {
   

    const responseInfo = await axios.get("/message/loadusers");
    const data = responseInfo.data.response;

        const mainul = document.querySelector(".user-list");
        mainul.innerHTML = " ";

    data.forEach((item) => {
    const secList = document.createElement('li');
    secList.className = "user-card";

    const profileDiv  = document.createElement('div');
    profileDiv.className = "profileUser";

    const userInfoDiv = document.createElement("div")
    userInfoDiv.className = "user-info";

       userInfoDiv.innerHTML = `
          <h4>${item.name}<h4/>
          <P>${item.message}<P/>
       `
       secList.appendChild(profileDiv);
       secList.appendChild(userInfoDiv);
       mainul.appendChild(secList);  
}) 
});
