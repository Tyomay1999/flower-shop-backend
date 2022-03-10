const Router = require('express')
const FlowerController = require('../../Controllers/flower.controller')

const router = new Router()
//TODO change allFlowers route
router.post('/allFlowers', FlowerController.allFlowers)
router.post('/all', FlowerController.getByIds)
router.get('/slug/:slug', FlowerController.getOne)
router.post('/similar', FlowerController.getSimilar)
router.post('/new', FlowerController.getNewFlowers)
router.post('/cart', FlowerController.getFlowersWithIds)
router.post('/search', FlowerController.getSearchedFlowers)



module.exports = router