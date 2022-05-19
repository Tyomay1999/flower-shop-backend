const Router = require('express')
const FlowerAdminController = require('../../Controllers/flower.admin.controller')
const auth = require('../../Middleware/auth')

const router = new Router()

router.post('/new', auth,FlowerAdminController.getNewFlowers)
router.post('/all', auth, FlowerAdminController.getAll)
router.post('/add', auth, FlowerAdminController.addFlower)
router.post('/cart', auth, FlowerAdminController.getFlowersWithIds)
router.post('/search',auth, FlowerAdminController.getSearchedFlowers)
router.put('/edit', auth, FlowerAdminController.editFlower)
router.delete('/delete', auth, FlowerAdminController.deleteFlower)



module.exports = router