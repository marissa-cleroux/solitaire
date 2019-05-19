// TODO: Drag and drop without jQuery?
// TODO: Give hints
// TODO: Optimize checking for loses (sees all the possibilities?!)
// TODO: Different messages for quitting and losing
// TODO: Optimize animations
// TODO: Show different screen when new game vs. losing
// TODO: Refactor to use class?

var $$ = function (id) {
    return document.getElementById(id)
};

function Card(_rank, _suit, _colour, _oneLower, _oneHigher) {
    this.rank = _rank;
    this.suit = _suit;
    this.colour = _colour;
    this.oneLower = _oneLower;
    this.oneHigher = _oneHigher;
    this.src = `images/cards/${this.suit}_${this.rank}.png`;
    this.id = `${this.suit}_${this.rank}`;
    this.card = function () {
        return `${this.rank} of ${this.suit}s`;
    };
}

function Deck() {
    this.suit = ['Club', 'Spade', 'Heart', 'Diamond'];
    this.rank = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.colour;
    this.deck = [];
    this.createDeck = function () {
        for (let k = 0; k < this.suit.length; k++) {
            (this.suit[k] == 'Club' || this.suit[k] == 'Spade') ? this.colour = 'black': this.colour = 'red';
            for (let j = 0; j < this.rank.length; j++) {
                Card[j] = new Card(this.rank[j], this.suit[k], this.colour, (this.rank[j] == 'A') ? 'N/A' : this.rank[j - 1], (this.rank[j] == 'K') ? 'N/A' : this.rank[j + 1]);
                this.deck.push(Card[j]);
            }
        }
    };
    this.shuffle = function () {
        for (let k = 0; k < 14; k++) {
            for (let i = 0; i < this.deck.length; i++) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = this.deck[i];
                this.deck[i] = this.deck[j];
                this.deck[j] = temp
            }
        }
    }; //fischer-yates shuffle

    this.location = 0;
    this.deal = function () {
        for (let i = 0; i < 7; i++) {
            if (i < 1) {
                gameTableau.colOne.push(this.deck[this.location]);
                this.location++;
            }
            if (i < 2) {
                gameTableau.colTwo.push(this.deck[this.location]);
                this.location++;
            }
            if (i < 3) {
                gameTableau.colThree.push(this.deck[this.location]);
                this.location++;
            }
            if (i < 4) {
                gameTableau.colFour.push(this.deck[this.location]);
                this.location++;
            }
            if (i < 5) {
                gameTableau.colFive.push(this.deck[this.location]);
                this.location++;
            }
            if (i < 6) {
                gameTableau.colSix.push(this.deck[this.location]);
                this.location++;
            }
            if (i < 7) {
                gameTableau.colSeven.push(this.deck[this.location]);
                this.location++;
            }
        }
        for (this.location; this.location < 52; this.location++) {
            gameStock.pile.push(this.deck[this.location]);
        }
        // deals iterating through each columns and prevented from adding more than the required cards to each column
    };
} // Creates a deck of card object by looping through all the ranks and suits

