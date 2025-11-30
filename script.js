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
let movimientoFantasmasActivo = false;
let intervaloFantasmas;
let juegoPausado = false;

// Estados de vista para los fantasmas
let vistaFantasmas = {
  'A': 'der',
  'B': 'izq', 
  'C': 'arr',
  'D': 'abj'
};

// Posiciones iniciales de los fantasmas
const posicionesIniciales = {
  'A': [3, 2],
  'B': [4, 15],
  'C': [21, 6],
  'D': [15, 13]
};

// Control para evitar movimiento duplicado
let movimientoEnProgreso = {
  'A': false,
  'B': false,
  'C': false,
  'D': false
};

// Elementos de UI
const btnJugarManual = document.getElementById('btnJugarManual');
const btnPausar = document.getElementById('btnPausar');
const btnReiniciar = document.getElementById('btnReiniciar');
const estadoElement = document.getElementById('estado');

// Inicializar juego
function inicializarJuego() {
  puntuacion = 0;
  fantasmasVulnerables = false;
  juegoActivo = true;
  juegoPausado = false;
  
  if (intervaloVulnerable) {
    clearInterval(intervaloVulnerable);
  }
  
  detenerMovimientoFantasmas();
  
  // Reiniciar matriz
  matrizObjetos = convertirMatriz(matriz);
  
  // Reiniciar estados de vista
  vistaFantasmas = {
    'A': 'der',
    'B': 'izq', 
    'C': 'arr',
    'D': 'abj'
  };
  
  // Reiniciar control de movimiento
  movimientoEnProgreso = {
    'A': false,
    'B': false,
    'C': false,
    'D': false
  };
  
  // Colocar personajes en posiciones iniciales
  moverPersonaje('P', 16, 10, 16, 10);
  Object.keys(posicionesIniciales).forEach(fantasma => {
    const [x, y] = posicionesIniciales[fantasma];
    moverPersonaje(fantasma, x, y, x, y);
  });
  
  // Actualizar UI
  actualizarEstadoUI('Juego listo - Usa las flechas para mover a Pacman');
  btnJugarManual.disabled = true;
  btnPausar.disabled = false;
  btnPausar.textContent = 'Pausar';
  
  render();
}

function convertirMatriz(matrizOriginal) {
  return matrizOriginal.map((fila, i) => 
    fila.map((celda, j) => {
      const esPersonaje = ['P','A','B','C','D'].includes(celda);
      const esPelletEspecial = celda === '*';
      const esPuntoNormal = celda === '.';
      const esPortal = celda === 'K';
      
      return {
        base: esPersonaje ? ' ' : (esPelletEspecial ? '.' : celda),
        personajes: esPersonaje ? [celda] : [],
        pelletEspecial: esPelletEspecial,
        puntoNormal: esPuntoNormal,
        portal: esPortal
      };
    })
  );
}

function getCeldaVisual(celda) {
  if (!celda) return 'O';
  
  // Mostrar Pacman si está en la celda
  if (celda.personajes.includes('P')) return 'P';
  
  // Mostrar el primer fantasma si hay fantasmas en la celda
  const fantasmas = celda.personajes.filter(p => ['A','B','C','D'].includes(p));
  if (fantasmas.length > 0) {
    return fantasmas[0]; // Mostrar solo el primer fantasma para visualización
  }
  
  return celda.base;
}

function puedeMoverse(x, y) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) return false;
  const celda = matrizObjetos[x][y];
  if (!celda) return false;
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
      else if (celdaVisual === ' ') tile.classList.add('empty');
      else if (celdaVisual === 'P') tile.classList.add('pacman');
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
}

// Función para actualizar el estado en la UI
function actualizarEstadoUI(mensaje) {
  if (estadoElement) {
    estadoElement.textContent = mensaje;
  }
}

// Función para verificar colisiones - AHORA SEPARADA para llamarla desde múltiples lugares
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
          // Reubicar fantasma en su posición inicial después de un tiempo
          setTimeout(() => {
            const [initX, initY] = posicionesIniciales[fantasma];
            moverPersonaje(fantasma, 0, 0, initX, initY);
          }, 1000);
        }
      });
    } else {
      juegoActivo = false;
      detenerMovimientoFantasmas();
      actualizarEstadoUI('¡Game Over! Presiona Reiniciar para jugar de nuevo');
      btnJugarManual.disabled = false;
      btnPausar.disabled = true;
      setTimeout(() => {
        alert(`¡Game Over! Puntuación final: ${puntuacion}`);
      }, 100);
    }
  }
}

