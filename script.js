// ================================
// CONFIGURACIÓN Y CONSTANTES DEL JUEGO
// ================================

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

// ================================
// VARIABLES GLOBALES DEL JUEGO
// ================================

let matrizObjetos = [];
let puntuacion = 0;
let fantasmasVulnerables = false;
let tiempoVulnerable = 0;
let juegoActivo = true;
let juegoPausado = false;
let movimientoFantasmasActivo = false;
let intervaloFantasmas;
let intervaloVulnerable;

// Estados de vista
let vistaFantasmas = {
    'A': 'der', 'B': 'izq', 'C': 'arr', 'D': 'abj'
};

// Posiciones iniciales
const posicionesIniciales = {
    'A': [3, 2], 'B': [4, 15], 'C': [21, 6], 'D': [15, 13]
};

// Control de movimiento
let movimientoEnProgreso = {
    'A': false, 'B': false, 'C': false, 'D': false
};

// Variables globales para demo
let demoActiva = false;
let motorDemo = null;
let intervaloDemo = null;
let mejorIndividuoGlobal = null;

// ================================
// CLASE MOTOR DE JUEGO SILENCIOSO (para AG)
// ================================

class MotorPacmanSilencioso {
    constructor() {
        this.inicializar();
        this.historialMovimientos = []; // NUEVO: para grabar la partida
    }
    
    inicializar() {
        this.matrizObjetos = this.convertirMatriz(matriz);
        this.puntuacion = 0;
        this.juegoActivo = true;
        this.tiempo = 0;
        this.fantasmasVulnerables = false;
        this.tiempoVulnerable = 0;
        this.puntosRecolectados = 0;
        this.fantasmasComidos = 0;
        this.vidasPerdidas = 0;
        this.pelletsEspecialesRecolectados = 0;
        this.pasosSinComer = 0;
        this.ultimaPuntuacion = 0;
        this.historialMovimientos = []; // Reiniciar historial
        
        // Colocar personajes
        this.moverPersonaje('P', 0, 0, 16, 10);
        Object.keys(posicionesIniciales).forEach(fantasma => {
            const [x, y] = posicionesIniciales[fantasma];
            this.moverPersonaje(fantasma, 0, 0, x, y);
        });
        
        // Grabar estado inicial
        this.historialMovimientos.push({
            matriz: JSON.parse(JSON.stringify(this.matrizObjetos)),
            puntuacion: this.puntuacion,
            tiempo: this.tiempo,
            fantasmasVulnerables: this.fantasmasVulnerables,
            accion: 'inicio'
        });
    }
    
    convertirMatriz(matrizOriginal) {
        return matrizOriginal.map((fila, i) => 
            fila.map((celda, j) => {
                const esPersonaje = ['P','A','B','C','D'].includes(celda);
                const esPelletEspecial = celda === '*';
                const esPuntoNormal = celda === '.';
                const esPortal = celda === 'K';
                
                return {
                    base: esPersonaje ? ' ' : celda,
                    personajes: esPersonaje ? [celda] : [],
                    pelletEspecial: esPelletEspecial,
                    puntoNormal: esPuntoNormal,
                    portal: esPortal
                };
            })
        );
    }
    
    moverPersonaje(personaje, xActual, yActual, xNuevo, yNuevo) {
        if (!this.juegoActivo) return;
        
        // Validar coordenadas
        if (xActual < 0 || xActual >= filas || yActual < 0 || yActual >= columnas) return;
        if (xNuevo < 0 || xNuevo >= filas || yNuevo < 0 || yNuevo >= columnas) return;
        
        const celdaActual = this.matrizObjetos[xActual] && this.matrizObjetos[xActual][yActual];
        const celdaNueva = this.matrizObjetos[xNuevo] && this.matrizObjetos[xNuevo][yNuevo];
        
        if (!celdaActual || !celdaNueva) return;
        
        // Remover de celda actual
        const indiceActual = celdaActual.personajes.indexOf(personaje);
        if (indiceActual > -1) {
            celdaActual.personajes.splice(indiceActual, 1);
        }
        
        // Agregar a celda nueva
        if (!celdaNueva.personajes.includes(personaje)) {
            celdaNueva.personajes.push(personaje);
        }
        
        // Procesar efectos si es Pacman
        if (personaje === 'P') {
            if (celdaNueva.puntoNormal) {
                celdaNueva.puntoNormal = false;
                this.puntuacion += 10;
                this.puntosRecolectados++;
                this.pasosSinComer = 0;
            }
            
            if (celdaNueva.pelletEspecial) {
                celdaNueva.pelletEspecial = false;
                this.puntuacion += 50;
                this.activarPoder();
                this.pelletsEspecialesRecolectados++;
                this.pasosSinComer = 0;
            }
            
            // Verificar si comió algo
            if (this.puntuacion > this.ultimaPuntuacion) {
                this.ultimaPuntuacion = this.puntuacion;
                this.pasosSinComer = 0;
            } else {
                this.pasosSinComer++;
            }
            
            this.verificarColisionPacmanFantasma();
        }
    }
    
    activarPoder() {
        this.fantasmasVulnerables = true;
        this.tiempoVulnerable = 10;
    }
    
    verificarColisionPacmanFantasma() {
        const posPacman = this.encontrarPosicion('P');
        if (!posPacman) return;
        
        const [x, y] = posPacman;
        const celda = this.matrizObjetos[x][y];
        
        const fantasmasEnCelda = celda.personajes.filter(p => ['A','B','C','D'].includes(p));
        
        if (fantasmasEnCelda.length > 0) {
            if (this.fantasmasVulnerables) {
                // Comer fantasmas
                fantasmasEnCelda.forEach(fantasma => {
                    const indice = celda.personajes.indexOf(fantasma);
                    if (indice > -1) {
                        celda.personajes.splice(indice, 1);
                        this.puntuacion += 200;
                        this.fantasmasComidos++;
                    }
                });
            } else {
                // Morir
                this.juegoActivo = false;
                this.vidasPerdidas++;
            }
        }
    }
    
