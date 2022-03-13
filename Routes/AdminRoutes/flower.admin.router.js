const Router = require('express')
const FlowerAdminController = require('../../Controllers/flower.admin.controller')

const router = new Router()

router.post('/new', FlowerAdminController.getNewFlowers)
router.post('/all', FlowerAdminController.getAll)
router.post('/add', FlowerAdminController.addFlower)
router.post('/cart', FlowerAdminController.getFlowersWithIds)
router.post('/search', FlowerAdminController.getSearchedFlowers)
router.put('/edit', FlowerAdminController.editFlower)
router.delete('/delete', FlowerAdminController.deleteFlower)



module.exports = router