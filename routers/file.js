const upload_file = require('../middleware/file_upload')
const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const Grid = require('gridfs-stream')
const { auth } = require('../middleware/auth')

let gfs;
const conn = mongoose.connection

let bucket;
mongoose.connection.on("connected", () => {
  var db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "files"
  });
});

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('files')
    console.log("connection made successfully")
})

router.post('/uploadfile', [auth, upload_file.single('file')], async (req, res) => {

    if(req.file === undefined) return res.send("file tanlang")

    const imageUrl = `http://localhost:8080/file/${req.file.filename}`

    return res.send(imageUrl)
    
});

router.get('/:filename', async (req, res) => {
    try{
        const file = await gfs.files.findOne({filename: req.params.filename})
        const readStream = bucket.openDownloadStream(file._id)
        readStream.pipe(res)
    } catch(err) {
        return res.send("Tizimda xatolik yuzaga keldi")
    }
})

module.exports = router;