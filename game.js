let cells = document.querySelectorAll("li")
let move = document.querySelector(".clicks")
let incorrect = document.querySelector(".incorrect")
let min = document.querySelector(".min")
let sec = document.querySelector(".sec")
let winnerBox = document.querySelector(".winner-container")
let helpBtn = document.querySelector('.help')
let effort = document.querySelector('.effort')
let time = document.getElementById('time')
let clickEnd = document.getElementById('click-end')
let minCount = 0
let secCount = 0
let moveCount = 0;
let incorrectCount = 0;
let doubleClick = []
let winner = []
let shows = 0
let effortCount = 3
let start = false

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", game)
}


showElements()
//Main function

function game() {
    this.classList.add("show")
    this.removeEventListener("click", game)
    doubleClick.push(this)
    if (start == false) {
        let timer = setInterval(function () {
            secCount++
            sec.textContent = secCount
            if (secCount == 10) {
                minCount++;
                secCount = 0
                min.textContent = minCount
            }
            if (start == false) {
                clearInterval(timer)
            }
        }, 1000)
        helpBtn.addEventListener('click', showElements)
        start = true
    }
    if (doubleClick.length == 2) {
        calMove()
        if (doubleClick[0].innerHTML == doubleClick[1].innerHTML) {
            success()
        }
        else {
            failed()
        }

    }
}


//Move Function
function calMove() {
    moveCount++
    move.textContent = moveCount
}

//Success Function
function success() {
    doubleClick[0].classList.add("match")
    doubleClick[1].classList.add("match")
    winner.push(doubleClick[0], doubleClick[1])
    if (winner.length == 16) {
        showWinner()
    }
    doubleClick = []
}

//Failed Function
function failed() {
    incorrectCount ++
    incorrect.textContent = incorrectCount

    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", game)
    }
    doubleClick[0].classList.add("unmatch")
    doubleClick[1].classList.add("unmatch")
    setTimeout(function () {
        doubleClick[0].classList.remove("show", "unmatch")
        doubleClick[1].classList.remove("show", "unmatch")
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener("click", game)
        }
        doubleClick = []
    }, 1000)
}

// Winner Function
function showWinner() {
    winnerBox.classList.add("win")
    time.textContent = `${minCount} : ${secCount}`
    clickEnd.textContent = moveCount
    start = false
}

// showing elements for a time
function showElements() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.add('preview')
        cells[i].removeEventListener("click", game)
    }
    helpBtn.removeEventListener('click', showElements)
    let showsTimer = setInterval(function() {
        shows++
        if (shows == 3) {
            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.remove('preview')
                cells[i].addEventListener("click", game)
            }
            shows = 0
            if (effortCount > 0) {
                helpBtn.addEventListener('click', showElements)
            }
            clearInterval(showsTimer)
        }
    }, 1000)

    if (start == true && effortCount > 0) {
        effortCount--
        effort.textContent = effortCount
        if (effortCount == 0) {
            helpBtn.removeEventListener('click', showElements)
            helpBtn.style.backgroundColor = 'darkred'
        }
    }
}