function Tableau() {
    this.colOne = [];
    this.colTwo = [];
    this.colThree = [];
    this.colFour = [];
    this.colFive = [];
    this.colSix = [];
    this.colSeven = [];
    this.theTableau = [this.colOne, this.colTwo, this.colThree, this.colFour, this.colFive, this.colSix, this.colSeven];
    this.createFaceUp = function () {
        this.colOne.push(new Array(this.colOne.pop()));
        this.colTwo.push(new Array(this.colTwo.pop()));
        this.colThree.push(new Array(this.colThree.pop()));
        this.colFour.push(new Array(this.colFour.pop()));
        this.colFive.push(new Array(this.colFive.pop()));
        this.colSix.push(new Array(this.colSix.pop()));
        this.colSeven.push(new Array(this.colSeven.pop()));
        this.colOneFaceUp = this.colOne[this.colOne.length - 1];
        this.colTwoFaceUp = this.colTwo[this.colTwo.length - 1];
        this.colThreeFaceUp = this.colThree[this.colThree.length - 1];
        this.colFourFaceUp = this.colFour[this.colFour.length - 1];
        this.colFiveFaceUp = this.colFive[this.colFive.length - 1];
        this.colSixFaceUp = this.colSix[this.colSix.length - 1];
        this.colSevenFaceUp = this.colSeven[this.colSeven.length - 1];
        this.canPlay = [this.colOneFaceUp, this.colTwoFaceUp, this.colThreeFaceUp, this.colFourFaceUp, this.colFiveFaceUp, this.colSixFaceUp, this.colSevenFaceUp];
    };

    this.updatePlayingCards = function () {
        for (let i = 0; i < this.canPlay.length; i++) {
            if (this.canPlay[i].length == 0) {
                if (this.theTableau[i].length == 1) {
                    this.canPlay[i] = ['Empty'];
                    console.log(`updating playing cards for col: ${i + 1} it is now empty`, this.canPlay[i]);
                } else {
                    this.canPlay[i].push(this.theTableau[i][this.theTableau[i].length - 2]);
                    this.theTableau[i].splice(this.theTableau[i].length - 2, 1);
                    console.log(`Updating playing for col ${i + 1}`, this.canPlay[i]);
                }
            }
        }
    } // Updates the playing cards by looping through each column and checking if there is a card 'flipped' if not it flips one
    // If there is nothing under it will set the column as 'Empty'
}

function Foundation() {
    this.hearts = ['Heart'];
    this.clubs = ['Club'];
    this.spades = ['Spade'];
    this.diamonds = ['Diamond'];
    this.onFoundation = [this.hearts, this.clubs, this.diamonds, this.spades];
}

function Stock() {
    this.pile = [];
    this.draw = function () {
        if (this.pile.length >= 3) {
            for (let i = 0; i < 3; i++) {
                gameWaste.pile.push(this.pile.pop());
            }
            return -1;
        } else if (this.pile.length == 2) {
            for (let i = 0; i < 2; i++) {
                gameWaste.pile.push(this.pile.pop());
            }
            return -2;
        } else if (this.pile.length == 1) {
            gameWaste.pile.push(this.pile.pop());
            return -3;
        }
        return 0;
    } // Shifts three cards (dependent on how many are in the pile) and pushes to the waste pile
}

function Waste() {
    this.pile = [];
}

function moveCard(numberOfCards, from, to) {

    var moving = [];
    if (from == gameWaste.pile && numberOfCards > 1) {
        return -1;
    } // allows only one card to be played from the waste pile

    if (numberOfCards <= from.length) {
        for (let i = 0; i < numberOfCards; i++) {
            moving.unshift(from.pop());
        } // creates an array of the cards being moved if the cards are less than or equal to the playable cards
    } else {
        return -1;
    }
    console.log(`You are moving:`);
    for (let i = 0; i < moving.length; i++) {
        console.log(moving[i].card());
    }

    for (let i = 0; i < gameFoundation.onFoundation.length; i++) {
        if (validPlayOnFoundation(moving[0], to, from) && to == gameFoundation.onFoundation[i][gameFoundation.onFoundation[i].length - 1]) {
            playOnFoundation(moving[0], to, from);
            return 2;
        }
    }

    for (let i = 0; i < gameTableau.canPlay.length; i++) {
        if (to == gameTableau.canPlay[i] && validPlayOnTableau(moving, to, from, numberOfCards)) {
            playOnTableau(moving, to, from, numberOfCards);
            return 1;
        }
    }

    for (let i = 0; i < numberOfCards; i++) {
        from.push(moving.shift());
    }
    console.error('Invalid move! Try a different move.');
    return -1;
    // If it didn't qualify for the previous ifs, the cards and re-added back to the place of origin and an error is returned
}

