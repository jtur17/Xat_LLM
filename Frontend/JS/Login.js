function enviar() {

    var http = new XMLHttpRequest();

    let mail = document.getElementById("mail").value;
    let contraseña = document.getElementById("pass").value;

    cifrarContraseña(contraseña)
        .then(hash => {
        let pass = hash;
        console.log('Contraseña cifrada:', pass);

        // True indica que es asincrónico
        http.open("GET", "http://localhost:3000/Xat/Login?mail="+mail+"&pass="+pass, true);
        http.send();
    })
        .catch(error => {
        console.error('Error al cifrar la contraseña:', error);
    });

    http.onreadystatechange = function(){

        if (this.readyState == 4 && this.status == 200) {

            let sesion = this.responseText;

            if (sesion.length == 9 ) {

                window.sessionStorage.setItem("mail", mail);
                window.sessionStorage.setItem("session", sesion);
                document.getElementById("resultat").innerHTML = "Login correcto";

                irChat();

            } else {

                document.getElementById("resultat").innerHTML = "Login incorrecto";
            }
        }
    }
}

function resetearCampos() {
    document.getElementById("mail").value = "";
    document.getElementById("pass").value = "";
}

function irChat() {

    let codigoSesion = sessionStorage.getItem("session");

    if (codigoSesion != 0) {

        window.location.href = "../Frontend/HTML/Chat.html";
    }
}

function cifrarContraseña(contraseña) {
    
    const encoder = new TextEncoder();
    const data = encoder.encode(contraseña);

    return window.crypto.subtle.digest('SHA-256', data)
        .then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            return hashHex.toUpperCase(); // Convertir a mayúsculas
    });
}
