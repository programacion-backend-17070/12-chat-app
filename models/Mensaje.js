const { Schema, model } = require("mongoose")
const faker = require("faker")
const { schema, normalize } = require("normalizr")

class Mensaje {
  constructor() {
    const mensajesSchema = new Schema({
      author: {
        email: String,
        name: String,
        lastname: { type: String, default: faker.name.lastName() },
        age: { type: Number, default: faker.datatype.number() },
        alias: { type: String, default: faker.internet.userName() }
      },
      text: String
    })

    this.model = model("mensajes", mensajesSchema)
  }

  async saveMessage(message) {
    await this.model.create(message)
  }

  async readMessages() {
    const author = new schema.Entity("authors", {}, { idAttribute: "email" })
    const mensaje = new schema.Entity("mensajes", {
      author: author
    })

    const data = new schema.Entity("data", {
      mensajes: [mensaje]
    })

    const mensajesEnDB = await this.model.find({})

    const normalizedData = normalize({
      id: "mensajes",
      mensajes: mensajesEnDB.map((d) => {
        return {
          author: d.author,
          text: d.text,
          id: d._id.toString()
        }
      })
    }, data)

    console.log(normalizedData)

    return normalizedData
  }
}

module.exports = new Mensaje()