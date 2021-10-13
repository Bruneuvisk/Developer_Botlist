const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
    idUser: { type: String },
    tagUser: { type: String },
    reps: {
        quantidade: { type: Number, default: 0 },
        ultimorep: { type: String, default: "null" },
        ultimoenvio: { type: String, default: "null" },
        cooldown: { type: Number, default: 0 },
    },
    botlist: {
        has: { type: Boolean, default: false },
        bots: { type: Array, default: [] },
        cooldown: { type: Number, default: 0 },
    }
})

let User = mongoose.model("Usuarios", userSchema);
module.exports = User;