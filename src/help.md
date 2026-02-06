3. Descripción general de las visualizaciones de la comunidad
Las visualizaciones de la comunidad de Looker Studio te permiten crear y usar visualizaciones de JavaScript personalizadas en tus paneles.

En este codelab, crearás una visualización de la comunidad de gráficos de tabla que admite el estilo de 1 dimensión, 1 métrica y encabezado de tabla.

cde32c0546ea89af.gif

4. Flujo de trabajo del desarrollo de visualizaciones de la comunidad
Para crear una visualización de la comunidad, necesitas los siguientes archivos en un bucket de almacenamiento de Google Cloud Platform, que crearás en un paso posterior:

|Nombre del archivo | Tipo de archivo |Objetivo| 
|manifest.json* | JSON |Metadatos sobre la visualización y las ubicaciones de todos los recursos de visualización.|
|viz-codelab.json| JSON |opciones de configuración de datos y estilo para el panel Propiedad.|
|viz-codelab.js|JavaScript|El código JavaScript para renderizar la visualización.|
|viz-codelab.css (opcional)|CSS|Estilos de CSS para la visualización.|

*El manifiesto es el único archivo que tiene un nombre obligatorio. Los otros archivos pueden tener nombres diferentes, siempre que se especifique su nombre o ubicación en el archivo de manifiesto.

5. Escribe un mensaje de Hello World visualización
En esta sección, agregarás el código necesario para renderizar un mensaje simple de Hello World! visualización.

Escribe la fuente de JavaScript de la visualización
Paso 1: Descarga el archivo dscc.min.js de la página Biblioteca de componentes de la comunidad de Looker Studio (dscc) y cópialo en tu directorio de trabajo.

Paso 2: Copia el siguiente código en un editor de texto y guárdalo como viz-codelab-src.js en tu directorio de trabajo local.

viz-codelab-src.js

function drawViz(data) {

  // Container setup.
  let container = document.getElementById('container');
  if (container) {
    container.textContent = '';
  } else {
    container = document.createElement('div')
    container.id = 'container'
    document.body.appendChild(container);
  }

  // Render the viz.
  container.textContent = 'Hello, viz world!';

}

// Subscribe to data and style changes. Use the table format for data.
dscc.subscribeToData(drawViz, { transform: dscc.tableTransform });
Prepara el archivo de paquete de JavaScript
Paso 3: Combina todo el JavaScript necesario en un solo archivo. Para ello, copia el contenido de la biblioteca auxiliar de visualización (dscc.min.js) y tu archivo viz-codelab-src.js en un archivo nuevo llamado viz-codelab.js. Se pueden ejecutar los siguientes comandos para concatenar los archivos. Repite este paso cada vez que actualices el código de visualización fuente.

Secuencia de comandos de concatenación de Linux/Mac OS

cat dscc.min.js > viz-codelab.js
echo >> viz-codelab.js
cat viz-codelab-src.js >> viz-codelab.js
Secuencia de comandos de concatenación de Windows

del viz-codelab.js
type nul > viz-codelab.js
type dscc.min.js >> viz-codelab.js
echo.>> viz-codelab.js
type viz-codelab-src.js >> viz-codelab.js

6. Escribir el CSS de visualización
El archivo CSS define el estilo de tu visualización y es opcional. Copia el siguiente CSS y guárdalo como viz-codelab.css..

viz-codelab.css

table {
    width: 100%;
    border-collapse: collapse;
}

tr {
    border-bottom: 1pt solid #d1d1d1;
}

th, td {
    padding: 8px;
    text-align: left;
}

7. Escribe la configuración de JSON
La configuración de visualización define los atributos de datos y estilo que admite y requiere tu visualización. La visualización de este codelab requiere una dimensión y una métrica, y tiene un elemento de estilo para seleccionar un color de relleno. Obtén más información sobre las dimensiones y las métricas.

Copia el siguiente código y guárdalo como viz-codelab.json.. Para obtener más información sobre las propiedades que puedes configurar, revisa la Referencia de la configuración de visualización de la comunidad.

viz-codelab.json

