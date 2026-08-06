import os
from flask import Flask
from flask_cors import CORS
from conexion import db
from routes import api

app = Flask(__name__)

CORS(app)

# Obtener la URL de la base de datos desde Railway
database_url = os.getenv("URL_MYSQL")

print("URL_MYSQL =", database_url)

if database_url is None:
    raise Exception("ERROR: La variable URL_MYSQL no existe en Railway.")

# Adaptar la URL para SQLAlchemy + PyMySQL
database_url = database_url.replace("mysql://", "mysql+pymysql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["ADMIN_PASSWORD"] = "Boda2026!"

db.init_app(app)

app.register_blueprint(api)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)