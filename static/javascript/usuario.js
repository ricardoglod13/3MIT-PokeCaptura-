//Declaracion de constantes de la tarjeta y al sidebar
const pokeCard = document.querySelector(".poke-card");
const logout = document.getElementById("logout");

//Funcion para traer un pokemon
function fetchPokemon(id){
    fetch(`${host}/pokemon/${id}`)
    .then(handlePokemon);
}
const handlePokemon = async (resp) => {
    const data = await resp.json();
    crearPokemon(data);
}

//Creando estructura dentro de la tarjeta
function crearPokemon(pokemon){

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

    imgContenedor.appendChild(pokeImg);
    subgrid.appendChild(pokeName);
    subgrid.appendChild(imgContenedor);
    subgrid.appendChild(pokeId);
    subgrid.appendChild(pokeTipos);
    subgrid.appendChild(pokeStats);
    pokeCard.appendChild(subgrid);

    pokeName.textContent = pokemon.name;
    pokeImg.src = pokemon.sprites.front_default
    pokeId.textContent = 'N°'+pokemon.id;

    setCardColors(pokemon, pokeImg);
    renderPokemonTypes(pokemon, pokeTipos);
    renderPokemonStats(pokemon, pokeStats);

}

//Obteniendo el usuario desde contacto
fetch(`pokeUsuario?username=${getUserInfo().username}`)
.then(resp => resp.json())
.then(data => fetchPokemons(data));

//Trayendo los pokemones del usuario
function fetchPokemons(data){
    data.forEach((id, i) => {
        fetchPokemon(id);
    })
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

function logoutFunction(){
    //Debe crearse la logica del logout
    Swal.fire({
        title: '¡Adios!',
        text: `${getUserInfo().username} vuelve pronto, tus pokemones te estaran esperando`,
        imageUrl: `/static/images/despedida.png`,
        imageAlt: `Adios`,
        imageWidth: 400,
        imageHeight: 200,
        showConfirmButton: false
    });
    setTimeout(redirect, 3500);
}

function redirect(){
    window.location.href = '/index'
}

logout.addEventListener("click", logoutFunction, false);