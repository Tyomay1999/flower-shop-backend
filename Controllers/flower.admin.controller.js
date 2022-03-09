const apiError = require( '../Error/apiError' )
const { Flower, Categories } = require( '../Models/model' )
const fs = require( 'fs' )
const path = require( 'path' )
const uuid = require( 'uuid' )
const sequelize = require( 'sequelize' )
const { Op } = require( "sequelize" );


class FlowerAdminController {
    async getAll( req, res, next ) {
        try {
            let { category_id, prices, limit, page } = req.body
            // console.log(typeof category_id)
            prices = prices || [ 0, 15 ]
            limit = limit || 10
            page = page || 1
            const offset = page * limit - limit
            if ( category_id && !prices.length ) {
                const category = await Categories.findOne( { where: { id: category_id } } )
                const flowers = await Flower.findAndCountAll( {
                    where: {
                        id: {
                            [ Op.or ]: category.flower_ids
                        }
                    },
                    limit,
                    offset
                } )
                console.log( 'line 30 fl.ad.co', offset , '<-offset', page, '<-page', limit,'<-limit' )
                return res.status( 200 ).json( { count: flowers.count, flowers: flowers.rows } )
            }
            if ( !category_id && prices.length ) {
                // prices = JSON.parse(prices)
                const categories = await Categories.findAll()
                const filteredFlowers = []
                const flowers = await Flower.findAndCountAll( {
                    where: {
                        price: {
                            [ Op.gte ]: prices[0],
                            [ Op.lte ]: prices[1],
                        }
                    },
                    limit,
                    offset
                } )
                flowers.rows.map( async ( product ) => {
                    if ( product.categories.length ) {
                        const categoriesArray = []
                        product.categories.forEach( categoryId => {
                            categoriesArray.push( categories.filter( category => category.id === categoryId )[0]?.name )
                        } )
                        product.categories = categoriesArray
                    }
                } )
                // flowers.rows.forEach( flower => {
                //     if ( prices[ 0 ] < flower.price && flower.price < prices[ 1 ] ) {
                //         filteredFlowers.push( { flower } )
                //     }
                // } )
                console.log( 'line 42 fl.ad.co', offset , '<-offset', page, '<-page', limit,'<-limit' )
                return res.status( 200 ).json( { count: flowers.count, flowers: flowers.rows } )
            }
            if ( category_id && prices.length ) {

                // prices = JSON.parse(prices)
                const filteredFlowers = []
                const category = await Categories.findOne( { where: { id: category_id } } )
                const flowers = await Flower.findAndCountAll( {
                    where: {
                        id: {
                            [ Op.or ]: category.flower_ids
                        }
                    },
                    limit,
                    offset
                } )
                flowers.rows.forEach( flower => {
                    if ( prices[ 0 ] < flower.price && flower.price < prices[ 1 ] ) {
                        filteredFlowers.push( flower )
                    }
                } )
                console.log( 'line 59 fl.ad.co', offset , '<-offset', page, '<-page', limit,'<-limit' )
                return res.status( 200 ).json( { count: flowers.count, flowers: filteredFlowers } )
            }
            if ( !category_id && !prices.length ) {
                const flowers = await Flower.findAndCountAll( { limit, offset } )
                console.log( 'line 69 fl.ad.co', offset , '<-offset', page, '<-page', limit,'<-limit' )
                // console.log(flowers,"<-------flowers")
                return res.status( 200 ).json( { count: flowers.count, flowers: flowers.rows } )
            }
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }

    }
    async getNewFlowers (req,res,next){
        try {
            const flowers = await Flower.findAll({
                where: {
                    isNew: true
                }
            })
            res.status(200).json({flowers})
        } catch (error){
            next(apiError.badRequest(error.message))
        }
    }
    async addFlower( req, res, next ) {
        try {
            let { name, isNew, price, slug, inSale, discount, lastPrice, aboutFlower, tags, categories } = req.body
            const { photo } = req.files
            let filename = uuid.v4() + '.jpg'
            await photo.mv( path.resolve( __dirname, '..', 'static', filename ) )
            categories = JSON.parse( categories )
            tags = JSON.parse( tags )
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
            categories = JSON.parse( categories )
            tags = JSON.parse( tags )
            let filename = ''
            if ( req.files ) {
                const { photo } = req.files
                filename = uuid.v4() + '.jpg'
                await photo.mv( path.resolve( __dirname, '..', 'static', filename ) )
                const flower = await Flower.findOne( { where: { id } } )
                if(path.resolve( __dirname, '..', 'static', flower.photo)){
                    await fs.unlink( path.resolve( __dirname, '..', 'static', flower.photo ), error => {
                        if ( error ) {
                            return next( apiError.badRequest( error.message ) )
                        }
                    } )
                }
            }
            const flower = await Flower.update( {
                name,
                isNew,
                price,
                slug,
                inSale,
                photo: filename || req.body.photo,
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
            // console.log(typeof id, Array.isArray(categories))
            const flower = await Flower.findOne( { where: { id } } )
            await fs.unlink( path.resolve( __dirname, '..', 'static', flower.photo ), error => {
                if ( error ) {
                    return next( apiError.badRequest( error.message ) )
                }
            } )
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

    async getFlowersWithIds(req, res, next) {
        try {
            const {flowerIds} = req.body
            let flowers = await Flower.findAll({
                where: {
                    id: {
                        [Op.or] : JSON.parse(flowerIds)
                    }
                }
            })
            return res.status(200).json({flowers})
        } catch (error) {
            next(apiError.badRequest(error.message))
        }
    }
}

module.exports = new FlowerAdminController()