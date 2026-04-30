# CeDiVe - Centro Médico Veterinario (Frontend) 🐾

Este es el frontend de **CeDiVe**, una aplicación web integral diseñada para la gestión de una clínica veterinaria. El sistema permite administrar usuarios, pacientes (mascotas), turnos médicos y recetas(en la siguiente versión) de forma eficiente y segura.

## 🚀 Características Principales

- **Gestión de Usuarios y Médicos:** Panel administrativo para crear, editar y dar de baja usuarios con diferentes niveles de acceso (ADMIN, MEDICO, USER).
- **Sistema de Pacientes:** Registro detallado de mascotas vinculado a sus dueños, incluyendo especie, raza, peso e historial clínico.
- **Autenticación y Seguridad:** - Rutas protegidas mediante verificaciones síncronas y asíncronas.
  - Manejo de sesiones volátiles con `localStorage`.
- **Interfaz Administrativa:** Panel lateral (Sidebar) con navegación fluida para gestionar turnos, y bases de datos de pacientes.
- **Validaciones de UI:** Manejo de estados de carga (Spinners) y validaciones de formularios en tiempo real.

## 🛠️ Tecnologías Utilizadas

- **React.js**: Biblioteca principal para la construcción de la interfaz.
- **Vite**: Herramienta de construcción para un entorno de desarrollo rápido.
- **React Bootstrap**: Framework de componentes para un diseño responsive y profesional.
- **React Router DOM**: Gestión de navegación y protección de rutas.
- **JWT (JSON Web Tokens)**: Manejo de tokens para sesiones seguras.
- **CSS3**: Estilos personalizados para la identidad visual de CeDiVe.

## 📦 Estructura del Proyecto

```text
src/
├── assets/         # Íconos, imágenes y recursos visuales.
├── components/     # Componentes reutilizables (Tablas, Modales, Calendario).
├── helpers/        # Funciones para peticiones a la API (apiUsuarios, apiMascotas, ect.).
├── routes/         # Lógica de rutas protegidas (ProtectedRouteAdmin, etc.).
├── styles/         # Archivos de estilos CSS por página/componente.
├── pages/          # Vistas principales (HomePage, AdminPage).
└── App.jsx         # Cerebro de la aplicación y rehidratación de sesión.