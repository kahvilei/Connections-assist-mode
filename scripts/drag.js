// Get all the elements with the common class
//get play button by id

const playButton = document.getElementById("play-button");
const board = document.getElementById("board");

let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    let oldValue = mutation.oldValue;
    let newValue = mutation.target.textContent;
    if (oldValue !== newValue) {
      const elements = document.querySelectorAll("#board .item");

      const resetPosition = (e) => {
        let element = e.target;
        element.style.zIndex = 2;
        element.style.position = "absolute";
        element.style.left = null;
        element.style.top = null;
      };

      var mouseDown = 0;
      document.body.addEventListener("pointerdown", function () {
        ++mouseDown;
      });
      document.body.addEventListener("pointerup", function () {
        --mouseDown;
      });

      var dragging = false;

      // Add a listener to the elements that will start dragging them when the user clicks and drags them
      elements.forEach((element) => {

        element.addEventListener("pointerdown", function (event) {

          //get orginal col and row from the class list of the element
          let originalCol = element.classList[1].split("-")[2];
          let originalRow = element.classList[2].split("-")[2];

          let newCol = originalCol;
          let newRow = originalRow;

          let prevCol = originalCol;
          let prevRow = originalRow;

          let currentHoriPos = Math.floor(
            (event.pageX - board.offsetLeft) / 100
          );
          let currentVertPos = Math.floor(
            (event.pageY - board.offsetTop) / 100
          );

          function moveAt(pageX, pageY) {
            element.style.position = "fixed";
            element.style.zIndex = 1000;
            element.style.left = pageX - element.offsetWidth / 2 + "px";
            element.style.top = pageY - element.offsetHeight / 2 + "px";
          }

          // move our absolutely positioned element under the pointer
     

          //set a small delay before the element is moved to allow the user to click on the element without moving it

          function onMouseMove(event) {
            dragging = true;
            moveAt(event.pageX, event.pageY);
            //get current vertical and horizontal position of the mouse on the board
            currentHoriPos =
              (event.pageX - board.offsetLeft) / board.scrollWidth;
            currentVertPos =
              (event.pageY - board.offsetTop) / board.scrollHeight;

            prevCol = newCol;
            prevRow = newRow;

            //caculate new row and col based on the mouse position, row is the vertical position and col is the horizontal position.
            if (currentHoriPos < 0.25) {
              newCol = 0;
            }
            if (currentHoriPos >= 0.25 && currentHoriPos < 0.5) {
              newCol = 1;
            }
            if (currentHoriPos >= 0.5 && currentHoriPos < 0.75) {
              newCol = 2;
            }
            if (currentHoriPos > 0.75) {
              newCol = 3;
            }

            if (currentVertPos < 0.25) {
              newRow = 0;
            }
            if (currentVertPos >= 0.25 && currentVertPos < 0.5) {
              newRow = 1;
            }
            if (currentVertPos >= 0.5 && currentVertPos < 0.75) {
              newRow = 2;
            }
            if (currentVertPos > 0.75) {
              newRow = 3;
            }

            //select the element in the new position and add the "shrunk" class to it if it is not already there
            let newElement = document.querySelector(
              ".item-row-" + newRow + ".item-col-" + newCol
            );
            if (!newElement.classList.contains("shrunk")) {
              newElement.classList.add("shrunk");
            }

            if (prevCol != newCol || prevRow != newRow) {
              console.log("new row: " + newRow + " new col: " + newCol);
              //remove the "shrunk" class from the element in the previous position if it is not already gone
              let prevElement = document.querySelector(
                ".item-row-" + prevRow + ".item-col-" + prevCol
              );
              if (prevElement.classList.contains("shrunk")) {
                prevElement.classList.remove("shrunk");
              }
            }
          }

          // (2) move the element on mousemove
          setTimeout(function () {
            //check if mouse is still down, if it is, then add the mousemove event listener
            if (mouseDown > 0) {
            document.addEventListener("pointermove", onMouseMove);
            }
          }, 100);

          // (3) drop the element, remove unneeded handlers
          element.addEventListener("pointerup", function (e) {
            document.removeEventListener("pointermove", onMouseMove);

            //if the new row and col is not the same as the original row and col, then move the element to the new position
            if ((newRow != originalRow || newCol != originalCol) && dragging) {
              //swap the element with the element in the new position
              let newElement = document.querySelector(
                ".item-row-" + newRow + ".item-col-" + newCol
              );
              console.log(
                newElement
              );
              //check if element or new element has the class "selected"
              let origSelected = false;
              let newSelected = false;
              if (element.classList.contains("selected")) {
                origSelected = true;
              }
              if (newElement.classList.contains("selected")) {
                newSelected = true;
              }
              let temp = "item" + " item-row-" + newRow + " item-col-" + newCol;
              //set the new elements top and left transition to .2s to make the transition smooth
              newElement.style.transition = ".2s";
              element.style.transition = null;
              newElement.classList = element.classList;
              element.classList = temp;

              //if the element or new element had the class "selected", then add that class back to each of them
              if (origSelected) {
                element.classList.add("selected");
              }else if(element.classList.contains("selected")){
                element.classList.remove("selected");
              }
              if (newSelected) {
                newElement.classList.add("selected");
              }else if(newElement.classList.contains("selected")){
                newElement.classList.remove("selected");
              }

              dragging = false;

              //after the length of the transition, remove the transition
              setTimeout(function () {
                newElement.style.transition = null;
                element.style.transition = null;
              }
              , 200);
            }
            //reset the position of the element to no longer be movable
            resetPosition(e);
            element.removeEventListener("pointerup", null);
          });
      });
      });
    }
  });
});

observer.observe(board, {
  characterDataOldValue: true,
  subtree: true,
  childList: true,
  characterData: true,
});
