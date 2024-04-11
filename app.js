const HEIGHT = window.innerHeight
const WIDTH = window.innerWidth
const LUDO_BOARD = SELECT_ELEMENT(".ludo-board")

const PATHS_ELS = [...SELECT_MULTIPLE_ELEMENTS(".path")]
const DICES_ROLLER = SELECT_ELEMENT(".dice-roller")
let dicesEls = [...SELECT_ELEMENT(".dices").children]
const SAFE_PAWNS_CONTAINER_EL = SELECT_ELEMENT(".safe-pawns-container")
const msgEl = SELECT_ELEMENT(".msg-el")
const DICE_ROLLER_INFO = SELECT_ELEMENT(".dice-roller-info")

let canRollDice = false
let diceIsRolling = false
let playerOneTurn = true
let moves = []
let tempMoves = []
let currentMove = null;
let doubleSix = null
let dblSixPrivilege;
let gameHasEnded = false
let otherMove = null

// PAWNS
const PAWNS = SELECT_MULTIPLE_ELEMENTS(".pawn")
const GREEN_PAWNS = [...SELECT_MULTIPLE_ELEMENTS(".green-pawn")]
const RED_PAWNS = [...SELECT_MULTIPLE_ELEMENTS(".red-pawn")]
const YELLOW_PAWNS = [...SELECT_MULTIPLE_ELEMENTS(".yellow-pawn")]
const BLUE_PAWNS = [...SELECT_MULTIPLE_ELEMENTS(".blue-pawn")]

// PAWNS SPECIFIC PATHS INDICES(INDEX)
const GREEN_PAWNS_PATHS_INDICES = [19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14, 17, 36, 37, 38, 39, 40, 41, 47, 53, 52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 69, 66, 63, 60, 57, 54, 35, 34, 33, 32, 31, 30, 24, 25, 26, 27, 28, 29]
const RED_PAWNS_PATHS_INDICES = [66, 63, 60, 57, 54, 35, 34, 33, 32, 31, 30, 24, 18, 19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14, 17, 36, 37, 38, 39, 40, 41, 47, 53, 52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 67, 64, 61, 58, 55]
const YELLOW_PAWNS_PATHS_INDICES  = [5, 8, 11, 14, 17, 36, 37, 38, 39, 40, 41, 47, 53, 52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 69, 66, 63, 60, 57, 54, 35, 34, 33, 32, 31, 30, 24, 18, 19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 4, 7, 10, 13, 16]
const BLUE_PAWNS_PATHS_INDICES = [52, 51, 50, 49, 48, 56, 59, 62, 65, 68, 71, 70, 69, 66, 63, 60, 57, 54, 35, 34, 33, 32, 31, 30, 24, 18, 19, 20, 21, 22, 23, 15, 12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14, 17, 36, 37, 38, 39, 40, 41, 47, 46, 45, 44, 43, 42]

// PAWNS HOUSES
const GREEN_PAWNS_HOUSE = SELECT_ELEMENT(".green-house")
const RED_PAWNS_HOUSE = SELECT_ELEMENT(".red-house")
const YELLOW_PAWNS_HOUSE = SELECT_ELEMENT(".yellow-house")
const BLUE_PAWNS_HOUSE = SELECT_ELEMENT(".blue-house")

let PLAYER_ONE = createPlayer(GREEN_PAWNS, BLUE_PAWNS, GREEN_PAWNS_PATHS_INDICES, BLUE_PAWNS_PATHS_INDICES)
let PLAYER_TWO = createPlayer(RED_PAWNS, YELLOW_PAWNS, RED_PAWNS_PATHS_INDICES, YELLOW_PAWNS_PATHS_INDICES)

if (HEIGHT > WIDTH) {
    LUDO_BOARD.classList.add("full-width")
} else {
    LUDO_BOARD.classList.add("full-height")
}

function createPawnElement(pawn, distance) {
    return {
        element: pawn,
        distance: distance,
    };
}

