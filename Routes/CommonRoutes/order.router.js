const Router = require('express')
const OrderController = require( "../../Controllers/order.controller" );
const auth = require( "../../Middleware/auth" );

const router = new Router()

router.get('/all',auth,  OrderController.getOrders)
router.post('/set', OrderController.setOrder)
router.put('/change', auth,  OrderController.changeOrderStatus)
router.delete('/delete', auth, OrderController.deleteOrder)

module.exports = router