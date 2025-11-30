const matriz = [  
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O',' '],
  [' ','O','*','.','.','.','.','.','.','.','O','.','.','.','.','.','.','.','*','O',' '],
  [' ','O','A','O','O','.','O','O','O','.','O','.','O','O','O','.','O','O','.','O',' '],
  [' ','O','.','O','O','.','O','O','O','.','O','.','O','O','O','B','O','O','.','O',' '],
  [' ','O','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','O',' '],
  [' ','O','.','O','O','.','O','.','O','O','O','O','O','.','O','.','O','O','.','O',' '],
  [' ','O','.','.','.','.','O','.','.','.','O','.','.','.','O','.','.','.','.','O',' '],
  [' ','O','O','O','O','.','O','O','O','.','O','.','O','O','O','.','O','O','O','O',' '],
  [' ',' ',' ',' ','O','.','O','.','.','.','.','','.','.','O','.','O',' ',' ',' ',' '],
  [' ','O','O','O','O','.','O','.','O','O','.','O','O','.','O','.','O','O','O','O',' '],
  ['K','.','.','.','.','.','.','.','O','.','.','.','O','.','.','.','.','.','.','.','K'],
  [' ','O','O','O','O','.','O','.','O','O','O','O','O',' ','O','.','O','O','O','O',' '],
  [' ',' ',' ',' ','O','.','O','.','.','.','.','.','.','.','O','.','O',' ',' ',' ',' '],
  [' ','O','O','O','O','.','O','.','O','O','O','O','O','.','O','.','O','O','O','O',' '],
  [' ','O','.','.','.','.','.','.','.','.','O','.','.','D','.','.','.','.','.','O',' '],
  [' ','O','.','O','O','.','O','O','O','.','O','.','O','O','O','.','O','O','.','O',' '],
  [' ','O','.','.','O','.','.','.','.','.','.','.','.','.','.','.','O','.','.','O',' '],
  [' ','O','O','.','O','.','O','.','O','O','O','O','O','.','O','.','O','.','O','O',' '],
  [' ','O','.','.','.','.','O','.','.','.','O','.','.','.','O','.','.','.','.','O',' '],
  [' ','O','.','O','O','O','O','O','O','.','O','.','O','O','O','O','O','O','.','O',' '],
  [' ','O','*','.','.','.','C','.','.','.','.','.','.','.','.','.','.','.','*','O',' '],
  [' ','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
];
const filas = matriz.length;
const columnas = matriz[0].length;
let matrizObjetos = convertirMatriz(matriz);
let puntuacion = 0;
let fantasmasVulnerables = false;
let tiempoVulnerable = 0;
let juegoActivo = true;
let intervaloVulnerable;

// Inicializar juego
function inicializarJuego() {
  // Solo reiniciar el estado no la matriz
  puntuacion = 0;
  fantasmasVulnerables = false;
  juegoActivo = true;
  
  if (intervaloVulnerable) {
    clearInterval(intervaloVulnerable);
  }
  
  // Colocar personajes en posiciones iniciales
  moverPersonaje('P', 16, 10, 16, 10);
  moverPersonaje('A', 3, 2, 3, 2);
  moverPersonaje('B', 4, 15, 4, 15);
  moverPersonaje('C', 21, 6, 21, 6);
  moverPersonaje('D', 15, 13, 15, 13);
  
  render();
}

// Función para crear una copia del juego para simulaciones
function crearCopiaJuego() {
  return {
    matrizObjetos: JSON.parse(JSON.stringify(matrizObjetos)),
    puntuacion: 0,
    fantasmasVulnerables: false,
    juegoActivo: true,
    tiempoVulnerable: 0
  };
}

function convertirMatriz(matrizOriginal) {
  return matrizOriginal.map((fila, i) => 
    fila.map((celda, j) => {
      const esPersonaje = ['P','A','B','C','D'].includes(celda);
      const esPelletEspecial = celda === '*';
      const esPuntoNormal = celda === '.';
      
      return {
        base: esPersonaje ? ' ' : (esPelletEspecial ? '.' : celda),
        personajes: esPersonaje ? [celda] : [],
        pelletEspecial: esPelletEspecial,
        puntoNormal: esPuntoNormal
      };
    })
  );
}

function getCeldaVisual(celda) {
  if (!celda) 
    return 'O';
  if (celda.personajes.includes('P')) 
    return 'P';
  const fantasmas = celda.personajes.filter(p => ['A','B','C','D'].includes(p));
  if (fantasmas.length > 0) 
    return fantasmas[0];
  return celda.base;
}

function puedeMoverse(x, y, matrizSimulacion = matrizObjetos) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) 
    return false;
  const celda = matrizSimulacion[x][y];
  if (!celda) 
    return false;
  const celdaVisual = getCeldaVisual(celda);
  return celdaVisual !== 'O' && celdaVisual !== 'S';
}

