const mongoose = require("mongoose")

const accountScheme = new mongoose.Schema({
    email: String,
    name: String,
    password: String
})

const accountModel = mongoose.model("account",accountScheme)
module.exports = accountModel