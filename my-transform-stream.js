const stream = require('stream')
const util = require('util')

class ReplaceStream extends stream.Transform {
  constructor(searchString, replaceString) {
    super()
    this.searchString = searchString
    this.replaceString = replaceString
    this.tailPiece = ''
  }

  _transform(chunk, encoding, callback) {
    const pieces = (this.tailPiece + chunk).split(this.searchString)
    const lastPiece = pieces[pieces.length - 1]
    const tailPieceLen = this.searchString.length - 1

    this.tailPiece = lastPiece.slice(-tailPieceLen)
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailPieceLen)

    this.push(pieces.join(this.replaceString))
    callback()
  }

  _flush(callback) {
    this.push(this.tailPiece)
    callback()
  }
}

// const replaceStream = new ReplaceStream('World', 'Node.js')
// replaceStream.on('data', chunk => console.log(chunk.toString()))
// replaceStream.write('Hello W')
// replaceStream.write('orld!')
// replaceStream.end()

process.stdin
  .pipe(new ReplaceStream(process.argv[2], process.argv[3]))
  .pipe(process.stdout)
