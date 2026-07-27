# 📘 Documentación de Endpoints — Vecinos

> ⚠️ **Nota:** este documento fue generado a partir de `vecino.controller.ts`. Los paths (`/api/vecinos...`) se infieren por convención REST y no del archivo de rutas (`vecino.routes.ts`), que no fue provisto. Verificá los paths reales contra tu router antes de publicar esta documentación.

Base URL: `/api/vecinos`

---

### `POST /vecinos`

**Descripción:** Registra un nuevo vecino en el padrón.

**Auth requerida:** Sí *(el controlador espera `req.user`; actualmente tiene un fallback hardcodeado `{ id: 1, rol: 'administrador' }` si no hay usuario en el request — ver ⚠️ en Notas técnicas al final)*

**Body (JSON):**
```json
{
  "usuarioId": 1,
  "nombre": "Juan",
  "primerApellido": "Pérez",
  "segundoApellido": "Gómez",
  "numeroCarnet": "12345678",
  "direccion": "Av. Siempre Viva 123",
  "manzano": "12",
  "numeroFolio": "045",
  "tipoResidencia": "dueno"
}
```

**Respuesta exitosa:**
```json
// 201 Created
{
  "status": "success",
  "message": "Vecino registrado exitosamente 🏠",
  "data": {
    "id": 10,
    "usuarioId": 1,
    "nombre": "Juan",
    "primerApellido": "Pérez",
    "segundoApellido": "Gómez",
    "numeroCarnet": "12345678",
    "direccion": "Av. Siempre Viva 123",
    "manzano": "12",
    "numeroFolio": "045",
    "tipoResidencia": "dueno"
  }
}
```

**Errores:**
| Código | Motivo |
|---|---|
| `401` | No autorizado. Falta información de sesión (`usuarioLogueado` ausente). |
| `400` | Error de validación o de negocio al registrar el vecino (mensaje dinámico según `error.message`). |

---

### `GET /vecinos`

**Descripción:** Obtiene el listado completo de vecinos registrados en el padrón.

**Auth requerida:** No *(el controlador `listar` no valida sesión; si debe estar protegido, la validación tendría que aplicarse vía middleware en las rutas)*

**Body (JSON):** No aplica.

**Respuesta exitosa:**
```json
// 200 OK
{
  "status": "success",
  "data": [
    {
      "id": 10,
      "usuarioId": 1,
      "nombre": "Juan",
      "primerApellido": "Pérez",
      "segundoApellido": "Gómez",
      "numeroCarnet": "12345678",
      "direccion": "Av. Siempre Viva 123",
      "manzano": "12",
      "numeroFolio": "045",
      "tipoResidencia": "dueno"
    }
  ]
}
```

**Errores:**
| Código | Motivo |
|---|---|
| `500` | Error interno al obtener el listado de vecinos. |

---

### `GET /vecinos/:id`

**Descripción:** Obtiene el detalle de un vecino específico por su ID.

**Auth requerida:** No *(no se valida sesión en el controlador `obtenerPorId`)*

**Body (JSON):** No aplica.

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `number` | ID del vecino a consultar |

**Respuesta exitosa:**
```json
// 200 OK
{
  "status": "success",
  "data": {
    "id": 10,
    "usuarioId": 1,
    "nombre": "Juan",
    "primerApellido": "Pérez",
    "segundoApellido": "Gómez",
    "numeroCarnet": "12345678",
    "direccion": "Av. Siempre Viva 123",
    "manzano": "12",
    "numeroFolio": "045",
    "tipoResidencia": "dueno"
  }
}
```

**Errores:**
| Código | Motivo |
|---|---|
| `404` | Vecino no encontrado (mensaje dinámico según `error.message`). |

---

### `PUT /vecinos/:id`

**Descripción:** Actualiza los datos de un vecino existente.

**Auth requerida:** No *(no se valida sesión en el controlador `actualizar`)*

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `number` | ID del vecino a actualizar |

**Body (JSON):**
```json
{
  "direccion": "Av. Siempre Viva 456",
  "manzano": "13",
  "tipoResidencia": "inquilino"
}
```
> El body se pasa directo al servicio (`req.body`), por lo que acepta actualización parcial de cualquiera de los campos del vecino.

**Respuesta exitosa:**
```json
// 200 OK
{
  "status": "success",
  "message": "Vecino actualizado exitosamente 📝",
  "data": {
    "id": 10,
    "direccion": "Av. Siempre Viva 456",
    "manzano": "13",
    "tipoResidencia": "inquilino"
  }
}
```

