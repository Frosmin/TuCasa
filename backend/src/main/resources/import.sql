-- Servicios básicos
INSERT INTO servicios (nombre_servicio) VALUES ('Electricidad');
INSERT INTO servicios (nombre_servicio) VALUES ('Agua potable');
INSERT INTO servicios (nombre_servicio) VALUES ('Gas domiciliario');
INSERT INTO servicios (nombre_servicio) VALUES ('Internet');
INSERT INTO servicios (nombre_servicio) VALUES ('Recolección de basura');
INSERT INTO servicios (nombre_servicio) VALUES ('Seguridad 24h');

-- Inmueble
INSERT INTO inmuebles (direccion, superficie, id_propietario, tipo_inmueble, descripcion, activo, longitud, latitud) VALUES ('Av. Ejemplo 231', 120.50, 100, 'CASA', 'Casa con jardín y garage', true, 0.0, 0.0);

-- Relación inmueble - servicios
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (1, 1);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (1, 2);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (1, 4);

-- Casa
INSERT INTO casas (id, num_dormitorios, num_banos, num_pisos, garaje, patio, amoblado, sotano) VALUES (1, 3, 2, 2, true, true, false, false);

-- Oferta
INSERT INTO ofertas (id_inmueble, descripcion, tipo_operacion, precio, moneda, duracion_pago, tipo_pago, fecha_publicacion_inicio, fecha_publicacion_fin, estado_publicacion, activo) VALUES (1, 'Casa con jardín y garage - oferta ejemplo', 'VENTA', 95000.00, '$us', NULL, 'unico', NOW(), NULL, 'EN REVISION', true);

-- EJEMPLOS DE OFERTAS DIVERSAS

-- Casa en venta
INSERT INTO inmuebles (direccion, superficie, id_propietario, tipo_inmueble, descripcion, activo, longitud, latitud) VALUES ('Calle Los Álamos 123', 150.75, 101, 'CASA', 'Casa familiar de dos plantas con garaje y patio amplio', true, -68.130, -16.495);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (2, 1);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (2, 2);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (2, 3);
INSERT INTO casas (id, num_dormitorios, num_banos, num_pisos, garaje, patio, amoblado, sotano) VALUES (2, 4, 3, 2, true, true, false, false);
INSERT INTO ofertas (id_inmueble, descripcion, tipo_operacion, precio, moneda, duracion_pago, tipo_pago, fecha_publicacion_inicio, fecha_publicacion_fin, estado_publicacion, activo) VALUES (2, 'Casa en venta con jardín y garaje', 'VENTA', 120000.00, '$us', NULL, 'unico', NOW(), NULL, 'PUBLICADO', true);

-- Casa en alquiler
INSERT INTO inmuebles (direccion, superficie, id_propietario, tipo_inmueble, descripcion, activo, longitud, latitud) VALUES ('Av. Sucre 540', 110.00, 102, 'CASA', 'Casa moderna de un piso con jardín y garaje', true, -68.128, -16.499);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (3, 1);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (3, 2);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (3, 4);
INSERT INTO casas (id, num_dormitorios, num_banos, num_pisos, garaje, patio, amoblado, sotano) VALUES (3, 3, 2, 1, true, true, true, false);
INSERT INTO ofertas (id_inmueble, descripcion, tipo_operacion, precio, moneda, duracion_pago, tipo_pago, fecha_publicacion_inicio, fecha_publicacion_fin, estado_publicacion, activo) VALUES (3, 'Casa moderna en alquiler con jardín y garaje', 'ALQUILER', 750.00, '$us', 30, 'mensual', NOW(), NULL, 'PUBLICADO', true);

-- Casa en anticrético
INSERT INTO inmuebles (direccion, superficie, id_propietario, tipo_inmueble, descripcion, activo, longitud, latitud) VALUES ('Av. Villazón 980', 130.25, 103, 'CASA', 'Casa céntrica con patio y dos baños', true, -68.140, -16.497);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (4, 1);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (4, 2);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (4, 5);
INSERT INTO casas (id, num_dormitorios, num_banos, num_pisos, garaje, patio, amoblado, sotano) VALUES (4, 3, 2, 2, false, true, false, false);
INSERT INTO ofertas (id_inmueble, descripcion, tipo_operacion, precio, moneda, duracion_pago, tipo_pago, fecha_publicacion_inicio, fecha_publicacion_fin, estado_publicacion, activo) VALUES (4, 'Casa céntrica en anticrético con patio amplio', 'ANTICRETICO', 18000.00, '$us', NULL, 'unico', NOW(), NULL, 'PUBLICADO', true);

-- Tienda en venta
INSERT INTO inmuebles (direccion, superficie, id_propietario, tipo_inmueble, descripcion, activo, longitud, latitud) VALUES ('Av. Arce 210', 80.00, 104, 'TIENDA', 'Local comercial en esquina con alto tráfico peatonal', true, -68.125, -16.503);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (5, 1);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (5, 2);
INSERT INTO tiendas (id, num_ambientes, bano_privado, deposito) VALUES (5, 2, true, true);
INSERT INTO ofertas (id_inmueble, descripcion, tipo_operacion, precio, moneda, duracion_pago, tipo_pago, fecha_publicacion_inicio, fecha_publicacion_fin, estado_publicacion, activo) VALUES (5, 'Tienda comercial en venta sobre avenida principal', 'VENTA', 95000.00, '$us', NULL, 'unico', NOW(), NULL, 'PUBLICADO', true);

-- Tienda en alquiler
INSERT INTO inmuebles (direccion, superficie, id_propietario, tipo_inmueble, descripcion, activo, longitud, latitud) VALUES ('Calle Comercio 45', 65.00, 105, 'TIENDA', 'Tienda pequeña ideal para oficina o minimarket', true, -68.133, -16.500);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (6, 1);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (6, 4);
INSERT INTO tiendas (id, num_ambientes, bano_privado, deposito) VALUES (6, 3, true, false);
INSERT INTO ofertas (id_inmueble, descripcion, tipo_operacion, precio, moneda, duracion_pago, tipo_pago, fecha_publicacion_inicio, fecha_publicacion_fin, estado_publicacion, activo) VALUES (6, 'Tienda en alquiler ideal para oficina céntrica', 'ALQUILER', 650.00, '$us', 30, 'mensual', NOW(), NULL, 'PUBLICADO', true);

-- Tienda en anticrético
INSERT INTO inmuebles (direccion, superficie, id_propietario, tipo_inmueble, descripcion, activo, longitud, latitud) VALUES ('Av. Busch 899', 70.00, 106, 'TIENDA', 'Local con depósito interno y baño privado', true, -68.120, -16.508);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (7, 1);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (7, 3);
INSERT INTO tiendas (id, num_ambientes, bano_privado, deposito) VALUES (7, 2, true, true);
INSERT INTO ofertas (id_inmueble, descripcion, tipo_operacion, precio, moneda, duracion_pago, tipo_pago, fecha_publicacion_inicio, fecha_publicacion_fin, estado_publicacion, activo) VALUES (7, 'Local comercial en anticrético con depósito interno', 'ANTICRETICO', 15000.00, '$us', NULL, 'unico', NOW(), NULL, 'PUBLICADO', true);
