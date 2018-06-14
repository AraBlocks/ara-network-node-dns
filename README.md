<img src="https://github.com/AraBlocks/docs/blob/master/ara.png" width="30" height="30" /> ara-network-node-dns
====================

[![Build Status](https://travis-ci.com/AraBlocks/ara-network-node-dns.svg?token=r6p7pesHZ9MRJsVsrYFe&branch=master)](https://travis-ci.com/AraBlocks/ara-network-node-dns)

An ARA Network node that runs a DNS.

## Status
This project is still in alpha development.

> **Important**: While this project is under active development, run `npm link` in `ara-network-node-dns` directory & `npm link ara-network-node-dns` in `ara-network` directory.

## Dependencies
- [Node](https://nodejs.org/en/download/)
- [ara-network][ara-network]

## Installation
```sh
$ npm install ara-network ara-network-node-dns
```

## Configuration
[ara-runtime-configuration][ara-runtime-configuration] is a dependency of [ara-network][ara-network] and will either read from the nearest `.ararc`.  Install [ara-runtime-configuration][ara-runtime-configuration] separately to specify default values not present in an `.ararc`.

Runtime configuration can be specified by targeting the
`[network.node.dns]` _INI_ section or a nested _JSON_ object
`{ network: { node: { dns: { ... }}}}`.

### Examples
_INI_ format in an `.ararc`:
```ini
[network.node.dns]
multicast = true
loopback = true
ports = 5300
```
_JSON_ format (passed in to ara-runtime-configuration `rc` function:
```json
network: { 
  node: { 
    dns: { 
      multicast: true, 
      loopback: true, 
      ports: 5300 
    }
  }
}
```

## Usage
```js
const dns = require('ara-network-node-dns')
```

#### Command Line (ann)
```bash
$ ann --type dns --help
usage: ann -t dns [options]

Options:
  --debug, -D  Enable debug output                                     [boolean]
  --conf, -C   Path to configuration file                               [string]
  --help, -h   Show help                                               [boolean]
  --port, -p   Port or ports to listen on          [number] [default: [53,5300]]
  --loopback   Loopback DNS discovery                  [boolean] [default: true]
  --multicast  Multicast DNS discovery                 [boolean] [default: true]
```

### Examples
#### Command Line (ann)
Invoke a network node with the `ann` (or `ara-network-node`) command line interface:
```sh
$ ann --type dns --port 5300
```

## Contributing
- [Commit message format](/.github/COMMIT_FORMAT.md)
- [Commit message examples](/.github/COMMIT_FORMAT_EXAMPLES.md)
- [How to contribute](/.github/CONTRIBUTING.md)

## See Also
- [ara-network][ara-network]
- [ara-runtime-configuration][ara-runtime-configuration]
- [dns-discovery](https://github.com/mafintosh/dns-discovery)

## License
LGPL-3.0

[ara-network]: https://github.com/arablocks/ara-network
[ara-runtime-configuration]: https://github.com/arablocks/ara-runtime-configuration