    encontrarPosicion(personaje) {
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (this.matrizObjetos[i] && this.matrizObjetos[i][j] && 
                    this.matrizObjetos[i][j].personajes.includes(personaje)) {
                    return [i, j];
                }
            }
        }
        return null;
    }
    
    puedeMoverse(x, y) {
        if (x < 0 || x >= filas || y < 0 || y >= columnas) return false;
        const celda = this.matrizObjetos[x] && this.matrizObjetos[x][y];
        if (!celda) return false;
        return celda.base !== 'O';
    }
    
    mover_Derecha(x, y) {
        const nuevaY = y + 1;
        if (nuevaY >= columnas) return false;
        
        if (this.puedeMoverse(x, nuevaY) || (this.matrizObjetos[x][nuevaY] && this.matrizObjetos[x][nuevaY].portal)) {
            if (this.matrizObjetos[x][nuevaY].portal) {
                this.moverPersonaje('P', x, y, 11, 1);
            } else {
                this.moverPersonaje('P', x, y, x, nuevaY);
            }
            return true;
        }
        return false;
    }
    
    mover_Izquierda(x, y) {
        const nuevaY = y - 1;
        if (nuevaY < 0) return false;
        
        if (this.puedeMoverse(x, nuevaY) || (this.matrizObjetos[x][nuevaY] && this.matrizObjetos[x][nuevaY].portal)) {
            if (this.matrizObjetos[x][nuevaY].portal) {
                this.moverPersonaje('P', x, y, 11, 19);
            } else {
                this.moverPersonaje('P', x, y, x, nuevaY);
            }
            return true;
        }
        return false;
    }
    
    mover_Arriba(x, y) {
        const nuevaX = x - 1;
        if (nuevaX < 0) return false;
        
        if (this.puedeMoverse(nuevaX, y)) {
            this.moverPersonaje('P', x, y, nuevaX, y);
            return true;
        }
        return false;
    }
    
    mover_Abajo(x, y) {
        const nuevaX = x + 1;
        if (nuevaX >= filas) return false;
        
        if (this.puedeMoverse(nuevaX, y)) {
            this.moverPersonaje('P', x, y, nuevaX, y);
            return true;
        }
        return false;
    }
    
    moverFantasmas() {
    // Usar la MISMA lógica que el juego visual
    if (this.tiempo % 2 === 0) { // Mover cada 2 pasos para igualar velocidad del juego visual
        
        // Mover fantasma A (igual que en juego visual)
        const posA = this.encontrarPosicion('A');
        if (posA) {
            const [x, y] = posA;
            const posPacman = this.encontrarPosicion('P');
            if (posPacman) {
                const [pacmanX, pacmanY] = posPacman;
                let objetivoX, objetivoY;
                
                if (this.fantasmasVulnerables) {
                    objetivoX = 1;
                    objetivoY = 1;
                } else {
                    objetivoX = pacmanX;
                    objetivoY = pacmanY;
                }
                
                const direccion = this.obtenerMejorDireccionSilencioso('A', x, y, objetivoX, objetivoY);
                this.moverFantasmaSilencioso('A', x, y, direccion);
            }
        }
        
        // Mover fantasma B (igual que en juego visual)
        const posB = this.encontrarPosicion('B');
        if (posB) {
            const [x, y] = posB;
            const posPacman = this.encontrarPosicion('P');
            if (posPacman) {
                const [pacmanX, pacmanY] = posPacman;
                let objetivoX, objetivoY;
                
                if (this.fantasmasVulnerables) {
                    objetivoX = 1;
                    objetivoY = columnas - 2;
                } else {
                    // Misma lógica que en juego visual
                    const vistaPacman = 'der'; // Valor por defecto
                    switch(vistaPacman) {
                        case 'der': objetivoX = pacmanX; objetivoY = pacmanY + 4; break;
                        case 'izq': objetivoX = pacmanX; objetivoY = pacmanY - 4; break;
                        case 'arr': objetivoX = pacmanX - 4; objetivoY = pacmanY; break;
                        case 'abj': objetivoX = pacmanX + 4; objetivoY = pacmanY; break;
                        default: objetivoX = pacmanX; objetivoY = pacmanY + 4;
                    }
                }
                
                const direccion = this.obtenerMejorDireccionSilencioso('B', x, y, objetivoX, objetivoY);
                this.moverFantasmaSilencioso('B', x, y, direccion);
            }
        }
        
        // Mover fantasma C (igual que en juego visual)
        const posC = this.encontrarPosicion('C');
        if (posC) {
            const [x, y] = posC;
            const posPacman = this.encontrarPosicion('P');
            const posB = this.encontrarPosicion('B');
            
            if (posPacman && posB) {
                const [pacmanX, pacmanY] = posPacman;
                const [bX, bY] = posB;
                let objetivoX, objetivoY;
                
                if (this.fantasmasVulnerables) {
                    objetivoX = filas - 2;
                    objetivoY = 1;
                } else {
                    objetivoX = 2 * pacmanX - bX;
                    objetivoY = 2 * pacmanY - bY;
                }
                
                const direccion = this.obtenerMejorDireccionSilencioso('C', x, y, objetivoX, objetivoY);
                this.moverFantasmaSilencioso('C', x, y, direccion);
            }
        }
        
        // Mover fantasma D (igual que en juego visual)
        const posD = this.encontrarPosicion('D');
        if (posD) {
            const [x, y] = posD;
            const posPacman = this.encontrarPosicion('P');
            
            if (posPacman) {
                const [pacmanX, pacmanY] = posPacman;
                let objetivoX, objetivoY;
                
                const distancia = this.calcularDistancia([x, y], [pacmanX, pacmanY]);
                
                if (this.fantasmasVulnerables) {
                    objetivoX = filas - 2;
                    objetivoY = columnas - 2;
                } else if (distancia < 8) {
                    objetivoX = filas - 2;
                    objetivoY = columnas - 2;
                } else {
                    objetivoX = pacmanX;
                    objetivoY = pacmanY;
                }
                
                const direccion = this.obtenerMejorDireccionSilencioso('D', x, y, objetivoX, objetivoY);
                this.moverFantasmaSilencioso('D', x, y, direccion);
            }
        }
    }
    
    // Actualizar poder de fantasmas
    if (this.fantasmasVulnerables) {
        this.tiempoVulnerable--;
        if (this.tiempoVulnerable <= 0) {
            this.fantasmasVulnerables = false;
        }
    }
}

// AÑADE estos métodos al MotorPacmanSilencioso:

obtenerMejorDireccionSilencioso(fantasma, x, y, objetivoX, objetivoY) {
    const direcciones = [];
    
    // Verificar direcciones posibles (sin restricciones de vista como en juego visual)
    if (this.puedeMoverse(x, y + 1)) {
        const distancia = Math.sqrt((x - objetivoX)**2 + ((y + 1) - objetivoY)**2);
        direcciones.push({ direccion: 'der', distancia: distancia });
    }
    if (this.puedeMoverse(x, y - 1)) {
        const distancia = Math.sqrt((x - objetivoX)**2 + ((y - 1) - objetivoY)**2);
        direcciones.push({ direccion: 'izq', distancia: distancia });
    }
    if (this.puedeMoverse(x - 1, y)) {
        const distancia = Math.sqrt(((x - 1) - objetivoX)**2 + (y - objetivoY)**2);
        direcciones.push({ direccion: 'arr', distancia: distancia });
    }
    if (this.puedeMoverse(x + 1, y)) {
        const distancia = Math.sqrt(((x + 1) - objetivoX)**2 + (y - objetivoY)**2);
        direcciones.push({ direccion: 'abj', distancia: distancia });
    }
    
    if (direcciones.length === 0) return 'der';
    
    // Si los fantasmas son vulnerables, HUIR; si no, PERSEGUIR
    if (this.fantasmasVulnerables) {
        direcciones.sort((a, b) => b.distancia - a.distancia); // Mayor distancia primero (huir)
    } else {
        direcciones.sort((a, b) => a.distancia - b.distancia); // Menor distancia primero (perseguir)
    }
    
    return direcciones[0].direccion;
}

