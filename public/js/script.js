import Grid from "./Grid.js"
import Tile from "./Tile.js"

const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard)
grid.randomEmptysquare().tile = new Tile(gameBoard)
grid.randomEmptysquare().tile = new Tile(gameBoard)
setupInput()

function setupInput() {
    window.addEventListener("keydown", handleInput, { once : true })
}

async function handleInput(e) {
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInput()
                return
            }
            await moveUp()
            break;
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput()
                return
            }
            await moveDown()
            break;
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput()
                return
            }
            await moveLeft()
            break;
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput()
                return
            }
            await moveRight()
            break;
        default:
            setupInput()
            return
    }

    grid.squares.forEach(square => square.mergeTiles())

    const newTile = new Tile(gameBoard)
    grid.randomEmptysquare().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            alert("You lose")
        })
        return
    }
    setupInput()
}

function moveUp() {
    slideTiles(grid.squaresByColumn)
}

function moveDown() {
    slideTiles(grid.squaresByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    slideTiles(grid.squaresByRow)
}

function moveRight() {
    slideTiles(grid.squaresByRow.map(row => [...row].reverse()))
}

function slideTiles(squares) {
    return Promise.all(
    squares.flatMap(group => {
    const promises = []
    for (let i = 1; i < group.length; i++) {
        const square = group[i]
        if (square.tile == null) continue
        let lastValidsquare
        for (let j = i - 1; j >= 0; j--) {
            const moveTosquare = group[j]
            if (!moveTosquare.canAccept(square.tile)) break
            lastValidsquare = moveTosquare
        }

        if (lastValidsquare != null) {
            promises.push(square.tile.waitForTransition())
            if (lastValidsquare.tile != null) {
                lastValidsquare.mergeTile = square.tile
            } else {
                lastValidsquare.tile = square.tile
            }
            square.tile = null
        }
    }
        return promises
    })
    )
}

function canMoveUp() {
    return canMove(grid.squaresByColumn)
}

function canMoveDown() {
    return canMove(grid.squaresByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
    return canMove(grid.squaresByRow)
}

function canMoveRight() {
    return canMove(grid.squaresByRow.map(row => [...row].reverse()))
}

function canMove(squares) {
    return squares.some(group => {
        return group.some((square, index) => {
            if (index === 0) return false
            if (square.tile == null) return false
            const moveTosquare = group[index - 1]
            return moveTosquare.canAccept(square.tile)
        })
    })
}