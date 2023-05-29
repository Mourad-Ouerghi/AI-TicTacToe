var originalBoard //variable contenant le tableau d'origine pour le jeu
const human = 'O' //Le joueur joue avec o
const ai = 'X'// l'ordinatuer joue avec x
var minimaxChoice // variable contient le choix de l'algorithme
var tableau_temps_execution = [] //tableau contenant le temps d'éxecution pour chaque coup
var number_of_nodes //tableau contenant le nombre totale des noeuds dévloppées
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
] //Toutes les combinaisons possibles du gain
const cells = document.querySelectorAll('.cell') //selection de toutes les colonnes du tableau déclaré index.html


function minimax_Button()// si le bouton cliqué est minimax alors cette fonction est déclenché
{
    minimaxChoice = true ; //on a choisit minimax donc on affecte vrai
    document.getElementById("startgame").style.display = "none" //on retire la bannière du choix d'algorithme
    startGame() //déclencher la fonction responsable du fonctionnement du jeu
}

function alpha_Beta_Button()// si le bouton cliqué est alphaBeta alors cette fonction est déclenché
{
    minimaxChoice = false ;  //on a choisit alphabeta donc on affecte faux
    document.getElementById("startgame").style.display = "none" //on retire la bannière du choix d'algorithme
    startGame() //déclencher la fonction responsable du fonctionnement du jeu
}

function replay_button()// si le bouton cliqué est replay alors cette fonction est déclenché
{
    document.getElementById("startgame").style.display = "block" //on affiche la bannière du choix de l'algorithme
    document.querySelector('.endgame').style.display = "none" //N'afficher pas la baniére qui déclare le gagnant lorsque le jeu commence
}


function startGame(){
    tableau_temps_execution = []
    number_of_nodes = 0
    originalBoard = Array.from(Array(9).keys()) //Initilisation du tableau d'origine avec des valeurs de 0 à 8
    for (let i = 0 ; i < cells.length ; i++)
    {
        cells[i].innerHTML = ""//Reintialiser la colonne du tableau du jeu du fichier index.html au vide
        cells[i].style.removeProperty('background-color')//Reintialiser l'arriére plan de la colonne du tableau du jeu du fichier index.html
        cells[i].addEventListener('click', turnClick)//Ajouter un écouteur d'événement pour enregitsrer le click du joueur en utilisant la fonction turnclick
    }
}

function turnClick(cell)
{
    if (typeof originalBoard[cell.target.id] == 'number')//verifier que la colonne cliquée est encore vide (contient un entier et non pas X ou O)
    {
        turn(cell.target.id, human)//enregitsrer le clique du joueur 
        let gameWon = checkWin(originalBoard, human)//vérifier s'il a gagné
        if(!gameWon){
            if (!checkTie()) turn(bestSpot(), ai)// si non vérifier qu'il n y a pas un nul si non le tour de l'ordinateur
        }
    }
}

function turn (cellId, player )
{
    originalBoard[cellId] = player //enregistrer le click dans le tableau d'origine
    document.getElementById(cellId).innerText = player//afficher le résultat du click dans l'interface
    let gameWon = checkWin(originalBoard, player)//vérifier s'il y a un gagnant
    if (gameWon) gameOver(gameWon) // s'il y a un gagnant alors la fonction gameover est déclenché
}

function checkWin(board, player)
{
    let plays = board.reduce((a,e,i)=>(e === player ) ? a.concat(i) : a, [])// cette expression permet de concaténer chaque fois les cellules choisit par le joueur dans un tableau
    let gameWon = null
    for(let [index, win] of winCombos.entries())// on boucle sur toutes les combinaisons de gain possible
    {
        if (win.every(element => plays.indexOf(element) > -1))// si les cellules cliquées par le joueur appartiennent à l'une des combinaison de gain 
        {
            gameWon = {index: index, player: player}  // alors on retourne un objet contenant le joueur gagnant ainsi que la combinaison de gain pour la soulignée dans l'interface graphique
            break;
        }
    }
    return gameWon
}

function gameOver (gameWon)// cette fonction souligne la combinaison de gain du joueur et déclare un gagnant en utilisant la fonction declare winner
{
    for (let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == human ? "green" : "red"
    }
    for (let i = 0 ; i< cells.length; i++){
        cells[i].removeEventListener('click', turnClick)
    }
    declareWinner(gameWon.player === human ? "You won" : "AI won")
    
}

function declareWinner(whoWon)//cette fonction déclare le gagnant dans une banniére avec le nombre des noeuds développées ainsi que temps d'éxecution pour chque coup
{
    let str = ``
    for (let i ; i<tableau_temps_execution.length; i++)
    {
        str += `${tableau_temps_execution[i]} `;
    }
    document.querySelector(".endgame").style.display = "block"
    document.querySelector(".endgame .text").innerText= whoWon
    document.querySelector(".endgame .nombre_des_noeuds").innerText= "nombre des noeuds : " + number_of_nodes
    document.querySelector(".endgame .temps_execution").innerText= "les temps d'exécution en ms : " + tableau_temps_execution

    
}

