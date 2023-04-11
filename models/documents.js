const mongoose = require("mongoose")

const documentSchema = new mongoose.Schema({
    userId:{
        type: String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required:true
    },
    document: {
        type: String,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

})

module.exports.Document = new mongoose.model("document", documentSchema)