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
            const flowers = await Flower.findAll()
            return res.status(200).json({flowers})
        } catch (error) {
            next(apiError.badRequest(error.message))
        }
        res.status(200).json({message: 'all'})
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
            const {categories} = req.body
            const similarFlowersCategories = await Categories.findAll({
                where: {
                    id: {
                        [Op.or]: JSON.parse(categories)
                    }
                }
            })
            const flowersId = await handlerIdSorts(similarFlowersCategories)
            const data = await Flower.findAll({
                where: {
                    id: {
                        [Op.or]: flowersId
                    }
                }
            })
            return res.status(200).json({similarFlowers: data})
        } catch (error) {
            next(apiError.badRequest(error.message))
        }
    }

    async getNewFlowers(req, res, next) {
        try {
            const newFlowers = await Flower.findAll({where: {isNew: true}})
            return res.status(200).json({newFlowers})
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
}

module.exports = new FlowerController()