// Adjunk alapértékeket a változókhoz
let canvas = document.getElementById("main-canvas");
let ctx = canvas.getContext("2d");
let gameOverText = document.querySelector(".game-over");
let scoreText = document.getElementById("score");
// Használd a canvas "getAttributumát, hogy a magasságát és szélességét elmentsd"
let canvasHeight = canvas.getAttribute("height");
let canvasWidth = canvas.getAttribute("width");

// Létrehozunk egy "box" változót, beállítjuk 10-re az értékét (ez fogja tárolni
// az alap méretét az almának és a kigyó "egységnyi" testének)
// Deklarálunk egy üres "snake" listát, amiben a testrészei lesznek
// Kell egy "timerId", ami az időzítőt fogja tárolni. Nem kell alapérték neki.
// Deklarálunk egy "apple" elemet, ami indulásként két koordinátát fog tárolni
// (hogy hol legyen az alma induláskor a canvason)

let box = 10;
let timerId;
let apple = { x: 10, y: 1 };
let score = 0;
let applePos = false;
const snakeBody = [
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 3, y: 1 },
];

const obstacles = [
  { x: 10, y: 5 },
  { x: 20, y: 5 },
];

//Irányok kezeléséhez segítségnek megadunk egy 2D listát, amit később fel tudunk használni:
// Ha x tengely mentén jobbra megyünk egy egységnyit ("box"),
// függőlegesen meg nem mozdulunk , akkor a lista első eleme jelenti az aktuális irányt és így tovább

let direction = {
  dx: 0,
  dy: 0, // default down direction
};

// Kezdésnek kitűzünk egy indulási irányt a "directions listából" (itt még nincs mozgás, csak az irányt kitűzzük)
// Ez az actDirection, mint aktuális irány fogja tárolni, hogy merre haladjon (nőjön a kígyó)

// --------------------------- Print Table -----------------------------------------

// Kezdjünk játszani. Hozzunk létre egy start Game function-t.
// Hozzunk létre egy lokális Objektumot "snakeBody", ami két koordinátát fog tárolni.
// egyik property neve legyen: widthP, (szélességi pozició)
// másik property neve: heightP
// Így adjuk meg, hogy hol helyezkedjen el az induláskor.
// Használjuk egységként a 'box' értéket:
// Pl: let snakeBody = { widthP: box, heightP: 0};
// Adjuk hozzá a snakeListánkhoz, mint induló "testrész";
// Itt fogjuk elindítani az időzítőt is kicsit később
// Még ebben a metódusban hívjunk meg egy "printTable()" függvényt,
// Amit a következőkben fogunk megírni

const draw = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "green";
  // ctx.fillRect(20,20,10,10); // (x, y, width, height)
  snakeBody.forEach((coord) => {
    ctx.fillRect(coord.x * 10, coord.y * 10, box, box);
  });

  // draw first apple
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * 10, apple.y * 10, box, box);
};

//Első lépésnek meg kell rajzolni a világos zöld táblát, majd utána rá kell rajzolni
// a piros színű almát (haszáljuk a két induló értéket, koordinátaként,
// majd a box egységet, hogy mekkora méretre fesse fel az almát => fillRect).
// Végül a kigyó sötétzöld testét is meg kell rajzolni.
// Bár most még csak egy testrésze van, mindig ciklussal végig kell menni rajta és "felül"
// festeni a canvast(ctx.fillRect)

// -------------------------- Move snake, move!! -------------------------------

// Kezdjünk el mozogni.
// Hozzunk létre egy moveSnake függvényt, ami mozgatni fogja a kígyót.
// Elsőnek állapítsuk meg, "hol a feje a kígyónak". => a snake lista utolsó eleme lesz.
// Ha majd eszik a kigyó mindig nőni fog a lista a "feje" felé. Mentsük ki egy lokális
// változóba pl: 'headOfSnake'
// Hozzunk létre még egy lokális változót: "newHeadPosition"
// Ki kell számolnunk és ebbe kell belementenünk a két új koordinátát a headOfSnake és
// a korábban létrehozott actDirection megfelelő értékeivel. (két elemű lista)
// Miután kiszámoltuk, megvannak a koordináták, hozzunk létre egy:
// "newBodyPart" Objektumot, hasonlóan mint a startGame-ben, adjuk át a megfelelő position-ket
// a newHeadPosition-ből.
// Már csak hozzá kell adnunk a snake listához az új testrészt. Végül vegyük ki az első elemet
// a "kígyó farok részét". => shift() metódus .
// Így gyakorlatilag eltoljuk egy irányba a kígyót
// Megváltoztak a kigyó testjének koordinátái, újra kell rajzolnunk a táblát.
// Hívjuk meg a függvény végén a már megírt printTable() metódust, hogy az
// újra rajzolja a táblát a kígyó új testrészével együtt
// Még most nem láthatunk változást, hiszen a moveSnake függvényt is meg kell hívni
// De előtte még....

const move = () => {
  const oldHead = snakeBody[snakeBody.length - 1];
  const newHead = {
    x: oldHead.x + direction.dx,
    y: oldHead.y + direction.dy,
  };
  snakeBody.shift(); //remove first element
  snakeBody.push(newHead); // add the new head
  if (hasCollision()) {
    clearInterval(timerId);
    gameOverText.classList.remove("hide");
  }
  checkEating();
  draw();
  drawObstacles();
};

// Hozzunk létre egy EventListener-t, ami a billentyűk leütését figyeli és ennek megfelelően
// változtatja az "actDirection" irányát.
// Segítségül egy iránynak megírtuk

