// Citation for the app.js file
// Date: 3/1/24
// Based on the code provided in CS 340 // nodejs_starter_app
// This code was copied and modified for CRUD operations
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app


// App.js
// http://flip3.engr.oregonstate.edu:3016/




/*
    SETUP
*/




var express = require('express');                                       // We are using the express library for the web server.
var app     = express();                                                // We need to instantiate an express object to interact with the server in our code.

// Step 5: Configuring Express to Handle JSON and Form Data - REQUIRED
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));

PORT        = 3016;                                                     // Set a port number at the top so it's easy to change in the future.

// Step 1: Create the database
var db = require('./database/db-connector')

// Step 3: Modify app.js to use Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');                             // Import express-handlebars.
app.engine('.hbs', engine({extname: ".hbs"}));                          // Create an instance of the handlebars engine to process templates.
app.set('view engine', '.hbs');                                         // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



/*
    ROUTES
*/




// GET routes for each page of the website. 
// When a user nagivates to the page, a query will be executed and the results are saved to 'data'.
// The respective page is rendered and has access to the data from the query.
app.get('/', function(req, res)
{  
    // Define an SQL query that retrieves all information from the table.
    let query1 = "SELECT * FROM Customers ORDER BY customerID;";                

    // Execute the query.
    db.pool.query(query1, function(error, rows, fields){            

        // After submitting a successful query, respond by rendering the index HTML page.
        // The data from the query is stored in the 'rows' variable.
        // 'data' is passed to the HTML page as a local variable to access and use.
        res.render('index', {data: rows});                          
    })                                                              
});                                                                 

app.get('/customers', function(req, res)
{  
    // Define an SQL query that retrieves all information from the table.
    let query1 = "SELECT * FROM Customers ORDER BY customerID;";       

     // Execute the query.
    db.pool.query(query1, function(error, rows, fields){            

        // After submitting a successful query, respond by rendering the customers HTML page.
        // The data from the query is stored in the 'rows' variable.
        // 'data' is passed to the HTML page as a local variable to access and use.
        res.render('customers', {data: rows});                          
    })
});  

app.get('/orders', function(req, res)
{  
    // Define two SQL queries that retrieve the required information from the Orders and Customers tables.
    let query1 =  "SELECT orderID, DATE_FORMAT(orderDate, '%m-%d-%y') AS orderDate, Orders.customerID, Customers.firstName AS firstName, Customers.lastName AS lastName FROM Orders LEFT JOIN Customers ON Orders.customerID = Customers.customerID ORDER BY orderID;"         
    let query2 = "SELECT customerID, firstName, lastName from Customers;"

    // First, query the database for a list of customerIDs, first and last names. Store data in rows2.
    db.pool.query(query2, function(error, rows2, fields){                                   

        // Second, query the database for the Orders table. Store data in rows1.
        db.pool.query(query1, function(error, rows1, fields){            

            // Render the webpage and pass 2 variables: orders and customers. 
            // This allows the HTML forms to access the query data of 2 separate queries. 
            res.render('orders', {data: {orders: rows1, customers: rows2} });                          
        })                                                              
    })     
});  

app.get('/orderItems', function(req, res)
{  
    // Define three SQL queries that retrieve the required information from the OrderItems, Albums, and Orders tables.
    let query1 = "SELECT * FROM OrderItems ORDER BY orderItemID;"  // Define our query
    let query2 = "SELECT albumID, name FROM Albums;" 
    let query3 = "SELECT orderID FROM Orders ORDER BY orderID;"      

    // Execute a triple-nested query, beginning with query1.
    // Data from each query is stored within the respective 'rows#' variable.
    db.pool.query(query1, function(error, rows1, fields){                                   

        db.pool.query(query2, function(error, rows2, fields){   
            
            db.pool.query(query3, function(error, rows3, fields){   
            
                // After submitting a successful query, respond by rendering the orderItems HTML page.
                // The data from each query is stored in the respective 'rows#' variables, which is assigned as a property of the 'data' object.
                // 'data' is passed to the HTML page as a local variable to access and use.
                res.render('orderItems', {data: {orderItems: rows1, albums: rows2, orders: rows3} });                          
            })                  
        })                                                              
    })                                                                  
});  

app.get('/albums', function(req, res)
{  
 // Define an SQL query that retrieves all information from the table.
    let query1 = "SELECT albumID, name, price, DATE_FORMAT(releaseDate, '%m-%d-%y') AS releaseDate, stock FROM Albums ORDER BY albumID;"                           

    // Execute the query.
    db.pool.query(query1, function(error, rows, fields){            
        
        // After submitting a successful query, respond by rendering the albums HTML page.
        // The data from the query is stored in the 'rows' variable.
        // 'data' is passed to the HTML page as a local variable to access and use.
        res.render('albums', {data: rows});                          
    })                                                              
});  

