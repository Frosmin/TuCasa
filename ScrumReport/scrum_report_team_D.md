# 🧾 **Scrum Reports — Consolidado (Oct 8 → Nov 21)**

---

## **Scrum Report #1 — Oct 8**

### Johan

* **Y:** Finalicé el flujo principal de las vistas “Oferta de Lote” y “Anticrético”. Ajusté estados en Jira.
* **T:** Inicializar el proyecto frontend con Next.js + TypeScript, creando rutas y layout base.
* **B:** Ninguno. Posible conflicto con dependencias de Next si surge.

### Luis

* **Y:**Trabaje en completar las historias para el registro e edicion de ofertas y la estructura para aprobacion de publicaciones.
* **T:** Iniciare con el diseño de la tabla para la vista de aprobacion de publicaciones.
* **B:** No he tenido ningun problema hasta el momento.

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

* **Y:** Inicie en Frontend con la creacion de la tabla para la aprobacion de ofertas por parte del administrador.
* **T:** Creare y hare la conexión a mi base de datos local e implementare la entidad "Lote", para la publicacion de oferta de un Lote.
* **B:** No he tenido ningun problema hasta el momento.

### Javier

* **Y:** — se acabo el flujo para la parte de backend del endpoint de registro
* **T:** — Inicio la vista y el endpoint
* **B:** —Ninguno
* 

---

## **Scrum Report #3 — Oct 14**

### Johan

* **Y:** Corregí mapeos; creé DTOs; implementé servicios y controladores base; añadí validaciones.
* **T:** Probar endpoints con Insomnia; verificar persistencia real en Supabase.
* **B:** Error de constraint por null en *tamanio* de Lote, ya solucionado.

### Luis

* **Y:** Cree los mapeos dtos "Request" y "Response" para la entidad Lote.
* **T:** Creare los Servicios para Registrar, Actualizar y Obtener un inmueble de tipo Lote, ademas creare sus respectivos Enpoints implementado los controladores.
* **B:** Ninguno.

### Javier


* **Y:** Corregí mapeos; creé DTOs; implementé servicios y controladores base; añadí validaciones.
* **T:** Probar endpoints con Insomnia; verificar persistencia real en Supabase.
* **B:** Error de constraint por null en *tamanio* de Lote, ya solucionado.

---

## **Scrum Report #4 — Oct 17**

### Johan

* **Y:** Configuración estable de Supabase; validación con pgAdmin; endpoints de prueba; documentación; inicio de esquema de Publicaciones.
* **T:** Integrar módulos y generar informe técnico.
* **B:** Persistencia intermitente con CascadeType.ALL y serialización anidada.

### Luis

* **Y:** Trabaje en Frontend completando los campos de Lote en el "FormData" y complete los servicios para registrar una publicacion de inmueble de tipo Lote, ademas hice las correcciones en filtros de busqueda.
* **T:** Hare la conexion entre  el fronted y backend(aplicando el fetch) para registrar ofertas de Lote y complementare en el formulario de publicacion de oferta los campos para registrar un Lote.
* **B:** No he tenido ningun problema hasta el momento.

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

* **Y:** Implemente el endpoint en backend, para obtener una oferta en especifica mediante el "idOferta" y complete el servicio de actualizar oferta, para un tipo de inmueble en especifico.
* **T:** Hare el flujo de navegacion y redireccion al formulario de registro de ofertas, ademas cargare los datos de una oferta en el formulario para la edicion de una oferta en especifica.
* **B:** Problemas temporales con Supabase, solucionados.

### Javier

* **Y / T / B:** —

---

## **Scrum Report #6 — Oct 24**

### Johan
544
* **Y:** Implementé controlador y servicio inicial de Publicación. Probé relaciones en Insomnia.
* **T:** Integrar carga de imágenes y probar flujo de creación completo.
* **B:** Referencias circulares al serializar entidades.

### Luis

* **Y:** Cree los mapeos en fronted para recuperar una oferta y cargar en formulario de registro de ofertas(para reutilizar el formulario de registro para editar una oferta) y complemente los servicios para editar una oferta.
* **T:** Hare la conexion del frontend con el backend(aplicando los fectchs), para modificar los datos de una oferta en especifica.
* **B:** No tuve ningun problema hasta el momento.

