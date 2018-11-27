//i is y, j is x
//available monsters: pikachu, bulbasaur, squirtle, charmander
//right hand side: player 1; left hand side: player 2
// {monsterName}_flipped means it's player 2

var isMonsterClicked = false; //determine whether a monster is clicked


//to do: let user to pick a pokemon, change stats accordingly

var monster1 = { i:7, j:7, name: "bulbasaur", hp:5, atk:2, speed: 1, energy: 0};
var monster2 = { i:0, j:0, name: "pikachu_flipped", hp:5, atk:1, speed: 1, energy: 0};

var currTurn = monster1; //player 1's monster move first


////////////////methods written by Professor Liu////////////////

function setup() { //initialize everything
  fillMatrix();
  fillFunctionButtons();
  fillStatusText();

  setButtonImage(7,7,monster1.name);
  setButtonImage(0,0,monster2.name);
  initMonsterStats();
  setStatusText("Monster 1's turn");
}

function fillMatrix() {
  var matrix = document.getElementById("grid");
  for (i = 0; i < 8; i++) {
    var newRow = createRow("justify-content-md-center");
    for (j = 0; j < 8; j++) {
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

function createDefaultButton() {
  var button = document.createElement("div");
  button.className = "button_" + i + "_" + j;
  button.id = "button_" + i + "_" + j;
  button.setAttribute("onclick", "buttonClicked("+i+","+j+")");
  button.setAttribute("style","position: relative");
  

  //the image part
  var img = document.createElement("img");
  img.id = "img_" + i + "_" + j;
  img.setAttribute("src", "images/grid.jpg");
  img.setAttribute("alt", "grid");
  img.setAttribute("width", "65");
  img.setAttribute("height", "65");

  //the text part
  var text = document.createElement("label");
  text.setAttribute("class", "");
  text.id = "text_" + i + "_" + j;

  button.appendChild(img);
  button.appendChild(text);
  return button;
}

function fillStatusText() {
  var headDiv = document.getElementById("head");
  var infoTextRow = createRow("ml-3");
  infoTextRow.id = "infoText"; //set id of this element so we can change it later
  headDiv.appendChild(infoTextRow);
}

function setStatusText(text) {
  var textDiv = document.getElementById("infoText");
  var newText = document.createElement("div");
  newText.className = "text-center";
  newText.appendChild(document.createTextNode(text));
  textDiv.innerHTML = "";
  textDiv.appendChild(newText);
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


////////////////end of methods written by Professor Liu////////////////





////////////////========methods written/overwritten by me========////////////////

function setButtonImage(i, j, image) {
  var button = document.getElementById("img_" + i + "_" + j);
  button.setAttribute("src", "images/" + image + ".jpg");
  button.setAttribute("alt", image);
}

function getButtonImage(i, j) {
  var img = document.getElementById("img_" + i + "_" + j);
  return img.getAttribute("alt");
}


//a function to initialize the stats of two monsters at the beginning of the game
function initMonsterStats(){

  
  var player1Div = document.getElementById("player1"); //player 1
  var player2Div = document.getElementById("player2"); //player 2

  //monster name
  var player1_nameDiv = document.createElement("div");
  player1_nameDiv.setAttribute("style","font-weight:700");
  var name1 = monster1.name;
  
  if(name1 == "pikachu" || name1 == "pikachu_flipped"){
    player1_nameDiv.appendChild(document.createTextNode("Pikachu"));
  }else if(name1 == "squirtle" || name1 == "squirtle_flipped"){
    player1_nameDiv.appendChild(document.createTextNode("Squirtle"));
  }else if(name1 == "bulbasaur" || name1 == "bulbasaur_flipped"){
    player1_nameDiv.appendChild(document.createTextNode("Bulbasaur"));
  }else if(name1 == "charmander" || name1 == "charmander_flipped"){
    player1_nameDiv.appendChild(document.createTextNode("Charmander"));
  }
  //end of monster name
  
  //hp
  var player1_hpDiv = document.createElement("div");
  player1_hpDiv.id = "player1_hp";
  
  player1_hpDiv.appendChild(document.createTextNode("HP: "));
  for(var count = 0; count < 5; count++){
    var hp = document.createElement("img");
    hp.src = 'images/hp.png';
    hp.setAttribute("width", "26");
    player1_hpDiv.appendChild(hp);
  }
  //end of hp

  //attack
  var player1_atkDiv = document.createElement("div");
  player1_atkDiv.id = "player1_atk";
  player1_atkDiv.appendChild(document.createTextNode("ATK: "));
  for(var count = 0; count < monster1.atk; count++){
    var atk = document.createElement("img");
    atk.src = 'images/attack.png';
    atk.setAttribute("width", "26");
    player1_atkDiv.appendChild(atk);
  }
  //end of attack
  

  //speed
  var player1_speedDiv = document.createElement("div");
  player1_speedDiv.id = "player1_speed";
  player1_speedDiv.appendChild(document.createTextNode("Speed: "));
  for(var count = 0; count < monster1.speed; count++){
    var speed = document.createElement("img");
    speed.src = 'images/speed.png';
    speed.setAttribute("width", "26");
    player1_speedDiv.appendChild(speed);
  }
  //end of speed

  player1Div.appendChild(player1_nameDiv);
  player1Div.appendChild(player1_hpDiv);
  player1Div.appendChild(player1_atkDiv);
  player1Div.appendChild(player1_speedDiv);
  //end of player 1
}


//to move a character
//swap(oldImage, newImage)
function swapButton(i1, j1, i2, j2){
  
  var oldImage = getButtonImage(i1,j1);
  var newImage = getButtonImage(i2,j2);

  var button1 = document.getElementById("img_" + i1 + "_" + j1);
  var button2 = document.getElementById("img_" + i2 + "_" + j2);

  button1.setAttribute("src", "images/" + newImage + ".jpg");
  button2.setAttribute("src", "images/" + oldImage + ".jpg");

  button1.setAttribute("alt", newImage);
  button2.setAttribute("alt", oldImage);


}

function buttonClicked(i, j) {


  var imageName = getButtonImage(i, j);
  console.log(i + " " + j + " " + imageName);

  if(imageName != "grid"){//if not grid, then it's a monster
    //monsterPos[0] == i
    //monsterPos[1] == j

    if(imageName == currTurn.name){
      displayRange(currTurn.i, currTurn.j, imageName);
    }
    //todo handle click not currTurn's monster
    
  }
  else if(imageName == "grid" && isMonsterClicked){
    //movement

    if(inRange(i, j, currTurn.name)){  //if in valid range
      swapButton(currTurn.i,currTurn.j,i,j);
      currTurn['i'] = i;
      currTurn['j'] = j;
      var placeholder = document.getElementById("button_"+ i +"_"+ j);
      placeholder.pseudoStyle("");
      isMonsterClicked = false;
      if(currTurn == monster1){
        currTurn = monster2;
        setStatusText("Monster 2's turn");
      }else{ //monster2
       currTurn = monster1;
       setStatusText("Monster 1's turn");
      }
    }
  }
}


//display the movement and attack range of a monster
function displayRange(curr_i, curr_j, monsterName){
  

  if(!isMonsterClicked){

    switch(monsterName){

      case "pikachu":
      case "pikachu_flipped":
        var curr_i_copy = curr_i;
        
        curr_i++;
        while(curr_i <= 7){
          
          var curr = document.getElementById("button_"+ curr_i +"_"+ curr_j);
          displayRangeHelper(curr, curr.getAttribute('id'));
          curr_i++;
        }
        curr_i = curr_i_copy; //reset curr_i

        curr_i--;
        while(curr_i >= 0){
          
          var curr = document.getElementById("button_"+ curr_i +"_"+ curr_j);
          displayRangeHelper(curr, curr.getAttribute('id'));
          curr_i--;
        }
        curr_i = curr_i_copy; //reset curr_i
        ////////////////////////////////////////////////////////
        var curr_j_copy = curr_j;
        curr_j++;
        while(curr_j <= 7){
          
          var curr = document.getElementById("button_"+ curr_i +"_"+ curr_j);
          displayRangeHelper(curr, curr.getAttribute('id'));
          curr_j++;
        }
        curr_j = curr_j_copy;

        curr_j--;
        while(curr_j >= 0){
          
          var curr = document.getElementById("button_"+ curr_i +"_"+ curr_j);
          displayRangeHelper(curr, curr.getAttribute('id'));
          curr_j--;
        }

        break;

      case "squirtle":
      case "squirtle_flipped":
        break;

      case "bulbasaur":
      case "bulbasaur_flipped":
        if((curr_j-1) >= 0){
          var left = document.getElementById("button_"+ curr_i +"_"+ (curr_j-1));
          displayRangeHelper(left, left.getAttribute('id'));
        }
        
        if((curr_j+1) <=7 ){
          var right = document.getElementById("button_"+ curr_i +"_"+ (curr_j+1));
          displayRangeHelper(right, right.getAttribute('id'));
        }

        if((curr_i-1) >=0 ){
          var top = document.getElementById("button_"+ (curr_i-1) +"_"+ curr_j);
          displayRangeHelper(top, top.getAttribute('id'));
        }

        if((curr_i+1) <=7 ){
          var bottom = document.getElementById("button_"+ (curr_i+1) +"_"+ curr_j);
          displayRangeHelper(bottom, bottom.getAttribute('id'));
        }

        break;

      case "charmander":
      case "charmander_flipped":
        break;

      default:
        break;
    }

    isMonsterClicked = true;

  }else{
    var placeholder = document.getElementById("button_"+ curr_i +"_"+ curr_j);
    placeholder.pseudoStyle("");
    isMonsterClicked = false;

  }

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
function inRange(curr_i, curr_j, monsterName){
  //monsterPos[0] == i
  //monsterPos[1] == j
  switch(monsterName){

    case "pikachu":
    case "pikachu_flipped":
      return curr_i == currTurn.i || curr_j == currTurn.j;
      break;

    case "squirtle":
    case "squirtle_flipped":
      break;

    case "bulbasaur":
    case "bulbasaur_flipped":
      return (Math.abs(curr_i - currTurn.i) <= 1) && (Math.abs(curr_j - currTurn.j) <= 1) && (curr_i == currTurn.i || curr_j == currTurn.j);
      break;

    case "charmander":
    case "charmander_flipped":
      break;

    default:
      break;
    }
}




////////////////========end of methods written/overwritten by me========////////////////
