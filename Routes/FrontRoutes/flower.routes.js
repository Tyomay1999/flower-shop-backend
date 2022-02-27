const Router = require('express')
const FlowerController = require('../../Controllers/flower.controller')

const router = new Router()

router.get('/all', FlowerController.allFlowers)
router.get('/slug/:slug', FlowerController.getOne)
router.post('/similar', FlowerController.getSimilar)
router.get('/new', FlowerController.getNewFlowers)
router.post('/cart', FlowerController.getFlowersWithIds)



module.exports = router