moverFantasmaSilencioso(fantasma, x, y, direccion) {
    let nuevaX = x, nuevaY = y;
    
    switch(direccion) {
        case 'der': nuevaY = y + 1; break;
        case 'izq': nuevaY = y - 1; break;
        case 'arr': nuevaX = x - 1; break;
        case 'abj': nuevaX = x + 1; break;
    }
    
    if (this.puedeMoverse(nuevaX, nuevaY)) {
        this.moverPersonaje(fantasma, x, y, nuevaX, nuevaY);
        return true;
    }
    return false;
}
    
    // MODIFICADO: ejecutarPaso para GRABAR movimientos
    ejecutarPaso(direccion) {
        if (!this.juegoActivo) return false;
        
        const posPacman = this.encontrarPosicion('P');
        if (!posPacman) return false;
        
        const [x, y] = posPacman;
        let seMovio = false;
        
        switch(direccion) {
            case 'derecha': seMovio = this.mover_Derecha(x, y); break;
            case 'izquierda': seMovio = this.mover_Izquierda(x, y); break;
            case 'arriba': seMovio = this.mover_Arriba(x, y); break;
            case 'abajo': seMovio = this.mover_Abajo(x, y); break;
        }
        
        if (seMovio) {
            // GRABAR el estado completo después del movimiento
            this.historialMovimientos.push({
                matriz: JSON.parse(JSON.stringify(this.matrizObjetos)),
                puntuacion: this.puntuacion,
                tiempo: this.tiempo,
                fantasmasVulnerables: this.fantasmasVulnerables,
                accion: direccion
            });
            
            this.moverFantasmas();
            this.tiempo++;
        }
        
        return seMovio;
    }
    
    obtenerEstado() {
        const posPacman = this.encontrarPosicion('P');
        if (!posPacman) return null;
        
        const estado = {
            posPacman: posPacman,
            fantasmas: {},
            pelletsCercanos: 0,
            pelletsEspecialesCercanos: 0,
            fantasmaMasCercano: Infinity,
            direccionFantasmaMasCercano: null,
            fantasmasVulnerables: this.fantasmasVulnerables,
            puntuacion: this.puntuacion,
            tiempo: this.tiempo
        };
        
        // Información de fantasmas
        ['A', 'B', 'C', 'D'].forEach(fantasma => {
            const posFantasma = this.encontrarPosicion(fantasma);
            if (posFantasma) {
                estado.fantasmas[fantasma] = posFantasma;
                const distancia = this.calcularDistancia(posPacman, posFantasma);
                if (distancia < estado.fantasmaMasCercano) {
                    estado.fantasmaMasCercano = distancia;
                    estado.direccionFantasmaMasCercano = this.obtenerDireccionRelativa(posPacman, posFantasma);
                }
            }
        });
        
        // Contar pellets cercanos
        const radio = 3;
        for (let i = Math.max(0, posPacman[0] - radio); i <= Math.min(filas-1, posPacman[0] + radio); i++) {
            for (let j = Math.max(0, posPacman[1] - radio); j <= Math.min(columnas-1, posPacman[1] + radio); j++) {
                if (this.matrizObjetos[i] && this.matrizObjetos[i][j]) {
                    if (this.matrizObjetos[i][j].puntoNormal) estado.pelletsCercanos++;
                    if (this.matrizObjetos[i][j].pelletEspecial) estado.pelletsEspecialesCercanos++;
                }
            }
        }
        
        return estado;
    }
    
    calcularDistancia(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
    }
    
    obtenerDireccionRelativa(pos1, pos2) {
        const dx = pos2[0] - pos1[0];
        const dy = pos2[1] - pos1[1];
        
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'abajo' : 'arriba';
        } else {
            return dy > 0 ? 'derecha' : 'izquierda';
        }
    }
    
    // NUEVO MÉTODO: obtener historial completo
    obtenerHistorialCompleto() {
        return this.historialMovimientos;
    }
}

// ================================
// FUNCIONES DEL JUEGO PRINCIPAL
// ================================

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
    
    // Reiniciar estados
    vistaFantasmas = { 'A': 'der', 'B': 'izq', 'C': 'arr', 'D': 'abj' };
    movimientoEnProgreso = { 'A': false, 'B': false, 'C': false, 'D': false };
    
    // Colocar personajes en posiciones iniciales
    moverPersonaje('P', 16, 10, 16, 10);
    Object.keys(posicionesIniciales).forEach(fantasma => {
        const [x, y] = posicionesIniciales[fantasma];
        moverPersonaje(fantasma, x, y, x, y);
    });
    
    // Actualizar UI
    actualizarEstadoUI('Juego listo - Usa las flechas para mover a Pacman');
    if (btnJugarManual) btnJugarManual.disabled = true;
    if (btnPausar) {
        btnPausar.disabled = false;
        btnPausar.textContent = 'Pausar';
    }
    
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
    
    if (celda.personajes.includes('P')) return 'P';
    
    const fantasmas = celda.personajes.filter(p => ['A','B','C','D'].includes(p));
    if (fantasmas.length > 0) {
        return fantasmas[0];
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
    const estadoElement = document.getElementById('estado');
    if (estadoElement) {
        estadoElement.textContent = mensaje;
    }
}

// Función para verificar colisiones
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
            if (btnJugarManual) btnJugarManual.disabled = false;
            if (btnPausar) btnPausar.disabled = true;
            setTimeout(() => {
                alert(`¡Game Over! Puntuación final: ${puntuacion}`);
            }, 100);
        }
    }
}

// Movimiento de personajes
function moverPersonaje(personaje, xActual, yActual, xNuevo, yNuevo) {
    if (!juegoActivo || juegoPausado) return;
    
    if (xActual < 0 || xActual >= filas || yActual < 0 || yActual >= columnas) return;
    if (xNuevo < 0 || xNuevo >= filas || yNuevo < 0 || yNuevo >= columnas) return;
    
    const celdaActual = matrizObjetos[xActual][yActual];
    if (!celdaActual) return;
    
    const indiceActual = celdaActual.personajes.indexOf(personaje);
    if (indiceActual > -1) {
        celdaActual.personajes.splice(indiceActual, 1);
    }
    
    const celdaNueva = matrizObjetos[xNuevo][yNuevo];
    if (!celdaNueva) return;
    
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
        
        verificarColisionPacmanFantasma();
    } else if (['A','B','C','D'].includes(personaje)) {
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

// Funciones de movimiento para fantasmas
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

function obtenerMejorDireccion(fantasma, x, y, objetivoX, objetivoY) {
    const direcciones = [];
    const vistaActual = vistaFantasmas[fantasma];
    
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
    
    if (fantasmasVulnerables) {
        direcciones.sort((a, b) => b.distancia - a.distancia);
    } else {
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
            objetivoX = 1;
            objetivoY = 1;
        } else {
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
            objetivoX = 1;
            objetivoY = columnas - 2;
        } else {
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
            objetivoX = filas - 2;
            objetivoY = 1;
        } else {
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
            objetivoX = filas - 2;
            objetivoY = columnas - 2;
        } else if (distancia < 8) {
            objetivoX = filas - 2;
            objetivoY = columnas - 2;
        } else {
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
        
        moverFantasmaA();
        moverFantasmaB();
        moverFantasmaC();
        moverFantasmaD();
        
        render();
    }, 500);
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
        if (btnPausar) btnPausar.textContent = 'Reanudar';
        actualizarEstadoUI('Juego en pausa');
    } else {
        if (btnPausar) btnPausar.textContent = 'Pausar';
        actualizarEstadoUI('Juego en curso - Usa las flechas para mover a Pacman');
    }
    
    render();
}

