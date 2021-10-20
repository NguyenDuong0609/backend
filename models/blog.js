const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: {
        type: String,
        require: true,
        trim: true,
        minLength: 10,
        //maxLength: 50
    },
    slug: {
        type: String,
        require: true,
        unique: true
    },
    content: {
        type: String,
        require: true,
        //minLenght: 2000
    },
    description: {
        type: String,
        require: true,
        trim: true,
        // minLength: 50,
        // maxLength: 200
    },
    thumbnail: {
        type: String,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);