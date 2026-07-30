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

function copiarAlias() {

    const alias = document.getElementById("alias");

    if (!alias) return;

    navigator.clipboard.writeText(alias.innerText);

    alert("¡Alias copiado correctamente!");

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

}