const test = require('tape')
const got = require('.')

const u1 = 'https://www.w3.org/People/Sandro/ping'
const i1 = 'sha256-Wmoo_BYA6hQdezkSWCLB1R-xZqvlYo5_wfmamwL11Sw='
const x1 = 'sha256-Wmoo___A6hQdezkSWCLB1R-xZqvlYo5_wfmamwL11Sw='

test(async (t) => {
  t.plan(2)
  const r = await got(u1)
  t.equal(r.body, 'pong\n')
  t.equal(r.integrityWouldBe, i1)
  t.end()
})

test(async (t) => {
  t.plan(3)
  const r = await got(u1 + '#version-integrity=' + i1)
  t.equal(r.body, 'pong\n')
  t.assert(r.integrityConfirmed)
  t.equal(r.integrityConfirmed, i1)
  t.end()
})

test(async (t) => {
  t.plan(3)
  let r
  try {
    r = await got(u1 + '#version-integrity=' + x1)
  } catch (e) {
    t.assert(e.integrityFailure)
    t.equal(e.code, 'IntegrityCheckFailed')
  }
  t.equal(r, undefined)
  t.end()
})

test(async (t) => {
  t.plan(3)
  let r
  try {
    r = await got(u1 + '#version-integrity=  SPACE  ' + x1)
  } catch (e) {
    t.assert(e.integrityFailure)
    t.equal(e.code, 'BadURLSyntax')
  }
  t.equal(r, undefined)
  t.end()
})
