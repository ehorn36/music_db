// Citation for the delete_customer.js file
// Date: 3/1/24
// Based on the code provided in CS 340 // nodejs_starter_app
// This code was copied and modified for CRUD operations
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Called when the delete button is clicked within the customers-table.
function deleteCustomer(customerID) {
  let link = '/delete-customer-ajax/';
  let data = {
    id: customerID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(customerID);

    }
  });
}

// Finds the row matching the customerID.
function deleteRow(customerID){
    let table = document.getElementById("customers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == customerID) {
            table.deleteRow(i);
            break;
       }
    }
}