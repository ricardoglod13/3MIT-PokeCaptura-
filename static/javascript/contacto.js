//Trayendo el input de index para capturar su value 
const loginForm = document.getElementById("loginForm");

//Transformando a Json la data
const handleUser = (data) => {
    const userInfo = {
        id: data[0],
        username: data[1]
    }
    localStorage.setItem(authKey, JSON.stringify(userInfo));
    window.location.pathname = '/principal';
}

//obteniendo id y usuario 
const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    fetch('/pokeLogin', {
        method: 'POST',
        body: formData
    }).then(resp => resp.json())
    .then(handleUser)
}

loginForm.addEventListener("submit", handleSubmit);