const Koa = require('koa')
const static = require('koa-static-router')
const app = new Koa()
const swagger = require("swagger-generator-koa");


const special = require('./routes/special')
const articles = require('./routes/articles')
const booking = require('./routes/booking')
const message = require('./routes/message')
const uploads = require('./routes/uploads')
const users = require('./routes/users')
const cors = require('@koa/cors');

app.use(cors());
app.use(special.routes())
app.use(articles.routes())
app.use(booking.routes())
app.use(message.routes())
app.use(users.routes())
app.use(uploads.routes())
app.use(static({ dir: 'docs', router: '/doc/' }))


let port = process.env.PORT || 10888;

app.listen(port)
console.log('API is ready', port)


const options = {
    title: "swagger-generator-koa",
    version: "1.0.0",
    host: "localhost:10888",
    basePath: "/",
    schemes: ["http", "https"],
    securityDefinitions: {
        Bearer: {
            description: 'Example value:- Bearer swajson',
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    security: [{ Bearer: [] }],
    defaultSecurity: 'Bearer'
};


//  swagger.serveSwagger(app, "/swagger", options, { routePath: './routes/', requestModelPath: './models', responseModelPath: './models' });

swagger.serveSwagger(app, "/swagger", options, { routePath: './routes/' });
