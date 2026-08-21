import os

from flask import Flask
from flask_cors import CORS

from conexion import db
from routes import api


app = Flask(__name__)


@app.route("/")
def inicio():
    return "Backend funcionando 🚀"


CORS(
    app,
    origins=["https://germantornello.github.io"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

# Obtener la URL de la base de datos desde Railway
database_url = os.getenv("MYSQL_URL")

if database_url is None:
    raise Exception(
        "ERROR: No se configuró la conexión a la base de datos."
    )


# Adaptar la URL para SQLAlchemy + PyMySQL
database_url = database_url.replace(
    "mysql://",
    "mysql+pymysql://",
    1
)


app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# La contraseña se obtiene desde las variables de entorno
app.config["ADMIN_PASSWORD"] = os.getenv("ADMIN_PASSWORD")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

db.init_app(app)

app.register_blueprint(api)


with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run()