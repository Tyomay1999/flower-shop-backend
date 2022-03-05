// const apiError = require( '../Error/apiError' )
const { Categories } = require( "../Models/model" );

class CategoriesController {
    async getAllCategories( req, res ) {
        const categories = await Categories.findAll()
        return res.status( 200 ).json( { categories } )
    }

}

module.exports = new CategoriesController()