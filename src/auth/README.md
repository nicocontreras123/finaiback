# ⚠️ DEPRECATED - Supabase Auth

Este directorio contiene la implementación antigua de autenticación con **Supabase**, que ya **NO SE USA**.

## Archivos deprecados:
- `auth.service.ts.deprecated` - Servicio que usaba Supabase
- `auth.module.ts.deprecated` - Módulo de autenticación con Supabase
- `guards/auth.guard.ts.deprecated` - Guard que verificaba tokens con Supabase
- `decorators/current-user.decorator.ts.deprecated` - Decorador del guard de Supabase

## ✅ Implementación actual

La autenticación ahora usa **JWT + MongoDB** y está en:

```
src/modules/auth/
├── auth.service.ts          # Servicio con JWT + MongoDB
├── auth.module.ts           # Módulo de autenticación
└── guards/
    └── auth.guard.ts        # Guard que verifica JWT

src/shared/
├── guards/
│   └── auth.guard.ts        # Guard compartido (usa modules/auth)
└── decorators/
    └── current-user.decorator.ts  # Decorador compartido
```

## ⚠️ NO USAR estos archivos

Los archivos con extensión `.deprecated` están aquí solo como referencia histórica.
**NO los importes ni los uses en código nuevo.**

Si necesitas autenticación, usa:
```typescript
import { AuthGuard } from '../shared/guards/auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
```
