class Individuo {
    constructor(genes = null) {
        if (genes) {
            this.genes = genes;
        } else {
            this.genes = {
                preferenciaDerecha: Math.random() * 2 - 1,
                preferenciaIzquierda: Math.random() * 2 - 1,
                preferenciaArriba: Math.random() * 2 - 1,
                preferenciaAbajo: Math.random() * 2 - 1,
                aversionFantasma: Math.random() * 2 - 1,
                atraccionPunto: Math.random() * 2,
                atraccionPellet: Math.random() * 2 + 0.5,
                umbralRiesgo: Math.random()
            };
        }
        this.fitness = 0;
    }

    decidirMovimiento(estado) {
        const { posPacman, posFantasmas, puntosCercanos, pelletsCercanos } = estado;
        if (!posPacman) return null;
        
        const [x, y] = posPacman;
        const movimientos = [];
        
        if (puedeMoverse(x, y+1, estado.matrizSimulacion)) {
            let score = this.genes.preferenciaDerecha;
            score += this.calcularAtraccionPuntos(x, y+1, puntosCercanos);
            score += this.calcularAtraccionPellets(x, y+1, pelletsCercanos);
            score += this.calcularEvasionFantasmas(x, y+1, posFantasmas);
            movimientos.push({ direccion: 'derecha', score });
        }
        
        if (puedeMoverse(x, y-1, estado.matrizSimulacion)) {
            let score = this.genes.preferenciaIzquierda;
            score += this.calcularAtraccionPuntos(x, y-1, puntosCercanos);
            score += this.calcularAtraccionPellets(x, y-1, pelletsCercanos);
            score += this.calcularEvasionFantasmas(x, y-1, posFantasmas);
            movimientos.push({ direccion: 'izquierda', score });
        }
        
        if (puedeMoverse(x-1, y, estado.matrizSimulacion)) {
            let score = this.genes.preferenciaArriba;
            score += this.calcularAtraccionPuntos(x-1, y, puntosCercanos);
            score += this.calcularAtraccionPellets(x-1, y, pelletsCercanos);
            score += this.calcularEvasionFantasmas(x-1, y, posFantasmas);
            movimientos.push({ direccion: 'arriba', score });
        }
        
        if (puedeMoverse(x+1, y, estado.matrizSimulacion)) {
            let score = this.genes.preferenciaAbajo;
            score += this.calcularAtraccionPuntos(x+1, y, puntosCercanos);
            score += this.calcularAtraccionPellets(x+1, y, pelletsCercanos);
            score += this.calcularEvasionFantasmas(x+1, y, posFantasmas);
            movimientos.push({ direccion: 'abajo', score });
        }
        
        if (movimientos.length === 0) return null;
        
        return movimientos.reduce((mejor, actual) => 
            actual.score > mejor.score ? actual : mejor
        );
    }

    calcularAtraccionPuntos(x, y, puntosCercanos) {
        let atraccion = 0;
        for (const punto of puntosCercanos) {
            const distancia = Math.sqrt(Math.pow(x - punto.x, 2) + Math.pow(y - punto.y, 2));
            if (distancia < 8) {
                atraccion += this.genes.atraccionPunto / (distancia + 1);
            }
        }
        return atraccion;
    }

    calcularAtraccionPellets(x, y, pelletsCercanos) {
        let atraccion = 0;
        for (const pellet of pelletsCercanos) {
            const distancia = Math.sqrt(Math.pow(x - pellet.x, 2) + Math.pow(y - pellet.y, 2));
            if (distancia < 10) {
                atraccion += this.genes.atraccionPellet / (distancia + 1);
            }
        }
        return atraccion;
    }

    calcularEvasionFantasmas(x, y, posFantasmas) {
        let evasion = 0;
        for (const fantasma of posFantasmas) {
            const distancia = Math.sqrt(Math.pow(x - fantasma.x, 2) + Math.pow(y - fantasma.y, 2));
            if (distancia < 6) {
                evasion += this.genes.aversionFantasma * distancia;
            }
        }
        return evasion;
    }

