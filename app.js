const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const uuidv4 = require('uuid/v4')

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT || 9000

app.get('/document/:documentid', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/generate', function (req, res) {
  const documentid = uuidv4().slice(0, 8)
  res.redirect('/document/' + documentid)
})

app.all('*', function (req, res) {
  res.redirect('/')
})

app.listen(port, function () {
  console.log('Listening on port ' + port)
})
