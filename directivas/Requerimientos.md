# Requerimientos para Visualización Comunitaria Gauge Psicosocial en Looker Studio

## Objetivo

Crear una visualización de gauge con hasta 6 niveles de riesgo parametrizables para medir factores de riesgo psicosocial, estrés y burnout.

## Requerimientos Funcionales

- Permitir configurar hasta 6 niveles con valores máximos ajustables.
- Definir etiquetas personalizadas para cada nivel.
- Definir colores personalizados para cada nivel, siguiendo escala de verde a rojo.
- Mostrar una aguja que indique el puntaje actual dentro de la escala.
- Permitir mostrar u ocultar etiquetas de niveles.
- Integrar con Looker Studio para recibir datos dinámicos.

## Requerimientos Técnicos

- Archivos necesarios:
  - `manifest.json`: metadatos y ubicación de recursos.
  - `index.json`: configuración de datos y estilos para el panel de propiedades.
  - `viz-codelab.js`: código empaquetado con dscc, D3.js y lógica.
- Empaquetar `dscc.min.js`, `d3.min.js` e `index.js` en `viz-codelab.js`.
- Subir los archivos a un hosting público compatible (Google Cloud Storage recomendado).
- Configurar permisos públicos para acceso desde Looker Studio.
- Usar codificación UTF-8 en todos los archivos.

## Datos de Entrada

- Dimensión: categoría o descripción (ej. Vicepresidencia).
- Métrica: puntaje numérico.

## Configuración Dinámica

- Niveles de riesgo (hasta 6) con valores máximos.
- Etiquetas para cada nivel.
- Colores para cada nivel.
- Color de la aguja.
- Mostrar u ocultar etiquetas.

## Recomendaciones

- Usar datos de muestra sin información sensible para demos.
- Documentar claramente dimensiones y métricas.
- Mantener actualizado el manifiesto con URL del demo.
- Probar en diferentes tamaños y dispositivos.
- Mantener código modular y comentado.

---

**Documento generado por Alejandro Leguízamo**