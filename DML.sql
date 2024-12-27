/* 
Group 63: Data Manipulation Queries 
Note - Input variables are denoted by :attributeInput (e.g. :customerIDInput)
*/



/* Customers CRUD operations */
-- Get Customers rows
SELECT * FROM Customers ORDER BY customerID;

-- Add a Customer
INSERT INTO Customers (firstName, lastName, street, city, state, postalCode, email, phone)
VALUES (:firstNameInput, :lastNameInput, :streetInput, :cityInput, :stateInput, :postalCodeInput, :emailInput, :phoneInput);

-- Update a Customer
UPDATE Customers
SET firstName = :firstNameInput,
    lastName = :lastNameInput,
    street = :streetInput,
    city = :cityInput,
    state = :stateInput,
    postalCode = :postalCodeInput,
    email = :emailInput,
    phone = :phoneInput
WHERE customerID = :customerIDInput;

-- Delete a Customer
DELETE FROM Customers WHERE customerID = :customerIDInput;



/* Orders CRUD operations */
-- Get Orders rows
SELECT orderID, DATE_FORMAT(orderDate, '%m-%d-%y') AS orderDate, Orders.customerID, Customers.firstName AS firstName, Customers.lastName AS lastName
FROM Orders LEFT JOIN Customers ON Orders.customerID = Customers.customerID
ORDER BY orderID;

-- Add an Order
INSERT INTO Orders (orderDate, customerID)
VALUES (:orderDateInput, 
    (SELECT customerID, firstName, lastName FROM Customers; => :customerIDInput));                                      -- Additional SELECT query to build a Dynamic drop-down list

-- Update an Order
UPDATE Orders
SET orderDate = :orderDateInput, (SELECT customerID, firstName, lastName FROM Customers; => :customerIDInput)           -- Additional SELECT query to build a Dynamic drop-down list
WHERE orderID = :orderIDInput;                                                                                          -- Uses intial 'Get rows' query to build a Dynamic drop-down list

-- Delete an Order
DELETE FROM Orders WHERE orderID = :orderIDInput;



/* OrderItems CRUD operations */
-- Get OrderItems rows
SELECT * FROM OrderItems ORDER BY orderItemID;

-- Add an OrderItem
INSERT INTO OrderItems (quantity, taxes, returned, orderID, albumID) 
VALUES (:quantityInput, :taxesInput, ;returnInput, 
    (SELECT orderID FROM Orders ORDER BY orderID; => :orderIDInput),                                                    -- Additional SELECT query to build a Dynamic drop-down list
    (SELECT albumID, name FROM Albums; => :albumIDInput));                                                              -- Additional SELECT query to build a Dynamic drop-down list

-- Update an OrderItem
UPDATE OrderItems
SET quantity = :quantity, :taxes = :taxes, returned = :returned, 
    orderID = (SELECT * FROM OrderItems ORDER BY orderItemID; => :orderIDInput),                                        -- Additional SELECT query to build a Dynamic drop-down list
    albumID = (SELECT albumID, name FROM Albums; => :albumIDInput)                                                      -- Additional SELECT query to build a Dynamic drop-down list
WHERE orderItemID = :orderItemIDInput;                                                                                  -- Uses intial 'Get rows' query to build a Dynamic drop-down list

-- Delete an OrderItem
DELETE FROM OrderItems WHERE orderItemID = :orderItemIDInput;



/* Albums CRUD operations */
-- Get Albums rows
SELECT albumID, name, price, DATE_FORMAT(releaseDate, '%m-%d-%y') AS releaseDate, stock FROM Albums ORDER BY albumID;

-- Add an Album
INSERT INTO Albums (name, price, releaseDate, stock)
VALUES (:nameInput, :priceInput, :releaseDateInput, :stockInput);

-- Update an Album
UPDATE Albums
SET name = :nameInput,                                                                                                  
    price = :priceInput,
    releaseDate = :releaseDateInput,
    stock = :stockInput
WHERE albumID = :albumIDInput;                                                                                          -- Uses intial 'Get rows' query to build a Dynamic drop-down list

-- Delete an Album
DELETE FROM Albums WHERE albumID = :albumIDInput;



/* Songs CRUD operations */
-- Get Songs rows
SELECT songID, track, name, RIGHT(SEC_TO_TIME(length), 5) AS length, composerID, albumID FROM Songs ORDER BY songID;

-- Add a Song
INSERT INTO Songs (track, name, length, composerID, albumID)
VALUES (:trackInput, :nameInput, :lengthInput,
    (SELECT composerID, firstName, lastName FROM Composers ORDER BY composerID; => :composerIDInput),                   -- Additional SELECT query to build a Dynamic drop-down list
    (SELECT albumID FROM Albums WHERE name = :nameInput));                                                              -- Additional SELECT query to build a Dynamic drop-down list

-- Update a Song
UPDATE Songs
SET track = :trackInput,
    name = :nameInput,
    length = :lengthInput
    composerID = (SELECT composerID, firstName, lastName FROM Composers ORDER BY composerID; => :composerIDInput)       -- Additional SELECT query to build a Dynamic drop-down list
    albumID = (SELECT albumID, name FROM Albums; => :albumIDInput)                                                      -- Additional SELECT query to build a Dynamic drop-down list
WHERE songID = :songIDInput;                                                                                            -- Uses intial 'Get rows' query to build a Dynamic drop-down list

-- Delete a Song
DELETE FROM Songs WHERE songID = :songIDInput;



/* Composers CRUD operations */
-- Get Composers rows
SELECT * FROM Composers ORDER BY composerID;

-- Add a Composer
INSERT INTO Composers (firstName, lastName)
VALUES (:firstNameInput, :lastNameInput);

-- Update a Composer
UPDATE Composers
SET firstName = :firstNameInput,
    lastName = :lastNameInput
WHERE composerID = :composerIDInput;                                                                                    -- Uses intial 'Get rows' query to build a Dynamic drop-down list

-- Delete a Composer
DELETE FROM Composers WHERE composerID = :composerIDInput;