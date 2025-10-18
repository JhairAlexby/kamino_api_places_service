# Kamino Places API

Microservicio de lugares para Kamino - Base de datos central de puntos de interés de la ciudad.

## Descripción

Este microservicio funciona como la base de datos central de puntos de interés, proporcionando un catálogo completo de lugares con funcionalidades avanzadas de búsqueda, filtrado y gestión geoespacial.

## Características Principales

### 1. Catálogo de Lugares
- Información detallada de cada ubicación
- Coordenadas geográficas precisas
- Categorización y etiquetado
- Galería de imágenes
- Sistema de "joyas ocultas"

### 2. Búsqueda y Filtrado Avanzado
- Búsqueda por nombre
- Filtrado por categorías y etiquetas
- Búsqueda por proximidad geográfica
- Ordenamiento personalizable
- Paginación de resultados

### 3. Funcionalidades Administrativas
- CRUD completo de lugares
- Gestión de categorías y etiquetas
- Toggle de "joya oculta"
- API RESTful documentada

### 4. Procesamiento Geoespacial
- Cálculo de distancias
- Consultas de proximidad
- Coordenadas de alta precisión

## Tecnologías Utilizadas

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Lenguaje**: TypeScript

## Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd kamino_api_places_service
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Configurar base de datos PostgreSQL:
```sql
CREATE DATABASE kamino_places;
```

## Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `DB_HOST` | Host de la base de datos | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USERNAME` | Usuario de la base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de la base de datos | `password` |
| `DB_NAME` | Nombre de la base de datos | `kamino_places` |
| `PORT` | Puerto de la aplicación | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `API_PREFIX` | Prefijo de la API | `api/v1` |

## Ejecución

### Desarrollo
```bash
pnpm run start:dev
```

### Producción
```bash
pnpm run build
pnpm run start:prod
```

## Documentación de la API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/docs
```

## Endpoints Principales

### Lugares

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/places` | Obtener lugares con filtros |
| `GET` | `/api/v1/places/:id` | Obtener lugar por ID |
| `POST` | `/api/v1/places` | Crear nuevo lugar |
| `PATCH` | `/api/v1/places/:id` | Actualizar lugar |
| `DELETE` | `/api/v1/places/:id` | Eliminar lugar |
| `GET` | `/api/v1/places/nearby` | Buscar lugares cercanos |
| `PATCH` | `/api/v1/places/:id/toggle-hidden-gem` | Toggle joya oculta |
| `GET` | `/api/v1/places/categories` | Obtener categorías |
| `GET` | `/api/v1/places/tags` | Obtener etiquetas |

### Parámetros de Búsqueda

- `search`: Búsqueda por nombre
- `category`: Filtrar por categoría
- `tags`: Filtrar por etiquetas (separadas por coma)
- `latitude`, `longitude`, `radius`: Búsqueda por proximidad
- `isHiddenGem`: Filtrar joyas ocultas
- `sortBy`: Campo de ordenamiento
- `sortOrder`: Orden (ASC/DESC)
- `page`, `limit`: Paginación

## Estructura del Proyecto

```
src/
├── common/
│   ├── filters/          # Filtros de excepción
│   └── interceptors/     # Interceptores de respuesta
├── config/
│   └── database.config.ts
├── controllers/
│   └── places.controller.ts
├── dto/
│   ├── create-place.dto.ts
│   ├── update-place.dto.ts
│   ├── filter-places.dto.ts
│   ├── place-response.dto.ts
│   └── paginated-response.dto.ts
├── entities/
│   └── place.entity.ts
├── places/
│   └── places.module.ts
├── services/
│   └── places.service.ts
├── app.module.ts
└── main.ts
```

## Modelo de Datos

### Entidad Place

```typescript
{
  id: string;              // UUID único
  name: string;            // Nombre del lugar
  description: string;     // Descripción detallada
  category: string;        // Categoría principal
  tags: string[];          // Etiquetas descriptivas
  latitude: number;        // Latitud (precisión 8 decimales)
  longitude: number;       // Longitud (precisión 8 decimales)
  address: string;         // Dirección completa
  imageUrl?: string;       // URL de imagen principal
  isHiddenGem: boolean;    // Indicador de joya oculta
  createdAt: Date;         // Fecha de creación
  updatedAt: Date;         // Fecha de actualización
}
```

## Scripts Disponibles

```bash
# Desarrollo
pnpm run start:dev

# Construcción
pnpm run build

# Producción
pnpm run start:prod

# Tests
pnpm run test
pnpm run test:watch
pnpm run test:cov

# Linting
pnpm run lint

# Formateo
pnpm run format
```

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia UNLICENSED.
