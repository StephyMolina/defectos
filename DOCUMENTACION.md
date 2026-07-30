# Documentación - Tablero Gerencial de Defectos

## 📋 Resumen del Proyecto

Servidor HTTP local que lee un archivo Excel y muestra un tablero gerencial interactivo con:
- **Filtros dinámicos** por hoja, búsqueda, año, país, estado, tipo, sprint, responsable, prioridad
- **KPIs** (indicadores clave): registros, defectos abiertos/cerrados, países, responsables, sprints, prioridad
- **Gráficos**: barras por estado/país, pasteles comparativos de prioridad DB por sprint
- **Tabla de detalle** con columnas filtradas
- **Exportación** a Excel y PDF

---

## 🏗️ Arquitectura General

```
app.py (monolítico)
├── Backend Python (HTTP server)
│   ├── Carga Excel (openpyxl)
│   ├── APIs REST (/api/data, /api/meta, /api/reload)
│   ├── Exportación (Excel, PDF)
│   └── Filtrado y agregaciones
│
└── Frontend HTML/CSS/JS (embebido)
    ├── Interfaz interactiva
    ├── Combo box multi-select (Sprint despliegue)
    ├── Modal de pasteles gerenciales
    └── Impresión a PDF
```

---

## 🐍 Backend (Python)

### Constantes Globales

```python
EXCEL_PATH = Path(r"C:\laragon\MOLINA\BUGS Reportados SIR 2024.xlsx")
HOST = "127.0.0.1"
PORT = 8000
CANDIDATE_FILTERS = [lista de columnas que se usan como filtros]
CLOSED_STATUS_VALUES = {set de valores que significan "cerrado"}
WORKBOOK_DATA = {}  # Cache de datos en memoria
```

### Flujo de Datos

1. **`refresh_workbook_data()`** — Carga el Excel completo en memoria
   - Lee todas las hojas
   - Parsea encabezados y filas
   - Convierte fechas/números
   - Almacena en `WORKBOOK_DATA`

2. **`get_sheet_data(sheet_name)`** — Recupera una hoja del cache

3. **`apply_filters(rows, query)`** — Filtra registros
   - Búsqueda de texto libre (busca en todos los campos)
   - Filtros por campo específico (país, estado, sprint, etc.)
   - Soporte multi-valor (ej: 2+ sprints)

4. **`build_context(query)`** — Construye la respuesta de datos
   - Aplica filtros
   - Calcula breakdowns (desglose por estado, país, prioridad, etc.)
   - Genera metadata y KPIs

### Funciones Clave

#### `countPieData(rows, column, limit=5)` → `list[dict]`
Cuenta frecuencias de un campo y retorna top-N + "Otros", ordenado descendente.
```python
[
  {"label": "Produccion", "count": 172, "share": 85.5, "color": "#e4002b"},
  {"label": "QA", "count": 10, "share": 5.0, "color": "#111111"},
  ...
]
```

#### `build_breakdown(rows, column_name)` → `list[dict]`
Desglose por frecuencia de un campo (para gráficos de barras).

#### `build_available_filters(columns, rows)` → `list[dict]`
Extrae valores únicos de columnas candidatas para renderizar dropdowns de filtros.

#### `build_meta(sheet, rows, columns)` → `dict`
Construye metadata: KPIs, columnas, sheets, filtros disponibles.

#### `status_summary(rows, columns)` → `(total, open, closed, status_column)`
Cuenta defectos abiertos/cerrados según el campo Status/Estado.

### APIs REST

#### `GET /` 
Retorna la página HTML (con JS embebido).

#### `GET /api/meta?sheet=SIR`
Retorna metadata de la hoja (sheets, default_sheet, columnas, KPIs, filtros).
```json
{
  "sheet": "SIR",
  "sheets": ["SIR", "MXP", "Ecommerce", "S.I", "ERP"],
  "kpis": [...],
  "columns": ["#", "anio", "prioridad", ...],
  "availableFilters": [{"name": "PAIS", "values": ["MEXICO", "USA", ...]}, ...]
}
```

#### `GET /api/data?sheet=SIR&PAIS=MEXICO&Sprint%20despliegue=1&Sprint%20despliegue=10`
Retorna datos filtrados + desglose (status, país, sprint, prioridad, responsable).
```json
{
  "sheet": "SIR",
  "rows": [registro1, registro2, ...],
  "columns": ["#", "anio", ...],
  "meta": {...},
  "status_breakdown": [{"label": "Produccion", "count": 50, ...}, ...],
  "country_breakdown": [...],
  ...
}
```

#### `GET /api/reload`
Recarga el Excel desde disco (sin reiniciar servidor).

#### `GET /export/excel?sheet=SIR&...`
Exporta datos filtrados a `.xlsx` con:
- Hoja "Resumen" (KPIs y desglose)
- Hoja "Datos" (registros filtrados)

#### `GET /export/pdf?sheet=SIR&...`
Exporta tablero a PDF (texto plano + tablas).

### Conversión de Valores

