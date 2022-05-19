const { Admins } = require( "../Models/model" );
const bcrypt = require( "bcrypt" );
const apiError = require( '../Error/apiError' )
const jwt = require( 'jsonwebtoken' )

class AdminsController {
    async checkA() {
        try {
            const admins = await Admins.findAll()
            if ( !admins.length ) {
                let _password = process.env.PA, _login = process.env.LA, _salt = +process.env.SALT
                const salt = await bcrypt.genSalt( _salt )
                const password = await bcrypt.hash( _password, salt )
                await Admins.create( {
                    email: _login,
                    status: 1,
                    password
                } )
            }
            return null;
        } catch ( error ) {
            console.log( error.message )
            throw error
        }
    }

    async login( req, res, next ) {
        try {
            const { email, password } = req.body
            if ( !email || !password ) {
                return res.status( 400 ).json( { message: "Пожалуйста, проверьте свой пароль или адрес электронной почты" } )
            }
            let admin = await Admins.findAll( { where: { email } } )
            admin = JSON.parse( JSON.stringify( admin ) )
            if ( !admin[ 0 ]?.email ) {
                return res.status( 404 ).json( { message: "Админ не найден" } )
            }
            const validPassword = await bcrypt.compare( password, admin[ 0 ].password );
            if ( !validPassword ) {
                return res.status( 400 ).json( { message: "Неверный пароль" } )
            }

            const token = jwt.sign(
                { user_id: admin[ 0 ].id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "4h",
                }
            );
            return res.status( 201 ).json( { access_token: token } )
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }

    async verify( req, res, next ) {
        try {
            if ( req.admin ) {
                return res.status( 201 ).json( { OK: true } )
            }
            return res.status( 201 ).json( { OK: false } )
        } catch
            ( error ) {
            next( apiError.badRequest( error.message ) )
        }

    }
}

module.exports = new AdminsController()