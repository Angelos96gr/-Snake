const snake = document.querySelector("#snake")
const snakeHead = document.querySelector("#snake_head")
const audio_apple_eaten = document.querySelector("#apple_eaten")
const audio_bomb_fired = document.querySelector("#bomb_fired")
const audio_game_lost = document.querySelector("#game_lost")
const score = document.querySelector("#score")
const timerSecs = document.querySelector("#secs")
const timerMins = document.querySelector("#mins")
const speedUp = document.querySelector("#speed_up")
let REFRESH_RATE = 100

let ongoinSecs = 0
let ongoinMins = 0

const SCREEN_HEIGHT = 600//window.screen.availHeight
const SCREEN_WIDTH = 1000//window.screen.availWidth

game_frame = document.querySelector("#play_area")
game_frame.style.width = SCREEN_WIDTH + "px"
game_frame.style.height = SCREEN_HEIGHT + "px"


const MOVE_STEP = 20 // if not the same as the snake body dimension, the body parts can overlap
const SNAKE_BODY_PART_DIMENSION = 20
const MIN_X = getDiscretePoints(game_frame.getBoundingClientRect().x)
const MAX_X = MIN_X + SCREEN_WIDTH -SNAKE_BODY_PART_DIMENSION;
const MIN_Y = getDiscretePoints(game_frame.getBoundingClientRect().y)
const MAX_Y = MIN_Y + SCREEN_HEIGHT-SNAKE_BODY_PART_DIMENSION;
let direction = ["ArrowRight"]
let game_points = 0;








class Snake {


    constructor() {

        const [x, y] = generateItemCoordinates();
        snakeHead.style.left = x + "px"
        snakeHead.style.top = y + "px"
        this.bodyParts = [{ "x": x, "y": y }]//initialise with head coordinates

    }


    addBodyPart() { // decouple between object operation and visualization in function outside class scope - DOESNT WORK FOR THE FIRST TWO MOVES because heres no second point to get direction

        const bodyPart = document.createElement("div")
        bodyPart.className = "snake_body_parts"
        /* Used to add a body part in continuoation of the last body part - obsolete since the new body part is now added at the position of the apple
        if (this._movesHorizontal()) {
            if (this._movesRight()) { this.bodyParts.push({ "x": this.bodyParts[this._getSnakeLength()].x - SNAKE_BODY_PART_DIMENSION, "y": this.bodyParts[this._getSnakeLength()].y }) }
            else { this.bodyParts.push({ "x": this.bodyParts[this._getSnakeLength()].x + SNAKE_BODY_PART_DIMENSION, "y": this.bodyParts[this._getSnakeLength()].y }) }
        }
        else {
            if (this._movesUp()) { this.bodyParts.push({ "x": this.bodyParts[this._getSnakeLength()].x, "y": this.bodyParts[this._getSnakeLength()].y + SNAKE_BODY_PART_DIMENSION }) }
            else { this.bodyParts.push({ "x": this.bodyParts[this._getSnakeLength()].x, "y": this.bodyParts[this._getSnakeLength()].y - SNAKE_BODY_PART_DIMENSION }) }

        }

        */
        this.bodyParts.push({ "x": GameObj.AppleArray[0].x, "y": GameObj.AppleArray[0].y })
        bodyPart.style.left = this.bodyParts[this._getSnakeLength()].x + "px";
        bodyPart.style.top = this.bodyParts[this._getSnakeLength()].y + "px";
        document.querySelector("#snake").appendChild(bodyPart)

    }

    _getSnakeLength() {
        return this.bodyParts.length - 1
    }
    _movesHorizontal() {
        if (this._getSnakeLength() == 0) {
            return (["", "ArrowLeft", "ArrowRight"].includes(direction))
        }
        return (this.bodyParts[this._getSnakeLength()].y == this.bodyParts[this._getSnakeLength() - 1].y)
    }

