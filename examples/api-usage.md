# Ejemplos de Uso de la API de Lugares

## Configuración Base

URL Base: `http://localhost:3000/api/v1`

## 1. Verificar Estado de la Aplicación

```bash
curl -X GET http://localhost:3000/api/v1/health
```

## 2. Crear un Nuevo Lugar

```bash
curl -X POST http://localhost:3000/api/v1/places \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Café Central",
    "description": "Un acogedor café en el centro de la ciudad con ambiente vintage y excelente café de especialidad",
    "category": "cafetería",
    "tags": ["vintage", "tranquilo", "instagrameable", "café de especialidad"],
    "latitude": -12.046374,
    "longitude": -77.042793,
    "address": "Av. Larco 123, Miraflores, Lima",
    "imageUrl": "https://example.com/images/cafe-central.jpg",
    "isHiddenGem": false
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

## 10. Obtener un Lugar Específico

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
        "name": "Café Central",
        "description": "Un acogedor café en el centro de la ciudad",
        "category": "cafetería",
        "tags": ["vintage", "tranquilo", "instagrameable"],
        "latitude": -12.046374,
        "longitude": -77.042793,
        "address": "Av. Larco 123, Miraflores, Lima",
        "imageUrl": "https://example.com/images/cafe-central.jpg",
        "isHiddenGem": false,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "distance": 2.5
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
6. **Ordenamiento**: Campos válidos: name, category, createdAt, distance (solo con búsqueda por proximidad)