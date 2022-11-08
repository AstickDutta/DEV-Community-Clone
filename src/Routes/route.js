const express = require("express");
const router = express.Router();

const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController");
const auth = require("../middleWare/auth");

router.get("/test-me", function (req, res)  {
  res.send("My first ever api!");
});

router.post("/authors", authorController.createAuthor);

router.post("/blogs", auth.authenticate, blogController.createBlog);

router.get("/blogs", auth.authenticate, blogController.getBlogs);

router.put("/blogs/:blogId", auth.authenticate, auth.authorise, blogController.updateBlog);

router.delete("/blogs/:blogId", auth.authenticate, auth.authorise, blogController.deleteBlog);

router.delete("/blogs", auth.authenticate, blogController.deleteBlogByCategory);

router.post("/login", authorController.loginUser);

module.exports = router;