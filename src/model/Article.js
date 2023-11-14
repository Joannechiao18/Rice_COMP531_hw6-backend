const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  customId: { type: Number, unique: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

commentSchema.pre("save", async function (next) {
  // This hook should only run if the comment is a subdocument being added to an Article.
  // Check if the comment has a parent article and is new
  if (this.parent() && this.isNew) {
    const article = this.parent();

    // Find the highest customId among the article's comments
    let highestId = 0;
    article.comments.forEach((comment) => {
      if (comment.customId > highestId) {
        highestId = comment.customId;
      }
    });

    // Set this comment's customId to the highest + 1
    this.customId = highestId + 1;
  }

  next();
});

const articleSchema = new mongoose.Schema({
  customId: { type: Number, unique: true, index: true },
  author: String,
  text: {},
  comments: [commentSchema],
  date: { type: Date, default: Date.now },
  image: String,
  created: { type: Date, defazult: Date.now },
});

articleSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastDoc = await this.constructor
      .findOne()
      .sort({ customId: -1 })
      .exec();

    // Check if lastDoc exists and has a customId
    if (lastDoc && lastDoc.customId) {
      this.customId = lastDoc.customId + 1;
    } else {
      // This means either there are no documents, or the existing documents do not have customId
      this.customId = 1; // Start with 1 if it's the first document
    }
  }
  next();
});

const Article = mongoose.model("Article", articleSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = {
  Article,
  Comment,
};