function validPlayOnFoundation(card, destination) {
    if (card.length > 1)
        return false;
    if (card.rank == 'A') {
        for (let i = 0; i < 4; i++) {
            if (destination == gameFoundation.onFoundation[i] && gameFoundation.onFoundation[i] == card.suit) {
                return true;
            }
        }
    } else if (destination == 'Heart' || destination == 'Club' || destination == 'Diamond' || destination == 'Spade') {
        return false;
    }

    for (let i = 0; i < gameFoundation.onFoundation.length; i++) {
        if (destination == gameFoundation.onFoundation[i][gameFoundation.onFoundation[i].length - 1] &&
            gameFoundation.onFoundation[i][gameFoundation.onFoundation[i].length - 1].rank == card.oneLower &&
            gameFoundation.onFoundation[i][gameFoundation.onFoundation[i].length - 1].suit == card.suit) {
            //console.log('Not ace valid play on to foundation');
            return true;
        }
    }
    return false;
} // validates plays on the foundation according to the rules provided in assignment 1


function playOnFoundation(cards, destination) {

    for (let i = 0; i < gameFoundation.onFoundation.length; i++) {
        if (destination == gameFoundation.onFoundation[i][gameFoundation.onFoundation[i].length - 1] &&
            validPlayOnFoundation(cards, gameFoundation.onFoundation[i][gameFoundation.onFoundation[i].length - 1]))
            gameFoundation.onFoundation[i].push(cards);
    }
}

function validPlayOnTableau(moving, to, from, numberOfCards) {
    if (to == 'Empty') {
        if (moving[0].rank == 'K') {
            return true;
        } else {
            return false;
        }
    } else if (to[to.length - 1].rank == moving[0].oneHigher && to[to.length - 1].colour != moving[0].colour) {
        return true;
    } else {
        return false;
    }
} // validates plays on the tableau according to the rules provided in assignment 1

function playOnTableau(moving, to, from, numberOfCards) {

    if (to == 'Empty') {
        for (let i = 0; i < numberOfCards; i++)
            to.push(moving.shift());
        to.shift();
        return true;
    }

    for (let i = 0; i < numberOfCards; i++) {
        to.push(moving.shift());
    }
    return true;
}

function lose() {
    endingAnimate();
    setTimeout(loseAnimate, 1000);
    $$('aMessage').textContent = `There are no more moves! Please click to play again`;
    $$('playAgain').style.display = 'inline';
    $$('newGame').style.display = 'none';
}


function win() {
    $$('newGame').style.display = 'none';
    $$('aMessage').textContent = `You won!`;
    $$('winnings').style.left = innerWidth / 4 + 'px';
    $$('quit').style.display = 'inline';
    endingAnimate();
    shootingStar();
} // Displays the message that they won, adds money to their bank roll and allows them to play again

function checkForWin() {
    var count = 0;
    const CARDS_IN_FULL_FOUNDATION = 13;
    for (let i = 0; i < gameFoundation.onFoundation.length; i++) {
        (gameFoundation.onFoundation[i].length != CARDS_IN_FULL_FOUNDATION) ? count = 0: count++;
    }
    if (count == gameFoundation.onFoundation.length && gameStock.pile.length == 0) {
        win();
        return true;
    }
    return false;
} // checks if the player won by counting how many cards are in the draw pile and the foundation
// can test by uncomment script and input tag game.html

function Count() {
    this.count = 0;
} // A count to keep track of valid moves from the waste pile

function wastePileValidMove() {

    if (gameWaste.pile.length == 0)
        return false;
    var onWastePile = [gameWaste.pile[gameWaste.pile.length - 1]];

    for (let i = 0; i < gameTableau.canPlay.length; i++) {
        if (validPlayOnTableau(onWastePile, gameTableau.canPlay[i], gameWaste.pile, 1)) {
            //console.log('Valid play from waste pile');
            return validPlayCount.count = 0;
        }
    } // Checks for valid moves from the waste pile to the tableau by looping through the values of the cards;
    // if there is one it resets the count back to zero so that the game will not set of the lose()

    for (let i = 0; i < gameFoundation.onFoundation.length; i++) {
        if (validPlayOnFoundation(onWastePile[0], gameFoundation.onFoundation[i][gameFoundation.onFoundation[i].length - 1]) ||
            onWastePile.rank == 'A') {
            //console.log('Valid play from waste pile on foundation');
            return validPlayCount.count = 0;

        }
    } // Checks for valid plays by comparing the cards, if there is a valid play it resets the count pack to zero

    return validPlayCount.count += 1;
    // Adds one to the count if no valid plays were found

}

