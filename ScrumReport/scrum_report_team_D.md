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
# 🧾 Scrum Report #2 — Oct 10

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
# 🧾 Scrum Report #3 — Oct 14

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
# 🧾 Scrum Report #4 — Oct 17

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
- **Y: se finalizo los endpoints de leer y eliminar lotes 
- **T:** se corrigió los archivos de lotes de los endpoints  de leer y eliminar
- **B:**  no se tuvo problemas hasta el momento

---
# 🧾 Scrum Report #5 — Oct 21

## Johan
- Y:
- T:
- B:

---

## Luis
- **Y:** implemente y corregi los endpoints para obtener una oferta en especifica mediante "idOferta"
- **T:**iniciare el flujo de navegacion(redirigir y cargar datos de la oferta en el formulario de registro) para actualizar datos de una oferta.
- **B:** tuve problemas al hacer conexion con supabase(BD), pero logre solucionarlo

---

## Javier
- **Y: 
- **T:** 
- **B:**  

---
# 🧾 Scrum Report #6 — Oct 24

## Johan
- Y:
- T:
- B:

---

## Luis
- **Y:** Recupere los datos de una oferta en especifica mediante "idOferta" desde el backend y en el frontend cargue los datos recuperados al formulario de registro de oferta.
- **T:** Hare la conexion con el backend y trabajare en la actualizacion de datos de inmueble para editar una oferta e inmueble.
- **B:** No tuve ningun problema

---

## Javier
- **Y: 
- **T:** 
- **B:**  

---
# 🧾 Scrum Report #7 — Oct 28

## Johan
- Y:
- T:
- B:
---

## Luis
- **Y:** complete en el backend en el servicio de oferta, para actualizar los datos de un inmueble segun su tipo(Casa, departamento, tienda y lote) y en el frontend complete la funcion de editar los datos de oferta e inmueble.
- **T:** haré la integracion con la pantalla de ver "detalles de inmueble" agregando un boton "editar oferta" para redirigir a la pantalla de edicion y completare la navegacion entre ambas pantallas.
- **B:** No tuve ningun problema 

---

## Javier
- **Y: 
- **T:** 
- **B:**  

---
# 🧾 Scrum Report #8 — Oct 31

## Johan
- Y:
- T:
- B:
---

## Luis
- **Y:** corregi los errores para editar las imagenes  y complete toda la funcionalidad para actualizar los datos de un inmueble. Tambien hice la integracion de con las otras funcionalidades de mi equipo.
- **T:** Revisare la integracion y corregire los errores en caso de que exista con la integracion de los demas equipos.
- **B:** No tuve ningun problema 

---

## Javier
- **Y: 
- **T:** 
- **B:**  
---
# 🧾 Scrum Report #9 — Nov 04

## Johan
- Y:
- T:
- B:
---

## Luis
- **Y:** Revise las historias que se asignaron a mi equipo y tambien inicie el diseño del panel de administracion.
- **T:** Corregire y completare las funcionalidades segun las observaciones del demo anterior.
- **B:** No tuve ningun problema 

---

## Javier
- **Y: 
- **T:** 
- **B:**  

---
# 🧾 Scrum Report #10 — Nov 07

## Johan
- Y:
- T:
- B:
---

## Luis
- **Y:** Inicie en el frontend con el diseño de la tabla de aprovacion de solitudes para ser agente, para el panel de administracion.
- **T:** cree un panel de navegacion para gestionar las solicitudes de agentes y las publicaciones de inmuebles.
- **B:** No tuve ningun problema 

---

## Javier
- **Y: 
- **T:** 
- **B:**
  ---
# 🧾 Scrum Report #11 — Nov 11

## Johan
- Y:
- T:
- B:
---

## Luis
- **Y:** Trabaje en el flujo de inicio de Sesión como administrador.
- **T:** Implementare el Login como administrador, creando por defecto dentro la bd un usuario con rol de "ADMIN" y trabajare en las funcionalidades "aprobar o rechazar", las solicitudes de los clientes para ser agente.
- **B:** No tuve ningun problema 

---

## Javier
- **Y: 
- **T:** 
- **B:**
  ---
# 🧾 Scrum Report #12 — Nov 14

## Johan
- Y:
- T:
- B:
---

## Luis
- **Y:** Termine la pantalla de la gestion de agentes( "aprobar o rechar la solicitud y ver los detalles de la solicitud") por el administrador.
- **T:** Corregire en backend para cargar su cv("archivo pdf") de las solicitudes de "quiero ser agente" y en el fronted implementare la vista del archivo pdf para mostrar su CV del solicitante.
- **B:** No tuve ningun problema 

---

## Javier
- **Y: 
- **T:** 
- **B:**
  ---
# 🧾 Scrum Report #13 — Nov 18

## Johan
- Y:
- T:
- B:
---

## Luis
- **Y:** Hice la integracion de las funcionalidades de administrador para aprobar o rechazar solicitudes de agentes y publicaciones.
- **T:** Revisare y corregire en caso de que existan errores durante la integracion.
- **B:** Tuve problemas al integrar, debido a la modificacion de las entidades por los otros equipos, las funcionlidades de administracion tenian fallas.

---

## Javier
- **Y: 
- **T:** 
- **B:**  
---
# 🧾 Scrum Report #14 — Nov 21

## Johan
- Y:
- T:
- B:
---

## Luis
- **Y:** Revise e inicie el flujo de  la funcionalidad para la vista de agentes por el cliente (HU 423).
- **T:** Implentare en el frontend la vista de los agentes por un cliente para que puedan contactarse con los agentes.
- **B:**  No tuve ningun problema.
---

## Javier
- **Y: 
- **T:** 
- **B:**  
