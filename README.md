# TaskMaster API

API RESTful para la gestión de proyectos y tareas, construida con TypeScript y Express.

## Descripción

TaskMaster API es una solución backend para gestionar proyectos y tareas de forma eficiente. Proporciona endpoints para crear, actualizar, eliminar y consultar proyectos, así como gestionar tareas asociadas a cada proyecto.

**Tecnologías:**

- Node.js + Express.js
- TypeScript
- Jest (pruebas unitarias)
- Swagger/OpenAPI

## Requisitos

- Node.js v24.13.0
- npm v11.6.2

## Instalación y arranque

```bash
# Instalar dependencias
npm install

# Modo desarrollo (con nodemon)
npm run dev

# O compilar y ejecutar en producción
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

La documentación interactiva en `http://localhost:3000/api/v1/docs`

## Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Modo watch
npm run test:watch

# Con reporte de cobertura
npm run test:coverage
```

## 📚 Documentación API

Una vez que el servidor está en ejecución, accede a la documentación interactiva de Swagger:

```
http://localhost:3000/api/v1/docs
```
