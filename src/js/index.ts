class Game{
    public boardState: BoardState;
    public playerState: PlayerState;
    public cellState: CellState;

    public currentState;

    constructor() {
        this.boardState = new BoardState(this);
        this.playerState = new PlayerState(this);
        this.cellState = new CellState(this);

        this.setState(this.playerState);
    }

    public setState(state) {
        this.currentState = state;
    }

    public getCurrentState(){
        return this.currentState;
    }


}


class BoardState  {
   game:Game;
   board: number[] = [0, 0, 0,0, 0, 0,0, 0, 0];
   table: HTMLElement[];
   reset: HTMLButtonElement;
   computerSymbol: number = -1;
   gameRunning: boolean = true;
   player1:string;
   player2:string;
   outputNames:Element;
   playersBox:HTMLElement;
   mode:number;
   turn:boolean = true; 
   levelMode:string;   

    constructor(game:Game){   
    this.game = game;
    }

    public setPlayersNames(player1:string, outputNames:Element, playersBox:HTMLElement, player2?:string){
        this.player1 = player1;
        this.player2 = player2;
        this.outputNames = outputNames; 
        this.playersBox = playersBox;
    }

    public OutputPlayersNames(){
        let output = `player 1 name: ${this.player1}, player 2 name is: ${this.player2 || ''}`;
        this.outputNames.innerHTML = output;
        this.playersBox.style.display = "none";
    }

    public boardComputed(t: HTMLElement[], rst: HTMLButtonElement, mode:number, levelMode:string){
        console.log(levelMode);
        this.mode = mode;
        this.table = t;
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.reset = rst;
        this.game.setState(this.game.cellState);
        this.levelMode = levelMode;
    }

    public Reset(): void {
        console.log('reset');
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.gameRunning = true;
        for (let i = 0; i < 9; i++) {
            this.table[i].style.color = "white";
            this.table[i].innerHTML = "&nbsp;";
            
        }
        this.game.setState(this.game.cellState);
    }
    public IsFull(): boolean {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] == 0)
                return false;
        }
        return true;
    }
    
    public win(board: number[]): number {
        let b = board[1];
        if (board[0] == b && b == board[2] && b != 0) return b;
        b = board[4];
        if (board[3] == b && b == board[5] && b != 0) return b;
        b = board[7];
        if (board[6] == b && b == board[8] && b != 0) return b;
        b = board[3];
        if (board[0] == b && b == board[6] && b != 0) return b;
        b = board[4];
        if (board[1] == b && b == board[7] && b != 0) return b;
        b = board[5];
        if (board[2] == b && b == board[8] && b != 0) return b;
        b = board[4];
        if (board[0] == b && b == board[8] && b != 0) return b;
        if (board[2] == b && b == board[6] && b != 0) return b;
        return 0;
    }    
}



class PlayerState {
    game:Game;
    playerName1:string;
    playerName2:string;
    

    constructor(game:Game){
    this.game = game;
    }

    GetValues(player1:string, outputNames:Element, playersBox:HTMLElement, mode, player2?:string){
        if(mode && mode===1 && player1){
            this.game.setState(this.game.boardState);
            this.game.getCurrentState().setPlayersNames(player1, outputNames, playersBox);
            this.game.getCurrentState().OutputPlayersNames();
            return true;
        }else if(player1 && player2){
            this.game.setState(this.game.boardState);
            this.game.getCurrentState().setPlayersNames(player1, outputNames, playersBox, player2);
            this.game.getCurrentState().OutputPlayersNames();
            return true;
        }
            return false;  
    }
}

class CellState {
    game:Game;
    mode:number;
    
   
    constructor(game:Game){
    this.game = game;
    }
    
