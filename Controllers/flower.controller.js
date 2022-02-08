const apiError = require('../Error/apiError')

class FlowerController {
    async allFlowers(req,res) {
        res.status(200).json({message: 'all'})
    }

    async getOne(req,res,next) {
        const { slug } = req.params
        if(!slug){
            return next(apiError.badRequest('Slug not found'))
        }
        return res.status(200).json(slug)
    }

}

module.exports = new FlowerController()