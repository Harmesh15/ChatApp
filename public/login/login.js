const form = document.querySelector('form');
const email = document.getElementById("email");
const password = document.getElementById("password");


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("/user/login",{
            email: email.value,
            password: password.value
        })
        alert("login req send");
        console.log(response);
    } catch (error) {
        console.log(error)
    }
});