    clonar() {
        return new Individuo(JSON.parse(JSON.stringify(this.genes)));
    }
}

//cambia aca la población y demás
class AlgoritmoGenetico {
    constructor() {
        this.poblacion = [];
        this.mejorIndividuo = null;
        this.mejorFitness = -Infinity;
        this.generacion = 0;
        this.parametros = {
            tamañoPoblacion: 20,
            maxGeneraciones: 30,
            probMutacion: 0.2,
            probCruzamiento: 0.7
        };
    }

    inicializar() {
        this.poblacion = [];
        for (let i = 0; i < this.parametros.tamañoPoblacion; i++) {
            this.poblacion.push(new Individuo());
        }
        this.generacion = 0;
        this.mejorIndividuo = null;
        this.mejorFitness = -Infinity;
    }

    async evolucionar() {
        console.log("Iniciando evolución del algoritmo genético...");
        this.inicializar();
        
        for (let gen = 0; gen < this.parametros.maxGeneraciones; gen++) {
            this.generacion = gen;
            console.log(`Generación ${gen + 1}/${this.parametros.maxGeneraciones}`);
            
            await this.evaluarPoblacion();
            
            const padres = this.seleccionar();
            const nuevaPoblacion = [];
            
            if (this.mejorIndividuo) {
                nuevaPoblacion.push(this.mejorIndividuo.clonar());
            }
            
            while (nuevaPoblacion.length < this.parametros.tamañoPoblacion) {
                if (Math.random() < this.parametros.probCruzamiento && padres.length >= 2) {
                    const padre1 = padres[Math.floor(Math.random() * padres.length)];
                    const padre2 = padres[Math.floor(Math.random() * padres.length)];
                    const hijo = this.cruzar(padre1, padre2);
                    nuevaPoblacion.push(this.mutar(hijo));
                } else {
                    const padre = padres[Math.floor(Math.random() * padres.length)];
                    nuevaPoblacion.push(this.mutar(padre.clonar()));
                }
            }
            
            this.poblacion = nuevaPoblacion.slice(0, this.parametros.tamañoPoblacion);
            this.actualizarInterfaz();
            
            // Pausa larga para ver el progreso
            await sleep(100);
        }
        
        document.getElementById('estado-ag').textContent = 'Evolución completada';
        document.getElementById('btnDemoMejor').disabled = false;
        console.log("Evolución terminada. Mejor fitness:", this.mejorFitness);
    }

    async evaluarPoblacion() {
        console.log("Evaluando población...");
        const evaluaciones = [];
        
        for (const individuo of this.poblacion) {
            // Evaluar en paralelo para mayor velocidad
            evaluaciones.push(this.calcularFitness(individuo));
        }
        
        const resultados = await Promise.all(evaluaciones);
        
        for (let i = 0; i < this.poblacion.length; i++) {
            this.poblacion[i].fitness = resultados[i];
            
            if (resultados[i] > this.mejorFitness) {
                this.mejorFitness = resultados[i];
                this.mejorIndividuo = this.poblacion[i].clonar();
                console.log(`Nuevo mejor fitness: ${this.mejorFitness.toFixed(1)}`);
            }
        }
    }

