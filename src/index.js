import AStar from "./a-star";
import Heuristics from "./heuristics";
const aStar = new AStar();

const backgroundFill = "#f1f1f1";
const visitedColor = "lightblue";
const targetColor = "gold";
const startColor = "green";
const pathColor = "cornflowerblue";

let grid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let start = { x: 9, y: 3 };
let target = { x: 0, y: 7 };

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  grid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  start = { x: 10, y: 3 };
  target = { x: 0, y: 7 };
}

let heuristic = Heuristics.manhattan;

let gFunction = null;

let intervalId;

let addObstacle = (x, y) => {
  halt();
  if (grid[x][y] == 1) {
    grid[x][y] = 0;
    tiles[x][y].style.backgroundColor = backgroundFill;
  } else {
    grid[x][y] = 1;
    tiles[x][y].style.backgroundColor = "gray";
  }
};

// TODO: reconsider
let mouseDown = false;
document.body.onmousedown = function() {
  mouseDown = true;
};
document.body.onmouseup = function() {
  mouseDown = false;
};

// Grid creation
let tiles = [];
grid.forEach((row, rowIndex) => {
  let thisRow = [];
  tiles.push(thisRow);
  let rowElement = document.createElement("div");
  rowElement.style.display = "flex";
  document.getElementById("playground").appendChild(rowElement);
  row.forEach((item, itemindex) => {
    let tile = document.createElement("div");
    tile.className = "tile";
    if (item === 1) {
      tile.style.backgroundColor = "gray";
    }

    tile.x = rowIndex;
    tile.y = itemindex;

    thisRow.push(tile);
    rowElement.appendChild(tile);
  });
});

function paintSearch() {
  console.log(`heuristic: ${heuristic}`);
  console.log(`g: ${gFunction}`);
  let result = aStar.search(grid, start, target, heuristic, gFunction);
  let { search, path } = result;

  if (search.length == 0) {
    alert("No se encontró una ruta");
    return;
  }
  let paintSearchTile = () => {
    let nextTile = tiles[search[0].x][search[0].y];
    // si no es el nodo target o el inicial, píntalo
    if (
      nextTile != tiles[target.x][target.y] &&
      nextTile != tiles[start.x][start.y]
    ) {
      nextTile.style.backgroundColor = visitedColor;
    }
    search.shift();
    if (search.length == 0) {
      // detener interval
      clearInterval(intervalId);
      paintPath(path);
    }
  };
  intervalId = setInterval(paintSearchTile, 50);
}

function paintPath(path) {
  path.pop(); // para no pintar el target
  path.forEach(element => {
    tiles[element.x][element.y].style.backgroundColor = pathColor;
    let text = document.createElement("p");
    text.className = "innerText";
    text.innerHTML = element.g;
    tiles[element.x][element.y].appendChild(text);
  });
  console.log(path);
}

function selectNewStart() {
  clearPath();
  tiles[start.x][start.y].style.backgroundColor = backgroundFill;
  forAllTiles(tile => {
    tile.onmousedown = () => {
      console.log("New start tile selected");
      tile.style.backgroundColor = startColor;
      start.x = tile.x;
      start.y = tile.y;

      addTileBehavior();
    };
  });
}

function selectNewTarget() {
  clearPath();
  tiles[target.x][target.y].style.backgroundColor = backgroundFill;
  forAllTiles(tile => {
    tile.onmousedown = () => {
      console.log("New target tile selected");
      tile.style.backgroundColor = targetColor;
      target.x = tile.x;
      target.y = tile.y;

      addTileBehavior();
    };
  });
}

function addTileBehavior() {
  forAllTiles(tile => {
    tile.onmousedown = () => addObstacle(tile.x, tile.y);
  });
  tiles[start.x][start.y].onmousedown = selectNewStart;
  tiles[target.x][target.y].onmousedown = selectNewTarget;
}

function paintStartAndTarget() {
  tiles[start.x][start.y].style.backgroundColor = startColor;
  tiles[target.x][target.y].style.backgroundColor = targetColor;
}

function clearPath() {
  forAllTiles(tile => {
    if (
      tile.style.backgroundColor == visitedColor ||
      tile.style.backgroundColor == pathColor
    ) {
      tile.style.backgroundColor = backgroundFill;
    }
    tile.innerHTML = "";
  });
}

function clearGrid() {
  grid.forEach((row, rowIndex) => {
    row.forEach((item, i) => {
      grid[rowIndex][i] = 0;
    });
  });

  forAllTiles(tile => {
    if (tile.style.backgroundColor == "gray") {
      tile.style.backgroundColor = backgroundFill;
    }
  });

  clearPath();
}

function forAllTiles(callback) {
  tiles.forEach(row => {
    row.forEach(element => {
      callback(element);
    });
  });
}

function halt() {
  clearInterval(intervalId);
  clearPath();
}

paintStartAndTarget();
document.getElementById("start-btn").onclick = () => {
  halt();
  paintSearch();
};

document.getElementById("delete-obstacles-btn").onclick = () => {
  halt();
  clearGrid();
};

document.getElementById("dropdown-btn").onclick = () => {
  document.getElementById("heuristic-dropdown").classList.toggle("show");
};

document.getElementById("euclidean-btn").onclick = () => {
  heuristic = Heuristics.euclidean;
  document.getElementById("dropdown-btn").innerHTML = "Euclidiana";
};

document.getElementById("manhattan-btn").onclick = () => {
  heuristic = Heuristics.manhattan;
  document.getElementById("dropdown-btn").innerHTML = "Manhattan";
};

document.getElementById("zero-h-btn").onclick = () => {
  heuristic = Heuristics.zero;
  document.getElementById("dropdown-btn").innerHTML = "Sin heurística";
};

document.getElementById("g-dropdown-btn").onclick = () => {
  document.getElementById("g-dropdown").classList.toggle("show");
};

document.getElementById("normal-g-btn").onclick = () => {
  gFunction = null;
  document.getElementById("g-dropdown-btn").innerHTML = "Recorrido";
};

document.getElementById("one-g-btn").onclick = () => {
  gFunction = 1;
  document.getElementById("g-dropdown-btn").innerHTML = "G: 1";
};

document.getElementById("zero-g-btn").onclick = () => {
  gFunction = 0;
  document.getElementById("g-dropdown-btn").innerHTML = "G: 0";
};

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

addTileBehavior();