// Movimiento de personajes - CORREGIDO para permitir múltiples fantasmas
function moverPersonaje(personaje, xActual, yActual, xNuevo, yNuevo) {
  if (!juegoActivo || juegoPausado) return;
  
  if (xActual < 0 || xActual >= filas || yActual < 0 || yActual >= columnas) return;
  if (xNuevo < 0 || xNuevo >= filas || yNuevo < 0 || yNuevo >= columnas) return;
  
  const celdaActual = matrizObjetos[xActual][yActual];
  if (!celdaActual) return;
  
  // Solo eliminar el personaje de la celda actual si realmente está ahí
  const indiceActual = celdaActual.personajes.indexOf(personaje);
  if (indiceActual > -1) {
    celdaActual.personajes.splice(indiceActual, 1);
  }
  
  const celdaNueva = matrizObjetos[xNuevo][yNuevo];
  if (!celdaNueva) return;
  
  // Verificar si el personaje ya está en la celda nueva (evitar duplicados)
  const indiceNuevo = celdaNueva.personajes.indexOf(personaje);
  if (indiceNuevo === -1) {
    celdaNueva.personajes.push(personaje);
  }
  
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
    
    // Verificar colisión después de que Pacman se mueve
    verificarColisionPacmanFantasma();
  } else if (['A','B','C','D'].includes(personaje)) {
    // Verificar colisión después de que un fantasma se mueve
    // (por si el fantasma se movió hacia Pacman)
    verificarColisionPacmanFantasma();
  }
}

function activarPoder() {
  fantasmasVulnerables = true;
  tiempoVulnerable = 10;
  actualizarEstadoUI(`¡Fantasmas Vulnerables! ${tiempoVulnerable}s`);
  
  if (intervaloVulnerable) {
    clearInterval(intervaloVulnerable);
  }
  
  intervaloVulnerable = setInterval(() => {
    tiempoVulnerable -= 1;
    if (tiempoVulnerable <= 0) {
      fantasmasVulnerables = false;
      clearInterval(intervaloVulnerable);
      actualizarEstadoUI('Juego en curso - Usa las flechas para mover a Pacman');
    } else {
      actualizarEstadoUI(`¡Fantasmas Vulnerables! ${tiempoVulnerable}s`);
    }
  }, 1000);
}

function encontrarPosicion(personaje) {
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      if (matrizObjetos[i][j].personajes.includes(personaje)) {
        return [i, j];
      }
    }
  }
  return null;
}

// Funciones de movimiento para Pacman
function mover_Derecha(x, y) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) return false;
  
  const nuevaY = y + 1;
  if (nuevaY >= columnas) return false;
  
  if(puedeMoverse(x, nuevaY) || matrizObjetos[x][nuevaY].portal){ 
    if(matrizObjetos[x][nuevaY].portal){
      moverPersonaje('P', x, y, 11, 1);
    } else {
      moverPersonaje('P', x, y, x, nuevaY);
    }
    return true;
  }
  return false;
}

function mover_Izquierda(x, y) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) return false;
  
  const nuevaY = y - 1;
  if (nuevaY < 0) return false;
  
  if(puedeMoverse(x, nuevaY) || matrizObjetos[x][nuevaY].portal){
    if(matrizObjetos[x][nuevaY].portal){
      moverPersonaje('P', x, y, 11, 19);
    } else {
      moverPersonaje('P', x, y, x, nuevaY);
    }
    return true;
  }
  return false;
}

