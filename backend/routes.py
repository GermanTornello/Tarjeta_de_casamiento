from flask import Blueprint, request, jsonify

from conexion import db
from models import Familia, Invitado

api = Blueprint("api", __name__)

@api.route("/login_admin", methods=["POST", "OPTIONS"])
def login_admin():

    if request.method == "OPTIONS":
        return "", 200

    datos = request.get_json()

    password = datos.get("password")

    if password == "Boda2026!":
        return jsonify({
            "mensaje": "Login correcto"
        }), 200

    return jsonify({
        "error": "Contraseña incorrecta"
    }), 401


@api.route("/buscar/<nombre>")
def buscar(nombre):

    invitado = Invitado.query.filter(
        Invitado.nombre.ilike(f"%{nombre}%")
    ).first()

    if not invitado:
        return jsonify({"error": "No encontrada"}), 404

    familia = invitado.familia

    invitados = []

    for i in familia.invitados:
        invitados.append({
            "id": i.id,
            "nombre": i.nombre,
            "asiste": i.asiste
        })

    return jsonify({
        "familia": familia.nombre_principal,
        "cantidad": familia.cantidad_invitados,
        "integrantes": invitados
    })


@api.route("/confirmar", methods=["POST"])
def confirmar():

    datos = request.json

    for persona in datos["invitados"]:

        invitado = Invitado.query.get(persona["id"])

        if invitado:
            invitado.asiste = True
            invitado.menu = persona["menu"]

    db.session.commit()

    return jsonify({
        "mensaje": "Confirmación guardada"
    })

@api.route("/admin")
def admin():

    familias = Familia.query.all()

    resultado = []

    for familia in familias:

        asistentes = 0

        integrantes = []

        for invitado in familia.invitados:

            if invitado.asiste:
                asistentes += 1

            integrantes.append({
                "nombre": invitado.nombre,
                "asiste": invitado.asiste,
    "menu": invitado.menu
            })

        resultado.append({
            "familia": familia.nombre_principal,
            "cantidad": familia.cantidad_invitados,
            "confirmados": asistentes,
            "integrantes": integrantes
        })

    return jsonify(resultado)



@api.route("/estadisticas")
def estadisticas():

    familias = Familia.query.count()
    invitados = Invitado.query.count()
    confirmados = Invitado.query.filter_by(asiste=True).count()
    pendientes = invitados - confirmados

    return jsonify({
        "familias": familias,
        "invitados": invitados,
        "confirmados": confirmados,
        "pendientes": pendientes
    })