function checkForLose() {
    for (let i = 0; i < gameTableau.canPlay.length; i++) {
        for (let j = 0; j < gameTableau.canPlay.length; j++) {
            if (i !== j) {
                if (validPlayOnTableau(gameTableau.canPlay[i], gameTableau.canPlay[j], gameTableau.canPlay[i], gameTableau.canPlay[i].length)) {
                    if (gameTableau.theTableau[i].length == 1 && gameTableau.canPlay[i][0].rank == 'K')
                        break;
                    //console.log(`valid move from tableau to tableau`);
                    validPlayCount.count = 0;
                    return false;
                }
            }
        }
    } // Checks for valid plays from the tableau to the tableau by looping through the cards and comparing, if there are it sets the count back to 0

    for (let i = 0; i < gameTableau.canPlay.length; i++) {
        for (let j = 0; j < gameFoundation.onFoundation.length; j++) {
            try {
                if (validPlayOnFoundation(gameTableau.canPlay[i][gameTableau.canPlay[i].length - 1], gameFoundation.onFoundation[j][gameFoundation.onFoundation[j].length - 1]) ||
                    gameTableau.canPlay[i][gameTableau.canPlay[i].length - 1].rank == 'A') {
                    //console.log(`valid move from tableau to foundation`);
                    validPlayCount.count = 0;
                    return false;
                }
            } catch (err) {
                console.log('Invalid move');
            }
        }
    } // Checks for valid plays from the tableau to the foundation if there are it sets the count back to 0

    if (validPlayCount.count <= 8) { //8 being the standard full stock pile length iterations
        return false;
    } // Checks that there has not been any valid plays for at least eight iterations drawing from the waste pile

    lose();
}

function quit() {
    var cardsOnFoundation = 0;
    var payOut = 0;

    for (let i = 0; i < 4; i++) {
        if (gameFoundation.onFoundation[i] == 'Heart' || gameFoundation.onFoundation[i] == 'Diamond' || gameFoundation.onFoundation[i] == 'Club' || gameFoundation.onFoundation[i] == 'Spade') {
            cardsOnFoundation;
        } else
            cardsOnFoundation += gameFoundation.onFoundation[i].length;
    }

    if (cardsOnFoundation > 0) {
        payOut += cardsOnFoundation * 5 - (gameBet.betAmt);
        return payOut;
    } else {
        return gameBet.betAmt * -1;
    }

} // calculates players pay out dependent on the cards on the foundation, using scheme suggested in assignment 1

function shakeLeft(wrongCard) {
    try {
        $$(wrongCard).style.transform = 'rotate(-25deg)';
    } catch (err) {
        console.log('Technical difficulty with drag and drop');
    }
}

function shakeRight(wrongCard) {
    try {
        $$(wrongCard).style.transform = 'rotate(25deg)';
    } catch (err) {
        console.log('Technical difficulty with drag and drop');
    }
}

function shakeDone(wrongCard) {
    try {
        $$(wrongCard).style.transform = 'rotate(0deg)';
    } catch (err) {
        console.log('Technical difficulty with drag and drop');
    }
} // handles error that occurs when a user tries to play a card but does not place it fully on the destination

function shakeCard(wrongCard) {
    setTimeout(function () {
        shakeLeft(wrongCard)
    }, 100);
    setTimeout(function () {
        shakeRight(wrongCard)
    }, 200);
    setTimeout(function () {
        shakeLeft(wrongCard)
    }, 300);
    setTimeout(function () {
        shakeRight(wrongCard)
    }, 400);
    setTimeout(function () {
        shakeDone(wrongCard)
    }, 500);
} // animates a card when the user tries to make an invalid move

function getRandomPos(maxBounds) {
    var randomPos = Math.floor(Math.random() * maxBounds);
    return randomPos;
}

