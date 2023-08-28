//Maze grid 
const grid = document.querySelector("#grid")
//nxn maze
const n = 10;
//split the grid into n row and columns
grid.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";
grid.style.gridTemplateRows = "repeat(10, 1fr)";
//Maintain the leader of each vertex
let leadersMap = new Map()
//Maintain the follower of each vertex
let followersMap = new Map();
//Maintain a list of the edges
let edgeList = [];
//Initialize the 2 maps, list of edges, and squares
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        //create a square and provide it with: class and id
        const square = document.createElement("div");
        square.classList.add("squares")
        square.id = "s" + i + "" + j;
        grid.appendChild(square)
        //initialize maps
        leadersMap.set("s" + i + "" + j, "s" + i + "" + j)
        followersMap.set("s" + i + "" + j, [])
        //initialize edge list
        if (i != 0) {
            if (!edgeList.includes([(i - 1) + "" + j, i + "" + j])) {
                edgeList.push([(i - 1) + "" + j, i + "" + j]);
            }
        }
        if (i != n - 1) {
            if (!edgeList.includes([i + "" + j, (i + 1) + "" + j])) {
                edgeList.push([i + "" + j, (i + 1) + "" + j]);
            }
        }
        if (j != 0) {
            if (!edgeList.includes([i + "" + (j - 1), i + "" + j])) {
                edgeList.push([i + "" + (j - 1), i + "" + j]);
            }
        }
        if (j != n - 1) {
            if (!edgeList.includes([i + "" + j, i + "" + (j + 1)])) {
                edgeList.push([i + "" + j, i + "" + (j + 1)]);
            }
        }
    }
}

//Labeling Start and Goal Squares
// Get the start square element
const i = Math.floor(Math.random() * 10);
const j = Math.floor(Math.random() * 10);
const startSquare = document.getElementById("s" + i + "" + j);
startSquare.classList.add("start-square");
startSquare.textContent = "START"
// Get the goal square element
let a, b;
do {
    a = Math.floor(Math.random() * 10);
    b = Math.floor(Math.random() * 10);
}
while (a == i && b == j)
const endSquare = document.getElementById("s" + a + "" + b);
endSquare.classList.add("end-square");
endSquare.textContent = "GOAL"

//randomly sort and assign colors according to weight
sortColor();
function sortColor() {
    edgeList.sort(() => Math.random() - 0.5);
    const change = 255 / (edgeList.length - 1);
    edgeList.forEach((edge, i) => {
        const firstSquare = "#s" + edge[0];
        const secondSquare = "#s" + edge[1];
        //color the edge connecting the 2
        const color = "rgb(" + (255 - i * change) + ",0," + (i * change) + ")";

        if (parseInt(firstSquare[2]) < parseInt(secondSquare[2])) {
            document.querySelector(firstSquare).style.borderBottomColor = color;
            document.querySelector(secondSquare).style.borderTopColor = color;
        }
        else if (parseInt(firstSquare[3]) < parseInt(secondSquare[3])) {

            document.querySelector(firstSquare).style.borderRightColor = color;
            document.querySelector(secondSquare).style.borderLeftColor = color;
        }
        else if (parseInt(firstSquare[2]) > parseInt(secondSquare[2])) {
            document.querySelector(firstSquare).style.borderTopColor = color;
            document.querySelector(secondSquare).style.borderBottomColor = color;
        }
        else {
            document.querySelector(firstSquare).style.borderLeftColor = color;
            document.querySelector(secondSquare).style.borderRightColor = color;
        }
    })
}
//One step of the algorithm 
function step() {
    // select edge at random
    const curEdge = edgeList.shift();
    // const curEdge = edgeList.splice(Math.floor(Math.random() * edgeList.length), 1);
    console.log(curEdge)
    //identify the 2 squares that the edge connects
    const tileOne = "s" + curEdge[0];
    const tileTwo = "s" + curEdge[1];

    //check that the two squares belong to different components
    if (leadersMap.get(tileOne) != leadersMap.get(tileTwo)) {
        //check that the first sqaure's leader has more followers
        if (followersMap.get(leadersMap.get(tileOne)).length >= followersMap.get(leadersMap.get(tileTwo)).length) {
            //make the second square's leader a follower of the first square's leader
            followersMap.set(leadersMap.get(tileOne), followersMap.get(leadersMap.get(tileOne)).concat(leadersMap.get(tileTwo)))
            //make the second square's leader's followers'  followers of the first square's leader                
            followersMap.set(leadersMap.get(tileOne), followersMap.get(leadersMap.get(tileOne)).concat(followersMap.get(leadersMap.get(tileTwo))));
            //make the second square's leader's leader the first square's leader            
            leadersMap.set(leadersMap.get(tileTwo), leadersMap.get(tileOne));
            //make the second square's leader's followers's leader the first square's leader
            followersMap.get(leadersMap.get(tileTwo)).forEach(element => leadersMap.set(element, leadersMap.get(tileOne)));

        }
        // Do the same thing but the second square's leader has more followers
        else {
            followersMap.set(leadersMap.get(tileTwo), followersMap.get(leadersMap.get(tileTwo)).concat(leadersMap.get(tileOne)))

            followersMap.set(leadersMap.get(tileTwo), followersMap.get(leadersMap.get(tileTwo)).concat(followersMap.get(leadersMap.get(tileOne))));

            leadersMap.set(leadersMap.get(tileOne), leadersMap.get(tileTwo));
            followersMap.get(leadersMap.get(tileOne)).forEach(element => leadersMap.set(element, leadersMap.get(tileTwo)));

        }

        //Get the 2 squares
        const squareOne = document.querySelector("#" + tileOne);
        const squareTwo = document.querySelector("#" + tileTwo);
        //make the edge connecting the 2 white
        if (parseInt(tileOne[1]) < parseInt(tileTwo[1])) {
            squareOne.style.borderBottomColor = "white";
            squareTwo.style.borderTopColor = "white";
        }
        else if (parseInt(tileOne[2]) < parseInt(tileTwo[2])) {

            squareOne.style.borderRightColor = "white";
            squareTwo.style.borderLeftColor = "white";
        }
        else if (parseInt(tileOne[1]) > parseInt(tileTwo[1])) {
            squareOne.style.borderTopColor = "white";
            squareTwo.style.borderBottomColor = "white";
        }
        else {
            squareOne.style.borderLeftColor = "white";
            squareTwo.style.borderRightColor = "white";
        }


    }
}

