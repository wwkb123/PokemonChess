//i is y, j is x


var character1 = {name: "bulbasaur", isClick: false};



HTMLElement.prototype.pseudoStyle = function(content){
  var _this = this;
  var _sheetId = "pseudoStyles";
  var _head = document.head || document.getElementsByTagName('head')[0];
  var _sheet = document.getElementById(_sheetId) || document.createElement('style');
  _sheet.id = _sheetId;
  if(content != ""){
    _sheet.innerHTML += content;
  }else{
    _sheet.innerHTML = content;
  }
 
  _head.appendChild(_sheet);
  return this;
};


function setup() { //initialize everything
  fillMatrix();
  fillFunctionButtons();

  setButtonImage(4,5,"bulbasaur");
  setButtonImage(4,2,"squirtle_flipped");




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
  img.setAttribute("width", "75");
  img.setAttribute("height", "75");

  //the text part
  var text = document.createElement("label");
  text.setAttribute("class", "caption unselectable");
  text.id = "text_" + i + "_" + j;

  button.appendChild(img);
  button.appendChild(text);
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

function setButtonImage(i, j, image) {
  var button = document.getElementById("img_" + i + "_" + j);
  button.setAttribute("src", "images/" + image + ".jpg");
  button.setAttribute("alt", image);
}

function getButtonImage(i, j) {
  var img = document.getElementById("img_" + i + "_" + j);
  return img.getAttribute("alt");
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


}

function buttonClicked(i, j) {
  if(getButtonImage(i, j) != "grid"){
    displayRange(i,j);
  }
}

function displayRange(i, j){

  if(!character1.isClick){

    var left = document.getElementById("button_"+ i +"_"+ (j-1));
    var right = document.getElementById("button_"+ i +"_"+ (j+1));
    var top = document.getElementById("button_"+ (i-1) +"_"+ j);
    var bottom = document.getElementById("button_"+ (i+1) +"_"+ j);

    displayRangeHelper(left, left.getAttribute('id'));
    displayRangeHelper(right, right.getAttribute('id'));
    displayRangeHelper(top, top.getAttribute('id'));
    displayRangeHelper(bottom, bottom.getAttribute('id'));

    character1['isClick'] = true;
  }else{
    var placeholder = document.getElementById("button_"+ i +"_"+ j);
    placeholder.pseudoStyle("");
    character1['isClick'] = false;

  }

}

function displayRangeHelper(btn, className){   

  btn.pseudoStyle(" ."+className+ ":before{  content: ' ' ; z-index: 10; display: block; position: absolute; height: 100%; top: 0; left: 0; right: 0; background: rgba(253, 34, 34, 0.5);}");

}

