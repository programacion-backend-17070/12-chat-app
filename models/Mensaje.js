const { Schema, model } = require("mongoose")
const faker = require("faker")

class Mensaje {
  constructor() {
    const schema = new Schema({
      author: {
        email: String,
        name: String,
        lastname: { type: String, default: faker.name.lastName() },
        age: { type: Number, default: faker.datatype.number() },
        alias: { type: String, default: faker.internet.userName() }
      },
      text: String
    })

    this.model = model("mensajes", schema)
  }

  async saveMessage(message) {
    await this.model.create(message)
  }

  async readMessages() {
    const data = await this.model.find({})

    return data.map((d) => {
      return {
        author: d.author,
        text: d.text,
        id: d._id.toString()
      }
    })
  }
}

module.exports = new Mensaje()