### Javier


* **Y:** Corregí mapeos; creé DTOs; implementé servicios y controladores base; añadí validaciones.
* **T:** Probar endpoints con Insomnia; verificar persistencia real en Supabase.
* **B:** Error de constraint por null en *tamanio* de Lote, ya solucionado.

---

## **Scrum Report #7 — Oct 28**

### Johan

* **Y:** Organicé el módulo de Publicaciones; ajusté DTOs y entidades.
* **T:** Probar flujos completos antes de integrar con frontend.
* **B:** Inconsistencias en mapeo de herencia según tipo de inmueble.

### Luis

* **Y:**Agregue un boton y hice la redireccion de la pantalla de "Detalles de oferta" a la pantalla "Editar oferta", para poder editar los datos de dicha oferta.
* **T:** Hare la integracion con los demas modulos y corregire los enrrores o bugs en caso de que haya.
* **B:** Ninguno.

### Javier


---

## **Scrum Report #8 — Oct 31**

### Johan

* **Y:** Pruebas de validación en Supabase; optimización de consultas.
* **T:** Documentación de endpoints para revisión de sprint.
* **B:** Errores intermitentes de CORS en carga de imágenes.

### Luis

* **Y:** Hice la integracion  con el modulo de "Actualizar imagenes" del team C y complete y modifique los Servicios para actualizar las imagenes de una oferta integrando con Cloudinary.
* **T:** Hare la integracion y corregire los errores o funcionalidades en caso de que sean incosistentes o tengan fallas.
* **B:** No tuve ningun problema.

### Javier

* **Y:** Revisión de historias; inicié diseño del panel admin.
* **T:** Corregir funcionalidades según observaciones del demo.
* **B:** Ninguno.

---

## **Scrum Report #9 — Nov 04**

### Johan

* **Y:** Revisé historias del backend; ajustes en validadores y DTOs.
* **T:** Afinar controladores finales de Publicación e Inmueble.
* **B:** Ninguno.

### Luis

* **Y:** Revise y complete las tareas para el inicio de sesion como administrador y inicie con la implementacion de la tabla de aprobacion de agentes.
* **T:** Corregire y complentare las funcionalidades segun las observaciones del demo anterior.
* **B:** No tuve ningun problema.

### Javier

* **Y:** Se agrego la funcionalidad de los servicios en lotes
* **T:** Se acabo la intregracion en la parte frontend
* **B:** Ninguno.

---

## **Scrum Report #10 — Nov 07**

### Johan

* **Y:** Documenté endpoints y verifiqué relaciones entre entidades.
* **T:** Preparar pruebas automáticas de servicios.
* **B:** Falta unificar estándar de respuestas entre equipos.

### Luis

* **Y:** Trabaje en frontend con la implementacion de la tabla de gestion de solicitudes y agentes para la aprobacion o rechazo de una solicitud, "ser agente".
* **T:** Creare un panel de navegacion en el dashboard, para la gestion de agentes y gestion de ofertas(aprobacion de publicaciones de una oferta).
* **B:** No tuve ningun problema.

### Javier

* **Y:** Documentacion de la historia asignada
* **T:** Se arreglo errores de tipeo de la anterior historia
* **B:** Ninguno


---

## **Scrum Report #11 — Nov 11**

### Johan

* **Y:** Ajusté controladores de Usuario y Publicación para alinearlos con roles.
* **T:** Probar flujo completo de roles (USER, AGENTE, ADMIN).
* **B:** Asignación inconsistente de roles predeterminados.

### Luis

* **Y:** Trabaje en backend con el flujo de inicio de sesion como administrador y corregi los servios de aprobacion de solicitudes "ser agente".
* **T:** Implementare el Login como administrador, creando por defecto dentro la bd un usuario con rol de "ADMIN" y trabajare en frontend en los servicios para "aprobar o rechazar", las solicitudes de los clientes para ser agente.
* **B:** No tuve ningun problema.

### Javier


