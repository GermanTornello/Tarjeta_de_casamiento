import pandas as pd
from app import app
from conexion import db
from models import Familia, Invitado

# Leer el Excel usando la fila donde están los encabezados
df = pd.read_excel('../Invitados.xlsx', header=2)

# Renombrar columnas
df.columns = ['estado', 'nombre', 'pareja', 'hijo1', 'hijo2', 'total']

with app.app_context():
    # Limpiar datos anteriores
    Invitado.query.delete()
    Familia.query.delete()
    db.session.commit()

    for _, fila in df.iterrows():
        if pd.isna(fila['nombre']):
            continue

        nombre = str(fila['nombre']).strip()

        

        total = int(fila['total']) if pd.notna(fila['total']) else 1

        familia = Familia(
    nombre_principal=nombre,
    cantidad_invitados=total
)

        db.session.add(familia)
        db.session.flush()

        integrantes = [nombre]

        if pd.notna(fila['pareja']):
            integrantes.append(str(fila['pareja']).strip())

        if pd.notna(fila['hijo1']):
            integrantes.append(str(fila['hijo1']).strip())

        if pd.notna(fila['hijo2']):
            integrantes.append(str(fila['hijo2']).strip())

        for persona in integrantes:
            db.session.add(
                Invitado(
                    familia_id=familia.id,
                    nombre=persona
                )
            )

    db.session.commit()

print('Invitados importados correctamente.')