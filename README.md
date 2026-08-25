# 💍 Tarjeta de Casamiento — Maciel & Gisella

Invitación digital e interactiva para el casamiento de **Maciel & Gisella**, desarrollada como una aplicación web responsive y accesible desde celulares y computadoras.

La tarjeta permite a los invitados conocer los detalles del evento, consultar la ubicación, ver la galería de fotos, consultar información sobre regalos y confirmar su asistencia.

---

## 📅 Información del evento

* **Novios:** Maciel & Gisella
* **Fecha:** 26 de diciembre de 2026
* **Recepción:** 20:00 hs
* **Civil:** 20:30 hs
* **Lugar:** Quinta Carmela
* **Dirección:** Montecaseros 338, Coquimbito, Maipú, Mendoza
* **Vestimenta:** Summer Chic

---

## ✨ Características

* 💌 Invitación digital interactiva.
* 📱 Diseño responsive para celulares.
* 💻 Adaptación para computadoras.
* ⏳ Cuenta regresiva hasta el día del casamiento.
* 📍 Ubicación mediante Google Maps.
* 👗 Información sobre código de vestimenta.
* 🎁 Información para regalos.
* 📸 Galería de fotografías.
* 📝 Sistema de confirmación de asistencia.
* 👨‍👩‍👧‍👦 Selección de integrantes de una familia al confirmar asistencia.
* 🗄️ Registro de confirmaciones en una base de datos.
* 🔐 Panel de administración para consultar los invitados.
* ☁️ Backend desplegado mediante Railway.
* 🌐 Frontend publicado mediante GitHub Pages.

---

## 🛠️ Tecnologías utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript
* Google Fonts
* GitHub Pages

### Backend

* Python
* Flask
* Flask-CORS
* PyMySQL
* python-dotenv
* Gunicorn

### Base de datos

* MySQL

### Control de versiones

* Git
* GitHub

### Deploy

* GitHub Pages — Frontend
* Railway — Backend y API

---

## 📁 Estructura del proyecto

```text
Tarjeta_de_casamiento/
│
├── img/
│   ├── foto1.jpg
│   ├── foto2.jpg
│   ├── foto3.jpg
│   ├── foto4.jpg
│   └── ...
│
├── index.html
├── invitacion.html
├── confirmar.html
├── admin.html
├── panel.html
│
├── style.css
├── script.js
├── admin.js
├── panel.js
│
└── README.md
```

---

## 🔄 Funcionamiento

El flujo principal de la invitación es:

```text
                    ┌─────────────────┐
                    │    index.html   │
                    │  Página inicial │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ invitacion.html │
                    │  Invitación     │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
     📍 Ubicación       🎁 Regalos         📸 Galería
          │
          │
          ▼
     📝 Confirmación
          │
          ▼
    confirmar.html
          │
          ▼
        API
          │
          ▼
       MySQL
```

---

## 📝 Confirmación de asistencia

El sistema permite que cada invitado:

1. Ingrese su nombre.
2. Busque su invitación.
3. Visualice los integrantes asociados.
4. Seleccione quiénes asistirán.
5. Confirme la asistencia.
6. Envíe la información al backend.
7. Registre la respuesta en la base de datos.

Esto permite llevar un control organizado de los invitados y sus respectivas confirmaciones.

---

## 🔐 Panel de administración

El proyecto cuenta con un panel privado para administrar y consultar la información de los invitados.

Desde el panel se puede consultar el estado de las confirmaciones y visualizar la información almacenada en la base de datos.

La autenticación del administrador se realiza mediante el backend.

---

## 🌐 Publicación

El frontend de la invitación se encuentra preparado para ser publicado mediante **GitHub Pages**, mientras que la API utilizada para las confirmaciones se encuentra desplegada en **Railway**.

---

## 🚀 Ejecución local

Para ejecutar el frontend localmente simplemente se puede abrir `index.html` utilizando un servidor local.

Para ejecutar el backend:

```bash
python -m venv venv
```

Activar el entorno virtual:

### Windows

```bash
venv\Scripts\activate
```

Instalar las dependencias:

```bash
pip install -r requirements.txt
```

Configurar las variables de entorno necesarias en un archivo `.env`.

Luego iniciar Flask/Gunicorn según la configuración del proyecto.

---

## ⚠️ Variables de entorno

Las credenciales y datos sensibles de la base de datos **no deben almacenarse directamente en el repositorio**.

Se recomienda utilizar variables de entorno mediante un archivo `.env`.

Ejemplo:

```env
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
```

El archivo `.env` debe permanecer fuera del repositorio mediante `.gitignore`.

---

## 📱 Responsive Design

La invitación fue diseñada priorizando la experiencia desde dispositivos móviles, ya que la mayoría de los invitados accederán mediante un teléfono.

Se realizaron ajustes específicos para diferentes tamaños de pantalla, manteniendo la estructura visual y la legibilidad de los contenidos.

---

## 🎨 Diseño

La tarjeta utiliza una estética elegante y romántica, combinando tipografías, fotografías, elementos decorativos y animaciones para crear una experiencia similar a una invitación de casamiento tradicional, pero adaptada al formato digital.

---

## 👨‍💻 Autor

**Germán Tornello**

Proyecto desarrollado para la invitación de casamiento de **Maciel & Gisella**.

---

## ❤️ Estado del proyecto

**Proyecto finalizado y listo para su utilización.**

📅 Casamiento: **26/12/2026**

💍 **Maciel & Gisella**