// Render
const game = document.getElementById('game');

function render() {
  if (!game) return;
  
  game.style.gridTemplateColumns = `repeat(${columnas}, 20px)`;
  game.style.gridTemplateRows = `repeat(${filas}, 20px)`;
  game.innerHTML = '';
  
  matrizObjetos.forEach((fila, i) => {
    fila.forEach((celdaObj, j) => {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      
      const celdaVisual = getCeldaVisual(celdaObj);
      
      if (celdaVisual === 'O') tile.classList.add('wall');
      else if (celdaVisual === '.' && (celdaObj.pelletEspecial || celdaObj.puntoNormal)) {
        tile.classList.add('path');
        const dot = document.createElement('div');
        if (celdaObj.pelletEspecial) {
          dot.classList.add('pellet-especial');
        } else {
          dot.classList.add('dot');
        }
        tile.appendChild(dot);
      }
      else if (celdaVisual === ' ') 
        tile.classList.add('empty');
      else if (celdaVisual === 'P') 
        tile.classList.add('pacman');
      else if (['A','B','C','D'].includes(celdaVisual)) {
        const ghost = document.createElement('div');
        if (fantasmasVulnerables) {
          ghost.classList.add('ghost', 'vulnerable');
        } else {
          ghost.classList.add('ghost', celdaVisual);
        }
        const eyeL = document.createElement('div');
        eyeL.classList.add('ghost-eye','left');
        const eyeR = document.createElement('div');
        eyeR.classList.add('ghost-eye','right');
        ghost.appendChild(eyeL); ghost.appendChild(eyeR);
        tile.appendChild(ghost);
      }
      else if (celdaVisual === 'K') tile.classList.add('empty');
      game.appendChild(tile);
    });
  });

  if (document.getElementById('puntuacion')) {
    document.getElementById('puntuacion').textContent = `Puntuación: ${puntuacion}`;
  }
  if (document.getElementById('estado')) {
    document.getElementById('estado').textContent = 
      fantasmasVulnerables ? `¡Fantasmas Vulnerables! ${tiempoVulnerable}s` : 'Demo del Mejor Individuo';
  }
}

// Movimiento de personajes simulación/ivsual
function moverPersonajeSimulacion(personaje, xActual, yActual, xNuevo, yNuevo, estadoSimulacion) {
  if (!estadoSimulacion.juegoActivo) return;
  
  if (xActual < 0 || xActual >= filas || yActual < 0 || yActual >= columnas) 
    return;
  if (xNuevo < 0 || xNuevo >= filas || yNuevo < 0 || yNuevo >= columnas) 
    return;
  
  const celdaActual = estadoSimulacion.matrizObjetos[xActual][yActual];
  if (!celdaActual) 
    return;
  
  const indice = celdaActual.personajes.indexOf(personaje);
  if (indice > -1) {
    celdaActual.personajes.splice(indice, 1);
  }
  
  const celdaNueva = estadoSimulacion.matrizObjetos[xNuevo][yNuevo];
  if (!celdaNueva) 
    return;
  
  celdaNueva.personajes.push(personaje);
  
  if (personaje === 'P') {
    if (celdaNueva.puntoNormal) {
      celdaNueva.puntoNormal = false;
      celdaNueva.base = ' ';
      estadoSimulacion.puntuacion += 10;
    }
    
    if (celdaNueva.pelletEspecial) {
      celdaNueva.pelletEspecial = false;
      celdaNueva.base = ' ';
      estadoSimulacion.puntuacion += 50;
      estadoSimulacion.fantasmasVulnerables = true;
      estadoSimulacion.tiempoVulnerable = 10;
    }
    
    verificarColisionPacmanFantasmaSimulacion(estadoSimulacion);
  }
}

// Movimiento de personajes final
function moverPersonaje(personaje, xActual, yActual, xNuevo, yNuevo) {
  if (!juegoActivo) return;
  
  if (xActual < 0 || xActual >= filas || yActual < 0 || yActual >= columnas) 
    return;
  if (xNuevo < 0 || xNuevo >= filas || yNuevo < 0 || yNuevo >= columnas) 
    return;
  
  const celdaActual = matrizObjetos[xActual][yActual];
  if (!celdaActual) 
    return;
  
  const indice = celdaActual.personajes.indexOf(personaje);
  if (indice > -1) {
    celdaActual.personajes.splice(indice, 1);
  }
  
  const celdaNueva = matrizObjetos[xNuevo][yNuevo];
  if (!celdaNueva)
     return;
  
  celdaNueva.personajes.push(personaje);
  
  if (personaje === 'P') {
    if (celdaNueva.puntoNormal) {
      celdaNueva.puntoNormal = false;
      celdaNueva.base = ' ';
      puntuacion += 10;
    }
    
    if (celdaNueva.pelletEspecial) {
      celdaNueva.pelletEspecial = false;
      celdaNueva.base = ' ';
      puntuacion += 50;
      activarPoder();
    }
    
    verificarColisionPacmanFantasma();
  }
}

