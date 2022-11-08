const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    authorId: {
      type: ObjectId,
      ref: "Author",
      required: true,
    },
    tags: {
      type: [String],
    },
    category: {
      type: [String],
      required: true,
    },
    subcategory: {
      type: [String],
    },

    deletedAt: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },

    publishedAt: Date,

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blog_list", blogSchema);