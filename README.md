# got-integrity

[![NPM version][npm-image]][npm-url]

This is an implementation of [version-integrity](https://github.com/sandhawke/version-integrity) as a wrapper to the wonderful "[got](https://www.npmjs.com/package/got)" http client.  It include a command line interface, too.

## API

Install:

```bash
$ npm install got-integrity --save
```

Use as a drop-in replacement for [got](https://www.npmjs.com/package/got):

```js
const got = require('got-integrity')
...
  const result = await got('some url')
```  

Differences from `got`:

* May not handle all the different ways it can be used
* Will throw an error if the integrity is violated.  The error will have e.integrityFailure be truthy and a .code with more details.
* If checking was done and succeeded, result.integrityConfirmed will be contain the secure hash of the contents.  This also means the contents are immutable and can be cached forever.
* If check was not done, result.integrityWouldBe is set. The value is the hash that you are suggested to use if you want to treat the resource as immutable.

## Command line

Install:

```
$ npm install -g got-integrity
```

Fetch a resources with no checking:

```
$ got-integrity https://www.w3.org/People/Sandro/ping
pong
```

Create a URL with embedded hash, so future calls can check integrity:

```
$ got-integrity --check https://www.w3.org/People/Sandro/ping
integrity suggested: https://www.w3.org/People/Sandro/ping#version-integrity=sha256-Wmoo_BYA6hQdezkSWCLB1R-xZqvlYo5_wfmamwL11Sw=
```

Confirm integrity:

```
$ got-integrity --check https://www.w3.org/People/Sandro/ping#version-integrity=sha256-Wmoo_BYA6hQdezkSWCLB1R-xZqvlYo5_wfmamwL11Sw=
integrity confirmed: https://www.w3.org/People/Sandro/ping#version-integrity=sha256-Wmoo_BYA6hQdezkSWCLB1R-xZqvlYo5_wfmamwL11Sw=
```

And if we change the hash (or the contents of the file), it's caught:

```
$ got-integrity --check https://www.w3.org/People/Sandro/ping#version-integrity=sha256-Wmo
Error: Integrity hash violation for content fetched from https://www.w3.org/People/Sandro/ping#version-integrity=sha256-Wmo
```

Fetch, while checking integrity (which is really the same as first example above, except I'm using a version-integrity URL)

```
$ got-integrity https://www.w3.org/People/Sandro/ping#version-integrity=sha256-Wmoo_BYA6hQdezkSWCLB1R-xZqvlYo5_wfmamwL11Sw= 
pong
```

And, of course, you can redirect to a file if you want:

```
$ got-integrity https://www.w3.org/People/Sandro/ping#version-integrity=sha256-Wmoo_BYA6hQdezkSWCLB1R-xZqvlYo5_wfmamwL11Sw= > pong.txt
$ cat pong.txt
pong
```
