from flask import Flask
from flask_cors import CORS
from conexion import db
from routes import api
from flask import Blueprint, request, jsonify, current_app

app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Leoncio0@localhost/boda"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["ADMIN_PASSWORD"] = "Boda2026!"

db.init_app(app)

app.register_blueprint(api)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)