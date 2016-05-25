# Typed node-mssql [![Build Status](https://travis-ci.org/typed-contrib/node-mssql.svg?branch=master)](https://travis-ci.org/typed-contrib/node-mssql)

Type definitions for [node-mssql](https://github.com/patriksimek/node-mssql).

## Installation

Installation can be done using [typings](https://github.com/typings/typings).

From the registry:
```bash
$ typings install node-mssql --save
```

From the source:
```bash
$ typings install github:typed-contrib/node-mssql --save
```

`node-mssql` module works in `node.js` environment and requires `Promise` typings.
So you also have to install `node.js` typings.

```bash
$ typings install dt~node --global --save
```

If you do not target `ES2015` in your TypeScript configuration, install `es2015-promise` typings.

```bash
$ typings install env~es2015-promise --global --save
```

## Contributing

Contributions are welcome !

```bash
# Installation
# Fork this repo (https://github.com/typed-contrib/node-mssql)
# Clone the fork (E.g. `https://github.com/<your_username>/node-mssql.git`)
cd node-mssql

# Install modules and dependencies
npm install

# Test typings over node-mssql samples and tests
npm test
```

Some resources to help writing Typescript type definitions:
 * [Writing Declaration Files](http://www.typescriptlang.org/docs/handbook/writing-declaration-files.html)
 * [typings examples](https://github.com/typings/typings/blob/master/docs/examples.md)

## Tests

This type definitions are tested using source `node-mssql` samples.
 * [JavaScript](https://github.com/patriksimek/node-mssql)
 * [TypeScript](https://github.com/typed-contrib/node-mssql/tree/master/test)

## License

MIT