{
    "data": [
        {
            "id": "concepts",
            "label": "Concepts",
            "elements": [
                {
                    "id": "tableDimension",
                    "label": "Dimension",
                    "type": "DIMENSION",
                    "options": {
                        "min": 1,
                        "max": 1
                    }
                },
                {
                    "id": "tableMetric",
                    "label": "Metric",
                    "type": "METRIC",
                    "options": {
                        "min": 1,
                        "max": 1
                    }
                }
            ]
        }
    ],
    "style": [
        {
            "id": "header",
            "label": "Table Header",
            "elements": [
                {
                    "type": "FILL_COLOR",
                    "id": "headerBg",
                    "label": "Header Background Color",
                    "defaultValue": "#e0e0e0"
                }
            ]
        }
    ]
}

8. Crea un proyecto y un bucket de Cloud Storage
Paso 1: Crea un proyecto de Google Cloud Platform (GCP) o usa uno existente.

Paso 2: crea un bucket de GCP. La clase de almacenamiento recomendada es Regional. Visita Precios de Cloud Storage para obtener detalles sobre los niveles gratuitos. Nota: Es poco probable que el almacenamiento de visualizaciones genere costos por la clase Regional Storage.

Paso 3: Anota el nombre o la ruta de tu bucket, que comienza con la sección después de Buckets/. La ruta se denomina "ID de componente". en Looker Studio y se usa para identificar e implementar una visualización.

49cd3d8692e6bf51.png

9. Escribe el archivo manifest.json
El archivo de manifiesto proporciona información sobre la ubicación y los recursos de tu visualización. Debe llamarse "manifest.json" y debe estar ubicada en el bucket o la ruta de acceso creados en el paso anterior, la misma ruta de acceso que se usó para tu ID de componente.

Copia el siguiente código en un editor de texto y guárdalo como manifest.json..

Importante: Asegúrate de reemplazar MY_GOOGLE_CLOUD_STORAGE_BUCKET por el bucket o la ruta de acceso correctos para cada recurso.

Para obtener más información sobre el manifiesto, visita la documentación de referencia del manifiesto.

manifest.json

{
    "name": "Community Visualization",
    "logoUrl": "https://raw.githubusercontent.com/googledatastudio/community-visualizations/master/docs/codelab/img/table-chart.png",
    "organization": "Looker Studio Codelab",
    "organizationUrl": "https://url",
    "termsOfServiceUrl": "https://url",
    "supportUrl": "https://url",
    "packageUrl": "https://url",
    "privacyPolicyUrl": "https://url",
    "description": "Community Visualization Codelab",
    "devMode": true,
    "components": [
        {
            "id": "tableChart",
            "name": "Table",
            "iconUrl": "https://raw.githubusercontent.com/googledatastudio/community-visualizations/master/docs/codelab/img/table-chart.png",
            "description": "A simple table chart.",
            "resource": {
                "js": "gs://MY_GOOGLE_CLOUD_STORAGE_BUCKET/viz-codelab.js",
                "config": "gs://MY_GOOGLE_CLOUD_STORAGE_BUCKET/viz-codelab.json",
                "css": "gs://MY_GOOGLE_CLOUD_STORAGE_BUCKET/viz-codelab.css"
            }
        }
    ]
}

10. Subir los archivos de visualización a Google Cloud Storage
Sube los archivos manifest.json, viz-codelab.js, viz-codelab.json y viz-codelab.css a tu bucket de Google Cloud Storage mediante la interfaz web o la herramienta de línea de comandos de gsutil. Repite esto cada vez que actualices tu visualización.
Importante: Asegúrate de que tus archivos sean públicos. Para obtener más información sobre cómo hacer que los objetos sean legibles de forma pública, consulta la documentación de Google Cloud.

84c15349e32d9fa6.png

Comandos de carga de gsutil

gsutil cp -a public-read manifest.json gs://MY_GOOGLE_CLOUD_STORAGE_BUCKET
gsutil cp -a public-read viz-codelab.* gs://MY_GOOGLE_CLOUD_STORAGE_BUCKET

11. Prueba la visualización de tu comunidad en Looker Studio
5ce4532d02aac5e8.gif

Crea un informe y agrega datos
Paso 1: Copia la URL del conjunto de datos de muestra de visualización de la comunidad. Como alternativa, usa cualquier fuente de datos que prefieras y omite los siguientes pasos.

Paso 2: Accede a Looker Studio. En la esquina superior izquierda, haz clic en + Crear y, luego, selecciona Informe.

Paso 3: Verás la herramienta de edición de informes con el panel Agregar datos al informe abierto.

Paso 4: En la pestaña Conectar a los datos, selecciona el conector de Hojas de cálculo de Google de Google.

