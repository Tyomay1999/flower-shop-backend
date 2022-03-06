const apiError = require( '../Error/apiError' )
const { Orders, Flower } = require( "../Models/model" );
const { INTEGER, STRING, or } = require( "sequelize" );

class OrdersController {
    async getOrders( req, res, next ) {
        try {
            const { status } = req.params
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
            const shippingDetails = JSON.parse(req.body?.shippingDetails),//Recipient info
                // paymentDetails = JSON.parse(req.body?.paymentDetails),//cart info
                orderDetails = JSON.parse(req.body?.orderDetails)//totalPrice,flowerIds
            const totalPrice = orderDetails.shift()
            const orderData = {
                status,
                email: shippingDetails.email,
                address: shippingDetails.address,
                phone: shippingDetails.phone,
                firstName: shippingDetails.firstName,
                deliveryTime: shippingDetails.deliveryTime,
                deliveryDate: shippingDetails.deliveryDate,
                personalMessage: shippingDetails.personalMessage,
                flowers_ids: JSON.stringify(orderDetails)
            }
            const order = await Orders.create(orderData)
            return res.status( 200 ).json( { message: order } )
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
