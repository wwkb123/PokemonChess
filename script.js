/*


  Disclaimer:
  This game is created by a Pokemon enthusiast, and it is for educational purpose only.
  Any of the trademarks, service marks, collective marks, design rights, personality rights,
  or similar rights that are mentioned, used, or cited in this game are the property of their respective owners.


*/


/*

	 
        in this program,
          - - - - - - - -> j
        |
        |
        |
        |
        |
        v
        i

  - i is y-position, j is x-position
  - available monsters: pikachu, bulbasaur, squirtle, charmander
  - right hand side: player 1; left hand side: player 2
  - {monsterName}_flipped means it's player 2
  - In the current game version, player 2 is set to be an AI. It will make favorable decisions each turn automatically
*/
var isMonsterClicked = false; //determine whether a monster is clicked


//to do: let user to pick a pokemon, change stats accordingly

var monster1;
var monster2;

var currMonster;  //current turn's monster

var turn = 0; //number of turns have been played

var singlePlayer = true;

var gameover = false; //check the game is over




////////////////========methods written/overwritten by me========////////////////



//determine which pokemon is chosen by Player 1. Pokemon of Player 2 will be selected randomly(Player 2 is AI)
function choose(pokemonName){
  alert(pokemonName + ", I choose you!");

  monster1 = createPokemon(1, pokemonName.toLowerCase());  //create a pokemon for player 1
  //player 1 starts at bottom right corner
  monster1['i'] = 7;
  monster1['j'] = 15;

  var player2PokemonList = ["pikachu_flipped", "bulbasaur_flipped", "squirtle_flipped", "charmander_flipped"];

  var player2Pokemon = player2PokemonList[Math.floor(Math.random() * 4)];  // choose an index from 0 to 3

  monster2 = createPokemon(2, player2Pokemon);
  monster2['i'] = 0;
  monster2['j'] = 0;


  currMonster = monster1; //player 1's monster move first
  setup();
  document.getElementById("chooseArea").setAttribute("style","display:none");

}

//helper function to return a monster object with proper attributes according to its name
function createPokemon(playerID, pokemonName){
  var newMonster;
    switch(pokemonName){
      case "pikachu":
      case "pikachu_flipped":
        newMonster = { player:playerID, i:0, j:0, name: pokemonName, hp:4, atk:1, speed: 3, energy: 0, energyCharge: 50};
        break;

      case "squirtle":
      case "squirtle_flipped":
        newMonster = { player:playerID, i:0, j:0, name: pokemonName, hp:5, atk:2, speed: 3, energy: 0, energyCharge: 25};
        break;

      case "bulbasaur":
      case "bulbasaur_flipped":
        newMonster = { player:playerID, i:0, j:0, name: pokemonName, hp:6, atk:2, speed: 2, energy: 0, energyCharge: 25};
        break;

      case "charmander":
      case "charmander_flipped":
        newMonster = { player:playerID, i:0, j:0, name: pokemonName, hp:5, atk:3, speed: 2, energy: 0, energyCharge: 20};
        break;

      default:
        newMonster = { player:playerID, i:0, j:0, name: "grid", hp:0, atk:0, speed: 0, energy: 0, energyCharge: 0};
        break;
  }

  return newMonster;

}

//helper function to start a new game
function restart(){
	location.reload();
}

//helper funciton to hide the hint message
function hideHint(){
	document.getElementById("hint").innerHTML = "";
}

function setup() { //initialize everything
  fillMatrix();
  //fillFunctionButtons();
  //fillStatusText();

  setButtonImage(monster1.i, monster1.j, monster1.name);  //bottom right corner
  setButtonImage(monster2.i, monster2.j, monster2.name);  //top left corner
  initMonsterStats(monster1); //player 1
  initMonsterStats(monster2); //player 2
  turn++;
  setStatusText("Turn " + turn);
  document.getElementById("player1").setAttribute("style","border:3px solid red !important"); //a red frame indicates whose turn
  
  spawnItem();

}

function setStatusText(text) {
  var statusText = document.getElementById("status");
  statusText.innerHTML = text;
}


function buttonClicked(i, j) {
  if(monster1.hp <= 0 || monster2.hp <= 0) return;  //do nothing when a monster is dead
  var imageName = getButtonImage(i, j);
  console.log(i + " " + j + " " + imageName);

  if(imageName == currMonster.name){  //display only curr turn's monster's range
    /*  
        in this program,
          - - - - - - - -> j
        |
        |
        |
        |
        |
        v
        i
    */

    displayRange(currMonster);
    
  }
  else if(imageName == "grid" || isItem(imageName) && isMonsterClicked){  // a grid or an item is clicked
    //movement

    if(inRange(i, j, currMonster)){  //if in valid range
      cleanRangeTag();  //clean all the "range" tags
      

      if(isItem(imageName)){  // if an item is clicked
      	setButtonImage(i, j, "grid");   // the item is consumed, make it disappear

      	//effect of items
      	switch(imageName){
      		case "attack_grid":
      			setATK(currMonster, currMonster.atk + 1);
      			break;
      		case "speed_grid":
      			setSpeed(currMonster, currMonster.speed + 1);
      			break;
      		case "hp_grid":
      			setHP(currMonster, currMonster.hp + 1);
      			break;
          case "energy_grid":
            setEnergy(currMonster, currMonster.energy + currMonster.energyCharge);

      		default:
      			break;
      	}
      }

      swapButton(currMonster.i, currMonster.j, i, j); //update image

      currMonster['i'] = i;  //update i of currMonster after moving
      currMonster['j'] = j;  //update j
      var placeholder = document.getElementById("button_"+ i +"_"+ j);  //a placeholder element, created just for calling pseudoStyle("") to clean all red layers
      placeholder.pseudoStyle("");  //remove the red layers
      isMonsterClicked = false;

      if(currMonster.energy < 100){  //if energy is not full, + energyCharge% each turn
          setEnergy(currMonster, currMonster.energy+currMonster.energyCharge);
      }
      nextTurn();  //go to the next turn
    }
  }
}


