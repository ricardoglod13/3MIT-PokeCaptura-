//Declaracion de constantes de la tarjeta y al sidebar
let poke = '';
const pokeCard = document.querySelector(".poke-card");
const pokeBusqueda = document.querySelector(".busqueda");
const usuario = document.getElementById("nombre");

//Funcion delay
function syncDelay(){
    document.getElementById('customForm').submit();
}


//Funcion para traer un pokemon
function fetchPokemon(id){
    let aux = 0;
    fetch(`${host}/pokemon/${id}`)
    .then((resp) => {
        handlePokemon(resp, aux)
    });
}

const handlePokemon = async (resp, aux) => {
    const data = await resp.json();
    crearPokemon(data,aux);
}

//Generando numeros aleatorios para la pagina principal
function numerosAleatoriosNoRepetidos(min, max, cantidad) {
    let numeros=[];

    if (min>max || cantidad>max-min) {
        return false;
    }

    while (numeros.length<cantidad) {
        const num=Math.floor((Math.random() * (max - min)) + min );
        if (numeros.indexOf(num)==-1) {
            numeros.push(num);
        }
        return numeros;
    }
}

//Bucle para colocar los pokemones en la pantalla principal
function fetchPokemons(){
    for(let i = 1; i <= 9; i++){
        const RandomId = numerosAleatoriosNoRepetidos(1, 897, 9);
        fetchPokemon(RandomId);
    }
}

//Creando estructura dentro de la tarjeta
function crearPokemon(pokemon, aux){
    let auxiliar = aux; 

    const subgrid = document.createElement('div');
    subgrid.classList.add('subgrid');

    const pokeName = document.createElement('div');
    pokeName.classList.add('poke-nombre');

    const imgContenedor = document.createElement('div');
    imgContenedor.classList.add('img-contenedor');

    const pokeImg = document.createElement('img');
    pokeImg.classList.add('poke-img');

    const pokeId = document.createElement('div');
    
    const pokeTipos = document.createElement('div');
    pokeTipos.classList.add('poke-tipos');

    const pokeStats = document.createElement('div');
    pokeStats.classList.add('poke-stats');

    const contenedorCaptura = document.createElement('form');
    contenedorCaptura.classList.add('contenedor-captura');
    contenedorCaptura.setAttribute('id', 'customForm');
    contenedorCaptura.setAttribute('action', '/json');
    contenedorCaptura.setAttribute('method', 'POST');
    contenedorCaptura.setAttribute('onsubmit', 'vaciar()');

    const pokeCaptura = document.createElement('button');
    pokeCaptura.type = 'submit';
    pokeCaptura.classList.add('poke-captura');
    pokeCaptura.setAttribute('id', 'botonCaptura');
    pokeCaptura.setAttribute('name', 'botonCaptura');
    pokeCaptura.innerHTML = 'Capturar';

    imgContenedor.appendChild(pokeImg);
    subgrid.appendChild(pokeName);
    subgrid.appendChild(imgContenedor);
    subgrid.appendChild(pokeId);
    subgrid.appendChild(pokeTipos);
    subgrid.appendChild(pokeStats);
    subgrid.appendChild(contenedorCaptura);
    subgrid.appendChild(pokeCaptura);

    child(pokeName, imgContenedor, pokeImg, pokeId, pokeTipos, pokeStats, auxiliar, subgrid, contenedorCaptura, pokeCaptura);

    pokeName.textContent = pokemon.name;
    pokeImg.src = pokemon.sprites.front_default
    pokeId.textContent = 'N°'+pokemon.id;

    setCardColors(pokemon, pokeImg);
    renderPokemonTypes(pokemon, pokeTipos);
    renderPokemonStats(pokemon, pokeStats);
    guardarInfo(pokemon,pokeCaptura, contenedorCaptura);

}

