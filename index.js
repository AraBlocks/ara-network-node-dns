const { info, warn } = require('ara-console')
const extend = require('extend')
const debug = require('debug')('ara:network:node:dht')
const dns = require('ara-network/dns')

/**
 * Configuration of the DNS server
 */
const conf = {
  multicast: true,
  loopback: true,
  ports: [53, 5300]
}


/**
 * DNS server object
 */
let server = null


/**
 * Starts a DNS server node
 * @public
 * @param {Object} argv
 * @return Boolean
 */
async function start() {
  if (server) { return false }

  server = dns.createServer(conf)
  server.on('error', onerror)
  server.listen(conf.port)

  for (const socket of server._sockets) {
    socket.on('listening', () => {
      const { port } = socket.address()
      info('dns: Listening on port %s', port)
    })
  }

  return true

  function onerror(err) {
    if (err && err.code == 'EACCES') {
      const { port } = err
      conf.ports.splice(conf.ports.indexOf(port), 1)
      return debug('error:', err)
    } else if (conf.multicast == true) {
      if (err && err.code == 'EADDRINUSE') {
        return debug('error:', err)
      }
    }

    return false
  }
}


/**
 * Stops a DNS server node
 * @public
 * @return Boolean
 */
async function stop() {
  if (server == null) { return false }
  warn('dns: Stopping server')
  server.destroy(ondestroy)
  return true
  function ondestroy() {
    server = null
  }
}

/**
 * Configures a DNS server node
 * @public
 * @param {Object} opts
 * @return Object
 */
async function configure(opts, program) {
  if (program) {
    const { argv } = program
      .option('port', {
        alias: 'p',
        type: 'number',
        describe: 'Port or ports to listen on',
        default: conf.ports
      })
      .option('loopback', {
        type: 'boolean',
        default: conf.loopback,
        describe: 'Loopback DNS discovery',
      })
      .option('multicast', {
        type: 'boolean',
        default: conf.multicast,
        describe: 'Multicast DNS discovery',
      })

    if (argv.port) { opts.port = argv.port }
    if (argv.loopback) { opts.loopback = argv.loopback }
    if (argv.multicast) { opts.multicast = argv.multicast }
  }

  return extend(true, conf, opts)
}

/**
 * Returns reference to DNS server node
 * @public
 * @return Object
 */
async function getInstance() {
  return server
}

module.exports = {
  getInstance,
  configure,
  start,
  stop,
}