app.get('/songs', function(req, res)
{  
    // Define three SQL queries that retrieve the required information from the Songs, Albums, and Composers tables.
    let query1 = "SELECT songID, track, name, RIGHT(SEC_TO_TIME(length), 5) AS length, composerID, albumID FROM Songs ORDER BY songID;"  
    let query2 = "SELECT albumID, name from Albums ORDER BY albumID;" 
    let query3 = "SELECT composerID, firstName, lastName FROM Composers ORDER BY composerID;"      

    // Execute a triple-nested query, beginning with query1.
    // Data from each query is stored within the respective 'rows#' variable.
    db.pool.query(query1, function(error, rows1, fields){                                   

        db.pool.query(query2, function(error, rows2, fields){   
            
            db.pool.query(query3, function(error, rows3, fields){   
            
                // After submitting a successful query, respond by rendering the songs HTML page.
                // The data from each query is stored in the respective 'rows#' variables, which is assigned as a property of the 'data' object.
                // 'data' is passed to the HTML page as a local variable to access and use.
                res.render('songs', {data: {songs: rows1, albums: rows2, composers: rows3} });                          
            })                  
        })                                                              
    })                                                                  
});  

app.get('/composers', function(req, res)
{  
    // Define SQL query that retrievs the required data from the database.
    let query1 = "SELECT * FROM Composers ORDER BY composerID;";        

    db.pool.query(query1, function(error, rows, fields){            

        // After submitting a successful query, respond by rendering the composers HTML page.
        // The data from the query is stored in the 'rows' variable.
        // 'data' is passed to the HTML page as a local variable to access and use.
        res.render('composers', {data: rows});                          
    })
});  




// Post routes for each page of the website.
// These routes allow a user to submit data back to the server.
// Each page has one or more HTML forms that submits via post to add to or update a table.

// Add - POST routes that use HTML forms to add new data rows to a database table.
app.post('/add-customer-form', function(req, res){
    
    // Assign the data submitted via POST by add-customer-form.
    let data = req.body;

    // Define an SQL query that inserts a new row of data into the Customers table.
    // The data for each field can be accessed via index by its form id.
    let query1 = `INSERT INTO Customers (firstName, lastName, street, city, state, postalCode, email, phone) VALUES ('${data['input-firstName']}', '${data['input-lastName']}', '${data['input-street']}', '${data['input-city']}', '${data['input-state']}', '${data['input-postalCode']}', '${data['input-email']}', '${data['input-phone']}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error.
        if (error) {

            // Log the error to the terminal and respond with an HTTP response 400, indicating a bad request.
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /customers. 
        // This will cause the GET request to automatically trigger, which displays an updated Customers table.
        else
        {
            res.redirect('/customers');
        }
    })
})

app.post('/add-order-form', function(req, res){
    
    // Assign the data submitted via POST by add-order-form.
    let data = req.body;

    let query1 = `INSERT INTO Orders (orderDate, customerID) VALUES ('${data['input-orderDate']}', '${data['input-customerID']}')`;

    if (data['input-customerID'] == "NULL") {

        query1 = `INSERT INTO Orders (orderDate, customerID) VALUES ('${data['input-orderDate']}', NULL)`;
    }


    // Define an SQL query that inserts a new row of data into the Orders table.
    // The data for each field can be accessed via index by its form id.
   

    db.pool.query(query1, function(error, rows, fields){
        
        // Check to see if there was an error.
        if (error) {

            // Log the error to the terminal and respond with an HTTP response 400, indicating a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /orders. 
        // This will cause the GET request to automatically trigger, which displays an updated Orders table.
        else
        {
            res.redirect('/orders');
        }
    })
})

app.post('/add-orderItem-form', function(req, res){
    
    // Assign the data submitted via POST by add-orderItem-form.
    let data = req.body;

    // Define an SQL query that inserts a new row of data into the OrderItems table.
    // The data for each field can be accessed via index by its form id.
    query1 = `INSERT INTO OrderItems (quantity, taxes, returned, orderID, albumID) 
    VALUES ('${data['input-quantity']}', '${data['input-taxes']}', '${data['input-returned']}', '${data['input-orderID']}', '${data['input-albumID']}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error.
        if (error) {

            // Log the error to the terminal and respond with an HTTP response 400, indicating a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /orderItems. 
        // This will cause the GET request to automatically trigger, which displays an updated OrderItems table.
        else
        {
            res.redirect('/orderItems');
        }
    })
})