//Asignandole hijos a la tarjeta o a la sidebar
function child(pokeName, imgContenedor, pokeImg, pokeId, pokeTipos, pokeStats, auxiliar, subgrid, contenedorCaptura, pokeCaptura){
    
    if(auxiliar == 0){
        pokeCard.appendChild(subgrid);
    }else if(auxiliar == 1){
        imgContenedor.appendChild(pokeImg);
        pokeBusqueda.appendChild(pokeName);
        pokeBusqueda.appendChild(imgContenedor);
        pokeBusqueda.appendChild(pokeId);
        pokeBusqueda.appendChild(pokeTipos);
        pokeBusqueda.appendChild(pokeStats);
        pokeBusqueda.appendChild(contenedorCaptura);
        pokeBusqueda.appendChild(pokeCaptura)
    }
}

//generando sessionStorage y trayendo el usuario desde utilities
function guardarInfo(pokemon, pokeCaptura){
    pokeCaptura.addEventListener("click", function(){
        Swal.fire({
            title: '¡Enhorabuena!',
            text: `Acabas de capturar a ${pokemon.name}`,
            imageUrl: `${pokemon.sprites.front_default}`,
            imageAlt: `${pokemon.name}`,
            imageWidth: 180,
            showConfirmButton: false,
        });
        sessionStorage.setItem('id_po', pokemon.id);
        sessionStorage.setItem('nombre_po', pokemon.name);
        setTimeout(syncDelay, 3000);
    }, false);
}


let nombre_usu = localStorage.getItem(authKey);
let id_poke = sessionStorage.getItem('id_po');
let nombre_poke = sessionStorage.getItem('nombre_po');

let infoDB = {};
infoDB.nombre_usu = nombre_usu;
infoDB.id_poke = id_poke;
infoDB.nombre_poke = nombre_poke;

//ENviando Json a Python
let jsonCompleto = JSON.stringify(infoDB);
$.ajax({
    url:"/json",
    type:"POST",
    datatype: 'json',
    contentType: "application/json",
    data: jsonCompleto
});

//Funcion para buscar un pokemon por su nombre
function buscarPokemon(event){
    event.preventDefault();
    const {value} = event.target.pokemon;
    fetch('https://pokeapi.co/api/v2/pokemon/'+value+'/')
    .then(data => data.json())
    .then(resp => renderPokemonData(resp));
}

//Funcion para imprimir la busqueda
function renderPokemonData(pokemon){
    let aux = 1;
    crearPokemon(pokemon,aux);
}

//Colocando color al fondo de los pokemones dependiendo sus tipos
function setCardColors(pokemon, pokeImg) {
    const color1 = tipoColor[pokemon.types[0].type.name];
    const color2 = pokemon.types[1] ? tipoColor[pokemon.types[1].type.name] : tipoColor.default;
    pokeImg.style.background =  'radial-gradient('+ color2 +' 33%, '+ color1 +' 33%)';
    pokeImg.style.backgroundSize = '5px 5px';
}

//Colocando color a los tipos de los pokemones
function renderPokemonTypes(pokemon, pokeTipos){
    pokeTipos.innerHTML = '';
    pokemon.types.forEach(type => {
        const TextoTipo = document.createElement('div');
        TextoTipo.style.color = tipoColor[type.type.name];
        TextoTipo.textContent = type.type.name;
        pokeTipos.appendChild(TextoTipo);
    });
}

//Imprimiendo estadisticas base
function renderPokemonStats(pokemon, pokeStats){
    pokeStats.innerHTML = '';
    pokemon.stats.forEach(stat => {
        const elementoStat = document.createElement("div");
        const elementoStatNombre = document.createElement("div");
        const elementoStatCantidad = document.createElement("div");
        elementoStatNombre.textContent = stat.stat.name;
        elementoStatCantidad.textContent = stat.base_stat;
        elementoStat.appendChild(elementoStatNombre);
        elementoStat.appendChild(elementoStatCantidad);
        pokeStats.appendChild(elementoStat);
    });
}

//Se limpia la sessionStorage para evitar errores
sessionStorage.clear();
fetchPokemons();