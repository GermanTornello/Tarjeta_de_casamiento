cargar();

async function cargar() {

    try {

        const stats = await fetch("http://127.0.0.1:5000/estadisticas");
        const datos = await stats.json();

        document.getElementById("estadisticas").innerHTML = `
            <h3>Familias: ${datos.familias}</h3>
            <h3>Invitados: ${datos.invitados}</h3>
            <h3>Confirmados: ${datos.confirmados}</h3>
            <h3>Pendientes: ${datos.pendientes}</h3>
            <br>
        `;

        const respuesta = await fetch("http://127.0.0.1:5000/admin");

        const familias = await respuesta.json();

        let tabla = `
            <tr>
                <th>Familia</th>
                <th>Invitados</th>
                <th>Confirmados</th>
                <th>Estado</th>
                <th>Detalle</th>
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
                <tr>
                    <td>${f.familia}</td>

                    <td>${f.cantidad}</td>

                    <td>${f.confirmados}/${f.cantidad}</td>

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
                            "
                        >
                            Ver invitados
                        </button>
                    </td>
                </tr>

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

                                </div>

                            `).join("")}

                        </div>

                    </td>
                </tr>
            `;

        });

        document.getElementById("tabla").innerHTML = tabla;

        // Guardamos las familias para poder abrir sus detalles
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

    const detalle = document.getElementById(`detalle-${index}`);

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

    filas.forEach(fila => {

        fila.style.display = "";

    });

}