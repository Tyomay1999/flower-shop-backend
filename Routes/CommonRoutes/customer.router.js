const Router = require('express')
const CustomerMessagesController = require('../../Controllers/messages.controller')
const auth = require( "../../Middleware/auth" );
const router = new Router()

router.get('/all',auth,  CustomerMessagesController.getCustomerMessages)
router.post('/send', CustomerMessagesController.addCustomerMessage)
router.delete('/delete', auth, CustomerMessagesController.deleteCustomerMessage)

module.exports = router