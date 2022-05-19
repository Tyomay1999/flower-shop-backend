const apiError = require( '../Error/apiError' )
const { Categories } = require( "../Models/model" );

class CategoriesAdminController {
    async getAllCategories( req, res ) {
        const categories = await Categories.findAll()
        return res.status( 200 ).json( { categories, admin: req.admin } )
    }

    async addCategory( req, res, next ) {
        try {
            const { name } = req.body
            const category = await Categories.create( { name } )
            return res.status( 200 ).json( category )

        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }

    }

    async editCategory( req, res, next ) {
        try {
            const { id,name } = req.body
            const category = await Categories.update({name}, {where: {id}})
            return res.status(200).json(category)
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }

    async deleteCategory( req, res, next) {
        try {
            const {id} = req.body
            const category = await Categories.destroy({where: {id}})
            return res.status(200).json({category})
        } catch ( error ) {
            next(apiError.badRequest(error.message))
        }
    }
}

module.exports = new CategoriesAdminController()