    async calcularFitness(individuo) {
        let fitness = 0;
        
        // Hacer 2 pruebas para mayor estabilidad
        for (let prueba = 0; prueba < 2; prueba++) {
            // Crear una simulación separada del juego
            const estadoSimulacion = crearCopiaJuego();
            
            let pasos = 0;
            const maxPasos = 150;
            
            while (estadoSimulacion.juegoActivo && pasos < maxPasos) {
                const estado = this.obtenerEstadoJuegoSimulacion(estadoSimulacion);
                const movimiento = individuo.decidirMovimiento(estado);
                
                if (movimiento && estadoSimulacion.juegoActivo) {
                    const posPacman = encontrarPosicionSimulacion('P', estadoSimulacion.matrizObjetos);
                    if (posPacman) {
                        const [x, y] = posPacman;
                        switch(movimiento.direccion) {
                            case 'derecha': 
                                mover_Derecha_Simulacion(x, y, estadoSimulacion);
                                break;
                            case 'izquierda': 
                                mover_Izquierda_Simulacion(x, y, estadoSimulacion);
                                break;
                            case 'arriba': 
                                mover_Arriba_Simulacion(x, y, estadoSimulacion);
                                break;
                            case 'abajo': 
                                mover_Abajo_Simulacion(x, y, estadoSimulacion);
                                break;
                        }
                    }
                }
                
                // Mover fantasmas en la simulación
                if (pasos % 5 === 0) {
                    ['A', 'B', 'C', 'D'].forEach(fantasma => {
                        if (Math.random() < 0.4) {
                            moverFantasmaAleatorioSimulacion(fantasma, estadoSimulacion);
                        }
                    });
                }
                
                // Actualizar tiempo vulnerable en simulación
                if (estadoSimulacion.fantasmasVulnerables && estadoSimulacion.tiempoVulnerable > 0) {
                    estadoSimulacion.tiempoVulnerable--;
                    if (estadoSimulacion.tiempoVulnerable <= 0) {
                        estadoSimulacion.fantasmasVulnerables = false;
                    }
                }
                
                pasos++;
            }
            
            fitness += estadoSimulacion.puntuacion + (pasos * 0.2);
        }
        
        return fitness / 2;
    }

    obtenerEstadoJuegoSimulacion(estadoSimulacion) {
        const posPacman = encontrarPosicionSimulacion('P', estadoSimulacion.matrizObjetos);
        const posFantasmas = [];
        const puntosCercanos = [];
        const pelletsCercanos = [];
        
        if (posPacman) {
            const [x, y] = posPacman;
            
            for (const fantasma of ['A', 'B', 'C', 'D']) {
                const pos = encontrarPosicionSimulacion(fantasma, estadoSimulacion.matrizObjetos);
                if (pos) {
                    posFantasmas.push({ x: pos[0], y: pos[1] });
                }
            }
            
            for (let i = Math.max(0, x - 6); i <= Math.min(filas - 1, x + 6); i++) {
                for (let j = Math.max(0, y - 6); j <= Math.min(columnas - 1, y + 6); j++) {
                    const celda = estadoSimulacion.matrizObjetos[i][j];
                    if (celda && celda.puntoNormal) puntosCercanos.push({ x: i, y: j });
                    if (celda && celda.pelletEspecial) pelletsCercanos.push({ x: i, y: j });
                }
            }
        }
        
        return {
            posPacman: posPacman || [0, 0],
            posFantasmas,
            puntosCercanos,
            pelletsCercanos,
            matrizSimulacion: estadoSimulacion.matrizObjetos
        };
    }

    seleccionar() {
        const seleccionados = [];
        const tamañoTorneo = 3;
        
        while (seleccionados.length < this.poblacion.length * 0.6) {
            const torneo = [];
            for (let i = 0; i < tamañoTorneo; i++) {
                const indice = Math.floor(Math.random() * this.poblacion.length);
                torneo.push(this.poblacion[indice]);
            }
            const ganador = torneo.reduce((mejor, actual) => 
                actual.fitness > mejor.fitness ? actual : mejor
            );
            seleccionados.push(ganador);
        }
        
        return seleccionados;
    }

    cruzar(padre1, padre2) {
        const genesHijo = {};
        for (const gen in padre1.genes) {
            genesHijo[gen] = Math.random() < 0.5 ? padre1.genes[gen] : padre2.genes[gen];
        }
        return new Individuo(genesHijo);
    }

