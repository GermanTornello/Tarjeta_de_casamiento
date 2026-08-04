async function login() {

    const password = document.getElementById("password").value;

    const respuesta = await fetch(
        "http://127.0.0.1:5000/login_admin",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password:password
            })
        }
    );

    if(respuesta.ok){

        window.location.href="panel.html";

    }else{

        document.getElementById("mensaje").innerHTML=
        "<p>Contraseña incorrecta.</p>";

    }

}