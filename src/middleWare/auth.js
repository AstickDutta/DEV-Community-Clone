const jwt = require("jsonwebtoken");
const blogModel = require("../Models/blogModel");
const { isValidId } = require("../validator/validations");

//===============================================| Authentication |===============================================//
const authenticate = async (req, res, next) => {
  try {
    let token = req.headers["x-api-key"] || req.headers["X-API-KEY"];


    if (!token)
      return res
        .status(401)
        .send({ status: false, msg: "token must be present" });

    jwt.verify(token, "functionup-plutonium", function (err, decoded) {
      if (err)
        return res
          .status(401)
          .send({ status: false, message: "token is invalid or expired" });


      req["decoded"] = decoded;

      next();
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//=========================================================| authorise |============================================================//

const authorise = async function (req, res, next) {
  try {
    let updateblogId = req.params.blogId;

    if (!isValidId(updateblogId)) {
      return res.status(400).send({
        status: false,
        message: "Please provide valid UserId for details",
      });
    }

    let updatingblogId = await blogModel.findById(updateblogId);
    if (!updatingblogId) {
      return res
        .status(404)
        .send({ status: false, message: "No user details found with this id" });
    }
    let matchAuthorId = updatingblogId.authorId;
    let id = req.decoded.authorId;
    if (id != matchAuthorId)
      return res.status(403).send({
        status: false,
        message: "You are not authorised to perform this task",
      });

    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports = { authenticate, authorise };
