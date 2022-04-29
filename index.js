

try {
  const cluster = require('cluster')
  const CPUs = 4

  const yargs = require('yargs/yargs')
  const server = require('./app')
  // const args = yargs.default({ PORT: 8080, mode:'fork'}).argv
  const args = yargs(process.argv.slice(2))
    .option('port', {
      alias: 'p',
      describe: 'server port',
      default: 8080,
      type: 'number'
    })
    .option('modo', {
      alias: 'm',
      describe: 'modo',
      default: 'fork',
      type: 'string',
      choices: ['fork', 'cluster']
    })
    .argv

  const { port, modo } = args

  console.log(`PORT: ${port} -- MODE: ${modo}`)

  const isCluster = args.modo === 'cluster'

  if (isCluster && cluster.isPrimary) {
    // fork

    for (let i = 0; i < CPUs; i++) {
      cluster.fork()
    }

  } else {
    // implementacion de mi app
    server.then((s) => s.listen(port, () => console.log(`listening on http://localhost:${port}`)))
  }
} catch (e) {
  console.log(e)
}
