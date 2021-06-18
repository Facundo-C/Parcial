'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // belongsTo  
      Product.belongsTo(models.Brand);  
      // belongsTo  
      Product.belongsTo(models.Category);  
      // belongsTo  
      Product.belongsTo(models.Size);  
      // belongsTo  
      Product.belongsTo(models.Gender);    
      // hasMany  
      Product.hasMany(models.Image, {  
        foreignKey: 'product_id',  
        as: "images"  
      })  
      Product.hasOne(models.OrderDetail, {  
        foreignKey: 'product_id',  
        as: "orderDetails"  
      })  
    }
  };
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    brand_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    gender_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};