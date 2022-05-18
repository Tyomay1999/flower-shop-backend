require( 'dotenv' ).config()
const express = require( 'express' )
const sequelize = require( './db' )
const fileUpload = require( 'express-fileupload' )
const models = require( './Models/model' )
const cors = require( 'cors' )
const routers = require( './Routes/index' )
const PORT = process.env.PORT || 5000
const errorHandler = require( './Middleware/errorHandlingMiddleware' )
const path = require( 'path' )
const app = express()

app.use( cors() )
app.use( express.json() )
app.use( express.static( path.resolve( __dirname, 'static' ) ) )
app.use( fileUpload() )
app.use( '/api', routers )
app.get( '/', ( req, res ) => {
    return res.status( 200 ).send( `
        <div style='width: 100%; height: 100vh;display: flex;justify-content: center;align-items: center'>
            <h1>API is working</h1>
        </div>
` )
} )

app.use( errorHandler )
const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen( PORT, () => console.log( `Server has been started in ${ PORT }...` ) )
    } catch ( error ) {
        console.log( error )
    }
}

start()
