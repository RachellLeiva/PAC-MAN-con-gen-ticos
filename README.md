
# Pac-Man con Algoritmo Genético

## Descripción del Proyecto

Este proyecto implementa un juego de Pac-Man en JavaScript con un **Algoritmo Genético (AG)** que evoluciona automáticamente estrategias para jugar de la mejor manera basado en unas características específicas(fitness). El sistema combina:
- **Juego manual**: Controla a Pac-Man con las teclas de flecha
- **Juego automático**: Un AG que aprende y optimiza estrategias de juego
- **Simulación silenciosa**: Motor de juego optimizado para entrenamiento del AG(no lo hace visual solo interno)
- **Visualización**: Representación gráfica de la evolución del algoritmo y gráficas de progreso y comparación entre el promedio y el mejor

## Características Principales

### Juego Clásico de Pac-Man
- Laberinto con paredes, puntos normales y pellets especiales
- 4 fantasmas con comportamientos distintos:
  - **A Blinky**: Persigue directamente a Pac-Man
  - **B Pinky**: Apunta 4 casillas adelante de Pac-Man
  - **C Inky**: Usa estrategia de espejo respecto al fantasma B
  - **D Clyde**: Alterna entre persecución y huida según distancia
- Sistema de poder temporal que hace vulnerables a los fantasmas
- Portales de teletransporte K en la matriz
- Puntuación: puntos (10), pellets especiales (50), fantasmas (200)

### Algoritmo Genético
- **Codificación**: Vector de pesos para reglas heurísticas
- **Selección**: Por ranking y torneo
- **Cruzamiento**: Multi-punto
- **Mutación**: Normal y ocasionalmente radical
- **Fitness**: Función basada en múltiples factores
- **Visualización**: Gráfico en tiempo real de evolución

### Sistema de Demo (Vista del mejor individuo)
- **Reproducción exacta**: Graba y reproduce la mejor partida del mejor individuo
- **Historial completo**: Guarda todos los estados del juego durante la evolución
- **Exportación**: Guarda el mejor individuo en formato JSON
## Cómo ejecutar

Corre en la consola del proyecto
```
python -m http.server 8000
```
Abre en la web http://localhost:8000 

También si tienes live server en VS Code:
Presiona live server y se abrirá directamente

## Cómo Usar

### 1. Juego Manual
1. Haz clic en **"Jugar Manualmente"**
2. Usa las **teclas de flecha** para mover a Pac-Man
3. **Pausa/Reanuda** con el botón correspondiente
4. **Reinicia** cuando termines

### 2. Algoritmo Genético
1. **Configura** los parámetros del AG:
   - Población (20-100)
   - Generaciones (10-200)
   - Tasas de selección, cruzamiento y mutación (deben sumar 100%)
   - Semilla aleatoria
   
2. **Inicia** la evolución con el botón "Iniciar Evolución"
3. **Observa** el progreso en tiempo real:
   - Gráfico de fitness (mejor y promedio)
   - Estadísticas por generación
   - Tiempo de ejecución
   
4. **Exporta** el mejor individuo
5. **Reproduce** la demo exacta del mejor jugador

### 3. Controles del Juego
- **Flechas**: Mover a Pac-Man
- **R**: Reiniciar juego
- **P**: Pausar/Reanudar

## Arquitectura Técnica

### Estructura del Código

```
📁 Proyecto Pac-Man con AG
├── index.html  Interfaz visual/estilos
├──   Script.js lógica del juego manual/algoritmo genético
│      ├── Juego Principal manual (visual)
│   ├── Matriz del laberinto
│   ├── Sistema de renderizado
│   ├── Movimiento de personajes
│   └── Detección de colisiones
│     ├──Motor Silencioso (para AG)
│   ├── Simulación eficiente
│   ├── Grabación de historial
│   └── Evaluación de fitness
│     ├──Algoritmo Genético
│   ├── Población de individuos
│   ├── Evaluación de fitness
│   ├── Operadores genéticos
│   └── Visualización
│   ├── Sistema de Demo
│   ├── Reproducción exacta
│   ├── Exportación/Importación
│   └── Control de reproducción
│
├── README.md
│
├─ config/
│  ├─ config-run-seed123.json
│  ├─ config-run-seed456.json
│  └─ config-run-seed789.json
│
├─ logs/
│  ├─ corrida-seed123/
│  │  ├─ log-gen-1.txt
│  │  ├─ log-gen-2.txt
│  │  ├─ ...
│  │  └─ log-gen-50.txt
│  │
│  ├─ corrida-seed456/
│  │  ├─ log-gen-1.txt
│  │  └─ log-gen-50.txt
│  │
│  └─ corrida-seed789/
│     ├─ log-gen-1.txt
│     └─ log-gen-50.txt
│
├─ replays/
│  ├─ replay-seed123.json
│  ├─ replay-seed456.json
│  └─ replay-seed789.json
│
│
└─ paper.pdf
```