// ================================
// ALGORITMO GENÉTICO
// ================================

class AlgoritmoGenetico {
    constructor(config) {
        this.config = {
            poblacion: config.poblacion || 20,
            generaciones: config.generaciones || 50,
            tasaSeleccion: config.tasaSeleccion || 0.6,
            tasaCruzamiento: config.tasaCruzamiento || 0.3,
            tasaMutacion: config.tasaMutacion || 0.1,
            semilla: config.semilla || 12345,
            episodiosPorIndividuo: config.episodiosPorIndividuo || 1,
            maxPasos: config.maxPasos || 1000,
            tamanoTorneo: config.tamanoTorneo || 3,
            elitismo: config.elitismo !== undefined ? config.elitismo : true
        };
        
        this.generadorAleatorio = this.crearGeneradorAleatorio(this.config.semilla.toString());
        this.poblacion = [];
        this.mejorIndividuo = null;
        this.mejorFitness = -Infinity;
        this.mejorPuntuacion = 0;
        this.historialFitness = [];
        this.generacionActual = 0;
        this.ejecutando = false;
        this.tiempoInicio = 0;
        
        this.inicializarPoblacion();
    }
    
    crearGeneradorAleatorio(seed) {
        let valor = this.hashString(seed);
        return function() {
            valor = (valor * 9301 + 49297) % 233280;
            return valor / 233280;
        };
    }
    
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }
    
    // Codificación: Vector de pesos para reglas heurísticas
    inicializarPoblacion() {
        this.poblacion = [];
        for (let i = 0; i < this.config.poblacion; i++) {
            const individuo = {
                id: i,
                pesos: {
                    pesoPellets: this.numeroAleatorio(-1, 1),
                    pesoPelletsEspeciales: this.numeroAleatorio(-1, 1),
                    pesoEvitarFantasmas: this.numeroAleatorio(-1, 1),
                    pesoPerseguirFantasmas: this.numeroAleatorio(-1, 1),
                    pesoExploracion: this.numeroAleatorio(-1, 1),
                    pesoMovimiento: this.numeroAleatorio(-1, 1),
                    pesoSeguridad: this.numeroAleatorio(-1, 1)
                },
                fitness: 0,
                puntuacion: 0,
                tiempoSobrevivido: 0,
                pasos: 0,
                historial: [],
                mejorHistorial: null // NUEVO: para guardar la mejor partida
            };
            this.poblacion.push(individuo);
        }
    }
    
    numeroAleatorio(min, max) {
        return min + (max - min) * this.generadorAleatorio();
    }
    
    // MODIFICADO: evaluarIndividuo para GUARDAR el historial
    async evaluarIndividuo(individuo) {
        let fitnessTotal = 0;
        let puntuacionTotal = 0;
        let tiempoTotal = 0;
        let mejorHistorial = null;
        let mejorPuntuacionEpisodio = 0;
        
        for (let episodio = 0; episodio < this.config.episodiosPorIndividuo; episodio++) {
            const motor = new MotorPacmanSilencioso();
            let pasos = 0;
            let fitnessEpisodio = 0;
            let ultimaPuntuacion = 0;
            let pasosSinComer = 0;
            
            while (motor.juegoActivo && pasos < this.config.maxPasos) {
                const estado = motor.obtenerEstado();
                if (!estado) break;
                
                const accion = this.decidirAccion(individuo, estado, motor);
                motor.ejecutarPaso(accion);
                pasos++;
                
                const recompensaIncremental = this.calcularRecompensaIncremental(
                    motor, ultimaPuntuacion, pasosSinComer
                );
                
                fitnessEpisodio += recompensaIncremental;
                ultimaPuntuacion = motor.puntuacion;
                
                if (motor.puntuacion > ultimaPuntuacion) {
                    pasosSinComer = 0;
                } else {
                    pasosSinComer++;
                }
                
                if (pasosSinComer > 20) {
                    fitnessEpisodio -= 0.1;
                }
            }
            
            fitnessEpisodio += this.calcularRecompensasFinales(motor);
            
            // GUARDAR el mejor historial del episodio
            if (motor.puntuacion > mejorPuntuacionEpisodio) {
                mejorHistorial = motor.obtenerHistorialCompleto();
                mejorPuntuacionEpisodio = motor.puntuacion;
            }
            
            fitnessTotal += fitnessEpisodio;
            puntuacionTotal += motor.puntuacion;
            tiempoTotal += pasos;
            
            individuo.historial.push({
                episodio,
                fitness: fitnessEpisodio,
                puntuacion: motor.puntuacion,
                pasos: pasos,
                tiempoSobrevivido: pasos
            });
        }
        
        individuo.fitness = fitnessTotal / this.config.episodiosPorIndividuo;
        individuo.puntuacion = puntuacionTotal / this.config.episodiosPorIndividuo;
        individuo.tiempoSobrevivido = tiempoTotal / this.config.episodiosPorIndividuo;
        individuo.pasos = tiempoTotal / this.config.episodiosPorIndividuo;
        individuo.mejorHistorial = mejorHistorial; // GUARDAR mejor partida
        
        return individuo.fitness;
    }
    
    decidirAccion(individuo, estado, motor) {
        const acciones = ['derecha', 'izquierda', 'arriba', 'abajo'];
        let mejorAccion = acciones[0];
        let mejorValor = -Infinity;
        
        for (const accion of acciones) {
            const valor = this.evaluarAccion(individuo, estado, accion, motor);
            if (valor > mejorValor) {
                mejorValor = valor;
                mejorAccion = accion;
            }
        }
        
        return mejorAccion;
    }
    
    evaluarAccion(individuo, estado, accion, motor) {
        const posPacman = estado.posPacman;
        let nuevaPos = [...posPacman];
        
        switch(accion) {
            case 'derecha': nuevaPos[1]++; break;
            case 'izquierda': nuevaPos[1]--; break;
            case 'arriba': nuevaPos[0]--; break;
            case 'abajo': nuevaPos[0]++; break;
        }
        
        if (!motor.puedeMoverse(nuevaPos[0], nuevaPos[1])) {
            return -Infinity;
        }
        
        let valor = 0;
        const { pesos } = individuo;
        
        const pelletsDireccion = this.contarPelletsEnDireccion(motor, nuevaPos, 3);
        valor += pesos.pesoPellets * pelletsDireccion.puntosNormales;
        valor += pesos.pesoPelletsEspeciales * pelletsDireccion.pelletsEspeciales;
        
        const distanciaFantasmaMasCercano = estado.fantasmaMasCercano;
        if (estado.fantasmasVulnerables) {
            valor += pesos.pesoPerseguirFantasmas * (10 - distanciaFantasmaMasCercano);
        } else {
            valor += pesos.pesoEvitarFantasmas * distanciaFantasmaMasCercano;
        }
        
        const seguridad = this.calcularSeguridad(motor, nuevaPos);
        valor += pesos.pesoSeguridad * seguridad;
        
        valor += pesos.pesoMovimiento * 0.1;
        
        const exploracion = this.calcularPotencialExploracion(motor, nuevaPos);
        valor += pesos.pesoExploracion * exploracion;
        
        return valor;
    }
    
    contarPelletsEnDireccion(motor, pos, radio) {
        let puntosNormales = 0;
        let pelletsEspeciales = 0;
        
        for (let i = Math.max(0, pos[0] - radio); i <= Math.min(filas-1, pos[0] + radio); i++) {
            for (let j = Math.max(0, pos[1] - radio); j <= Math.min(columnas-1, pos[1] + radio); j++) {
                if (motor.matrizObjetos[i] && motor.matrizObjetos[i][j]) {
                    if (motor.matrizObjetos[i][j].puntoNormal) puntosNormales++;
                    if (motor.matrizObjetos[i][j].pelletEspecial) pelletsEspeciales++;
                }
            }
        }
        
        return { puntosNormales, pelletsEspeciales };
    }
    
    calcularSeguridad(motor, pos) {
        let seguridad = 0;
        const fantasmas = ['A', 'B', 'C', 'D'];
        
        for (const fantasma of fantasmas) {
            const posFantasma = motor.encontrarPosicion(fantasma);
            if (posFantasma) {
                const distancia = this.calcularDistancia(pos, posFantasma);
                if (distancia < 3) {
                    seguridad -= (3 - distancia);
                }
            }
        }
        
        return Math.max(-5, seguridad);
    }
    
    calcularPotencialExploracion(motor, pos) {
        const pellets = this.contarPelletsEnDireccion(motor, pos, 5);
        return (pellets.puntosNormales + pellets.pelletsEspeciales * 2) / 10;
    }
    
    calcularDistancia(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
    }
    
    calcularRecompensaIncremental(motor, ultimaPuntuacion, pasosSinComer) {
        let recompensa = 0;
        
        const diferenciaPuntuacion = motor.puntuacion - ultimaPuntuacion;
        if (diferenciaPuntuacion > 0) {
            if (diferenciaPuntuacion === 10) {
                recompensa += 1;
            } else if (diferenciaPuntuacion === 50) {
                recompensa += 5;
            } else if (diferenciaPuntuacion === 200) {
                recompensa += 20;
            }
        }
        
        recompensa += 0.01;
        
        if (pasosSinComer > 10) {
            recompensa -= 0.05;
        }
        
        return recompensa;
    }
    
    calcularRecompensasFinales(motor) {
        let recompensa = 0;
        
        recompensa += motor.puntuacion * 0.1;
        
        const totalPellets = this.contarPelletsTotales();
        if (motor.puntosRecolectados >= totalPellets * 0.8) {
            recompensa += 100;
        }
        
        const eficiencia = motor.puntuacion / Math.max(1, motor.tiempo);
        recompensa += eficiencia * 2;
        
        recompensa += motor.fantasmasComidos * 50;
        
        recompensa += motor.pelletsEspecialesRecolectados * 10;
        
        return recompensa;
    }
    
    contarPelletsTotales() {
        let total = 0;
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (matrizObjetos[i] && matrizObjetos[i][j]) {
                    if (matrizObjetos[i][j].puntoNormal || matrizObjetos[i][j].pelletEspecial) {
                        total++;
                    }
                }
            }
        }
        return total;
    }
    
    seleccionar() {
    const seleccionados = [];
    const tamanoPoblacion = Math.floor(this.config.poblacion * this.config.tasaSeleccion);
    
    // Mezcla la población para mayor diversidad
    const poblacionMezclada = [...this.poblacion].sort(() => this.numeroAleatorio(-1, 1));
    
    // Selección por ranking (no solo los mejores)
    for (let i = 0; i < tamanoPoblacion; i++) {
        const indice = Math.floor(Math.pow(this.numeroAleatorio(0, 1), 2) * poblacionMezclada.length);
        seleccionados.push(poblacionMezclada[indice]);
    }
    
    return seleccionados;
}
    
    cruzar(padre1, padre2) {
        const hijo = {
            id: Date.now() + this.numeroAleatorio(0, 1000),
            pesos: {},
            fitness: 0,
            puntuacion: 0,
            tiempoSobrevivido: 0,
            pasos: 0,
            historial: [],
            mejorHistorial: null
        };
        
        const genes = Object.keys(padre1.pesos);
        const punto1 = Math.floor(this.numeroAleatorio(1, genes.length - 2));
        const punto2 = Math.floor(this.numeroAleatorio(punto1 + 1, genes.length - 1));
        
        for (let i = 0; i < genes.length; i++) {
            if (i < punto1) {
                hijo.pesos[genes[i]] = padre1.pesos[genes[i]];
            } else if (i < punto2) {
                hijo.pesos[genes[i]] = padre2.pesos[genes[i]];
            } else {
                hijo.pesos[genes[i]] = padre1.pesos[genes[i]];
            }
        }
        
        return hijo;
    }
    
    // REEMPLAZA tu método mutar con esta versión mejorada:
mutar(individuo) {
    const mutado = {...individuo};
    mutado.pesos = {...individuo.pesos};
    
    // Mutación normal
    for (const gen in mutado.pesos) {
        if (this.numeroAleatorio(0, 1) < this.config.tasaMutacion) {
            const mutacion = this.numeroAleatorio(-1.0, 1.0); // Rango mayor
            mutado.pesos[gen] = Math.max(-3, Math.min(3, mutado.pesos[gen] + mutacion));
        }
    }
    
    // Mutación ocasional radical (10% de chance)
    if (this.numeroAleatorio(0, 1) < 0.1) {
        const genAleatorio = Object.keys(mutado.pesos)[
            Math.floor(this.numeroAleatorio(0, Object.keys(mutado.pesos).length))
        ];
        mutado.pesos[genAleatorio] = this.numeroAleatorio(-2, 2); // Reset completo
    }
    
    return mutado;
}
    
    async ejecutarGeneracion() {
    if (!this.ejecutando) return;
    
    console.log(`=== Generación ${this.generacionActual + 1} ===`);
    
    // 1. Evaluar TODOS los individuos y calcular suma ANTES de ordenar
    let sumaFitness = 0;
    let sumaPuntuacion = 0;
    
    for (const individuo of this.poblacion) {
        await this.evaluarIndividuo(individuo);
        sumaFitness += individuo.fitness;
        sumaPuntuacion += individuo.puntuacion;
    }
    
    // 2. Calcular promedios ANTES de ordenar
    const promedioFitness = sumaFitness / this.poblacion.length;
    const promedioPuntuacion = sumaPuntuacion / this.poblacion.length;
    
    // 3. DEBUG: Verificar distribución real
    console.log('📊 ESTADÍSTICAS REALES:');
    const fitnessValues = this.poblacion.map(ind => ind.fitness);
    console.log(`   Mejor fitness: ${Math.max(...fitnessValues).toFixed(2)}`);
    console.log(`   Peor fitness: ${Math.min(...fitnessValues).toFixed(2)}`);
    console.log(`   Promedio fitness: ${promedioFitness.toFixed(2)}`);
    console.log(`   Diferencia mejor-promedio: ${(Math.max(...fitnessValues) - promedioFitness).toFixed(2)}`);
    
    // 4. Ahora sí ordenar para encontrar el mejor
    this.poblacion.sort((a, b) => b.fitness - a.fitness);
    
    if (this.poblacion[0].fitness > this.mejorFitness) {
        this.mejorFitness = this.poblacion[0].fitness;
        this.mejorPuntuacion = this.poblacion[0].puntuacion;
        this.mejorIndividuo = JSON.parse(JSON.stringify(this.poblacion[0]));
        console.log(`🎯 NUEVO MEJOR: Fitness=${this.mejorFitness.toFixed(2)}, Puntuación=${this.mejorPuntuacion}`);
    }
    
    // 5. Guardar en historial con promedios correctos
    this.historialFitness.push({
        generacion: this.generacionActual,
        mejor: this.poblacion[0].fitness,
        promedio: promedioFitness,  // ¡CORRECTO ahora!
        mejorPuntuacion: this.poblacion[0].puntuacion,
        promedioPuntuacion: promedioPuntuacion  // Nuevo: promedio de puntuación también
    });
    
    this.actualizarInterfaz();
    
    if (this.generacionActual < this.config.generaciones - 1) {
        this.aplicarOperadoresGeneticos();
        this.generacionActual++;
        
        if (this.ejecutando) {
            setTimeout(() => this.ejecutarGeneracion(), 100);
        }
    } else {
        this.finalizarEvolucion();
    }
}