function sparkle(img, posLeft, posTop, time) {
    setTimeout(() => {
        $$('row-foundation').appendChild(img);
        img.style.position = 'absolute';
        img.style.left = posLeft + 'px';
        img.style.top = posTop + 'px';
        img.style.zIndex = '10';
    }, time);

} // adds sparkles when the user plays on the foundation



function removeSparkle(img, time) {
    setTimeout(() => {
        $$('row-foundation').removeChild($$(img));
    }, time);

}

function shootingStar() {
    let img = new Image();
    img.src = `images/Shooting_Star${0}.png`;
    $$('tableau').appendChild(img);
    img.style.position = 'absolute';
    let bottomPos = 0;
    let leftPos = innerWidth + 97;

    var shot = setInterval(() => {
        (bottomPos < innerHeight) ? bottomPos += 25: clearInterval(shot);
        leftPos -= 25;
        img.style.bottom = bottomPos + 'px';
        img.style.left = leftPos + 'px';
    }, 50);
} // shooting star is displayed when the user plays on the foundation

function foundationAnimation() {
    var sparkleImg = [];
    for (let i = 0; i < 4; i++) {
        sparkleImg[i] = `images/Sparkles${i}.png`;

    }

    var foundationBounds = $$('row-foundation').getBoundingClientRect();
    var time = 0;
    shootingStar();

    for (let i = 0; i < 4; i++) {
        let img = new Image();
        img.src = sparkleImg[i];
        img.id = `tempSparkle${i}`;
        var tempLeft = getRandomPos(foundationBounds.left);
        var tempTop = getRandomPos(foundationBounds.top);
        time += 250;
        sparkle(img, tempLeft, tempTop, time);
    }

    for (let i = 0; i < 4; i++) {
        time += 700;
        removeSparkle(`tempSparkle${i}`, time);
    }
} // Animates when the user plays on the foundation


function findCard(first, second) {
    let from = undefined;
    let to = undefined;
    var columns = {
        'columnOne': gameTableau.canPlay[0],
        'columnTwo': gameTableau.canPlay[1],
        'columnThree': gameTableau.canPlay[2],
        'columnFour': gameTableau.canPlay[3],
        'columnFive': gameTableau.canPlay[4],
        'columnSix': gameTableau.canPlay[5],
        'columnSeven': gameTableau.canPlay[6],
    };
    for (let i = 0; i < gameTableau.canPlay.length; i++) {
        for (let j = 0; j < gameTableau.canPlay[i].length; j++) {
            if (gameTableau.canPlay[i][j].id == first) {
                from = gameTableau.canPlay[i];
                var numberOfCards = gameTableau.canPlay[i].length - j;
            } else if (gameTableau.canPlay[i][j].id == second) {
                to = gameTableau.canPlay[i];
            }
        }
    }


    if (from == undefined) {
        from = gameWaste.pile;
        numberOfCards = 1;
    }


    var foundationPlace = {
        'foundationSpade': gameFoundation.spades[gameFoundation.spades.length - 1],
        'foundationDiamond': gameFoundation.diamonds[gameFoundation.diamonds.length - 1],
        'foundationClub': gameFoundation.clubs[gameFoundation.clubs.length - 1],
        'foundationHeart': gameFoundation.hearts[gameFoundation.hearts.length - 1]
    };


    if (to == undefined) {
        for (let i = 0; i < gameFoundation.onFoundation.length; i++) {
            if (second == 'foundationHeart' || second == 'foundationClub' || second == 'foundationDiamond' || second == 'foundationSpade') {
                to = foundationPlace[second];
            }
        }
    }

    if (to == undefined) {
        to = columns[second];
    }

    return [numberOfCards, from, to];
} // connects the DOM to the game logic by searching for the card in the logic so that the game can validate the users move

