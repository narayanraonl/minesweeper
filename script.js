import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose,
  } from "./minesweeper.js"
  
    const difficulty = document.querySelectorAll(".dropdown-item");
    //const boardDisplay = document.querySelectorAll(".clear-board");
    //const dropDownDisplay = document.getElementById("default-text");  
    const boardDisplay = document.querySelector(".board");
    
    let BOARD_SIZE = 6
    let NUMBER_OF_MINES = 5

    difficulty.forEach(d =>{
        d.addEventListener("click", function() {
            const level = d.getAttribute("data-value");
            //boardDisplay.replaceChildren();
            if(level==="1"){
                BOARD_SIZE=6
                NUMBER_OF_MINES=5
                //dropDownDisplay.textContent("Easy")
            }
            else if(level==="2"){
                BOARD_SIZE=10
                NUMBER_OF_MINES=10
            }
            else{
                BOARD_SIZE=10
                NUMBER_OF_MINES=15
            }
            main(BOARD_SIZE,NUMBER_OF_MINES)
            document.getElementById("default-text").textContent = d.textContent;
        })
    });

    const reloadButton = document.getElementById("reloadButton");
    reloadButton.addEventListener("click", function () {
         location.reload(); // Reload the page
    });

function main(BOARD_SIZE,NUMBER_OF_MINES){
    
    boardDisplay.innerHTML = "";
    
    const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
    const boardElement = document.querySelector(".board")
    const minesLeftText = document.querySelector("[data-mine-count]")
    const messageText = document.querySelector(".subtext")

    board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener("click", () => {
        revealTile(board, tile)
        checkGameEnd()
        })
        tile.element.addEventListener("contextmenu", e => {
        e.preventDefault()
        markTile(tile)
        listMinesLeft()
        })
    })
    })
    boardElement.style.setProperty("--size", BOARD_SIZE)
    minesLeftText.textContent = NUMBER_OF_MINES

    function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return (
        count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
        )
    }, 0)

    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
    }

    function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture: true })
        boardElement.addEventListener("contextmenu", stopProp, { capture: true })
    }

    if (win) {
        messageText.textContent = "You Win"
        document.body.classList.add("win");
        board.forEach(row => { 
        row.forEach(tile => {
            if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
            if (tile.mine) markTile(tile)
        })
        })
    }
    if (lose) {
        messageText.textContent = "You Lose"
        //document.body.classList.add("lose"); 
        board.forEach(row => {
        row.forEach(tile => {
            if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
            if (tile.mine) revealTile(board, tile)
        })
        })
    }
    }

    function stopProp(e) {
    e.stopImmediatePropagation()
    }
}

main(BOARD_SIZE, NUMBER_OF_MINES);