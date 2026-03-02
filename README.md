# TaskMaster API

API RESTful para la gestión integral de proyectos y tareas, construida con TypeScript y Express.

## 📋 Descripción del Proyecto

TaskMaster API es una solución backend robusta diseñada para gestionar proyectos y tareas de forma eficiente. La API proporciona endpoints bien estructurados para crear, actualizar, eliminar y consultar proyectos, así como gestionar tareas asociadas a cada proyecto.

**Tecnologías principales:**

- Node.js + Express.js
- TypeScript
- Jest (pruebas unitarias)
- Swagger/OpenAPI (documentación)

## 🚀 Características

- ✅ Gestión completa de proyectos (CRUD)
- ✅ Gestión de tareas por proyecto
- ✅ Documentación interactiva con Swagger
- ✅ Cobertura de pruebas unitarias
- ✅ Validación de datos robuusta
- ✅ Manejo de errores estructurado
- ✅ Arquitectura limpia con separación de responsabilidades

## 📦 Requisitos

- Node.js >= 24.x (v24.13.0)
- npm >= 11.x (v11.6.2)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd TaskMaster-API
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=development
```

## 🏃 Uso

### Modo desarrollo

```bash
npm run dev
```

Se iniciará el servidor con nodemon en `http://localhost:3000`

### Compilar TypeScript

```bash
npm run build
```

Genera la carpeta `dist` con el código compilado.

### Ejecutar en producción

```bash
npm start
```

Ejecuta la aplicación compilada desde `dist/app.js`

## 🧪 Pruebas

### Ejecutar todas las pruebas

```bash
npm test
```

### Ejecutar pruebas en modo watch

```bash
npm run test:watch
```

### Generar reporte de cobertura

```bash
npm run test:coverage
```

El reporte se genera en la carpeta `coverage/` con un reporte HTML interactivo.

## 📚 Documentación API

Una vez que el servidor está en ejecución, accede a la documentación interactiva de Swagger:

```
http://localhost:3000/api/v1/docs
```

### Endpoints principales

#### Proyectos

- `GET /api/v1/projects` - Listar todos los proyectos
- `POST /api/v1/projects` - Crear un nuevo proyecto
- `GET /api/v1/projects/{projectId}` - Obtener un proyecto específico
- `PUT /api/v1/projects/{projectId}` - Actualizar un proyecto
- `DELETE /api/v1/projects/{projectId}` - Eliminar un proyecto

#### Tareas

- `GET /api/v1/projects/{projectId}/tasks` - Listar tareas de un proyecto
- `POST /api/v1/projects/{projectId}/tasks` - Crear una tarea
- `GET /api/v1/projects/{projectId}/tasks/{taskId}` - Obtener una tarea específica
- `PUT /api/v1/projects/{projectId}/tasks/{taskId}` - Actualizar una tarea
- `DELETE /api/v1/projects/{projectId}/tasks/{taskId}` - Eliminar una tarea

## 📂 Estructura del Proyecto

```
src/
├── app.ts                    # Configuración principal de Express
├── controllers/              # Controladores (lógica de requests)
│   ├── projectController.ts
│   ├── taskController.ts
│   └── __tests__/
├── models/                   # Modelos de datos
│   ├── projectModel.ts
│   └── taskModel.ts
├── routes/                   # Definición de rutas
│   ├── projectRoutes.ts
│   ├── taskRoutes.ts
│   └── __tests__/
└── services/                 # Lógica de negocio
    ├── projectService.ts
    ├── taskService.ts
    └── __tests__/

data/
└── db.json                   # Almacenamiento de datos (JSON)

coverage/                      # Reportes de cobertura de tests
```

### Arquitectura

El proyecto sigue una **arquitectura en capas**:

1. **Routes** - Define los endpoints y mapea requests
2. **Controllers** - Maneja las solicitudes HTTP y respuestas
3. **Services** - Contiene la lógica de negocio
4. **Models** - Define la estructura de datos

Esta separación permite:

- Código limpio y mantenible
- Facilita las pruebas unitarias
- Escalabilidad y reutilización

## 🔍 Scripts disponibles

| Script                  | Descripción                           |
| ----------------------- | ------------------------------------- |
| `npm start`             | Ejecuta la aplicación compilada       |
| `npm run dev`           | Inicia en modo desarrollo con nodemon |
| `npm run build`         | Compila TypeScript a JavaScript       |
| `npm test`              | Ejecuta todas las pruebas             |
| `npm run test:watch`    | Modo watch para pruebas               |
| `npm run test:coverage` | Genera reporte de cobertura           |

## ✅ Validaciones

La API implementa validaciones robustas en todas las operaciones:

### Proyecto

- **name** (requerido): string no vacío
- **description** (requerido): string no vacío

### Tarea

- **name** (requerido): string no vacío
- **description** (requerido): string no vacío
- **status** (requerido): 'pending', 'in-progress', 'completed'
- **projectId** (requerido): UUID válido

## 🛡️ Manejo de errores

La API devuelve respuestas de error estructuradas:

```json
{
  "error": "Descripción del error",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Códigos HTTP utilizados:

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## 🧪 Pruebas unitarias

El proyecto incluye pruebas completas para:

- Controllers
- Services
- Routes

Ubicación: `src/**/__tests__/`

Para ejecutar con cobertura:

```bash
npm run test:coverage
```

## 📝 Ejemplo de uso

### Crear un proyecto

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Proyecto",
    "description": "Descripción del proyecto"
  }'
```

Respuesta:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Mi Proyecto",
  "description": "Descripción del proyecto"
}
```

### Crear una tarea

```bash
curl -X POST http://localhost:3000/api/v1/projects/{projectId}/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mi Tarea",
    "description": "Descripción de la tarea",
    "status": "pending"
  }'
```

## 🔄 Control de versiones

La API utiliza versionado en la ruta (`/api/v1`) para facilitar evoluciones futuras manteniendo compatibilidad.

## 📊 Base de datos

Actualmente, el proyecto utiliza almacenamiento basado en JSON (`data/db.json`). Para producción, se recomienda migrar a una base de datos relacional como PostgreSQL o MySQL.

## 🚦 Estado del Proyecto

| Aspecto       | Estado                |
| ------------- | --------------------- |
| Desarrollo    | ✅ Completo           |
| Pruebas       | ✅ Cobertura completa |
| Documentación | ✅ OpenAPI/Swagger    |
| Producción    | ⚠️ Requiere DB real   |

## 📄 Licencia

Este proyecto es una prueba técnica para BBVA.

## 👤 Autor

Desarrollo técnico - Prueba BBVA 2026

## 📞 Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.

---

**Última actualización:** Marzo 2026
