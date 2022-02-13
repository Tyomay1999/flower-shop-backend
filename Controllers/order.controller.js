const apiError = require( '../Error/apiError' )
const { Orders } = require( "../Models/model" );

class OrdersController {
    async getOrders( req, res, next ) {
        try {
            const { status } = req.body
            let orders;
            if ( status || status === 0 ) {
                orders = await Orders.findAll( { where: { status } } )
                return res.status( 200 ).json( { orders } )
            }
            orders = await Orders.findAll()
            return res.status( 200 ).json( { orders } )
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }

    async setOrder( req, res, next ) {
        try {
            const status = 1
            const order = await Orders.create( {
                ...req.body, status
            } )
            return res.status( 200 ).json( { message: 'Order successful send' } )
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }

    async changeOrderStatus( req, res, next ) {
        try {
            const { id, status } = req.body
            const order = await Orders.update(
                { status },
                { where: { id } }
            )
            res.status( 200 ).json( { message: 'Order status changed' } )
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }

    async deleteOrder( req, res, next ) {
        try {
            const { id } = req.body
            await Orders.destroy({where: {id}})
            res.status(200).json({message: 'order was successful deleted'})
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }
}

module.exports = new OrdersController()
