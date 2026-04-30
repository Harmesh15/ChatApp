const chatusers = require("../models/chatusers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { messages } = require("../models");

const signupcheck = async (req, res) => {
  console.log("signup api hit");
  try {
    const { username, phone, email, password } = req.body;
    console.log(req.body)

    if (!username || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const response = await chatusers.create({
      name: username,
      email: email,
      password: hashPass,
      phone: phone
    });

    res.status(201).json({ message: "new user created", data: response });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

const loginuser = async (req, res) => {
  console.log("Login Api hit")
    try{
     const { password, email } = req.body;
       if (!email || !password) {
       return res.status(400).json({ message: "All field required" });
    }

    const user = await chatusers.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) return res.status(404).json({ message: "invalid user" })

    const token = jwt.sign({ userId: user.id }, "secretkey", { expiresIn: "1h" });
    const userId = user.id;
    
    return res.status(200).json({ message: "login successfully", token,userId,email:user.email});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}


module.exports = { signupcheck, loginuser};