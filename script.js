    const matriz = [
      [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
      [' ','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O',' '],
      [' ','O','.','.','.','.','.','.','.','.','O','.','.','.','.','.','.','.','.','O',' '],
      [' ','O','.','O','O','.','O','O','O','.','O','.','O','O','O','.','O','O','.','O',' '],
      [' ','O','.','O','O','.','O','O','O','.','O','.','O','O','O','.','O','O','.','O',' '],
      [' ','O','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','O',' '],
      [' ','O','.','O','O','.','O','.','O','O','O','O','O','.','O','.','O','O','.','O',' '],
      [' ','O','.','.','.','.','O','.','.','.','O','.','.','.','O','.','.','.','.','O',' '],
      [' ','O','O','O','O','.','O','O','O','.','O','.','O','O','O','.','O','O','O','O',' '],
      [' ',' ',' ',' ','O','.','O','.','.','.','.','C','.','.','O','.','O',' ',' ',' ',' '],
      [' ','O','O','O','O','.','O','.','O','O','.','O','O','.','O','.','O','O','O','O',' '],
      ['K','.','.','.','B','.','.','.','O','.','.','.','O','.','.','.','.','.','.','A','K'],
      [' ','O','O','O','O','.','O','.','O','O','O','O','O',' ','O','.','O','O','O','O',' '],
      [' ',' ',' ',' ','O','.','O','.','.','.','.','.','.','A','O','.','O',' ',' ',' ',' '],
      [' ','O','O','O','O','.','O','D','O','O','O','O','O','.','O','.','O','O','O','O',' '],
      [' ','O','.','.','.','.','.','.','.','.','O','.','.','.','.','.','.','.','.','O',' '],
      [' ','O','.','O','O','.','O','O','O','.','O','.','O','O','O','.','O','O','.','O',' '],
      [' ','O','.','.','O','.','.','.','.','.','.','.','.','.','.','.','O','.','.','O',' '],
      [' ','O','O','.','O','.','O','.','O','O','O','O','O','.','O','.','O','.','O','O',' '],
      [' ','O','.','.','.','.','O','.','.','.','O','.','.','.','O','.','.','.','.','O',' '],
      [' ','O','.','O','O','O','O','O','O','.','O','.','O','O','O','O','O','O','.','O',' '],
      [' ','O','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','O',' '],
      [' ','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O','O',' '],
      [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
    ];
//----------------------------------------------------RENDER------------------------------------- El render lo hizo la IA, no lo he analizado
const game = document.getElementById('game');
const filas = matriz.length;
const columnas = matriz[0].length;
game.style.gridTemplateColumns = `repeat(${columnas}, 20px)`;
game.style.gridTemplateRows = `repeat(${filas}, 20px)`;

//  Renderiza el tablero visual desde la matriz actual
function render() {
  game.innerHTML = '';
  matriz.forEach(fila => {
    fila.forEach(celda => {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      if (celda === 'O') tile.classList.add('wall');
      else if (celda === '.') {
        tile.classList.add('path');
        const dot = document.createElement('div');
        dot.classList.add('dot');
        tile.appendChild(dot);
      }
      else if (celda === ' ') tile.classList.add('empty');
      else if (celda === 'P') tile.classList.add('pacman');
      else if (['A','B','C','D'].includes(celda)) {
        const ghost = document.createElement('div');
        ghost.classList.add('ghost', celda);
        const eyeL = document.createElement('div');
        eyeL.classList.add('ghost-eye','left');
        const eyeR = document.createElement('div');
        eyeR.classList.add('ghost-eye','right');
        ghost.appendChild(eyeL); ghost.appendChild(eyeR);
        tile.appendChild(ghost);
      }
      game.appendChild(tile);
    });
  });
}

render();

//  Encuentra posición de Pacman
function posPacman() {
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      if (matriz[i][j] === 'P') return [i, j];
    }
  }
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//--------------------------------------------------los mover--------------------------------------------------------------


//comento el primer mover, el resto siguen la misma logica (los de horizontal tienen el extra que pueden hacer el cambio de lado)
//con cambio de lado me refiero que salen del mapa y aparecen al otro lado
function mover_Derecha(matriz,x,y){
    let flag = false;
    if(matriz[x][y+1]!='O'&& matriz[x][y+1]!='S'){ //si no es pared
        flag = true;         //saber si si se movio
        if(matriz[x][y+1]=='K'){    //si hace el cambio de lado por completo
            switch(matriz[x][y]){ 
                case 'P':
                    matriz[x][y] = ' '; //la posicion vieja la deja vacia 
                    matriz[11][1] = 'P' //la siguiente se llena con el fantasma o pacman
                    break;
                case 'A':
                    matriz[x][y] = ' ';
                    matriz[11][1] = 'A'
                    break;
                case 'B':
                    matriz[x][y] = ' ';
                    matriz[11][1] = 'B'
                    break;
                case 'C':
                    matriz[x][y] = ' ';
                    matriz[11][1] = 'C'
                    break;
                case 'D':
                    matriz[x][y] = ' ';
                    matriz[11][1] = 'D'
                    break;
            } 
        }
        else{
            switch(matriz[x][y]){   //cambiar la matriz con el movimiento
                case 'P':
                    matriz[x][y] = ' ';
                    matriz[x][y+1] = 'P'
                    break;
                case 'A':
                    matriz[x][y] = ' ';
                    matriz[x][y+1] = 'A'
                    break;
                case 'B':
                    matriz[x][y] = ' ';
                    matriz[x][y+1] = 'B'
                    break;
                case 'C':
                    matriz[x][y] = ' ';
                    matriz[x][y+1] = 'C'
                    break;
                case 'D':
                    matriz[x][y] = ' ';
                    matriz[x][y+1] = 'D'
                    break;
            } 
        }
    }
    render();
    return flag;
}

function mover_Izquierda(matriz,x,y){
    let flag = false;
    if(matriz[x][y-1]!='O'&& matriz[x][y-1]!='S'){
        flag = true;
        if(matriz[x][y-1]=='K'){
            switch(matriz[x][y]){
                case 'P':
                    matriz[x][y] = ' ';
                    matriz[11][19] = 'P'
                    break;
                case 'A':
                    matriz[x][y] = ' ';
                    matriz[11][19] = 'A'
                    break;
                case 'B':
                    matriz[x][y] = ' ';
                    matriz[11][19] = 'B'
                    break;
                case 'C':
                    matriz[x][y] = ' ';
                    matriz[11][19] = 'C'
                    break;
                case 'D':
                    matriz[x][y] = ' ';
                    matriz[11][19] = 'D'
                    break;
            }
        }
        else{
            switch(matriz[x][y]){
                case 'P':
                    matriz[x][y] = ' ';
                    matriz[x][y-1] = 'P'
                    break;
                case 'A':
                    matriz[x][y] = ' ';
                    matriz[x][y-1] = 'A'
                    break;
                case 'B':
                    matriz[x][y] = ' ';
                    matriz[x][y-1] = 'B'
                    break;
                case 'C':
                    matriz[x][y] = ' ';
                    matriz[x][y-1] = 'C'
                    break;
                case 'D':
                    matriz[x][y] = ' ';
                    matriz[x][y-1] = 'D'
                    break;
            }
        }
    }
    render();
    return flag;
}

function mover_Arriba(matriz,x,y){
    let flag = false;
    if(matriz[x-1][y]!='O'&& matriz[x-1][y]!='S'){
        flag = true;
        switch(matriz[x][y]){
            case 'P':
                matriz[x][y] = ' ';
                matriz[x-1][y] = 'P'
                break;
            case 'A':
                matriz[x][y] = ' ';
                matriz[x-1][y] = 'A'
                break;
            case 'B':
                matriz[x][y] = ' ';
                matriz[x-1][y] = 'B'
                break;
            case 'C':
                matriz[x][y] = ' ';
                matriz[x-1][y] = 'C'
                break;
            case 'D':
                matriz[x][y] = ' ';
                matriz[x-1][y] = 'D'
                break;
        }
    }
    render();
    return flag;
}

function mover_Abajo(matriz,x,y){
    let flag = false;
    if(matriz[x+1][y]!= 'O'&& matriz[x+1][y]!='S'){
        flag = true;
        switch(matriz[x][y]){
            case 'P':
                matriz[x][y] = ' ';
                matriz[x+1][y] = 'P'
                break;
            case 'A':
                matriz[x][y] = ' ';
                matriz[x+1][y] = 'A'
                break;
            case 'B':
                matriz[x][y] = ' ';
                matriz[x+1][y] = 'B'
                break;
            case 'C':
                matriz[x][y] = ' ';
                matriz[x+1][y] = 'C'
                break;
            case 'D':
                matriz[x][y] = ' ';
                matriz[x+1][y] = 'D'
                break;
        } 
    }
    render();
    return flag;
}




function copiarMatriz(matriz) {
    // Devuelve una copia profunda de la matriz
    return matriz.map(fila => [...fila]);
}

//--------------------------------------------------los huir--------------------------------------------------------------


//los huir, para cada fantasma, cada uno busca una esquina distinta.
async function RutaAllegar(matriz,x,y,k,m,vista){ //k y m representan donde tienen que intentar llegar}
    i = 0;
    while(i<50){
        let copia = copiarMatriz(matriz);
        let a = [];
        if (vista == 'izq'){ //esto es para que no se encicle, aparte que los fantasmas no pueden devolverse de donde vienen
        if(mover_Abajo(copia,x,y)){
            let b = Math.sqrt(((x+1-k)**2) + ((y-m)**2));
            a.push(['b',b]);
        }
        copia = copiarMatriz(matriz);
        if(mover_Arriba(copia,x,y)){
            let c = Math.sqrt(((x-1-k)**2) + ((y-m)**2));
            a.push(['c',c]);
        }   
        copia = copiarMatriz(matriz); 
        if(mover_Izquierda(copia,x,y)){
            let e = Math.sqrt(((x-k)**2) + ((y-1-m)**2));
            a.push(['e',e]);
        }
        }

        else if(vista == 'der'){
        if(mover_Abajo(copia,x,y)){
            let b = Math.sqrt(((x+1-k)**2) + ((y-m)**2));
            a.push(['b',b]);
        }
        copia = copiarMatriz(matriz);
        if(mover_Arriba(copia,x,y)){
            let c = Math.sqrt(((x-1-k)**2) + ((y-m)**2));
            a.push(['c',c]);
        }   

        copia = copiarMatriz(matriz);
        if(mover_Derecha(copia,x,y)){
            let d = Math.sqrt(((x-k)**2) + ((y+1-m)**2));
            a.push(['d',d]);
        }
        }

        else if(vista == 'abj'){
        if(mover_Abajo(copia,x,y)){
            let b = Math.sqrt(((x+1-k)**2) + ((y-m)**2));
            a.push(['b',b]);
        }  
        copia = copiarMatriz(matriz); 
        if(mover_Derecha(copia,x,y)){
            let d = Math.sqrt(((x-k)**2) + ((y+1-m)**2));
            a.push(['d',d]);
        }
        copia = copiarMatriz(matriz);
        if(mover_Izquierda(copia,x,y)){
            let e = Math.sqrt(((x+1-k)**2) + ((y-1-m)**2));
            a.push(['e',e]);
        }
        }

        else if(vista == 'arr'){
        if(mover_Arriba(copia,x,y)){
            let c = Math.sqrt(((x-1-k)**2) + ((y-m)**2));
            a.push(['c',c]);
        }   
        copia = copiarMatriz(matriz); 
        if(mover_Derecha(copia,x,y)){
            let d = Math.sqrt(((x-k)**2) + ((y+1-m)**2));
            a.push(['d',d]);
        }
        copia = copiarMatriz(matriz);
        if(mover_Izquierda(copia,x,y)){
            let e = Math.sqrt(((x+1-k)**2) + ((y-1-m)**2));
            a.push(['e',e]);
        }
        }
        let mejor = a.sort((a, b) => a[1] - b[1])[0]; //orden ascendente (menor a mayor)
        switch(mejor[0]){
            case 'b':
                mover_Abajo(matriz,x,y);
                x++;
                vista = 'abj';
                break;
            case 'c':
                mover_Arriba(matriz,x,y);
                x--;
                vista = 'arr';
                break;
            case 'd':
                mover_Derecha(matriz,x,y);
                y++;
                vista = 'der';
                break;
            case 'e':
                mover_Izquierda(matriz,x,y);
                y--;
                vista = 'izq';
                break;
        }
        await sleep(200); //  Espera 0.2s antes del siguiente paso
        i++;
        
        //console.table(matriz);
    }

}



//--------------------------------------------------Inteligencia de cada fantasma------------------------------------------

//la inteligencia del fantasma A es llamar a rutaAllegar con la ubicacion del fantasma en k,m   (blinky)
function fantasmaA(matriz,x,y,k,m,vista){ //x,y fantasma y k,m donde esta pacman
    switch(vista){                          //siempre intentar ir hacia pacman (un paso adelante de)
         case 'arr':
            RutaAllegar(matriz,x,y,k-1,m,vista);
            break;
        case 'abj':
            RutaAllegar(matriz,x,y,k+1,m,vista);
            break;
        case 'der':
            RutaAllegar(matriz,x,y,k,m+1,vista);
            break;
        case 'izq':
            RutaAllegar(matriz,x,y,k,m-1,vista);
            break;
    }
}


//la inteligencia del fantasma B es llamar a rutaAllegar con la ubicacion del fantasma en k,m pero 4 posiciones adelante de donde esta viendo

function fantasmaB(matriz,x,y,k,m,vista){
    if(x<4  && vista == 'izq'){
        RutaAllegar(matriz,x,y,k,0,vista);
    }
    else if( x>16 && vista == 'der'){
        RutaAllegar(matriz,x,y,k,20,vista);
    }
    else if(y<4  && vista == 'arr'){            //estos son los casos que si hago +-4 se salen del rango
        RutaAllegar(matriz,x,y,0,m,vista);
    }
    else if( y>19 && vista == 'abj'){
        RutaAllegar(matriz,x,y,23,m,vista);
    }
    else{
        switch(vista){                          //sumarles 4 adelante de donde esten viendo
            case 'arr':
                RutaAllegar(matriz,x,y,k-4,m,vista);
                break;
            case 'abj':
                RutaAllegar(matriz,x,y,k+4,m,vista);
                break;
            case 'der':
                RutaAllegar(matriz,x,y,k,m+4,vista);
                break;
            case 'izq':
                RutaAllegar(matriz,x,y,k,m-4,vista);
                break;
        }
         
    }
    
}
              //blinky pos es b,i
function fantasmaC(matriz,x,y,b,i,k,m,vista){  //esta esta incompleda ya que no calculo los rangos de salirse
    let filas = matriz.length;
    let columnas = matriz[0].length;
    switch(vista){                          
         case 'arr':
            k -=2;
            let v = k-b;   //aca aplico una formula que consegui en google de como calcular las cordenadas que tiene que ir fantamas C (inki)
            let j = m-i;
            let p = v*2 + b;
            let ñ = j*2 + i;
            p = Math.max(0, Math.min(p, filas - 1));   // fila para que no se salga del rango (es el fantasma más complejo);
            ñ = Math.max(0, Math.min(ñ, columnas - 1)); // columna
            RutaAllegar(matriz,x,y,p,ñ,vista);
            break;
        case 'abj':
            k +=2;
            v = k-b;
            j = m-i;
            p = v*2 + b;
            ñ = j*2 + i;
            p = Math.max(0, Math.min(p, filas - 1));   // fila
            ñ   = Math.max(0, Math.min(ñ, columnas - 1)); // columna
            RutaAllegar(matriz,x,y,k,m,vista);
            break;
        case 'der':
            m +=2;
            v = k-b;
            j = m-i;
            p = v*2 + b;
            ñ = j*2 + i;
            p = Math.max(0, Math.min(p, filas - 1));   // fila
            ñ   = Math.max(0, Math.min(ñ, columnas - 1)); // columna
            RutaAllegar(matriz,x,y,k,m,vista);
            break;
        case 'izq':
            m -=2;
            v = k-b;
            j = m-i;
            p = v*2 + b;
            ñ = j*2 + i;
            p = Math.max(0, Math.min(p, filas - 1));   // fila
            ñ   = Math.max(0, Math.min(ñ, columnas - 1)); // columna
            RutaAllegar(matriz,x,y,k,m,vista);
            break;
    }
}


function fantasmaD(matriz,x,y,k,m,vista){ //x,y fantasma y k,m donde esta pacman

    if(((k-x)**2 + (m-y)**2)<64){ //si esta en un rango menor al de 8 espacios (asi es la logica de clyde)
        switch(vista){                         
            case 'arr':
                RutaAllegar(matriz,x,y,23,20,vista);    //cuando esta muy cerca el tiene que ir a su ezquina de huida
                break;
            case 'abj':
                RutaAllegar(matriz,x,y,23,20,vista);
                break;
            case 'der':
                RutaAllegar(matriz,x,y,23,20,vista);
                break;
            case 'izq':
                RutaAllegar(matriz,x,y,23,20,vista);
                break;
        }
    }
    else{
        switch(vista){                         
         case 'arr':
            RutaAllegar(matriz,x,y,k-1,m,vista);
            break;
        case 'abj':
            RutaAllegar(matriz,x,y,k+1,m,vista);
            break;
        case 'der':
            RutaAllegar(matriz,x,y,k,m+1,vista);
            break;
        case 'izq':
            RutaAllegar(matriz,x,y,k,m-1,vista);
            break;
    }  
    }

}

//--------------------------------------------------  FALTAS  --------------------------------------------------------------

//se supone que ya estan todas, las de huir y la inteligencia de cada fantasma, los huir si sirven, la inteligencia de cada fantasma
//no las probe todavia, y falta que si un fantasma pasa por encima de otro, no desaparezca, ya que desaparecen, igual con pacman
//y que si pasa el fantasma por encima de los puntitos no desaparezcan

render(); 
setInterval(() => {
  huirA(matriz, 11, 4, 0, 0, 'der');
  huirA(matriz, 13, 13, 0, 20, 'der');
  huirA(matriz, 14, 7, 23, 20, 'der');
  huirA(matriz, 11, 19, 23 ,20, 'izq');
  render();
}, 100);
//en este momento ya funcionan los huir, solo que si dos fantasmas llegan a las mismas cordenadas, uno desaparece



