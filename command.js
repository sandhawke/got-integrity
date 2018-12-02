#!/usr/bin/env node
const got = require('.')
const meow = require('meow')
// const debug = require('debug')('got-integrity')

const cli = meow(`
    Usage
        $ got-integrity <url>...

    Options
        --check, -r      Just report status, don't save contents
        --algorithm, -a  Preferred algorithm for crypto (default sha265)

    Examples
        $ got-integrity https://www.w3.org/People/Sandro/ping

`, {
  flags: {
    check: {
      type: 'boolean',
      alias: 'c'
    },
    algorithm: {
      type: 'string',
      alias: 'a'
    }
  }
})

const main = async () => {
  for (const url of cli.input) {
    await handle(url)
  }
}

const handle = async (url) => {
  let result
  try {
    result = await got(url, {
      encoding: null, // keep results in binary, might not be utf8
      algorithm: cli.flags.algorithm
    })
  } catch (e) {
    if (e.integrityFailure) {
      console.error('Error: ' + e.message)
      process.exit(1)
    }
    throw (e)
  }

  if (result.integrityConfirmed) {
    if (cli.flags.check) {
      console.error('integrity confirmed:', url)
    } else {
      process.stdout.write(result.body)
    }
  } else {
    if (cli.flags.check) {
      console.error('integrity suggested:', url +
                    '#version-integrity=' + result.integrityWouldBe)
    } else {
      process.stdout.write(result.body)
    }
  }
}

if (cli.input.length === 0) cli.showHelp()
main()
