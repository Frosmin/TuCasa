# 🧾 Scrum Report #1 — Oct 8

## Johan
- **Y (Yesterday):** Finalicé el flujo principal de las historias para las vistas de “Oferta de Lote” y “Anticrético”. Ajusté los estados en el tablero de Jira.  
- **T (Today):** Inicializaré el proyecto base del frontend con Next.js + TypeScript, configurando rutas y estructura de carpetas. Planeo dejar integrado el layout general.  
- **B (Blockers):** Ninguno por ahora. En caso de que surja un conflicto con dependencias de Next, revisaré la compatibilidad con Node 18.

---

## Luis
- **Y:** Trabaje en completar las historias para el registro e edicion de ofertas y la estructura para aprobacion de publicaciones.
- **T:** inicie el diseño para la vista de aprobacion de publicaciones.
- **B:** No he tenido ningun problema hasta el momento.

---

## Javier
- **Y:** Finalicé el flujo principal de las historias para la vista de registro de publicacion.
- **T:** inicie el diseño para la vista de registro de publicacion.
- **B:** No he tenido ningun problema hasta el momento.

---
# 🧾 Scrum Report #1 — Oct 10

## Johan
- Y (Yesterday):
Definí las entidades principales del sistema: Inmueble, Lote, Casa, Departamento, Publicación y Usuario.
Configuré la estructura de herencia en JPA utilizando @Inheritance(strategy = InheritanceType.JOINED) y @DiscriminatorColumn.
Establecí la conexión inicial con Supabase (PostgreSQL), configurando el application.properties con variables base (spring.datasource.url, user, password).
- T (Today):
Iniciar pruebas de persistencia en Supabase y verificar la estructura de tablas generada.
Crear controladores de prueba para Inmueble y Lote.
- B (Blockers):
Error de mapeo ambiguo entre clases hijas y el DiscriminatorColumn.
Problemas menores al mapear EnumType.STRING en la entidad TipoInmueble.

---

## Luis
- **Y:** inicie con la vista de aprobacion de ofertas por parte del administrador
- **T:** hice la conexion del backend con mi base de datos local
- **B:** No he tenido problemas hasta el momento

---

## Javier
- **Y:** 
- **T:** 
- **B:** 

---
# 🧾 Scrum Report #1 — Oct 14

## Johan
- Y:
Corregí los errores de mapeo y ajusté DTOs para Inmueble y Lote (LoteRequestDto, InmuebleRequestDto).
Implementé los servicios y controladores base (InmuebleService, LoteService) con respuestas ResponseEntity estandarizadas.
Añadí validaciones (@NotNull, @NotBlank, @Valid) y separación de grupos de validación (Create, Update).
- T:
Probar los endpoints con Insomnia y documentar los flujos funcionales.
Revisar que las entidades persistidas se reflejen correctamente en Supabase.
- B:
Error de constraint por null en el campo tamanio de Lote, solucionado agregando @Column(nullable = false) y ajuste en el DTO.

---

## Luis
- **Y:** cree el endpoint para crear un inmueble de tipo lote
- **T:** complete la creacion de endpoints para crear, actualizar y obtener lote por id
- **B:** No he tenido problemas hasta el momento

---

## Javier
- **Y:** 
- **T:** 
- **B:** 

---
# 🧾 Scrum Report #1 — Oct 17

## Johan
- Y:
Finalicé la configuración estable de Supabase:
Se ajustó la conexión JDBC con el formato correcto postgresql://usuario:contraseña@host:5432/postgres.
Se verificó el acceso con pgAdmin y conexión directa desde Spring Boot.
Se probó la autenticación y persistencia de datos en Supabase.
Monté y validé los endpoints de prueba para crear y listar Lotes e Inmuebles.
Generé ejemplos curl y documentación de endpoints para el equipo frontend.
Inicié la definición del esquema de Publicaciones de terrenos, vinculando con Usuario e Inmueble.
- T:
Integrar todos los módulos (Inmueble, Lote, Publicación, Usuario) y generar el informe técnico para revisión del sprint.
- B:
Persistencia intermitente en relaciones con CascadeType.ALL y problemas menores al serializar entidades anidadas.

---

## Luis
- **Y:** hice la conexion del frontend con el backend para registrar un lote y agregue los campos de detalles de lote en el formulario de registro
- **T:** hice las correcciones en el frontend para los filtros de busqueda de un lote
- **B:** No tuve ningun problema hasta el momento.

---

## Javier
- **Y:** 
- **T:** 
- **B:** 

---