function createPlayer(PAWN_ONE, PAWN_TWO, PAWN_ONE_PATHS_INDICES, PAWN_TWO_PATHS_INDICES) {
    return {
        pawns: {
            pawnOne: {
                "1": createPawnElement(PAWN_ONE[0], -1),
                "2": createPawnElement(PAWN_ONE[1], -1),
                "3": createPawnElement(PAWN_ONE[2], -1),
                "4": createPawnElement(PAWN_ONE[3], -1),
            },
            pawnTwo: {
                "1": createPawnElement(PAWN_TWO[0], -1),
                "2": createPawnElement(PAWN_TWO[1], -1),
                "3": createPawnElement(PAWN_TWO[2], -1),
                "4": createPawnElement(PAWN_TWO[3], -1),
            },
        },
        pathsIndices: {
            pawnOne: PAWN_ONE_PATHS_INDICES,
            pawnTwo: PAWN_TWO_PATHS_INDICES
        },
        safePawns: [],
        APPEND_PAWN(pawn, pawnPathIndices, pawndistance) {
            PATHS_ELS[pawnPathIndices[pawndistance]].append(pawn)
        },
    }
}

function SELECT_ELEMENT(selector) {
    const element = document.querySelector(selector)
    if (element) return element
    throw new Error("element is undefined")
}

function SELECT_MULTIPLE_ELEMENTS(selector) {
    const element = document.querySelectorAll(selector)
    if (element) return element
    throw new Error("element is undefined")
}

function SWAP_TURN() {
    announceTurn()
    playerOneTurn = !playerOneTurn
} 

function getPawnsObject(player) {
    let arr = []
    // loop through the current "player" Object, get and return "pawn" Object from "player" Object
    for (const [entry, value] of Object.entries(player)) {
        // only check 'pawn' object inside player object
        if (entry == "pawns") {

            for (const [, subValue] of Object.entries(value)) {
                for (const [, subSubValue] of Object.entries(subValue)) {
                    //  where;
                    /* subSubValue = {
                        element: pawn,
                        distance: distance,
                    }   */
                    arr.push(subSubValue)
                }
            }
        }
    }
    return arr // where; "arr" contains lists of objects containing pawnElements and pawnDistances
}

function announceTurn() {
    setTimeout(() => {
        msgEl.style.display = "flex" // display the message on the screen
        let msg = `Its Player ${playerOneTurn ? "One's" : "Two's"} Turn` 
        msgEl.innerText = msg // announce the current Players' turn

        setTimeout(() => {
            msgEl.style.display = "none" // hide the message
            canRollDice = true // player can roll dice now
        }, 700);
    }, 500)
}

function announceWin() {
    setTimeout(() => {
        msgEl.style.display = "flex" // display the message on the screen
        let msg = `Player ${playerOneTurn ? "One's" : "Two's"} is the Winner`
        msgEl.innerHTML = `${msg} <button>Restart Game</button>` // announce the winner and display restart btn
        msgEl.children[0].addEventListener("click", () => {
            resetGame()
        })
    }, 500)
}

function resetGame() {
    // reset the values of Players Objects
    PLAYER_ONE = createPlayer(GREEN_PAWNS, BLUE_PAWNS, GREEN_PAWNS_PATHS_INDICES, BLUE_PAWNS_PATHS_INDICES)
    PLAYER_TWO = createPlayer(RED_PAWNS, YELLOW_PAWNS, RED_PAWNS_PATHS_INDICES, YELLOW_PAWNS_PATHS_INDICES)
    let playerOnePawns = getPawnsObject(PLAYER_ONE).map(pawnObj => { return pawnObj.element })
    let playerTwoPawns = getPawnsObject(PLAYER_TWO).map(pawnObj => { return pawnObj.element })
    for (let i = 0; i < 8; i++) {
        if (i < 4) {
            GREEN_PAWNS_HOUSE.append(playerOnePawns[i]) // send GREEN pawns back to their homes
            RED_PAWNS_HOUSE.append(playerTwoPawns[i]) // send RED pawns back to their homes
        } else {
            BLUE_PAWNS_HOUSE.append(playerOnePawns[i]) // send BLUE pawns back to their homes
            YELLOW_PAWNS_HOUSE.append(playerTwoPawns[i]) // send YELLOW pawns back to their homes
        }
    }

    dicesEls.forEach(diceEl => {
        diceEl.innerText = "" // if there is still a move left, empty it
    })

    // set all non-constant global variables to their initial values 
    canRollDice = false
    diceIsRolling = false
    playerOneTurn = true
    moves = []
    currentMove = null;
    doubleSix = null
    dblSixPrivilege;
    gameHasEnded = false
    announceTurn()
}

