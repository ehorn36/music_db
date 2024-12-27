// Citation for the delete_orderItem.js file
// Date: 3/1/24
// Based on the code provided in CS 340 // nodejs_starter_app
// This code was copied and modified for CRUD operations
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Called when the delete button is clicked within the orderItems-table.
function deleteOrderItem(orderItemID) {
    let link = '/delete-orderItem-ajax/';
    let data = {
      id: orderItemID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(orderItemID);
      }
    });
  }
  
  // Finds the row matching the orderItemID.
  function deleteRow(orderItemID){
      let table = document.getElementById("orderItems-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == orderItemID) {
              table.deleteRow(i);
              break;
         }
      }
  }