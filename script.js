const intro = document.getElementById("intro");
const hero = document.getElementById("hero");

document.getElementById("abrir").addEventListener("click", () => {

    intro.style.display = "none";
    hero.style.display = "flex";

});

document.getElementById("btnInvitacion").addEventListener("click", () => {

    window.location.href = "invitacion.html";

});

function copiarAlias(){

    const alias = document.getElementById("alias").innerText;

    navigator.clipboard.writeText(alias);

    alert("¡Alias copiado!");
}