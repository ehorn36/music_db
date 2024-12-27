// Citation for the delete_composer.js file
// Date: 3/1/24
// Based on the code provided in CS 340 // nodejs_starter_app
// This code was copied and modified for CRUD operations
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Called when the delete button is clicked within the composers-table.
function deleteComposer(composerID) {
    let link = '/delete-composer-ajax/';
    let data = {
      id: composerID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(composerID);
      }
    });
  }
  
  // Finds the row matching the composerID.
  function deleteRow(composerID){
      let table = document.getElementById("composers-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == composerID) {
              table.deleteRow(i);
              break;
         }
      }
  }