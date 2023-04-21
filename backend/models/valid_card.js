const card_company = require("./determine_card");

function valid_credit_card(credit_card_number) {
    const card_type = card_company.determine_credit_card(credit_card_number)
    if(card_type === "American Express"){
        if(credit_card_number.length === 15) {
            return true;
        }
    }
    else if(card_type === "Visa"|| card_type === "Mastercards"|| card_type === "Discover"){
        if(credit_card_number.length === 16) {
            return true;
        }
    }
    
    return false;
}

module.exports = { valid_credit_card };

  // or

//   exports.valid_card = valid_card;