### Componentes Clave

#### 1. **MotorPacmanSilencioso**
- Optimizado para múltiples simulaciones rápidas
- Graba historial completo de partidas
- Mismas reglas de juego que la versión visual(inteligencia de fantasmas, pellets especiales, misma puntuación, pero solo interno no visual)

#### 2. **AlgoritmoGenetico**
- **Individuos**: Vectores de pesos heurísticos
- **Fitness**: Combina:
  - Puntuación obtenida
  - Tiempo de supervivencia
  - Eficiencia de movimiento
  - Fantasmas comidos
  - Estrategia de exploración
  
- **Selección**: Ranking con diversidad forzada
- **Mutación**: Controlada con posibilidad de cambios radicales

#### 3. **Sistema de Heurísticas**
Los individuos usan 7 pesos para evaluar movimientos:
- `pesoPellets`: Atracción hacia puntos normales
- `pesoPelletsEspeciales`: Atracción hacia pellets especiales
- `pesoEvitarFantasmas`: Evasión de fantasmas peligrosos
- `pesoPerseguirFantasmas`: Persecución cuando son vulnerables
- `pesoExploracion`: Exploración de áreas nuevas
- `pesoMovimiento`: Penalización por inactividad
- `pesoSeguridad`: Evaluación de riesgo

## Parámetros del Algoritmo Genético

### Recomendaciones
- **Población**: 20-50 individuos
- **Generaciones**: 50-100 para buen balance
- **Tasas**:
  - Selección: 60%
  - Cruzamiento: 30%
  - Mutación: 10%
- **Semilla**: Usa la misma para resultados reproducibles

### Validación
El sistema valida que las tasas sumen exactamente 100% antes de iniciar.

## Resultados 

### Métricas de Rendimiento
- **Fitness**: Medida de calidad de la estrategia
- **Puntuación**: Puntos obtenidos en el juego (se muestra la mayor)
- **Tiempo de supervivencia**: Pasos antes de perder
- **Eficiencia**: Puntos por paso

## Exportación y Demo
### Exportar Mejor Individuo
Guarda en formato JSON:
- Pesos del individuo
- Configuración del AG
- Historial de fitness
- Estadísticas completas
- Historial de la mejor partida

### Reproducir Demo Exacta
1. Entrena el AG hasta completar
2. Exporta el mejor individuo
3. Haz clic en "Ejecutar Demo del Mejor"
4. Observa la **reproducción exacta** de la mejor partida

## Estilos y Visualización

### Interfaz
- **Laberinto**: Cuadrícula con colores distintivos
- **Personajes**: Pac-Man (amarillo), Fantasmas (colores distintos)
- **Estados**: Fantasmas normales y vulnerables (azul)

### Gráficos
- **Canvas**: Muestra evolución del fitness
- **Estadísticas**: Actualización en tiempo real
  - **Mejor puntuación**
  - **Mejor fitness**
  - **Promedio del fitness**
  - **Mejor puntuación**
  - **Cantidad de generaciones**
  - **Tiempo total**
- **Progreso**: Barra de porcentaje por generación

## Algunos datos importantes
1. **Sincronización**: El motor silencioso y visual usan exactamente las mismas reglas
2. **Rendimiento**: Optimización para simulaciones( del AG) simultáneas
3. **Memoria**: Gestión eficiente del historial de partidas
4. **Estabilidad**: El AG evita convergencia prematura
5. **Demo exacta**: Reproduce paso a paso la mejor partida


