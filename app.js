// Citation for the app.js file
// Date: 3/1/24
// Based on the code provided in CS 340 // nodejs_starter_app
// This code was copied and modified for CRUD operations
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

var express = require('express');                                       
var app     = express();                                                

// Configure Express
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));
PORT        = 3016;                                                     

// Define database (not visible in GitHub)
var db = require('./database/db-connector')

// Configure Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');                             
app.engine('.hbs', engine({extname: ".hbs"}));                          
app.set('view engine', '.hbs');                                         

// Get Routes
app.get('/', function(req, res)
{  
    let query1 = "SELECT * FROM Customers ORDER BY customerID;";                
    db.pool.query(query1, function(error, rows, fields){            

        // Assign rows from query result to a variable named data (which will be passed to the redered page)
        res.render('index', {data: rows});                          
    })                                                              
});                                                                 

app.get('/customers', function(req, res)
{  
    let query1 = "SELECT * FROM Customers ORDER BY customerID;";       
    db.pool.query(query1, function(error, rows, fields){        
        res.render('customers', {data: rows});                          
    })
});  

app.get('/orders', function(req, res)
{  
    let query1 =  "SELECT orderID, DATE_FORMAT(orderDate, '%m-%d-%y') AS orderDate, Orders.customerID, Customers.firstName AS firstName, Customers.lastName AS lastName FROM Orders LEFT JOIN Customers ON Orders.customerID = Customers.customerID ORDER BY orderID;"         
    let query2 = "SELECT customerID, firstName, lastName from Customers;"

    // First, query the database for a list of customerIDs, first and last names. Store data in rows2.
    db.pool.query(query2, function(error, rows2, fields){                                   

        // Second, query the database for the Orders table. Store data in rows1.
        db.pool.query(query1, function(error, rows1, fields){            

            // Render the webpage and pass 2 variables: orders and customers. 
            res.render('orders', {data: {orders: rows1, customers: rows2} });                          
        })                                                              
    })     
});  

app.get('/orderItems', function(req, res)
{  
    let query1 = "SELECT * FROM OrderItems ORDER BY orderItemID;"  
    let query2 = "SELECT albumID, name FROM Albums;" 
    let query3 = "SELECT orderID FROM Orders ORDER BY orderID;"      

    // Execute a triple-nested query, beginning with query1.
    // Data from each query is stored within the respective 'rows#' variable.
    db.pool.query(query1, function(error, rows1, fields){                                   
        db.pool.query(query2, function(error, rows2, fields){   
            db.pool.query(query3, function(error, rows3, fields){   
                res.render('orderItems', {data: {orderItems: rows1, albums: rows2, orders: rows3} });                          
            })                  
        })                                                              
    })                                                                  
});  

app.get('/albums', function(req, res)
{  
    let query1 = "SELECT albumID, name, price, DATE_FORMAT(releaseDate, '%m-%d-%y') AS releaseDate, stock FROM Albums ORDER BY albumID;"                           
    db.pool.query(query1, function(error, rows, fields){            
        res.render('albums', {data: rows});                          
    })                                                              
});  

app.get('/songs', function(req, res)
{  
    let query1 = "SELECT songID, track, name, RIGHT(SEC_TO_TIME(length), 5) AS length, composerID, albumID FROM Songs ORDER BY songID;"  
    let query2 = "SELECT albumID, name from Albums ORDER BY albumID;" 
    let query3 = "SELECT composerID, firstName, lastName FROM Composers ORDER BY composerID;"      

    // Execute a triple-nested query, beginning with query1.
    // Data from each query is stored within the respective 'rows#' variable.
    db.pool.query(query1, function(error, rows1, fields){                                   
        db.pool.query(query2, function(error, rows2, fields){   
            db.pool.query(query3, function(error, rows3, fields){      
                res.render('songs', {data: {songs: rows1, albums: rows2, composers: rows3} });                          
            })                  
        })                                                              
    })                                                                  
});  

app.get('/composers', function(req, res)
{  
    let query1 = "SELECT * FROM Composers ORDER BY composerID;";        
    db.pool.query(query1, function(error, rows, fields){            
        res.render('composers', {data: rows});                          
    })
});  




// Post routes.
// These routes allow a user to submit data back to the server.
// Add - POST routes that use HTML forms to add new data rows to a database table.
app.post('/add-customer-form', function(req, res){
    
    // Assign the data submitted via POST by add-customer-form.
    let data = req.body;
    let query1 = `INSERT INTO Customers (firstName, lastName, street, city, state, postalCode, email, phone) VALUES ('${data['input-firstName']}', '${data['input-lastName']}', '${data['input-street']}', '${data['input-city']}', '${data['input-state']}', '${data['input-postalCode']}', '${data['input-email']}', '${data['input-phone']}')`;

    db.pool.query(query1, function(error, rows, fields){
        if (error) 
            res.sendStatus(400);
        else
            res.redirect('/customers');
    })
})

app.post('/add-order-form', function(req, res){
    
    let data = req.body;
    let query1 = `INSERT INTO Orders (orderDate, customerID) VALUES ('${data['input-orderDate']}', '${data['input-customerID']}')`;
    if (data['input-customerID'] == "NULL") {
        query1 = `INSERT INTO Orders (orderDate, customerID) VALUES ('${data['input-orderDate']}', NULL)`;
    }  

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/orders');
    })
})

app.post('/add-orderItem-form', function(req, res){
    
    let data = req.body;
    query1 = `INSERT INTO OrderItems (quantity, taxes, returned, orderID, albumID) 
    VALUES ('${data['input-quantity']}', '${data['input-taxes']}', '${data['input-returned']}', '${data['input-orderID']}', '${data['input-albumID']}')`;

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/orderItems');

    })
})

