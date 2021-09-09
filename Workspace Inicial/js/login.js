function validar(){
    let nombre = document.getElementById("nombreUsu").value;
    let pass = document.getElementById("pass").value;
    if((nombre !=="")&& (pass!== "")){
        localStorage.setItem('nombreUsuario', nombre); //Guardar usuario en localStorage
        window.location.href="products.html"; //Redirige 
    }
    else{
        alert("debe completar los campos");
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded",function(e) {
    document.getElementById("nombreUsuario").innerHTML = "Bienvenid@ " + localStorage.nombreUsuario;
})