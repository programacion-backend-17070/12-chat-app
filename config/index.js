module.exports = {
  mongoConfig: {
    HOSTNAME: "cluster0.go6w7.mongodb.net",
    SCHEMA: "mongodb+srv",
    USER: "lalomx",
    PASSWORD: process.env.MONGO_PASSWORD,
    DATABASE: "chat",
    OPTIONS: "retryWrites=true&w=majority"
  },
  redis: {
    
  }
}