function INTRUDERS_ARE_PRESENT(pawn, player, otherMove) {
    let currentClass = playerOneTurn ? "player-one-pawn" : "player-two-pawn" 
    let pawnObjsArr = getPawnsObject(player) // an array containing the "pawn" Objects of the "player" Object
    let oppPawnObjArr = getPawnsObject(playerOneTurn ? PLAYER_TWO : PLAYER_ONE) // an array containing the "pawn" Objects of the opponent "player" Object
    let overallDistance = GREEN_PAWNS_PATHS_INDICES.length // the max amount of steps a pawnEl can take
    let isAnyOtherPawnMovable = (currPawn, otherMove) => {
        return pawnObjsArr.some(pawnObj => {
            let booleanObj = {
                IsNotSamePawn: pawnObj.element !== currPawn, // check if current pawnEl is not equal to the otherPawnEL
                pawnisOnBoard: otherMove && pawnObj.distance !== null, // check if pawn hasn't entered safe house and if there is an otherMove
                pawnCanBeSpawned: pawnObj.distance === -1 && otherMove === 6, // check if pawnEl can be spwaned
                pawnCanMove: (pawnObj.distance + otherMove <= overallDistance) && pawnObj.distance !== -1, // check if pawnEl can take steps on the paths

            }
            return (booleanObj.IsNotSamePawn && booleanObj.pawnisOnBoard && (booleanObj.pawnCanBeSpawned || booleanObj.pawnCanMove))
        });
    }
    let pawnElsInBattle = [...pawn.parentElement.children] // list of pawnEls that are in a particular path

    pawnElsInBattle.forEach(pawnEl => {
        if (!pawnEl.classList.contains(currentClass)) {
            let oppPawnEl = pawnEl
            oppPawnObjArr.forEach(pawnObj => {
                if (oppPawnEl === pawnObj.element && (isAnyOtherPawnMovable(pawn, otherMove) || !moves[0])) {
                    pawnObj.distance = -1; // reset pawn distance
                    let PAWN_HOUSE = null;

                    // select the required Pawn House for the killed pawn(s)
                    if (oppPawnEl.classList.contains("green-pawn")) {
                        PAWN_HOUSE = GREEN_PAWNS_HOUSE
                    } else if (oppPawnEl.classList.contains("red-pawn")) {
                        PAWN_HOUSE = RED_PAWNS_HOUSE
                    } else if (oppPawnEl.classList.contains("yellow-pawn")) {
                        PAWN_HOUSE = YELLOW_PAWNS_HOUSE
                    } else {
                        PAWN_HOUSE = BLUE_PAWNS_HOUSE
                    }
                    
                    PAWN_HOUSE.append(oppPawnEl) // send pawnEl back home
                    pawnObjsArr.forEach(pawnObj => { 
                    if (pawnObj.element === pawn) { 
                        pawnObj.distance = null // pawn isn't on the board anymore
                        SAFE_PAWNS_CONTAINER_EL.children[playerOneTurn ? 0 : 1].append(pawnObj.element) // send killer pawn(pawn that sent other pawn(s) home) to safe House
                        player.safePawns.push(pawnObj.element) // add pawnEl to it "player" Object safePawn container
                    }
            })
                }
            })
        }
    })
}

function thoroughPawnsCheck(player) {
    let overallDistance = GREEN_PAWNS_PATHS_INDICES.length // the max amount of steps a pawnEl can take
    let pawnObjsArr = getPawnsObject(player) // an array containing the "pawn" Objects of the "player" Object
    const pawnisOnBoard = (pawnDistance) => { return pawnDistance !== null }
    const pawnCanBeSpawned = (pawnDistance) => { return pawnDistance === -1 && moves.includes(6) }
    const pawnCanMove = (pawnDistance) => { return (moves.some(move => move <= overallDistance - pawnDistance) && pawnDistance >= 0) }

    return pawnObjsArr.some(pawnObj => {
        return (pawnisOnBoard(pawnObj.distance) && (pawnCanBeSpawned(pawnObj.distance) || pawnCanMove(pawnObj.distance)))
    })
}

