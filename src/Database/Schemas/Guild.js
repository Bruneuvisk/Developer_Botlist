const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let guildSchema = new Schema({
    idServer: { type: String },
    prefix: { type: String, default: "dev!" }
})

let Guild = mongoose.model("Servidores", guildSchema);
module.exports = Guild;