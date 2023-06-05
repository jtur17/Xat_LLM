var chatsAsignados = [];

function añadirAmigo() {

    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");
    let friend = document.getElementById("friend").value;

    http.open("POST", "http://localhost:3000/Xat/Friend", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("mail=" + mail + "&session=" + codigoSesion + "&friend=" + friend);

    http.onreadystatechange = function(){

        let respuesta = http.responseText;

        if (http.readyState == 4 && http.status == 200) {

            if (respuesta == "0") {

                document.getElementById("resultado").innerHTML = "El servidor no responde";
                document.getElementById("resultado").style.color = "red";

            } else if (respuesta == "1") {

                document.getElementById("resultado").innerHTML = "Amigo añadido con éxito";
                document.getElementById("resultado").style.color = "green";
                recibirAmigos();

            } else if(respuesta == "2") {

                document.getElementById("resultado").innerHTML = "Amigo no encontrado";
                document.getElementById("resultado").style.color = "red";

            } else {

                document.getElementById("resultado").innerHTML = "Usuario necesita Login";
                document.getElementById("resultado").style.color = "red";
            }
        }
    }
}


function recibirAmigos() {

    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");

    http.open("GET", "http://localhost:3000/Xat/Friend?mail="+mail+"&session="+codigoSesion, true);
    http.send();

    http.onreadystatechange = function(){

        if (http.readyState == 4 && http.status == 200) {

            let jsonString = http.responseText;
            let arrayAmigos = JSON.parse(jsonString);
            let selectElement = document.getElementById("listaAmigos");

            for (let i in arrayAmigos) {

                let amigo = arrayAmigos[i];
                let option = document.createElement("option");
                option.text = amigo;
                selectElement.add(option);

            }
        }
    }
}

function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "../HTML/Login.html";
}

function recibirMensaje() {

    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");

    http.open("GET", "http://localhost:3000/Xat/Xat?mail="+mail+"&session="+codigoSesion, true);
    http.send();

    http.onreadystatechange = function(){

        if (http.readyState == 4 && http.status == 200) {

            let jsonString = http.responseText;
            let respuesta = JSON.parse(jsonString);

            console.log(respuesta);

            let emisor = respuesta.emisor;
            let indiceEmisor = chatsAsignados.indexOf(emisor);

            let nombre = respuesta.emisor.split("@");
            let primeraLetra = nombre[0].charAt(0).toUpperCase();
            let restoDelNombre = nombre[0].slice(1);
            let nombreCompleto = primeraLetra + restoDelNombre;

            console.log(indiceEmisor);
            if (indiceEmisor != -1) {

                let pestaña = document.querySelector("#pestaña-" + indiceEmisor);
                pestaña.innerHTML = nombreCompleto + "<br>";

                let chat = document.querySelector("#chat-" + indiceEmisor);
                chat.innerHTML += nombreCompleto + ": " + respuesta.text + "<br>";

            } else if (indiceEmisor == -1 && chatsAsignados.length < 5) {

                chatsAsignados.push(emisor);

                console.log(chatsAsignados);

                let indiceNuevoEmisor = chatsAsignados.indexOf(emisor);

                let pestaña = document.querySelector("#pestaña-" + indiceNuevoEmisor);
                pestaña.innerHTML = nombreCompleto + "<br>";

                let chat = document.querySelector("#chat-" + indiceNuevoEmisor);
                chat.innerHTML += nombreCompleto + ": " + respuesta.text + "<br>";
            } 

            recibirMensaje();
        }
    }
}

function enviarMensaje() {

    var http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let codigoSesion = sessionStorage.getItem("session");
    let receptor = document.getElementById("listaAmigos").value;
    let sms = document.getElementById("sms").value;

    http.open("POST", "http://localhost:3000/Xat/Xat", true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send("mail=" + mail + "&session=" + codigoSesion + "&receptor=" + receptor + "&sms=" + sms);

    let nombre = mail.split("@");
    let primeraLetra = nombre[0].charAt(0).toUpperCase();
    let restoDelNombre = nombre[0].slice(1);
    let nombreCompleto = primeraLetra + restoDelNombre;

    if (!chatsAsignados.includes(receptor) && chatsAsignados.length < 5) {
        
        chatsAsignados.push(receptor);

    } else if (!chatsAsignados.includes(receptor) && chatsAsignados.length >= 5) {

        alert("Solo puedes tener 5 conversaciones a la vez");
    }

    console.log(chatsAsignados);

    let nombreReceptor = receptor.split("@");
    let primeraLetraReceptor = nombreReceptor[0].charAt(0).toUpperCase();
    let restoDelNombreReceptor = nombreReceptor[0].slice(1);
    let nombreCompletoReceptor = primeraLetraReceptor + restoDelNombreReceptor;

    let posicionReceptor = chatsAsignados.indexOf(receptor);

    let pestaña = document.querySelector("#pestaña-" + posicionReceptor);
    pestaña.innerHTML = nombreCompletoReceptor + "<br>";

    let chat = document.querySelector("#chat-" + posicionReceptor);
    chat.innerHTML += nombreCompleto + ": " + sms + "<br>";
}

function crearTitulo() {
    let mail = sessionStorage.getItem("mail");
    let nombre = mail.split("@");

    let primeraLetra = nombre[0].charAt(0).toUpperCase();
    let restoDelNombre = nombre[0].slice(1);
    let nombreCompleto = primeraLetra + restoDelNombre;
    
    document.querySelector("#titulo").innerHTML = "Bienvenido " + nombreCompleto;
}

function limpiarInput() {
    document.getElementById("sms").value = "";
}

function seleccionartPestaña(index) {

    // Bucle para seleccionar la pestaña
    let pestaña = document.getElementsByClassName("pestaña");

    for (let i = 0; i < pestaña.length; i++) {
      if (i === index) {
        pestaña[i].classList.add("selected");
      } else {
        pestaña[i].classList.remove("selected");
      }
    }

    // Bucle para mostrar el contenido de cada chat
    let chat = document.getElementsByClassName("chat");

    for (let j = 0; j < chat.length; j++) {
      if (j === index) {
        chat[j].classList.add("active");
      } else {
        chat[j].classList.remove("active");
      }
    }
}