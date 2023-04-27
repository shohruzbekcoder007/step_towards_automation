const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require("cookie-parser")

const app = express();

const agreements_type = require('./routers/agreements_type')
const user = require('./routers/user')
const view_routers = require('./routers/view_routers')
const file = require('./routers/file')
const agreement = require('./routers/agreement')
const logs = require('./routers/logs_to_servers')
const computer = require('./routers/computer')

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('q1y1npar0l'));
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.static('./static'));
app.set("view engine", "pug");

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/information_security')
  .then(() => {
    console.log('MongoDBga ulanish hosil qilindi...');
  })
  .catch((err) => {
    console.error('MongoDBga ulanish vaqtida xato ro\'y berdi...', err);
  });

app.use('/agreements-type', agreements_type)
app.use('/user', user)
app.use('/', view_routers)
app.use('/file', file)
app.use('/agreement', agreement)
app.use('/logs', logs)
app.use('/computer', computer)

app.get("/", (req, res) => {
  return res.render('login', {})
});

app.listen(port, () => {
  console.log(`Application is up and running under localhost:${port}`)
})