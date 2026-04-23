const form = document.querySelector('form');
const username  = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const button = document.getElementById("button");

form.addEventListener("submit", async (e)=>
{   e.preventDefault();

    try{
        let obj = {
        username: username.value,
        email:email.value,
        phone:phone.value,
        password:password.value 
    }

    const response = await axios.post("/user/signup",obj);
    console.log(response);   
    }catch(error){
        console.log(error);
    }
})