app.post('/add-album-form', function(req, res){
    
    // Assign the data submitted via POST by add-album-form.
    let data = req.body;

     // Define a SQL query that inserts a new row of data into the Albums table.
     // The data for each field can be accessed via index by its form id.
    query1 = `INSERT INTO Albums (name, price, releaseDate, stock) VALUES ('${data['input-name']}', '${data['input-price']}', '${data['input-releaseDate']}', '${data['input-stock']}')`;

    // Ask the database object to submit a query.
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error.
        if (error) {

            // Log the error to the terminal and respond with an HTTP response 400, indicating a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // After submitting a successful query, respond by redirecting the user back to the route /albums. 
            // This will cause the GET request to automatically trigger, which displays an updated Albums table.
            res.redirect('/Albums');
        }
    })
})

app.post('/add-song-form', function(req, res){
    
    // Assign the data submitted via POST by add-song-form.
    let data = req.body;

     // Define an SQL query that inserts a new row of data into the Songs table.
     // The data for each field can be accessed via index by its form id.
    query1 = `INSERT INTO Songs (track, name, length, composerID, albumID) 
    VALUES ('${data['input-track']}', '${data['input-name']}', '${data['input-length']}', '${data['input-composerID']}', '${data['input-albumID']}')`;

    // Ask the database object to submit a query.
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error.
        if (error) {

            // Log the error to the terminal and respond with an HTTP response 400, indicating a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // After submitting a successful query, respond by redirecting the user back to the route /songs. 
            // This will cause the GET request to automatically trigger, which displays an updated Songs table.
            res.redirect('/Songs');
        }
    })
})

app.post('/add-composer-form', function(req, res){
    
    // Assign the data submitted via POST by add-composer-form.
    let data = req.body;

    // Define an SQL query that inserts a new row of data into the Composers table.
    // The data for each field can be accessed via index by its form id.
    query1 = `INSERT INTO Composers (firstName, lastName) VALUES ('${data['input-firstName']}', '${data['input-lastName']}')`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error.
        if (error) {

            // Log the error to the terminal and respond with an HTTP response 400, indicating a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /composers. 
        // This will cause the GET request to automatically trigger, which displays an updated Composers table.
        else
        {
            res.redirect('/composers');
        }
    })
})




// Update - POST routes that use HTML forms to update existing data within a database table.
app.post('/update-customer-form', function(req, res){
    
    // Assign the data submitted via POST by update-customer-form.
    let data = req.body;

    // Define an SQL query that updates a row of data within the Customers table.
    // The data for each field can be accessed via index by its form id.
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

        // Check to see if there was an error.
        if (error) {

            // Log the error to the terminal and respond with an HTTP response 400, indicating a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /customers. 
        // This will cause the GET request to automatically trigger, which displays an updated Customers table.
        else
        {
            res.redirect('/customers');
        }
    })
})

app.post('/update-order-form', function(req, res){
    
    // Assign the data submitted via POST by update-order-form.
    let data = req.body;

    // Define an SQL query that updates a row of data within the Orders table.
    // The data for each field can be accessed via index by its form id.
    let query1 = `UPDATE Orders SET orderDate = '${data['update-orderDate']}', customerID = '${data['update-customerID']}' WHERE orderID = ${data['update-orderID']}`;

    // Adjust query to handle any NULL values.
    if (data['update-customerID'] == "NULL") {

        query1 = `UPDATE Orders SET orderDate = '${data['update-orderDate']}', customerID = NULL WHERE orderID = ${data['update-orderID']}`;
    }


    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error.
        if (error) {

            // Log the error to the terminal and respond with an HTTP response 400, indicating a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /orders. 
        // This will cause the GET request to automatically trigger, which displays an updated Orders table.
        else
        {
            res.redirect('/orders');
        }
    })
})

