ara-network-node-dns
====================

An ARA Network node that runs a DNS.

## Installation

```sh
$ npm install ara-network ara-network-node-dns
```

## Usage

### Runtime Configuration

[rc]: https://github.com/arablocks/ara-runtime-configuration

[Runtime configuration][rc] can be specified by targeting the
`[network.node.dns]` _INI_ section or the nested _JSON_ object
`{ network: { node: { dns: { ... }}}`. For clarity, we detail the
options below in _INI_ format.

```ini
[network.node.dns]
multicast = true

loopback = true

ports = [53,5300]
```

### Programmatic

[interface]: https://github.com/AraBlocks/ara-network/blob/master/nodes/README.md

The `ara-network-node-dns` module can be used programmatically as it
conforms to the [`ara-network` node interface][interface].

```js
const dns = require('ara-network-node-dns')
```

### Command Line (ann)

With the `ann` (or `ara-network-node`) command line interface, you can
invoke this network node by running the following:

```sh
$ ann --type dns
```

To see usage help about this network node interface, run the following:

```sh
$ ann --type dns --help
```

## See Also

* [ara-network](https://github.com/arablocks/ara-network)
* [dns-discovery](https://github.com/mafintosh/dns-discovery)

## License

LGPL-3.0
