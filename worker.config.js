module.exports = {
  apps: [{
    name: "Server 1",
    script: "index.js",
    args: "-p 8082"
  }, {
    name: "Server 2",
    script: "index.js",
    args: "-p 8083"
  }]
}