// MANTENEMOS aplicarOperadoresGeneticos() IGUAL:
aplicarOperadoresGeneticos() {
    const nuevaPoblacion = [];
    
    if (this.config.elitismo && this.generacionActual % 5 === 0) { // Cada 5 generaciones
        nuevaPoblacion.push({...this.poblacion[0]});
        if (this.poblacion.length > 1) {
            nuevaPoblacion.push({...this.poblacion[1]}); // Segundo mejor también
        }
    }
    
    const seleccionados = this.seleccionar();
    
    while (nuevaPoblacion.length < this.config.poblacion) {
        if (seleccionados.length >= 2 && this.numeroAleatorio(0, 1) < this.config.tasaCruzamiento) {
            const padre1 = seleccionados[Math.floor(this.numeroAleatorio(0, seleccionados.length))];
            const padre2 = seleccionados[Math.floor(this.numeroAleatorio(0, seleccionados.length))];
            const hijo = this.cruzar(padre1, padre2);
            nuevaPoblacion.push(hijo);
        } else if (seleccionados.length > 0) {
            const individuo = seleccionados[Math.floor(this.numeroAleatorio(0, seleccionados.length))];
            nuevaPoblacion.push({...individuo});
        } else {
            const individuo = {
                id: Date.now() + this.numeroAleatorio(0, 1000),
                pesos: {},
                fitness: 0,
                puntuacion: 0,
                tiempoSobrevivido: 0,
                pasos: 0,
                historial: [],
                mejorHistorial: null
            };
            
            const genes = ['pesoPellets', 'pesoPelletsEspeciales', 'pesoEvitarFantasmas', 
                          'pesoPerseguirFantasmas', 'pesoExploracion', 'pesoMovimiento', 'pesoSeguridad'];
            genes.forEach(gen => {
                individuo.pesos[gen] = this.numeroAleatorio(-1, 1);
            });
            
            nuevaPoblacion.push(individuo);
        }
    }
    
    for (let i = (this.config.elitismo ? 1 : 0); i < nuevaPoblacion.length; i++) {
        if (this.numeroAleatorio(0, 1) < this.config.tasaMutacion) {
            nuevaPoblacion[i] = this.mutar(nuevaPoblacion[i]);
        }
    }
    
    this.poblacion = nuevaPoblacion.slice(0, this.config.poblacion);
}
    
    actualizarInterfaz() {
        const estadoAG = document.getElementById('estado-ag');
        const progresoAG = document.getElementById('progreso-ag');
        const generacionActual = document.getElementById('generacionActual');
        const totalGeneraciones = document.getElementById('totalGeneraciones');
        const mejorFitnessElem = document.getElementById('mejorFitness');
        const promedioFitnessElem = document.getElementById('promedioFitness');
        const mejorPuntuacionElem = document.getElementById('mejorPuntuacion');
        const tiempoTotalElem = document.getElementById('tiempoTotal');
        const tiempoGeneracionElem = document.getElementById('tiempoGeneracion');
        
        if (estadoAG) {
            estadoAG.textContent = this.ejecutando ? 
                `Ejecutando - Generación ${this.generacionActual + 1}` : 
                'Completado';
        }
        
        if (progresoAG) {
            const porcentaje = ((this.generacionActual + 1) / this.config.generaciones * 100).toFixed(1);
            progresoAG.textContent = `Progreso: ${porcentaje}% (${this.generacionActual + 1}/${this.config.generaciones})`;
        }
        
        if (generacionActual) generacionActual.textContent = this.generacionActual + 1;
        if (totalGeneraciones) totalGeneraciones.textContent = this.config.generaciones;
        
        if (mejorFitnessElem) {
            mejorFitnessElem.textContent = this.mejorFitness !== -Infinity ? 
                this.mejorFitness.toFixed(2) : '0.00';
        }
        
        if (promedioFitnessElem && this.historialFitness.length > 0) {
            const ultimaGen = this.historialFitness[this.historialFitness.length - 1];
            promedioFitnessElem.textContent = ultimaGen.promedio.toFixed(2);
        }
        
        if (mejorPuntuacionElem) {
            mejorPuntuacionElem.textContent = this.mejorPuntuacion;
        }
        
        const tiempoTranscurrido = (Date.now() - this.tiempoInicio) / 1000;
        if (tiempoTotalElem) tiempoTotalElem.textContent = tiempoTranscurrido.toFixed(1);
        
        if (tiempoGeneracionElem && this.generacionActual > 0) {
            const tiempoPorGen = (tiempoTranscurrido / (this.generacionActual + 1)) * 1000;
            tiempoGeneracionElem.textContent = Math.round(tiempoPorGen);
        }
        
        this.dibujarGraficoFitness();
    }
    
    dibujarGraficoFitness() {
        const canvas = document.getElementById('graficoFitness');
        if (!canvas || this.historialFitness.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 20;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        
        const maxFitness = Math.max(...this.historialFitness.map(h => h.mejor));
        const minFitness = Math.min(...this.historialFitness.map(h => h.promedio));
        const rangoFitness = maxFitness - minFitness || 1;
        
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        const puntosMejor = [];
        const puntosPromedio = [];
        
        this.historialFitness.forEach((hist, i) => {
            const x = padding + (i / (this.config.generaciones - 1)) * (width - 2 * padding);
            const yMejor = height - padding - ((hist.mejor - minFitness) / rangoFitness) * (height - 2 * padding);
            const yPromedio = height - padding - ((hist.promedio - minFitness) / rangoFitness) * (height - 2 * padding);
            
            puntosMejor.push({x, y: yMejor});
            puntosPromedio.push({x, y: yPromedio});
        });
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(puntosMejor[0].x, puntosMejor[0].y);
        puntosMejor.forEach(punto => ctx.lineTo(punto.x, punto.y));
        ctx.stroke();
        
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(puntosPromedio[0].x, puntosPromedio[0].y);
        puntosPromedio.forEach(punto => ctx.lineTo(punto.x, punto.y));
        ctx.stroke();
        
        ctx.fillStyle = '#00ff00';
        ctx.fillText('Mejor', width - 80, padding + 15);
        ctx.fillStyle = '#ffff00';
        ctx.fillText('Promedio', width - 80, padding + 30);
    }
    
    iniciarEvolucion() {
        if (this.ejecutando) return;
        
        this.ejecutando = true;
        this.tiempoInicio = Date.now();
        
        if (!this.validarConfiguracion()) {
            this.ejecutando = false;
            return;
        }
        
        this.actualizarBotones(true);
        this.ejecutarGeneracion();
    }
    
    pausarEvolucion() {
        this.ejecutando = false;
        this.actualizarBotones(false);
        
        const estadoAG = document.getElementById('estado-ag');
        if (estadoAG) estadoAG.textContent = 'Pausado';
    }
    
    reanudarEvolucion() {
        if (this.generacionActual >= this.config.generaciones) return;
        
        this.ejecutando = true;
        this.actualizarBotones(true);
        this.ejecutarGeneracion();
    }
    
    reiniciarEvolucion() {
        this.ejecutando = false;
        this.generacionActual = 0;
        this.mejorFitness = -Infinity;
        this.mejorPuntuacion = 0;
        this.mejorIndividuo = null;
        this.historialFitness = [];
        
        const nuevaSemilla = parseInt(document.getElementById('inputSemilla').value) || Date.now();
        this.config.semilla = nuevaSemilla;
        this.generadorAleatorio = this.crearGeneradorAleatorio(this.config.semilla.toString());
        
        this.inicializarPoblacion();
        this.actualizarInterfaz();
        this.actualizarBotones(false);
        
        const estadoAG = document.getElementById('estado-ag');
        if (estadoAG) estadoAG.textContent = 'Reiniciado - Listo para iniciar';
    }
    
    finalizarEvolucion() {
        this.ejecutando = false;
        this.actualizarBotones(false);
        
        const estadoAG = document.getElementById('estado-ag');
        if (estadoAG) {
            estadoAG.textContent = `Evolución completada - Mejor: ${this.mejorFitness.toFixed(2)} - Puntuación: ${this.mejorPuntuacion}`;
        }
        
        const btnExportar = document.getElementById('btnExportarMejor');
        const btnDemo = document.getElementById('btnDemoMejor');
        if (btnExportar) btnExportar.disabled = false;
        if (btnDemo) btnDemo.disabled = false;
        
        console.log('=== EVOLUCIÓN COMPLETADA ===');
        console.log('Mejor fitness:', this.mejorFitness);
        console.log('Mejor puntuación:', this.mejorPuntuacion);
        console.log('¿Tiene historial?', !!this.mejorIndividuo?.mejorHistorial);
        console.log('Pasos en historial:', this.mejorIndividuo?.mejorHistorial?.length);
        console.log('Generaciones ejecutadas:', this.generacionActual);
console.log('Tiempo total:', ((Date.now() - this.tiempoInicio) / 1000).toFixed(1) + 's');
    }
    
    validarConfiguracion() {
        const seleccion = parseFloat(document.getElementById('inputSeleccion').value) || 0;
        const cruzamiento = parseFloat(document.getElementById('inputCruzamiento').value) || 0;
        const mutacion = parseFloat(document.getElementById('inputMutacion').value) || 0;
        
        const suma = seleccion + cruzamiento + mutacion;
        const validacionElem = document.getElementById('validacion-sumatoria');
        const sumaActualElem = document.getElementById('suma-actual');
        
        if (Math.abs(suma - 100) > 0.1) {
            if (validacionElem) validacionElem.style.display = 'block';
            if (sumaActualElem) sumaActualElem.textContent = suma.toFixed(1);
            return false;
        } else {
            if (validacionElem) validacionElem.style.display = 'none';
            return true;
        }
    }
    
    actualizarBotones(ejecutando) {
        const btnIniciar = document.getElementById('btnIniciarAG');
        const btnPausar = document.getElementById('btnPausarAG');
        const btnReiniciar = document.getElementById('btnReiniciarAG');
        
        if (btnIniciar) btnIniciar.disabled = ejecutando;
        if (btnPausar) {
            btnPausar.disabled = !ejecutando;
            btnPausar.textContent = ejecutando ? 'Pausar' : 'Reanudar';
        }
        if (btnReiniciar) btnReiniciar.disabled = ejecutando;
    }
    
    exportarMejorIndividuo() {
        if (!this.mejorIndividuo) return;
        
        const datos = {
            mejorIndividuo: this.mejorIndividuo,
            configuracion: this.config,
            historialFitness: this.historialFitness,
            fechaExportacion: new Date().toISOString(),
            estadisticas: {
                mejorFitness: this.mejorFitness,
                mejorPuntuacion: this.mejorPuntuacion,
                totalGeneraciones: this.config.generaciones,
                poblacion: this.config.poblacion
            }
        };
        
        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mejor_individuo_pacman_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Mejor individuo exportado correctamente!');
    }
    
    ejecutarDemoMejorIndividuo() {
        if (!this.mejorIndividuo || !this.mejorIndividuo.mejorHistorial) {
            alert('No hay un mejor individuo con historial para mostrar. Ejecuta primero el algoritmo genético.');
            return;
        }
        
        console.log('Reproduciendo demo EXACTA del mejor individuo...');
        console.log('Puntuación original:', this.mejorIndividuo.puntuacion);
        console.log('Pasos en historial:', this.mejorIndividuo.mejorHistorial.length);
        
        reproducirDemoExacta(this.mejorIndividuo.mejorHistorial, this.mejorIndividuo.puntuacion);
    }
}

