/* eslint-disable no-param-reassign */
const { info, warn } = require('ara-console')
const debug = require('debug')('ara:network:node:dht')
const dns = require('ara-network/dns')

/**
 * Configuration of the DNS server
 */
const conf = {
  multicast: true,
  loopback: true,
  ports: [ 53, 5300 ]
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
    if (err && 'EACCES' === err.code) {
      const { port } = err
      conf.ports.splice(conf.ports.indexOf(port), 1)
      debug('error:', err)
    } else if (true === conf.multicast) {
      if (err && 'EADDRINUSE' === err.code) {
        debug('error:', err)
      }
    }
  }
}

/**
 * Stops a DNS server node
 * @public
 * @return Boolean
 */
async function stop() {
  if (!server) { return false }
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
      .option('p', {
        type: 'number',
        alias: 'port',
        default: conf.ports,
        describe: 'Port or ports to listen on',
      })
      .option('L', {
        type: 'boolean',
        alias: 'loopback',
        default: conf.loopback,
        describe: 'Loopback DNS discovery',
      })
      .option('M', {
        type: 'boolean',
        alias: 'multicast',
        default: conf.multicast,
        describe: 'Multicast DNS discovery',
      })

    if (argv.port) { opts.port = argv.port }
    if (argv.loopback) { opts.loopback = argv.loopback }
    if (argv.multicast) { opts.multicast = argv.multicast }
  }

  conf.port = opts.port
  conf.loopback = opts.loopback
  opts.multicast = opts.multicast
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