app.post('/update-orderItem-form', function(req, res){
    
   // Assign the data submitted via POST by update-orderItem-form.
    let data = req.body;
    orderItemID = data['update-orderItemID'];
    orderID = data['update-orderID'];
    albumID = data['update-albumID'];

    // Define an SQL query that updates a row of data within the OrderItems table.
    // The data for each field can be accessed via index by its form id.
    query = `UPDATE OrderItems
    SET quantity = '${data['update-quantity']}', taxes = '${data['update-taxes']}', returned = '${data['update-returned']}', 
    orderID = '${orderID}', albumID = '${albumID}' WHERE orderItemID = '${orderItemID}'`;

    db.pool.query(query, function(error, rows, fields){

        // Check to see if there was an error.
        if (error) {

            // Log the error to the terminal and respond with an HTTP response 400, indicating a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /orderItems. 
        // This will cause the GET request to automatically trigger, which displays an updated OrderItems table.
        else
        {
            res.redirect('/orderItems');
        }
    })
})

app.post('/update-album-form', function(req, res){
    
    // Assign the data submitted via POST by update-album-form.
    let data = req.body;
    albumID = data['update-albumID']

    // Define a SQL query that updates an existing row of data within the Albums table.
    // The data for each field can be accessed via index by its id.    
    query = `UPDATE Albums
    SET name = '${data['update-name']}', price = '${data['update-price']}', releaseDate = '${data['update-releaseDate']}', stock = '${data['update-stock']}' 
    WHERE albumID = '${albumID}'`;

    db.pool.query(query, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /albums. 
        // This will cause the GET request to automatically trigger, which displays an updated Albums table.
        else
        {
            res.redirect('/albums');
        }
    })
})

app.post('/update-song-form', function(req, res){
    
    // Assign the data submitted via POST by update-album-form.
    let data = req.body;

    // Define a SQL query that updates an existing row of data within the Albums table.
    // The data for each field can be accessed via index by its id.    
    query = `UPDATE Songs
    SET track = '${data['update-track']}', name = '${data['update-name']}', length = '${data['update-length']}', composerID = '${data['update-composerID']}', albumID = '${data['update-albumID']}' 
    WHERE songID = '${data['update-songID']}'`;

    db.pool.query(query, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /Albums. 
        // This will cause the GET request to automatically trigger, which displays an updated Albums table.
        else
        {
            res.redirect('/songs');
        }
    })
})

app.post('/update-composer-form', function(req, res){
    
    // Assign the data submitted via POST by update-album-form.
    let data = req.body;

    // Define a SQL query that updates an existing row of data within the Albums table.
    // The data for each field can be accessed via index by its id.    
    query = `UPDATE Composers
    SET firstName = '${data['update-firstName']}', lastName = '${data['update-lastName']}'
    WHERE composerID = '${data['update-composerID']}'`;

    db.pool.query(query, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // After submitting a successful query, respond by redirecting the user back to the route /albums. 
        // This will cause the GET request to automatically trigger, which displays an updated Albums table.
        else
        {
            res.redirect('/composers');
        }
    })
})




// Delete routes for each page of the website.
// Each table has a delete button, which triggers a linked 'delete_table.js' file.
// That file contains function definitions for deleting via AJAX.
app.delete('/delete-customer-ajax/', function(req,res,next){
    let data = req.body;
    let customerID = parseInt(data.id);
    let deleteCustomerID = `DELETE FROM Customers WHERE customerID = ?`;
 
          // Run the query
        db.pool.query(deleteCustomerID, [customerID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
})});

app.delete('/delete-order-ajax/', function(req,res,next){
let data = req.body;
let orderID = parseInt(data.id);
let deleteOrderID = `DELETE FROM Orders WHERE orderID = ?`;

        // Run the query
        db.pool.query(deleteOrderID, [orderID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
})});

app.delete('/delete-orderItem-ajax/', function(req,res,next){
    let data = req.body;
    let orderItemID = parseInt(data.id);
    let deleteOrderItemID = `DELETE FROM OrderItems WHERE orderItemID = ?`;
    
            // Run the query
            db.pool.query(deleteOrderItemID, [orderItemID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
})});

app.delete('/delete-album-ajax/', function(req,res,next){
    let data = req.body;
    let albumID = parseInt(data.id);
    let deleteAlbumID = `DELETE FROM Albums WHERE albumID = ?`;
    
            // Run the query
            db.pool.query(deleteAlbumID, [albumID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    })});

app.delete('/delete-song-ajax/', function(req,res,next){
    let data = req.body;
    let songID = parseInt(data.id);
    let deleteSongID = `DELETE FROM Songs WHERE songID = ?`;
    
            // Run the query
            db.pool.query(deleteSongID, [songID], function(error, rows, fields){
                if (error) 
                {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    })});

app.delete('/delete-composer-ajax/', function(req,res,next){
    let data = req.body;
    let composerID = parseInt(data.id);
    let deleteComposerID = `DELETE FROM Composers WHERE composerID = ?`;
    
            // Run the query
            db.pool.query(deleteComposerID, [composerID], function(error, rows, fields){
                if (error) 
                {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    })});
                                                    



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
