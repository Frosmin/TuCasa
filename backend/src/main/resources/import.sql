-- Servicios básicos
INSERT INTO servicios (nombre_servicio) VALUES ('Electricidad');
INSERT INTO servicios (nombre_servicio) VALUES ('Agua potable');
INSERT INTO servicios (nombre_servicio) VALUES ('Gas domiciliario');
INSERT INTO servicios (nombre_servicio) VALUES ('Internet');
INSERT INTO servicios (nombre_servicio) VALUES ('Recolección de basura');
INSERT INTO servicios (nombre_servicio) VALUES ('Seguridad 24h');

-- Inmueble
INSERT INTO inmuebles (direccion, superficie, id_propietario, tipo_inmueble, descripcion, activo) VALUES ('Av. Ejemplo 231', 120.50, 100, 'CASA', 'Casa con jardín y garage', true);

-- Relación inmueble - servicios
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (1, 1);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (1, 2);
INSERT INTO inmueble_servicio (inmueble_id, servicio_id) VALUES (1, 4);

-- Casa
INSERT INTO casas (id, num_dormitorios, num_banos, num_pisos, garaje, patio, amoblado, sotano) VALUES (1, 3, 2, 2, true, true, false, false);

-- Oferta
INSERT INTO ofertas (id_inmueble, descripcion, tipo_operacion, precio, moneda, duracion_pago, tipo_pago, fecha_publicacion_inicio, fecha_publicacion_fin, estado_publicacion, activo) VALUES (1, 'Casa con jardín y garage - oferta ejemplo', 'VENTA', 95000.00, '$us', NULL, 'unico', NOW(), NULL, 'EN REVISION', true);