function isAnyPawnMovable(player, moveToUse) {
    let pawnObjsArr = getPawnsObject(player)
    let overallDistance = GREEN_PAWNS_PATHS_INDICES.length // an array containing the "pawn" Objects of the "player" Object

    const pawnisOnBoard = (pawnDistance) => { return pawnDistance !== null }
    const pawnCanBeSpawned = (pawnDistance) => { return pawnDistance === -1 && moveToUse === 6 }
    const pawnCanMove = (pawnDistance) => { return (moveToUse <= overallDistance - pawnDistance && pawnDistance >= 0) }
     
    return pawnObjsArr.some(pawnObj => {
        return (pawnisOnBoard(pawnObj.distance) && (pawnCanBeSpawned(pawnObj.distance) || pawnCanMove(pawnObj.distance)))  
    })
}

function canThePawnMove(pawnDistance, moveToUse) {
    let overallDistance = GREEN_PAWNS_PATHS_INDICES.length // an array containing the "pawn" Objects of the "player" Object

    const pawnisOnBoard = (pawnDistance !== null) 
    const pawnCanBeSpawned = (pawnDistance === -1 && moveToUse === 6)
    const pawnCanMove = (moveToUse <= overallDistance - pawnDistance && pawnDistance >= 0)

    return (pawnisOnBoard && (pawnCanBeSpawned || pawnCanMove)) && !diceIsRolling
}

function USE_DICE_NUMBERS(diceEl) {
    if (!gameHasEnded) {
        let player = playerOneTurn ? PLAYER_ONE : PLAYER_TWO // set the current "player" Object to the "player" variable
        const moveToUse = parseInt(diceEl.innerText) // get the number value of the clicked dice
        otherMove = moves.find(move => move !== moveToUse); // get the number value of the other dice that wasn't clicked
        if (!otherMove && moves.length === 2 && moves[0] === moves[1]) {
            otherMove = moveToUse; // get the number value of the other dice that wasn't clicked
        }
        const CHECK_MOVE_DICE = () => { return !currentMove && moves[0] && !diceIsRolling && diceEl.innerText != "" } // check if dices and moves are in the right state
        if (parseInt(diceEl.innerText) && CHECK_MOVE_DICE() && isAnyPawnMovable(player, parseInt(diceEl.innerText))) {
            currentMove = parseInt(diceEl.innerText) // set the current move as the number value of the clicked dice
            moves.splice(moves.indexOf(currentMove), 1) // remove the used move from the "moves" array
            diceEl.innerText = "" // empty the value of the clicked dice
            let pawnObjsArr = getPawnsObject(player)
            pawnObjsArr.forEach(pawnObj => {
                let pawn = pawnObj.element;
                if (canThePawnMove(pawnObj.distance, currentMove)) {
                    pawn.classList.add("active"); // indicate the movable or spawnable pawns
                }
            })
        } 
    }
}

function ROLL_DICE() {
    // return an array containing 2 random numbers
    const GET_DICES_NUMBERS = () => {
        let diceOneNum = Math.floor( Math.random() * 6 ) + 1
        let diceTwoNum = Math.floor( Math.random() * 6 ) + 1
        return [diceOneNum, diceTwoNum]
    }
    if (DICES_ROLLER.lastElementChild == DICE_ROLLER_INFO) {
        DICES_ROLLER.removeChild(DICE_ROLLER_INFO)
    }
    // DICE_ROLLER_INFO.style.transform = "scale(0)"

    const DISPLAY_DICES_NUMBERS = () => {
        // set the current player object to the 'player' variable
        let player = playerOneTurn ? PLAYER_ONE : PLAYER_TWO
        otherMove = null
        canRollDice = false // disallow player from rolling the dices cause they have started rolling
        diceIsRolling = true
        let rollingInterval = setInterval(() => {
            moves = GET_DICES_NUMBERS()   // set the diceNumbers(array) to the 'moves' variable
            tempMoves = [...moves]
            // display the diceNumbers in the dice dom elements
            dicesEls.forEach((diceEl, index) => {
                diceEl.innerText = moves[index]
            })
        }, 10);

        setTimeout(() => {
            // stop rolling the dice and give a precise value
            clearInterval(rollingInterval)
            // check if player got two sixes as his moves, if true set the variable 'doubleSix' to true
            if (moves.every(move => { return move === 6 })) {
                doubleSix = true
                dblSixPrivilege = 2
            }

            diceIsRolling = false

            // checking if player has met the condition for moving a pawn, if not swap turns
            if (!thoroughPawnsCheck(player)) {
                setTimeout(() => {
                    dicesEls.forEach((diceEl) => {
                        diceEl.innerText = ""
                    })
                    SWAP_TURN()
                }, 700);
            } 

        }, 2000);
    }
    
    if (canRollDice && !gameHasEnded) {
        // if player can roll dice and the game hasn't ended, roll the dice
        DISPLAY_DICES_NUMBERS()
    }
}

