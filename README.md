# Sistema de Turnos — Frontend

Interfaz de usuario construida con **React** y **Tailwind CSS** para el sistema de turnos de atención al público.

## Tecnologías

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts

## Requisitos previos

- Node.js 18 o superior
- El backend del sistema de turnos corriendo en `http://127.0.0.1:8000`

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-usuario/sistema-turnos-frontend.git
cd sistema-turnos-frontend

# 2. Instala las dependencias
npm install
```

## Ejecución

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Vistas disponibles

|Ruta|Descripción|Acceso|
|---|---|---|
|`/turno`|Pantalla para generar turno|Público|
|`/sala-espera`|Pantalla pública con turno actual y cola|Público|
|`/login`|Inicio de sesión para personal|Público|
|`/ejecutivo`|Panel del cajero/ejecutivo|Requiere login|
|`/admin/dashboard`|Dashboard con estadísticas y gráficas|Requiere login admin|

## Usuarios de prueba

|Usuario|Contraseña|Rol|Redirige a|
|---|---|---|---|
|`cajero1`|`1234`|Caja 1|`/ejecutivo`|
|`ejecutivo1`|`1234`|Ejecutivo|`/ejecutivo`|
|`admin`|`admin123`|Administrador|`/admin/dashboard`|

## Flujo de uso

### Ciudadano

1. Accede a `/turno` desde una tablet o PC en recepción
2. Selecciona el servicio que necesita
3. Obtiene su folio de turno (ej: `CA001`)
4. Espera a ser llamado en la pantalla de `/sala-espera`

### Ejecutivo / Cajero

1. Inicia sesión en `/login`
2. Ve la cola de turnos de su área
3. Llama al siguiente turno
4. Al finalizar la atención registra el género del ciudadano
5. El turno queda marcado como atendido

### Administrador

1. Inicia sesión en `/login`
2. Accede al dashboard con estadísticas del día
3. Visualiza gráficas de turnos por género, por hora y por área

## Estructura del proyecto

```css
src/
├── api/
│   └── axios.js                  # Configuración base de Axios
├── context/
│   └── AuthContext.jsx           # Contexto global de autenticación
├── routes/
│   └── ProtectedRoute.jsx        # Protección de rutas privadas
├── components/
│   ├── ui/
│   │   ├── Button.jsx            # Botón reutilizable
│   │   ├── Card.jsx              # Tarjeta contenedora
│   │   ├── Badge.jsx             # Etiqueta de estado
│   │   ├── Modal.jsx             # Ventana modal
│   │   └── StatCard.jsx          # Tarjeta de estadística
│   ├── layout/
│   │   └── Header.jsx            # Encabezado con info de usuario
│   └── charts/
│       ├── TurnosPorGenero.jsx   # Gráfica de dona por género
│       ├── TurnosPorHora.jsx     # Gráfica de barras por hora
│       └── TurnosPorArea.jsx     # Gráfica de barras por área
└── pages/
    ├── Login.jsx                 # Pantalla de inicio de sesión
    ├── Kiosko.jsx                # Generación de turno (/turno)
    ├── SalaEspera.jsx            # Pantalla pública
    ├── Ejecutivo.jsx             # Panel del operador
    └── admin/
        └── Dashboard.jsx         # Dashboard administrativo
```

## Notas

- La sesión del usuario se guarda en `localStorage` y persiste al recargar la página.
- Las vistas de `/turno` y `/sala-espera` están pensadas para estar abiertas permanentemente en pantallas dedicadas.
- El dashboard se actualiza automáticamente cada 10 segundos.
- La cola del ejecutivo se actualiza cada 5 segundos.