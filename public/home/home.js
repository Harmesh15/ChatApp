const msgInput = document.getElementById('msgInput');
const sendBtn = document.querySelector('.send-btn');
const messageArea = document.getElementById('messageArea');

sendBtn.addEventListener("click", async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(token);

   const obj = {
  message: msgInput.value
   };

    try{
        const response = await axios.post(
            "/user/message", obj,
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