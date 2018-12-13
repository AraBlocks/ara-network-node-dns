/* eslint-disable no-param-reassign */
const { info, warn } = require('ara-console')
const debug = require('debug')('ara:network:node:dht')
const dns = require('ara-network/dns')
const DNS = require('dns-socket')
const ip = require('ip')

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

  const sock = DNS()
  const ports = []

  server = dns.createServer(conf)
  server.on('error', onerror)
  server.listen(conf.port)

  for (const s of server._sockets) {
    s.on('listening', () => {
      const { port } = s.address()
      info('dns: Listening on port %s', port)
      ports.push(port)
    })
  }

  if (process.env.USE_ARAX_DNS) {
    server._onquery = function (query, port, host, socket) {
      const reply = { questions: query.questions, answers: [] }

      for (let i = 0; i < query.questions.length; i++) {
        this._onquestion(query.questions[i], port, host, reply.answers)
      }

      for (let i = 0; i < query.answers.length; i++) {
        this._onanswer(query.answers[i], port, host, socket)
      }

      for (let i = 0; i < query.additionals.length; i++) {
        this._onanswer(query.additionals[i], port, host, socket)
      }

      const servers = server.servers.slice()
      const pending = []

      kick()

      function cleanup() {
        while (pending.length) {
          sock.cancel(pending.shift())
        }
      }

      function kick() {
        if (!servers.length) {
          socket.response(query, reply, port, host)
          cleanup()
          return
        }

        const addr = servers.shift()
        const { questions, additionals } = query

        if ('localhost' === addr.host) {
          kick()
        } else {
          enqueue(addr.secondaryPort, addr.host)
          enqueue(addr.port, addr.host)
        }

        function enqueue(_port, _host) {
          if (
            'localhost' !== _host &&
            !ip.isLoopback(_host) &&
            ports.includes(_port)
          ) {
            const q = { questions, additionals }
            const id = sock.query(q, _port, _host, onquery)
            pending.push(id)
          } else {
            onquery(null, null)
          }
        }

        function onquery(err, res) {
          if (!err && res && res.answers && res.answers.length) {
            reply.answers = res.answers
            socket.response(query, reply, port, host)
            cleanup()
          } else {
            kick()
          }
        }
      }
    }
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
