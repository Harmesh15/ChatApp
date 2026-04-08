const form = document.querySelector('form');
const email = document.getElementById("email");
const password = document.getElementById("password");


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("/user/login",{
            email: email.value,
            password: password.value
        });

        localStorage.setItem("token", response.data.token);
        alert("login req send");
        console.log(response);
        window.location.href = "../home/home.html"
    } catch (error) {
        console.log(error)
    }
});