//i is y-position, j is x-position
//available monsters: pikachu, bulbasaur, squirtle, charmander
//right hand side: player 1; left hand side: player 2
// {monsterName}_flipped means it's player 2

var isMonsterClicked = false; //determine whether a monster is clicked


//to do: let user to pick a pokemon, change stats accordingly

var monster1 = { player:1, i:7, j:15, name: "bulbasaur", hp:6, atk:2, speed: 2, energy: 0};
var monster2 = { player:2, i:0, j:0, name: "pikachu_flipped", hp:5, atk:1, speed: 4, energy: 0};

var currMonster = monster1; //player 1's monster move first







////////////////========methods written/overwritten by me========////////////////

function choosePokemon(){
  setup();
  //document.getElementById("chooseArea").setAttribute("style","display:none");
}


//determine which pokemon is chosen
function choose(pokemonName){
  alert(pokemonName + ", I choose you!");
}

function setup() { //initialize everything
  fillMatrix();
  //fillFunctionButtons();
  //fillStatusText();

  setButtonImage(monster1.i, monster1.j, monster1.name);  //bottom right corner
  setButtonImage(monster2.i, monster2.j, monster2.name);  //top left corner
  initMonsterStats(monster1); //player 1
  initMonsterStats(monster2); //player 2
  //setStatusText("Monster 1's turn");
  document.getElementById("player1").setAttribute("style","border:3px solid red !important"); //a red frame indicates whose turn
  
}

function setStatusText(text) {
  var statusText = document.getElementById("status");
  statusText.innerHTML = text;
}


function buttonClicked(i, j) {

  var imageName = getButtonImage(i, j);
  console.log(i + " " + j + " " + imageName);

  if(imageName != "grid"){//if not grid, then it's a monster
    /*  
        in this program,
        monsterPos[0] == i
        monsterPos[1] == j
    */

    //display only curr turn's monster's range
    if(imageName == currMonster.name){
      displayRange(currMonster);
    }
    
    
  }
  else if(imageName == "grid" && isMonsterClicked){
    //movement

    if(inRange(i, j, currMonster)){  //if in valid range
      cleanRangeTag();  //clean all the "range" tags
      swapButton(currMonster.i, currMonster.j, i, j); //update image
      currMonster['i'] = i;  //update i of currMonster after moving
      currMonster['j'] = j;  //update j
      var placeholder = document.getElementById("button_"+ i +"_"+ j);  //a placeholder element, created just for calling pseudoStyle("") to clean all red layers
      placeholder.pseudoStyle("");  //remove the red layers
      isMonsterClicked = false;

      if(currMonster.energy < 100){  //if energy is not full, + 20% each turn
          setEnergy(currMonster, currMonster.energy+100);
      }
      nextTurn();  //go to the next turn
    }
  }
}


//helper function to go to the next turn
function nextTurn(){
  if(currMonster == monster1){
    //move the red frame to another player
    document.getElementById("player1").removeAttribute("style");
    document.getElementById("player2").setAttribute("style","border:3px solid red !important");
          
    currMonster = monster2;
    //setStatusText("Monster 2's turn");
  }else{ //monster2
    document.getElementById("player2").removeAttribute("style");
    document.getElementById("player1").setAttribute("style","border:3px solid red !important");
    currMonster = monster1;
    //setStatusText("Monster 1's turn");
  }

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

  if(newHP <= 0){
    setTimeout(function(){ alert("Player " + monster.player +"'s monster fainted! Game Over!"); }, 300); //delay to wait for the animation pass through
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
  //monsterPos[0] == i
  //monsterPos[1] == j
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
  if(currMonster.player == player){  //only curr turn monster can use skill
    if(currMonster.energy == 100){

      switch(currMonster.name){
        case "pikachu":
        case "pikachu_flipped":

        //select 4 random columns and hit them with thunders

          var count = 0;
          

          var randomCols = generateRandomCols(8);


          var playAnimation = setInterval(pikachu_animation, 90); 

          function pikachu_animation() {
            if(count == 10){ //after displaying 10 consecutive grids (8 grid max height + 2 moving image), finish

              var placeholder = document.getElementById("button_"+ 0 +"_"+ 0); //a placeholder element, created just for calling pseudoStyle("") to clean all image layers
              placeholder.pseudoStyle("");  //remove the image layers
              clearInterval(playAnimation); //stop the animation

            }else{
              
              if(count >= 3){
                var placeholder = document.getElementById("button_"+ 0 +"_"+ 0);
                placeholder.pseudoStyle("");  //remove the old image layers

              }
              
              //get buttons
              for(var i = 0; i < randomCols.length; i++){
                var colButton = document.getElementById("button_"+ count +"_"+ randomCols[i]);
                displaySkillHelper(colButton, "thunder");  //show the skill image layer
                if(count >= 3){ // make a thuder with the lenght of 3 grids
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

          break;

        case "bulbasaur":
        case "bulbasaur_flipped":

        /*
          skill shape:

          \ | /
          -   -
          / | \
  
        */
          var count = 0;  
          var i = currMonster.i;
          var up_i = i - 1;
          var down_i = i + 1;
          var j = currMonster.j;
          var left_j = j - 1;
          var right_j = j + 1;

          var playAnimation = setInterval(bulbasaur_animation, 90); 

          function bulbasaur_animation() {
            if(count == 4){ //after displaying 4 consecutive grids, finish

              var placeholder = document.getElementById("button_"+ i +"_"+ j);
              placeholder.pseudoStyle("");  //remove the image layers
              clearInterval(playAnimation); //stop the animation

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
          break;

        default:
          break;

      }// end of switch
      setEnergy(currMonster, 0); //empty the energy
      setTimeout(function(){
        nextTurn(); //wait until the animation thread is read, go to the next turn
      }, 1000); //delay to wait for the animation pass through
      
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

    //check which pokemon get hit, can be mulitple

    if(currMonster.player != monster1.player && monster1.name == btnImgAlt && monster1.i == btn_i && monster1.j == btn_j){  //monster 1 get hit
      setHP(monster1, monster1.hp - skillDamage(skill));  //deduct hp
    }

    if(currMonster.player != monster2.player && monster2.name == btnImgAlt && monster2.i == btn_i && monster2.j == btn_j){ //monster 2 get hit
      setHP(monster2, monster2.hp - skillDamage(skill));
    }

  }//end if hit a pokemon
  btn.pseudoStyle(" ."+className+ ":before{  content: ' ' ; z-index: 10; display: block; position: absolute; height: 100%; top: 0; left: 0; right: 0; background-image:url('images/" + skill + ".png'); background-size: 65px; background-repeat: no-repeat;}");

}


//helper function to return damage of a skill
function skillDamage(skillName){
  switch(skillName){
    case "leaf":
      return 2;
      break;
    case "fire":
      return 3;
      break;
    case "bubble":
      return 2;
      break;
    case "thunder":
      return 1;
      break;
    default:
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

