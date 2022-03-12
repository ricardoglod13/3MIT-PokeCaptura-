//Declaracion de variable global para almacenar colores de tipos
var tipoColor= {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#DD33FF',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#644C00',
    fairy: '#FFC6D9',
    dark: '#2F2F2F',
    default: '#2A1A1F'
};

//Variable con el host
var host = 'https://pokeapi.co/api/v2';

//Key de el localStorage donde se almacna usuario
var authKey = 'USER_AUTH_KEY';

//Convirtiendo Json con usuario en objeto JavaScript
var getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem(authKey));
    return user; 
}