function mover_Arriba(x, y) {
  if (x < 0 || x >= filas || y < 0 || y >= columnas) return false;
  
  const nuevaX = x - 1;
  if (nuevaX < 0) return false;
  
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

// Funciones de movimiento para fantasmas (versión simple)
function moverFantasmaSimple(fantasma, x, y, direccion) {
  if (movimientoEnProgreso[fantasma] || juegoPausado) return false;
  
  movimientoEnProgreso[fantasma] = true;
  let seMovio = false;
  
  switch(direccion) {
    case 'der':
      const nuevaYDer = y + 1;
      if (nuevaYDer < columnas && puedeMoverse(x, nuevaYDer)) {
        moverPersonaje(fantasma, x, y, x, nuevaYDer);
        vistaFantasmas[fantasma] = 'der';
        seMovio = true;
      }
      break;
    case 'izq':
      const nuevaYIzq = y - 1;
      if (nuevaYIzq >= 0 && puedeMoverse(x, nuevaYIzq)) {
        moverPersonaje(fantasma, x, y, x, nuevaYIzq);
        vistaFantasmas[fantasma] = 'izq';
        seMovio = true;
      }
      break;
    case 'arr':
      const nuevaXArr = x - 1;
      if (nuevaXArr >= 0 && puedeMoverse(nuevaXArr, y)) {
        moverPersonaje(fantasma, x, y, nuevaXArr, y);
        vistaFantasmas[fantasma] = 'arr';
        seMovio = true;
      }
      break;
    case 'abj':
      const nuevaXAbj = x + 1;
      if (nuevaXAbj < filas && puedeMoverse(nuevaXAbj, y)) {
        moverPersonaje(fantasma, x, y, nuevaXAbj, y);
        vistaFantasmas[fantasma] = 'abj';
        seMovio = true;
      }
      break;
  }
  
  movimientoEnProgreso[fantasma] = false;
  return seMovio;
}

// Funciones de inteligencia para fantasmas (versión simplificada)
function obtenerMejorDireccion(fantasma, x, y, objetivoX, objetivoY) {
  const direcciones = [];
  const vistaActual = vistaFantasmas[fantasma];
  
  // Evaluar cada dirección posible
  if (puedeMoverse(x, y + 1) && vistaActual !== 'izq') {
    const distancia = Math.sqrt((x - objetivoX)**2 + ((y + 1) - objetivoY)**2);
    direcciones.push({ direccion: 'der', distancia: distancia });
  }
  if (puedeMoverse(x, y - 1) && vistaActual !== 'der') {
    const distancia = Math.sqrt((x - objetivoX)**2 + ((y - 1) - objetivoY)**2);
    direcciones.push({ direccion: 'izq', distancia: distancia });
  }
  if (puedeMoverse(x - 1, y) && vistaActual !== 'abj') {
    const distancia = Math.sqrt(((x - 1) - objetivoX)**2 + (y - objetivoY)**2);
    direcciones.push({ direccion: 'arr', distancia: distancia });
  }
  if (puedeMoverse(x + 1, y) && vistaActual !== 'arr') {
    const distancia = Math.sqrt(((x + 1) - objetivoX)**2 + (y - objetivoY)**2);
    direcciones.push({ direccion: 'abj', distancia: distancia });
  }
  
  if (direcciones.length === 0) return vistaActual;
  
  // Ordenar por distancia (menor a mayor para perseguir, mayor a menor para huir)
  if (fantasmasVulnerables) {
    // Huir: elegir la dirección que más aleje del objetivo
    direcciones.sort((a, b) => b.distancia - a.distancia);
  } else {
    // Perseguir: elegir la dirección que más acerque al objetivo
    direcciones.sort((a, b) => a.distancia - b.distancia);
  }
  
  return direcciones[0].direccion;
}

function moverFantasmaA() {
  const pos = encontrarPosicion('A');
  if (!pos) return;
  
  const [x, y] = pos;
  const posPacman = encontrarPosicion('P');
  
  if (posPacman) {
    const [pacmanX, pacmanY] = posPacman;
    let objetivoX, objetivoY;
    
    if (fantasmasVulnerables) {
      // Huir a esquina superior izquierda
      objetivoX = 1;
      objetivoY = 1;
    } else {
      // Perseguir a Pacman
      objetivoX = pacmanX;
      objetivoY = pacmanY;
    }
    
    const direccion = obtenerMejorDireccion('A', x, y, objetivoX, objetivoY);
    moverFantasmaSimple('A', x, y, direccion);
  }
}

function moverFantasmaB() {
  const pos = encontrarPosicion('B');
  if (!pos) return;
  
  const [x, y] = pos;
  const posPacman = encontrarPosicion('P');
  
  if (posPacman) {
    const [pacmanX, pacmanY] = posPacman;
    let objetivoX, objetivoY;
    
    if (fantasmasVulnerables) {
      // Huir a esquina superior derecha
      objetivoX = 1;
      objetivoY = columnas - 2;
    } else {
      // Perseguir 4 posiciones adelante de Pacman
      const vistaPacman = vistaFantasmas['P'] || 'der';
      switch(vistaPacman) {
        case 'der': objetivoX = pacmanX; objetivoY = pacmanY + 4; break;
        case 'izq': objetivoX = pacmanX; objetivoY = pacmanY - 4; break;
        case 'arr': objetivoX = pacmanX - 4; objetivoY = pacmanY; break;
        case 'abj': objetivoX = pacmanX + 4; objetivoY = pacmanY; break;
        default: objetivoX = pacmanX; objetivoY = pacmanY + 4;
      }
    }
    
    const direccion = obtenerMejorDireccion('B', x, y, objetivoX, objetivoY);
    moverFantasmaSimple('B', x, y, direccion);
  }
}

function moverFantasmaC() {
  const pos = encontrarPosicion('C');
  if (!pos) return;
  
  const [x, y] = pos;
  const posPacman = encontrarPosicion('P');
  const posB = encontrarPosicion('B');
  
  if (posPacman && posB) {
    const [pacmanX, pacmanY] = posPacman;
    const [bX, bY] = posB;
    let objetivoX, objetivoY;
    
    if (fantasmasVulnerables) {
      // Huir a esquina inferior izquierda
      objetivoX = filas - 2;
      objetivoY = 1;
    } else {
      // Estrategia compleja basada en posición de B y Pacman
      objetivoX = 2 * pacmanX - bX;
      objetivoY = 2 * pacmanY - bY;
    }
    
    const direccion = obtenerMejorDireccion('C', x, y, objetivoX, objetivoY);
    moverFantasmaSimple('C', x, y, direccion);
  }
}

function moverFantasmaD() {
  const pos = encontrarPosicion('D');
  if (!pos) return;
  
  const [x, y] = pos;
  const posPacman = encontrarPosicion('P');
  
  if (posPacman) {
    const [pacmanX, pacmanY] = posPacman;
    let objetivoX, objetivoY;
    
    const distancia = Math.sqrt((x - pacmanX)**2 + (y - pacmanY)**2);
    
    if (fantasmasVulnerables) {
      // Huir a esquina inferior derecha
      objetivoX = filas - 2;
      objetivoY = columnas - 2;
    } else if (distancia < 8) {
      // Si está cerca, huir a su esquina
      objetivoX = filas - 2;
      objetivoY = columnas - 2;
    } else {
      // Perseguir a Pacman
      objetivoX = pacmanX;
      objetivoY = pacmanY;
    }
    
    const direccion = obtenerMejorDireccion('D', x, y, objetivoX, objetivoY);
    moverFantasmaSimple('D', x, y, direccion);
  }
}

// Control del movimiento automático de fantasmas
function iniciarMovimientoFantasmas() {
  if (movimientoFantasmasActivo) return;
  movimientoFantasmasActivo = true;
  
  intervaloFantasmas = setInterval(() => {
    if (!juegoActivo || juegoPausado) {
      if (!juegoActivo) {
        detenerMovimientoFantasmas();
      }
      return;
    }
    
    // Mover cada fantasma con su inteligencia específica
    moverFantasmaA();
    moverFantasmaB();
    moverFantasmaC();
    moverFantasmaD();
    
    render();
  }, 500); // Velocidad de movimiento de fantasmas
}

function detenerMovimientoFantasmas() {
  movimientoFantasmasActivo = false;
  if (intervaloFantasmas) {
    clearInterval(intervaloFantasmas);
  }
}

// Función para pausar/reanudar el juego
function togglePausa() {
  if (!juegoActivo) return;
  
  juegoPausado = !juegoPausado;
  
  if (juegoPausado) {
    btnPausar.textContent = 'Reanudar';
    actualizarEstadoUI('Juego en pausa');
  } else {
    btnPausar.textContent = 'Pausar';
    actualizarEstadoUI('Juego en curso - Usa las flechas para mover a Pacman');
  }
  
  render();
}

// Event Listeners para los nuevos botones
btnJugarManual.addEventListener('click', function() {
  inicializarJuego();
  iniciarMovimientoFantasmas();
});

btnPausar.addEventListener('click', togglePausa);

btnReiniciar.addEventListener('click', function() {
  inicializarJuego();
  if (!juegoPausado) {
    iniciarMovimientoFantasmas();
  }
});

// Controles de teclado para jugar
document.addEventListener('keydown', (event) => {
  if (!juegoActivo || juegoPausado) return;
  
  const pos = encontrarPosicion('P');
  if (!pos) return;
  
  const [x, y] = pos;
  let seMovio = false;
  
  switch(event.key) {
    case 'ArrowRight':
      seMovio = mover_Derecha(x, y);
      vistaFantasmas['P'] = 'der';
      break;
    case 'ArrowLeft':
      seMovio = mover_Izquierda(x, y);
      vistaFantasmas['P'] = 'izq';
      break;
    case 'ArrowUp':
      seMovio = mover_Arriba(x, y);
      vistaFantasmas['P'] = 'arr';
      break;
    case 'ArrowDown':
      seMovio = mover_Abajo(x, y);
      vistaFantasmas['P'] = 'abj';
      break;
    case 'r':
    case 'R':
      inicializarJuego();
      iniciarMovimientoFantasmas();
      return;
    case 'p':
    case 'P':
      togglePausa();
      return;
  }
  
  if (seMovio) {
    render();
  }
});

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Solo inicializar el estado, no iniciar el juego automáticamente
  actualizarEstadoUI('Presiona "Jugar Manualmente" para empezar');
  render();
});