    _movesUp() {
        if (this._getSnakeLength() == 0) {
            return (["", "ArrowUp"].includes(direction))
        }

        return (this.bodyParts[this._getSnakeLength()].y > this.bodyParts[this._getSnakeLength() - 1].y)
    }

    _movesRight() {
        if (this._getSnakeLength() == 0) {
            return (["", "ArrowRight"].includes(direction))
        }

        return (this.bodyParts[this._getSnakeLength()].x < this.bodyParts[this._getSnakeLength() - 1].x)
    }

    deleteBodyPart() {

        const snakePartsHTML = document.querySelectorAll(".snake_body_parts")
        if (snakePartsHTML.length == 1) { return GameObj.restart() }
        this.bodyParts.pop()
        return snakePartsHTML[this._getSnakeLength() + 1].remove()


    }





    detectCollission() {

        return (this.bodyParts.map((bodyPart) => ((bodyPart.y == this.bodyParts[0].y) && (bodyPart.x == this.bodyParts[0].x))).reduce((acc, cur) => acc + cur) > 1)
    }

}


class Game {


    constructor() {
        this.result = "ongoing"
        this.AppleArray = [{ "x": generateItemCoordinates()[0], "y": generateItemCoordinates()[1] }]
        this.BombArray = [{ "x": generateItemCoordinates()[0], "y": generateItemCoordinates()[1] }]
    }

    restart() {
        console.log("You lost the game")
        audio_game_lost.play()
        setTimeout(() => location.reload(), 2000)

    }

}


function updateSnakePosition() {
    const snakePartsHTML = document.querySelectorAll(".snake_body_parts")

    for (let [index, element] of Object.entries(snakePartsHTML)) {

        element.style.left = SnakeObj.bodyParts[index].x + "px";
        element.style.top = SnakeObj.bodyParts[index].y + "px";

    }

}



function continuousPostionUpdate() {
    const x = SnakeObj.bodyParts[0].x
    const y = SnakeObj.bodyParts[0].y


    switch (direction[direction.length - 1]) {
        case "ArrowUp":
            newY = ((y-MOVE_STEP) < MIN_Y) ? (MAX_Y -SNAKE_BODY_PART_DIMENSION) : (y - MOVE_STEP)
            SnakeObj.bodyParts.unshift({ "x": x, "y": newY })
            break;
        case "ArrowDown":
            newY = (y >= (MAX_Y - MOVE_STEP)) ? (MIN_Y) : (y + MOVE_STEP)
            SnakeObj.bodyParts.unshift({ "x": x, "y": newY })
            break;
        case "ArrowLeft":
            newX = ((x-MOVE_STEP) < MIN_X) ? (MAX_X - SNAKE_BODY_PART_DIMENSION) : (x - MOVE_STEP)
            SnakeObj.bodyParts.unshift({ "x": newX, "y": y })
            break;
        case "ArrowRight":
            newX = (x >= (MAX_X - MOVE_STEP)) ? (MIN_X) : (x + MOVE_STEP)
            SnakeObj.bodyParts.unshift({ "x": newX, "y": y })
            break;

    }

    if (SnakeObj.detectCollission()) {

        GameObj.restart()
    }
    else {
        updateSnakePosition()
        return SnakeObj.bodyParts.pop()
    }
}

function getRandomInt(min = 0, max) {
    return Math.floor(Math.random() * (max-min)) + min
}



function getDiscretePoints(num) {
    num = Math.floor(num)
    do {
        num++

    } while (num % MOVE_STEP != 0 && num>0)

    return num

}


function Timer() {


    timerSecs.innerText = formatTime(ongoinSecs)
    timerMins.innerText = formatTime(ongoinMins)

    ongoinSecs++

    if (ongoinSecs == 60) {
        ongoinSecs = 0
        ongoinMins++
    }
}

function formatTime(time) {

    return (String(time).length < 2) ? "0" + String(time) : String(time)
}