    mutar(individuo) {
        const genesMutados = JSON.parse(JSON.stringify(individuo.genes));
        for (const gen in genesMutados) {
            if (Math.random() < this.parametros.probMutacion) {
                genesMutados[gen] += (Math.random() - 0.5) * 0.5;
                if (gen.includes('atraccion')) {
                    genesMutados[gen] = Math.max(0, genesMutados[gen]);
                }
            }
        }
        return new Individuo(genesMutados);
    }

    actualizarInterfaz() {
        document.getElementById('generacionActual').textContent = this.generacion + 1;
        document.getElementById('totalGeneraciones').textContent = this.parametros.maxGeneraciones;
        document.getElementById('mejorFitness').textContent = this.mejorFitness.toFixed(1);
        
        const promedio = this.poblacion.reduce((sum, ind) => sum + ind.fitness, 0) / this.poblacion.length;
        document.getElementById('promedioFitness').textContent = promedio.toFixed(1);
        
        const progreso = Math.round(((this.generacion + 1) / this.parametros.maxGeneraciones) * 100);
        document.getElementById('progreso-ag').textContent = `Progreso: ${progreso}%`;
        document.getElementById('estado-ag').textContent = `Evolucionando... Generación ${this.generacion + 1}`;
    }

    async demoMejorIndividuo() {
        if (!this.mejorIndividuo) return;
        
        document.getElementById('estado-ag').textContent = 'Ejecutando mejor individuo...';
        
        // Reinicia el juego real
        inicializarJuego();
        juegoActivo = true;
        
        await sleep(500);
        
        const intervalo = setInterval(() => {
            if (!juegoActivo) {
                clearInterval(intervalo);
                document.getElementById('estado-ag').textContent = `Demo terminado. Puntuación: ${puntuacion}`;
                return;
            }
            
            const estado = this.obtenerEstadoJuegoReal();
            const movimiento = this.mejorIndividuo.decidirMovimiento(estado);
            
            if (movimiento && juegoActivo) {
                const posPacman = encontrarPosicion('P');
                if (posPacman) {
                    const [x, y] = posPacman;
                    switch(movimiento.direccion) {
                        case 'derecha': mover_Derecha(x, y); break;
                        case 'izquierda': mover_Izquierda(x, y); break;
                        case 'arriba': mover_Arriba(x, y); break;
                        case 'abajo': mover_Abajo(x, y); break;
                    }
                }
            }
            
            // Mover fantasmas en el juego REAL
            ['A', 'B', 'C', 'D'].forEach(fantasma => {
                if (Math.random() < 0.3) moverFantasmaAleatorio(fantasma);
            });
            
            render();
        }, 300);
    }

    obtenerEstadoJuegoReal() {
        const posPacman = encontrarPosicion('P');
        const posFantasmas = [];
        const puntosCercanos = [];
        const pelletsCercanos = [];
        
        if (posPacman) {
            const [x, y] = posPacman;
            
            for (const fantasma of ['A', 'B', 'C', 'D']) {
                const pos = encontrarPosicion(fantasma);
                if (pos) {
                    posFantasmas.push({ x: pos[0], y: pos[1] });
                }
            }
            
            for (let i = Math.max(0, x - 6); i <= Math.min(filas - 1, x + 6); i++) {
                for (let j = Math.max(0, y - 6); j <= Math.min(columnas - 1, y + 6); j++) {
                    const celda = matrizObjetos[i][j];
                    if (celda && celda.puntoNormal) puntosCercanos.push({ x: i, y: j });
                    if (celda && celda.pelletEspecial) pelletsCercanos.push({ x: i, y: j });
                }
            }
        }
        
        return {
            posPacman: posPacman || [0, 0],
            posFantasmas,
            puntosCercanos,
            pelletsCercanos,
            matrizSimulacion: matrizObjetos
        };
    }
}


const ag = new AlgoritmoGenetico();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnIniciarAG').addEventListener('click', function() {
        this.disabled = true;
        ag.evolucionar().then(() => {
            this.disabled = false;
        });
    });
    
    document.getElementById('btnDemoMejor').addEventListener('click', function() {
        ag.demoMejorIndividuo();
    });
});