var app = require('restana')({})
var cors = require('cors')
var queryParser = require('connect-query')
var bodyParser = require('body-parser')
// var multer = require("multer")
const appRouter = require('./routes');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const port = process.env.PORT || 13132;

// app.use(
// 	cors({
// 		origin: [
//             /* 'https://endpoint.api.service' */
//             'http://localhost:13131',
//             'http://localhost:13132',
// 		],
// 		allowedHeaders: ['scheduler-auth', 'Content-Type'],
// 		credentials: true
// 	})
// )

app.use(cors());

app.use(queryParser())
app.use(bodyParser.json())

app.get('/', (req, res) =>
	res.send('Service is ready for ' + (process.env.NODE_ENV || 'development') + '.')
)

// router aplikasi
appRouter(app);



// var storage = multer.diskStorage({
// 	destination: function (req, file, callback) {
//         if (file.fieldname === "identitas") {
// 			callback(null, './uploads/identitas')
// 		} else if (file.fieldname === "screening") {
// 			callback(null, './uploads/screening')			
// 		} else {			
// 			callback(null, './uploads')
// 		}
//     },
//     filename: function (req, file, callback) {					
// 		callback(null, `${file.originalname}`)		
//     }
// })

// var upload = multer({ storage: storage }).fields([{ name: 'identitas' }, { name: 'screening' }, { name: 'form' }])
// app.post("/screening", upload, screening.create)

app.start(port).then(server => {
	if (server) {
		console.log(
			'=====================================> Service running on port',
			server.address().port,
			'<====================================='
		)
	} else {
		console.log('Service failed to running server on port', port)
	}
})