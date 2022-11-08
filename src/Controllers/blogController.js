const blogModel = require("../Models/blogModel");
const mongoose = require("mongoose");
const {
  isValidBody,
  isValidName,
  isValidId,
} = require("../validator/validations");
const authorModel = require("../Models/authorModel");

//===============================================| createBlog |=====================================================//

const createBlog = async function (req, res) {
  try {
    let data = req.body;
    let { title, body, authorId, category, subcategory } = data;

    if (!isValidBody(data)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request Please provide valid blog details",
      });
    }

    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: " title is required " });
    }
    if (!isValidName(title)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide a valid title" });
    }
    if (!body) {
      return res
        .status(400)
        .send({ status: false, message: "body is required " });
    }
    if (!isValidName(body)) {
      return (400).send({
        status: false,
        message: "please provide a valid body",
      });
    }
    if (!authorId) {
      return res
        .status(400)
        .send({ status: false, message: " authorId is required " });
    }

    if (!isValidId(authorId)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide a valid authorId " });
    }

    let checkAuthorId = await authorModel.findById({ _id: authorId });
    if (!checkAuthorId) {
      return res
        .status(404)
        .send({ status: false, message: "Not found authorId" });
    }

    if (!category) {
      return res
        .status(400)
        .send({ status: false, message: " category is required" });
    }

    if (!isValidName(category)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid category" });
    }

    if (!isValidName(subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid subcategory" });
    }

    let blogCreated = await blogModel.create(data);
    return res.status(201).send({
      status: true,
      message: "Blog created succussfully",
      data: blogCreated,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//================================================| getBlogs |======================================================//

const getBlogs = async function (req, res) {
  try {
    let obj = { isDeleted: false, isPublished: true };
    let { authorId, category, tags, subcategory: subcategory } = req.query;

    if (authorId) {
      obj[authorId] = authorId;
    }
    if (category) {
      obj[category] = category;
    }
    if (tags) {
      obj[tags] = { $in: [tags] };
    }
    if (subcategory) {
      obj[subcategory] = { $in: [subcategory] };
    }

    let savedData = await blogModel.find(obj);
    if (savedData.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "no document found" });
    }
    return res
      .status(200)
      .send({ status: true, message: "succuss", data: savedData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//================================================| updateBlog |=====================================================//

const updateBlog = async function (req, res) {
  try {
    let data = req.body;
    let blogId = req.params.blogId;
    let { title, body, tags, subcategory, isPublished } = data;

    if (!isValidBody(data)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request Please provide valid blog details",
      });
    }

    if (!isValidId(blogId)) {
      return res
        .status(400)
        .send({ status: false, message: "enter valid blogID" });
    }

    if (!isValidName(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide valid title" });
    }
    if (!isValidName(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide valid body" });
    }

    if (!isValidName(tags)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide valid tags" });
    }

    if (!isValidName(subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide valid subcategory" });
    }
    let date = Date.now();
    let allDate = date.toString();

    let alert = await blogModel.findOne({ _id: blogId, isDeleted: true });
    if (alert)
      return res
        .status(400)
        .send({ status: false, message: "Blog is already deleted" });

    let blogs = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      {
        $addToSet: { tags, subcategory },
        $set: {
          title,
          body,
          publishedAt: allDate,
          isPublished: isPublished,
        },
      },
      { new: true }
    );

    if (!blogs) {
      return res.status(404).send({ status: false, message: "no blog found" });
    }
    return res.status(200).send({
      status: true,
      message: "succussfully updated blog ",
      data: blogs,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//=====================================================| deleteBlog |====================================================//

const deleteBlog = async function (req, res) {
  try {
    let inputId = req.params.blogId;

    let isValid = mongoose.Types.ObjectId.isValid(inputId);
    if (!isValid)
      return res.status(400).send({ message: "enter valid object tid" });

    let date = Date.now();
    let alltdate = date.toString();

    let deleteAlert = await blogModel.findOne({
      _id: inputId,
      isDeleted: true,
    });
    if (deleteAlert)
      return res.status(404).send({ message: "This blog is already deleted" });

    let updateData = await blogModel.findOneAndUpdate(
      { _id: inputId },
      { $set: { isDeleted: true, deletedAt: alltdate } },
      { new: true }
    );

    if (!updateData)
      return res.status(404).send({ message: "This document dose not exist" });

    res.status(200).send({ status: true, message: updateData });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

//===================================================| deleteBlogByCategory |===============================================//

const deleteBlogByCategory = async (req, res) => {
  try {
    const data = req.query;
    const decoded = req.decoded;

    const objKey = Object.keys(data).length;
    if (objKey == 0)
      return res
        .status(400)
        .send({ status: false, message: "no data on query params" });


    if (objKey > 5)
      return res
        .status(400)
        .send({ status: false, message: "You can't put extra field" });


    const findBlog = await blogModel.find({
      $and: [{ authorId: decoded.authorId }, data],
    });

    if (findBlog.length == 0)
      return res.status(404).send({ status: false, message: "blog not found" });

    const findAuthor = findBlog[0].authorId;


    if (decoded.authorId == findAuthor) {

      const allBlog = await blogModel.updateMany(
        { $and: [data, { authorId: decoded.authorId }, { isDeleted: false }] },
        { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now() } }
      );


      if (allBlog.modifiedCount == 0) {
        return res
          .status(400)
          .send({ status: false, message: "No blog to be deleted" });
      } else {
        return res.status(200).send({
          status: true,
          message: "success",
          data: `${allBlog.modifiedCount} blog deleted`,
        });
      }
    } else {
      res.status(400).send({ status: false, message: "author is not valid" });
    }
    
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  deleteBlogByCategory,
};
