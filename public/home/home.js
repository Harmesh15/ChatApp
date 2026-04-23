const msgInput = document.querySelector('#msgInput');
const sendBtn = document.querySelector('.send-btn');
// const receivemsg = document.querySelector(".message received");
// const sendmsg = document.querySelector(".message send");

const socket = io("http://localhost:8000"
    ,{
    auth:{
        token:localStorage.getItem("token")
    }
});

console.log("TOKEN:", localStorage.getItem("token"));
const currentId = localStorage.getItem("userId");


socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

socket.on("receive_message", (message) => {
  console.log("received:", message);
  renderMessage(message);
});


sendBtn.addEventListener("click", async (e)=>{
    e.preventDefault();

    const token = localStorage.getItem('token');
    console.log("send button hit");
    
    const obj = {
        message:msgInput.value    
    }
    try{
        const response = await axios.post("/message/newmessage", obj,
             {
              headers: {
              Authorization: `Bearer ${token}`
          }
      });
     socket.emit("send_message", response.data.response); 
     msgInput.value = ""; // clear input

console.log("msg received",response.data);
    }catch(error){
        console.log(error);
    }
})     


function renderMessage(item) {
    const messageArea = document.getElementById('messageArea');
    // messageArea.innerHTML = " ";
    console.log("render function run")

            const div = document.createElement("div");
             
            if(item.userId == currentId){
                div.className = "message received";
            }else{
                div.className = "message sent";
            }
            div.innerHTML = `
               <p>${item.message}</p>
               <span>${item.name}</span> 
               `;
            messageArea.appendChild(div); 

}



window.addEventListener("DOMContentLoaded", async (e) => { 
  console.log("hit message load api");
      try{
        const response = await axios.get("/message/loadmessage");
  
        const messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = " ";

        const data = response.data.response;
           data.forEach((item)=>{
            console.log(item);
            // renderMessage(item)
            const div = document.createElement("div");
             
            if(item.userId == currentId){
                div.className = "message sent";
            }else{
                div.className = "message received";
            }
            div.innerHTML = `
               <p>${item.message}</p>
               <span>${item.chatuser.name}</span> 
               `;
            messageArea.appendChild(div); 
        })
    }catch(error){
        console.log(error);
    }
});



// const currentUserId = localStorage.getItem("userId");

// socket.on("receive_message", (data) => {
//   const div = document.createElement("div");

//   if (data.senderId == currentUserId) {
//     div.innerText = `You: ${data.text}`;
//     div.style.textAlign = "right";
//   } else {
//     div.innerText = `${data.senderName}: ${data.text}`;
//     div.style.textAlign = "left";
//   }

//   document.body.appendChild(div);
// });

 