//helper function to go to the next turn
function nextTurn(){
  if(currMonster == monster1){  //player 1's turn finished, transits to player 2's turn
    //move the red frame to another player
    document.getElementById("player1").removeAttribute("style");
    document.getElementById("player2").setAttribute("style","border:3px solid red !important");
          
    currMonster = monster2;

    if(singlePlayer){
    	AI_move();  //AI starts making decisions
    }
    
  
  }else{ //player 2's turn transits to player 1's turn

    
    document.getElementById("player2").removeAttribute("style");
    document.getElementById("player1").setAttribute("style","border:3px solid red !important");
    currMonster = monster1;
    
  }

  turn++;
  var messageBar = document.getElementById("message");

  if(turn % 5 == 0){  //spawn new item every 5 turns
  	spawnItem();
  }

  setStatusText("Turn " + turn);
  messageBar.innerHTML = "Next item appears in " + (5 - (turn % 5)) + " turn(s).";
  
 }


//display the movement and attack range of a monster
function displayRange(monster){
  
  if(!isMonsterClicked){
    //initialize legal and small range of starting i and j, to search for proper grids to display monster's range
    var start_i = monster.i - monster.speed;
    while(start_i < 0){
      start_i++;
    }
    var start_j = monster.j - monster.speed;
    while(start_j < 0){
      start_j++;
    }

    var end_i = monster.i + monster.speed;
    while(end_i > 7){
      end_i--;
    }
    var end_j = monster.j + monster.speed;
    while(end_j > 15){
      end_j--;
    }

    for(var i = start_i; i <= end_i; i++){
      for(var j = start_j; j <= end_j; j++){

        //var distance = Math.sqrt(Math.pow((i - monster.i),2) + Math.pow((j - monster.j),2));  //distance formulat
        var distance = Math.abs(i - monster.i) + Math.abs(j - monster.j); //distance on the grid system
        if(distance <= monster.speed && distance != 0){

          var currButton = document.getElementById("button_"+ i +"_"+ j);
          currButton.setAttribute("alt","range");
          displayRangeHelper(currButton, currButton.getAttribute('id'));  //show the red layer

        }//end of if distance is in range


      }//end of inner loop
    }//end of outer loop


  }else{

    cleanRangeTag(); //clean all the "range" tags
    var placeholder = document.getElementById("button_"+ monster.i +"_"+ monster.j);
    placeholder.pseudoStyle("");
  }
    

  isMonsterClicked = !isMonsterClicked;  //toggle the state
}


function setButtonImage(i, j, image) {
  var button = document.getElementById("img_" + i + "_" + j);
  if(button == null){
    return;
  }
  button.setAttribute("src", "images/" + image + ".png");
  button.setAttribute("alt", image);
}

function getButtonImage(i, j) {
  var img = document.getElementById("img_" + i + "_" + j);
  if(img == null){
    return "grid";  //if i or j exceeds the border
  }else{
    return img.getAttribute("alt");
  }
  
}