function generateItemCoordinates() {

    let x, y;
    do {
        x = getRandomInt(MIN_X, MAX_X)

    } while (x % 20 != 0)
    do {
        y = getRandomInt(MIN_Y, MAX_Y)

    } while (y % 20 != 0)

    return [x, y]
}

function addApple() {

    // removing first the rotten apple
    GameObj.AppleArray.pop()
    const applesHTML = document.querySelectorAll(".apples")
    applesHTML[GameObj.AppleArray.length].remove()
    GameObj.AppleArray.push({ "x": generateItemCoordinates()[0], "y": generateItemCoordinates()[1] })
    updateApplePosition()
}



function addBomb() {

    // removing first the rotten apple
    GameObj.BombArray.pop()
    const bombsHTML = document.querySelectorAll(".bombs")
    bombsHTML[GameObj.BombArray.length].remove()
    GameObj.BombArray.push({ "x": generateItemCoordinates()[0], "y": generateItemCoordinates()[1] })
    updateBombPosition()
}

function updateBombPosition() {
    const bomb = document.createElement("div")
    bomb.className = "bombs"
    bomb.innerText = "💣";
    bomb.style.left = GameObj.BombArray[GameObj.BombArray.length - 1].x + "px"
    bomb.style.top = GameObj.BombArray[GameObj.BombArray.length - 1].y + "px"
    document.querySelector("#play_area").appendChild(bomb)
}

function updateApplePosition() {
    const apple = document.createElement("div")
    apple.className = "apples"
    apple.innerText = "🍎";
    apple.style.left = GameObj.AppleArray[GameObj.AppleArray.length - 1].x + "px"
    apple.style.top = GameObj.AppleArray[GameObj.AppleArray.length - 1].y + "px"
    document.querySelector("#play_area").appendChild(apple)
}


function appleEaten() {

    const IsEaten = ((SnakeObj.bodyParts[0].x == GameObj.AppleArray[GameObj.AppleArray.length - 1].x) && (SnakeObj.bodyParts[0].y == GameObj.AppleArray[GameObj.AppleArray.length - 1].y))
    if (IsEaten) {
        audio_apple_eaten.play()
        game_points++
        score.innerText = game_points
        console.log(game_points)
        SnakeObj.addBodyPart()
        addApple()
    }

}

function bombFired() {
    const IsFired = ((SnakeObj.bodyParts[0].x == GameObj.BombArray[GameObj.BombArray.length - 1].x) && (SnakeObj.bodyParts[0].y == GameObj.BombArray[GameObj.BombArray.length - 1].y))
    if (IsFired) {
        audio_bomb_fired.play()
        game_points--
        score.innerText = game_points

        console.log(game_points)
        SnakeObj.deleteBodyPart()
        addBomb()
    }
}


SnakeObj = new Snake()
GameObj = new Game()

//Intialize play area with apples and bombs
updateApplePosition()
updateBombPosition()


// Setup intervals
setInterval(Timer,1000)
setInterval(addBomb, 2000)
let updateInterval = setInterval(continuousPostionUpdate, REFRESH_RATE)
let appleInterval = setInterval(appleEaten, REFRESH_RATE)
let bombInterval = setInterval(bombFired, REFRESH_RATE)




speedUp.addEventListener("click", ()=>{
    
    if (REFRESH_RATE>50){
        clearInterval(updateInterval)
        clearInterval(appleInterval)
        clearInterval(bombInterval)
        REFRESH_RATE = REFRESH_RATE*0.8
        updateInterval = setInterval(continuousPostionUpdate, REFRESH_RATE)
        appleInterval = setInterval(appleEaten, REFRESH_RATE)
        bombInterval = setInterval(bombFired, REFRESH_RATE)
    }


})



window.addEventListener("keydown", (e) => {


    console.log(e.key)

    if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) { direction.push(e.key) }



    if (e.key == "n") { SnakeObj.addBodyPart() }


})



