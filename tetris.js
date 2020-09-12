
//Get the context from the element and make it larger
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
context.scale(20, 20);

//Experiment with the "t" tetromino
//A value of 1 shows the shape
const matrix =[
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

//Check for a collision of a tetromino piece (player) with the the logical representation of pieces (arena)
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos]
    for (let y = 0; y < m.length; ++y){
        for (let x = 0; x < m[y].length; ++x){
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                arena[y+ o.y][x + o.x]) !== 0) {
                    return true;
                }
        }
    }
    return false;
}

//Create a new 2 dimensional matrix based on the width and height given as parameters
//Fill it with all zeros
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

//Fill the context space with a black rectangle and draw the matrix
function draw() {
    context.fillStyle = "#000";
    context.fillRect(0,0,canvas.width,canvas.height);
    drawMatrix(player.matrix, player.pos);
}

//For each value of 1 in the tetromino (shape definition), fill the context with a red square
//This makes the shape of the specified tetromino
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x,
                                 y + offset.y, 
                                 1, 1);
            }
        });
    });
}

//Combine the tetromino piece (player) to the logical representation of pieces (arena)
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

//Move the tetromino position down one row
function playerDrop(){
    player.pos.y++;
    //If there is a collision of the tetromino piece (player) with any other tetrominos in the logical representation of pieces (arena), 
    //stop and add the tetromino (player) to the logical representation of pieces (arena) and reset to the top
    if (collide(arena, player)){
        player.pos.y--;
        merge(arena, player);
        player.pos.y = 0;
        //For every collision, show the arena (after the merge) and show the player that was added
        console.log(arena);
        console.log(player);
    }
    //Reset drop counter
    dropCounter = 0;
}
let dropCounter = 0;
//1000 milliseconds (1 second)
let dropInterval = 1000;
let lastTime = 0;

//This function is designed perform the necessary steps to drop the tetromino as expected
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    
    //Drop the tetromino every second
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    //Redraw
    draw();
    requestAnimationFrame(update);
}

//Create  matrix that has 12 columns and 20 rows
const arena = createMatrix(12, 20);

//Declare the "t" tetromino above and it's position (offset)
const player = {
    pos: {x: 2, y: 2},
    matrix: matrix
}

//Player controls, there is no 'up' control
document.addEventListener('keydown', event => {
    if (event.keyCode === 37) { //Left
        player.pos.x--;
        console.log("Left");
    } else if (event.keyCode === 39) { //Right
        player.pos.x++;
        console.log("Right");
    } else if (event.keyCode === 40) { //Down
        playerDrop();
        console.log("Down");
    } 
})

//Start the game
update();