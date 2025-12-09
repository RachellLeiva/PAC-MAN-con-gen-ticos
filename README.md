<<<<<<< Updated upstream

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


=======
# PAC-MAN-con-gen-ticos

Descripción del Proyecto
Implementación completa de un motor de juego Pac-Man 2D y un agente controlado por un Algoritmo Genético que evoluciona una política de juego. El proyecto incluye tanto el motor del juego (con canvas 2D) como el sistema de aprendizaje evolutivo, todo desarrollado sin librerías externas.

Características Principales
Motor de Juego
Laberinto clásico de Pac-Man con paredes, pellets normales y especiales
Cuatro fantasmas con IA específica: Blinky (A), Pinky (B), Inky (C), Clyde (D)
Sistema de colisiones y mecánicas de juego completas
Fantasmas vulnerables cuando Pac-Man come pellets especiales
Renderizado con Canvas 2D a 30-60 FPS
Controles manuales con teclado

Algoritmo Genético
Codificación: Vector de pesos para reglas heurísticas
Operadores genéticos configurables:
Selección por torneo/ranking
Cruzamiento de 1-2 puntos
Mutación gaussiana
Reemplazo con elitismo
Función de fitness personalizada con múltiples componentes
Población evolutiva de ≥20 individuos por ≥50 generaciones
Reproducibilidad completa con semillas configurables

Función de Fitness 
Recompensa por puntos:
+1 por cada punto normal (10 puntos)
+5 por cada pellet especial (50 puntos)
+20 por cada fantasma comido (200 puntos)
Recompensa por movimiento:
+0.01 por cada paso válido
Penalización por inactividad:
-0.05 después de 10 pasos sin comer
-0.1 después de 20 pasos sin comer
Recompensas finales al terminar:
+ (puntuación total × 0.1)
+100 si recolecta al menos 80% de los pellets
+ (eficiencia × 2) donde eficiencia = puntos/tiempo
+50 por cada fantasma comido
+10 por cada pellet especial recolectado

 Instalación y Ejecución
Requisitos
Navegador web m(Chrome 80+, Firefox 75+, Edge 80+)
Servidor HTTP local (para evitar restricciones CORS)

Ejecución Local
Descarga el proyecto
Navega al directorio del proyecto
Inicia un servidor HTTP local:
bash
# Python 3
python -m http.server 8000

# Node.js con http-server
npx http-server
Abre http://localhost:8000 en tu navegador

Configuración del Algoritmo Genético
Parámetros Configurables
Parámetro	Valor Predeterminado	Descripción
Población	20	Número de individuos por generación
Generaciones	50	Número total de generaciones a ejecutar
Tasa de Selección	60%	Porcentaje de población que se selecciona
Tasa de Cruzamiento	30%	Probabilidad de cruzamiento
Tasa de Mutación	10%	Probabilidad de mutación
Semilla Aleatoria	12345	Semilla para reproducibilidad
Pasos Máximos	1000	Pasos por evaluación individual
Elitismo	Activado	Conserva al mejor individuo
Nota: Las tasas (Selección + Cruzamiento + Mutación) deben sumar exactamente 100%.

Modos de Juego
1. Modo Manual
Controles: Flechas del teclado (↑ ↓ ← →)
Pausa/Reanudar: Tecla 'P'
Reiniciar: Tecla 'R' o botón "Reiniciar"

2. Modo Algoritmo Genético
Iniciar Evolución: Configura parámetros y presiona "Iniciar AG"
Pausar/Reanudar: Durante la ejecución
Exportar Mejor Individuo: Guarda la política aprendida en JSON
Demo del Mejor: Reproduce la mejor partida encontrada

3. Demo ExACTA
Reproduce exactamente la mejor partida del AG
Muestra cada movimiento paso a paso
Incluye puntuación original y estadísticas

Métricas en Tiempo Real
Panel de Control del AG
Estado: Ejecución/Pausado/Completado
Progreso: Porcentaje y generación actual
Fitness: Mejor y promedio por generación
Puntuación: Mejor puntuación alcanzada
Tiempos: Total y por generación
Gráfico de Evolución
Línea verde: Mejor fitness por generación
Línea amarilla: Fitness promedio por generación
Actualización en tiempo real

Representación del Agente
Genotipo (Vector de Pesos)
Cada individuo representa un vector de 7 pesos para reglas heurísticas:
pesoPellets: Atracción hacia pellets normales
pesoPelletsEspeciales: Atracción hacia pellets especiales
pesoEvitarFantasmas: Evasión de fantasmas normales
pesoPerseguirFantasmas: Persecución de fantasmas vulnerables
pesoExploracion: Tendencia a explorar áreas nuevas
pesoMovimiento: Penalización por no moverse
pesoSeguridad: Evaluación de posiciones seguras

Proceso de Decisión
1. Para cada acción posible (arriba, abajo, izquierda, derecha):
2. Calcular valor = Σ(wi × característica_i)
3. Seleccionar acción con mayor valor
4. Ejecutar acción en el motor del juego
Resultados y Análisis
Métricas de Evaluación
Fitness Final: Medida de calidad de la política

Puntuación Máxima: Puntos obtenidos en el juego

Eficiencia: Puntuación por paso

Tasa de Supervivencia: Pasos antes de morir

Comparación con Baseline
Agente Greedy: Busca siempre el pellet más cercano

Agente Aleatorio: Movimientos completamente aleatorios

Política Evolucionada: Resultados del AG

Estructura del Proyecto
text
GA-PacMan/
├── index.html              # Interfaz principal/estilos
├── script.js             # Lógica principal/demo/manual/ag
├── config/               # Configuraciones guardadas
│   ├── mejor_individuo.json
│   └── configuracion_base.json
├── logs/                 # Historial de ejecuciones
│   ├── fitness_historico.json
│   └── estadisticas.csv
└── README.md            
Diseño Experimental


🎨 Interfaz de Usuario
Secciones Principales
Área de Juego: Visualización del laberinto y personajes

Panel de Control: Botones e indicadores del juego manual

Configuración del AG: Parámetros ajustables del algoritmo

Métricas en Vivo: Estadísticas durante la ejecución

Gráfico de Evolución: Visualización del progreso del AG

Validaciones
Suma de tasas debe ser 100%

Valores numéricos dentro de rangos válidos

Botones habilitados/deshabilitados según contexto

📄 Exportación y Reproducción
Archivos Generados
best.json: Genotipo completo del mejor individuo

logs/fitness_log.json: Historial completo de fitness

config/config.json: Configuración utilizada

Reproducción de Resultados
Cargar best.json para restaurar el mejor individuo

Usar la misma semilla para reproducibilidad exacta

Ejecutar "Demo del Mejor" para ver la partida completa

🛠️ Solución de Problemas
Problemas Comunes
CORS al abrir directamente el archivo

Usa un servidor local como se indica en Instalación

Tasas no suman 100%

Ajusta los porcentajes hasta que la suma sea exactamente 100

Rendimiento lento

Reduce el tamaño de población o número de generaciones

Aumenta los FPS de simulación en la configuración

AG no converge

Aumenta tasa de mutación

Reduce elitismo temporalmente

Verifica la función de fitness

Depuración
Abre la consola del navegador (F12) para ver logs detallados

Revisa los mensajes de estado en la interfaz

Exporta y examina los individuos generados
>>>>>>> Stashed changes
