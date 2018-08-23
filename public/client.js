// client-side js
// run by the browser each time your view template is loaded

$('document').ready(function(){
      //target form by ID
      $( "#target_form" ).submit(function( event ) {
        
        //prevent default post request from form
        event.preventDefault();
        //get value from input field
        var user_input = $("#Skill-input").val(),
        url = $(this).attr( "action" );

        // Send the data using post
        $.post( url, { Skill: user_input }, function(data, status){        
          //return false to submit without response
          return false;
        });
        
        //show confirmation and reset
        $("#inputDescription").text("Thank you for your submission...");
        $("#inputDescription").closest('form').find("input[type=text], textarea").val("");
      });
      
});