```python
def convert_value(value):
    # Fechas → "YYYY-MM-DD HH:MM"
    # Floats → int si es entero, si no redondea a 6 decimales
    # El resto → sin cambios
```

---

## 🎨 Frontend (HTML/CSS/JS)

### Estructura del HTML

```html
<body>
  <div class="layout">
    <aside class="options">       <!-- Panel lateral: botones de acción -->
    <main>
      <section class="hero">     <!-- Título y resumen -->
      <section class="kpis">     <!-- Grid de KPIs -->
      <section>
        <div class="filters">    <!-- Filtros dinámicos -->
      </section>
      <section class="charts">
        <article>
          <div class="statusChart"> <!-- Barras de estado -->
          <div class="countryChart"> <!-- Barras de país -->
      <section>
        <div class="tableWrap">  <!-- Tabla de detalle -->
      <section>
        <div class="footer-actions"> <!-- Botón "Limpiar filtros" -->
    </main>
  </div>

  <div class="modal-overlay">
    <div class="modal-dialog">    <!-- Modal de pasteles -->
      <div class="pie-grid">
        <!-- Pastel de Estado -->
        <!-- Pastel de País -->
        <!-- Pastel de Despliegue por Sprint -->
        <!-- Pastel de Prioridad DB -->
        <!-- Pastel de Responsable -->
      <div class="insight-compare">
        <div class="pie-grid" id="prioBySprintGrid">
          <!-- Pasteles dinámicos: Prioridad DB por cada Sprint marcado -->
```

### Estado Global (JS)

```javascript
const state = {
  meta: null,              // Metadata (sheets, columnas, KPIs, filtros)
  currentSheet: null,      // Hoja seleccionada
  rows: [],                // Registros filtrados
  columns: [],             // Columnas de la hoja actual
  activeFilters: {},       // Filtros activos {campo: valor}
  latestPayload: null,     // Última respuesta de /api/data
};
```

### Funciones Principales (JS)

#### `loadData(resetMeta=true)`
Flujo principal: carga metadata → carga datos → renderiza todo.

#### `renderFilters(meta)`
Renderiza los campos de filtro:
- Selector de hoja (dropdown)
- Búsqueda (input)
- Combo box multi-select para Sprint despliegue
- Dropdowns normales para otros filtros

#### `renderTable(columns, rows)`
Renderiza la tabla HTML, ocultando columnas en la lista:
```python
hidden = [
  'version', 'fecha reporte', 'fecha despliegue',
  '#', 'despliegue tentativo', 'caso aranda', 'reduccion', 'tipo', 'observacion'
]
```

#### `renderKpis(meta)`
Renderiza grid de KPIs (7 tarjetas con valores).

#### `renderBars(target, items)`
Renderiza gráficos de barras (para estado y país).

#### `renderInsightModal(payload)`
Renderiza todos los pasteles:
- Llama `renderPieCard()` para los 5 pasteles estáticos
- Llama `renderPrioBySprint()` para los pasteles dinámicos por sprint

#### `renderPrioBySprint(payload, sprintColumn, priorityColumn)`
Genera un pastel por cada sprint marcado en el combo, mostrando prioridad DB.

#### `countPieData(rows, columnName, limit=5)` → `items`
Cuenta frecuencias, ordena descendente, retorna top-N + "Otros" con colores.

#### `buildPieGradient(items)` → `conic-gradient()`
Construye CSS `conic-gradient` para renderizar el pastel.

#### `buildPieCardHtml(title, subtitle, items, emptyLabel)` → `html`
Retorna HTML de una tarjeta de pastel (para los pasteles dinámicos por sprint).

### Combo Box Multi-Select (Sprint despliegue)

Reemplaza el `<select multiple>` con un dropdown visual con checkboxes.

```html
<div class="combo" data-combo="Sprint despliegue">
  <button class="combo-toggle">
    <span data-combo-summary>2 sprint(s) marcado(s)</span>
    <span class="chev">▼</span>
  </button>
  <div class="combo-panel">
    <label class="combo-option">
      <input type="checkbox" value="1" />
      <span>1</span>
    </label>
    ...
  </div>
</div>
```

**Listeners:**
- Click en toggle → abre/cierra panel
- Click en checkbox → actualiza estado y texto de resumen
- Click fuera → cierra panel y carga datos

### Pasteles (Pie Charts)

Cada pastel es un `<div>` circular con `conic-gradient` CSS:
```html
<div class="pie-figure" style="background: conic-gradient(#e4002b 0deg 100deg, #111111 100deg 150deg, ...)">
  <div class="pie-center">
    <strong>85.5%</strong>
    <span>Produccion lidera</span>
  </div>
</div>
<div class="pie-legend">
  <div class="legend-item">
    <span class="legend-swatch" style="background:#e4002b;"></span>
    <span>Produccion</span>
    <span class="legend-meta">172 · 85.5%</span>
  </div>
  ...
</div>
```

### Exportación a PDF

Usa `window.print()` con `@media print` en CSS:
- Oculta todo excepto el modal
- Preserva colores (print-color-adjust)
- Evita saltos de página dentro de pasteles

