const express = require('express')
const multer = require('multer')
const cors = require('cors')

//express variables
const app = express()
const port = 2000
const corsOptions = {
    origin: 'https://dev.scantarbian.live',
    optionsSuccessStatus: 200
}

app.listen(port, () => {
    console.log(`CDN active at http://localhost:${port}`)
})

app.use(express.static('public'), )

//CORS preflights
app.options('*', cors(corsOptions))

//multer settings
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/images',)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
})

const docsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/uploads/docs`,)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
})

const uploadImage = multer({ storage: imageStorage })
const uploadDocs = multer({ storage: docsStorage })

app.post('/image', cors(corsOptions), uploadImage.single("profileImage"), (req,res,next)=>{
    res.status(200).send({
        url: req.file.path
    })
})

app.post('/docs', cors(corsOptions), uploadDocs.single("attachment"), (req,res,next)=>{
    res.status(200).send({
        url: req.file.path
    })
})