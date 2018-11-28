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




//old inRange()

function inRange(curr_i, curr_j, monster){
  //monsterPos[0] == i
  //monsterPos[1] == j
  switch(monster.name){

    case "pikachu":
    case "pikachu_flipped":
      return curr_i == currMonster.i || curr_j == currMonster.j;
      break;

    case "squirtle":
    case "squirtle_flipped":
      break;

    case "bulbasaur":
    case "bulbasaur_flipped":
      return (Math.abs(curr_i - currMonster.i) <= 1) && (Math.abs(curr_j - currMonster.j) <= 1) && (curr_i == currMonster.i || curr_j == currMonster.j);
      break;

    case "charmander":
    case "charmander_flipped":
      break;

    default:
      break;
    }
}


//old skillButtonClicked

function skillButtonClicked(player){
  if(currMonster.player == player){  //only curr turn monster can use skill
    if(currMonster.energy == 100){
      switch(currMonster.name){
        case "pikachu":
        case "pikachu_flipped":
          
          break;

        case "squirtle":
        case "squirtle_flipped":

          break;

        case "bulbasaur":
        case "bulbasaur_flipped":
          var i = currMonster.i;
          var up_i = i - 1;
          var down_i = i + 1;
          var j = currMonster.j;
          var left_j = j - 1;
          var right_j = j + 1;

          var upButton = document.getElementById("button_"+ up_i +"_"+ j);
          var downButton = document.getElementById("button_"+ down_i +"_"+ j);
          var leftButton = document.getElementById("button_"+ i +"_"+ left_j);
          var rightButton = document.getElementById("button_"+ i +"_"+ right_j);
          displaySkillHelper(upButton, "leaf");  //show the skill image layer
          displaySkillHelper(downButton, "leaf");
          displaySkillHelper(leftButton, "leaf");
          displaySkillHelper(rightButton, "leaf");
/*
          // vertical/horizontal
          setButtonImage(up_i, j, "leaf"); //initilize the image at the very beginning
          setButtonImage(down_i, j, "leaf");
          setButtonImage(i, left_j, "leaf");
          setButtonImage(i, right_j, "leaf");

          //diagonal
          setButtonImage(up_i, left_j, "leaf");
          setButtonImage(up_i, right_j, "leaf");
          setButtonImage(down_i, left_j, "leaf");
          setButtonImage(down_i, right_j, "leaf");
*/
          var playAnimation = setInterval(animation, 100); 

          function animation() {
            if(Math.abs(up_i - i) == 4){ //finish
/*
              // vertical/horizontal
              setButtonImage(up_i, j, getButtonImage(up_i, j));
              setButtonImage(down_i, j, getButtonImage(down_i, j));
              setButtonImage(i, left_j, getButtonImage(i, left_j));
              setButtonImage(i, right_j, getButtonImage(i, right_j));

              //diagonal
              setButtonImage(up_i, left_j, getButtonImage(up_i, left_j));
              setButtonImage(up_i, right_j, getButtonImage(up_i, right_j));
              setButtonImage(down_i, left_j, getButtonImage(down_i, left_j));
              setButtonImage(down_i, right_j, getButtonImage(down_i, right_j));
*/
              var placeholder = document.getElementById("button_"+ i +"_"+ j);
              placeholder.pseudoStyle("");  //remove the red layers
              clearInterval(playAnimation); //stop the animation
            }else{
              up_i--;
              down_i++;
              left_j--;
              right_j++;

/*
              // vertical/horizontal
              if(swapSkillImage(up_i+1, j, up_i, j) == "failed"){ //move the image
                setButtonImage(up_i+1, j, "grid");  //if failed, which means border is exceeded, set the image to grid(default)
              }
              if(swapSkillImage(down_i-1, j, down_i, j) == "failed"){
                setButtonImage(down_i-1, j, "grid");
              } 
              if(swapSkillImage(i, left_j+1, i, left_j) == "failed"){
                setButtonImage(i, left_j+1, "grid");
              }
              if(swapSkillImage(i, right_j-1, i, right_j) == "failed"){
                setButtonImage(i, right_j-1, "grid");
              }


              //diagonal
              if(swapSkillImage(up_i+1, left_j+1, up_i, left_j) == "failed"){
                setButtonImage(up_i+1, left_j+1, "grid");
              } 
              if(swapSkillImage(up_i+1, right_j-1, up_i, right_j) == "failed"){
                setButtonImage(up_i+1, right_j-1, "grid");
              } 
              if(swapSkillImage(down_i-1, left_j+1, down_i, left_j) == "failed"){
                setButtonImage(down_i-1, left_j+1, "grid");
              }
              if(swapSkillImage(down_i-1, right_j-1, down_i, right_j) == "failed"){
                setButtonImage(down_i-1, right_j-1, "grid");
              } 
*/

            }//end of else
          }//end of animation
          
       
          break;

        case "charmander":
        case "charmander_flipped":
          break;

        default:
          break;
      }


      }
  }
}