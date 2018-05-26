var Game = /** @class */ (function () {
    function Game() {
        this.boardState = new BoardState(this);
        this.playerState = new PlayerState(this);
        this.cellState = new CellState(this);
        this.setState(this.playerState);
    }
    Game.prototype.setState = function (state) {
        this.currentState = state;
    };
    Game.prototype.getCurrentState = function () {
        return this.currentState;
    };
    return Game;
}());
var BoardState = /** @class */ (function () {
    function BoardState(game) {
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.computerSymbol = -1;
        this.gameRunning = true;
        this.turn = true;
        this.game = game;
    }
    BoardState.prototype.setPlayersNames = function (player1, outputNames, playersBox, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.outputNames = outputNames;
        this.playersBox = playersBox;
    };
    BoardState.prototype.OutputPlayersNames = function () {
        var output = "player 1 name: " + this.player1 + ", player 2 name is: " + (this.player2 || '');
        this.outputNames.innerHTML = output;
        this.playersBox.style.display = "none";
    };
    BoardState.prototype.boardComputed = function (t, rst, mode, levelMode) {
        console.log(levelMode);
        this.mode = mode;
        this.table = t;
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.reset = rst;
        this.game.setState(this.game.cellState);
        this.levelMode = levelMode;
    };
    BoardState.prototype.Reset = function () {
        console.log('reset');
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.gameRunning = true;
        for (var i = 0; i < 9; i++) {
            this.table[i].style.color = "white";
            this.table[i].innerHTML = "&nbsp;";
        }
        this.game.setState(this.game.cellState);
    };
    BoardState.prototype.IsFull = function () {
        for (var i = 0; i < 9; i++) {
            if (this.board[i] == 0)
                return false;
        }
        return true;
    };
    BoardState.prototype.win = function (board) {
        var b = board[1];
        if (board[0] == b && b == board[2] && b != 0)
            return b;
        b = board[4];
        if (board[3] == b && b == board[5] && b != 0)
            return b;
        b = board[7];
        if (board[6] == b && b == board[8] && b != 0)
            return b;
        b = board[3];
        if (board[0] == b && b == board[6] && b != 0)
            return b;
        b = board[4];
        if (board[1] == b && b == board[7] && b != 0)
            return b;
        b = board[5];
        if (board[2] == b && b == board[8] && b != 0)
            return b;
        b = board[4];
        if (board[0] == b && b == board[8] && b != 0)
            return b;
        if (board[2] == b && b == board[6] && b != 0)
            return b;
        return 0;
    };
    return BoardState;
}());
var PlayerState = /** @class */ (function () {
    function PlayerState(game) {
        this.game = game;
    }
    PlayerState.prototype.GetValues = function (player1, outputNames, playersBox, mode, player2) {
        if (mode && mode === 1 && player1) {
            this.game.setState(this.game.boardState);
            this.game.getCurrentState().setPlayersNames(player1, outputNames, playersBox);
            this.game.getCurrentState().OutputPlayersNames();
            return true;
        }
        else if (player1 && player2) {
            this.game.setState(this.game.boardState);
            this.game.getCurrentState().setPlayersNames(player1, outputNames, playersBox, player2);
            this.game.getCurrentState().OutputPlayersNames();
            return true;
        }
        return false;
    };
    return PlayerState;
}());
var CellState = /** @class */ (function () {
    function CellState(game) {
        this.game = game;
    }
    CellState.prototype.ClickCell = function (x, y) {
        this.game.setState(this.game.boardState);
        var p = 3 * (x - 1) + (y - 1);
        if (this.game.getCurrentState().mode === 1) {
            //hard mode
            if (this.game.getCurrentState().levelMode === 'hard') {
                console.log('hard again');
                if (!this.game.getCurrentState().gameRunning) {
                    alert("Game over");
                }
                else {
                    if (this.game.getCurrentState().board[p] == this.game.getCurrentState().computerSymbol) {
                        alert("The computer protecting this box!");
                    }
                    else {
                        if (this.game.getCurrentState().board[p] == -this.game.getCurrentState().computerSymbol) {
                            alert("already played");
                        }
                        else {
                            this.game.getCurrentState().table[p].style.color = "#25bfc4";
                            this.game.getCurrentState().table[p].innerHTML = "X";
                            this.game.getCurrentState().board[p] = 1;
                            if (this.game.getCurrentState().win(this.game.getCurrentState().board) == 1) {
                                this.game.getCurrentState().gameRunning = false;
                                alert(this.game.getCurrentState().player1 + " have won!");
                            }
                            else {
                                if (this.game.getCurrentState().IsFull()) {
                                    this.game.getCurrentState().gameRunning = false;
                                    alert('Draw match');
                                }
                                else {
                                    var v = this.minmax(-1, true);
                                    this.game.getCurrentState().board[v] = -1;
                                    this.game.getCurrentState().table[v].style.color = "#fac95f";
                                    this.game.getCurrentState().table[v].innerHTML = "O";
                                    if (this.game.getCurrentState().win(this.game.getCurrentState().board) == -1) {
                                        this.game.getCurrentState().gameRunning = false;
                                        alert("You have lost!");
                                    }
                                    else {
                                        if (this.game.getCurrentState().IsFull()) {
                                            this.game.getCurrentState().gameRunning = false;
                                            alert("Draw match");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                this.game.setState(this.game.cellState);
            }
            else {
                // random mode
                if (!this.game.getCurrentState().gameRunning) {
                    alert("Game over");
                }
                else {
                    if (this.game.getCurrentState().board[p] == this.game.getCurrentState().computerSymbol) {
                        alert("The computer protecting this box!");
                    }
                    else {
                        if (this.game.getCurrentState().board[p] == -this.game.getCurrentState().computerSymbol) {
                            alert("already played");
                        }
                        else {
                            this.game.getCurrentState().table[p].style.color = "#25bfc4";
                            this.game.getCurrentState().table[p].innerHTML = "X";
                            this.game.getCurrentState().board[p] = 1;
                            if (this.game.getCurrentState().win(this.game.getCurrentState().board) == 1) {
                                this.game.getCurrentState().gameRunning = false;
                                alert(this.game.getCurrentState().player1 + " have won!");
                            }
                            else {
                                if (this.game.getCurrentState().IsFull()) {
                                    this.game.getCurrentState().gameRunning = false;
                                    alert('Draw match');
                                }
                                else {
                                    var v = this.random(this.game.getCurrentState().board, -1);
                                    this.game.getCurrentState().board[v] = -1;
                                    this.game.getCurrentState().table[v].style.color = "#fac95f";
                                    this.game.getCurrentState().table[v].innerHTML = "O";
                                    if (this.game.getCurrentState().win(this.game.getCurrentState().board) == -1) {
                                        this.game.getCurrentState().gameRunning = false;
                                        alert("You have lost!");
                                    }
                                    else {
                                        if (this.game.getCurrentState().IsFull()) {
                                            this.game.getCurrentState().gameRunning = false;
                                            alert("Draw match");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                this.game.setState(this.game.cellState);
            }
        }
        else {
            if (!this.game.getCurrentState().gameRunning) {
                alert("Game over");
            }
            else {
                if (this.game.getCurrentState().board[p] == this.game.getCurrentState().computerSymbol) {
                    alert("The computer protecting this box!");
                }
                else {
                    if (this.game.getCurrentState().board[p] == -this.game.getCurrentState().computerSymbol) {
                        alert("already played");
                    }
                    else if (this.game.getCurrentState().turn) {
                        this.game.getCurrentState().table[p].style.color = "#25bfc4";
                        this.game.getCurrentState().table[p].innerHTML = "X";
                        this.game.getCurrentState().turn = false;
                        this.game.getCurrentState().board[p] = 1;
                        if (this.game.getCurrentState().win(this.game.getCurrentState().board) == 1) {
                            this.game.getCurrentState().gameRunning = false;
                            alert(this.game.getCurrentState().player1 + " have won!");
                        }
                        this.game.setState(this.game.cellState);
                    }
                    else if (this.game.getCurrentState().turn === false) {
                        this.game.getCurrentState().table[p].style.color = "#fac95f";
                        this.game.getCurrentState().table[p].innerHTML = "O";
                        this.game.getCurrentState().turn = true;
                        this.game.getCurrentState().board[p] = -1;
                        if (this.game.getCurrentState().win(this.game.getCurrentState().board) == -1) {
                            this.game.getCurrentState().gameRunning = false;
                            alert(this.game.getCurrentState().player2 + " have won!");
                        }
                        else {
                            if (this.game.getCurrentState().IsFull()) {
                                this.game.getCurrentState().gameRunning = false;
                                alert("Draw match");
                            }
                        }
                    }
                }
            }
        }
        this.game.setState(this.game.cellState);
    };
    CellState.prototype.minmax = function (currentPlayer, root) {
        var winner = this.game.getCurrentState().win(this.game.getCurrentState().board);
        if (winner != 0)
            if (currentPlayer == -1)
                return winner;
            else
                return -winner;
        //possible moves
        var possibleMoves = [];
        for (var i = 0; i < 9; i++) {
            if (this.game.getCurrentState().board[i] == 0)
                possibleMoves.push(i);
        }
        var n = possibleMoves.length; //length of possible moves array
        if (n == 0)
            return 0; //board full
        var which = -1;
        var v = 100;
        for (var j = 0; j < n; j++) {
            var move = possibleMoves[j];
            //play
            this.game.getCurrentState().board[move] = currentPlayer;
            var m = -this.minmax(-currentPlayer, false); // 1 false
            this.game.getCurrentState().board[move] = 0;
            if (m < v) {
                v = m;
                which = move;
            }
        }
        if (root) {
            return (which);
        }
        else
            return (v);
    };
    CellState.prototype.random = function (board, currentPlayer) {
        var winner = this.game.getCurrentState().win(this.game.getCurrentState().board);
        if (winner != 0)
            if (currentPlayer == -1)
                return winner;
            else
                return -winner;
        for (var i = 0; i < board.length; i++) {
            if (board[i] === 0)
                return i;
        }
    };
    return CellState;
}());
window.onload = function () {
    // check return type from dom if el instenceof HTMLElement;
    var start = document.querySelector('#start');
    var reset = document.querySelector("#restart");
    var reload = document.querySelector('#reload');
    //output users name
    var outputNames = document.querySelector('.names');
    //player 1 input
    var playerOneInput = document.querySelector('#playerOneInput');
    //mode game
    var randomMode = document.querySelector('#randomMode');
    var hardMode = document.querySelector('#hardMode');
    var playersBox = document.querySelector('.playersBox');
    var playerTwoDiv = document.querySelector('.player2Box');
    var modes = document.querySelector('.modeBox');
    var statusMode = document.querySelector('.status-mode');
    var onePlayerMode = document.querySelector('#onePlayerMode');
    var twoPlayersMode = document.querySelector('#twoPlayersMode');
    //cell boxes
    var box11 = document.querySelector('#box11');
    var box12 = document.querySelector('#box12');
    var box13 = document.querySelector('#box13');
    var box21 = document.querySelector('#box21');
    var box22 = document.querySelector('#box22');
    var box23 = document.querySelector('#box23');
    var box31 = document.querySelector('#box31');
    var box32 = document.querySelector('#box32');
    var box33 = document.querySelector('#box33');
    twoPlayersMode.addEventListener('click', function () {
        playerTwoDiv.className = "input block";
        statusMode.className = "status-mode none";
    });
    onePlayerMode.addEventListener('click', function () {
        playerTwoDiv.className = "input none";
        statusMode.className += "status-mode block";
    });
    start.onclick = function (e) {
        var mode = 0;
        var levelMode;
        if (onePlayerMode.checked) {
            mode = 1;
            modes.style.display = "none";
            if (randomMode.checked) {
                levelMode = 'random';
            }
            else {
                levelMode = 'hard';
            }
        }
        else {
            mode = 2;
            modes.style.display = "none";
        }
        var input1 = document.querySelector('#playerOneInput').value;
        var input2 = document.querySelector('#playerTwoInput').value;
        var game = new Game();
        if (game.getCurrentState().GetValues(input1, outputNames, playersBox, mode, input2)) {
            game.getCurrentState().boardComputed([box11, box12, box13, box21, box22, box23, box31, box32, box33], reset, mode, levelMode);
            box11.onclick = function () { game.getCurrentState().ClickCell(1, 1); };
            box12.onclick = function () { game.getCurrentState().ClickCell(1, 2); };
            box13.onclick = function () { game.getCurrentState().ClickCell(1, 3); };
            box21.onclick = function () { game.getCurrentState().ClickCell(2, 1); };
            box22.onclick = function () { game.getCurrentState().ClickCell(2, 2); };
            box23.onclick = function () { game.getCurrentState().ClickCell(2, 3); };
            box31.onclick = function () { game.getCurrentState().ClickCell(3, 1); };
            box32.onclick = function () { game.getCurrentState().ClickCell(3, 2); };
            box33.onclick = function () { game.getCurrentState().ClickCell(3, 3); };
            reset.onclick = function () { game.setState(game.boardState); game.getCurrentState().Reset(); };
            reload.onclick = function () { location.reload(); };
        }
    };
};
