// Matriz real del juego
const matrizReal = [  
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

class MotorPacmanSilencioso {
    constructor() {
        this.inicializar();
    }
    
    inicializar() {
        this.matrizObjetos = this.convertirMatriz(matrizReal);
        this.puntuacion = 0;
        this.juegoActivo = true;
        this.tiempo = 0;
        this.fantasmasVulnerables = false;
        this.tiempoVulnerable = 0;
        this.puntosRecolectados = 0;
        this.fantasmasComidos = 0;
        this.vidasPerdidas = 0;
        this.pelletsEspecialesRecolectados = 0;
        
        // Colocar personajes en posiciones iniciales
        this.moverPersonaje('P', 16, 10, 17, 10);
        this.moverPersonaje('A', 3, 2, 3, 2);
        this.moverPersonaje('B', 4, 15, 4, 15);
        this.moverPersonaje('C', 21, 6, 21, 6);
        this.moverPersonaje('D', 15, 13, 15, 13);
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
        if (xActual < 0 || xActual >= 24 || yActual < 0 || yActual >= 21) return;
        if (xNuevo < 0 || xNuevo >= 24 || yNuevo < 0 || yNuevo >= 21) return;
        
        const celdaActual = this.matrizObjetos[xActual][yActual];
        const celdaNueva = this.matrizObjetos[xNuevo][yNuevo];
        
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
            }
            
            if (celdaNueva.pelletEspecial) {
                celdaNueva.pelletEspecial = false;
                this.puntuacion += 50;
                this.activarPoder();
                this.pelletsEspecialesRecolectados++;
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
                        // Reubicar fantasma
                        setTimeout(() => {
                            switch(fantasma) {
                                case 'A': this.moverPersonaje('A', 0, 0, 3, 2); break;
                                case 'B': this.moverPersonaje('B', 0, 0, 4, 15); break;
                                case 'C': this.moverPersonaje('C', 0, 0, 21, 6); break;
                                case 'D': this.moverPersonaje('D', 0, 0, 15, 13); break;
                            }
                        }, 1000);
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
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 21; j++) {
                if (this.matrizObjetos[i] && this.matrizObjetos[i][j] && 
                    this.matrizObjetos[i][j].personajes.includes(personaje)) {
                    return [i, j];
                }
            }
        }
        return null;
    }
    
    puedeMoverse(x, y) {
        if (x < 0 || x >= 24 || y < 0 || y >= 21) return false;
        
        const celda = this.matrizObjetos[x][y];
        if (!celda) return false;
        
        // Verificar si es pared
        return celda.base !== 'O';
    }
    
    mover_Derecha(x, y) {
        const nuevaY = y + 1;
        if (nuevaY >= 21) return false;
        
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
        if (nuevaX >= 24) return false;
        
        if (this.puedeMoverse(nuevaX, y)) {
            this.moverPersonaje('P', x, y, nuevaX, y);
            return true;
        }
        return false;
    }
    
    moverFantasmas() {
        ['A', 'B', 'C', 'D'].forEach(fantasma => {
            const pos = this.encontrarPosicion(fantasma);
            if (!pos) return;
            
            const [x, y] = pos;
            const direcciones = [];
            
            if (this.puedeMoverse(x+1, y)) direcciones.push([x+1, y]);
            if (this.puedeMoverse(x-1, y)) direcciones.push([x-1, y]);
            if (this.puedeMoverse(x, y+1)) direcciones.push([x, y+1]);
            if (this.puedeMoverse(x, y-1)) direcciones.push([x, y-1]);
            
            if (direcciones.length > 0) {
                const dirAleatoria = direcciones[Math.floor(Math.random() * direcciones.length)];
                this.moverPersonaje(fantasma, x, y, dirAleatoria[0], dirAleatoria[1]);
            }
        });
        
        // Actualizar poder de fantasmas
        if (this.fantasmasVulnerables) {
            this.tiempoVulnerable--;
            if (this.tiempoVulnerable <= 0) {
                this.fantasmasVulnerables = false;
            }
        }
    }
    
    // EN ag.js - MODIFICAR la función ejecutarPaso del MotorPacmanSilencioso:

