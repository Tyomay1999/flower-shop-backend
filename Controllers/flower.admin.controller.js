const apiError = require( '../Error/apiError' )
const { Flower, Categories } = require( '../Models/model' )
const path = require( 'path' )
const uuid = require( 'uuid' )
const sequelize = require( 'sequelize' )
const { Op } = require( "sequelize" );

// categories = JSON.parse(categories)
// console.log(typeof JSON.parse(tags))
// if(tags.length){
//     tags = JSON.parse(tags)
// }
// let x = await Categories.findAll({
//     where: {
//         id: {
//             [Op.or]: [1,2]
//         }
//     }
// })
// let x = await Categories.update(
//     {flower_ids: sequelize.fn('array_append', sequelize.col('flower_ids'), 4)}
//     ,{
//     where: {
//         id: {
//             [Op.or]: [1,2]
//         }
//     }
// })
// let x = await Categories.update(
//     {flower_ids: sequelize.fn('array_remove', sequelize.col('flower_ids'), 1)}
//     ,{
//         where: {
//             id: {
//                 [Op.or]: [1,2]
//             }
//         }
//     })


class FlowerAdminController {
    async getAll( req, res ) {
        const flowers = await Flower.findAll()
        return await res.status( 200 ).json( { data: flowers } )
    }

    async addFlower( req, res, next ) {
        try {
            let { name, isNew, price, slug, inSale, discount, lastPrice, aboutFlower, tags, categories } = req.body
            const { photo } = req.files
            let filename = uuid.v4() + '.jpg'
            await photo.mv( path.resolve( __dirname, '..', 'static', filename ) )
            // categories = JSON.parse(categories)
            // tags = JSON.parse(tags)
            categories = [ 1, 2, 3 ]
            tags = [ 'tag1', 'tag2', 'tag3', 'tag4' ]
            const flower = await Flower.create( {
                name,
                isNew,
                price,
                lastPrice,
                slug,
                inSale,
                discount,
                aboutFlower,
                photo: filename,
                tags,
                categories
            } )
            if ( categories.length ) {
                await Categories.update(
                    { flower_ids: sequelize.fn( 'array_append', sequelize.col( 'flower_ids' ), flower.id ) },
                    {
                        where: {
                            id: {
                                [ Op.or ]: categories
                            }
                        }
                    }
                )
            }
            return res.status( 200 ).json( { flower, message: 'done' } )
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }

    async editFlower( req, res, next ) {
        try {
            let { id, name, isNew, price, slug, inSale, discount, lastPrice, aboutFlower, tags, categories } = req.body
            // categories = JSON.parse(categories)
            // tags = JSON.parse(tags)
            tags = [ 'tags1', 'tags2' ]
            categories = [ 1, 2, 3, 4 ]
            const flower = await Flower.update( {
                name,
                isNew,
                price,
                slug,
                inSale,
                discount,
                lastPrice,
                aboutFlower,
                tags,
                categories
            }, { where: { id } } )
            if ( categories.length ) {
                await Categories.update(
                    { flower_ids: sequelize.fn( 'array_append', sequelize.col( 'flower_ids' ), id ) },
                    {
                        where: {
                            id: {
                                [ Op.or ]: categories
                            }
                        }
                    }
                )
            }
            return res.status( 200 ).json( { flower, message: 'done' } )
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }

    async deleteFlower( req, res, next ) {
        try {
            let { id, categories } = req.body
            // categories = JSON.parse(categories)
            categories = [ 1, 2 ]
            const flower = await Flower.destroy( { where: { id } } )
            await Categories.update(
                { flower_ids: sequelize.fn( 'array_remove', sequelize.col( 'flower_ids' ), id ) },
                {
                    where: {
                        id: {
                            [ Op.or ]: categories
                        }
                    }
                }
            )
            return res.status( 200 ).json( { flower } )
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }
}

module.exports = new FlowerAdminController()