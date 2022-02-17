const apiError = require( '../Error/apiError' )
const { Flower, Categories } = require( '../Models/model' )
const fs = require( 'fs' )
const path = require( 'path' )
const uuid = require( 'uuid' )
const sequelize = require( 'sequelize' )
const { Op } = require( "sequelize" );
const { rows } = require( "pg/lib/defaults" );

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
    async getAll( req, res, next ) {
    try{
        let { category_id, prices, limit, page } = req.body
        prices = prices || [0, 15]
        limit = limit || 10
        page = page || 1
        const offset = page * limit - limit
        if(category_id && !prices.length){
            const category = await Categories.findOne({where: {id: category_id}})
            const flowers = await Flower.findAndCountAll({
                where: {
                    id: {
                        [Op.or] : category.flower_ids
                    }
                },
                limit,
                offset
            })
            return res.status(200).json({count: flowers.count,flowers: flowers.rows})
        }
        if(!category_id && prices.length){
            prices = JSON.parse(prices)
            const filteredFlowers = []
            const flowers = await Flower.findAndCountAll({ limit, offset })
             flowers.rows.forEach(flower => {
                if(prices[0] < flower.price && flower.price < prices[1]) {
                   filteredFlowers.push({flower})
                }
            })
            return res.status(200).json({count: flowers.count,flowers: filteredFlowers})
        }
        if(category_id && prices.length){
            prices = JSON.parse(prices)
            const filteredFlowers = []
            const category = await Categories.findOne({where: {id: category_id}})
            const flowers = await Flower.findAndCountAll({
                where: {
                    id: {
                        [Op.or] : category.flower_ids
                    }
                },
                limit,
                offset
            })
            flowers.rows.forEach(flower => {
                if(prices[0] < flower.price && flower.price < prices[1]) {
                    filteredFlowers.push(flower)
                }
            })
            return res.status(200).json({count: flowers.count,flowers: filteredFlowers})
        }
        if(!category_id && !prices.length){
            const flowers = await Flower.findAndCountAll({limit,offset})
            return res.status(200).json({count: flowers.count, flowers: flowers.rows})
        }
    } catch ( error ) {
        next(apiError.badRequest(error.message))
    }

    }

    async addFlower( req, res, next ) {
        try {
            let { name, isNew, price, slug, inSale, discount, lastPrice, aboutFlower, tags, categories } = req.body
            const { photo } = req.files
            let filename = uuid.v4() + '.jpg'
            await photo.mv( path.resolve( __dirname, '..', 'static', filename ) )
            // categories = JSON.parse(categories)
            // tags = JSON.parse(tags)
            categories = [ 1, 2, 6, 9 ]
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
            const flower = await Flower.findOne( { where: { id } } )
            await fs.unlink( path.resolve( __dirname, '..', 'static', flower.photo ), error => {
                apiError.badRequest(error.message)
            } )
            // categories = JSON.parse(categories)
            categories = [ 1, 2 ]
            await Flower.destroy( { where: { id } } )
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
            return res.status( 200 ).json( { message: 'Flower was deleted' } )
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }
}

module.exports = new FlowerAdminController()