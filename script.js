// ==============================
// INTRO
// ==============================

const intro = document.getElementById("intro");
const hero = document.getElementById("hero");
const abrir = document.getElementById("abrir");

if (abrir) {

    abrir.addEventListener("click", () => {

        intro.style.display = "none";
        hero.style.display = "flex";

    });

}

// ==============================
// IR A INVITACIÓN
// ==============================

const btnInvitacion = document.getElementById("btnInvitacion");

if (btnInvitacion) {

    btnInvitacion.addEventListener("click", () => {

        window.location.href = "invitacion.html";

    });

}

// ==============================
// COPIAR ALIAS
// ==============================

function copiarAlias(id) {

    const dato = document.getElementById(id);

    if (!dato) return;

    navigator.clipboard.writeText(dato.innerText);

    alert("¡Copiado correctamente!");

}

// ==============================
// CUENTA REGRESIVA
// ==============================

const dias = document.getElementById("dias");
const horas = document.getElementById("horas");
const minutos = document.getElementById("minutos");
const segundos = document.getElementById("segundos");

if (dias && horas && minutos && segundos) {

    const fechaCasamiento = new Date("2026-12-26T20:00:00").getTime();

    function actualizarContador() {

        const ahora = new Date().getTime();

        const diferencia = fechaCasamiento - ahora;

        if (diferencia <= 0) {

            dias.textContent = "0";
            horas.textContent = "00";
            minutos.textContent = "00";
            segundos.textContent = "00";

            return;

        }

        const d = Math.floor(diferencia / (1000 * 60 * 60 * 24));

        const h = Math.floor(
            (diferencia % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const m = Math.floor(
            (diferencia % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const s = Math.floor(
            (diferencia % (1000 * 60)) /
            1000
        );

        dias.textContent = d;
        horas.textContent = String(h).padStart(2, "0");
        minutos.textContent = String(m).padStart(2, "0");
        segundos.textContent = String(s).padStart(2, "0");

    }

    actualizarContador();

    setInterval(actualizarContador, 1000);

// ==========================
// CONFIRMAR ASISTENCIA
// ==========================

async function buscarFamilia() {

    const nombre = document.getElementById("buscarNombre").value.trim();

    if (nombre === "") {
        alert("Escribí tu nombre o apellido.");
        return;
    }

    try {

        const respuesta = await fetch(`http://127.0.0.1:5000/buscar/${encodeURIComponent(nombre)}`);

        const datos = await respuesta.json();

        const contenedor = document.getElementById("resultadoBusqueda");

        if (datos.error) {

            contenedor.innerHTML = `
                <p style="color:#b54b4b;">
                    No encontramos ninguna invitación con ese nombre.
                </p>
            `;

            return;
        }

        let html = `
            <div class="familia-card">

                <h3>${datos.familia}</h3>

                <p>
                    Personas invitadas: <strong>${datos.cantidad}</strong>
                </p>

                <br>
        `;

        datos.integrantes.forEach(persona => {

            html += `

                <div class="persona">

                    <input
                        type="checkbox"
                        id="persona${persona.id}"
                        value="${persona.id}"
                    >

                    <label for="persona${persona.id}">
                        ${persona.nombre}
                    </label>

                </div>

            `;

        });

        html += `

                <button
                    class="btn-confirmar"
                    onclick="confirmarAsistencia()">

                    Confirmar asistencia

                </button>

            </div>

        `;

        contenedor.innerHTML = html;

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

}

async function confirmarAsistencia() {

    const checks = document.querySelectorAll(".persona input:checked");

    if (checks.length === 0) {

        alert("Seleccioná al menos una persona.");

        return;

    }

    const invitados = [];

    checks.forEach(c => {

        invitados.push(parseInt(c.value));

    });

    const respuesta = await fetch("http://127.0.0.1:5000/confirmar", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            invitados: invitados

        })

    });

    const datos = await respuesta.json();

    alert(datos.mensaje);

    document.getElementById("resultadoBusqueda").innerHTML = "";

    document.getElementById("buscarNombre").value = "";

}

}