//a function to initialize the stats of two monsters at the beginning of the game
function initMonsterStats(monster){

  //find the stats div
  var playerDiv = document.getElementById("monster_" + monster.player + "_stats"); // e.g. player 1 -> monster_1_stats

  //monster image
  var monsterImgDiv = document.getElementById("monster_" + monster.player + "_img");
  var monsterImg = document.createElement("img");
  monsterImg.src = 'images/'+ monster.name +'_borderless.jpg';
  monsterImg.setAttribute("style", "border: 1px solid white");  //hide the border of the image
  monsterImgDiv.appendChild(monsterImg);

  //monster name
  var player_nameDiv = document.createElement("div");
  player_nameDiv.setAttribute("style","font-weight:700");
  var monsterName = monster.name;
  
  if(monsterName == "pikachu" || monsterName == "pikachu_flipped"){
    player_nameDiv.appendChild(document.createTextNode("Player " + monster.player + ": Pikachu"));
  }else if(monsterName == "squirtle" || monsterName == "squirtle_flipped"){
    player_nameDiv.appendChild(document.createTextNode("Player " + monster.player + ": Squirtle"));
  }else if(monsterName == "bulbasaur" || monsterName == "bulbasaur_flipped"){
    player_nameDiv.appendChild(document.createTextNode("Player " + monster.player + ": Bulbasaur"));
  }else if(monsterName == "charmander" || monsterName == "charmander_flipped"){
    player_nameDiv.appendChild(document.createTextNode("Player " + monster.player + ": Charmander"));
  }
  //end of monster name
  
  //hp
  var player_hpDiv = document.createElement("div");
  player_hpDiv.id = "player_" + monster.player + "_hp";  //e.g. player_1_hp
  
  player_hpDiv.appendChild(document.createTextNode("HP: "));
  for(var count = 0; count < monster.hp; count++){
    var hp = document.createElement("img");
    hp.src = 'images/hp.png';
    hp.setAttribute("width", "26");
    player_hpDiv.appendChild(hp);
  }
  //end of hp

  //attack
  var player_atkDiv = document.createElement("div");
  player_atkDiv.id = "player_" + monster.player + "_atk";
  player_atkDiv.appendChild(document.createTextNode("ATK: "));
  for(var count = 0; count < monster.atk; count++){
    var atk = document.createElement("img");
    atk.src = 'images/attack.png';
    atk.setAttribute("width", "26");
    player_atkDiv.appendChild(atk);
  }
  //end of attack
  

  //speed
  var player_speedDiv = document.createElement("div");
  player_speedDiv.id = "player_" + monster.player + "_speed";
  player_speedDiv.appendChild(document.createTextNode("Speed: "));
  for(var count = 0; count < monster.speed; count++){
    var speed = document.createElement("img");
    speed.src = 'images/speed.png';
    speed.setAttribute("width", "26");
    player_speedDiv.appendChild(speed);
  }
  //end of speed

  //energy
  var player_energyDiv = createRow("");

    //the title
    var energyTitleDiv = document.createElement("div");
    energyTitleDiv.setAttribute("class","col-sm-3");
    energyTitleDiv.appendChild(document.createTextNode("Energy: "));

    //the bar
    var energyBarDiv = document.createElement("div");
    energyBarDiv.setAttribute("class","col-sm-5 progress");
    energyBarDiv.setAttribute("style","height:1.5rem !important; padding:0"); //overwrite the original height and padding
    
    //a green colored bar
    var bar = createProgressBar("bar_" + monster.player, "bg-success", monster.energy);
    energyBarDiv.appendChild(bar);

    //skill button
    var skillButton = document.createElement("div");
    skillButton.id = "player_" + monster.player + "_skill_button";
    skillButton.setAttribute("onclick", "skillButtonClicked("+ monster.player +")");
    skillButton.setAttribute("style","position: relative");
    skillButton.setAttribute("class","col-sm-2");

      //the image part
      var img = document.createElement("img");
      img.id = "player_" + monster.player + "_skill_img";
      img.setAttribute("src", "images/skill_button_off.png");
      img.setAttribute("height", "25px");

    skillButton.appendChild(img);

  player_energyDiv.appendChild(energyTitleDiv);
  player_energyDiv.appendChild(energyBarDiv);
  player_energyDiv.appendChild(skillButton);
  //end of energy

  playerDiv.appendChild(player_nameDiv);
  playerDiv.appendChild(player_hpDiv);
  playerDiv.appendChild(player_atkDiv);
  playerDiv.appendChild(player_speedDiv);
  playerDiv.appendChild(player_energyDiv);
  //end of initilizing stats
}

function setHP(monster, newHP){
  
  monster['hp'] = newHP;
  var player_hpDiv = document.getElementById("player_" + monster.player + "_hp");
  player_hpDiv.innerHTML = "";

  player_hpDiv.appendChild(document.createTextNode("HP: "));
  for(var count = 0; count < newHP; count++){
    var hp = document.createElement("img");
    hp.src = 'images/hp.png';
    hp.setAttribute("width", "26");
    player_hpDiv.appendChild(hp);
  }

  if(newHP <= 0 && !gameover){
    setTimeout(function(){ 
    	alert("Player " + monster.player +"'s monster fainted! Game Over!"); 
    }, 900); //delay to wait for the animation pass through
    setTimeout(function(){ 
      if(monster.player == 2){
        alert("You win!"); 
      }else{
        alert("You lose!"); 
      }

      var messageBar = document.getElementById("message");
      messageBar.innerHTML = "Gameover. Start a new game?";
      messageBar.setAttribute("onclick","restart();")
      messageBar.setAttribute("style","color:blue; cursor:pointer");
      
    }, 1200); 
    gameover = true;
  }
}

function setATK(monster, newATK){
  monster['atk'] = newATK;
  var player_atkDiv = document.getElementById("player_" + monster.player + "_atk");
  player_atkDiv.innerHTML = "";

  player_atkDiv.appendChild(document.createTextNode("ATK: "));
  for(var count = 0; count < newATK; count++){
    var atk = document.createElement("img");
    atk.src = 'images/attack.png';
    atk.setAttribute("width", "26");
    player_atkDiv.appendChild(atk);
  }
}

function setSpeed(monster, newSpeed){
  monster['speed'] = newSpeed;
  var player_speedDiv = document.getElementById("player_" + monster.player + "_speed");
  player_speedDiv.innerHTML = "";

  player_speedDiv.appendChild(document.createTextNode("Speed: "));
  for(var count = 0; count < newSpeed; count++){
    var speed = document.createElement("img");
    speed.src = 'images/speed.png';
    speed.setAttribute("width", "26");
    player_speedDiv.appendChild(speed);
  }
}

