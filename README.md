___
# Parcial de Programación II
- npm init -y
- npm i express
- npm i dotenv
- npm i sequelize mysql2
- npm i sequelize-cli --D
___
- .gitignore ( para ignorar los archivos de Git).  
- .env (Para declarar las variables de entorno)
- .sequelizerc 
___
.gitignore → /node_modules/
___
.env ↓
>DB_USERNAME= root  
DB_PASSWORD=  
DB_HOST= localhost   
DB_DATABASE=parcialCarrito  
DB_PORT=3306  
DB_DIALECT=mysql  
___
.sequelizerc ↓
>const path = require('path')  
module.exports = {  
config: path.resolve('./src/database/config', 'config.js'),  
'models-path': path.resolve('./src/database/models'),  
'seeders-path': path.resolve('./src/database/seeders'),  
'migrations-path': path.resolve('./src/database/migrations'),  
}
___
app.js ↓
>const express = require('express');   
const app = express();   
const path = require('path');   
const PORT = process.env.PORT || 3000   
app.use(express.static(path.resolve(__dirname, '../public')));  
app.use(express.json())  
//URL encode  - Para que nos pueda llegar la información desde el formulario al req.body   
app.use(express.urlencoded({ extended: false }));   
app.use('/', (req, res) => res.json({ clave: "con el server" }));   
app.listen(PORT, () => {   
    console.log('Servidor corriendo en el puerto' + PORT)   
}   
);   
___
Crear public/ y src/   
Crear en src/ → src/app.js y src/routes/ y src/controller/
___
>Ejecutar sequelize-cli init
___
Entrar a src/database/config/config.js y reemplazar todo por ↓
>// Para tomar lo parametros del env   
require('dotenv').config()   
module.exports =   
{   
    "username": process.env.DB_USERNAME,   
    "password": process.env.DB_PASSWORD,   
    "database": process.env.DB_DATABASE,   
    "host": process.env.DB_HOST,   
    "port": process.env.DB_PORT,   
    "dialect": process.env.DB_DIALECT,   
    seederStorage: "sequelize",   
    seederStorageTableName: "seeds",    
    migrationStorage: "sequelize",   
    migrationStorageTableName: "migrations"   
}   
___
>## _**↓↓ Crear todos los modelos intervinientes ↓↓**_
>>sequelize model:generate --name Brand --attributes name:string
>
>>sequelize model:generate --name Category --attributes name:string
>
>>sequelize model:generate --name Size --attributes name:string
>
>>sequelize model:generate --name Gender --attributes type:string
>
> Hicimos brand, category, size y gender, por lo que podemos hacer product:
>>sequelize model:generate --name Product --attributes name:string,price:decimal,brand_id:integer,category_id:integer,size_id:integer,gender_id:integer
>
>>sequelize model:generate --name Image --attributes name:string,product_id:integer 
>
>>sequelize model:generate --name Address --attributes street:string,number:integer
>
>Hicimos address, así que podemos hacer user:
>>sequelize model:generate --name User --attributes first_name:string,last_name:string,username:string,email:string,password:string,addresses_id:integer
>
>>sequelize model:generate --name State --attributes description:string
>
>>sequelize model:generate --name Payment --attributes type:string
>
>Hicimos payment, user y state, por lo que podemos hacer order:
>>sequelize model:generate --name Order --attributes number:integer,date:date,payment_id:integer,user_id:integer,user_addresses_id:integer,states_id:integer
>
>Hicimos order, entonces hacemos shipping:
>>sequelize model:generate --name Shipping --attributes street:string,number:integer,order_id:integer
>
>Hicimos order y product, por lo que podemos hacer la tabla nexo orderDetail:
>>sequelize model:generate --name OrderDetail --attributes quantity:decimal,subtotal:decimal,order_id:integer,product_id:integer
>___
___
### Crear todas las relaciones correpondientes 
>**Modelo Brand**  
static associate(models) {  
      // hasMany  
      Brand.hasMany(models.Product, {  
        foreignKey: 'brand_id',  
        as: "products"  
      })  
    }  

