console.log("confirmar.js cargado");

const btnBuscar = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

btnBuscar.addEventListener("click", buscarFamilia);

async function buscarFamilia() {

    const nombre = document.getElementById("nombre").value.trim();

    if (nombre === "") {
        alert("Escribí un nombre o apellido.");
        return;
    }

    try {

        const respuesta = await fetch(`https://tarjetadecasamiento-production.up.railway.app/buscar/${encodeURIComponent(nombre)}`);

        const datos = await respuesta.json();

        if (datos.error) {

            resultado.innerHTML = `
                <p>No encontramos ninguna invitación con ese nombre.</p>
            `;

            return;
        }

        let html = `
<div class="familia">

<h3>Familia ${datos.familia}</h3>

<p>
Seleccioná las personas que asistirán a la celebración.
</p>
`;

        datos.integrantes.forEach(persona => {

            html += `

            <div class="persona">

                <label>

                   <input
    type="checkbox"
    value="${persona.id}"
    onchange="mostrarMenu(${persona.id})"
>

                    ${persona.nombre}

                </label>

               <div
   <div
    id="menu-${persona.id}"
    class="menu-persona oculto"
>

    <label>Tipo de menú</label>

    <select
        id="select-${persona.id}"
        class="menu-select"
    >

        <option value="Normal">🍽 Normal</option>
        <option value="Celiaco">🌾 Celíaco</option>
        <option value="Vegetariano">🥗 Vegetariano</option>
        <option value="Vegano">🌱 Vegano</option>

    </select>

</div>

            </div>

            `;

        });

        html += `

            <br>

            <button
                class="btn-evento"
                onclick="confirmarAsistencia()"
            >

                Confirmar asistencia

            </button>

        </div>
        `;

        resultado.innerHTML = html;

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

}

function mostrarMenu(id) {

    const check = document.querySelector(`input[value="${id}"]`);
    const menu = document.getElementById(`menu-${id}`);

    if (!check || !menu) return;

    if (check.checked) {

        menu.classList.remove("oculto");

    } else {

        menu.classList.add("oculto");

    }
}
async function confirmarAsistencia() {

    const checks = document.querySelectorAll(
        "#resultado input[type='checkbox']:checked"
    );

    if (checks.length === 0) {

        alert("Seleccioná al menos una persona.");

        return;

    }

    const invitados = [];

    checks.forEach(check => {

        invitados.push({

            id: parseInt(check.value),

            menu: document.getElementById(`select-${check.value}`).value

        });

    });

    const respuesta = await fetch(
    "https://tarjetadecasamiento-production.up.railway.app/confirmar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                invitados: invitados
            })
        }
    );

    await respuesta.json();

    window.location.href = "gracias.html";

}