// Al final del script.js, agregar:

// Inicialización del AG
// Inicialización del AG
document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    const config = {
        tamanoPoblacion: parseInt(document.getElementById('inputPoblacion').value),
        generacionesTotales: parseInt(document.getElementById('inputGeneraciones').value),
        tasaSeleccion: 0.6,
        tasaCruzamiento: 0.3,
        tasaMutacion: parseFloat(document.getElementById('inputMutacion').value),
        tamanoTorneo: 3,
        fuerzaMutacion: 0.2,
        semilla: parseInt(document.getElementById('inputSemilla').value),
        fps: 30,
        episodiosPorIndividuo: 1
    };
    
    inicializarAG(config);
    
    // Event listeners para controles del AG
    document.getElementById('btnIniciarAG').addEventListener('click', function() {
        const config = {
            tamanoPoblacion: parseInt(document.getElementById('inputPoblacion').value),
            generacionesTotales: parseInt(document.getElementById('inputGeneraciones').value),
            tasaSeleccion: 0.6,
            tasaCruzamiento: 0.3,
            tasaMutacion: parseFloat(document.getElementById('inputMutacion').value),
            tamanoTorneo: 3,
            fuerzaMutacion: 0.2,
            semilla: parseInt(document.getElementById('inputSemilla').value),
            fps: 30,
            episodiosPorIndividuo: 1
        };
        
        const ag = inicializarAG(config);
        if (ag && !ag.corriendo) {
            ag.ejecutar();
            this.disabled = true;
            document.getElementById('btnPausarAG').disabled = false;
            document.getElementById('btnDemoMejor').disabled = true;
            document.getElementById('btnExportarMejor').disabled = true;
        }
    });
    
    document.getElementById('btnPausarAG').addEventListener('click', function() {
        const ag = obtenerAG();
        if (ag) {
            if (ag.pausado) {
                ag.reanudar();
                this.textContent = 'Pausar';
            } else {
                ag.pausar();
                this.textContent = 'Reanudar';
            }
        }
    });
    
    document.getElementById('btnReiniciarAG').addEventListener('click', function() {
        const ag = obtenerAG();
        if (ag) {
            ag.detener();
            setTimeout(() => {
                const config = {
                    tamanoPoblacion: parseInt(document.getElementById('inputPoblacion').value),
                    generacionesTotales: parseInt(document.getElementById('inputGeneraciones').value),
                    tasaSeleccion: 0.6,
                    tasaCruzamiento: 0.3,
                    tasaMutacion: parseFloat(document.getElementById('inputMutacion').value),
                    tamanoTorneo: 3,
                    fuerzaMutacion: 0.2,
                    semilla: parseInt(document.getElementById('inputSemilla').value),
                    fps: 30,
                    episodiosPorIndividuo: 1
                };
                
                inicializarAG(config);
                document.getElementById('btnIniciarAG').disabled = false;
                document.getElementById('btnPausarAG').disabled = true;
                document.getElementById('btnPausarAG').textContent = 'Pausar';
                document.getElementById('btnDemoMejor').disabled = true;
                document.getElementById('btnExportarMejor').disabled = true;
                document.getElementById('estado-ag').textContent = 'Reiniciado - Listo para iniciar';
            }, 100);
        }
    });
    
    document.getElementById('btnExportarMejor').addEventListener('click', function() {
        const ag = obtenerAG();
        if (ag && ag.mejorIndividuo) {
            const mejor = ag.exportarMejorIndividuo();
            const blob = new Blob([JSON.stringify(mejor, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mejor_individuo.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    });
    
    document.getElementById('btnDemoMejor').addEventListener('click', function() {
        const ag = obtenerAG();
        if (ag && ag.mejorIndividuo) {
            demoManager.iniciarDemo(ag.mejorIndividuo);
        }
    });
    
    // Actualizar total de generaciones cuando cambie el input
    document.getElementById('inputGeneraciones').addEventListener('change', function() {
        document.getElementById('totalGeneraciones').textContent = this.value;
    });
});