function setEnergy(monster, newEnergy){
  if(newEnergy > 100){  // max energy is 100
    newEnergy = 100;
  }
  monster['energy'] = newEnergy;
  setProgressBar("bar_" + monster.player, "bg-success", newEnergy);
  if(monster.energy >= 100){ //if full, skill is activable
    document.getElementById("player_" + monster.player + "_skill_img").setAttribute("src", "images/skill_button_on.png");
  }else{
    document.getElementById("player_" + monster.player + "_skill_img").setAttribute("src", "images/skill_button_off.png");
  }
}


//to move a character
//swap(oldImage, newImage)
function swapButton(i1, j1, i2, j2){
  
  var oldImage = getButtonImage(i1,j1);
  var newImage = getButtonImage(i2,j2);

  var button1 = document.getElementById("img_" + i1 + "_" + j1);
  var button2 = document.getElementById("img_" + i2 + "_" + j2);

  if(button1 == null || button2 == null){
    return "failed";
  }

  button1.setAttribute("src", "images/" + newImage + ".png");
  button2.setAttribute("src", "images/" + oldImage + ".png");

  button1.setAttribute("alt", newImage);
  button2.setAttribute("alt", oldImage);
  return "success";
}




//display red layers to indicate the range
function displayRangeHelper(btn, className){   

  btn.pseudoStyle(" ."+className+ ":before{  content: ' ' ; z-index: 10; display: block; position: absolute; height: 100%; top: 0; left: 0; right: 0; background: rgba(253, 34, 34, 0.5);}");

}

//create a custom helper function for DOM element. Use pseudoStyle() to call
HTMLElement.prototype.pseudoStyle = function(content){
  var _this = this;
  var _sheetId = "pseudoStyles";  //id of the <style> tag
  var _head = document.head || document.getElementsByTagName('head')[0]; //find the <head> tag
  var _sheet = document.getElementById(_sheetId) || document.createElement('style'); //find the <style> tag or create a new one
  _sheet.id = _sheetId;
  if(content != ""){ //if not empty
    _sheet.innerHTML += content; //append new class
  }else{
    _sheet.innerHTML = content; //clear all
  }
 
  _head.appendChild(_sheet);
  return this;
};


//check the (i, j) of a clicked grid is in that monster's movement range. If yes, move to that grid
function inRange(curr_i, curr_j, monster){
   /*  
        in this program,
          - - - - - - - -> j
        |
        |
        |
        |
        |
        v
        i
   */
  var currButton = document.getElementById("button_"+ curr_i +"_"+ curr_j);
  return currButton.getAttribute("alt") == "range";

  
}


//a function to clean all the red layers that indicate the range
function cleanRangeTag(){

  //remove "range" tag
  for(var i = 0; i < 8; i++){
    for(var j = 0; j < 16; j++){
      var currButton = document.getElementById("button_"+ i +"_"+ j);
      if(currButton.getAttribute("alt") == "range"){
        currButton.removeAttribute("alt");
      }
    }
  }
}


//helper function to determine whether a string is a pokemon name
function isPokemon(name){
  switch(name){
    case "pikachu":
    case "pikachu_flipped":
    case "squirtle":
    case "squirtle_flipped":
    case "bulbasaur":
    case "bulbasaur_flipped":
    case "charmander":
    case "charmander_flipped":
      return true;
      break;

    default:
      return false;
      break;
    }
}

