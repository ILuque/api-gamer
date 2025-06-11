# API Railway - Gestión de Juegos

API REST desarrollada con Node.js, Express y PostgreSQL para gestionar información de juegos. Diseñada para desplegarse en Railway.

## 🚀 Características

- **POST /guardar**: Guardar o actualizar información de juegos
- **GET /consultar**: Obtener todos los juegos almacenados  
- **GET /consultar/:game**: Obtener información de un juego específico
- Conexión a PostgreSQL en Railway
- Manejo de errores robusto
- CORS habilitado
- Health checks para Railway

## 📁 Estructura del Proyecto

```
mi-api-railway/
├── src/
│   ├── index.js          # API principal
│   ├── db.js            # Conexión a PostgreSQL
│   ├── routes/          # Endpoints
│   │   ├── guardar.js   # POST /guardar
│   │   └── consultar.js # GET /consultar
├── package.json         # Dependencias
├── .env.example         # Variables de entorno (plantilla)
└── README.md           # Documentación
```

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd mi-api-railway
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales (Railway las provee automáticamente)
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Ejecutar en producción
```bash
npm start
```

## 🗄️ Esquema de Base de Datos

### Tabla: `games`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `game` | TEXT (PK) | Nombre del juego (clave primaria) |
| `date` | JSON | Información adicional del juego en formato JSON |

## 📡 Endpoints de la API

### POST /guardar
Guarda o actualiza información de un juego.

**Request Body:**
```json
{
  "game": "nombre-del-juego",
  "date": {
    "release_date": "2024-01-01",
    "genre": "Action",
    "platform": "PC"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Juego guardado/actualizado exitosamente",
  "data": {
    "game": "nombre-del-juego",
    "date": {
      "release_date": "2024-01-01",
      "genre": "Action", 
      "platform": "PC"
    }
  }
}
```

### GET /consultar
Obtiene todos los juegos almacenados.

**Response (200):**
```json
{
  "success": true,
  "message": "Juegos obtenidos exitosamente",
  "count": 2,
  "data": [
    {
      "game": "juego-1",
      "date": { "info": "data" }
    },
    {
      "game": "juego-2", 
      "date": { "info": "data" }
    }
  ]
}
```

### GET /consultar/:game
Obtiene información de un juego específico.

**Response (200):**
```json
{
  "success": true,
  "message": "Juego encontrado",
  "data": {
    "game": "nombre-del-juego",
    "date": {
      "release_date": "2024-01-01",
      "genre": "Action"
    }
  }
}
```

**Response (404):**
```json
{
  "error": "Juego no encontrado",
  "game": "nombre-inexistente"
}
```

## 🚂 Despliegue en Railway

### 1. Conectar repositorio
- Conecta tu cuenta de GitHub con Railway
- Selecciona este repositorio

### 2. Configurar PostgreSQL
- Añade un servicio PostgreSQL en Railway
- Railway automáticamente configurará `DATABASE_URL`

### 3. Deploy automático
- Railway desplegará automáticamente cuando hagas push a la rama principal
- El servidor estará disponible en la URL que Railway te proporcione

### 4. Variables de entorno
Railway configurará automáticamente:
- `DATABASE_URL`: URL de conexión a PostgreSQL
- `PORT`: Puerto del servidor
- `NODE_ENV`: Entorno de ejecución

## ⚠️ Restricciones

### Limitaciones de PostgreSQL en Railway:
- **Una sola clave primaria por tabla**: La base de datos PostgreSQL en Railway no permite tener más de una columna como clave primaria (PRIMARY KEY) en una tabla. Si necesitas claves compuestas, deberás usar índices únicos alternativos.

### Otras consideraciones:
- **Límites de almacenamiento**: Railway tiene límites en el plan gratuito
- **Límites de conexiones**: PostgreSQL en Railway tiene límites de conexiones concurrentes
- **Tiempo de respuesta**: Los servicios pueden tener cold starts en el plan gratuito

## 🧪 Testing

Puedes probar la API usando curl, Postman o cualquier cliente HTTP:

```bash
# Salud de la API
curl https://tu-app.railway.app/

# Guardar un juego
curl -X POST https://tu-app.railway.app/guardar \
  -H "Content-Type: application/json" \
  -d '{"game":"zelda","date":{"year":2023,"platform":"Switch"}}'

# Consultar todos los juegos
curl https://tu-app.railway.app/consultar

# Consultar un juego específico
curl https://tu-app.railway.app/consultar/zelda
```

## 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs en Railway Dashboard
2. Verifica que las variables de entorno estén configuradas
3. Asegúrate de que la base de datos PostgreSQL esté conectada

## 📄 Licencia

MIT License - ver el archivo LICENSE para más detalles.
