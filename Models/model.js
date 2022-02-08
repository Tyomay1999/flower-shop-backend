const sequelize = require('../db')
const { INTEGER, BOOLEAN, STRING } = require( "sequelize" );

// {
//     id: 59,
//         name: 'Flower name',
//     photo: cardLocalImages.product9,
//     price: 12.99,
//     lastPrice: 15.99,
//     discount: 20,
//     isNew: false,
//     slug: uuidv4(),
//     tags: ['color', 'type', 'single', 'bouquet'],
//     aboutFlower: `
//             Lorem50 ipsum dolor sit amet, consectetur adipisicing elit.
//             Accusantium alias assumenda deleniti eos id ipsa labore laborum
//             reiciendis, sapiente soluta, suscipit tenetur voluptas. Asperiores
//             aspernatur dignissimos, ea eligendi eum explicabo fugit harum in
//             mollitia, neque nulla quasi qui rerum sapiente, tempora unde vitae
//             voluptas voluptate. Doloremque in similique ullam! Ut.
//           `
// }

const Flower = sequelize.define('flower',{
        id: { type: INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: STRING, allowNull: false},
        isNew: {type: BOOLEAN, allowNull: false},
        photo: {type: STRING, allowNull: false},
        price: {type: INTEGER, allowNull: false},
        slug: {type: STRING, allowNull: false},
        inSale: {type: INTEGER, allowNull: false},
        discount: {type: INTEGER, allowNull: false},
        lastPrice: {type: INTEGER, allowNull: false},
        aboutFlower: {type: STRING, allowNull: false},
})

const Categories = sequelize.define('categories',{
        id: { type: INTEGER, primaryKey: true, autoIncrement: true},
        name: { type: STRING, allowNull: false},
})

Flower.hasOne(Categories)


module.exports = {
        Flower,Categories
}