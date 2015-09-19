// 
// Winner generator
// -------------------------


// Setup Variables
// --------------
var myDataRef = new Firebase('https://fundwall.firebaseio.com/donations'); 
var donations = [];
var totalDonations = 0;
var totalMoney = 0;
var ticketsBowl = [];
var totalTickets = 0;
var listTickets = [];
var shake = 1500;
var winners = JSON.parse(localStorage.getItem('winners'));
var active = false;
winners = (winners == null)? [] : winners;


// Main functions
// --------------

function getWinner() {
  var winner = randomWinner();
  var winnerData = ticketsBowl[winner];
  saveWinner(winner);
  return { id:winner, info:winnerData };
}

function randomWinner() {
  var random = Math.floor(Math.random() * ticketsBowl.length);
  var unique = true;
  for(var i in winners) if(random == winners[i]) unique = false; 
  return (unique == false)? randomWinner() : random;
}

function saveWinner(winner) {
  winners.push(winner);
  localStorage.setItem('winners', JSON.stringify(winners));
}

function showWinners() {
  console.log('-WINNERS----------');
  for(var i = 0; i < winners.length; i++) {
    var winnerData = ticketsBowl[winners[i]];
    console.log((i+1)+" - ticket: " + winners[i] +" - id: " + winnerData.id + " - name: " + winnerData.name + " - Amount: $" + winnerData.amount+ " - Message: " + winnerData.message);
  }
  console.log('-----------');
}

function showTickets() {
  console.log('-TICKETS----------');
  for(var i = 0; i < listTickets.length; i++) console.log(listTickets[i]);
  console.log('-----------');
}

function resetAll() {
  localStorage.setItem('winners', null);
  winners = [];
}
  
function showOverlay(){ $('.overlay').addClass("show"); }
function hideOverlay(){ $('.overlay').removeClass("show"); }

function showWindow(){ $('.overlay').removeClass("animate-out").addClass("animate-in"); }
function hideWindow(){ $('.overlay').removeClass("animate-in").addClass("animate-out"); }

function fillOverlay(winner) {
  $('.js-ticket').html(winner.id);
  $('.js-name').html(winner.info.name);
  $('.js-email').html(winner.info.email);
}

function init() {
  
  $('.logo').on('click', function(){
    if(active == false) {
      active = true;
      $('.logo').addClass('active');
      $('.logo img').addClass('shake shake-vertical shake-constant');
      setTimeout(function(){
        $('.logo img').removeClass('shake-vertical').addClass('shake-horizontal');
      }, shake);
      setTimeout(function(){
        $('.logo img').removeClass('shake-horizontal').addClass('shake-hard');
      }, (shake*2));
      setTimeout(function(){
        $('.logo img').removeClass('shake-hard').addClass('shake-crazy');
      }, (shake*3));
      setTimeout(function(){
        $('.logo').removeClass('active').addClass('explode');
      }, (shake*4));
      setTimeout(function(){
        $('.logo img').removeClass('shake shake-crazy shake-constant');
      }, (shake*5));
      setTimeout(function(){
        winner = getWinner();
        fillOverlay(winner);
        showOverlay();
        showWindow();
      }, (shake*5)+500);
    }
  });
  
  $('.overlay .window').on('click', function(){
    hideWindow(); 
    setTimeout(function(){
      hideOverlay();
      $('.logo').removeClass('active explode');
      active = false;
    }, 1000);
  });
  
  $('.reset').on('click', function(){
    if(confirm('reset winnners?') && active == false) {
      resetAll();
    }
  });
  
  $('.winners').on('click', function(){
    if(active == false) {
      var visualWinners = [];
      for(var i = 0; i < winners.length; i++) {
        var winnerData = ticketsBowl[winners[i]];
        visualWinners.push({
          "number" : i+1,
          "ticket" : winners[i],
          "id": winnerData.id ,
          "name" : winnerData.name,
          "Amount" : winnerData.amount,
          "message" : winnerData.message
        })
        //console.log((i+1)+" - ticket: " + winners[i] +" - id: " + winnerData.id + " - name: " + winnerData.name + " - Amount: $" + winnerData.amount+ " - Message: " + winnerData.message);
      }
      var link = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(visualWinners));
      window.open(link);
    }
  });
}

  
// Document ready
// --------------
$(document).ready(function() {
  
  // Fetch all donations
  
  myDataRef.once("value", function(data) {
    
    donations = data.val();
    
    for (var key in donations) {
      if (donations.hasOwnProperty(key)) {
        
        // Set donation variable 
        var donation = donations[key];
        donation.id = key;
    
        // Define total tickets for this donation
        var tickets = Math.floor(Math.floor(donation.amount/100)*5 + Math.floor((donation.amount - Math.floor(donation.amount/100)*100))/25);
        
        // Show info in console
        listTickets.push("id: " + donation.id + " - name: " + donation.name + " - Amount: $" + donation.amount + " - Tickets: " + tickets);
        
        // Put tickets in ticketsBowl
        var count = 0;
        for(var i = 0; i < tickets; i++){
          ticketsBowl.push(donation);
        }
        
        // Update Totals
        totalDonations ++;
        totalTickets += tickets
        totalMoney += parseInt(donation.amount);
        
      }
    }
    
    // Feedback in console
    console.log('Total donations : ' + totalDonations);
    console.log('Total donatated : $' + totalMoney);
    console.log('Total tickets : ' + totalTickets);
    console.log('Winners : ' + winners.length);
    console.log('-----------');
    
    // Show
    $('.js-donations').html(totalDonations);
    $('.js-tickets').html(totalTickets);
    
  });
  
  init();
  
});