app.post('/add-album-form', function(req, res){
    
    let data = req.body;
    query1 = `INSERT INTO Albums (name, price, releaseDate, stock) VALUES ('${data['input-name']}', '${data['input-price']}', '${data['input-releaseDate']}', '${data['input-stock']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/Albums');

    })
})

app.post('/add-song-form', function(req, res){
    
    let data = req.body;
    query1 = `INSERT INTO Songs (track, name, length, composerID, albumID) 
    VALUES ('${data['input-track']}', '${data['input-name']}', '${data['input-length']}', '${data['input-composerID']}', '${data['input-albumID']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/Songs');
        
    })
})

app.post('/add-composer-form', function(req, res){
    
    let data = req.body;
    query1 = `INSERT INTO Composers (firstName, lastName) VALUES ('${data['input-firstName']}', '${data['input-lastName']}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/composers');
    })
})


// Update - POST routes that use HTML forms to update existing data within a database table.
app.post('/update-customer-form', function(req, res){
    
    let data = req.body;
    query = `UPDATE Customers 
    SET
        firstName = '${data['update-firstName']}',
        lastName = '${data['update-lastName']}',
        street = '${data['update-street']}',
        city = '${data['update-city']}',
        state = '${data['update-state']}',
        postalCode = '${data['update-postalCode']}',
        email = '${data['update-email']}',
        phone = '${data['update-phone']}'
    WHERE customerID = ${data['update-customerID']}`;

    db.pool.query(query, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/customers');
    })
})

app.post('/update-order-form', function(req, res){
    
    let data = req.body;

    let query1 = `UPDATE Orders SET orderDate = '${data['update-orderDate']}', customerID = '${data['update-customerID']}' WHERE orderID = ${data['update-orderID']}`;

    // Adjust query to handle any NULL values.
    if (data['update-customerID'] == "NULL") {
        query1 = `UPDATE Orders SET orderDate = '${data['update-orderDate']}', customerID = NULL WHERE orderID = ${data['update-orderID']}`;
    }

    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/orders');
    })
})

app.post('/update-orderItem-form', function(req, res){
    
    let data = req.body;
    orderItemID = data['update-orderItemID'];
    orderID = data['update-orderID'];
    albumID = data['update-albumID'];

    query = `UPDATE OrderItems
    SET quantity = '${data['update-quantity']}', taxes = '${data['update-taxes']}', returned = '${data['update-returned']}', 
    orderID = '${orderID}', albumID = '${albumID}' WHERE orderItemID = '${orderItemID}'`;
    db.pool.query(query, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }else
            res.redirect('/orderItems');
    })
})

app.post('/update-album-form', function(req, res){
    
    let data = req.body;
    albumID = data['update-albumID']

    query = `UPDATE Albums
    SET name = '${data['update-name']}', price = '${data['update-price']}', releaseDate = '${data['update-releaseDate']}', stock = '${data['update-stock']}' 
    WHERE albumID = '${albumID}'`;
    db.pool.query(query, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/albums');
    })
})

app.post('/update-song-form', function(req, res){
    
    let data = req.body;
    query = `UPDATE Songs
    SET track = '${data['update-track']}', name = '${data['update-name']}', length = '${data['update-length']}', composerID = '${data['update-composerID']}', albumID = '${data['update-albumID']}' 
    WHERE songID = '${data['update-songID']}'`;

    db.pool.query(query, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/songs');
    })
})

app.post('/update-composer-form', function(req, res){
    
    let data = req.body;

    query = `UPDATE Composers
    SET firstName = '${data['update-firstName']}', lastName = '${data['update-lastName']}'
    WHERE composerID = '${data['update-composerID']}'`;
    db.pool.query(query, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        } else
            res.redirect('/composers');
    })
})


// Delete routes.
// Each table has a delete button, which triggers a linked 'delete_table.js' file.
// That file contains function definitions for deleting via AJAX.
app.delete('/delete-customer-ajax/', function(req,res,next){
    let data = req.body;
    let customerID = parseInt(data.id);
    let deleteCustomerID = `DELETE FROM Customers WHERE customerID = ?`;
        db.pool.query(deleteCustomerID, [customerID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
})});

app.delete('/delete-order-ajax/', function(req,res,next){
let data = req.body;
let orderID = parseInt(data.id);
let deleteOrderID = `DELETE FROM Orders WHERE orderID = ?`;
        db.pool.query(deleteOrderID, [orderID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
})});

app.delete('/delete-orderItem-ajax/', function(req,res,next){
    let data = req.body;
    let orderItemID = parseInt(data.id);
    let deleteOrderItemID = `DELETE FROM OrderItems WHERE orderItemID = ?`;
            db.pool.query(deleteOrderItemID, [orderItemID], function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
})});

app.delete('/delete-album-ajax/', function(req,res,next){
    let data = req.body;
    let albumID = parseInt(data.id);
    let deleteAlbumID = `DELETE FROM Albums WHERE albumID = ?`;
            db.pool.query(deleteAlbumID, [albumID], function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
    })});

app.delete('/delete-song-ajax/', function(req,res,next){
    let data = req.body;
    let songID = parseInt(data.id);
    let deleteSongID = `DELETE FROM Songs WHERE songID = ?`;
            db.pool.query(deleteSongID, [songID], function(error, rows, fields){
                if (error) 
                {
                    console.log(error);
                    res.sendStatus(400);
                }
    })});

app.delete('/delete-composer-ajax/', function(req,res,next){
    let data = req.body;
    let composerID = parseInt(data.id);
    let deleteComposerID = `DELETE FROM Composers WHERE composerID = ?`;
            db.pool.query(deleteComposerID, [composerID], function(error, rows, fields){
                if (error) 
                {
                    console.log(error);
                    res.sendStatus(400);
                }
    })});
    
    
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
