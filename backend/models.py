from conexion import db

class Familia(db.Model):

    __tablename__="familias"

    id=db.Column(db.Integer,primary_key=True)

    nombre_principal=db.Column(db.String(150))

    cantidad_invitados=db.Column(db.Integer)

    invitados=db.relationship("Invitado",backref="familia")

class Invitado(db.Model):

    __tablename__="invitados"

    id=db.Column(db.Integer,primary_key=True)

    familia_id=db.Column(db.Integer,db.ForeignKey("familias.id"))

    nombre=db.Column(db.String(150))

    asiste=db.Column(db.Boolean,default=False)

    menu=db.Column(db.String(30),default="Normal")