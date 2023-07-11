const mysql = require('mysql2/promise');

module.exports = {
    connectToDb : async function(){
        try{
            connection = await mysql.createConnection({host:'localhost', user: 'root', password:'root',database: 'blogapp'})
            console.log("Connection to the database successful")
            return connection
        }catch(err){
            console.log("Error connecting to the database")
            throw err
        }
    }
}