ejecutarPaso(direccion) {
    if (!this.juegoActivo) {
        console.log('❌ Juego ya no activo - no se puede mover');
        return false;
    }
    
    const posPacman = this.encontrarPosicion('P');
    if (!posPacman) {
        console.log('❌ No se encuentra Pacman');
        return false;
    }
    
    const [x, y] = posPacman;
    let seMovio = false;
    
    console.log(`📍 Pacman en [${x},${y}], intentando mover: ${direccion}`);
    
    switch(direccion) {
        case 'derecha': 
            seMovio = this.mover_Derecha(x, y); 
            break;
        case 'izquierda': 
            seMovio = this.mover_Izquierda(x, y); 
            break;
        case 'arriba': 
            seMovio = this.mover_Arriba(x, y); 
            break;
        case 'abajo': 
            seMovio = this.mover_Abajo(x, y); 
            break;
    }
    
    console.log(`➡️ Movimiento ${seMovio ? 'EXITOSO' : 'FALLIDO'}`);
    
    if (seMovio) {
        // Verificar estado después del movimiento
        const nuevaPos = this.encontrarPosicion('P');
        console.log(`🎯 Nueva posición: [${nuevaPos}]`);
        console.log(`📊 Puntuación: ${this.puntuacion}, Juego activo: ${this.juegoActivo}`);
        
        this.moverFantasmas();
        this.tiempo++;
        
        // Verificar si hay colisión después de mover fantasmas
        if (!this.juegoActivo) {
            console.log('💀 Pacman murió después de mover fantasmas');
        }
    }
    
    return seMovio;
}
}

class AlgoritmoGenetico {
    constructor(config) {
        this.config = config;
        this.poblacion = [];
        this.mejorIndividuo = null;
        this.mejorFitness = -Infinity;
        this.generacionActual = 0;
        this.historialFitness = [];
        this.corriendo = false;
        this.pausado = false;
        
        this.tiempoInicio = null;
        this.tiempoTotal = 0;
        this.tiemposGeneracion = [];
        
        this.inicializar();
    }

    inicializar() {
        this.poblacion = [];
        for (let i = 0; i < this.config.tamanoPoblacion; i++) {
            this.poblacion.push(this.crearIndividuo());
        }
        this.generacionActual = 0;
        this.historialFitness = [];
        this.mejorIndividuo = null;
        this.mejorFitness = -Infinity;
    }

