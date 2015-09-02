$(document).ready(function(){
  
  var myDataRef = new Firebase('https://fundwall.firebaseio.com/donations'); 
  
  var currency = "$";
  var url = "http://belcham.org/donate";
  var totalAmount = 0;
  var goal = 30000;
  var totalDonations = 0;
  var donations = [];
  var pageload = true;
  
  setTimeout(function(){
    pageload = false;
  }, 1000);
  
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
    appendDonation(
      {
        "name" : name,
        "email" : email,
        "amount" : amount,
        "message" : message
      }
    )
    upDateTotal(parseInt(amount));
    upDateAmount();
    upDateWall();
  };
  
  function appendDonation(donation) {
    donations.push(donation);
    donations.sort(function(a, b){
      return parseFloat(a.amount) - parseFloat(b.amount);
    });
  }
  
  function upDateWall(){
    $('.stream').html('');
    for(i = 0; i < donations.length; i++) {
      var ranking = donations.length - i;
      $('.stream').prepend('<li><div class="ranking">#'+ranking+'</div><h3>'+donations[i].name+'</h3><small></small><p>'+donations[i].message+'</p><div class="amount"><span>'+parseCurrency(donations[i].amount)+'</span></div></li>');
    }
  }
  
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



