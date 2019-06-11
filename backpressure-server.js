const Chance = require('chance')
const chance = new Chance()

require('http')
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })

    function generateMore() {
      while (chance.bool({ likelihood: 95 })) {
        const shouldContinue = res.write(
          chance.string({ length: 26 * 1024 - 1 })
        )
        if (!shouldContinue) {
          console.log('back pressure')
          return res.once('drain', generateMore)
        }
      }
      res.end('\nEnd\n').on('finish', () => console.log('all data has sent'))
    }

    generateMore()
  })
  .listen(3000, () => console.log('Listening'))
