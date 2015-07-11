$(document).ready(function(){ 
    $('#characterLeft').text('100 characters left');
    $('#message').keydown(function () {
        var max = 100;
        var len = $(this).val().length;
        if (len >= max) {
            $('#characterLeft').text('You have reached the limit');
            $('#characterLeft').addClass('red');
            $('#btnSubmit').addClass('disabled');            
        } 
        else {
            var ch = max - len;
            $('#characterLeft').text(ch + ' characters left');
            $('#btnSubmit').removeClass('disabled');
            $('#characterLeft').removeClass('red');            
        }
    });  


    var myDataRef = new Firebase('https://fundwall.firebaseio.com/donations');
      $('#donate').click(function () {
          var name = $('#name').val();
          var email = $('#email').val();
          var amount = $('#amount').val();
          var message = $('#message').val();
          myDataRef.push({name: name, email: email, amount: amount, message: message});
      });  
});

