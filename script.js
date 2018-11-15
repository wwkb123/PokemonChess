function setup() { //initialize everything
  fillFunctionButtons();
  fillStatusText();
  fillProgressBar();
  fillMatrix();
  setStatusText("Loaded succesfully!", "text-bold" );
}

function fillFunctionButtons() {
  var headDiv = document.getElementById("head");
  var funcBtnRow = createRow();
  // createButton(buttonText, styleClass, functionName);
  funcBtnRow.appendChild(createButton("All Mid All Random", "btn btn-primary btn-sm m-3", "f1()"));
  funcBtnRow.appendChild(createButton("Drop the beat", "btn btn-warning btn-sm m-3", "f2()"));
  funcBtnRow.appendChild(createButton("Defile", "btn btn-dark btn-sm m-3", "f3()"));
  funcBtnRow.appendChild(createButton("Puuurrrge!", "btn btn-light m-3", "f4()"));
  headDiv.appendChild(funcBtnRow);
}