document.addEventListener("DOMContentLoaded", () => {
  draw();

  document.querySelector("#stop-game-btn").addEventListener("click", () => {
    clearInterval(timerId);
  });

  document.querySelector("#start-game-btn").addEventListener("click", () => {
    timerId = setInterval(move, 150);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp") {
    event.preventDefault();
    direction.dx = 0;
    direction.dy = -1;
  }
  if (event.code === "ArrowDown") {
    event.preventDefault();
    direction.dx = 0;
    direction.dy = 1;
  }
  if (event.code === "ArrowRight") {
    event.preventDefault();
    direction.dx = 1;
    direction.dy = 0;
  }
  if (event.code === "ArrowLeft") {
    event.preventDefault();
    direction.dx = -1;
    direction.dy = 0;
  }
});

// Ha most mindent jól csináltunk, akkor a nyilak leütésének megfelelően mindig változni
// fog az aktuális irány. Ideje élesítenünk a moveSnake() függvényt.
// Nincs már másra szükség, mint a startGame()-ben hozzunk létre egy setIntervalt, mondjuk 200ms-al
// adjuk meg callback function-ként a moveSnake-et:
// timerId = setInterval(moveSnake, 200);
// Mentés után már mozogni kell a pici kígyónknak a billentyűzet segítségével
// Addig ne menj tovább, amíg ezt a működést nem sikerül összehozni

// ---------------------------------------- Az Evés ----------------------------------

// Kezdjük el táplálni a háziállatunkat
// Létrehozzuk az étkezést ellenörző metódusunkat
// Mentsük ki egy lokális változóba a kigyó fejét (utolsó elem a listában)
// Nézzük meg, hogy mindkét koordináta megegyezik e a fej és alma esetén(egy helyen vannak)
// Ha igen, készítsünk egy "newBody" Objektet az alma koordinátáival
// Majd adjuk hozzá a kígyó testéhez, hogy nőni tudjon.
// helyezzük el az almát egy random helyen, vagyis generáljunk random koordinátát neki
function checkEating() {
  const snakeHead = snakeBody[snakeBody.length - 1];
  if (snakeHead.x === apple.x && snakeHead.y === apple.y) {
    const newHead = {
      x: apple.x,
      y: apple.y,
    };
    const newObstacle = { x: rnd(canvasWidth / 10), y: rnd(canvasHeight / 10) };
    obstacles.push(newObstacle);
    applePos = false;
    do {
      renderApple();
      for (let i = 0; i < obstacles.length - 1; i++) {
        if (apple.x !== obstacles[i].x && apple.y !== obstacles[i].y) {
          applePos = true;
        }
      }
    } while (!applePos);

    // ctx.fillStyle = "red";
    // ctx.fillRect(apple.x * 10, apple.y * 10, box, box);
    snakeBody.push(newHead); // add the new head
    score++;
    scoreText.innerText = score;
  }
}

function renderApple() {
  apple.x = rnd(canvasWidth / 10);
  apple.y = rnd(canvasHeight / 10);
}

const rnd = (max) => {
  return Math.floor(Math.random() * max - 1);
};
// Még be kell kötnünk a megfelelő helyre a checkEating()-et.
// Hívjuk meg a moveSnake()-ben legfelül. Most odáig kellett eljutnunk, hogy
// mozog a kígyó, nő a teste, ha almára lép, és random helyen jelenik meg az alma
// Nincs sok hátra. Ideje az ütközéseket ellenőrizni

// ----------------------------------- Az Ütközés ---------------------------------

// Ismét a fejét kell megvizsgálnunk.
// Mentsük ki egy változóba a fej objektumát. Nézzük meg, hogy a fej koordinátái
// túlnyúlnak e a canvas méretén (canvasWidth, canvasHeight változó)
// vagy bármelyik testrészének koordinátájával megegyeznek. Akkor térjen vissza true értékkel
// különben false.
// Megj: figyeljünk arra, hogy a fej önmagával történő vizsgálatát elkerüljük
function hasCollision() {
  const snakeHead = snakeBody[snakeBody.length - 1];
  let collision = false;
  if (
    snakeHead.x < 0 ||
    snakeHead.x > canvasWidth / 10 ||
    snakeHead.y < 0 ||
    snakeHead.y > canvasHeight / 10
  )
    collision = true;

  for (let i = 0; i < snakeBody.length - 2; i++) {
    if (snakeBody[i].x === snakeHead.x && snakeBody[i].y === snakeHead.y)
      collision = true;
  }

  for (let i = 0; i < obstacles.length - 1; i++) {
    if (obstacles[i].x === snakeHead.x && obstacles[i].y === snakeHead.y)
      collision = true;
  }

  return collision;
}

function drawObstacles() {
  ctx.fillStyle = "blue";
  for (let i = 0; i < obstacles.length - 1; i++) {
    ctx.fillRect(obstacles[i].x * 10, obstacles[i].y * 10, box, box);
  }
}

// Már csak be kell kötnünk. Hívjuk meg legeslegfelül a moveSnake()-ben.
// Ha true értékkel tér vissza vége a játéknak. Töröljük a setInterval-t
// Valami üzenetet jelenítsünk meg a felhasználónak..
// Végére értünk! Gratulálunk, ha eljutottál idáig!
// További fejlesztési lehetőségek: Pontok kiíratása, ahogy nő a kígyó egyre gyorsabban halad

// ----------------------------------- GAME OVER -------------------------------------
