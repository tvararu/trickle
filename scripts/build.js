const fs = require('fs')
const path = require('path')
const indexhtml = require('../lib/indexhtml')

fs.writeFileSync(path.resolve(__dirname, '../dist', 'index.html'), indexhtml)
