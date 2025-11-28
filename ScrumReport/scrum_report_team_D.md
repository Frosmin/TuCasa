# 🧾 **Scrum Reports — Consolidado (Oct 8 → Nov 21)**

---

## **Scrum Report #1 — Oct 8**

### Johan

* **Y:** Finalicé el flujo principal de las vistas “Oferta de Lote” y “Anticrético”. Ajusté estados en Jira.
* **T:** Inicializar el proyecto frontend con Next.js + TypeScript, creando rutas y layout base.
* **B:** Ninguno. Posible conflicto con dependencias de Next si surge.

### Luis

* **Y:** Completé historias para registro y edición de ofertas; estructura para aprobación de publicaciones.
* **T:** Iniciar diseño de la vista de aprobación.
* **B:** Ninguno.

### Javier

* **Y:** Finalicé flujo para vista de registro de publicación.
* **T:** Iniciar diseño de la vista.
* **B:** Ninguno.

---

## **Scrum Report #2 — Oct 10**

### Johan

* **Y:** Definí entidades del sistema. Configuré herencia JPA y conexión con Supabase.
* **T:** Pruebas de persistencia; crear controladores de prueba para Inmueble y Lote.
* **B:** Error de mapeo con DiscriminatorColumn y EnumType.STRING.

### Luis

* **Y:** Avancé en vista de aprobación de ofertas.
* **T:** Conexión backend con base local.
* **B:** Ninguno.

### Javier

* **Y:** —
* **T:** —
* **B:** —

---

## **Scrum Report #3 — Oct 14**

### Johan

* **Y:** Corregí mapeos; creé DTOs; implementé servicios y controladores base; añadí validaciones.
* **T:** Probar endpoints con Insomnia; verificar persistencia real en Supabase.
* **B:** Error de constraint por null en *tamanio* de Lote, ya solucionado.

### Luis

* **Y:** Endpoint para crear lote.
* **T:** CRUD completo para lote.
* **B:** Ninguno.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #4 — Oct 17**

### Johan

* **Y:** Configuración estable de Supabase; validación con pgAdmin; endpoints de prueba; documentación; inicio de esquema de Publicaciones.
* **T:** Integrar módulos y generar informe técnico.
* **B:** Persistencia intermitente con CascadeType.ALL y serialización anidada.

### Luis

* **Y:** Conexión frontend–backend para registrar lote; formulario ampliado.
* **T:** Correcciones para filtros de búsqueda.
* **B:** Ninguno.

### Javier

* **Y:** Finalizó y corrigió endpoints de leer/eliminar lotes.
* **T:** —
* **B:** Ninguno.

---

## **Scrum Report #5 — Oct 21**

### Johan

* **Y:** Revisé módulo de Publicaciones y ajusté relaciones con Usuario e Inmueble. Actualicé DTOs.
* **T:** Implementar endpoints base de Publicaciones y verificar persistencia.
* **B:** Desfase entre migraciones locales y Supabase.

### Luis

* **Y:** Endpoints para obtener oferta por id.
* **T:** Flujo de navegación para editar oferta.
* **B:** Problemas temporales con Supabase, solucionados.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #6 — Oct 24**

### Johan

* **Y:** Implementé controlador y servicio inicial de Publicación. Probé relaciones en Insomnia.
* **T:** Integrar carga de imágenes y probar flujo de creación completo.
* **B:** Referencias circulares al serializar entidades.

### Luis

* **Y:** Carga de datos por idOferta al formulario.
* **T:** Conexión para actualización de inmueble.
* **B:** Ninguno.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #7 — Oct 28**

### Johan

* **Y:** Organicé el módulo de Publicaciones; ajusté DTOs y entidades.
* **T:** Probar flujos completos antes de integrar con frontend.
* **B:** Inconsistencias en mapeo de herencia según tipo de inmueble.

### Luis

* **Y:** Actualización completa de inmueble según tipo; función de edición en frontend.
* **T:** Integrar botón “editar oferta” en detalle de inmueble.
* **B:** Ninguno.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #8 — Oct 31**

### Johan

* **Y:** Pruebas de validación en Supabase; optimización de consultas.
* **T:** Documentación de endpoints para revisión de sprint.
* **B:** Errores intermitentes de CORS en carga de imágenes.

### Luis

* **Y:** Correcciones en edición de imágenes y flujo completo de actualización.
* **T:** Revisar integración con equipo.
* **B:** Ninguno.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #9 — Nov 04**

### Johan

* **Y:** Revisé historias del backend; ajustes en validadores y DTOs.
* **T:** Afinar controladores finales de Publicación e Inmueble.
* **B:** Ninguno.

### Luis

* **Y:** Revisión de historias; inicié diseño del panel admin.
* **T:** Corregir funcionalidades según observaciones del demo.
* **B:** Ninguno.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #10 — Nov 07**

### Johan

* **Y:** Documenté endpoints y verifiqué relaciones entre entidades.
* **T:** Preparar pruebas automáticas de servicios.
* **B:** Falta unificar estándar de respuestas entre equipos.

### Luis

* **Y:** Diseño de tabla de aprobación de solicitudes.
* **T:** Panel de navegación para solicitudes de agentes y publicaciones.
* **B:** Ninguno.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #11 — Nov 11**

### Johan

* **Y:** Ajusté controladores de Usuario y Publicación para alinearlos con roles.
* **T:** Probar flujo completo de roles (USER, AGENTE, ADMIN).
* **B:** Asignación inconsistente de roles predeterminados.

### Luis

* **Y:** Flujo de inicio de sesión admin.
* **T:** Implementar login admin y funcionalidad para aprobar/rechazar solicitudes.
* **B:** Ninguno.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #12 — Nov 14**

### Johan

* **Y:** Integré soporte para archivos PDF usando Supabase Storage.
* **T:** Documentar manejo de Storage y verificar visualización desde frontend.
* **B:** Problemas con archivos grandes; revisar límites.

### Luis

* **Y:** Terminada la gestión de agentes (aprobar/rechazar y detalles).
* **T:** Cargar y visualizar CV en PDF.
* **B:** Ninguno.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #13 — Nov 18**

### Johan

* **Y:** Revisé integraciones e hice ajustes por cambios en entidades de otros equipos.
* **T:** Pruebas integradas del módulo de administración.
* **B:** Incompatibilidades por modificaciones externas.

### Luis

* **Y:** Integración de funcionalidades admin para agentes y publicaciones.
* **T:** Corregir errores durante integración.
* **B:** Fallas por cambios en entidades de otros equipos.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #14 — Nov 21**

### Johan

* **Y:** Pruebas funcionales del módulo de agentes y flujos cliente.
* **T:** Ajustes finales para cierre del sprint.
* **B:** Ninguno.

### Luis

* **Y:** Inicio del flujo para vista de agentes (HU 423).
* **T:** Implementar vista de agentes para interacción con clientes.
* **B:** Ninguno.

### Javier

* **Y / T / B:** —

