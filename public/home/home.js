const msgInput = document.getElementById('msgInput');
const sendBtn = document.querySelector('.send-btn');
const messageArea = document.getElementById('messageArea');
const receivemsg = document.getElementsByClassName("message received");
const sendmsg = document.getElementsByClassName("message send");

sendBtn.addEventListener("click", async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(token);

   const obj = {
  message: msgInput.value
   };

    try{
        const response = await axios.post(
            "/message/newmessage", obj,
             {
              headers: {
              Authorization: `Bearer ${token}`
          }
      }
);
     console.log(response);
    }catch(error){
        console.log(error);
    }
})



window.addEventListener("DOMContentLoaded", async () => {
  console.log("hit message load api");
      try{
        const response = await axios.get("/message/loadmessage");
        
        const data = response.data;
        if(data){
           data.fetchmessages.forEach((item)=>{
            messageArea.innerHTML = " ";
            
            const massageDiv = document.createElement("div");
           massageDiv.innerHTML = item.message;
           console.log(item);
           messageArea.appendChild(massageDiv);
           });
        }else{
            console.log("not true")
        }
        // msgs.forEach((item)=>{
        //     messageArea.innerHtml = " ";
        //   const div = createElement  
    }catch(error){
        console.log(error);
    }

});
 