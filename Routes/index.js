const Router = require('express')
const flowerRoutes_Front = require('./FrontRoutes/flower.routes')
const flowerRoutes_Amin = require('./AdminRoutes/flower.admin.router')
const categoriesRouter_Amin = require('./AdminRoutes/categories.admin.router')
const customerMessagesRouter = require('./CommonRoutes/customer.router')
const router = new Router()

router.use('/flower', flowerRoutes_Front)
router.use('/admin/flower', flowerRoutes_Amin)
router.use('/admin/categories', categoriesRouter_Amin)
router.use('/customer/messages',customerMessagesRouter)

module.exports = router