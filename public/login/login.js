    const form = document.querySelector('form');
    const email = document.getElementById("email");
    const password = document.getElementById("password");


    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("login button clicked");
        try {
            const response = await axios.post("/user/login",{
                email: email.value,
                password: password.value
            });
            console.log("response after login",response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId",response.data.userId);
            localStorage.setItem("email",response.data.email);
            alert("login req send");
            console.log(response);
            window.location.href = "/home/home.html"
        } catch (error) {
            console.log(error.message)
        }
    });