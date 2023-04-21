    /*
    American Express = '3'
    Visa = '4'
    Mastercards = '5'
    Discover = '6'
    */
function determine_credit_card(credit_card_number) {

  var x = credit_card_number;
  var first = String(x).charAt(0);
  var first_digit = Number(first);

  if(first_digit === 3) {
    card_type = "American Express";
  }
  else if(first_digit === 4){
    card_type = "Visa";
  }
  else if(first_digit === 5) {
    card_type = "Mastercards";
  }
  else if(first_digit === 6) {
    card_type = "Discover"
  }
  else {
    return null;
  }
  return card_type;
}

module.exports = { determine_credit_card };
  // or

  // exports.determine_credit_card = determine_credit_card;
  