    public ClickCell(x: number, y: number) {
        
        this.game.setState(this.game.boardState);
        let p: number = 3 * (x - 1) + (y - 1);
        
        
        if(this.game.getCurrentState().mode === 1){
            //hard mode
            if(this.game.getCurrentState().levelMode ==='hard'){
                console.log('hard again');
                if (!this.game.getCurrentState().gameRunning) { //if gameRunning return false its the end
                    alert("Game over");
                } else {
                    if (this.game.getCurrentState().board[p] == this.game.getCurrentState().computerSymbol) { //protected by click again on O
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
                                alert(`${this.game.getCurrentState().player1} have won!`);
                            } else {
                                if (this.game.getCurrentState().IsFull()) {
                                    this.game.getCurrentState().gameRunning = false;
                                    alert('Draw match');
                                } else {
                                    let v = this.minmax(-1, true);
                                    this.game.getCurrentState().board[v] = -1;
                                    this.game.getCurrentState().table[v].style.color = "#fac95f";
                                    this.game.getCurrentState().table[v].innerHTML = "O";
                                    if (this.game.getCurrentState().win(this.game.getCurrentState().board) == -1) {
                                        this.game.getCurrentState().gameRunning = false;
                                        alert(`You have lost!`);
                                    } else {
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
            }else{
                // random mode
                if (!this.game.getCurrentState().gameRunning) { //if gameRunning return false its the end
                    alert("Game over");
                } else {
                    if (this.game.getCurrentState().board[p] == this.game.getCurrentState().computerSymbol) { //protected by click again on O
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
                                alert(`${this.game.getCurrentState().player1} have won!`);
                            } else {
                                if (this.game.getCurrentState().IsFull()) {
                                    this.game.getCurrentState().gameRunning = false;
                                    alert('Draw match');
                                } else {
                                    let v = this.random(this.game.getCurrentState().board, -1);
                                    this.game.getCurrentState().board[v] = -1;
                                    this.game.getCurrentState().table[v].style.color = "#fac95f";
                                    this.game.getCurrentState().table[v].innerHTML = "O";
                                    if (this.game.getCurrentState().win(this.game.getCurrentState().board) == -1) {
                                        this.game.getCurrentState().gameRunning = false;
                                        alert(`You have lost!`);
                                    } else {
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
        }else{
            if (!this.game.getCurrentState().gameRunning) { //if gameRunning return false its the end
                alert("Game over");
            } else {
                if (this.game.getCurrentState().board[p] == this.game.getCurrentState().computerSymbol) { //protected by click again on O
                    alert("The computer protecting this box!");
                }
                else {
                    if (this.game.getCurrentState().board[p] == -this.game.getCurrentState().computerSymbol) {
                        alert("already played");
                    }
                    else if(this.game.getCurrentState().turn){
                        this.game.getCurrentState().table[p].style.color = "#25bfc4";
                        this.game.getCurrentState().table[p].innerHTML = "X";
                        this.game.getCurrentState().turn = false;
                        this.game.getCurrentState().board[p] = 1;
                        if (this.game.getCurrentState().win(this.game.getCurrentState().board) == 1) {
                            this.game.getCurrentState().gameRunning = false;
                            alert(`${this.game.getCurrentState().player1} have won!`);
                        } 
                        this.game.setState(this.game.cellState);
                    }else if( this.game.getCurrentState().turn === false){
                        this.game.getCurrentState().table[p].style.color = "#fac95f";
                        this.game.getCurrentState().table[p].innerHTML = "O";
                        this.game.getCurrentState().turn = true;
                        this.game.getCurrentState().board[p] = -1;
                        if (this.game.getCurrentState().win(this.game.getCurrentState().board) == -1) {
                            this.game.getCurrentState().gameRunning = false;
                            alert(`${this.game.getCurrentState().player2} have won!`);
                        } else {
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
           }


    public minmax(currentPlayer: number, root: boolean): number {
        let winner = this.game.getCurrentState().win(this.game.getCurrentState().board);
        if (winner != 0)
            if (currentPlayer == -1)
                return winner;
            else
                return -winner;
        //possible moves
        let possibleMoves = [];
        for (let i = 0; i < 9; i++) {
            if (this.game.getCurrentState().board[i] == 0)
                possibleMoves.push(i);
        }
        let n: number = possibleMoves.length;//length of possible moves array
        if (n == 0)
            return 0;//board full
        let which: number = -1;
        let v: number = 100;
        for (let j = 0; j < n; j++) {
            let move = possibleMoves[j];
            //play
            this.game.getCurrentState().board[move] = currentPlayer;
            let m = -this.minmax(-currentPlayer, false);// 1 false
            this.game.getCurrentState().board[move] = 0;
            if (m < v) {
                v = m;
                which = move;
            }
        }
        if (root) {
            return (which)
        }
        else
            return (v)
    } 

    public random(board:number[], currentPlayer){
        let winner = this.game.getCurrentState().win(this.game.getCurrentState().board);
        if (winner != 0)
            if (currentPlayer == -1)
                return winner;
            else
                return -winner;

            for(let i =0; i<board.length; i++){
                if(board[i] === 0) return i;
            }
    }
}


window.onload = () => {
// check return type from dom if el instenceof HTMLElement;
let start:  HTMLButtonElement = <HTMLButtonElement>document.querySelector('#start');
let reset:  HTMLButtonElement = <HTMLButtonElement>document.querySelector("#restart");
let reload:HTMLElement = <HTMLElement>document.querySelector('#reload');
//output users name
let outputNames:  HTMLElement = <HTMLElement>document.querySelector('.names');
//player 1 input
let playerOneInput:HTMLElement = (<HTMLInputElement>document.querySelector('#playerOneInput'));
//mode game
let randomMode:HTMLInputElement = <HTMLInputElement>document.querySelector('#randomMode');
let hardMode:HTMLInputElement = <HTMLInputElement>document.querySelector('#hardMode');
let playersBox: HTMLElement = (<HTMLElement>document.querySelector('.playersBox'));
let playerTwoDiv:HTMLElement = (<HTMLInputElement>document.querySelector('.player2Box'));
let modes:HTMLElement = <HTMLElement>document.querySelector('.modeBox');
let statusMode:HTMLElement = <HTMLElement>document.querySelector('.status-mode');
let onePlayerMode :HTMLInputElement = <HTMLInputElement>document.querySelector('#onePlayerMode');
let twoPlayersMode :HTMLInputElement = <HTMLInputElement>document.querySelector('#twoPlayersMode');
//cell boxes
let box11:  HTMLElement = <HTMLElement>document.querySelector('#box11');
let box12:  HTMLElement = <HTMLElement>document.querySelector('#box12');
let box13:  HTMLElement = <HTMLElement>document.querySelector('#box13');
let box21:  HTMLElement = <HTMLElement>document.querySelector('#box21');
let box22:  HTMLElement = <HTMLElement>document.querySelector('#box22');
let box23:  HTMLElement = <HTMLElement>document.querySelector('#box23');
let box31:  HTMLElement = <HTMLElement>document.querySelector('#box31');
let box32:  HTMLElement = <HTMLElement>document.querySelector('#box32');
let box33:  HTMLElement = <HTMLElement>document.querySelector('#box33');



twoPlayersMode.addEventListener('click',() =>{
    playerTwoDiv.className ="input block";
    statusMode.className = "status-mode none"; 
});
onePlayerMode.addEventListener('click',() =>{
    playerTwoDiv.className ="input none";
    statusMode.className += "status-mode block";
});

start.onclick = (e) => {
    let mode = 0;
    let levelMode;
    if(onePlayerMode.checked){
        mode= 1;
        modes.style.display="none";
        
        if(randomMode.checked){
            levelMode = 'random';
        }else{
            levelMode = 'hard';
        }
    }else{
        mode=2;
        modes.style.display="none";
    }

    let input1: string = (<HTMLInputElement>document.querySelector('#playerOneInput')).value;
    let input2: string = (<HTMLInputElement>document.querySelector('#playerTwoInput')).value;
    let game = new Game();
    if(game.getCurrentState().GetValues(input1, outputNames, playersBox, mode, input2)){
        game.getCurrentState().boardComputed([box11, box12, box13, box21, box22, box23, box31, box32, box33], reset, mode, levelMode);
        box11.onclick = () => { game.getCurrentState().ClickCell(1,1); }
        box12.onclick = () => { game.getCurrentState().ClickCell(1,2); }
        box13.onclick = () => { game.getCurrentState().ClickCell(1,3); }
        box21.onclick = () => { game.getCurrentState().ClickCell(2,1); }
        box22.onclick = () => { game.getCurrentState().ClickCell(2,2); }
        box23.onclick = () => { game.getCurrentState().ClickCell(2,3); }
        box31.onclick = () => { game.getCurrentState().ClickCell(3,1); }    
        box32.onclick = () => { game.getCurrentState().ClickCell(3,2); }
        box33.onclick = () => { game.getCurrentState().ClickCell(3,3); }
        reset.onclick = () => { game.setState(game.boardState); game.getCurrentState().Reset(); }
            reload.onclick = () =>{location.reload(); }
    }
  }
}

