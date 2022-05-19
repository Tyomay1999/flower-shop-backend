const Router = require( 'express' )
const flowerRoutes_Front = require( './FrontRoutes/flower.routes' )
const categories_Front = require( './FrontRoutes/categories.router' )
const flowerRoutes_Amin = require( './AdminRoutes/flower.admin.router' )
const categoriesRouter_Amin = require( './AdminRoutes/categories.admin.router' )
const customerMessagesRouter = require( './CommonRoutes/customer.router' )
const authRouter = require( './AdminRoutes/auth.admin.router' )
const orderRouter = require( './CommonRoutes/order.router' )
const auth = require( "../Middleware/auth" );
const apiError = require( '../Error/apiError' )
const { Admins, CustomerMessages, Orders } = require( "../Models/model" );
const router = new Router()

router.use( '/flower', flowerRoutes_Front )
router.use( '/categories', categories_Front )
router.use( '/admin/flower', flowerRoutes_Amin )
router.use( '/admin/categories', categoriesRouter_Amin )
router.use( '/customer/messages', customerMessagesRouter )
router.use( '/order', orderRouter )
router.use( '/', authRouter )
router.get( '/state',  async ( req, res, next ) => {
    try {
        const customerMessagesCount = await CustomerMessages.findAndCountAll()
        const ordersCount = await Orders.findAndCountAll()
        return res.status(201).json({
            messagesCount: customerMessagesCount.count,
            ordersCount: ordersCount.count
        })
    } catch ( error ) {
        next( apiError.badRequest( error.message ) )
    }
} )


module.exports = router