announceTurn()

// event Listeners
DICES_ROLLER.addEventListener("click", ROLL_DICE)

dicesEls.forEach(diceEl => {
    diceEl.addEventListener("click",() => {
        USE_DICE_NUMBERS(diceEl)
    })
})

PAWNS.forEach(pawnEl => {
    pawnEl.addEventListener("click", () => {
        let player = playerOneTurn ? PLAYER_ONE: PLAYER_TWO
        let pawnObjsArr = getPawnsObject(player)
        let overallDistance = GREEN_PAWNS_PATHS_INDICES.length

        function RESUME() {
            currentMove = null // reset the "currentMove" variable
            pawnObjsArr.forEach(pawn => pawn.element.classList.remove("active")) // remove the indication that some pawns are movable or spawnable
            if (player.safePawns.length === 8) {
                // if all of the current players' pawns have entered the safe house
                gameHasEnded = true
                canRollDice = false
                announceWin() // announce the winner
            }
            if (!moves[0]) {
                currentMove = null
                diceIsRolling = false
                // allow player to play again if he sends opponent pawn(s) home or attained the max amount of steps
                if (dblSixPrivilege > 0) {
                    dblSixPrivilege--
                    if (dblSixPrivilege === 1) {
                        canRollDice = true
                    }
                }
                doubleSix = dblSixPrivilege ? true : false

                // if player didn't send opponent pawn(s) home or attained the max amount of steps or has used his extra turn, swap turn
                if (!doubleSix) {
                    SWAP_TURN()
                    doubleSix = false
                }
            } else if (moves[0] && !isAnyPawnMovable(player, moves[0])) {
                dicesEls.forEach((diceEl) => {
                    diceEl.innerText = ""
                    SWAP_TURN()
                })
            }
        }

        pawnObjsArr.forEach(pawnObj => {
            let pawn = pawnObj.element;
            if (playerOneTurn === (pawn.classList.contains("green-pawn") || pawn.classList.contains("blue-pawn")) && !diceIsRolling && pawn=== pawnEl) {
                if (currentMove === 6 && pawnObj.distance === -1 && pawnObj.distance !== null) {
                    pawnObj.distance = 0; // if currentMove = 6 and the pawn is in its house on the board, set it on it first path
                    let currentPawnsObj = pawn.classList.contains("green-pawn") || pawn.classList.contains("red-pawn") ? "pawnOne" :"pawnTwo";
                    player.APPEND_PAWN(pawn, player.pathsIndices[currentPawnsObj], pawnObj.distance); // place pawn on destined path
                    INTRUDERS_ARE_PRESENT(pawn, player, otherMove) // check if player is on the same path with opponent pawn(s), if yes, send them home
                    RESUME();
                } else if (currentMove != null && pawnObj.distance >= 0 && pawnObj.distance !== null && canThePawnMove(pawnObj.distance,currentMove)) {
                    if (pawnObj.distance + currentMove === overallDistance) {
                        // if pawnEl has maxed the amount of steps, take him to safe house and give the current player an extra turn
                        player.safePawns.push(pawn)
                        SAFE_PAWNS_CONTAINER_EL.children[playerOneTurn ? 0 : 1].append(pawnObj.element)
                        pawnObj.distance = null
                    } else {
                        // if the pawnEl is still within the board, take him to destined path
                        pawnObj.distance += currentMove;
                        let currentPawnsObj = pawn.classList.contains("green-pawn") || pawn.classList.contains("red-pawn") ? "pawnOne" :"pawnTwo";
                        player.APPEND_PAWN(pawn, player.pathsIndices[currentPawnsObj], pawnObj.distance);
                        INTRUDERS_ARE_PRESENT(pawn, player, otherMove) // check if player is on the same path with opponent pawn(s), if yes, send them home
                    }
                    RESUME();
                }
            }
        });
    })
})