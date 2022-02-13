const Router = require('express')
const OrderController = require( "../../Controllers/order.controller" );

const router = new Router()

router.post('/all', OrderController.getOrders)
router.post('/set', OrderController.setOrder)
router.put('/change', OrderController.changeOrderStatus)
router.delete('/delete', OrderController.deleteOrder)

module.exports = router