// ================================
// FUNCIONES PARA DEMO EXACTA
// ================================

// FUNCIÓN PARA REPRODUCIR DEMO EXACTA
function reproducirDemoExacta(historialMovimientos, puntuacionOriginal) {
    if (!historialMovimientos || historialMovimientos.length === 0) {
        alert('No hay historial para reproducir');
        return;
    }
    
    detenerDemo();
    
    demoActiva = true;
    
    document.getElementById('btnDemoMejor').disabled = true;
    document.getElementById('btnIniciarAG').disabled = true;
    document.getElementById('btnJugarManual').disabled = true;
    
    const btnDetenerDemo = document.getElementById('btnDetenerDemo');
    if (btnDetenerDemo) btnDetenerDemo.style.display = 'inline-block';
    
    let indiceActual = 0;
    
    function reproducirPaso() {
        if (!demoActiva || indiceActual >= historialMovimientos.length) {
            detenerDemo();
            setTimeout(() => {
                alert(`Demo EXACTA completada!\nPuntuación original: ${puntuacionOriginal}\nPasos reproducidos: ${indiceActual}`);
            }, 500);
            return;
        }
        
        const estado = historialMovimientos[indiceActual];
        
        actualizarJuegoDesdeHistorial(estado);
        
        render();
        
        actualizarEstadoUI(`Demo EXACTA - Paso: ${indiceActual + 1}/${historialMovimientos.length} - Puntuación: ${estado.puntuacion}`);
        
        indiceActual++;
        
        if (demoActiva) {
            intervaloDemo = setTimeout(reproducirPaso, 200);
        }
    }
    
    reproducirPaso();
}

