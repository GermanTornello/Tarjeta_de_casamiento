async function login() {

    const password = document.getElementById("password").value;

    const respuesta = await fetch(
        "https://tarjetadecasamiento-production.up.railway.app/login_admin",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                password: password
            })
        }
    );

    if (respuesta.ok) {

        window.location.href = "panel.html";

    } else {

        document.getElementById("mensaje").innerHTML =
            "<p>Contraseña incorrecta.</p>";

    }
}