//take player's id as parameter, e.g. player 1 -> 1, player 2 -> 2
function skillButtonClicked(player){
  if(gameover) return;  // do nothing if gameover

  if(currMonster.player == player){  //only curr turn monster can use skill
    if(currMonster.energy >= 100){

      switch(currMonster.name){
        case "pikachu":
        case "pikachu_flipped":

        //select 8 random columns and hit them with thunders;  animation time: 800 ms

        /*
          skill shape:

          |   | || |   | ||
          |   | || |   | ||
          |   | || |   | ||

        */
          var count = 0;
          

          var randomCols = generateRandomCols(8);


          var playAnimation = setInterval(pikachu_animation, 80); 

          function pikachu_animation() {
            if(count == 10){ //after displaying 10 consecutive grids (8 grid max height + 2 moving image), finish

              var placeholder = document.getElementById("button_"+ 0 +"_"+ 0); //a placeholder element, created just for calling pseudoStyle("") to clean all image layers
              placeholder.pseudoStyle("");  //remove the image layers
              clearInterval(playAnimation); //stop the animation
              nextTurn();  //after the animation is finished, go to next turn

            }else{
              
              if(count >= 3){
                var placeholder = document.getElementById("button_"+ 0 +"_"+ 0);
                placeholder.pseudoStyle("");  //remove the old image layers

              }
              
              //get buttons
              for(var i = 0; i < randomCols.length; i++){
                var colButton = document.getElementById("button_"+ count +"_"+ randomCols[i]);
                displaySkillHelper(colButton, "thunder");  //show the skill image layer
                if(count >= 3){ // make a thuder with the length of 3 grids
                  var col1Button = document.getElementById("button_"+ (count-1) +"_"+ randomCols[i]);
                  displaySkillHelper(col1Button, "moving_thunder");  //since the tail of the thunder should deal 0 damage, use moving_thunder to prevent dealing extra damage
                  var col2Button = document.getElementById("button_"+ (count-2) +"_"+ randomCols[i]);
                  displaySkillHelper(col2Button, "moving_thunder");
                }
              }

              count++;

            }//end of else
          }//end of animation
          
          
          break;

        case "squirtle":
        case "squirtle_flipped":

        // animation time: 240 ms

        /*
          skill shape:

			O O O O O
	        O O O O O
	        O O   O O
	        O O O O O
	        O O O O O

        */
          var count = 1; 

          var curr_i = parseInt(currMonster.i);
          var curr_j = parseInt(currMonster.j);

          

          var playAnimation = setInterval(squirtle_animation, 80);

          function squirtle_animation() {
            if(count == 3){ //after displaying 2 consecutive grids, finish

              var placeholder = document.getElementById("button_"+ curr_i +"_"+ curr_j);
              placeholder.pseudoStyle("");  //remove the image layers
              clearInterval(playAnimation); //stop the animation
              nextTurn();   //after the animation is finished, go to next turn

            }else{
              
              var placeholder = document.getElementById("button_"+ curr_i +"_"+ curr_j);
              placeholder.pseudoStyle("");  //remove the old image layers

              var upleft_i = curr_i - count;
          	  var upleft_j = curr_j - count;

          	  var downright_i = curr_i + count;
          	  var downright_j = curr_j + count;

              for(var i = upleft_i; i <= downright_i; i++){
          		for(var j = upleft_j; j <= downright_j; j++){
          		  if(i == curr_i && j == curr_j) continue; //display bubble images except the monster position itself
          		  
          		  if(count == 2){  //skip the inner bubble circle when the outer circle appears
          		  	var distance = Math.abs(i - curr_i) + Math.abs(j - curr_j); //distance on the grid system
          		  	if(distance <= 1 || Math.abs(i - curr_i) == 1 && Math.abs(j - curr_j) == 1 /* diagonals */){
          		  	  continue;
          		  	}
          		  }

          		  var currButton = document.getElementById("button_"+ i +"_"+ j);
          		  displaySkillHelper(currButton, "bubble");
          		}
          	  }

              count++;
              
            }//end of else
          }//end of animation
          
          


          break;

        case "bulbasaur":
        case "bulbasaur_flipped":

        // animation time: 360 ms

        /*
          skill shape:

          \ | /
          -   -
          / | \
  
        */
          var count = 0;  

          var i = parseInt(currMonster.i);
          var up_i = i - 1;
          var down_i = i + 1;

          var j = parseInt(currMonster.j);
          var left_j = j - 1;
          var right_j = j + 1;

          var playAnimation = setInterval(bulbasaur_animation, 90); 

          function bulbasaur_animation() {
            if(count == 4){ //after displaying 4 consecutive grids, finish

              var placeholder = document.getElementById("button_"+ i +"_"+ j);
              placeholder.pseudoStyle("");  //remove the image layers
              clearInterval(playAnimation); //stop the animation
              nextTurn();   //after the animation is finished, go to next turn

            }else{
              
              var placeholder = document.getElementById("button_"+ i +"_"+ j);
              placeholder.pseudoStyle("");  //remove the old image layers

              //get vertical/horizontal buttons
              upButton = document.getElementById("button_"+ up_i +"_"+ j);
              downButton = document.getElementById("button_"+ down_i +"_"+ j);
              leftButton = document.getElementById("button_"+ i +"_"+ left_j);
              rightButton = document.getElementById("button_"+ i +"_"+ right_j);
              displaySkillHelper(upButton, "leaf");  //show the skill image layer
              displaySkillHelper(downButton, "leaf");
              displaySkillHelper(leftButton, "leaf");
              displaySkillHelper(rightButton, "leaf");


              //diagonal buttons
              upleftButton = document.getElementById("button_"+ up_i +"_"+ left_j);
              uprightButton = document.getElementById("button_"+ up_i +"_"+ right_j);
              downleftButton = document.getElementById("button_"+ down_i +"_"+ left_j);
              downrightButton = document.getElementById("button_"+ down_i +"_"+ right_j);
              displaySkillHelper(upleftButton, "leaf");  
              displaySkillHelper(uprightButton, "leaf");
              displaySkillHelper(downleftButton, "leaf");
              displaySkillHelper(downrightButton, "leaf");

              up_i--;
              down_i++;
              left_j--;
              right_j++;

              count++;
              
            }//end of else
          }//end of animation
          
          
          break;

        case "charmander":
        case "charmander_flipped":

          // animation time: 750 ms

          /*
          skill shape:

          - - - - - - - - - - -
          - - - - - - - - - - -
          - - - - - - - - - - -
  
          */

          var count = 0;  
          var i = parseInt(currMonster.i);
          var up_i = i - 1;
          var down_i = i + 1;
          var j = parseInt(currMonster.j);
          var left_j = j - 1;
          var right_j = j + 1;

          upButton = document.getElementById("button_"+ up_i +"_"+ j);
          downButton = document.getElementById("button_"+ down_i +"_"+ j);
          displaySkillHelper(upButton, "fire");  //show the skill image layer
          displaySkillHelper(downButton, "fire");

          //inner helper function to help displaying the fire animation
          function fireDisplayHelper(i, j, direction){
            var innerConut = 0; //tail of the fire image to be displayed
            while(innerConut < 5){ //display 4 more fire at the tail
              var buttonTail;
              if(direction == "left"){
                buttonTail = document.getElementById("button_"+ i +"_"+ (j + innerConut));
              }else if(direction == "right"){
                buttonTail = document.getElementById("button_"+ i +"_"+ (j - innerConut)); 
              }
              
              displaySkillHelper(buttonTail, "moving_fire");
              innerConut++;
            }
          }

          var playAnimation = setInterval(charmander_animation, 50); 

          function charmander_animation() {
            if(count == Math.max(15 - currMonster.j, currMonster.j - 1) + 5){ //after displaying maximum possible fire images, end the animation

              var placeholder = document.getElementById("button_"+ i +"_"+ j);
              placeholder.pseudoStyle("");  //remove the image layers
              clearInterval(playAnimation); //stop the animation
              nextTurn();   //after the animation is finished, go to next turn

            }else{
              
              if(count >= 5){
                var placeholder = document.getElementById("button_"+ i +"_"+ j);
                placeholder.pseudoStyle("");  //remove the old image layers
              }
              


              //get left hand side buttons
              leftButton = document.getElementById("button_"+ i +"_"+ left_j);
              displaySkillHelper(leftButton, "fire");

              upleftButton = document.getElementById("button_"+ up_i +"_"+ left_j);
              displaySkillHelper(upleftButton, "fire");


              downleftButton = document.getElementById("button_"+ down_i +"_"+ left_j);
              displaySkillHelper(downleftButton, "fire");

              

              //get right hand side buttons
              rightButton = document.getElementById("button_"+ i +"_"+ right_j);
              displaySkillHelper(rightButton, "fire");

              uprightButton = document.getElementById("button_"+ up_i +"_"+ right_j);
              displaySkillHelper(uprightButton, "fire");
              
              downrightButton = document.getElementById("button_"+ down_i +"_"+ right_j);
              displaySkillHelper(downrightButton, "fire");


              //display the fire tail animation
              if(count >= 5){
                fireDisplayHelper(i, left_j, "left");
                fireDisplayHelper(up_i, left_j, "left");
                fireDisplayHelper(down_i, left_j, "left");

                fireDisplayHelper(i, right_j, "right");
                fireDisplayHelper(up_i, right_j, "right");
                fireDisplayHelper(down_i, right_j, "right");
              }


              left_j--;
              right_j++;

              count++;
              
            }//end of else
          }//end of animation
       

          break;

        default:
          break;

      }// end of switch
      setEnergy(currMonster, 0); //empty the energy

    }
  }
}


