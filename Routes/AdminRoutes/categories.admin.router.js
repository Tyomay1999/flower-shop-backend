const Router = require('express')
const CategoriesAdminController = require('../../Controllers/categories.admin.controller')
const auth = require('../../Middleware/auth')
const router = new Router()

router.get('/all', auth,CategoriesAdminController.getAllCategories)
router.post('/add',auth, CategoriesAdminController.addCategory)
router.put('/edit', auth, CategoriesAdminController.editCategory)
router.delete('/delete', auth,CategoriesAdminController.deleteCategory)

module.exports = router