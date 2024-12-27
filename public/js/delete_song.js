// Citation for the delete_song.js file
// Date: 3/1/24
// Based on the code provided in CS 340 // nodejs_starter_app
// This code was copied and modified for CRUD operations
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

// Called when the delete button is clicked within the songs-table.
function deleteSong(songID) {
    let link = '/delete-song-ajax/';
    let data = {
      id: songID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(songID);
      }
    });
  }
  
  // Finds the row matching the songID.
  function deleteRow(songID){
      let table = document.getElementById("songs-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == songID) {
              table.deleteRow(i);
              break;
         }
      }
  }