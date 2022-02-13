const Router = require('express')
const CustomerMessagesController = require('../../Controllers/messages.controller')
const router = new Router()

router.get('/all', CustomerMessagesController.getCustomerMessages)
router.post('/send', CustomerMessagesController.addCustomerMessage)
router.delete('/delete', CustomerMessagesController.deleteCustomerMessage)

module.exports = router