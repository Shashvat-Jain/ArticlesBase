const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type:String,
        required: true
    },
    body:{
        type:String,
        required: true
    }
});

// module.exports = mongoose.model('Article', articleSchema);

const Article = mongoose.model('Article', articleSchema);
module.exports.Article = Article;