function activarPoder() {
  fantasmasVulnerables = true;
  tiempoVulnerable = 10;
  
  if (intervaloVulnerable) {
    clearInterval(intervaloVulnerable);
  }
  
  intervaloVulnerable = setInterval(() => {
    tiempoVulnerable -= 1;
    if (tiempoVulnerable <= 0) {
      fantasmasVulnerables = false;
      clearInterval(intervaloVulnerable);
    }
  }, 1000);
}

function verificarColisionPacmanFantasmaSimulacion(estadoSimulacion) {
  const posPacman = encontrarPosicionSimulacion('P', estadoSimulacion.matrizObjetos);
  if (!posPacman) return;
  
  const [x, y] = posPacman;
  const celda = estadoSimulacion.matrizObjetos[x][y];
  if (!celda) return;
  
  const fantasmasEnCelda = celda.personajes.filter(p => ['A','B','C','D'].includes(p));
  
  if (fantasmasEnCelda.length > 0) {
    if (estadoSimulacion.fantasmasVulnerables) {
      fantasmasEnCelda.forEach(fantasma => {
        const indice = celda.personajes.indexOf(fantasma);
        if (indice > -1) {
          celda.personajes.splice(indice, 1);
          estadoSimulacion.puntuacion += 200;
        }
      });
    } else {
      estadoSimulacion.juegoActivo = false;
    }
  }
}

function verificarColisionPacmanFantasma() {
  const posPacman = encontrarPosicion('P');
  if (!posPacman) return;
  
  const [x, y] = posPacman;
  const celda = matrizObjetos[x][y];
  if (!celda) return;
  
  const fantasmasEnCelda = celda.personajes.filter(p => ['A','B','C','D'].includes(p));
  
  if (fantasmasEnCelda.length > 0) {
    if (fantasmasVulnerables) {
      fantasmasEnCelda.forEach(fantasma => {
        const indice = celda.personajes.indexOf(fantasma);
        if (indice > -1) {
          celda.personajes.splice(indice, 1);
          puntuacion += 200;
        }
      });
    } else {
      juegoActivo = false;
    }
  }
}

function encontrarPosicionSimulacion(personaje, matrizSimulacion) {
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      if (matrizSimulacion[i][j].personajes.includes(personaje)) {
        return [i, j];
      }
    }
  }
  return null;
}

function encontrarPosicion(personaje) {
  return encontrarPosicionSimulacion(personaje, matrizObjetos);
}

// Funciones de movimiento para visual
function mover_Derecha_Simulacion(x, y, estadoSimulacion) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) return false;
  
  const nuevaY = y + 1;
  if (nuevaY >= columnas) return false;
  
  if(puedeMoverse(x, nuevaY, estadoSimulacion.matrizObjetos) || getCeldaVisual(estadoSimulacion.matrizObjetos[x][nuevaY]) === 'K'){ 
    if(getCeldaVisual(estadoSimulacion.matrizObjetos[x][nuevaY]) === 'K'){
      moverPersonajeSimulacion('P', x, y, 11, 1, estadoSimulacion);
    } else {
      moverPersonajeSimulacion('P', x, y, x, nuevaY, estadoSimulacion);
    }
    return true;
  }
  return false;
}

function mover_Izquierda_Simulacion(x, y, estadoSimulacion) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) return false;
  
  const nuevaY = y - 1;
  if (nuevaY < 0) return false;
  
  if(puedeMoverse(x, nuevaY, estadoSimulacion.matrizObjetos) || getCeldaVisual(estadoSimulacion.matrizObjetos[x][nuevaY]) === 'K'){
    if(getCeldaVisual(estadoSimulacion.matrizObjetos[x][nuevaY]) === 'K'){
      moverPersonajeSimulacion('P', x, y, 11, 19, estadoSimulacion);
    } else {
      moverPersonajeSimulacion('P', x, y, x, nuevaY, estadoSimulacion);
    }
    return true;
  }
  return false;
}

