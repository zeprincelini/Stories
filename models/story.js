const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'Public',
        enum: ['Public', 'Private']
    },
    category: {
        type: String,
        default: 'Action',
        enum: ['Action', 'Thriller', 'Romance', 'Horror']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Story", StorySchema);