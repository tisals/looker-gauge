# DIRECTIVA: GAUGE_RISK_VISUALIZATION
> **Responsable:** `Aljandro Leguizamo`
> **Archivo Asociado:** `brp-gauge.js`
> **Estado:** Activo  
> **Última Mejora:** 2026-02-09  
> **Versión:** 1.0.0

---

## 1. ¿Para qué sirve esto? (Misión)

Crear una visualización comunitaria de Looker Studio tipo *Gauge* (medidor de aguja) con hasta 6 niveles de riesgo totalmente parametrizables (etiqueta, color, límite). Es el componente vital para la interpretación visual de una métrica numérica de riesgo psicosocial o de desempeño, mostrando el puntaje actual con una aguja dentro de la escala configurada.

---

## 2. Responsabilidad Única (SOLID)

La visualización **SOLO** debe encargarse del proceso de *renderizado* (manipulación del DOM/SVG) del *Gauge* a partir del objeto de datos (`data`) proporcionado por la API de Looker Studio. No gestiona la obtención de datos, la configuración del conector ni la lógica de negocio que define el puntaje.

---

## 3. Entradas y Salidas (I/O)

### Qué recibe (Inputs):
- **Objeto `data` (desde `dscc.subscribeToData`):** Contiene el estado actual de datos y estilos.
    - **`data.tables.DEFAULT.rows`:** El valor numérico del **Puntaje Actual** (Métrica), que posiciona la aguja.
    - **`data.style`:** Objeto con la configuración dinámica definida por el usuario en el panel de propiedades:
        - `riskLevel1Limit`...`riskLevel6Limit`: Límite máximo de cada nivel.
        - `riskLevel1Color`...`riskLevel6Color`: Color de cada arco de nivel.
        - `needleColor`: Color de la aguja.
- **Configuración de la Visualización (`index.json`):** Define los controles de datos (1 Métrica, 1 Dimensión opcional) y los controles de estilo (hasta 6 niveles de color, límites, etiquetas).

### Qué entrega (Outputs):
- **Retorno de función:** N/A (Función `drawViz` manipula el DOM).
- **Cambios en el DOM:** Un elemento `div#container` conteniendo el *Gauge* (renderizado con SVG/D3.js), mostrando los arcos de niveles y la aguja rotada.
- **Logs:** Mensajes de depuración si la métrica no es un número o si la configuración de estilo es inválida.

---

## 4. El Paso a Paso (Lógica) - `drawViz(data)`

1. **Setup del Contenedor:** Limpiar o crear el elemento contenedor (`div#container`) en el `document.body`.
2. **Validación de Datos:** Verificar que la métrica (`data.tables.DEFAULT.rows[0]`) exista y sea un valor numérico.
3. **Extracción y Consolidación de Estilos:** Leer los 18-24 parámetros de estilo (`riskLevelXLimit`, `riskLevelXColor`, `riskLevelXLabel`) y consolidarlos en un array de niveles de riesgo.
4. **Cálculo de Escala Global:** Determinar el valor máximo absoluto del *Gauge* a partir del límite máximo del Nivel 6.
5. **Cálculo de Ángulo de Aguja:** Mapear el **Puntaje Actual** (Métrica) al rango angular del *Gauge* (ej. 0° a 180° o 30° a 330°), utilizando la escala global.
6. **Renderizado de Arcos (Niveles):**
    - Usar D3.js para dibujar los segmentos de arco (paths SVG) de cada nivel, aplicando el color y el rango configurado.
7. **Renderizado de Aguja:**
    - Dibujar el elemento `svg` de la aguja y aplicar una transformación `rotate()` basada en el ángulo calculado en el paso 5.
8. **Renderizado de Etiquetas:** Mostrar el valor numérico de la métrica y, opcionalmente, las etiquetas de los niveles si el estilo lo permite.

---

## 5. Reglas de Oro (Restricciones y Seguridad)

### SIEMPRE:
- ✅ Usar el formato de tabla (`dscc.tableTransform`) en la suscripción de datos.
- ✅ Asegurar que `viz-codelab.js` sea la concatenación de `dscc.min.js` y `d3.min.js` con el código fuente del *Gauge* (`index.js`).
- ✅ Validar y sanear la entrada de estilos (`data.style`) para evitar inyección de código.
- ✅ Los recursos deben cargarse desde un bucket de Cloud Storage accesible públicamente (ver [`src/help.md`](src/help.md:179)).

