const express = require('express');
const cors = require('cors')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const api = require('./api/api')
const app = express()
app.use(cors())

var PORT = process.argv[2] || 8000
global.rootDir = __dirname

app.use('/api/', api)

app.use('/_nuxt', express.static(global.rootDir + '/_nuxt'))

app.get('/', (req, res) =>{
  res.sendFile(`${global.rootDir}/index.html`)
})

app.get('/:folder', (req, res) => {
  let folder = req.params.folder
  // Replace in camel case
  folder = folder.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index)
  {
      return index != 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
  res.sendFile(`${global.rootDir}/${folder}/index.html`)
})

app.listen(PORT, () =>{
  console.log('Listening on port :%s...', PORT);
})
