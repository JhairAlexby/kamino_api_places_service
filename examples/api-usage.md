# Ejemplos de Uso de la API de Lugares

## Configuración Base

URL Base: `http://localhost:3000/api/v1`

## 1. Verificar Estado de la Aplicación

```bash
curl -X GET http://localhost:3000/api/v1/health
```

## 2. Crear un Nuevo Lugar

### Lugar con horarios de apertura
```bash
curl -X POST http://localhost:3000/api/v1/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Museo de Arte",
    "description": "Museo de arte contemporáneo con exposiciones permanentes y temporales",
    "category": "museo",
    "tags": ["arte", "cultura", "familia"],
    "latitude": -12.046374,
    "longitude": -77.042793,
    "address": "Av. 9 de Julio 123, Lima",
    "imageUrl": "https://example.com/images/museo-arte.jpg",
    "isHiddenGem": false,
    "openingTime": "09:00:00",
    "closingTime": "18:00:00",
    "tourDuration": 120
  }'
```

### Restaurante nocturno
```bash
curl -X POST http://localhost:3000/api/v1/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurante Central",
    "description": "Restaurante de alta cocina con menú degustación",
    "category": "restaurante",
    "tags": ["gourmet", "romántico", "celebraciones"],
    "latitude": -12.1219,
    "longitude": -77.0297,
    "address": "Calle Central 456, Miraflores",
    "imageUrl": "https://example.com/images/restaurante-central.jpg",
    "isHiddenGem": true,
    "openingTime": "19:00:00",
    "closingTime": "23:30:00",
    "tourDuration": 180
  }'
```

## 3. Obtener Todos los Lugares (con paginación)

```bash
curl -X GET "http://localhost:3000/api/v1/places?page=1&limit=10"
```

## 4. Buscar Lugares por Nombre

```bash
curl -X GET "http://localhost:3000/api/v1/places?search=café"
```

## 5. Filtrar por Categoría

```bash
curl -X GET "http://localhost:3000/api/v1/places?category=cafetería"
```

## 6. Filtrar por Etiquetas

```bash
curl -X GET "http://localhost:3000/api/v1/places?tags=vintage,tranquilo"
```

## 7. Buscar Lugares Cercanos

### Búsqueda básica (Lima Centro)
```bash
curl -X POST http://localhost:3000/api/v1/places/nearby \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -12.0464,
    "longitude": -77.0428,
    "radius": 5,
    "limit": 10
  }'
```

### Búsqueda con radio amplio (Miraflores)
```bash
curl -X POST http://localhost:3000/api/v1/places/nearby \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -12.1219,
    "longitude": -77.0297,
    "radius": 15,
    "limit": 20
  }'
```

### Búsqueda por horario de apertura
```bash
curl -X POST http://localhost:3000/api/v1/places/nearby \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -12.0464,
    "longitude": -77.0428,
    "radius": 3,
    "openingTime": "09:00:00",
    "limit": 15
  }'
```

### Búsqueda mínima (solo coordenadas requeridas)
```bash
curl -X POST http://localhost:3000/api/v1/places/nearby \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -12.046374,
    "longitude": -77.042793
  }'
```

## 8. Filtrar Solo Joyas Ocultas

```bash
curl -X GET "http://localhost:3000/api/v1/places?isHiddenGem=true"
```

## 9. Búsqueda Avanzada Combinada

```bash
curl -X GET "http://localhost:3000/api/v1/places?search=café&category=cafetería&tags=vintage&latitude=-12.046374&longitude=-77.042793&radius=10&sortBy=distance&sortOrder=ASC&page=1&limit=5"
```

## 10. Filtrar por Horarios y Duración

### Lugares que abren a las 9 AM
```bash
curl -X GET "http://localhost:3000/api/v1/places?openingTime=09:00:00"
```

### Lugares con tours de 2-3 horas
```bash
curl -X GET "http://localhost:3000/api/v1/places?minTourDuration=120&maxTourDuration=180"
```

### Lugares que cierran después de las 10 PM
```bash
curl -X GET "http://localhost:3000/api/v1/places?closingTime=22:00:00&sortBy=closingTime&sortOrder=DESC"
```

## 11. Obtener Lugares Abiertos Ahora

### Todos los lugares abiertos actualmente
```bash
curl -X GET "http://localhost:3000/api/v1/places/available-now"
```

### Restaurantes abiertos ahora
```bash
curl -X GET "http://localhost:3000/api/v1/places/available-now?category=restaurante"
```

### Lugares abiertos cerca de mi ubicación
```bash
curl -X GET "http://localhost:3000/api/v1/places/available-now?latitude=-12.046374&longitude=-77.042793&radius=5"
```

