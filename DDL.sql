SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT=0;

/* Create Customers table */
CREATE OR REPLACE TABLE Customers (
    customerID INT NOT NULL AUTO_INCREMENT, 
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    street VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postalCode VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone BIGINT(10) NOT NULL,
    PRIMARY KEY (CustomerID)
);

/* Add data to Customers table */
INSERT INTO 
    Customers (firstName, lastName, street, city, state, postalCode, email, phone)
VALUES
    ("Taylor", "Swift", "456 Grammy Street", "Nashville", "TN", "37011", "tswift@hotmail.com", 9874566545),
    ("John", "Elway", "5280 Mile High Rd", "Denver", "CO", "80014", "elway@broncos.com", 1234567890),
    ("Tom", "Brady", "12 Patriot Way", "Boston", "MA", "12108", "tb12@goat.com", 9519511753),
    ("Matt", "Damon", "123 Fake St", "Springfield", "OH", "45501", "jason.bourne@gmail.com", 5657854320),
    ("Katy", "Perry", "455 Las Vegas Boulevard", "Las Vegas", "NV", "88901", "darkhorse@kp.com", 9805364561);

/* Create Orders table */
CREATE OR REPLACE TABLE Orders (
    orderID INT NOT NULL AUTO_INCREMENT, 
    orderDate DATE NOT NULL,            -- YYYYMMDD
    customerID INT,
    PRIMARY KEY (orderID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE
);

/* Add data to Orders table */
INSERT INTO 
    Orders (orderDate, customerID)
VALUES 
    (20231112, (SELECT customerID FROM Customers WHERE firstName="Taylor" AND lastName="Swift")),
    (20230104, (SELECT customerID FROM Customers WHERE firstName="John" AND lastName="Elway")),
    (20220618, (SELECT customerID FROM Customers WHERE firstName="Tom" AND lastName="Brady")),
    (20240116, (SELECT customerID FROM Customers WHERE firstName="Matt" AND lastName="Damon")),
    (20240205, (SELECT customerID FROM Customers WHERE firstName="Katy" AND lastName="Perry"));

/* Create Albums table */
CREATE OR REPLACE TABLE Albums (
    albumID INT NOT NULL AUTO_INCREMENT, 
    name VARCHAR(50) NOT NULL,
    price DECIMAL(7,2) NOT NULL,
    releaseDate DATE NOT NULL,
    stock INT DEFAULT 0,
    PRIMARY KEY (albumID)
);

/* Add data to Albums table */
INSERT INTO 
    Albums (name, price, releaseDate, stock)
VALUES
    ("Metroid Prime", 19.99, 20020105, 1),
    ("Halo 2: Volume 1", 19.99, 20041004, 2),
    ("StarCraft 2: Wings of Liberty", 19.99, 20100727, 3),
    ("Celeste", 19.99, 20180624, 1),
    ("Banjo-Kazooie: Nuts & Bolts", 9.99, 20080513, 1);

/* Create OrderItems table */
CREATE OR REPLACE TABLE OrderItems (
    orderItemID INT NOT NULL AUTO_INCREMENT, 
    quantity INT NOT NULL,
    taxes DECIMAL(6,2) NOT NULL,
    returned BOOLEAN NOT NULL DEFAULT 0,
    orderID INT NOT NULL,
    albumID INT NOT NULL,
    PRIMARY KEY (orderItemID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY (albumID) REFERENCES Albums(albumID) ON DELETE CASCADE
);

/* Add data to OrderItems table */
INSERT INTO 
    OrderItems (quantity, taxes, returned, orderID, albumID)
VALUES
    (1, 1.20, false, 1,
    (SELECT albumID FROM Albums WHERE name="Metroid Prime")),
    (1, 1.20, false, 2,
    (SELECT albumID FROM Albums WHERE name="Halo 2: Volume 1")),
    (1, 1.20, false, 3,
    (SELECT albumID FROM Albums WHERE name="StarCraft 2: Wings of Liberty")),
    (2, 2.4, false, 4,
    (SELECT albumID FROM Albums WHERE name="Celeste")),
    (1, 1.20, true, 5,
    (SELECT albumID FROM Albums WHERE name="Banjo-Kazooie: Nuts & Bolts"));

/* Create Composers table */
CREATE OR REPLACE TABLE Composers (
    composerID INT NOT NULL AUTO_INCREMENT, 
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    PRIMARY KEY (composerID)
);

/* Add data to Composers table */
INSERT INTO 
    Composers (firstName, lastName)
VALUES
    ("Kenji", "Yamamoto"),
    ("Martin", "O'Donnell"),
    ("Jason", "Hayes"),
    ("Lena", "Raine"),
    ("Grant", "Kirkhope");

/* Create Songs table */
CREATE OR REPLACE TABLE Songs (
    songID INT NOT NULL AUTO_INCREMENT,
    track INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    length INT NOT NULL,
    composerID INT NOT NULL,
    albumID INT NOT NULL,
    PRIMARY KEY (songID),
    FOREIGN KEY (composerID) REFERENCES Composers(composerID) ON DELETE CASCADE,
    FOREIGN KEY (albumID) REFERENCES Albums(albumID) ON DELETE CASCADE
);

/* Add data to Songs table */
INSERT INTO 
    Songs (track, name, length, composerID, albumID)
VALUES
    (
        1,
        "Title Theme",
        134,
        (SELECT composerID FROM Composers WHERE firstName="Kenji" AND lastName="Yamamoto"),
        (SELECT albumID FROM Albums WHERE name="Metroid Prime")
    ),
    (
        2,
        "Menu Theme",
        154,
        (SELECT composerID FROM Composers WHERE firstName="Kenji" AND lastName="Yamamoto"),
        (SELECT albumID FROM Albums WHERE name="Metroid Prime")
    ),
    (
        1,
        "Halo Theme (Mjolnir Mix)",
        253,
        (SELECT composerID FROM Composers WHERE firstName="Martin" AND lastName="O'Donnell"),
        (SELECT albumID FROM Albums WHERE name="Halo 2: Volume 1")
    ),
    (
        3,
        "Peril",
        168,
        (SELECT composerID FROM Composers WHERE firstName="Martin" AND lastName="O'Donnell"),
        (SELECT albumID FROM Albums WHERE name="Halo 2: Volume 1")
    ),
    (
        1,
        "Wings of Liberty",
        435,
        (SELECT composerID FROM Composers WHERE firstName="Jason" AND lastName="Hayes"),
        (SELECT albumID FROM Albums WHERE name="StarCraft 2: Wings of Liberty")
    ),
    (
        3,
        "Heaven's Devils",
        426,
        (SELECT composerID FROM Composers WHERE firstName="Jason" AND lastName="Hayes"),
        (SELECT albumID FROM Albums WHERE name="StarCraft 2: Wings of Liberty")
    ),
    (
        2,
        "First Steps",
        219,
        (SELECT composerID FROM Composers WHERE firstName="Lena" AND lastName="Raine"),
        (SELECT albumID FROM Albums WHERE name="Celeste")
    ),
    (
        3,
        "Resurrections",
        579,
        (SELECT composerID FROM Composers WHERE firstName="Lena" AND lastName="Raine"),
        (SELECT albumID FROM Albums WHERE name="Celeste")
    ),
    (
        2,
        "Showdown Town Square",
        251,
        (SELECT composerID FROM Composers WHERE firstName="Grant" AND lastName="Kirkhope"),
        (SELECT albumID FROM Albums WHERE name="Banjo-Kazooie: Nuts & Bolts")
    ),
    (
        17,
        "Trial by Jinjo",
        138,
        (SELECT composerID FROM Composers WHERE firstName="Grant" AND lastName="Kirkhope"),
        (SELECT albumID FROM Albums WHERE name="Banjo-Kazooie: Nuts & Bolts")
    );

SET FOREIGN_KEY_CHECKS=1;
COMMIT;