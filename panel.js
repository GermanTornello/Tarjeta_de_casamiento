// =====================================
// SEGURIDAD
// =====================================

const token = sessionStorage.getItem("admin_token");

if (!token) {
    window.location.href = "admin.html";
}

// =====================================
// CARGAR PANEL
// =====================================

cargar();

async function cargar() {

    try {

        // ==============================
        // ESTADÍSTICAS
        // ==============================

        const stats = await fetch(
    "https://tarjetadecasamiento-production.up.railway.app/estadisticas",
    {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
);

        const datos = await stats.json();

        document.getElementById("estadisticas").innerHTML = `
            <h3>Familias: ${datos.familias}</h3>
            <h3>Invitados: ${datos.invitados}</h3>
            <h3>Confirmados: ${datos.confirmados}</h3>
            <h3>Pendientes: ${datos.pendientes}</h3>
            <br>
        `;


        // ==============================
        // OBTENER FAMILIAS
        // ==============================

       const respuesta = await fetch(
    "https://tarjetadecasamiento-production.up.railway.app/admin",
    {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
);

        const familias = await respuesta.json();


        // ==============================
        // TABLA
        // ==============================

        let tabla = `
            <tr>
                <th>Familia</th>
                <th>Invitados</th>
                <th>Confirmados</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        `;


        familias.forEach((f, index) => {

            let estado = "";
            let color = "";

            if (f.confirmados === 0) {

                estado = "🔴 Pendiente";
                color = "#d9534f";

            } else if (f.confirmados < f.cantidad) {

                estado = "🟡 Parcial";
                color = "#f0ad4e";

            } else {

                estado = "🟢 Completa";
                color = "#5cb85c";

            }


            tabla += `

                <!-- FAMILIA -->

                <tr>

                    <td>
                        ${f.familia}
                    </td>

                    <td>
                        ${f.cantidad}
                    </td>

                    <td>
                        ${f.confirmados}/${f.cantidad}
                    </td>

                    <td style="color:${color};font-weight:bold;">
                        ${estado}
                    </td>

                    <td>

                        <button
                            onclick="mostrarInvitados(${index})"
                            style="
                                padding:8px 16px;
                                border:none;
                                border-radius:20px;
                                background:#b58b54;
                                color:white;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            Ver invitados
                        </button>


                        <button
                            onclick="editarFamilia(${f.id})"
                            style="
                                padding:8px 16px;
                                border:none;
                                border-radius:20px;
                                background:#777;
                                color:white;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            ✏️ Editar
                        </button>


                        <button
                            onclick="eliminarFamilia(${f.id})"
                            style="
                                padding:8px 16px;
                                border:none;
                                border-radius:20px;
                                background:#b54b4b;
                                color:white;
                                cursor:pointer;
                                margin:3px;
                            "
                        >
                            🗑️ Eliminar
                        </button>

                    </td>

                </tr>


                <!-- DETALLE DE FAMILIA -->

                <tr
                    id="detalle-${index}"
                    style="display:none;"
                >

                    <td colspan="5">

                        <div style="
                            padding:20px;
                            text-align:left;
                            background:#faf7f2;
                            border-radius:12px;
                        ">

                            <h3 style="
                                color:#b58b54;
                                margin-bottom:15px;
                            ">
                                ${f.familia}
                            </h3>


                            ${f.integrantes.map(invitado => `

                                <div style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    padding:12px 5px;
                                    border-bottom:1px solid #e6d5b8;
                                    gap:15px;
                                    flex-wrap:wrap;
                                ">


                                    <strong>
                                        ${invitado.nombre}
                                    </strong>


                                    <span>
                                        ${
                                            invitado.asiste
                                            ? "✅ Confirmado"
                                            : "⏳ Pendiente"
                                        }
                                    </span>


                                    <span>
                                        ${
                                            invitado.asiste
                                            ? `🍽 ${invitado.menu || "Sin menú"}`
                                            : "—"
                                        }
                                    </span>


                                    <div>

                                        <button
                                            onclick="editarInvitado(${invitado.id})"
                                            style="
                                                padding:6px 12px;
                                                border:none;
                                                border-radius:15px;
                                                background:#777;
                                                color:white;
                                                cursor:pointer;
                                                margin:2px;
                                            "
                                        >
                                            ✏️
                                        </button>


                                        <button
                                            onclick="eliminarInvitado(${invitado.id})"
                                            style="
                                                padding:6px 12px;
                                                border:none;
                                                border-radius:15px;
                                                background:#b54b4b;
                                                color:white;
                                                cursor:pointer;
                                                margin:2px;
                                            "
                                        >
                                            🗑️
                                        </button>

                                    </div>

                                </div>

                            `).join("")}


                        </div>

                    </td>

                </tr>

            `;

        });


        document.getElementById("tabla").innerHTML = tabla;


        // Guardamos las familias
        window.familiasAdmin = familias;


    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

}



// =====================================
// MOSTRAR / OCULTAR INVITADOS
// =====================================

function mostrarInvitados(index) {

    const detalle = document.getElementById(
        `detalle-${index}`
    );

    if (detalle.style.display === "none") {

        detalle.style.display = "table-row";

    } else {

        detalle.style.display = "none";

    }

}


// =====================================
// BUSCAR FAMILIAS
// =====================================

function filtrarFamilias() {

    const filtro = document
        .getElementById("buscador")
        .value
        .toLowerCase();

    const filas = document.querySelectorAll("#tabla tr");

    filas.forEach((fila, index) => {

        if (index === 0) return;

        // Las filas de detalle siempre permanecen ocultas
        if (fila.id.startsWith("detalle-")) {
            fila.style.display = "none";
            return;
        }

        const texto = fila.textContent.toLowerCase();

        if (texto.includes(filtro)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }

    });

}


// =====================================
// FILTRAR POR ESTADO
// =====================================

function filtrarEstado(estado) {

    const filas = document.querySelectorAll("#tabla tr");

    filas.forEach((fila, index) => {

        if (index === 0) return;

        // Las filas de detalle SIEMPRE permanecen ocultas
        if (fila.id.startsWith("detalle-")) {
            fila.style.display = "none";
            return;
        }

        if (fila.textContent.includes(estado)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }

    });

}


// =====================================
// MOSTRAR TODAS
// =====================================

function mostrarTodas() {

    const filas = document.querySelectorAll("#tabla tr");

    filas.forEach((fila, index) => {

        if (index === 0) return;

        // Las filas de detalle siguen cerradas
        if (fila.id.startsWith("detalle-")) {
            fila.style.display = "none";
            return;
        }

        // Mostrar solamente las familias
        fila.style.display = "";

    });

}

// =====================================
// AGREGAR CAMPOS DE INVITADOS
// =====================================

function agregarCampoInvitado() {

    const lista = document.getElementById(
        "listaInvitados"
    );


    const input = document.createElement("input");


    input.type = "text";

    input.className =
        "input-confirmar invitado-input";

    input.placeholder =
        "Nombre del invitado";


    lista.appendChild(input);

}



// =====================================
// GUARDAR FAMILIA
// =====================================

async function guardarFamilia() {

    const familia = document
        .getElementById("nombreFamilia")
        .value
        .trim();


    const inputs = document.querySelectorAll(
        ".invitado-input"
    );


    const invitados = [];


    inputs.forEach(input => {

        const nombre = input.value.trim();


        if (nombre !== "") {

            invitados.push(nombre);

        }

    });


    if (familia === "") {

        document.getElementById(
            "mensajeFamilia"
        ).innerHTML =
            "⚠️ Escribí el nombre de la familia.";

        return;

    }


    if (invitados.length === 0) {

        document.getElementById(
            "mensajeFamilia"
        ).innerHTML =
            "⚠️ Agregá al menos un invitado.";

        return;

    }


    try {

        const respuesta = await fetch(
            "https://tarjetadecasamiento-production.up.railway.app/agregar_familia",
            {

                method: "POST",

                headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
},

                body: JSON.stringify({

                    familia: familia,

                    invitados: invitados

                })

            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            document.getElementById(
                "mensajeFamilia"
            ).innerHTML =
                "❌ " +
                (datos.error ||
                "No se pudo guardar.");

            return;

        }


        document.getElementById(
            "mensajeFamilia"
        ).innerHTML =
            "✅ Familia agregada correctamente.";


        document.getElementById(
            "nombreFamilia"
        ).value = "";


        document.getElementById(
            "listaInvitados"
        ).innerHTML = `

            <input
                type="text"
                class="input-confirmar invitado-input"
                placeholder="Nombre del invitado"
            >

        `;


        await cargar();


    } catch (error) {

        console.error(error);


        document.getElementById(
            "mensajeFamilia"
        ).innerHTML =
            "❌ No se pudo conectar con el servidor.";

    }

}



// =====================================
// EDITAR FAMILIA
// =====================================

async function editarFamilia(id) {

    const familia = window.familiasAdmin.find(
        f => f.id === id
    );


    if (!familia) {

        alert("No se encontró la familia.");

        return;

    }


    const nuevoNombre = prompt(
        "Editar nombre de la familia:",
        familia.familia
    );


    if (nuevoNombre === null) return;


    const nombre = nuevoNombre.trim();


    if (nombre === "") {

        alert("El nombre no puede estar vacío.");

        return;

    }


    try {

        const respuesta = await fetch(
            `https://tarjetadecasamiento-production.up.railway.app/editar_familia/${id}`,
            {

                method: "PUT",

                headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
},

                body: JSON.stringify({

                    familia: nombre

                })

            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.error ||
                "No se pudo editar la familia."
            );

            return;

        }


        alert(
            "✅ Familia editada correctamente."
        );


        await cargar();


    } catch (error) {

        console.error(error);

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}



// =====================================
// ELIMINAR FAMILIA
// =====================================

async function eliminarFamilia(id) {

    const familia = window.familiasAdmin.find(
        f => f.id === id
    );


    if (!familia) {

        alert("No se encontró la familia.");

        return;

    }


    const confirmar = confirm(
        `¿Seguro que querés eliminar la familia "${familia.familia}"?\n\nTambién se eliminarán todos sus invitados.`
    );


    if (!confirmar) return;


    try {

        const respuesta = await fetch(
    `https://tarjetadecasamiento-production.up.railway.app/eliminar_familia/${id}`,
    {

        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${token}`
        }

    }
);


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.error ||
                "No se pudo eliminar la familia."
            );

            return;

        }


        alert(
            "✅ Familia eliminada correctamente."
        );


        await cargar();


    } catch (error) {

        console.error(error);

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}



// =====================================
// EDITAR INVITADO
// =====================================

async function editarInvitado(id) {

    let invitadoEncontrado = null;


    window.familiasAdmin.forEach(familia => {

        familia.integrantes.forEach(invitado => {

            if (invitado.id === id) {

                invitadoEncontrado = invitado;

            }

        });

    });


    if (!invitadoEncontrado) {

        alert("No se encontró el invitado.");

        return;

    }


    const nuevoNombre = prompt(
        "Editar nombre del invitado:",
        invitadoEncontrado.nombre
    );


    if (nuevoNombre === null) return;


    const nombre = nuevoNombre.trim();


    if (nombre === "") {

        alert(
            "El nombre no puede estar vacío."
        );

        return;

    }


    try {

        const respuesta = await fetch(
            `https://tarjetadecasamiento-production.up.railway.app/editar_invitado/${id}`,
            {

                method: "PUT",

                headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
},

                body: JSON.stringify({

                    nombre: nombre

                })

            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.error ||
                "No se pudo editar el invitado."
            );

            return;

        }


        alert(
            "✅ Invitado editado correctamente."
        );


        await cargar();


    } catch (error) {

        console.error(error);

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}



// =====================================
// ELIMINAR INVITADO
// =====================================

async function eliminarInvitado(id) {

    let invitadoEncontrado = null;


    window.familiasAdmin.forEach(familia => {

        familia.integrantes.forEach(invitado => {

            if (invitado.id === id) {

                invitadoEncontrado = invitado;

            }

        });

    });


    if (!invitadoEncontrado) {

        alert("No se encontró el invitado.");

        return;

    }


    const confirmar = confirm(
        `¿Seguro que querés eliminar a "${invitadoEncontrado.nombre}"?`
    );


    if (!confirmar) return;


    try {

        const respuesta = await fetch(
    `https://tarjetadecasamiento-production.up.railway.app/eliminar_invitado/${id}`,
    {

        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${token}`
        }

    }
);


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.error ||
                "No se pudo eliminar el invitado."
            );

            return;

        }


        alert(
            "✅ Invitado eliminado correctamente."
        );


        await cargar();


    } catch (error) {

        console.error(error);

        alert(
            "No se pudo conectar con el servidor."
        );

    }

}
// =====================================
// RESETEAR CONFIRMACIONES
// =====================================

async function resetearConfirmaciones() {

    const confirmar = confirm(
        "⚠️ ¿Estás seguro de que querés resetear TODAS las confirmaciones?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const respuesta = await fetch(
            "https://tarjetadecasamiento-production.up.railway.app/resetear_confirmaciones",
            {
                method: "POST",
                headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
}
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {

            alert(
                "❌ " + (datos.error || "No se pudieron resetear las confirmaciones.")
            );

            return;
        }

        alert("✅ " + datos.mensaje);

        // Recargar estadísticas y familias
        await cargar();

    } catch (error) {

        console.error(error);

        alert("❌ No se pudo conectar con el servidor.");

    }

}