function emptyCells()// cette fonction vérifie s'il y a des cellules vides (ne contenant ni X ni O)
{
    return originalBoard.filter(s => typeof s == 'number')
}

function bestSpot()//Cette fonction retourne le meilleur coup pour l'agent logique en utilisant l'algorithme choisit et calcule le temps d'éxecution pour chaque algorithme
{
    let i 
    let start
    let end 
    if (minimaxChoice) 
    {   
        start = Date.now()
        i = minimax(originalBoard, ai).index
        end = Date.now();
        tableau_temps_execution.push(end-start)
    }
    else  
    {
        start = Date.now()
        i =  alpha_beta(originalBoard, ai, -100000, 100000).index//on initialise alpha avec une valeur trés petite et beta avec une valeur trés grande
        end = Date.now();
        tableau_temps_execution.push(end-start)
    }
    return i
}

function checkTie()//Cette fonction vérifie s'il y a un nul entre le joueur et l'agent logique en vérifiant le nombre des cellules remplit chaque fois 
{
    if (emptyCells().length == 0){
        for(let i=0; i < cells.length; i++){
            cells[i].style.backgroundColor = "blue"
            cells[i].removeEventListener('click', turnClick)
        }
        declareWinner("It's a tie")
        return true 
    }
    return false 
}


// La même expliquation détaillé au niveau de l'algorithme alpha beta mais sans élagage 
function minimax (newBoard, player)
{
    var availableSpots = emptyCells(newBoard)

    if (checkWin(newBoard, human)){
        return {score: -1} 
    }else if (checkWin(newBoard, ai)){
        return {score: 1} 
    }else if (availableSpots.length === 0){
        return {score: 0}
    }

    var moves = [] 

    for (var i = 0; i < availableSpots.length; i++)
    {
        var move = {}
        move.index = newBoard[availableSpots[i]]
        newBoard[availableSpots[i]] = player
        number_of_nodes++

        if (player == ai){
            move.score = minimax (newBoard, human).score
        }
        else{
            move.score = minimax (newBoard, ai).score
        }

        newBoard[availableSpots[i]] = move.index;

        moves.push(move)
    }

	var bestMove;
	if(player === ai) {
		var bestScore = -1000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
        
	} else {
		var bestScore = 1000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove]
}

function alpha_beta(newBoard, player, alpha, beta) {
    var availableSpots = emptyCells(newBoard);//on fait une liste des cellules vides

    //cette section conerne l'heuristique
    if (checkWin(newBoard, human)) {// si humain est le gagnant on retourne -1
        return {score: -1};
    } else if (checkWin(newBoard, ai)) {// si l'agent logique est le gagnant on retourne 1
        return {score: 1};
    } else if (availableSpots.length === 0) {//s'il y a un nul on retourne 0
        return {score: 0};
    }

    var moves = [];

    // on boucle maintenant sur les cas vides
    for (var i = 0; i < availableSpots.length; i++) {
        var move = {};
        move.index = newBoard[availableSpots[i]];//on enregistre la case vide i dans l'attribut index de l'objet move
        newBoard[availableSpots[i]] = player;// on se deplace vers la case vide i
        number_of_nodes++;// on incémente le nombre des noeuds puisque le déplacement vers une case vide est la création d'un nouveau noeud

        if (player == ai) {
            move.score = alpha_beta(newBoard, human, alpha, beta).score;// si le joueur est l'agent logique on appel récursivement la fonction alpha-beta avec l'humain
            if (move.score > alpha) {//puisque on est dans le niveau de l'agent logique donc c'est un niveau maximisant d'ou on change la valeur d'alpha si nécessaire
                alpha = move.score;
            }
        } else {
            move.score = alpha_beta(newBoard, ai, alpha, beta).score;// si le joueur est l'humain on appel récursivement la fonction alpha-beta avec l'agent logique
            if (move.score < beta) {//puisque on est dans le niveau de l'humain donc c'est un niveau minimisant d'ou on change la valeur de beta si nécessaire
                beta = move.score;
            }
        }

        newBoard[availableSpots[i]] = move.index;// on réinitialise notre tableau de bord d'origine suite au changement faite dans la ligne 232
        if (alpha >= beta) {// on fait un élagage si alpha >= beta
            return move;
        }

        moves.push(move);
    }

    var bestMove;
    if (player === ai) {//on choisi le mouvement avec le max de gain si c'est tour de l'agent logique
        var bestScore = -1000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }

    } else {
        var bestScore = 1000;//on choisi le mouvement avec le min de gain si c'est tour de l'humain
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}


