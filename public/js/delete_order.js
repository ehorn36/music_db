// Citation for the delete_order.js file
// Date: 3/1/24
// Based on the code provided in CS 340 // nodejs_starter_app
// This code was copied and modified for CRUD operations
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Called when the delete button is clicked within the orders-table.
function deleteOrder(orderID) {
  let link = '/delete-order-ajax/';
  let data = {
    id: orderID
  };

  $.ajax({
    url: link,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    success: function(result) {
      deleteRow(orderID);
    }
  });
}

// Finds the row matching the orderID.
function deleteRow(orderID){
    let table = document.getElementById("orders-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == orderID) {
            table.deleteRow(i);
            break;
       }
    }
}