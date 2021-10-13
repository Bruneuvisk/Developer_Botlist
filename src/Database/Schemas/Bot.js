const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let botSchema = new Schema({
    idBot: { type: String },
    idOwner: { type: String },
    verificado: { type: Boolean },
    linguagem: { type: String },
    prefixo: { type: String },
    voto: { type: Number },
    descricao: { type: String },
})

let Bot = mongoose.model("Bots", botSchema);
module.exports = Bot;