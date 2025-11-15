# Ejemplo de uso del endpoint POST /api/v1/places/bulk

## Descripción
El nuevo endpoint `/api/v1/places/bulk` te permite crear múltiples lugares en una sola petición, con un límite de 100 lugares por petición.

## Ejemplo de petición

### Crear 3 lugares de una vez:

```bash
curl -X POST http://localhost:3000/api/v1/places/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "places": [
      {
        "name": "Café Central",
        "description": "Un acogedor café en el centro de la ciudad con ambiente vintage",
        "category": "cafetería",
        "tags": ["vintage", "tranquilo", "instagrameable"],
        "latitude": -12.046374,
        "longitude": -77.042793,
        "address": "Av. Larco 123, Miraflores, Lima",
        "imageUrl": "https://ejemplo.com/cafe.jpg",
        "isHiddenGem": false,
        "openingTime": "08:30",
        "closingTime": "21:00",
        "tourDuration": 60
      },
      {
        "name": "Museo de Historia",
        "description": "Exhibiciones de historia local y arte colonial",
        "category": "museo",
        "tags": ["educativo", "familiar", "cultura"],
        "latitude": -12.045374,
        "longitude": -77.043793,
        "address": "Av. Principal 456, Centro Histórico",
        "imageUrl": "https://ejemplo.com/museo.jpg",
        "isHiddenGem": false,
        "openingTime": "09:00",
        "closingTime": "18:00",
        "tourDuration": 90
      },
      {
        "name": "Parque Central",
        "description": "Hermoso parque con jardines y área de juegos",
        "category": "parque",
        "tags": ["naturaleza", "familiar", "deporte"],
        "latitude": -12.044374,
        "longitude": -77.044793,
        "address": "Parque Central, Distrito Central",
        "imageUrl": "https://ejemplo.com/parque.jpg",
        "isHiddenGem": true,
        "openingTime": "06:00",
        "closingTime": "20:00",
        "tourDuration": 45
      }
    ]
  }'
```

## Respuesta exitosa (201):

```json
{
  "success": true,
  "statusCode": 201,
  "message": "3 lugares creados exitosamente, 0 fallidos",
  "data": {
    "created": 3,
    "failed": 0,
    "results": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Café Central",
        "status": "created"
      },
      {
        "id": "223e4567-e89b-12d3-a456-426614174001",
        "name": "Museo de Historia",
        "status": "created"
      },
      {
        "id": "323e4567-e89b-12d3-a456-426614174002",
        "name": "Parque Central",
        "status": "created"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Ejemplo con coordenadas en formato string:

```bash
curl -X POST http://localhost:3000/api/v1/places/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "places": [
      {
        "name": "Restaurante Vista al Mar",
        "description": "Restaurante con vista panorámica al mar",
        "category": "restaurante",
        "tags": ["gourmet", "vista al mar", "romántico"],
        "coordinates": "-12.043374, -77.045793",
        "address": "Malecón 789, Costa Verde",
        "isHiddenGem": false
      }
    ]
  }'
```

## Casos de error:

### 1. Límite excedido (más de 100 lugares):
```json
{
  "statusCode": 400,
  "message": [
    "places must contain no more than 100 elements"
  ],
  "error": "Bad Request"
}
```

### 2. Datos inválidos:
```json
{
  "statusCode": 400,
  "message": [
    "places.0.latitude must not be empty",
    "places.0.longitude must not be empty"
  ],
  "error": "Bad Request"
}
```

### 3. Algunos lugares fallan pero otros se crean:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "2 lugares creados exitosamente, 1 fallidos",
  "data": {
    "created": 2,
    "failed": 1,
    "results": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Café Central",
        "status": "created"
      },
      {
        "name": "Lugar con Error",
        "status": "failed",
        "error": "Debe especificar latitude y longitude o el campo coordinates"
      },
      {
        "id": "323e4567-e89b-12d3-a456-426614174002",
        "name": "Parque Central",
        "status": "created"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Características importantes:

1. **Límite de 100 lugares por petición** - Validado automáticamente
2. **Procesamiento individual** - Si un lugar falla, los demás se siguen procesando
3. **Respuesta detallada** - Informa cuántos lugares se crearon y cuántos fallaron
4. **Mismo formato** - Usa el mismo DTO que el endpoint individual
5. **Soporte para coordenadas** - Acepta tanto `latitude/longitude` como `coordinates` en formato string
6. **Tamaño de JSON** - Configurado para soportar JSON grandes (hasta 10MB)

## Comparación con el endpoint individual:

| Característica | POST /places | POST /places/bulk |
|----------------|--------------|-------------------|
| Lugares por petición | 1 | 1-100 |
| Tiempo de respuesta | Rápido | Proporcional a cantidad |
| Atomicidad | ✅ | ❌ (procesamiento individual) |
| Uso recomendado | Crear uno | Crear muchos |

## Ejemplo de script para crear 100 lugares:

```javascript
const lugares = [];
for (let i = 0; i < 100; i++) {
  lugares.push({
    name: `Lugar ${i + 1}`,
    description: `Descripción del lugar ${i + 1}`,
    category: 'test',
    latitude: -12.046374 + (i * 0.001),
    longitude: -77.042793 + (i * 0.001),
    address: `Dirección ${i + 1}`
  });
}

fetch('http://localhost:3000/api/v1/places/bulk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ places: lugares })
})
.then(response => response.json())
.then(data => console.log('Creados:', data.data.created));
```