//a helper function to display the skill animation and calculate the damage taken on monsters
function displaySkillHelper(btn, skill){ 
  if(btn == null) return;

  var className = btn.getAttribute('id');  //in this program, the id and class name of a button are the same
  var btnSplit = className.split("_");  //  -> [button, i, j]
  var btn_i = btnSplit[1];
  var btn_j = btnSplit[2];
  var btnImgAlt = getButtonImage(btn_i, btn_j);
  if(isPokemon(btnImgAlt)){  // if the alt of the btn image is a pokemon name, we hit a pokemon

    //check which pokemon get hit, can be mulitple, but not currMonster itself

    if(currMonster.player != monster1.player && monster1.name == btnImgAlt && parseInt(monster1.i) == parseInt(btn_i) && parseInt(monster1.j) == parseInt(btn_j)){  //monster 1 get hit
      setHP(monster1, monster1.hp - skillDamage(skill));  //deduct hp
      displayRangeHelper(btn,className);  //display a red layer on the enemy image to make the damage taken clearer
    }

    if(currMonster.player != monster2.player && monster2.name == btnImgAlt && parseInt(monster2.i) == parseInt(btn_i) && parseInt(monster2.j) == parseInt(btn_j)){ //monster 2 get hit
      setHP(monster2, monster2.hp - skillDamage(skill));
      displayRangeHelper(btn,className);
    }

  }//end if hit a pokemon
  btn.pseudoStyle(" ."+className+ ":before{  content: ' ' ; z-index: 10; display: block; position: absolute; height: 100%; top: 0; left: 0; right: 0; background-image:url('images/" + skill + ".png'); background-size: 65px; background-repeat: no-repeat;}");

}


//helper function to return damage of a skill
function skillDamage(skillName){
  switch(skillName){

    //basic skills damage, can accumulate with attack item buff
    case "leaf":
    case "fire":
    case "bubble":
    case "thunder":
      return currMonster.atk;
      break;

    default:  //possible animation images that should deal 0 damage
      return 0;
      break;
  }
}

//helper function to generate random non-repeating numbers for pikachu's skill
function generateRandomCols(numberOfCol){
  var list = [];

  //make numberOfCol columns
  for(var i = 0; i < numberOfCol; i++){
    var col = Math.floor(Math.random() * 16);  // pick a random integer from 0 to 15

    while(list.indexOf(col) >= 0){  //if is found in the list, index will be >= 0. else is -1
      col = Math.floor(Math.random() * 16); // eliminate the case of getting the same column
    }

    list.push(col);  //push to the list
  }

  return list;
}



function spawnItem(){

  /* 
    possible items, put more energy item, to increase the chance of getting it, to prevent player keep getting other same item 
    that can make the game not balance, e.g. keep getting speed
  */

	var items = ["energy_grid", "attack_grid", "energy_grid", "speed_grid", "hp_grid", "energy_grid", "energy_grid"]; 

	var random_i = Math.floor(Math.random() * 8);  //generate a random number between 0-7
	var random_j = Math.floor(Math.random() * 16);  //generate a random number between 0-15

	var imageName = getButtonImage(random_i, random_j);
	while(isPokemon(imageName)){  // until we get an image name that is not a pokemon name
	  random_i = Math.floor(Math.random() * 8);  
	  random_j = Math.floor(Math.random() * 16);
	}

	var item = items[Math.floor(Math.random() * 3)]; //pick a random item

	setButtonImage(random_i, random_j, item);

}

