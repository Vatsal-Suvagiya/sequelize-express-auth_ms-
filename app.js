const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

const sequelize = require('./config/connection');
const initModels = require("./src/models/init-models")
var models = initModels(sequelize);
const routes = require("./src/routes/authRoutes");

// const httpContext = require('express-http-context')
// const config = require('config')
// const { urlCons } = require('./lib/utils')
// const validatedHeaders = require('./middlewares/validateHeader')
// const ini
const app = express()

const corsOptions = {
  origin: '*',
  preflightContinue: false,
  methods: 'POST, GET, PUT, DELETE, OPTIONS, HEAD',
  optionsSuccessStatus: 204,
  allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization, token, org_name, user_code, user_role, user_name, user_permission, calling_entity'],
  exposedHeaders: ['Authorization, token, user_code, user_role, user_name, user_permission']
}

app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);
// app.use(express.json())

// app.use(cookieParser())

// app.use('/ko',(req,res)=>{
//     models.Address.findAll({raw:true}).then((a)=>{
//         console.log(a);
//         res.send(a)
//     })
// })

app.listen(3000,()=>{
    console.log("server started ....");
})


// const jwt = require('jsonwebtoken')
// const config = require('config')

// let a = { ab : "hello"}
// function generateAuthToken ()
// {
//     const token = jwt.sign({hii : 'vatsal',vatsal : "fghjkfgh",vyhjnk :"dfghjkgh" } , config.get("jwtPrivateKey"),{expiresIn: '1d'})
//     return token
// }

// let tok = generateAuthToken()

// console.log(tok);

// const decode = jwt.verify(token, config.get('jwtPrivateKey'))
