# FitCoach AI Backend

Backend NestJS para FitCoach AI con autenticación Supabase y MongoDB.

## Configuración

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configura las variables de entorno en `.env`:
- `MONGODB_URI`: URL de conexión a MongoDB
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY`: Anon key de Supabase
- `SUPABASE_SERVICE_KEY`: Service role key de Supabase

3. Instala las dependencias (ya instaladas):
```bash
npm install
```

4. Inicia el servidor en desarrollo:
```bash
npm run start:dev
```

## Endpoints

### Usuarios
- `GET /users/me` - Obtener usuario actual
- `PUT /users/me` - Actualizar usuario actual

### Rutinas
- `POST /workouts` - Crear nueva rutina
- `GET /workouts` - Obtener todas las rutinas del usuario
- `GET /workouts?type=boxing` - Filtrar rutinas por tipo
- `GET /workouts/completed` - Obtener rutinas completadas
- `GET /workouts/:id` - Obtener una rutina específica
- `PUT /workouts/:id` - Actualizar una rutina
- `DELETE /workouts/:id` - Eliminar una rutina

## Autenticación

Todas las rutas requieren un token de Supabase en el header:
```
Authorization: Bearer <supabase_token>
```
