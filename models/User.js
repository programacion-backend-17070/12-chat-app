const { Schema, model } = require("mongoose")
const faker = require("faker")

class User {
  constructor() {
    const schema = new Schema({
      email: String,
      name: String,
      lastname: { type: String, default: faker.name.lastName() },
      age: { type: Number, default: faker.datatype.number() },
      alias: { type: String, default: faker.internet.userName() },
      status: { type: String, default: "unavailable" }
    })

    this.model = model("user", schema)
  }

  async getAll() {
    const data = await this.model.find({})
    return data.map(u => ({
      email: u.email,
      name: u.name,
      lastname: u.lastname,
      age: u.age,
      alias: u.alias,
      id: u._id.toString()
    }))
  }

  async save(obj) {
    return await this.model.create(obj)
  }

  async changeStatus(id, status) {
    return await this.model.updateOne({ _id: id }, { $set: { status } })
  }

  async delete(id) {
    return await this.model.deleteOne({ _id: id })
  }
}

module.exports = new User()