cargar();

async function cargar(){

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
        </tr>
    `;

    familias.forEach(f=>{

    let estado = "";
    let color = "";

    if(f.confirmados === 0){

        estado = "🔴 Pendiente";
        color = "#d9534f";

    }else if(f.confirmados < f.cantidad){

        estado = "🟡 Parcial";
        color = "#f0ad4e";

    }else{

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
    </tr>
    `;

});

    document.getElementById("tabla").innerHTML = tabla;

}

function filtrarFamilias(){

    const filtro = document
        .getElementById("buscador")
        .value
        .toLowerCase();

    const filas = document.querySelectorAll("#tabla tr");

    filas.forEach((fila, index)=>{

        if(index === 0) return;

        const texto = fila.textContent.toLowerCase();

        if(texto.includes(filtro)){

            fila.style.display = "";

        }else{

            fila.style.display = "none";

        }

    });

}

function filtrarEstado(estado){

    const filas = document.querySelectorAll("#tabla tr");

    filas.forEach((fila,index)=>{

        if(index===0) return;

        if(fila.textContent.includes(estado)){

            fila.style.display="";

        }else{

            fila.style.display="none";

        }

    });

}

function mostrarTodas(){

    const filas=document.querySelectorAll("#tabla tr");

    filas.forEach(fila=>{

        fila.style.display="";

    });

}