**Errores:**
| Código | Motivo |
|---|---|
| `400` | Error de validación o de negocio al actualizar (mensaje dinámico según `error.message`). |

---

### `DELETE /vecinos/:id`

**Descripción:** Elimina (da de baja) un vecino del padrón.

**Auth requerida:** No *(no se valida sesión en el controlador `eliminar`)*

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `number` | ID del vecino a eliminar |

**Body (JSON):** No aplica.

**Respuesta exitosa:**
```json
// 200 OK
{
  "status": "success",
  "message": "Vecino eliminado exitosamente 🗑️"
}
```

**Errores:**
| Código | Motivo |
|---|---|
| `404` | Error al eliminar el vecino / vecino no encontrado (mensaje dinámico según `error.message`). |

---

### `POST /vecinos/importar-masivo`

**Descripción:** Importa múltiples vecinos en un solo request (por ejemplo, desde un archivo Excel procesado previamente en el cliente). Reutiliza internamente la misma lógica de creación que `POST /vecinos`, garantizando que cada registro pase por las mismas validaciones.

**Auth requerida:** Sí *(mismo patrón que `crear`: usa `req.user` con fallback hardcodeado si no está presente — ver ⚠️ en Notas técnicas)*

**Body (JSON):**
```json
{
  "vecinos": [
    {
      "usuarioId": 1,
      "nombre": "Juan",
      "primerApellido": "Pérez",
      "segundoApellido": "Gómez",
      "numeroCarnet": "12345678",
      "direccion": "Av. Siempre Viva 123",
      "manzano": "12",
      "numeroFolio": "045",
      "tipoResidencia": "dueno"
    },
    {
      "usuarioId": 1,
      "nombre": "María",
      "primerApellido": "López",
      "numeroCarnet": "87654321",
      "direccion": "Calle Falsa 456",
      "manzano": "08",
      "numeroFolio": "012",
      "tipoResidencia": "inquilino"
    }
  ]
}
```
> `segundoApellido` es opcional (se guarda como `null` si no se envía). Si `usuarioId` no se envía por registro, se usa el `id` del usuario logueado. Si `tipoResidencia` no se envía, por defecto se usa `"dueno"`.

**Respuesta exitosa:**
```json
// 201 Created
{
  "status": "success",
  "message": "Se importaron 2 vecinos exitosamente 📊",
  "data": [
    { "id": 11, "nombre": "Juan", "...": "..." },
    { "id": 12, "nombre": "María", "...": "..." }
  ]
}
```

**Errores:**
| Código | Motivo |
|---|---|
| `401` | No autorizado. Falta información de sesión (`usuarioLogueado` ausente). |
| `400` | `vecinos` no es un array o está vacío (no se enviaron registros válidos). |
| `400` | Error de validación o de negocio durante el procesamiento de algún registro (mensaje dinámico según `error.message`). |

> ⚠️ **Nota de diseño:** la importación actual procesa los registros en un `for` secuencial. Si un registro falla a mitad del lote, los anteriores ya quedaron guardados en base de datos (no hay transacción ni rollback). Si se requiere atomicidad ("todo o nada"), conviene envolver el loop en una transacción de Prisma (`prisma.$transaction`).

---

## 🔧 Notas técnicas generales

- **Auth con fallback riesgoso:** en `crear` e `importarMasivo`, la línea `const usuarioLogueado = (req as any).user || { id: 1, rol: 'administrador' };` hace que, si no llega un usuario autenticado en el request, el controlador **igual continúe** simulando un administrador con `id: 1`. Esto probablemente sea código temporal de desarrollo/testing — antes de producción conviene eliminar el fallback y devolver `401` directamente cuando `req.user` no exista.
- **Auth inconsistente entre endpoints:** `listar`, `obtenerPorId`, `actualizar` y `eliminar` no verifican sesión en el controlador. Si el padrón debe ser privado, la protección debería aplicarse de forma uniforme vía middleware (`authMiddleware`) en el archivo de rutas, no dentro de cada controlador.
- **Enum `TipoResidencia`:** los valores exactos (`dueno`, `inquilino`, etc.) dependen del enum definido en `schema.prisma`. Actualizá los ejemplos de este documento si el enum tiene otros valores.
- **Manejo de errores:** todos los catch devuelven `error.message` directamente al cliente. Si `vecinoService` puede lanzar errores internos (de Prisma, por ejemplo), conviene sanitizar el mensaje antes de exponerlo en la respuesta.