---

## 📊 Flujo de Interacción

1. **Usuario carga la página** → `loadData(true)` → Carga hoja default "SIR"
2. **Usuario cambia hoja** → Evento `sheetSelect.change` → `loadData()` con nueva hoja
3. **Usuario marca filtro** → Evento `filter.change` → `loadData(false)` (no recarga metadata)
4. **Usuario abre "Ver pasteles"** → `openInsights()` → `renderInsightModal()` → Abre modal
5. **Usuario marca sprints en combo** → Checkboxes se actualizan → Se recalcula `renderPrioBySprint()` en el modal
6. **Usuario presiona "Guardar PDF"** → `window.print()` → Diálogo del navegador
7. **Usuario presiona "Limpiar filtros"** → Reset a hoja default + filtros vacíos → `loadData(true)`

---

## 📁 Estructura de Archivos

```
c:\laragon\www\tablero defectos\
├── app.py                    # Código fuente (Python + HTML/CSS/JS embebido)
├── requirements.txt          # Dependencias (openpyxl>=3.1)
├── README.md                 # Instrucciones de ejecución
└── DOCUMENTACION.md          # Este archivo
```

---

## 🔧 Configuración

### Variables Editables

| Variable | Ubicación | Propósito |
|----------|-----------|----------|
| `EXCEL_PATH` | app.py:14 | Ruta del archivo Excel a leer |
| `HOST` | app.py:15 | IP del servidor (127.0.0.1 = localhost) |
| `PORT` | app.py:16 | Puerto HTTP (8000) |
| `CANDIDATE_FILTERS` | app.py:18-29 | Columnas que aparecen como filtros |
| `CLOSED_STATUS_VALUES` | app.py:31-40 | Valores que significan "cerrado" |

### Dependencias

- **openpyxl** ≥3.1 — Lectura de archivos Excel

---

## 🎯 Casos de Uso Principales

### Caso 1: Visualizar defectos de un sprint
1. Abre http://127.0.0.1:8000
2. En filtros, marca "Sprint despliegue" = 1
3. La tabla, gráficos y KPIs se actualizan
4. Los pasteles en el modal también se filtran

### Caso 2: Comparar prioridad DB entre sprints
1. Abre "Ver pasteles"
2. Marca 2+ sprints en el combo box (ejemplo: 1 y 10)
3. Desplázate a "Prioridad DB por sprint seleccionado"
4. Ve un pastel por sprint, lado a lado

### Caso 3: Exportar reporte a PDF
1. Filtra los datos que quieres
2. Abre "Ver pasteles"
3. Presiona "Guardar PDF"
4. Elige "Guardar como PDF" en el diálogo

### Caso 4: Recargar datos del Excel
1. Modificas el archivo Excel
2. En el panel lateral, presiona "Actualizar desde Excel"
3. El servidor recarga el archivo (sin reiniciar)
4. La página se actualiza automáticamente

---

## 🐛 Debugging & Troubleshooting

### "El tablero muestra datos vacíos"
- Verifica que el Excel exista en `EXCEL_PATH`
- Abre el navegador y ve a http://127.0.0.1:8000/health (debe retornar JSON con `"ok": true`)

### "Puerto 8000 en uso"
```powershell
Get-NetTCPConnection -LocalPort 8000 | Stop-Process -Force
```

### "Cambié el Excel pero el tablero no actualiza"
- Presiona "Actualizar desde Excel" en el panel lateral, O
- Reinicia el servidor (`Ctrl+C` en la consola y `python app.py` nuevamente)

### "Falta una columna en la tabla"
- Columnas ocultas: `version`, `fecha reporte`, `fecha despliegue`, `#`, `despliegue tentativo`, `caso aranda`, `reduccion`, `tipo`, `observacion`
- Para mostrarlas, edita `renderTable()` en el código JS

---

## 📝 Convenciones de Código

### Python
- **Tipos**: Type hints en todas las funciones
- **Nomenclatura**: snake_case
- **Separación**: Tres secciones: constantes → funciones Python → HTML/JS

### JavaScript
- **Nomenclatura**: camelCase
- **Estado**: Centralizado en objeto `state`
- **Listeners**: Agregados en `loadData()` → `renderFilters()`

### HTML/CSS
- **Colores KFC**: Variables CSS (--kfc-red, --kfc-black, etc.)
- **Responsive**: Grid queries para <1300px y <1080px
- **Print**: `@media print` para exportación a PDF

---

## 🚀 Próximas Mejoras (Ideas)

- [ ] Persistir filtros en URL (permite guardar bookmarks)
- [ ] Dark mode
- [ ] Gráficos interactivos (Click en pastel → Filtra)
- [ ] Exportación a Google Sheets
- [ ] Histórico de cambios (auditoría)
- [ ] Caché server-side (Redis) para Excel grande
- [ ] WebSocket para actualizaciones en tiempo real

---

**Documentado:** 2026-07-22  
**Versión:** app.py con pasteles por sprint, combo multi-select, export PDF