function moveCardOnDOM(first, second) {
    var moveCardValue = 0;

    let fromTo = findCard(first, second);

    moveCardValue = moveCard(fromTo[0], fromTo[1], fromTo[2]);
    switch (moveCardValue) {
        case -1:
            if (fromTo[1] == gameWaste.pile)
                shakeCard($$('wastePile').lastChild.id);
            else
                shakeCard(first);
            break;
        case 2:
            foundationAnimation();
            break;
    }

    gameTableau.updatePlayingCards();
    dealToTheDOM();
    return moveCardValue;

}

function setLeftPosition(img, i) {
    if (innerWidth < 340)
        img.style.left = i * 40 + 'px';
    else if (innerWidth < 555)
        img.style.left = i * 50 + 'px';
    else if (innerWidth < 768)
        img.style.left = i * 75 + 'px';
    else if (innerWidth < 1068)
        img.style.left = i * 100 + 'px';
    else
        img.style.left = i * 150 + 'px';
}

function setLeftPositionWP(img, i) {

    switch (i) {
        case 0:
            img.style.left = 22 + 'vw';
            break;
        case 1:
            img.style.left = 18 + 'vw';
            break;
        case 2:
            img.style.left = 14 + 'vw';
            break;

    }
}

function dealToTheDOM() {

    var columns = document.getElementsByClassName('card-bottom');
    $$('wastePile').innerHTML = '';


    for (let k = 0; k < columns.length; k++) {
        columns[k].innerHTML = ``;
    }

    for (let i = 0; i < columns.length; i++) {
        var startTop = 0;
        if (gameTableau.canPlay[i] == 'Empty') {
            let img = new Image();
            img.src = 'images/cards/blank.png';
            img.classList.add('emptySpot');
            columns[i].appendChild(img);
            img.id = columns[i].id;
            setLeftPosition(img, i);
        } else if (gameTableau.theTableau[i].length > 1) {
            for (let unflippedCard = 0; unflippedCard < gameTableau.theTableau[i].length; unflippedCard++) {
                let img = new Image();
                img.src = 'images/cards/BackgroundBlack.png';
                img.classList.add('unflippedCard');
                columns[i].appendChild(img);
                img.style.top = unflippedCard * 10 + 'px';
                startTop = unflippedCard * 10;
                setLeftPosition(img, i);
            }
        }

        if (gameTableau.theTableau[i].length == 1)
            startTop = 0;

        if (gameTableau.canPlay[i] != 'Empty')
            for (let j = 0; j < gameTableau.canPlay[i].length; j++) {
                let img = new Image();
                img.src = gameTableau.canPlay[i][j].src;
                img.id = gameTableau.canPlay[i][j].id;
                img.alt = gameTableau.canPlay[i][j].card();
                img.classList.add('flippedCard');
                columns[i].appendChild(img);
                setLeftPosition(img, i);
                img.style.top = startTop + j * 25 + 'px'

            }
    }

    if (gameWaste.pile.length == 1) {
        let img = new Image();
        img.src = gameWaste.pile[gameWaste.pile.length - 1].src;
        img.alt = gameWaste.pile[gameWaste.pile.length - 1].card();
        $$('wastePile').appendChild(img);
        setLeftPositionWP(img, 3);
    } else if (gameWaste.pile.length >= 3) {
        for (let j = 2; j >= 0; j--) {
            let img = new Image();
            img.src = gameWaste.pile[gameWaste.pile.length - j - 1].src;
            img.id = gameWaste.pile[gameWaste.pile.length - j - 1].id;
            img.alt = gameWaste.pile[gameWaste.pile.length - j - 1].card();
            $$('wastePile').appendChild(img);
            setLeftPositionWP(img, j);
        }
    } else if (gameWaste.pile.length == 2) {
        for (let j = 1; j >= 0; j--) {
            let img = new Image();
            img.src = gameWaste.pile[gameWaste.pile.length - j - 1].src;
            img.id = gameWaste.pile[gameWaste.pile.length - j - 1].id;
            img.alt = gameWaste.pile[gameWaste.pile.length - j - 1].card();
            $$('wastePile').appendChild(img);
            setLeftPositionWP(img, j);
        }
    } else {
        let img = new Image();
        img.src = 'images/cards/blank.png';
        img.alt = 'No cards in pile';
        $$('wastePile').appendChild(img);
        setLeftPositionWP(img, 2);
    }

    if (gameWaste.pile.length > 0) {
        $$('wastePile').lastChild.classList.add('flippedCard');
    }

    var foundation = document.getElementsByClassName('foundation');

    for (let i = 0; i < gameFoundation.onFoundation.length; i++)
        if (gameFoundation.onFoundation[i] != 'Heart' && gameFoundation.onFoundation[i] != 'Club' && gameFoundation.onFoundation[i] != 'Spade' && gameFoundation.onFoundation[i] != 'Diamond') {
            foundation[i].src = gameFoundation.onFoundation[i][gameFoundation.onFoundation[i].length - 1].src;
        }


    if (!sessionStorage.getItem('touchScreen')) // add event handlers depending on if the user has a touch screen or not
    {
        addDraggableDroppable();
    } else {
        addClickAndDrop();
    }

} // deals to the DOM using various positioning techniques to display the game in the typical solitaire fashion

