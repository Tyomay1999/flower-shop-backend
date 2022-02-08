const apiError = require('../Error/apiError')
const { Flower } = require('../Models/model')
const path = require('path')
const uuid = require('uuid')

class FlowerAdminController {
    async getAll(req,res) {
        const flowers = await Flower.findAll()
        return await res.status(200).json({data: flowers})
    }
    async addFlower(req,res,next) {
        try{
            const { name ,isNew, price, slug, inSale, discount, lastPrice, aboutFlower } = req.body
            const {photo} = req.files
            let filename = uuid.v4() + '.jpg'
            await photo.mv( path.resolve( __dirname, '..', 'static', filename ) )
            const flower = await Flower.create({name, isNew, price, lastPrice, slug, inSale, discount, aboutFlower, photo: filename})
            return res.status(200).json( { flower, message: 'done' })
        } catch ( err ) {
            next(apiError.badRequest(err.message))
        }
    }
    async editFlower(req,res) {

    }
    async deleteFlower(req,res) {

    }
}

module.exports = new FlowerAdminController()