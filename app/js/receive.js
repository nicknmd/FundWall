$(document).ready(function(){
  
  var myDataRef = new Firebase('https://fundwall.firebaseio.com/donations'); 
  
  var currency = "$";
  var url = "http://belcham.org/donate";
  var totalAmount = 0;
  var goal = 30000;
  var totalDonations = 0;
  
  function parseCurrency(amount){
    amount = ("" + amount).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
    return currency+amount;
  }
  
  myDataRef.on('child_added', function(snapshot) {
    var donation = snapshot.val();
    displayDonation(donation.name, donation.email, donation.amount, donation.message);
  });

  function displayDonation(name, email, amount, message) {
    message = decodeURI(message);
    name = decodeURI(name); 
    upDateTotal(parseInt(amount));
    upDateAmount()
    $('.stream').prepend('<li><h3>'+name+'</h3><small></small><p>'+message+'</p><div class="amount"><span>'+parseCurrency(amount)+'</span></div></li>').slideDown();
  };
  
  function upDateTotal(amount) {
    totalAmount += amount;
    $('.js-amount').html(parseCurrency(totalAmount));
  }
  
  function upDateAmount() {
    totalDonations++;
    $('.js-donations').html(totalDonations);
  }
  
  function displayGoal() {
    $('.js-goal').html(parseCurrency(goal));
  }
  
  function displayUrl() {
    $('.js-url').html(url);
    $('.js-qr').css({
      "background-image":"url('https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data="+url+"')"
    });
  }
  
  function init() {
    displayGoal();
    displayUrl();
  }
  
  init();

});