### NUNCA:
- ❌ Cargar bibliotecas o scripts de forma dinámica en la función `drawViz`. Deben estar incluidas en el paquete `viz-codelab.js`.
- ❌ Confiar ciegamente en los valores de estilo; implementar *fallbacks* (valores por defecto) si un parámetro dinámico es nulo o inválido.
- ❌ Utilizar CSS externo si no está referenciado en [`manifest.json`](GC/manifest.json) / [`manifest.json`](Github/manifest.json).

---

## 6. Dependencias (Qué necesita para funcionar)

- **`dscc.min.js`:** Biblioteca principal para la integración con Looker Studio.
- **`d3.min.js`:** Esencial para las operaciones de visualización de datos complejas (SVG, arcos, escalas).
- **Hosting de Recursos:** Google Cloud Storage para `manifest.json`, `index.json`, `viz-codelab.js`.

---

## 7. Casos Borde y "Trampas" Conocidas

### Limitaciones Conocidas:
- **Número de Niveles:** La visualización soporta un máximo estricto de 6 niveles configurables.
- **Puntaje Fuera de Rango:** Si el puntaje actual excede el límite máximo del Nivel 6, la aguja debe apuntar al final de la escala (máximo ángulo de rotación), pero el valor debe seguir mostrándose correctamente.
- **Configuración Inválida:** Si el usuario configura límites de nivel en orden no ascendente (ej. Nivel 2 < Nivel 1), la visualización debe corregir o mostrar un error visible.

### Errores Comunes y Soluciones:
| Error | Por qué pasa | Cómo evitarlo |
| :--- | :--- | :--- |
| El *Gauge* no se renderiza | Falla al concatenar `dscc.min.js` y `d3.min.js` en `viz-codelab.js` | Ejecutar y verificar el script de concatenación (ver [`src/help.md`](src/help.md:48)) |
| Aguja mal posicionada | Error en el cálculo de mapeo (escala) de datos a ángulo | Implementar pruebas unitarias para la función de mapeo trigonométrico/escala D3 |
| Estilos no se aplican | Error al leer las claves de estilo en `data.style` o discrepancia entre [`index.json`](GC/index.json) y `viz-codelab.js` | Confirmar que los IDs en el archivo JSON (`id` de los elementos de estilo) coincidan exactamente con las claves usadas en `drawViz` (ej. `data.style.headerBg.value.color` en [`src/help.md`](src/help.md:343)) |

---

## 9. Flujo de Integración (Cómo se conecta con el resto)

El flujo se centra en la función `drawViz` que se dispara cada vez que cambian los datos o el estilo.

```mermaid
graph TD
    A[Looker Studio: Panel de Propiedades] -- Cambios de estilo --> E
    B[Fuente de Datos Looker] -- Datos de Métrica y Dimensión --> D
    C[Recursos en GCS: manifest.json, index.json, viz-codelab.js] --> D(DSCC Framework)
    D --> E[Llamada a dscc.subscribeToData]
    E -- Objeto 'data' (Datos y Estilos) --> F[Función drawViz(data) en viz-codelab.js];
    F --> G{Lógica de Renderizado D3.js};
    G -- Dibuja Arcos y Aguja --> H[Gauge Renderizado en SVG/DOM];
```

---

## 10. Checklist de Pre-Implementación
- [x] ¿He leído esta directiva completa?
- [x] ¿Entiendo la responsabilidad única de esta visualización?
- [x] ¿Sé cuáles son los inputs (Puntaje Actual, 6 Límites, 6 Colores) y outputs (DOM/SVG)?
- [x] ¿Conozco los casos borde (Puntaje fuera de límite, límites no ascendentes)?
- [x] ¿Tengo claro qué bibliotecas necesito (`dscc`, `D3.js`)?

---

## 11. Checklist de Post-Implementación
- [ ] El código sigue la responsabilidad única (Solo renderiza).
- [x] Todos los inputs (especialmente los límites de estilo) están validados.
- [ ] Los logs muestran el flujo correcto (cálculo de ángulo).
- [ ] ¿Hay nuevas restricciones o aprendizajes?
- [ ] ¿Actualicé la sección "Bitácora de Aprendizaje"?
- [ ] ¿El archivo [`index.json`](GC/index.json) soporta correctamente la configuración de los 6 niveles (18-24 parámetros de estilo)?

---

## 12. Notas Adicionales

La decisión clave de arquitectura es la dependencia de D3.js para manejar las escalas y la geometría compleja de los arcos y la aguja. Esto simplifica el cálculo trigonométrico en JavaScript puro. Es fundamental que la lógica de mapeo de `valor_numerico -> angulo` sea robusta para cualquier rango de datos definido por el usuario.

---

**Última Actualización:** 2026-02-09  
**Responsable:** Roo  
**Estado:** Activo