* **Y:** Se empezo el diseño de la parte frontend
* **T:** se empezo la esctructura y la logica para la historia
* **B:** Ninguno

---

## **Scrum Report #12 — Nov 14**

### Johan

* **Y:** Integré soporte para archivos PDF usando Supabase Storage.
* **T:** Documentar manejo de Storage y verificar visualización desde frontend.
* **B:** Problemas con archivos grandes; revisar límites.

### Luis

* **Y:** Cree un modal en frontend para mostrar los detalles de la solicitud, y agregue las opciones para aprobar o rechazar una solicitud de "ser agente".
* **T:** Corregire en backend, el servicio de registrar una solicitud, para que el cliente pueda cargar su cv en un archivo pdf y en frontend agregare la funcionalidad para mostrar su cv.
* **B:** No he tenido ningun problema.

### Javier


* **Y:** Corregí el diseño inicial del frontend para las publicaciones y la aprobacion
* **T:** Se empezo el diseño y prueba de los endpoints para las publicaciones
* **B:** Ninguno

---

## **Scrum Report #13 — Nov 18**

### Johan

* **Y:** Revisé integraciones e hice ajustes por cambios en entidades de otros equipos.
* **T:** Pruebas integradas del módulo de administración.
* **B:** Incompatibilidades por modificaciones externas.

### Luis

* **Y:** Hice la integracion con el modulo de "envio de solicitudes para ser agente" con el panel de administracion de "gestion de agentes" y complete el flujo de solicitud, aprobacion o rechazo, de "ser agente".
* **T:** Hare la integracion con los demas equipos y corregire los errores que vayan ocurriendo.
* **B:** Tuve problemas al integrar, debido a la modificacion de las entidades por los otros equipos, las funcionalidades de administracion tenian fallas. Cree los dtos respectivos para las solicitudes "ser agente" y modifique los servicios de enviar, aprobar o rechazar una solicitud "ser agente" en backend, para solucionar los problemas.

### Javier


* **Y:** Se corrigio variables en los endpoints del patch y se integro al backend el patch
* **T:** Se termino los endpoints y el diseño del frontend
* **B:** Ninguno

---

## **Scrum Report #14 — Nov 21**

### Johan

* **Y:** Pruebas funcionales del módulo de agentes y flujos cliente.
* **T:** Ajustes finales para cierre del sprint.
* **B:** Ninguno.

### Luis

* **Y:** Revise e inicie el flujo de  la funcionalidad para la vista de agentes por el cliente (HU 423)..
* **T:** Implentare en el frontend la vista de los agentes por un cliente creando una tabla para mostrar los diferentes agentes que hay registrados en el sistema.
* **B:** No tuve problemas.

### Javier


* **Y:** Se arreglo el estilo de tablas en el frontend 
* **T:** Implento la conexion al frontend los endpoints de ver publicaciones y editar estado de una
* **B:** Ninguno
  
---

## **Scrum Report #15 — Nov 25**

### Johan

* **Y:** 
* **T:** 
* **B:** 

### Luis

* **Y:** Cree en frontend la vista de perfil de un agente para mostrar los detalles de sus datos personales mas su descripcion, experiencia y su cv, para que el cliente pueda contactarse en caso de requerir sus servicios.
* **T:** Modificare y corregire en backend la endidad "Agente", para registrar los datos de un agente e implentare los dtos respectivos mas los servicios para crear, eliminar y obtener a un agente.
* **B:** No tuve problemas.

### Javier


* **Y:** 
* **T:** 
* **B:**

---

## **Scrum Report #16 — Nov 28**

### Johan

* **Y:** 
* **T:** 
* **B:** 

### Luis

* **Y:** Hice la conexion del frontend con el backend para obtener agentes y modifique los servicios para aprobar o rechazar un agente por el administrador en backend, corregiendo los errores que estaban ocurriendo al aprovar o rechazar una solicitud "ser agente".
* **T:**  Revisare los errores que hayan durante la integracion y corregire los bugs que surgen para hacer el build para el deployment.
* **B:** No tuve problemas hasta el momento.

### Javier


* **Y:** 
* **T:** 
* **B:** 