    crearIndividuo() {
        const genes = {
            pesoPuntos: Math.random() * 2 - 1,
            pesoFantasmaCercano: Math.random() * 2 - 1,
            pesoPelletEspecial: Math.random() * 2 - 1,
            pesoExploracion: Math.random() * 2 - 1,
            pesoSupervivencia: Math.random() * 2 - 1,
            umbralHuir: Math.random(),
            umbralPerseguir: Math.random(),
            preferenciaHorizontal: Math.random() * 2 - 1,
            preferenciaVertical: Math.random() * 2 - 1
        };
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            genes: genes,
            fitness: 0,
            puntuacion: 0,
            tiempoVivo: 0,
            pasos: 0,
            puntosRecolectados: 0,
            fantasmasComidos: 0,
            vidasPerdidas: 0
        };
    }

    // 🔧 FUNCIONES AUXILIARES QUE FALTABAN
    calcularNuevaPosicion(pos, direccion) {
        const nuevaPos = { x: pos[0], y: pos[1] };
        switch(direccion) {
            case 'arriba': nuevaPos.x--; break;
            case 'abajo': nuevaPos.x++; break;
            case 'izquierda': nuevaPos.y--; break;
            case 'derecha': nuevaPos.y++; break;
        }
        return nuevaPos;
    }

    esMovimientoValido(pos) {
        // Validación básica de bordes
        return pos.x >= 1 && pos.x <= 22 && pos.y >= 1 && pos.y <= 19;
    }

    calcularDistancia(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    }

    obtenerPelletsCercanos(pos) {
        // Simulación básica de pellets cercanos
        const pellets = [];
        const radio = 3;
        
        for (let i = Math.max(1, pos.x - radio); i <= Math.min(22, pos.x + radio); i++) {
            for (let j = Math.max(1, pos.y - radio); j <= Math.min(19, pos.y + radio); j++) {
                // Simular que hay pellets en algunas posiciones
                if (Math.random() > 0.7 && this.esMovimientoValido({x: i, y: j})) {
                    pellets.push({ x: i, y: j });
                }
            }
        }
        return pellets;
    }

    obtenerPelletsEspecialesCercanos(pos) {
        // Posiciones fijas de pellets especiales (basado en tu matriz)
        const pelletsEspeciales = [
            {x: 2, y: 2}, {x: 2, y: 18},
            {x: 21, y: 2}, {x: 21, y: 18}
        ];
        
        return pelletsEspeciales.filter(pellet => {
            const distancia = this.calcularDistancia(pos, pellet);
            return distancia < 5; // Solo considerar cercanos
        });
    }

    encontrarPelletMasCercano(pos, pellets) {
        if (pellets.length === 0) return null;
        
        let pelletCercano = pellets[0];
        let minDistancia = this.calcularDistancia(pos, pellets[0]);
        
        for (const pellet of pellets) {
            const distancia = this.calcularDistancia(pos, pellet);
            if (distancia < minDistancia) {
                minDistancia = distancia;
                pelletCercano = pellet;
            }
        }
        
        return pelletCercano;
    }

    async evaluarIndividuo(individuo) {
        return new Promise((resolve) => {
            try {
                const motor = new MotorPacmanSilencioso();
                let pasos = 0;
                const maxPasos = 500; // Reducido para pruebas
                
                const evaluarStep = () => {
                    if (pasos >= maxPasos || !motor.juegoActivo) {
                        // Fitness simplificado
                        const fitness = motor.puntuacion + (motor.fantasmasComidos * 200);
                        
                        individuo.fitness = Math.max(0, fitness);
                        individuo.puntuacion = motor.puntuacion;
                        individuo.tiempoVivo = motor.tiempo;
                        individuo.pasos = pasos;
                        individuo.puntosRecolectados = motor.puntosRecolectados;
                        individuo.fantasmasComidos = motor.fantasmasComidos;
                        individuo.vidasPerdidas = motor.vidasPerdidas;
                        
                        resolve(individuo);
                        return;
                    }
                    
                    const estado = this.obtenerEstadoDelMotor(motor);
                    const accion = this.seleccionarAccion(individuo, estado);
                    motor.ejecutarPaso(accion);
                    pasos++;
                    
                    setTimeout(evaluarStep, 0);
                };
                
                evaluarStep();
            } catch (error) {
                console.error('Error evaluando individuo:', error);
                individuo.fitness = 0;
                resolve(individuo);
            }
        });
    }

    obtenerEstadoDelMotor(motor) {
        return {
            posPacman: motor.encontrarPosicion('P'),
            fantasmas: ['A','B','C','D'].map(f => motor.encontrarPosicion(f)).filter(p => p),
            fantasmasVulnerables: motor.fantasmasVulnerables,
            puntuacion: motor.puntuacion
        };
    }

    seleccionarAccion(individuo, estado) {
        const genes = individuo.genes;
        const posPacman = estado.posPacman;
        const fantasmas = estado.fantasmas;
        
        if (!posPacman) return 'derecha';
        
        const [x, y] = posPacman;
        const direcciones = ['arriba', 'abajo', 'izquierda', 'derecha'];
        
        // Filtrar direcciones válidas
        const direccionesValidas = direcciones.filter(dir => {
            const nuevaPos = this.calcularNuevaPosicion(posPacman, dir);
            return this.esMovimientoValido(nuevaPos);
        });
        
        if (direccionesValidas.length === 0) {
            return direcciones[Math.floor(Math.random() * direcciones.length)];
        }
        
        const puntuaciones = {};
        
        for (const dir of direccionesValidas) {
            let puntuacion = 0;
            const nuevaPos = this.calcularNuevaPosicion(posPacman, dir);
            
            // Preferencias de dirección
            if (dir === 'izquierda' || dir === 'derecha') {
                puntuacion += genes.preferenciaHorizontal * 2;
            } else {
                puntuacion += genes.preferenciaVertical * 2;
            }
            
            // Bono por movimiento válido
            puntuacion += 0.5;
            
            // Evaluar pellets
            const pelletsCercanos = this.obtenerPelletsCercanos(nuevaPos);
            if (pelletsCercanos.length > 0) {
                const pelletCercano = this.encontrarPelletMasCercano(nuevaPos, pelletsCercanos);
                const distancia = this.calcularDistancia(nuevaPos, pelletCercano);
                puntuacion += genes.pesoPuntos * (1 - distancia / 10);
            }
            
            // Evaluar pellets especiales
            const pelletsEspecialesCercanos = this.obtenerPelletsEspecialesCercanos(nuevaPos);
            if (pelletsEspecialesCercanos.length > 0) {
                const pelletEspecialCercano = this.encontrarPelletMasCercano(nuevaPos, pelletsEspecialesCercanos);
                const distancia = this.calcularDistancia(nuevaPos, pelletEspecialCercano);
                puntuacion += genes.pesoPelletEspecial * (1 - distancia / 10);
            }
            
            // Evaluar fantasmas
            for (const fantasma of fantasmas) {
                const distancia = this.calcularDistancia(nuevaPos, {x: fantasma[0], y: fantasma[1]});
                if (estado.fantasmasVulnerables) {
                    if (distancia < genes.umbralPerseguir * 8) {
                        puntuacion += genes.pesoFantasmaCercano * (1 - distancia / 8);
                    }
                } else {
                    if (distancia < genes.umbralHuir * 6) {
                        puntuacion -= genes.pesoSupervivencia * (1 - distancia / 6);
                    }
                }
            }
            
            puntuaciones[dir] = puntuacion;
        }
        
        let mejorDireccion = direccionesValidas[0];
        let mejorPuntuacion = -Infinity;
        
        for (const dir of direccionesValidas) {
            if (puntuaciones[dir] > mejorPuntuacion) {
                mejorPuntuacion = puntuaciones[dir];
                mejorDireccion = dir;
            }
        }
        
        return mejorDireccion;
    }

    // 🔧 FUNCIONES DE OPERADORES GENÉTICOS
    seleccionarPadres() {
        const tamanoTorneo = this.config.tamanoTorneo || 3;
        const padres = [];
        
        while (padres.length < Math.floor(this.config.tamanoPoblacion * this.config.tasaSeleccion)) {
            const torneo = [];
            for (let i = 0; i < tamanoTorneo; i++) {
                torneo.push(this.poblacion[Math.floor(Math.random() * this.poblacion.length)]);
            }
            torneo.sort((a, b) => b.fitness - a.fitness);
            padres.push(torneo[0]);
        }
        
        return padres;
    }

    cruzar(padre1, padre2) {
        const hijo = this.crearIndividuo();
        
        for (const gen in hijo.genes) {
            hijo.genes[gen] = Math.random() < 0.5 ? padre1.genes[gen] : padre2.genes[gen];
        }
        
        return hijo;
    }

    mutar(individuo) {
        const mutado = JSON.parse(JSON.stringify(individuo));
        
        for (const gen in mutado.genes) {
            if (Math.random() < this.config.tasaMutacion) {
                const cambio = (Math.random() - 0.5) * this.config.fuerzaMutacion;
                mutado.genes[gen] = Math.max(-1, Math.min(1, mutado.genes[gen] + cambio));
            }
        }
        
        return mutado;
    }

    async ejecutarGeneracion() {
        const inicioGeneracion = Date.now();
        
        // Evaluar población
        for (let i = 0; i < this.poblacion.length; i++) {
            await this.evaluarIndividuo(this.poblacion[i]);
        }
        
        // Ordenar por fitness
        this.poblacion.sort((a, b) => b.fitness - a.fitness);
        
        // Actualizar mejor individuo
        if (this.poblacion[0].fitness > this.mejorFitness) {
            this.mejorFitness = this.poblacion[0].fitness;
            this.mejorIndividuo = JSON.parse(JSON.stringify(this.poblacion[0]));
        }
        
        // Calcular estadísticas
        const fitnessPromedio = this.poblacion.reduce((sum, ind) => sum + ind.fitness, 0) / this.poblacion.length;
        this.historialFitness.push({
            generacion: this.generacionActual,
            mejor: this.mejorFitness,
            promedio: fitnessPromedio
        });
        
        // Crear nueva población (si no es la última generación)
        if (this.generacionActual < this.config.generacionesTotales - 1) {
            const nuevaPoblacion = [];
            
            // Elitismo
            nuevaPoblacion.push(JSON.parse(JSON.stringify(this.poblacion[0])));
            
            // Seleccionar padres
            const padres = this.seleccionarPadres();
            
            // Cruzamiento y mutación
            while (nuevaPoblacion.length < this.config.tamanoPoblacion) {
                const padre1 = padres[Math.floor(Math.random() * padres.length)];
                const padre2 = padres[Math.floor(Math.random() * padres.length)];
                
                let hijo = this.cruzar(padre1, padre2);
                
                if (Math.random() < this.config.tasaMutacion) {
                    hijo = this.mutar(hijo);
                }
                
                nuevaPoblacion.push(hijo);
            }
            
            this.poblacion = nuevaPoblacion;
        }
        
        const tiempoGeneracion = Date.now() - inicioGeneracion;
        this.tiemposGeneracion.push(tiempoGeneracion);
        
        this.generacionActual++;
        
        return {
            generacion: this.generacionActual,
            mejorFitness: this.mejorFitness,
            fitnessPromedio: fitnessPromedio,
            tiempoGeneracion: tiempoGeneracion
        };
    }

    async ejecutar() {
        if (this.corriendo) return;
        
        this.corriendo = true;
        this.pausado = false;
        this.tiempoInicio = Date.now();
        
        console.log('Iniciando ejecución del AG...');
        
        while (this.corriendo && this.generacionActual < this.config.generacionesTotales) {
            if (this.pausado) {
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
            }
            
            try {
                const resultado = await this.ejecutarGeneracion();
                this.actualizarUI(resultado);
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error('Error en generación:', error);
                break;
            }
        }
        
        this.corriendo = false;
        this.tiempoTotal = Date.now() - this.tiempoInicio;
        
        document.getElementById('btnDemoMejor').disabled = false;
        document.getElementById('btnExportarMejor').disabled = false;
        document.getElementById('estado-ag').textContent = 'Completado';
        
        console.log('AG completado. Mejor fitness:', this.mejorFitness);
    }

    actualizarUI(resultado) {
        console.log('Actualizando UI para generación:', resultado.generacion);
        
        const elementos = {
            estadoAG: document.getElementById('estado-ag'),
            generacionActual: document.getElementById('generacionActual'),
            mejorFitness: document.getElementById('mejorFitness'),
            promedioFitness: document.getElementById('promedioFitness'),
            progresoAG: document.getElementById('progreso-ag'),
            tiempoTotal: document.getElementById('tiempoTotal'),
            tiempoGeneracion: document.getElementById('tiempoGeneracion'),
            mejorPuntuacion: document.getElementById('mejorPuntuacion')
        };
        
        // Actualizar textos
        if (elementos.estadoAG) elementos.estadoAG.textContent = 
            `Ejecutando... Generación ${resultado.generacion}/${this.config.generacionesTotales}`;
        
        if (elementos.generacionActual) elementos.generacionActual.textContent = resultado.generacion;
        if (elementos.mejorFitness) elementos.mejorFitness.textContent = resultado.mejorFitness.toFixed(2);
        if (elementos.promedioFitness) elementos.promedioFitness.textContent = resultado.fitnessPromedio.toFixed(2);
        if (elementos.tiempoTotal) elementos.tiempoTotal.textContent = Math.round((Date.now() - this.tiempoInicio) / 1000);
        if (elementos.tiempoGeneracion) elementos.tiempoGeneracion.textContent = resultado.tiempoGeneracion;
        
        if (this.mejorIndividuo && elementos.mejorPuntuacion) {
            elementos.mejorPuntuacion.textContent = this.mejorIndividuo.puntuacion;
        }
        
        // Actualizar barra de progreso
        if (elementos.progresoAG) {
            const porcentaje = (resultado.generacion / this.config.generacionesTotales) * 100;
            elementos.progresoAG.innerHTML = `
                <div style="background: #333; height: 20px; border-radius: 10px; margin: 5px 0;">
                    <div style="background: #004bff; height: 100%; width: ${porcentaje}%; border-radius: 10px; transition: width 0.3s;"></div>
                </div>
                <div>Progreso: ${porcentaje.toFixed(1)}% - Gen: ${resultado.generacion}/${this.config.generacionesTotales}</div>
            `;
        }
        
        this.actualizarGraficoFitness();
    }

    actualizarGraficoFitness() {
        const canvas = document.getElementById('graficoFitness');
        if (!canvas || this.historialFitness.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const maxFitness = Math.max(...this.historialFitness.map(h => h.mejor));
        const escalaY = canvas.height / (maxFitness || 1);
        
        // Dibujar línea del mejor fitness
        ctx.beginPath();
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = 2;
        
        this.historialFitness.forEach((punto, i) => {
            const x = (i / (this.config.generacionesTotales - 1)) * canvas.width;
            const y = canvas.height - (punto.mejor * escalaY);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Dibujar línea del promedio
        ctx.beginPath();
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;
        
        this.historialFitness.forEach((punto, i) => {
            const x = (i / (this.config.generacionesTotales - 1)) * canvas.width;
            const y = canvas.height - (punto.promedio * escalaY);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    pausar() {
        this.pausado = true;
    }

    reanudar() {
        this.pausado = false;
    }

    detener() {
        this.corriendo = false;
    }

    exportarMejorIndividuo() {
        if (!this.mejorIndividuo) return null;
        
        return {
            genes: this.mejorIndividuo.genes,
            fitness: this.mejorIndividuo.fitness,
            estadisticas: {
                puntuacion: this.mejorIndividuo.puntuacion,
                tiempoVivo: this.mejorIndividuo.tiempoVivo,
                puntosRecolectados: this.mejorIndividuo.puntosRecolectados,
                fantasmasComidos: this.mejorIndividuo.fantasmasComidos
            },
            configuracion: this.config,
            timestamp: new Date().toISOString()
        };
    }
}

// Configuración por defecto
const configuracionDefault = {
    tamanoPoblacion: 10,
    generacionesTotales: 30,
    tasaSeleccion: 0.6,
    tasaCruzamiento: 0.3,
    tasaMutacion: 0.1,
    tamanoTorneo: 3,
    fuerzaMutacion: 0.2,
    semilla: 12345
};

let agInstance = null;

function inicializarAG(config = configuracionDefault) {
    agInstance = new AlgoritmoGenetico(config);
    return agInstance;
}

function obtenerAG() {
    return agInstance;
}

// Sistema de Demo (simplificado)
// Sistema de Demo para mostrar el mejor individuo
class DemoMejorIndividuo {
    constructor() {
        this.demoActiva = false;
        this.mejorIndividuo = null;
        this.intervalo = null;
        this.pasosDemo = 0;
        this.maxPasosDemo = 1000;
    }
    
    iniciarDemo(mejorIndividuo) {
        if (this.demoActiva) {
            this.detenerDemo();
        }
        
        this.demoActiva = true;
        this.mejorIndividuo = mejorIndividuo;
        this.pasosDemo = 0;
        
        console.log('🎬 Iniciando demo del mejor individuo:', mejorIndividuo);
        
        // Reiniciar el juego visual
        inicializarJuego();
        
        // Actualizar estado en la UI
        document.getElementById('estado').textContent = 
            `DEMO - Mejor Individuo (Fitness: ${mejorIndividuo.fitness.toFixed(2)})`;
        
        // Iniciar el loop de demo
        this.intervalo = setInterval(() => this.ejecutarDemoStep(), 200);
    }
    
    ejecutarDemoStep() {
        if (!this.demoActiva || !juegoActivo || this.pasosDemo >= this.maxPasosDemo) {
            this.detenerDemo();
            return;
        }
        
        this.pasosDemo++;
        
        // Obtener estado actual del juego
        const estado = this.obtenerEstadoActual();
        
        // El mejor individuo decide su movimiento
        const accion = this.seleccionarAccionDemo(this.mejorIndividuo, estado);
        
        // Ejecutar el movimiento en el juego visual
        const pos = encontrarPosicion('P');
        if (pos) {
            const [x, y] = pos;
            let seMovio = false;
            
            switch(accion) {
                case 'derecha': 
                    seMovio = mover_Derecha(x, y);
                    break;
                case 'izquierda': 
                    seMovio = mover_Izquierda(x, y);
                    break;
                case 'arriba': 
                    seMovio = mover_Arriba(x, y);
                    break;
                case 'abajo': 
                    seMovio = mover_Abajo(x, y);
                    break;
            }
            
            if (seMovio) {
                // Mover fantasmas (usando tu lógica existente)
                moverFantasmas();
                render();
            }
        }
        
        // Actualizar contador en la UI
        document.getElementById('estado').textContent = 
            `DEMO - Pasos: ${this.pasosDemo}/${this.maxPasosDemo} - Puntos: ${puntuacion}`;
    }
    
    obtenerEstadoActual() {
        return {
            posPacman: encontrarPosicion('P'),
            fantasmas: ['A','B','C','D'].map(f => encontrarPosicion(f)).filter(p => p),
            fantasmasVulnerables: fantasmasVulnerables,
            puntuacion: puntuacion
        };
    }
    
    seleccionarAccionDemo(individuo, estado) {
        const genes = individuo.genes;
        const posPacman = estado.posPacman;
        const fantasmas = estado.fantasmas;
        
        if (!posPacman) return 'derecha';
        
        const [x, y] = posPacman;
        const direcciones = ['arriba', 'abajo', 'izquierda', 'derecha'];
        
        // Filtrar direcciones válidas
        const direccionesValidas = direcciones.filter(dir => {
            const nuevaPos = this.calcularNuevaPosicion(posPacman, dir);
            return this.esMovimientoValido(nuevaPos);
        });
        
        if (direccionesValidas.length === 0) {
            return direcciones[Math.floor(Math.random() * direcciones.length)];
        }
        
        const puntuaciones = {};
        
        for (const dir of direccionesValidas) {
            let puntuacion = 0;
            const nuevaPos = this.calcularNuevaPosicion(posPacman, dir);
            
            // Preferencias de dirección
            if (dir === 'izquierda' || dir === 'derecha') {
                puntuacion += genes.preferenciaHorizontal * 2;
            } else {
                puntuacion += genes.preferenciaVertical * 2;
            }
            
            // Bono por movimiento válido
            puntuacion += 0.5;
            
            // Evaluar pellets cercanos (simulación)
            const pelletsCercanos = this.obtenerPelletsCercanos(nuevaPos);
            if (pelletsCercanos.length > 0) {
                const pelletCercano = this.encontrarPelletMasCercano(nuevaPos, pelletsCercanos);
                const distancia = this.calcularDistancia(nuevaPos, pelletCercano);
                puntuacion += genes.pesoPuntos * (1 - distancia / 10);
            }
            
            // Evaluar pellets especiales cercanos
            const pelletsEspecialesCercanos = this.obtenerPelletsEspecialesCercanos(nuevaPos);
            if (pelletsEspecialesCercanos.length > 0) {
                const pelletEspecialCercano = this.encontrarPelletMasCercano(nuevaPos, pelletsEspecialesCercanos);
                const distancia = this.calcularDistancia(nuevaPos, pelletEspecialCercano);
                puntuacion += genes.pesoPelletEspecial * (1 - distancia / 10);
            }
            
            // Evaluar fantasmas
            for (const fantasma of fantasmas) {
                const distancia = this.calcularDistancia(nuevaPos, {x: fantasma[0], y: fantasma[1]});
                if (estado.fantasmasVulnerables) {
                    // Perseguir fantasmas vulnerables
                    if (distancia < genes.umbralPerseguir * 8) {
                        puntuacion += genes.pesoFantasmaCercano * (1 - distancia / 8);
                    }
                } else {
                    // Huir de fantasmas normales
                    if (distancia < genes.umbralHuir * 6) {
                        puntuacion -= genes.pesoSupervivencia * (1 - distancia / 6);
                    }
                }
            }
            
            puntuaciones[dir] = puntuacion;
        }
        
        let mejorDireccion = direccionesValidas[0];
        let mejorPuntuacion = -Infinity;
        
        for (const dir of direccionesValidas) {
            if (puntuaciones[dir] > mejorPuntuacion) {
                mejorPuntuacion = puntuaciones[dir];
                mejorDireccion = dir;
            }
        }
        
        return mejorDireccion;
    }
    
    // Funciones auxiliares para la demo
    calcularNuevaPosicion(pos, direccion) {
        const nuevaPos = { x: pos[0], y: pos[1] };
        switch(direccion) {
            case 'arriba': nuevaPos.x--; break;
            case 'abajo': nuevaPos.x++; break;
            case 'izquierda': nuevaPos.y--; break;
            case 'derecha': nuevaPos.y++; break;
        }
        return nuevaPos;
    }
    
    esMovimientoValido(pos) {
        // Usar la misma validación que tu juego
        return puedeMoverse(pos.x, pos.y);
    }
    
    calcularDistancia(pos1, pos2) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    }
    
    obtenerPelletsCercanos(pos) {
        // Simular pellets cercanos basado en la matriz
        const pellets = [];
        const radio = 3;
        
        for (let i = Math.max(1, pos.x - radio); i <= Math.min(22, pos.x + radio); i++) {
            for (let j = Math.max(1, pos.y - radio); j <= Math.min(19, pos.y + radio); j++) {
                // Verificar si hay pellet en esta posición (basado en tu matriz)
                if (matrizReal[i] && matrizReal[i][j] === '.') {
                    pellets.push({ x: i, y: j });
                }
            }
        }
        return pellets;
    }
    
    obtenerPelletsEspecialesCercanos(pos) {
        // Posiciones fijas de pellets especiales
        const pelletsEspeciales = [
            {x: 2, y: 2}, {x: 2, y: 18},
            {x: 21, y: 2}, {x: 21, y: 18}
        ];
        
        return pelletsEspeciales.filter(pellet => {
            const distancia = this.calcularDistancia(pos, pellet);
            return distancia < 5;
        });
    }
    
    encontrarPelletMasCercano(pos, pellets) {
        if (pellets.length === 0) return null;
        
        let pelletCercano = pellets[0];
        let minDistancia = this.calcularDistancia(pos, pellets[0]);
        
        for (const pellet of pellets) {
            const distancia = this.calcularDistancia(pos, pellet);
            if (distancia < minDistancia) {
                minDistancia = distancia;
                pelletCercano = pellet;
            }
        }
        
        return pelletCercano;
    }
    
    detenerDemo() {
        this.demoActiva = false;
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
        
        document.getElementById('estado').textContent = 
            `Demo finalizada - Puntuación: ${puntuacion} - Pasos: ${this.pasosDemo}`;
        
        console.log('Demo finalizada. Puntuación:', puntuacion, 'Pasos:', this.pasosDemo);
    }
}

// Crear instancia global del demo manager
const demoManager = new DemoMejorIndividuo();