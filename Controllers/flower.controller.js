const apiError = require('../Error/apiError')
const {Categories, Flower} = require("../Models/model");
const {Op} = require('sequelize')

//TODO need to change
const handlerIdSorts = async data => {
    const idsArray = []
    data.forEach(item => {
        item.flower_ids?.forEach(id => {
            if (idsArray.length) {
                let haveId = 0;
                idsArray.forEach(selectedId => {
                    if (selectedId === id) {
                        haveId = 1
                    }
                })
                if (!haveId) {
                    idsArray.push(id)
                }
            }
            if (!idsArray.length) {
                idsArray.push(id)
            }
        })
    })
    return idsArray;
}


class FlowerController {
    async allFlowers(req, res, next) {
        try {
            let { category_id, prices, limit, page } = req.body
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
                const categories = await Categories.findAll()
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
                console.log( 'line 42 fl.ad.co', offset , '<-offset', page, '<-page', limit,'<-limit' )
                return res.status( 200 ).json( { count: flowers.count, flowers: flowers.rows } )
            }
            if ( category_id && prices.length ) {
                const category = await Categories.findOne( { where: { id: category_id } } )
                const flowers = await Flower.findAndCountAll( {
                    where: {
                        id: {
                            [ Op.or ]: category.flower_ids
                        },
                        price: {
                            [ Op.gte ]: prices[0],
                            [ Op.lte ]: prices[1],
                        }
                    },
                    limit,
                    offset
                } )
                console.log( 'line 59 fl.ad.co', offset , '<-offset', page, '<-page', limit,'<-limit', prices, "<-prices" )
                return res.status( 200 ).json( { count: flowers.count, flowers: flowers.rows } )
            }
            if ( !category_id && !prices.length ) {
                const flowers = await Flower.findAndCountAll( { limit, offset } )
                console.log( 'line 69 fl.ad.co', offset , '<-offset', page, '<-page', limit,'<-limit' )
                return res.status( 200 ).json( { count: flowers.count, flowers: flowers.rows } )
            }
        } catch ( error ) {
            next( apiError.badRequest( error.message ) )
        }
    }
    async getByIds (req, res, next) {
        try {
            let flowers = []
            if(req.body.flower_ids?.length){
                flowers = await Flower.findAll({
                    where: {
                        id: {
                            [Op.or]: JSON.parse(req.body.flower_ids)
                        }
                    }
                })
                return res.status(200).json({flowers})
            }
        } catch ( error ) {
            next(apiError.badRequest(error.message))
        }
    }
    async getSimilar(req, res, next) {
        console.log(req.body.categories,'<------categories')
        try {
            const {categories, page, limit = 6} = req.body
            const offset = page * limit - limit
            const similarFlowersCategories = await Categories.findAll({
                where: {
                    id: {
                        [Op.or]: JSON.parse(categories)
                    }
                }
            })
            const flowersId = await handlerIdSorts(similarFlowersCategories)
            const data = await Flower.findAndCountAll({
                where: {
                    id: {
                        [Op.or]: flowersId
                    }
                },
                limit,
                offset
            })
            return res.status(200).json({count: data.count ,similarFlowers: data.rows})
        } catch (error) {
            next(apiError.badRequest(error.message))
        }
    }

    async getNewFlowers(req, res, next) {
        try {
            let { limit, page } = req.body
            limit = limit || 9;
            page = page || 1;
            const offset = page * limit - limit
            const newFlowers = await Flower.findAndCountAll({
                where: { isNew: true },
                limit,
                offset
            })
            return res.status(200).json({count: newFlowers.count, flowers: newFlowers.rows})
        } catch (error) {
            next(apiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {slug} = req.params
            if (!slug) {
                return next(apiError.badRequest('Slug not found'))
            }
            const flower = await Flower.findOne({where: {slug}})
            return res.status(200).json({flower})
        } catch (error) {
            next(apiError.badRequest(error.message))
        }
    }

    async getFlowersWithIds(req, res, next) {
        try {
            const {flowerIds} = req.body
            console.log(JSON.parse(flowerIds))
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

    async getSearchedFlowers (req, res, next){
        try {
            const {name} = req.body
            console.log(name,'name')
            let flowers = await Flower.findAndCountAll({
                where: {
                    name: name
                }
            })
            return res.status(200).json({count: flowers.count ,flowers: flowers.rows})
        } catch (error) {
            next(apiError.badRequest(error.message))
        }
    }
}

module.exports = new FlowerController()