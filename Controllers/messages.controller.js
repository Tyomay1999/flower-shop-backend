const apiError = require( '../Error/apiError' )
const sequelize = require('sequelize')
const { CustomerMessages } = require( "../Models/model" );

class CustomerMessagesController {
    async getCustomerMessages(req,res,next) {
        try {
            const customerMessages = await CustomerMessages.findAll()
            return res.status(200).json({messages: customerMessages})
        } catch ( error ) {
            next(apiError.badRequest(error.message))
        }
    }
    async addCustomerMessage(req,res,next) {
        try {
            const {name,phone,email,message} = req.body
            await CustomerMessages.create({name,phone,email,message})
            return res.status(200).json( { message: 'Your message is send'})
        } catch ( error ) {
            next(apiError.badRequest(error.message))
        }
    }
    async deleteCustomerMessage(req,res,next) {
        try {
            const {id} = req.body
            await CustomerMessages.destroy({where: {id}})
            return res.status(200).json({message: 'Message was deleted successfully'})
        } catch ( error ) {
            next(apiError.badRequest(error.message))
        }
    }
}

module.exports = new CustomerMessagesController()