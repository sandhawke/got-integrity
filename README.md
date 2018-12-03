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

And if we mangle the hash, it's caught

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

### Issues

Those whole project raises an architectural concern I've been puzzling
over for a long time. Who am I to say that people can't put
"version-integrity=" in their URLs with some other semantics?  If
people start to do that, for some bizarre reason, then clients using
this library wont be able to access those URLs. I think that's
probably an acceptable risk, but it was be unpleasant.

Alternatives are (1) give up on backward-compatable dereferenceable
URLs (with a new URI scheme) or (2) make the URL's even longer and
harder to read.  Neither of those seems warranted yet, at least.
