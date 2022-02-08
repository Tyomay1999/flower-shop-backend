const Router = require('express')
const CategoriesAdminController = require('../../Controllers/categories.admin.controller')

const router = new Router()

router.get('/all', CategoriesAdminController.getAllCategories)
router.post('/add', CategoriesAdminController.addCategory)
router.put('/edit', CategoriesAdminController.editCategory)
router.delete('/delete', CategoriesAdminController.deleteCategory)

module.exports = router