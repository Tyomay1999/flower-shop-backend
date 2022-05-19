const Router = require( 'express' )
const AdminsController = require( '../../Controllers/admins.controller' )
const auth = require( '../../Middleware/auth' )
const router = new Router()

router.post( '/login', AdminsController.login )
router.get( '/verifying', auth, AdminsController.verify)

module.exports = router