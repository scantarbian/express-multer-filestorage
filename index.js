require('dotenv').config()
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const fs = require('fs');

//express variables
const app = express()
const port = process.env.PORT
const corsOptions = {
  origin: process.env.TARGET_URL,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.listen(port, () => {
  console.log(`CDN active at http://localhost:${port}`)
})

app.use(express.static('public'), )

//CORS preflights
app.options('*', cors(corsOptions))

//multer settings
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `public/uploads/${req.body.owner}`
    fs.mkdir(path,{recursive: true})
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const docsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = `public/uploads/${req.body.owner}/${req.body.request}`
    fs.mkdir(path,{recursive: true})
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const uploadImage = multer({ storage: imageStorage })
const uploadDocs = multer({ storage: docsStorage })

app.post('/image', uploadImage.single("profileImage"), (req,res,next)=>{
  res.status(200).send({
    url: req.file.path
  })
})

app.post('/docs', uploadDocs.single("attachment"), (req,res,next)=>{
  res.status(200).send({
    url: req.file.path
  })
})

app.delete('/docs', (req, res) => {
  const body = JSON.parse(req.body)
  const path = `public/uploads/${body.owner}/${body.request}/${body.fileName}`

  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      res.status(500).send(err)
    }
    res.status(200).send('FILE DELETED')
  })
})