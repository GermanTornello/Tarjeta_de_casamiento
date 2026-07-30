const intro = document.getElementById("intro");
const hero = document.getElementById("hero");

document.getElementById("abrir").addEventListener("click", () => {

    intro.style.display = "none";
    hero.style.display = "flex";

});

document.getElementById("btnInvitacion").addEventListener("click", () => {

    window.location.href = "invitacion.html";

});