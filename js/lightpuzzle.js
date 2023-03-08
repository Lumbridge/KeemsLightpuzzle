
let rowSize = 3;

$(function () {

    initGrid(rowSize);

    resetButtons();

    $(document).on("click", ".lightbox", handleButtonClick);

    $(document).on("click", "#reset", resetButtons);
});

function resetButtons() {
    var buttons = $(".lightbox");
    var hit2 = false;
    while(!hit2){
        $.each(buttons, function (index, button) { 
            var coinflip = getRndInteger(1, 3);
            if (coinflip == 1) {
                $(button).toggleClass("on");
            }
            else {
                hit2 = true;
            }
        });
    }        
}

function initGrid(rowSize) {

    var $container = $("#puzzleContainer");

    var puzzleButtons = createPuzzleButtons(rowSize);

    drawGrid($container, puzzleButtons);

}

function drawGrid($container, buttons) {

    var rowCount = Math.sqrt(buttons.length);

    for (var i = 0; i < rowCount; i++) {

        var row = $(`<div id="row${i}" class="row justify-content-center align-items-center mt-5"></div>`);

        $container.append(row);

        // calculate the start of the j loop
        var start = rowCount * i;

        // goes from 012 345 678 ... ... etc
        for (var j = start; j < start + rowCount; j++) {

            // create a column to put our button in
            var col = $(`<div id="col${j}" class="col"></div>`);

            // calculate side
            var left = j == start;
            var right = j == start + rowCount - 1;
            var top = i == 0;
            var bottom = i == rowCount - 1;

            // check if the column is on an edge or not   
            var isOnVerticalEdge = left || right;
            var isOnHorizontalEdge = top || bottom;

            // render button if on edge
            if (isOnVerticalEdge || isOnHorizontalEdge) {

                var button = addButtonPositonMarkup(buttons[j], left, right, top, bottom);

                col.append(button);
            }else{
                col.append($('<img class="furryimg" width="100" src="img/furry.jpg">'))
            }

            // add column to row
            $(`#row${i}`).append(col);
        }
    }
}

function createPuzzleButtons(rowSize) {

    var puzzleButtons = [];

    for (var i = 0; i < rowSize * rowSize; i++) {

        var coinflip = getRndInteger(1, 3);

        var button;

        if (coinflip == 1) {
            button = $(`<button id="button${i}" data-sequence="${i}" class="lightbox btn btn-lg">X</button>`);
        } else {
            button = $(`<button id="button${i}" data-sequence="${i}" class="lightbox btn btn-lg on">X</button>`);
        }

        puzzleButtons.push(button);
    }

    return puzzleButtons;
}

function addButtonPositonMarkup(button, left, right, top, bottom) {

    var isOnVerticalEdge = left || right;
    var isOnHorizontalEdge = top || bottom;

    // add position data to button markup
    if (isOnHorizontalEdge && isOnVerticalEdge) {
        if (top) {
            if (left) {
                $(button).attr("data-pos", "top-left");
            }
            else {
                $(button).attr("data-pos", "top-right");
            }
        }
        else if (bottom) {
            if (left) {
                $(button).attr("data-pos", "bottom-left");
            }
            else {
                $(button).attr("data-pos", "bottom-right");
            }
        }
    } else if (isOnHorizontalEdge) {
        $(button).attr("data-pos", "horizontal");
    } else if (isOnVerticalEdge) {
        $(button).attr("data-pos", "vertical");
    }

    return button;
}

function handleButtonClick(e){
    var $clicked = $(e.target).closest("button");

    $clicked.toggleClass("on");

    var positionAttr = $clicked.data("pos");

    var currentButtonSequence = $clicked.data("sequence");

    switch(positionAttr) {
        case "top-left":
            var rightButton = $(`#button${currentButtonSequence + 1}`);
            var belowButton = $(`#button${currentButtonSequence + rowSize}`);
            rightButton.toggleClass("on");
            belowButton.toggleClass("on");
            break;
        case "top-right":
            var leftButton = $(`#button${currentButtonSequence - 1}`);
            var belowButton = $(`#button${currentButtonSequence + rowSize}`);
            leftButton.toggleClass("on");
            belowButton.toggleClass("on");
            break;
        case "bottom-left":
            var rightButton = $(`#button${currentButtonSequence + 1}`);
            var aboveButton = $(`#button${currentButtonSequence - rowSize}`);
            rightButton.toggleClass("on");
            aboveButton.toggleClass("on");
            break;
        case "bottom-right":
            var leftButton = $(`#button${currentButtonSequence - 1}`);
            var aboveButton = $(`#button${currentButtonSequence - rowSize}`);
            leftButton.toggleClass("on");
            aboveButton.toggleClass("on");
            break;
        case "vertical":
            var belowButton = $(`#button${currentButtonSequence + rowSize}`);
            var aboveButton = $(`#button${currentButtonSequence - rowSize}`);
            belowButton.toggleClass("on");
            aboveButton.toggleClass("on");
            break;
        case "horizontal":
            var leftButton = $(`#button${currentButtonSequence - 1}`);
            var rightButton = $(`#button${currentButtonSequence + 1}`);
            leftButton.toggleClass("on");
            rightButton.toggleClass("on");
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}