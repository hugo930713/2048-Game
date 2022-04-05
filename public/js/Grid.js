const GRID_SIZE = 4
const Square_SIZE = 20
const Square_GAP = 2

export default class Grid {
  #squares

  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE)
    gridElement.style.setProperty("--square-size", `${Square_SIZE}vmin`)
    gridElement.style.setProperty("--square-gap", `${Square_GAP}vmin`)
    this.#squares = createsquareElements(gridElement).map((squareElement, index) => {
      return new square(
        squareElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      )
    })
  }

  get squares() {
    return this.#squares
  }

  get squaresByRow() {
    return this.#squares.reduce((squareGrid, square) => {
      squareGrid[square.y] = squareGrid[square.y] || []
      squareGrid[square.y][square.x] = square
      return squareGrid
    }, [])
  }

  get squaresByColumn() {
    return this.#squares.reduce((squareGrid, square) => {
      squareGrid[square.x] = squareGrid[square.x] || []
      squareGrid[square.x][square.y] = square
      return squareGrid
    }, [])
  }

  get #emptysquares() {
    return this.#squares.filter(square => square.tile == null)
  }

  randomEmptysquare() {
    const randomIndex = Math.floor(Math.random() * this.#emptysquares.length)
    return this.#emptysquares[randomIndex]
  }
}

class square {
  #squareElement
  #x
  #y
  #tile
  #mergeTile

  constructor(squareElement, x, y) {
    this.#squareElement = squareElement
    this.#x = x
    this.#y = y
  }

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  get tile() {
    return this.#tile
  }

  set tile(value) {
    this.#tile = value
    if (value == null) return
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }

  get mergeTile() {
    return this.#mergeTile
  }

  set mergeTile(value) {
    this.#mergeTile = value
    if (value == null) return
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    )
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return
    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null
  }
}

function createsquareElements(gridElement) {
  const squares = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const square = document.createElement("div")
    square.classList.add("square")
    squares.push(square)
    gridElement.append(square)
  }
  return squares
}