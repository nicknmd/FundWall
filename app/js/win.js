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
var winners = JSON.parse(localStorage.getItem('winners'));
winners = (winners == null)? [] : winners;


// Main functions
// --------------

function getWinner() {
  var winner = randomWinner();
  var winnerData = ticketsBowl[winner];
  saveWinner(winner);
  return winnerData;
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
    console.log((i+1)+" - ticket: " + winners[i] +" - id: " + winnerData.id + " - name: " + winnerData.name + " - Amount: $" + winnerData.amount+ " - Message: $" + winnerData.amount);
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
    console.log('-----------');
    
  });
  
});