$$('stockPile').addEventListener('click', () => {

    let drawn = gameStock.draw();
    if (drawn == -1) {
        dealToTheDOM();
        wastePileValidMove();
        checkForLose(validPlayCount.count);

    } else if (drawn < -1) {
        $$('stockPile').src = 'images/cards/blank.png';
        dealToTheDOM();
        wastePileValidMove();
        checkForLose(validPlayCount.count);
    } else {
        $$('stockPile').src = 'images/cards/BackgroundBlack.png';
        gameStock.pile = gameWaste.pile.reverse();
        gameWaste.pile = [];
        dealToTheDOM();
    }
});

$$('quit').addEventListener('click', () => {
    $$('playing').style.display = 'none';
    $$('endGame').style.display = 'inline';
    $$('aMessage').textContent = `Thanks for coming, play again soon!`;
    $$('playAgain').style.display = 'none';
});

function preStart() {
    $$('newGame').style.display = 'none';
    $$('quit').style.display = 'none';
    $$('playing').style.display = 'none';
    $$('endGame').style.display = 'none';
    startGame();
}


$$('playAgain').addEventListener('click', preStart);
$$('newGame').addEventListener('click', lose);


function startGame() {

    const A_GOOD_SHUFFLE = 8;
    $$('endGame').style.display = 'none';
    document.querySelector('h2').textContent = 'STURMFREI';
    document.querySelector('h2').style.display = 'inline';
    $$('newGame').style.display = 'inline';
    $$('quit').style.display = 'inline';
    document.querySelector('h3').textContent = '';
    $$('playing').style.display = 'block';
    gameDeck = new Deck();
    gameTableau = new Tableau();
    gameStock = new Stock();
    gameFoundation = new Foundation();
    gameWaste = new Waste();
    gameDeck.createDeck();

    for (let i = 0; i < A_GOOD_SHUFFLE; i++) {
        gameDeck.shuffle();
    }

    gameDeck.deal();
    gameTableau.createFaceUp();
    gameTableau.updatePlayingCards();
    validPlayCount = new Count();
    dealToTheDOM();
    var foundation = document.getElementsByClassName('foundation');
    $$('wastePile').innerHTML = '';
    $$('foundationHeart').src = 'images/heart.png';
    $$('foundationClub').src = 'images/club.png';
    $$('foundationSpade').src = 'images/spade.png';
    $$('foundationDiamond').src = 'images/diamond.png';
    addEventListener('touchstart', () => {
        sessionStorage.setItem('touchScreen', 'true');
        dealToTheDOM();
    });
    addEventListener('resize', dealToTheDOM);
    firstClick = false;
    firstTarget = undefined;
    secondTarget = undefined;
}

addEventListener('load', preStart);

addEventListener('error', function () {
    $$('error').textContent = 'Sorry there has been an unexpected error, a new game will be started';
    setTimeout(() => location.href = 'intro.html', 5000);
});

var firstClick = false;
var firstTarget = undefined;
var secondTarget = undefined;

