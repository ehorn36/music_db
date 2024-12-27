// Citation for the delete_album.js file
// Date: 3/1/24
// Based on the code provided in CS 340 // nodejs_starter_app
// This code was copied and modified for CRUD operations
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Called when the delete button is clicked within the albums-table.
function deleteAlbum(albumID) {
    let link = '/delete-album-ajax/';
    let data = {
      id: albumID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(albumID);
      }
    });
  }
  
// Finds the row matching the albumID.
function deleteRow(albumID){
      let table = document.getElementById("albums-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == albumID) {
              table.deleteRow(i);
              break;
         }
      }
  }