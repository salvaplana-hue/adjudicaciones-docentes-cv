# Adjudicaciones Continuas CV - Calculador de Puestos y Rutas

Aplicación web para docentes interinos de la Comunidad Valenciana (Conselleria d'Educació - GVA).

## Características principales

- **4 Pestañas personalizables**: Selecciona cualquier especialidad presente en la convocatoria oficial (Matemáticas, Ámbito Científico, etc.) y visualiza los puestos de todas juntas en la tabla combinada.
- **Diferenciación de sustituciones**: Clasificación visual en Vacante, Sustitución determinada y Sustitución indeterminada.
- **Cálculo de distancias y tiempos reales**: Distancias exactas por carretera (km con 1 decimal) y tiempo de viaje estimado vía OpenStreetMap / OSRM desde tu municipio de origen.
- **Ordenación estricta por cercanía**: La tabla se muestra ordenada siempre por menor distancia en km puerta a puerta.
- **Actualización directa**: Descarga y procesa automáticamente el listado provisional de la web de Conselleria o permite arrastrar cualquier archivo PDF.
- **Exportación**: Enlace directo a Google Maps por centro y exportación a CSV.

## Despliegue en Vercel

Este proyecto está preparado para ejecutarse como aplicación web estática con Serverless Functions (`/api/actualizar` y `/api/route`) en Vercel.
