const sequelize = require( '../db' )
const { INTEGER, BOOLEAN, STRING, ARRAY, TEXT, NUMBER } = require( "sequelize" );


const Flower = sequelize.define( 'flower', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING, allowNull: false },
    isNew: { type: BOOLEAN, allowNull: false },
    photo: { type: STRING, allowNull: false },
    price: { type: INTEGER, allowNull: false },
    slug: { type: STRING, allowNull: false },
    inSale: { type: INTEGER, allowNull: false },
    discount: { type: INTEGER, allowNull: false },
    lastPrice: { type: INTEGER, allowNull: false },
    aboutFlower: { type: STRING, allowNull: false },
    tags: { type: ARRAY( STRING ), allowNull: true },
    categories: { type: ARRAY( INTEGER ), allowNull: true },
} )

const Categories = sequelize.define( 'categories', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING, allowNull: false },
    flower_ids: { type: ARRAY( INTEGER ), allowNull: true },
} )

const CustomerMessages = sequelize.define( 'customer_messages', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING, allowNull: false },
    email: { type: STRING, allowNull: false },
    phone: { type: STRING, allowNull: false },
    message: { type: STRING, allowNull: true }
} )

const Orders = sequelize.define( 'orders', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    status: { type: INTEGER, allowNull: false },
    email: { type: STRING, allowNull: true },
    phone: { type: STRING, allowNull: false },
    address: { type: STRING, allowNull: false },
    firstName: { type: STRING, allowNull: false },
    lastName: { type: STRING, allowNull: true },
    deliveryTime: { type: STRING, allowNull: false },
    deliveryDate: { type: STRING, allowNull: false },
    personalMessage: { type: STRING, allowNull: true },
    flowers_ids: {type: TEXT, allowNull: false}
} )

// const ShippingDetails = sequelize.define('shippingDetails',{
//        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
// })

const Admins = sequelize.define( 'admins', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: STRING, allowNull: true },
    status: { type: INTEGER, allowNull: true },
    password: {type: STRING, allowNull: false}
} )


Flower.hasMany( Categories, { as: 'category' } )
Categories.belongsTo( Flower )

module.exports = {
    Flower,
    Categories,
    CustomerMessages,
    Orders,
    Admins
}