function addClickAndDrop() {

    $('h2').append('<span id=version>');
    $('#version').text('*Click and drop version');
    $$('row-bottom').addEventListener('click', function (e) {
        if (!firstClick && e.target.classList.contains('flippedCard') && !e.target.classList.contains('emptySpot') && secondTarget != e.target) {
            firstClick = true;
            firstTarget = e.target;
            e.target.style.border = 'solid 3px #008080'
        } else if (e.target.tagName == 'IMG' && firstClick && firstTarget != e.target && !e.target.classList.contains('unflippedCard')) {
            secondTarget = e.target;
            moveCardOnDOM(firstTarget.id, secondTarget.id);
            firstTarget.style.border = '0';
            firstTarget = undefined;
            firstClick = false;
        }
    });

    $$('stockPile').addEventListener('click', () => {
        if (firstTarget != undefined) {
            firstTarget.style.border = '0';
            firstTarget = undefined;
            firstClick = false;
        }
    });

    if (gameWaste.pile.length > 0)
        $$('wastePile').lastChild.addEventListener('click', (e) => {
            if (e.target.tagName == 'IMG' && !firstClick) {
                firstClick = true;
                firstTarget = e.target;
                e.target.style.border = 'solid 3px #008080';
            } else if (e.target.tagName == 'IMG' && firstClick) {
                firstTarget.style.border = '0';
                firstClick = false;
                firstTarget = undefined;
            }
        }, true);

    $$('row-foundation').addEventListener('click', function (e) {
        if (e.target.tagName == 'IMG' && firstClick && firstTarget != e.target) {
            secondTarget = e.target;
            moveCardOnDOM(firstTarget.id, secondTarget.id, e.target.id);
            firstTarget.style.border = '0';
            firstTarget = undefined;
            secondTarget = undefined;
            firstClick = false;
        } else {
            firstTarget = undefined;
            secondTarget = undefined;
            firstClick = false;
        }
    });
}

function endingAnimate() {
    $('#playing').slideUp('slow', function () {
        $('#endGame').add('#playAgain').slideDown('slow')
    });
}

function loseAnimate() {
    let NUMDROPS = 50;
    let rainDrops = new Array(NUMDROPS);
    for (let i = 0; i < NUMDROPS; i++) {
        let img = new Image();
        img.src = 'images/drop.png';
        img.style.position = 'absolute';
        img.style.zIndex = 30;
        img.style.left = getRandomPos(innerWidth) + 'px';
        img.style.top = 0;
        img.id = `drop${i}`;
        img.opacity = 0.3;
        rainDrops[i] = img;
    }
    let time = 0;

    for (let i = 0; i < NUMDROPS; i++) {
        setTimeout(function () {
            dropFalling(i, rainDrops[i])
        }, time += (2 * i));
    }

    for (let i = 0; i < NUMDROPS; i++) {
        $(`#drop${i}`).remove();
    }

} // display rain drops when quitting, ending, or new game (anything except win)


function dropFalling(num, img) {
    $('body').prepend(img);
    $(`#drop${num}`).animate({
        "top": "100vh"
    }, 1000);
}

function addDraggableDroppable() {
    $('h2').append('<span id=version>');
    $('#version').text('*Drag and drop version');

    $('.flippedCard').draggable({
        revert: true,
        zIndex: 10,
    });

    $('.emptySpot').droppable({
        tolerance: 'touch',
        drop: function (e, ui) {
            moveCardOnDOM(ui.draggable.attr('id'), $(this).attr('id'));
        }
    });

    $('.flippedCard').droppable({
        tolerance: 'touch',
        drop: function (e, ui) {
            if (ui.draggable.parent().attr('id') == $(this).parent().attr('id'))
                e.revert = true;
            else
                moveCardOnDOM(ui.draggable.attr('id'), $(this).attr('id'));
        }
    });

    $('.foundation').droppable({
        tolerance: 'touch',
        greedy: true,
        drop: function (e, ui) {
            moveCardOnDOM(ui.draggable.attr('id'), $(this).attr('id'));
        }
    })

} // allows cards cards to be draggable on desktop (or non-touch interfaces(
