function recibirPaises() {

    var http = new XMLHttpRequest();

    http.open("GET", "http://localhost:3000/Xat/Register", true);
    http.send();

    http.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

          let jsonString = http.responseText;
          let countryList = JSON.parse(jsonString);
          let selectElement = document.getElementById("listaPaises");
      
          for (let i in countryList) {
            let country = countryList[i];
            let option = document.createElement("option");
            option.text = country.name;
            option.value = country.code;
            selectElement.add(option);
          }
        }
    }
}

function resetearCampos() {
    document.getElementById("user").value = "";
    document.getElementById("mail").value = "";
    document.getElementById("pass").value = "";
    document.getElementById("passRepetido").value = "";
    document.getElementById("listaPaises").selectedIndex = -1;
    document.getElementById("condiciones").checked = false;
}

function enviar() {

    var http = new XMLHttpRequest();

    let user = document.getElementById("user").value;
    let mail = document.getElementById("mail").value;
    let pass = document.getElementById("pass").value;
    let passRepetido = document.getElementById("passRepetido").value;
    let codeCountry = document.getElementById("listaPaises").value;
    let conditions = document.getElementById("condiciones").checked;

    if (pass != passRepetido) {
        document.getElementById("resultado").innerHTML = "Las contraseñas no coinciden";
        document.getElementById("resultado").style.color = "red";
        return;
    }

    if (pass.length < 8) {
        document.getElementById("resultado").innerHTML = "La contraseña debe tener al menos 8 caracteres.";
        document.getElementById("resultado").style.color = "red";
        return;
    }

    if (!conditions) {
        document.getElementById("resultado").innerHTML = "Acepta los términos y condiciones para poder registrarte";
        document.getElementById("resultado").style.color = "red";
        return;
    }

    cifrarContraseña(pass)
        .then(hash => {
        let pass = hash;
        console.log('Contraseña cifrada:', pass);

        http.open("POST", "http://localhost:3000/Xat/Register", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send("user=" + user + "&mail=" + mail + "&pass=" + pass + "&codeCountry=" + codeCountry);
    })
        .catch(error => {
        console.error('Error al cifrar la contraseña:', error);
    });

    http.onreadystatechange = function(){

        let respuesta = http.responseText;

        if (http.readyState == 4 && http.status == 200) {

            if (respuesta == "true") {
                document.getElementById("resultado").innerHTML = "Registrado con éxito";
                document.getElementById("resultado").style.color = "green";
            }
        }
    }
}

function cifrarContraseña(contraseña) {
    const encoder = new TextEncoder();
    const data = encoder.encode(contraseña);

    return window.crypto.subtle.digest('SHA-256', data)
        .then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            return hashHex.toUpperCase();
    });
}