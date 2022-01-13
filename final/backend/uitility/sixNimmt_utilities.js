
const licensingcard = (player_num) => {
    var suit = [];
    var selectedCardAry = [];
    var i;

    //console.log(player_num)
    for (i = 0; i < 104; i++)     // initialize 100 cards
        suit[i] = i + 1;

    for (i = 0; i < player_num * 10 + 4; i++) {                // draw 10 * player_num cards
        var selectedCard = getRandom(1, 104 - i);
        var card = suit[selectedCard];
        suit.splice(selectedCard, 1);
        selectedCardAry.push(card);
    }
    return selectedCardAry;
    
    function getRandom(min, max) {                               // get random number
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

const judgecards = (player, newcard) => {
    
}

export {licensingcard, judgecards}