>**Modelo Category**  
static associate(models) {  
      // hasMany  
      Category.hasMany(models.Product, {  
        foreignKey: 'category_id',  
        as: "products"  
      })   
    }    

>**Modelo Size**
static associate(models) {  
      // hasMany  
      Size.hasMany(models.Product, {  
        foreignKey: 'size_id',  
        as: "products"  
      })   
    }

>**Modelo Gender**
static associate(models) {  
      // hasMany  
      Gender.hasMany(models.Product, {  
        foreignKey: 'gender_id',  
        as: "products"  
      })  
    }  

>**Modelo Product**  
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

>**Modelo Image**
static associate(models) {  
      // belongsTo  
      Image.belongsTo(models.Product);      
    }  

>**Modelo Address**  
static associate(models) {  
      // hasOne  
      Address.hasOne(models.User, {  
        foreignKey: 'addresses_id',  
        as: "users"  
      })  
    }

>**Modelo User**
static associate(models) {  
      // belongsTo  
      User.belongsTo(models.Address);  
      // hasMany  
      User.hasMany(models.Order, {  
        foreignKey: 'user_id',  
        as: "orders"  
      })  
    }  

>**Modelo State**
static associate(models) {  
      // hasOne  
      State.hasOne(models.Order, {  
        foreignKey: 'states_id',  
        as: "orders"  
      })  
    }  

>**Modelo Payment**
static associate(models) {  
      // hasOne  
      Payment.hasOne(models.Order, {  
        foreignKey: 'payment_id',  
        as: "orders"  
      })  
    } 

>**Modelo Order**
static associate(models) {  
      // belongsTo  
      Order.belongsTo(models.Payment);  
      // belongsTo  
      Order.belongsTo(models.User);  
      // belongsTo  
      Order.belongsTo(models.State);  
      // hasOne  
      Order.hasOne(models.Shipping, {  
        foreignKey: 'order_id',  
        as: "shippings"  
      })  
      // hasMany  
      Order.hasMany(models.OrderDetail, {  
        foreignKey: 'order_id',  
        as: "orderDetails"  
      })   
    }  

>**Modelo Shipping**  
static associate(models) {  
      // belongsTo  
      Shipping.belongsTo(models.Order);  
    }  

>**Modelo OrderDetail**
static associate(models) {  
      // belongsTo  
      OrderDetail.belongsTo(models.Order);  
      // belongsTo  
      OrderDetail.belongsTo(models.Product);  
    }  
___
#### *AHORA HAY QUE AGREGAR LAS CLAVES FORANEAS A LAS  MIGRACIONES*
>**En la migración de product**  
brand_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'brands',  
          key: 'id'  
        }  
      },  
      category_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'categories',  
          key: 'id'  
        }  
      },  
      size_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'sizes',  
          key: 'id'  
        }  
      },  
      gender_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'genders',  
          key: 'id'  
        }  
      },  
>___
>**En la migración de image**  
product_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'products',  
          key: 'id'  
        }  
      },  
>___
>**En la migración de user**  
addresses_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'addresses',  
          key: 'id'  
        }  
      },  
>___
>**En la migración de order**  
payment_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'payments',  
          key: 'id'  
        }  
      },  
      user_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'users',  
          key: 'id'  
        }  
      },  
      user_addresses_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'addresses',  
          key: 'id'  
        }  
      },  
      states_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'states',  
          key: 'id'  
        }  
      },  
>___
>**En la migración de shipping**  
order_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'orders',  
          key: 'id'  
        }  
      },  
>___
>**En la migración de orderDetail**  
order_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'orders',  
          key: 'id'  
        }  
      },  
      product_id: {  
        type: Sequelize.INTEGER,  
        references: {  
          model: 'products',  
          key: 'id'  
        }  
      },  
>___

### CREAR LA MIGRACION Y CREACION DE LAS TABLAS
- sequelize db:migrate
___
>Y el resultado es así:
>>![Nos queda así](https://raw.githubusercontent.com/Facundo-C/Parcial/main/ImagenDiagramaEER.png)