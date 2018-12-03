const ssri = require('ssri')
const got = require('got')
const debug = require('debug')('got-integrity')

const re1 = /version-integrity=/
const re2 = /[/?&#:.]version-integrity=((\w+)-([0-9a-zA-Z/+_-]+=*))/

const myGot = async (url, options = {}) => {
  let algo = options.algorithm || 'sha256'
  let expected

  let m = url.match(re1)
  debug('re1 matches')
  if (m) {
    m = url.match(re2)
    if (m) {
      expected = m[1]
      expected = url64(expected)
      algo = m[2]
      debug('re2 matches, integrity required to:' + expected)
    } else {
      throw new BadURLSyntax({ url })
    }
  }

  // should allow more complete usage of "got"?  Or just pass through
  // options like this?

  // options.encoding = null // make the body be a buffer for now

  const result = await got(url, options)

  const text = result.body

  const computed = ssri.fromData(text, {
    algorithms: [algo]
  })
  const cs = url64(computed.toString())

  if (expected) {
    if (expected !== cs) {
      throw new IntegrityCheckFailed({ url, expected, computed: cs })
    }
    result.integrityConfirmed = expected
  } else {
    result.integrityWouldBe = cs
  }

  return result
}

class IntegrityCheckFailed extends Error {
  constructor (details) {
    super('Integrity hash violation for content fetched from ' + details.url)
    Object.assign(this, details)
    this.code = 'IntegrityCheckFailed'
    this.integrityFailure = true
  }
}

class BadURLSyntax extends Error {
  constructor (details) {
    super('URL looks too much like a version-integrity URL: ' + details.url)
    Object.assign(this, details)
    this.code = 'BadURLSyntax'
    this.integrityFailure = true
  }
}

// convert from base64 to base64url if needed
function url64 (text) {
  return text.replace(/\+/g, '-').replace(/\//g, '_')
}

myGot.IntegrityCheckFailed = IntegrityCheckFailed
myGot.BadURLSyntax = BadURLSyntax
myGot.url64 = url64
module.exports = myGot