function isItem(imageName){
	switch(imageName){
		case "attack_grid":
		case "speed_grid":
		case "hp_grid":
    case "energy_grid":
			return true;

		default:
			return false;
	}
}


function getRange(){
  var rangeArr = [];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 16; j++) {
      var currButton = document.getElementById("button_" + i + "_" + j);
      if(currButton.getAttribute("alt") == "range" && !isPokemon(getButtonImage(i, j))){
        rangeArr.push(i + "_" +j);  // push a i_j pair, to be split("_") later
      }
    }
  }

  return rangeArr;
}


//determine whether the victim is in attacker's skill range
function isInSkillRange(attacker, victim){
  var attacker_i = parseInt(attacker.i);
  var attacker_j = parseInt(attacker.j);

  var victim_i = parseInt(victim.i);
  var victim_j = parseInt(victim.j);

  switch(attacker.name){
    case "pikachu_flipped":
      return true;  //pikachu's skill is in random range, will be casted regardless of the range
      break;

    case "squirtle_flipped":
      var upleft_i = attacker_i - 2;
      var upleft_j = attacker_j - 2;

      var downright_i = attacker_i + 2;
      var downright_j = attacker_j + 2;


      for(var i = upleft_i; i <= downright_i; i++){
        for(var j = upleft_j; j <= downright_j; j++){
          if(i == victim_i && j == victim_j){  //if the victim is in skill range
            return true;
          }
        }
      }

      return false;
      break;

    case "bulbasaur_flipped":
      //check vertical line
      if(attacker_j == victim_j && Math.abs(attacker_i - victim_i) <= 4){
        return true;
      }

      //check horizontal line
      if(attacker_i == victim_i && Math.abs(attacker_j - victim_j) <= 4){
        return true;
      }

      //check diagonals

      if(Math.abs(attacker_i - victim_i) == Math.abs(attacker_j - victim_j) && Math.abs(attacker_i - victim_i) <= 4){
        return true;
      }

      //else
      return false;
      break;

    case "charmander_flipped":
      if(Math.abs(attacker_i - victim_i) <= 1){
        return true;
      }
      return false;
      break;

    default:
      return false;
      break;
  }

}

//helper function to find the cloest item's position for the AI
function getClosestItemPos(monster){
  var itemList = [];

  //find all items
  for(var i = 0; i < 8; i++){
    for(var j = 0; j < 16; j++){
      var currImg = document.getElementById("img_" + i + "_" + j);
      if(isItem(currImg.getAttribute("alt"))){  //if it is an item
        itemList.push(i + "_" + j);  // push i_j pair
      }
    }
  }

  if(itemList.length == 0) return null;

  var min_index = 0;

  var curr_i = itemList[0].split("_")[0];  // i_j  ->  i
  var curr_j = itemList[0].split("_")[1];  // i_j  ->  j
  var min_distance = Math.abs(curr_i - monster.i) + Math.abs(curr_j - monster.j);  //assume the first distance is the shortest

  for(var index = 0; index < itemList.length; index++){
    curr_i = itemList[index].split("_")[0];
    curr_j = itemList[index].split("_")[1];
    var distance = Math.abs(curr_i - monster.i) + Math.abs(curr_j - monster.j);
    console.log(distance + " " + itemList[index]);
    if(min_distance > distance){
      min_distance = distance;
      min_index = index;
    }
  }

  return itemList[min_index];  //found the i_j pair we want

}

//helper function to help monster make decisions and move
function monster2Move(rangeArr, command){

  console.log(rangeArr);

  if(rangeArr.length == 0){  // sometimes the rangeArr will be null since the skill animation hasn't finished but a monster is moving
    
    setTimeout(function(){
      buttonClicked(monster2.i, monster2.j); //display the red layers
      rangeArr = getRange();  //get all elements with "range" tag
      monster2Move(rangeArr, command); //call it again
    }, 500);

    console.log("rangeArr was null");
  }else{
    var ij_pair = getClosestItemPos(monster2);
    if(ij_pair != null || command == "attack"){ //if there is an item or command is "attack"

      //destination's i_j
      var goal_i;
      var goal_j;
      if(command == "attack"){  // attack command

        //find the closest position to monster1
        goal_i = monster1.i;   
        goal_j = monster1.j;
        
      }else if(command == "item"){  // look for item command
        
        //find the closest position to an item
        goal_i = ij_pair.split("_")[0];  // i_j -> i
        goal_j = ij_pair.split("_")[1];  // i_j -> j

      }

      var min_index = 0;
      var curr_i = rangeArr[0].split("_")[0];  // i_j  ->  i
      var curr_j = rangeArr[0].split("_")[1];  // i_j  ->  j
      var min_distance = Math.abs(curr_i - goal_i) + Math.abs(curr_j - goal_j);  //assume the first distance is the shortest
      //move to the closest position in available range
      for(var index = 0; index < rangeArr.length; index++){
        curr_i = rangeArr[index].split("_")[0];
        curr_j = rangeArr[index].split("_")[1];
        var distance = Math.abs(curr_i - goal_i) + Math.abs(curr_j - goal_j);
        if(min_distance > distance){  //found a better position and doesn't have a pokemon there
          min_distance = distance;
          min_index = index;
        }
      }// end of for loop

      var move_i = rangeArr[min_index].split("_")[0];
      var move_j = rangeArr[min_index].split("_")[1];
      buttonClicked(move_i, move_j);


    }else{ // if no item, move randomly
      var index = Math.floor(Math.random() * rangeArr.length);
      var curr_i = rangeArr[index].split("_")[0];
      var curr_j = rangeArr[index].split("_")[1];
      buttonClicked(curr_i, curr_j);
      while(isPokemon(getButtonImage(curr_i, curr_j))){  //move only if that grid is not a pokemon
        index = Math.floor(Math.random() * rangeArr.length);
        curr_i = rangeArr[index].split("_")[0];
        curr_j = rangeArr[index].split("_")[1];
        buttonClicked(curr_i, curr_j);
      }
    }
    //end of "item" command
  }

}