// FUNCIÓN PARA ACTUALIZAR JUEGO DESDE HISTORIAL
function actualizarJuegoDesdeHistorial(estadoHistorial) {
    if (!estadoHistorial) return;
    
    matrizObjetos = estadoHistorial.matriz;
    puntuacion = estadoHistorial.puntuacion;
    fantasmasVulnerables = estadoHistorial.fantasmasVulnerables;
    
    if (fantasmasVulnerables && !intervaloVulnerable) {
        tiempoVulnerable = 10;
        intervaloVulnerable = setInterval(() => {
            tiempoVulnerable -= 1;
            if (tiempoVulnerable <= 0) {
                fantasmasVulnerables = false;
                clearInterval(intervaloVulnerable);
            }
        }, 1000);
    }
    
    if (!juegoActivo) {
        juegoActivo = true;
    }
}

function detenerDemo() {
    demoActiva = false;
    if (intervaloDemo) {
        clearTimeout(intervaloDemo);
        intervaloDemo = null;
    }
    
    document.getElementById('btnDemoMejor').disabled = false;
    document.getElementById('btnIniciarAG').disabled = false;
    document.getElementById('btnJugarManual').disabled = false;
    
    const btnDetenerDemo = document.getElementById('btnDetenerDemo');
    if (btnDetenerDemo) btnDetenerDemo.style.display = 'none';
    
    actualizarEstadoUI('Demo finalizada');
    
    if (!juegoActivo) {
        inicializarJuego();
    } else {
        render();
    }
}

// Función para detener demo desde botones externos
function detenerDemoManual() {
    if (demoActiva) {
        detenerDemo();
        if (juegoActivo) {
            render();
            actualizarEstadoUI('Demo detenida - Juego listo');
        }
    }
}

// ================================
// INTEGRACIÓN CON LA INTERFAZ
// ================================

let agInstance = null;
let btnJugarManual, btnPausar, btnReiniciar;

document.addEventListener('DOMContentLoaded', function() {
    btnJugarManual = document.getElementById('btnJugarManual');
    btnPausar = document.getElementById('btnPausar');
    btnReiniciar = document.getElementById('btnReiniciar');
    
    if (!document.getElementById('btnDetenerDemo')) {
        const btnDetenerDemo = document.createElement('button');
        btnDetenerDemo.textContent = 'Detener Demo';
        btnDetenerDemo.id = 'btnDetenerDemo';
        btnDetenerDemo.style.display = 'none';
        btnDetenerDemo.addEventListener('click', detenerDemoManual);
        
        const btnDemoMejor = document.getElementById('btnDemoMejor');
        if (btnDemoMejor && btnDemoMejor.parentNode) {
            btnDemoMejor.parentNode.insertBefore(btnDetenerDemo, btnDemoMejor.nextSibling);
        }
    }
    
    if (btnJugarManual) {
        btnJugarManual.addEventListener('click', function() {
            inicializarJuego();
            iniciarMovimientoFantasmas();
        });
    }
    
    if (btnPausar) {
        btnPausar.addEventListener('click', togglePausa);
    }
    
    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', function() {
            inicializarJuego();
            if (!juegoPausado) {
                iniciarMovimientoFantasmas();
            }
        });
    }
    
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
    
    const btnIniciarAG = document.getElementById('btnIniciarAG');
    const btnPausarAG = document.getElementById('btnPausarAG');
    const btnReiniciarAG = document.getElementById('btnReiniciarAG');
    const btnExportarMejor = document.getElementById('btnExportarMejor');
    const btnDemoMejor = document.getElementById('btnDemoMejor');
    
    btnIniciarAG.addEventListener('click', function() {
        const config = {
            poblacion: parseInt(document.getElementById('inputPoblacion').value) || 20,
            generaciones: parseInt(document.getElementById('inputGeneraciones').value) || 50,
            tasaSeleccion: (parseFloat(document.getElementById('inputSeleccion').value) || 60) / 100,
            tasaCruzamiento: (parseFloat(document.getElementById('inputCruzamiento').value) || 30) / 100,
            tasaMutacion: (parseFloat(document.getElementById('inputMutacion').value) || 10) / 100,
            semilla: parseInt(document.getElementById('inputSemilla').value) || 12345,
            episodiosPorIndividuo: 1,
            maxPasos: 1000,
            tamanoTorneo: 3,
            elitismo: true
        };
        
        agInstance = new AlgoritmoGenetico(config);
        agInstance.iniciarEvolucion();
    });
    
    btnPausarAG.addEventListener('click', function() {
        if (agInstance) {
            if (agInstance.ejecutando) {
                agInstance.pausarEvolucion();
            } else {
                agInstance.reanudarEvolucion();
            }
        }
    });
    
    btnReiniciarAG.addEventListener('click', function() {
        if (agInstance) {
            agInstance.reiniciarEvolucion();
        }
    });
    
    btnExportarMejor.addEventListener('click', function() {
        if (agInstance) {
            agInstance.exportarMejorIndividuo();
        }
    });
    
    btnDemoMejor.addEventListener('click', function() {
        if (agInstance) {
            agInstance.ejecutarDemoMejorIndividuo();
        }
    });
    
    const inputsTasas = ['inputSeleccion', 'inputCruzamiento', 'inputMutacion'];
    inputsTasas.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', validarTasas);
        }
    });
    
    function validarTasas() {
        const seleccion = parseFloat(document.getElementById('inputSeleccion').value) || 0;
        const cruzamiento = parseFloat(document.getElementById('inputCruzamiento').value) || 0;
        const mutacion = parseFloat(document.getElementById('inputMutacion').value) || 0;
        
        const suma = seleccion + cruzamiento + mutacion;
        const validacionElem = document.getElementById('validacion-sumatoria');
        const sumaActualElem = document.getElementById('suma-actual');
        const btnIniciar = document.getElementById('btnIniciarAG');
        
        if (Math.abs(suma - 100) > 0.1) {
            if (validacionElem) validacionElem.style.display = 'block';
            if (sumaActualElem) sumaActualElem.textContent = suma.toFixed(1);
            if (btnIniciar) btnIniciar.disabled = true;
        } else {
            if (validacionElem) validacionElem.style.display = 'none';
            if (btnIniciar) btnIniciar.disabled = false;
        }
    }
    
    actualizarEstadoUI('Presiona "Jugar Manualmente" para empezar');
    render();
    validarTasas();
});