Paso 5: Selecciona URL y pega la URL de la hoja de cálculo de Google del paso 1.

Paso 6: En la esquina inferior derecha, haz clic en Agregar.

Paso 7: Si se te solicita confirmar Estás a punto de agregar datos a este informe, haz clic en AGREGAR AL INFORME. Se creará un informe sin título y se agregará una tabla predeterminada al informe con datos de muestra. Si lo deseas, puedes seleccionar y borrar la tabla predeterminada para ver un informe en blanco.

Agrega la visualización de tu comunidad al informe
Paso 1: En la barra de herramientas, haz clic en Visualizaciones y componentes de la comunidad 1d6173ab730fc552.png .

Paso 2: Haz clic en + Explorar más para abrir la Galería de la comunidad.

Paso 3: Haz clic en Crear tu propia visualización

Paso 4: En Prueba y agrega tu visualización de la comunidad, ingresa la ruta del manifiesto y haz clic en Enviar. La ruta del manifiesto es el nombre del bucket de Google Cloud Storage y la ruta de acceso que apunta a la ubicación del manifiesto de tu visualización, con el prefijo gs://.. Por ejemplo: gs://community-viz-docs/viz-codelab. Si ingresaste una ruta de acceso del manifiesto válida, se debería renderizar una tarjeta de visualización.

Paso 5: Haz clic en la tarjeta de visualización para agregarla a tu informe.

Paso 6: Si se te solicita, otorga tu consentimiento para permitir que se renderice la visualización.

Paso 7: De manera opcional, actualiza la dimensión y la métrica seleccionadas para la tabla. Si usas el conjunto de datos de muestra proporcionado, establece la dimensión en País y la métrica en Población. Esto no tendrá ningún efecto en la visualización hasta más adelante en el codelab.

El panel de propiedades en el lado derecho refleja los elementos configurados en viz-codelab.json.

En el panel Configuración, la visualización permite una dimensión y una métrica.

6ebe61619e340878.png

En el panel Estilo (Style), la visualización incluye un solo elemento para definir el estilo del Encabezado de la tabla. En este punto, el control de estilo no tendrá ningún efecto en la visualización hasta que el código de la visualización se actualice en un paso posterior. Nota: Verás opciones de estilo adicionales para tu visualización que no definiste en el archivo de configuración. Esto es de esperarse, ya que todas las visualizaciones tienen un conjunto de controles comunes que están disponibles automáticamente.

2b78982c01d6359f.png

12. Renderiza los datos como una tabla
En esta sección, actualizarás tu visualización para mostrar el conjunto de datos de muestra de la Visualización de la comunidad en forma de tabla.

Los datos para renderizar están disponibles en el objeto tables y se estructuran según la transformación que especifique tu visualización. En este codelab, la visualización solicitó el formato de tabla (tableTransform), que incluye un objeto headers y un objeto rows que contiene todos los datos que necesitamos para renderizar una tabla.

Paso 1: Reemplaza el contenido de viz-codelab-src.js con el siguiente código.

viz-codelab-src.js

function drawViz(data) {

  // Container setup.
  let container = document.getElementById('container');
  if (container) {
    container.textContent = '';
  } else {
    container = document.createElement('div')
    container.id = 'container'
    document.body.appendChild(container);
  }

  // Create the table.
  const table = document.createElement('table');
  const tableHeader = document.createElement('thead');
  const tableBody = document.createElement('tbody');

  data.tables.DEFAULT.headers.forEach(function (column) {
    const tableColumn = document.createElement('th');
    tableColumn.textContent = column.name;
    tableHeader.appendChild(tableColumn);
  });

  data.tables.DEFAULT.rows.forEach(function(row) {
    const tableRow = document.createElement('tr');
    row.forEach(function(cell) {
      const tableCell = document.createElement('td');
      if (typeof cell == 'number') {
        tableCell.textContent = new Intl.NumberFormat().format(cell);
      } else {
        tableCell.textContent = cell;
      }
      tableRow.appendChild(tableCell);
    });
    tableBody.appendChild(tableRow);
  });
  table.appendChild(tableHeader);
  table.appendChild(tableBody);

  // Render the table.
  container.appendChild(table);

}

// Subscribe to data and style changes. Use the table format for data.
dscc.subscribeToData(drawViz, { transform: dscc.tableTransform });
Paso 2: Prepara el archivo de paquete de JavaScript y, luego, sube y reemplaza tus archivos de visualización en Google Cloud Storage.

