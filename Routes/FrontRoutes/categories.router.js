const Router = require('express')
const CategoriesController = require('../../Controllers/categories.controller')

const router = new Router()

router.get('/all', CategoriesController.getAllCategories)

module.exports = router