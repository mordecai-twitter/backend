const app = require('./index')

const PORT = process.argv[2] || 8000
app.listen(PORT, () =>{
  console.log('Listening on port :%s...', PORT);
})
