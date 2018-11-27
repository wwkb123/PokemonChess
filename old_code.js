//old displayRange()

function displayRange(curr_i, curr_j, monster){
  

  if(!isMonsterClicked){

    
    switch(monster.name){

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
    var placeholder = document.getElementById("button_"+ monster.i +"_"+ monster.j);
    placeholder.pseudoStyle("");
    isMonsterClicked = false;

  }

}