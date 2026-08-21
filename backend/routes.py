```python
from flask import Blueprint, request, jsonify, current_app
from itsdangerous import URLSafeTimedSerializer
from conexion import db
from models import Familia, Invitado

api = Blueprint("api", __name__)


# =====================================================
# SEGURIDAD
# =====================================================

def crear_token():

    serializer = URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"]
    )

    return serializer.dumps("admin")


def verificar_token():

    token = request.headers.get("Authorization")

    if not token:
        return False

    # El frontend envía:
    # Authorization: Bearer TOKEN

    if not token.startswith("Bearer "):
        return False

    token = token.replace("Bearer ", "", 1)

    try:

        serializer = URLSafeTimedSerializer(
            current_app.config["SECRET_KEY"]
        )

        serializer.loads(
            token,
            max_age=3600
        )

        return True

    except Exception:

        return False


# =====================================================
# LOGIN ADMIN
# =====================================================

@api.route("/login_admin", methods=["POST", "OPTIONS"])
def login_admin():

    if request.method == "OPTIONS":
        return "", 200

    datos = request.get_json()

    password = datos.get("password")

    if password == current_app.config["ADMIN_PASSWORD"]:

        token = crear_token()

        return jsonify({
            "mensaje": "Login correcto",
            "token": token
        }), 200

    return jsonify({
        "error": "Contraseña incorrecta"
    }), 401


# =====================================================
# BUSCAR FAMILIA
# =====================================================

@api.route("/buscar/<nombre>")
def buscar(nombre):

    invitado = Invitado.query.filter(
        Invitado.nombre.ilike(f"%{nombre}%")
    ).first()

    if not invitado:

        return jsonify({
            "error": "No encontrada"
        }), 404

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


# =====================================================
# CONFIRMAR ASISTENCIA
# =====================================================

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


# =====================================================
# PANEL ADMIN
# =====================================================

@api.route("/admin")
def admin():

    if not verificar_token():

        return jsonify({
            "error": "No autorizado"
        }), 401

    familias = Familia.query.all()

    resultado = []

    for familia in familias:

        asistentes = 0

        integrantes = []

        for invitado in familia.invitados:

            if invitado.asiste:
                asistentes += 1

            integrantes.append({
                "id": invitado.id,
                "nombre": invitado.nombre,
                "asiste": invitado.asiste,
                "menu": invitado.menu
            })

        resultado.append({
            "id": familia.id,
            "familia": familia.nombre_principal,
            "cantidad": familia.cantidad_invitados,
            "confirmados": asistentes,
            "integrantes": integrantes
        })

    return jsonify(resultado)


# =====================================================
# ESTADÍSTICAS
# =====================================================

@api.route("/estadisticas")
def estadisticas():

    if not verificar_token():

        return jsonify({
            "error": "No autorizado"
        }), 401

    familias = Familia.query.count()

    invitados = Invitado.query.count()

    confirmados = Invitado.query.filter_by(
        asiste=True
    ).count()

    pendientes = invitados - confirmados

    return jsonify({
        "familias": familias,
        "invitados": invitados,
        "confirmados": confirmados,
        "pendientes": pendientes
    })


# =====================================================
# AGREGAR FAMILIA
# =====================================================

@api.route("/agregar_familia", methods=["POST"])
def agregar_familia():

    if not verificar_token():

        return jsonify({
            "error": "No autorizado"
        }), 401

    datos = request.get_json()

    nombre_familia = datos.get("familia")
    invitados = datos.get("invitados")

    if not nombre_familia or not invitados:

        return jsonify({
            "error": "Faltan datos"
        }), 400

    if len(invitados) == 0:

        return jsonify({
            "error": "Debe haber al menos un invitado"
        }), 400

    familia = Familia(
        nombre_principal=nombre_familia,
        cantidad_invitados=len(invitados)
    )

    db.session.add(familia)

    db.session.flush()

    for nombre in invitados:

        nuevo_invitado = Invitado(
            familia_id=familia.id,
            nombre=nombre
        )

        db.session.add(nuevo_invitado)

    db.session.commit()

    return jsonify({
        "mensaje": "Familia agregada correctamente",
        "familia": nombre_familia,
        "cantidad": len(invitados)
    }), 201


# =====================================================
# EDITAR FAMILIA
# =====================================================

@api.route(
    "/editar_familia/<int:familia_id>",
    methods=["PUT"]
)
def editar_familia(familia_id):

    if not verificar_token():

        return jsonify({
            "error": "No autorizado"
        }), 401

    familia = Familia.query.get(familia_id)

    if not familia:

        return jsonify({
            "error": "Familia no encontrada"
        }), 404

    datos = request.get_json()

    nombre = datos.get("familia")

    if not nombre or not nombre.strip():

        return jsonify({
            "error": "El nombre de la familia no puede estar vacío"
        }), 400

    familia.nombre_principal = nombre.strip()

    db.session.commit()

    return jsonify({
        "mensaje": "Familia actualizada correctamente"
    })


# =====================================================
# EDITAR INVITADO
# =====================================================

@api.route(
    "/editar_invitado/<int:invitado_id>",
    methods=["PUT"]
)
def editar_invitado(invitado_id):

    if not verificar_token():

        return jsonify({
            "error": "No autorizado"
        }), 401

    invitado = Invitado.query.get(invitado_id)

    if not invitado:

        return jsonify({
            "error": "Invitado no encontrado"
        }), 404

    datos = request.get_json()

    nombre = datos.get("nombre")

    if not nombre or not nombre.strip():

        return jsonify({
            "error": "El nombre del invitado no puede estar vacío"
        }), 400

    invitado.nombre = nombre.strip()

    db.session.commit()

    return jsonify({
        "mensaje": "Invitado actualizado correctamente"
    })


# =====================================================
# AGREGAR INVITADO A UNA FAMILIA
# =====================================================

@api.route(
    "/agregar_invitado/<int:familia_id>",
    methods=["POST"]
)
def agregar_invitado(familia_id):

    if not verificar_token():

        return jsonify({
            "error": "No autorizado"
        }), 401

    familia = Familia.query.get(familia_id)

    if not familia:

        return jsonify({
            "error": "Familia no encontrada"
        }), 404

    datos = request.get_json()

    nombre = datos.get("nombre")

    if not nombre or not nombre.strip():

        return jsonify({
            "error": "El nombre del invitado no puede estar vacío"
        }), 400

    nuevo_invitado = Invitado(
        familia_id=familia.id,
        nombre=nombre.strip()
    )

    db.session.add(nuevo_invitado)

    familia.cantidad_invitados += 1

    db.session.commit()

    return jsonify({
        "mensaje": "Invitado agregado correctamente",
        "id": nuevo_invitado.id
    }), 201


# =====================================================
# ELIMINAR INVITADO
# =====================================================

@api.route(
    "/eliminar_invitado/<int:invitado_id>",
    methods=["DELETE"]
)
def eliminar_invitado(invitado_id):

    if not verificar_token():

        return jsonify({
            "error": "No autorizado"
        }), 401

    invitado = Invitado.query.get(invitado_id)

    if not invitado:

        return jsonify({
            "error": "Invitado no encontrado"
        }), 404

    familia = invitado.familia

    db.session.delete(invitado)

    if familia:

        familia.cantidad_invitados -= 1

    db.session.commit()

    return jsonify({
        "mensaje": "Invitado eliminado correctamente"
    })


# =====================================================
# ELIMINAR FAMILIA
# =====================================================

@api.route(
    "/eliminar_familia/<int:familia_id>",
    methods=["DELETE"]
)
def eliminar_familia(familia_id):

    if not verificar_token():

        return jsonify({
            "error": "No autorizado"
        }), 401

    familia = Familia.query.get(familia_id)

    if not familia:

        return jsonify({
            "error": "Familia no encontrada"
        }), 404

    # Eliminar primero todos sus invitados

    for invitado in familia.invitados:

        db.session.delete(invitado)

    # Después eliminar la familia

    db.session.delete(familia)

    db.session.commit()

    return jsonify({
        "mensaje": "Familia eliminada correctamente"
    })


# =====================================================
# RESETEAR CONFIRMACIONES
# =====================================================

@api.route(
    "/resetear_confirmaciones",
    methods=["POST"]
)
def resetear_confirmaciones():

    if not verificar_token():

        return jsonify({
            "error": "No autorizado"
        }), 401

    invitados = Invitado.query.all()

    for invitado in invitados:

        invitado.asiste = False
        invitado.menu = "Normal"

    db.session.commit()

    return jsonify({
        "mensaje": "Todas las confirmaciones fueron reseteadas correctamente."
    }), 200