function mover_Arriba_Simulacion(x, y, estadoSimulacion) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) 
    return false;
  
  const nuevaX = x - 1;
  if (nuevaX < 0) 
    return false;
  
  if(puedeMoverse(nuevaX, y, estadoSimulacion.matrizObjetos)){
    moverPersonajeSimulacion('P', x, y, nuevaX, y, estadoSimulacion);
    return true;
  }
  return false;
}

function mover_Abajo_Simulacion(x, y, estadoSimulacion) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) 
    return false;
  
  const nuevaX = x + 1;
  if (nuevaX >= filas) 
    return false;
  
  if(puedeMoverse(nuevaX, y, estadoSimulacion.matrizObjetos)){
    moverPersonajeSimulacion('P', x, y, nuevaX, y, estadoSimulacion);
    return true;
  }
  return false;
}

// Funciones de movimiento para juego visual
function mover_Derecha(x, y) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) 
    return false;
  
  const nuevaY = y + 1;
  if (nuevaY >= columnas) 
    return false;
  
  if(puedeMoverse(x, nuevaY) || getCeldaVisual(matrizObjetos[x][nuevaY]) === 'K'){ 
    if(getCeldaVisual(matrizObjetos[x][nuevaY]) === 'K'){
      moverPersonaje('P', x, y, 11, 1);
    } else {
      moverPersonaje('P', x, y, x, nuevaY);
    }
    return true;
  }
  return false;
}

function mover_Izquierda(x, y) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) 
    return false;
  
  const nuevaY = y - 1;
  if (nuevaY < 0) 
    return false;
  
  if(puedeMoverse(x, nuevaY) || getCeldaVisual(matrizObjetos[x][nuevaY]) === 'K'){
    if(getCeldaVisual(matrizObjetos[x][nuevaY]) === 'K'){
      moverPersonaje('P', x, y, 11, 19);
    } else {
      moverPersonaje('P', x, y, x, nuevaY);
    }
    return true;
  }
  return false;
}

function mover_Arriba(x, y) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) 
    return false;
  
  const nuevaX = x - 1;
  if (nuevaX < 0) 
    return false;
  
  if(puedeMoverse(nuevaX, y)){
    moverPersonaje('P', x, y, nuevaX, y);
    return true;
  }
  return false;
}

function mover_Abajo(x, y) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) return false;
  
  const nuevaX = x + 1;
  if (nuevaX >= filas) return false;
  
  if(puedeMoverse(nuevaX, y)){
    moverPersonaje('P', x, y, nuevaX, y);
    return true;
  }
  return false;
}

// Movimiento de fantasmas para ag
function moverFantasmaAleatorioSimulacion(fantasma, estadoSimulacion) {
  const pos = encontrarPosicionSimulacion(fantasma, estadoSimulacion.matrizObjetos);
  if (!pos) return;
  
  const [x, y] = pos;
  const direcciones = [];
  
  if (puedeMoverse(x+1, y, estadoSimulacion.matrizObjetos)) 
    {direcciones.push(['abajo', x+1, y])};
  if (puedeMoverse(x-1, y, estadoSimulacion.matrizObjetos)) 
    {direcciones.push(['arriba', x-1, y])};
  if (puedeMoverse(x, y+1, estadoSimulacion.matrizObjetos)) 
    {direcciones.push(['derecha', x, y+1])};
  if (puedeMoverse(x, y-1, estadoSimulacion.matrizObjetos)) 
    {direcciones.push(['izquierda', x, y-1])};
  
  if (direcciones.length > 0) {
    const dirAleatoria = direcciones[Math.floor(Math.random() * direcciones.length)];
    moverPersonajeSimulacion(fantasma, x, y, dirAleatoria[1], dirAleatoria[2], estadoSimulacion);
  }
}
//movimiento fantasma real
function moverFantasmaAleatorio(fantasma) {
  const pos = encontrarPosicion(fantasma);
  if (!pos) return;
  
  const [x, y] = pos;
  const direcciones = [];
  
  if (puedeMoverse(x+1, y)) 
    {direcciones.push(['abajo', x+1, y])};
  if (puedeMoverse(x-1, y)) 
    {direcciones.push(['arriba', x-1, y])};
  if (puedeMoverse(x, y+1)) 
    {direcciones.push(['derecha', x, y+1])};
  if (puedeMoverse(x, y-1)) 
    {direcciones.push(['izquierda', x, y-1])};
  
  if (direcciones.length > 0) {
    const dirAleatoria = direcciones[Math.floor(Math.random() * direcciones.length)];
    moverPersonaje(fantasma, x, y, dirAleatoria[1], dirAleatoria[2]);
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function() {
  inicializarJuego();
});