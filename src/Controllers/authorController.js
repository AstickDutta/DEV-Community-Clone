const authorModel = require("../Models/authorModel")

const {
  isValidTitle,
  isValidPassword,
  isValidName,
  isValidEmail,
  isValidBody,
} = require("../validator/validations");

const jwt = require("jsonwebtoken");

//===============================================| createAuthor |=================================================//

const createAuthor = async function (req, res) {

  try {

    let data = req.body;
    const { fname, lname, title, email, password } = data;

    if (!isValidBody(data)) {
      return res.status(400).send({
        status: false,
        msg: "Invalid request Please provide valid Author details",
      });
    }

    if (!fname) {
      res.status(400).send({
        status: false,
        msg: "The request is missing a mandatory First Name !",
      });
    }
    if (!isValidName(fname)) {
      return res.status(400).send({
        status: false,
        message: "title should be a valid format",
      });
    }

    if (!lname) {
     return res.status(400).send({
        status: false,
        msg: "The request is missing a mandatory Last Name !",
      });
    }
    if (!isValidName(lname)) {
      return res.status(400).send({
        status: false,
        message: "title should be a valid format",
      });
    }

    if (!title) {
      return res.status(400).send({
        status: false,
        message: "title is required ",
      });
    }
    if (!isValidTitle(title)) {
      return res.status(400).send({
        status: false,
        message: "title should be a valid format",
      });
    }

    if (!email)
      return res.status(400).send({
        status: false,
        msg: "The request is missing a mandatory email !",
      });
    
    if (!isValidEmail(email))
      return res.status(400).send({
        status: false,
        msg: "please use right format in your email ID",
      });
    

    let findEmail = await authorModel.findOne({email : email})

    if(findEmail){
      return res.status(400).send({
        status: false,
        msg: "Please give another email Id, email id is already present",
      })
    }
    
    if (!password) {
      return res.status(400).send({
        status: false,
        msg: "The request is missing a mandatory Password",
      });
    }

    if (isValidPassword(password)){
      return res.status(400).send({
        status: false,
        msg: "Password must contain (8-15) characters, atleast One UpperCase , One LowerCase , One Numeric Value and One Special Character.",
      })
    }

    const authorCreated = await authorModel.create(data);
    return res.status(201).send({
      status: true,
      message: "author successlly created",
      data: authorCreated,
    });

  } catch (err) {
    res.status(500).send({ msg: "server error", error: err });
  }
}

//==================================================| loginUser |=================================================//


const loginUser = async function (req, res) {
  try {
    let data = req.body;
    let {email, password} = data

    
    if (!isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "enter user details" });
    }
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "email id and password is required " });
    }

    const checkValidauthor = await authorModel.findOne({
      email: email,
      password: password,
    });

    if (!checkValidauthor) {
      return res.status(401).send({
        status: false,
        message: "Email Id or password  is not correct",
      });
    }

    
    let token = jwt.sign({ authorId: checkValidauthor._id }, "functionup-plutonium", {
      expiresIn: "24h",
    });

    res.setHeader("x-api-key", token);

    return res
      .status(200)
      .send({ status: true, message: "Successfully Login", data: token });

  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createAuthor, loginUser };
