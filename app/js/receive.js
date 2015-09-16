$(document).ready(function(){
  
  var myDataRef = new Firebase('https://fundwall.firebaseio.com/donations'); 
  
  var currency = "$";
  var url = "http://belcham.org/donate";
  var donations = [];
  var totalAmount = 0;
  var totalDonations = 0;
  var goal = 10000;
  var subGoals =  [
    {
      "goal" : 5000,
      "message" : "23 Karat Gold Rush Chocolate Bar",
      "sponsor" : "Chocomize"
    },
    {
      "goal" : 10000,
      "message" : "Luscious Black Lace Glass Candle",
      "sponsor" : "Joya Studio"
    },
    {
      "goal" : 20000,
      "message" : "Diamond Champagne Toast",
      "sponsor" : "Evanova Jewelers"
    }
  ];
  var endTime = Math.floor(Date.now() / 1000) + ( 60 * 15 );
  
  // On pageload variable
  var pageload = true;
  setTimeout(function(){
    pageload = false;
  }, 3000);
  
  // Donation added
  myDataRef.on('child_added', function(snapshot) {
    var donation = snapshot.val();
    donation.name = decodeURI(donation.name);
    donation.message = decodeURI(donation.message);
    appendDonation(donation);
    if(pageload == false) triggerOverlay(donation);
    upDateTotal(parseInt(donation.amount));
    upDateWall();
  });
  
  // Append donation and sort donations by amount
  function appendDonation(donation) {
    donations.push(donation);
    /*donations.sort(function(a, b){
      return parseFloat(a.amount) - parseFloat(b.amount);
    });*/
  }
  
  // Update donation wall
  function upDateWall(){
    $('.stream').html('');
    for(i = 0; i < donations.length; i++) {
      var ranking = donations.length - i;
      //$('.stream').prepend('<li><div class="ranking">#'+ranking+'</div><h3>'+donations[i].name+'</h3><small></small><p>'+donations[i].message+'</p><div class="amount"><span>'+parseCurrency(donations[i].amount)+'</span></div></li>');
      $('.stream').prepend('<li><h3>'+donations[i].name+'</h3><small></small><p>'+donations[i].message+'</p><div class="amount"><span>'+parseCurrency(donations[i].amount)+'</span></div></li>');
    }
  }
  
  // Update total donations
  function upDateTotal(amount) {
    totalAmount += amount;
    evaluateSubGoals();
    updateProgressBar();
    $('.js-amount').html(parseCurrency(totalAmount));
  }
  
  // Evaluate Sub Goals
  function evaluateSubGoals() {
    for(i = 0; i < subGoals.length; i++) {
      if(subGoals[i].goal < totalAmount) {
        $('.subGoals ul li#'+i).addClass('complete');
      }
    }
  }
  
  // Parse currency
  function parseCurrency(amount){
    amount = ("" + amount).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
    return currency+amount;
  }
  
  // Display goal
  function displayGoal() {
    $('.js-goal').html(parseCurrency(goal));
  }
  
  // Evaluate Sub Goals
  function displaySubGoals() {
    for(i = 0; i < subGoals.length; i++) {
      $('.subGoals ul').prepend('<li id="'+i+'"><div><img src="assets/img/checkmark.svg"/></div><h3>'+parseCurrency(subGoals[i].goal)+'</h3><p>'+subGoals[i].message+'</p><em>- '+subGoals[i].sponsor+'</em></li>')
    }
  }
  
  // Display QR
  function displayUrl() {
    $('.js-url').html(url);
  }
  
  // Update progressBar
  function updateProgressBar() {
    height = (goal < totalAmount)? 100 : (totalAmount / (goal/100));
    $('.js-progress-bar-fill').css({'height': height + '%'});
  }
  
  // Init wall
  function init() {
    displayGoal();
    displayUrl();
    displaySubGoals();
  }
  
  init();
  
  //
  // Overlay Specific code
  // ---------------------
  
  var overlay = false;
  var overlayDuration = 4000;
  var overlayBuffer = [];
  
  // Trigger overlay 
  function triggerOverlay(donation) {
    if(overlay == false){
      
      overlay = true;
      showOverlay();
      
      fillOverlayWindow(donation);
      showWindow();
      
      setTimeout(function(){
        checkOverlayBuffer();
      }, overlayDuration + (donation.amount * 8));
      
    } else {
      overlayBuffer.push(donation);
    }
  }
  
  function fillOverlayWindow(donation) {
    $('.js-overlay-amount').html(parseCurrency(donation.amount));
    $('.js-overlay-message').html('"'+donation.message+'"');
    $('.js-overlay-name').html(donation.name);
  }
  
  function checkOverlayBuffer(){
    hideWindow();
    if(overlayBuffer.length == 0){
      
      setTimeout(function(){
        hideOverlay();
        overlay = false;
      }, 1000);
      
    } else {
      
      setTimeout(function(){
        showWindow();
        donation = overlayBuffer.shift();
        fillOverlayWindow(donation);
        
        setTimeout(function(){
          checkOverlayBuffer();
        }, overlayDuration + (donation.amount * 8));
      }, 1000);
    }
  }
  
  function showOverlay(){ $('.overlay').addClass("show"); }
  function hideOverlay(){ $('.overlay').removeClass("show"); }
  
  function showWindow(){ $('.overlay').removeClass("animate-out").addClass("animate-in"); }
  function hideWindow(){ $('.overlay').removeClass("animate-in").addClass("animate-out"); }

});