function AI_move(){
  if(monster2.hp <= 0) return;  //do nothing if it's dead

  var rangeArr;

  setTimeout(function(){
    buttonClicked(monster2.i, monster2.j); //display the red layers
    rangeArr = getRange();  //get all elements with "range" tag
    while(rangeArr.length == 0){  //sometimes the red layers get cleaned by the animation component, so try again
    	buttonClicked(monster2.i, monster2.j); 
    	rangeArr = getRange(); 
    	console.log("rangeArr was null"); 
    }
  }, 500);

  
  setTimeout(function(){
    //make decisions


    /*
                                      if enemy is in attack range -> attack
                                     /
            if have enough energy -> - if not in attack range, but AI have enough hp -> attack mode: move toward enemy
           /                         \
    -------                           else -> defense mode: look for items
           \
            else -> defense mode: look for items

    */

    //check whether skill can be casted
    if(monster2.energy >= 100){ //if have enough energy
      if(isInSkillRange(monster2, monster1)){ //if in skill range

        skillButtonClicked(monster2.player);
       

      }else{ // try to move closer to enter skill range
        if(monster2.hp > 2.5){
          monster2Move(rangeArr, "attack");
        }else{
          monster2Move(rangeArr, "item");
        }
        
      }

    }else{ // if skill hasn't been casted or don't have enough energy, move and look for items/good positions
      monster2Move(rangeArr, "item");
    }


    
  }, 1000);

}




////////////////========end of methods written/overwritten by me========////////////////













////////////////methods written by Professor Liu////////////////
function fillMatrix() {
  var matrix = document.getElementById("grid");
  for (var i = 0; i < 8; i++) {
    var newRow = createRow("justify-content-md-center");
    for (var j = 0; j < 16; j++) {
      newRow.appendChild(createDefaultButton(i, j));
    }
    matrix.appendChild(newRow);
  }
}


function fillFunctionButtons() {
  var headDiv = document.getElementById("head");
  var funcBtnRow = createRow();
  // createButton(buttonText, styleClass, functionName);
  //funcBtnRow.appendChild(createButton("All Mid All Random", "btn btn-primary btn-sm m-3", "f1()"));
  //funcBtnRow.appendChild(createButton("Drop the beat", "btn btn-warning btn-sm m-3", "f2()"));
  //funcBtnRow.appendChild(createButton("Defile", "btn btn-dark btn-sm m-3", "f3()"));
  //funcBtnRow.appendChild(createButton("Puuurrrge!", "btn btn-light m-3", "f4()"));
  headDiv.appendChild(funcBtnRow);
}

function createDefaultButton(i, j) {
  var button = document.createElement("div");
  button.className = "button_" + i + "_" + j;
  button.id = "button_" + i + "_" + j;
  button.setAttribute("onclick", "buttonClicked("+i+","+j+")");
  button.setAttribute("style","position: relative");
  

  //the image part
  var img = document.createElement("img");
  img.id = "img_" + i + "_" + j;
  img.setAttribute("src", "images/grid.png");
  img.setAttribute("alt", "grid");
  img.setAttribute("width", "65");
  img.setAttribute("height", "65");

  //the text part
  // var text = document.createElement("label");
  // text.setAttribute("class", "");
  // text.id = "text_" + i + "_" + j;

  button.appendChild(img);
  //button.appendChild(text);
  return button;
}




// helper functions below

function createRow(className) {
  var rowDiv = document.createElement("div");
  if (className == null) {
    rowDiv.className = "row";
  } else {
    rowDiv.className = "row " + className;
  }
  return rowDiv;
}

function createProgressBar(bar_id, color, value) {
  var bar = document.createElement("div");
  bar.id = bar_id;
  bar.className = "progress-bar " + color;
  bar.setAttribute("style", "width: " + value + "%");
  bar.innerHTML = value/20 + "/5";
  return bar;
}

function setProgressBar(bar_id, color, value) {
  var bar = document.getElementById(bar_id);
  bar.className = "progress-bar " + color;
  bar.setAttribute("style", "width: " + value + "%");
  bar.innerHTML = value/20 + "/5";
}


////////////////end of methods written by Professor Liu////////////////

