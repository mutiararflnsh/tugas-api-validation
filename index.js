const express = require("express");
const {body, validationResult} = require("express-validator");
const registerValidator = require('./middlewares/register-validator');
const loginValidator = require("./middlewares/login-validator");
const errorHandlerMiddleware = require("./middlewares/error-handling")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { USERS, SECRET_KEY } = require("./items");

const app = express();

app.use(express.json());

app.get('/users', (req, res ) =>{
    return res.json({
        data: USERS.map((item) => {
          delete item.password;
          return item;
        }),
      });
})

app.post('/auth/register', 
    registerValidator,
    (req, res) => {
        /*const validateResult = validationResult(req);
        if(!validateResult.isEmpty()){
            return res.status(400).json({
                status: "failed",
                message: "Validation Error",
                error: validateResult.array()
            })
        }*/

    validationResult(req).throw()
    const password = req.body.password;

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      id: USERS.length + 1,
      ...req.body,
      password: hashPassword,
    };
  
    USERS.push({ ...newUser });
    delete newUser.password;
  
    return res.status(200).json
    ({ status: "Registration success",
        data: newUser 
    });
})


app.post('/auth/login', loginValidator, (req, res) => {
    const body = req.body;

    /*const validateResult = validationResult(req);
        if(!validateResult.isEmpty()){
            return res.status(400).json({
                status: "failed",
                message: "Validation Error",
                error: validateResult.array()
            })
        } */

    validationResult(req).throw()

    const { email, password } = req.body;

    const users = USERS.filter((item) => item.email === email);
    if (!users.length) {
      return res
        .status(401)
        .json({ status: "failed", message: "Login failed, invalid username or password" });
    }
  
    const user = users[0];
    const savedPassword = user.password;
    const isMatch = bcrypt.compareSync(password, savedPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "failed", message: "Login failed, invalid username or password" });
    }
  
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
    const data = { ...user };
    delete data.password;
    data.token = token;
  
    return res.status(200).json
    ({
      status: "Login success",
      data,
    });
})

app.get('/users/:userId', (req, res ) =>{
    const requestedUserId = parseInt(req.params.userId);
    const loggedInUser = req.user; 

  
    const user = USERS.find((item) => item.id === requestedUserId);

 
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }


    if (loggedInUser && user.id !== loggedInUser.id) {
      delete user.password;
    }

    return res.json({
      data: user,
    });
})

app.use(errorHandlerMiddleware)

app.listen(1945, () => {
    console.log(`app start at http://localhost:1945`)
})