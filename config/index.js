module.exports = {
  mongoConfig: {
    HOSTNAME: "cluster0.go6w7.mongodb.net",
    SCHEMA: "mongodb+srv",
    USER: "lalomx",
    PASSWORD: 'MUBWPxQiBm6VAzOS',
    DATABASE: "chat",
    OPTIONS: "retryWrites=true&w=majority"
  },
  redisConfig: {
    PASSWORD: process.env.REDIS_PASSWORD
  }
}