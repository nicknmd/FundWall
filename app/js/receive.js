$(document).ready(function(){ 
    var myDataRef = new Firebase('https://fundwall.firebaseio.com/donations');
    myDataRef.on('child_added', function(snapshot) {
        var donation = snapshot.val();
        displayDonation(donation.name, donation.email, donation.amount, donation.message);
    });

    function displayDonation(name, email, amount, message) {
        $('.donations').prepend('<div class="col-sm-6 col-md-6 col-md-offset-3"><div class="alert alert-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button><span class="glyphicon glyphicon-usd"></span><strong>'+amount+'</strong> gift<hr class="message-inner-separator"><p><i>Message: '+message+'</i><br>Powered by <strong>'+name+'</strong></p></div></div>').slideDown();
    };

});



