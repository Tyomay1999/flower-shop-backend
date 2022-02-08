const Router = require('express')
const FlowerController = require('../../Controllers/flower.controller')

const router = new Router()

router.get('/all', FlowerController.allFlowers)

router.get('/:slug', FlowerController.getOne)



module.exports = router