## 12. Actualizar Horarios de un Lugar

### Actualizar solo horarios
```bash
curl -X PATCH http://localhost:3000/api/v1/places/{place-id} \
  -H "Content-Type: application/json" \
  -d '{
    "openingTime": "08:30:00",
    "closingTime": "22:00:00",
    "tourDuration": 90
  }'
```

### Actualizar información completa
```bash
curl -X PATCH http://localhost:3000/api/v1/places/{place-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurante Central - Nueva Temporada",
    "description": "Experiencia gastronómica única con menú degustación actualizado",
    "category": "restaurante",
    "tags": ["gourmet", "temporada", "experiencia"],
    "openingTime": "19:30:00",
    "closingTime": "23:00:00",
    "tourDuration": 150,
    "isHiddenGem": true
  }'
```

## 13. Obtener un Lugar Específico

```bash
curl -X GET http://localhost:3000/api/v1/places/{place-id}
```

## 11. Actualizar un Lugar

```bash
curl -X PATCH http://localhost:3000/api/v1/places/{place-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Café Central Renovado",
    "description": "Un acogedor café renovado en el centro de la ciudad",
    "isHiddenGem": true
  }'
```

## 12. Alternar Estado de Joya Oculta

```bash
curl -X PATCH http://localhost:3000/api/v1/places/{place-id}/toggle-hidden-gem
```

## 13. Obtener Todas las Categorías

```bash
curl -X GET http://localhost:3000/api/v1/places/categories
```

## 14. Obtener Todas las Etiquetas

```bash
curl -X GET http://localhost:3000/api/v1/places/tags
```

## 15. Eliminar un Lugar

```bash
curl -X DELETE http://localhost:3000/api/v1/places/{place-id}
```

## Respuestas de Ejemplo

### Respuesta Exitosa (GET /places)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Datos obtenidos exitosamente",
  "data": {
    "data": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Museo de Arte",
        "description": "Museo de arte contemporáneo con exposiciones permanentes y temporales",
        "category": "museo",
        "tags": ["arte", "cultura", "familia"],
        "latitude": -12.046374,
        "longitude": -77.042793,
        "address": "Av. 9 de Julio 123, Lima",
        "imageUrl": "https://example.com/images/museo-arte.jpg",
        "isHiddenGem": false,
        "openingTime": "09:00:00",
        "closingTime": "18:00:00",
        "tourDuration": 120,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "distance": 2.5
      },
      {
        "id": "234f5678-f90c-23e4-b567-537725285111",
        "name": "Restaurante Central",
        "description": "Restaurante de alta cocina con menú degustación",
        "category": "restaurante",
        "tags": ["gourmet", "romántico", "celebraciones"],
        "latitude": -12.1219,
        "longitude": -77.0297,
        "address": "Calle Central 456, Miraflores",
        "imageUrl": "https://example.com/images/restaurante-central.jpg",
        "isHiddenGem": true,
        "openingTime": "19:00:00",
        "closingTime": "23:30:00",
        "tourDuration": 180,
        "createdAt": "2024-01-14T15:45:00Z",
        "updatedAt": "2024-01-14T15:45:00Z",
        "distance": 5.2
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5,
      "hasPrevious": false,
      "hasNext": true
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Respuesta de Error

```json
{
  "success": false,
  "statusCode": 404,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/places/invalid-id",
  "method": "GET",
  "message": "Lugar con ID invalid-id no encontrado"
}
```

## Notas Importantes

1. **Coordenadas**: Las coordenadas deben estar en formato decimal (WGS84)
2. **Distancias**: Se calculan en kilómetros usando la fórmula de Haversine
3. **Paginación**: Por defecto, page=1 y limit=10
4. **Etiquetas**: Se pueden enviar como string separado por comas o como array
5. **Búsqueda**: La búsqueda por nombre es case-insensitive y usa LIKE
6. **Ordenamiento**: Campos válidos: name, category, createdAt, distance (solo con búsqueda por proximidad), openingTime, closingTime, tourDuration
7. **Horarios**: Formato HH:MM:SS (24 horas), ejemplos: "09:00:00", "18:30:00", "23:59:59"
8. **Duración de Tour**: En minutos, debe ser un número entero positivo (ej: 120 para 2 horas)
9. **Filtros de Horario**: Se pueden combinar para encontrar lugares específicos (ej: abren a las 9 AM, duración entre 60-180 minutos)
10. **Lugares Abiertos Ahora**: El endpoint `/available-now` usa la hora actual del servidor para filtrar lugares abiertos