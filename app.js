require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");

const app =express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

app.use(express.json());

async function dbConenction() {
  try {
    await mongoose.connect(process.env.URL);
    console.log("Connected");
  } catch (error) {
    console.log(error);
  }
}

dbConenction();

const User = require("./User");

app.post("/register", async (req, res) => {
  try { 

    const { username, email, password } = req.body; 
    if (!username || !email || !password) 
      return res.status(400).json({ msg: "Invalid Data" });
    
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ msg: "Account Already Exist" });
    
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      username, 
      email,
      password: hashPassword, 
      role
    });
    res.status(201).json({
      msg: "Done Created Account",
      data:user
    });

  }catch (error)  {
    console.log(error);
  }
}); 

app.post("/login", async (req, res) => {
  try { 
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Invalid Data" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Your Account Not Found   Please Craete Account" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Password" });

    res.status(200).json({
      msg: "Login Success"
    })
  
  }catch (error)  {
    console.log(error);
  }
});


app.listen(port, () => {
  console.log(`server Running At Port ${port}`);
});