Paso 3: Actualiza el informe de Looker Studio para volver a cargar y probar la visualización de tu comunidad. La tabla ahora renderiza datos (es decir, la hoja de cálculo de Google) y muestra columnas de encabezado según la dimensión y la métrica seleccionadas. Cambia el tamaño de la visualización para ver todas las filas.

66db5bde61501b01.png

13. Cómo aplicar cambios de diseño de forma dinámica
En esta sección, actualizarás la visualización para definir el estilo del encabezado de la tabla según el color de relleno seleccionado en el panel Estilo.

El estado de todos los elementos de diseño está disponible en el objeto style, en el que cada clave de elemento se define según la configuración de estilo de visualización (viz-codelab.json). En esta sección, obtendrás el color de relleno seleccionado y lo usarás para actualizar el color de fondo del encabezado de la tabla.

Paso 1: Reemplaza el código de tu archivo viz-codelab-src.js con el siguiente código.

viz-codelab-src.js

function drawViz(data) {

  // Container setup.
  let container = document.getElementById('container');
  if (container) {
    container.textContent = '';
  } else {
    container = document.createElement('div')
    container.id = 'container'
    document.body.appendChild(container);
  }

  // Create the table.
  const table = document.createElement('table');
  const tableHeader = document.createElement('thead');
  const tableBody = document.createElement('tbody');

  data.tables.DEFAULT.headers.forEach(function (column) {
    const tableColumn = document.createElement('th');
    tableColumn.textContent = column.name;
    tableHeader.appendChild(tableColumn);
  });

  data.tables.DEFAULT.rows.forEach(function(row) {
    const tableRow = document.createElement('tr');
    row.forEach(function(cell) {
      const tableCell = document.createElement('td');
      if (typeof cell == 'number') {
        tableCell.textContent = new Intl.NumberFormat().format(cell);
      } else {
        tableCell.textContent = cell;
      }
      tableRow.appendChild(tableCell);
    });
    tableBody.appendChild(tableRow);
  });
  table.appendChild(tableHeader);
  table.appendChild(tableBody);

  // Set header color based on style control.
  tableHeader.style.backgroundColor = data.style.headerBg.value.color;

  // Render the table.
  container.appendChild(table);

}

// Subscribe to data and style changes. Use the table format for data.
dscc.subscribeToData(drawViz, { transform: dscc.tableTransform });
Paso 2: Prepara el archivo de paquete de JavaScript y, luego, sube y reemplaza tus archivos de visualización en Google Cloud Storage.

Paso 3: Actualiza el informe de Looker Studio para volver a cargar y probar la visualización de tu comunidad.

Paso 4: En el panel Estilo, usa el control de estilo Color de fondo del encabezado para cambiar el color de fondo del encabezado de la tabla.

cde32c0546ea89af.gif

¡Felicitaciones! Creaste una visualización de la comunidad en Looker Studio. Llegaste al final de este codelab. Ahora, veamos los próximos pasos que puedes seguir.

# 14. Próximos pasos
## Amplía tu visualización
Obtén más información sobre los datos y formatos disponibles para tu visualización.
Obtén más información sobre los elementos de estilo disponibles y agrega un estilo adicional a tu visualización.
Agrega interacciones a tu visualización
Aprende a desarrollar una visualización a nivel local
## Haz más tareas con las visualizaciones de la comunidad
Revisa las referencias de la biblioteca auxiliar de dscc, el manifiesto y el archivo de configuración.
Envía tu visualización a nuestra Galería de visualización de la comunidad.
Crea un conector de la comunidad para Looker Studio.
## Recursos adicionales
A continuación, se muestran varios recursos a los que puedes acceder para ayudarte a profundizar en el material que vimos en este codelab.

|Tipo de recurso |Funciones del usuario|Funciones para desarrolladores|
|Documentación|Centro de ayuda[https://support.google.com/looker-studio?hl=es-419]|Documentación para desarrolladores|
|Noticias y Actualizaciones|Regístrate en Looker Studio > Configuración del usuario|Lista de distribución de desarrolladores|
|Haz preguntas|Foro de usuarios|Stack Overflow [looker-studio]|
|Foro de desarrolladores de Looker Studio|Ejemplos|Galería de informes

Repositorio de código abierto