//variable to check if the animation is still running
let curAnimation = null;
//function to animate the algorithm
function animateK() {
    if (curAnimation == null) {
        //call the animatestep() function every 30ms
        curAnimation = setInterval(() => {
            animateStep();
        }, 30);
    }
}

function animateStep() {
    //while there are edges remaining call the step function otherwise stopanimation()
    if (edgeList.length) {
        step();
    } else {
        stopAnimation();
    }
}
//stop the call to animatestep and change curanimation back to null.
function stopAnimation() {
    clearInterval(curAnimation);
    curAnimation = null;
}
// function to reset the graph
function resetK() {
    // stop animation if one is running
    stopAnimation();
    //reset 2 maps
    leadersMap = new Map()
    followersMap = new Map();

    //empty the grid
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

    //reset edge list
    edgeList = [];
    //repeat the process of initalization at the start
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const square = document.createElement("div");
            square.classList.add("squares")
            square.id = "s" + i + "" + j;
            grid.appendChild(square)
            leadersMap.set("s" + i + "" + j, "s" + i + "" + j)
            followersMap.set("s" + i + "" + j, [])

            if (i != 0) {
                if (!edgeList.includes([(i - 1) + "" + j, i + "" + j])) {
                    edgeList.push([(i - 1) + "" + j, i + "" + j]);
                }
            }
            if (i != n - 1) {
                if (!edgeList.includes([i + "" + j, (i + 1) + "" + j])) {
                    edgeList.push([i + "" + j, (i + 1) + "" + j]);
                }
            }
            if (j != 0) {
                if (!edgeList.includes([i + "" + (j - 1), i + "" + j])) {
                    edgeList.push([i + "" + (j - 1), i + "" + j]);
                }
            }
            if (j != n - 1) {
                if (!edgeList.includes([i + "" + j, i + "" + (j + 1)])) {
                    edgeList.push([i + "" + j, i + "" + (j + 1)]);
                }
            }
        }
    }
    //sorting and coloring
    sortColor();
    //Labeling Start and Goal Squares
    // Get the start square element
    const i = Math.floor(Math.random() * 10);
    const j = Math.floor(Math.random() * 10);
    const startSquare = document.getElementById("s" + i + "" + j);
    startSquare.classList.add("start-square");
    startSquare.textContent = "START"
    // Get the goal square element
    let a, b;
    do {
        a = Math.floor(Math.random() * 10);
        b = Math.floor(Math.random() * 10);
    }
    while (a == i && b == j)
    const endSquare = document.getElementById("s" + a + "" + b);
    endSquare.classList.add("end-square");
    endSquare.textContent = "GOAL"

}


