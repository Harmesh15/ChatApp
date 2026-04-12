const msgInput = document.querySelector('#msgInput');
const sendBtn = document.querySelector('.send-btn');
const receivemsg = document.getElementsByClassName("message received");
const sendmsg = document.getElementsByClassName("message send");
const socket = io();


socket.on("message", (message) => {
      renderMessage(message);
}); 


// sendBtn.addEventListener("click", ()=>{
//     socket.emit("send_message", {
//         message:msgInput.value,
//     });
//    msgInput.innerHTML = " ";
// });

sendBtn.addEventListener("click", async (e)=>{
    e.preventDefault();

    const token = localStorage.getItem('token');     

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

console.log("msg received",response);
    }catch(error){
        console.log(error);
    }
})     



function renderMessage(item) {
    const messageArea = document.getElementById('messageArea');
    // messageArea.innerHTML = " ";

    const div = document.createElement("div");

    if(item.userId == 3){
        div.className = "message sent";
    } else {
        div.className = "message received";
    }
    div.innerHTML = `
       <p>${item.message}</p>
       <span>${item.userId}</span> 
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

            // renderMessage(item);
            const div = document.createElement("div");
             
            if(item.userId == 3){
                div.className = "message sent";
            }else{
                div.className = "message received";
            }
            div.innerHTML = `
               <p>${item.message}</p>
               <span>${item.createdAt,item.userId}</span> 
               `;
            messageArea.appendChild(div); 
        })
    }catch(error){
        console.log(error);
    }
});


