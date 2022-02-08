const Router = require('express')
const FlowerAdminController = require('../../Controllers/flower.admin.controller')

const router = new Router()

router.get('/all', FlowerAdminController.getAll)
router.post('/add', FlowerAdminController.addFlower)
router.put('/edit', FlowerAdminController.editFlower)
router.delete('/delete', FlowerAdminController.deleteFlower)



module.exports = router