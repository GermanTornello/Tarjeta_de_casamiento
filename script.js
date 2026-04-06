const fechaBoda = new Date("Nov 15, 2026 20:00:00").getTime();

const x = setInterval(function () {

    const ahora = new Date().getTime();
    const diferencia = fechaBoda - ahora;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML =
        dias + "d " + horas + "h " + minutos + "m " + segundos + "s ";

}, 1000);