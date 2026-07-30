<?php
$apiBase = 'http://127.0.0.1:8000';
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tablero Gerencial de Defectos</title>
  <style>
    :root {
      --kfc-red: #e4002b;
      --kfc-black: #131313;
      --kfc-cream: #f6f2ea;
      --kfc-white: #ffffff;
      --line: #e4ddd3;
      --text: #1a1a1a;
      --muted: #666056;
      --ok: #2e7d32;
      --warning: #b16a00;
      --shadow: 0 16px 42px rgba(0, 0, 0, 0.12);
      --radius: 18px;
    }

    * { box-sizing: border-box; }

    html, body {
      overflow-x: hidden;
    }

    body {
      margin: 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 2% 0%, rgba(228, 0, 43, 0.15), transparent 22%),
        radial-gradient(circle at 98% 0%, rgba(19, 19, 19, 0.1), transparent 26%),
        var(--kfc-cream);
      min-height: 100vh;
    }

    .layout {
      max-width: 1700px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 18px;
      padding: 18px;
    }

    .layout,
    .main,
    .panel {
      min-width: 0;
    }

    .panel {
      background: var(--kfc-white);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }

    .options {
      position: sticky;
      top: 18px;
      align-self: start;
      padding: 16px;
      background:
        linear-gradient(180deg, #ffffff 0%, #fbf8f2 100%);
      border-top: 6px solid var(--kfc-red);
    }

    .options h2 {
      margin: 0;
      font-size: 20px;
      letter-spacing: -0.02em;
    }

    .options p {
      margin: 6px 0 14px;
      color: var(--muted);
      line-height: 1.4;
      font-size: 13px;
    }

    .option-stack {
      display: grid;
      gap: 10px;
    }

    .option-btn {
      border: 1px solid var(--kfc-red);
      border-radius: 12px;
      background: var(--kfc-red);
      color: #fff;
      font-weight: 700;
      padding: 10px 12px;
      cursor: pointer;
      transition: transform 120ms ease, filter 120ms ease;
      text-align: left;
    }

    .option-btn:hover {
      transform: translateY(-1px);
      filter: brightness(0.95);
    }

    .option-btn.secondary {
      background: #fff;
      color: var(--kfc-black);
      border-color: #cec6bb;
    }

    .option-btn.secondary:hover {
      filter: none;
      border-color: var(--kfc-black);
    }

    .status-box {
      margin-top: 12px;
      padding: 10px;
      border-radius: 10px;
      border: 1px dashed #d0c6b9;
      background: #faf7f2;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }

    .main {
      display: grid;
      gap: 16px;
    }

    .hero {
      padding: 22px;
      background:
        linear-gradient(130deg, #1a1a1a 0%, #212121 45%, #2a2a2a 100%);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      position: relative;
      overflow: hidden;
    }

    .hero::after {
      content: "";
      position: absolute;
      right: -60px;
      top: -50px;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(228, 0, 43, 0.35), transparent 68%);
    }

    .eyebrow {
      color: #ffc6d2;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-size: 11px;
      font-weight: 700;
    }

    h1 {
      margin: 8px 0 8px;
      font-size: clamp(30px, 4vw, 44px);
      line-height: 1.02;
      letter-spacing: -0.03em;
    }

    .subtitle {
      margin: 0;
      max-width: 1000px;
      color: #ebe7de;
      line-height: 1.55;
      font-size: 15px;
    }

    .pill-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 14px;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 999px;
      padding: 7px 10px;
      font-size: 12px;
      color: #f8f4ef;
    }

    .loading {
      margin-top: 10px;
      color: #efe7da;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.35);
      border-top-color: #fff;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .kpis {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    }

    .kpi {
      padding: 14px;
      border-left: 5px solid var(--kfc-red);
    }

    .kpi .label {
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 11px;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .kpi .value {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--kfc-black);
    }

    .kpi .hint {
      margin-top: 8px;
      color: var(--muted);
      font-size: 12px;
    }

    .section {
      padding: 16px;
    }

    .section-head {
      margin-bottom: 12px;
    }

    .section-title {
      margin: 0;
      font-size: 19px;
    }

    .section-subtitle {
      margin: 4px 0 0;
      color: var(--muted);
      font-size: 13px;
    }

    .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 10px;
      align-items: end;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .field label {
      font-size: 11px;
      text-transform: uppercase;
      color: var(--muted);
      letter-spacing: 0.09em;
      font-weight: 700;
    }

    .field input, .field select {
      width: 100%;
      border: 1px solid #d4ccbe;
      border-radius: 11px;
      padding: 10px;
      background: #fff;
      color: var(--text);
      outline: none;
    }

    .field select[multiple] {
      min-height: 130px;
      padding: 6px;
    }

    .field-actions {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .field-actions .option-btn {
      width: 100%;
      text-align: center;
      min-height: 44px;
      box-shadow: 0 10px 24px rgba(228, 0, 43, 0.18);
    }

    .field-actions .option-btn.secondary {
      border-color: var(--kfc-red);
      color: var(--kfc-red);
      background: #fff5f7;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .field .hint {
      color: var(--muted);
      font-size: 11px;
      line-height: 1.3;
    }

    .field input:focus, .field select:focus {
      border-color: var(--kfc-red);
      box-shadow: 0 0 0 2px rgba(228, 0, 43, 0.1);
    }

    .charts {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .bar-list {
      display: grid;
      gap: 10px;
      margin-top: 10px;
    }

    .bar-item { display: grid; gap: 6px; }

    .bar-top {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--muted);
    }

    .bar-track {
      height: 10px;
      border-radius: 999px;
      background: #f1ece2;
      position: relative;
      overflow: hidden;
    }

    .bar-fill {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--kfc-red), #ff7a91);
    }

    .table-wrap {
      border: 1px solid var(--line);
      border-radius: 14px;
      overflow: hidden;
      max-height: 700px;
      background: #fff;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 13px;
    }

    thead th {
      position: sticky;
      top: 0;
      background: #1f1f1f;
      color: #fff;
      text-align: left;
      padding: 11px 10px;
      white-space: normal;
      word-break: break-word;
    }

    tbody td {
      padding: 10px;
      border-bottom: 1px solid #ede6da;
      vertical-align: top;
      white-space: normal;
      word-break: break-word;
      overflow-wrap: anywhere;
    }

    tbody tr:nth-child(even) td {
      background: #faf7f1;
    }

    .empty {
      text-align: center;
      color: var(--muted);
      padding: 16px;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(0, 0, 0, 0.52);
      backdrop-filter: blur(5px);
    }

    .modal-overlay.open {
      display: flex;
    }

    .modal-dialog {
      width: min(1300px, 100%);
      max-height: 92vh;
      overflow: auto;
      background: #fff;
      border: 1px solid #d8cec0;
      border-radius: 18px;
      padding: 14px;
      box-shadow: 0 26px 90px rgba(0, 0, 0, 0.28);
    }

    .modal-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
    }

    .modal-title {
      margin: 0;
      font-size: 23px;
      color: var(--kfc-black);
    }

    .modal-subtitle {
      margin: 4px 0 0;
      color: var(--muted);
      font-size: 13px;
    }

    .close-btn {
      border: 1px solid #c7bcae;
      background: #fff;
      color: #111;
      width: 38px;
      height: 38px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 18px;
    }

    .pie-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .pie-card {
      border: 1px solid #e3dbce;
      border-radius: 14px;
      padding: 12px;
      background: #fff;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 330px;
    }

    .pie-card h3 {
      margin: 0;
      font-size: 16px;
    }

    .pie-card p {
      margin: 4px 0 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }

    .pie-figure {
      width: min(220px, 100%);
      margin: 0 auto;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      position: relative;
      background: conic-gradient(#e4002b 0deg 360deg);
    }

    .pie-figure::after {
      content: "";
      position: absolute;
      inset: 24%;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #e7ddcf;
    }

    .pie-center {
      position: absolute;
      inset: 24%;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      pointer-events: none;
    }

    .pie-center strong {
      font-size: 25px;
      color: var(--kfc-black);
    }

    .pie-center span {
      color: var(--muted);
      font-size: 11px;
      max-width: 130px;
      line-height: 1.3;
    }

    .pie-legend {
      display: grid;
      gap: 8px;
      margin-top: auto;
    }

    .legend-item {
      display: flex;
      gap: 8px;
      align-items: flex-start;
      font-size: 13px;
    }

    .legend-swatch {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      margin-top: 4px;
      flex: 0 0 auto;
    }

    .legend-meta {
      color: var(--muted);
      margin-left: auto;
      font-size: 11px;
      white-space: nowrap;
    }

    @media (max-width: 1300px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .options {
        position: static;
      }
    }

    @media (max-width: 1080px) {
      .filters,
      .charts,
      .pie-grid {
        grid-template-columns: 1fr;
      }

      .table-wrap {
        max-height: 560px;
      }
    }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="panel options">
      <h2>Opciones</h2>
      <p>Módulo lateral para acciones gerenciales rápidas.</p>
      <div class="option-stack">
        <button class="option-btn secondary" id="openInsightsBtn" type="button">Ver pasteles</button>
        <button class="option-btn" id="refreshExcelBtn" type="button">Actualizar desde Excel</button>
        <button class="option-btn secondary" id="exportExcelBtn" type="button">Exportar Excel</button>
        <button class="option-btn secondary" id="exportPdfBtn" type="button">Exportar PDF</button>
      </div>
      <div class="status-box" id="optionStatus">Sincronizado con el archivo actual.</div>
    </aside>

    <main class="main">
      <section class="hero">
        <div class="eyebrow">Tablero gerencial</div>
        <h1>Defectos y operación por hoja</h1>
        <p class="subtitle">
          Diseño con paleta KFC. La hoja del Excel es el filtro principal y todos los indicadores,
          pasteles y exportaciones se recalculan con la vista filtrada actual.
        </p>
        <div style="margin-top:10px;">
          <button class="option-btn" id="refreshExcelBtnMain" type="button">Actualizar Excel (principal)</button>
        </div>
        <div class="pill-row" id="summaryPills"></div>
        <div class="loading" id="loadingState"><span class="spinner"></span> Cargando datos</div>
      </section>

      <section class="kpis" id="kpiGrid"></section>

      <section class="panel section">
        <div class="section-head">
          <h2 class="section-title">Filtros</h2>
          <p class="section-subtitle">La hoja es el filtro más importante. Los demás filtros se adaptan automáticamente.</p>
        </div>
        <div class="filters" id="filters"></div>
      </section>

      <section class="charts">
        <article class="panel section">
          <div class="section-head">
            <h2 class="section-title">Distribución por estado</h2>
            <p class="section-subtitle">Lectura rápida del estado de defectos.</p>
          </div>
          <div id="statusChart" class="bar-list"></div>
        </article>

        <article class="panel section">
          <div class="section-head">
            <h2 class="section-title">Distribución por país</h2>
            <p class="section-subtitle">Países más afectados en la hoja activa.</p>
          </div>
          <div id="countryChart" class="bar-list"></div>
        </article>
      </section>

      <section class="panel section">
        <div class="section-head">
          <h2 class="section-title">Detalle de registros</h2>
          <p class="section-subtitle" id="tableSubtitle">Tabla dinámica filtrada desde el Excel.</p>
        </div>
        <div class="table-wrap" id="tableWrap"></div>
      </section>
    </main>
  </div>

  <div class="modal-overlay" id="insightModal" aria-hidden="true">
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="insightTitle">
      <div class="modal-head">
        <div>
          <h2 class="modal-title" id="insightTitle">Pasteles gerenciales</h2>
          <p class="modal-subtitle">Distribuciones del conjunto visible con filtros activos.</p>
        </div>
        <button class="close-btn" id="closeInsightsBtn" type="button" aria-label="Cerrar">×</button>
      </div>

      <div class="pie-grid">
        <section class="pie-card">
          <div>
            <h3>Porcentaje de defecto por país</h3>
            <p>Participación por país en los registros visibles.</p>
          </div>
          <div class="pie-figure" id="pieCountry"><div class="pie-center"><strong id="pieCountryValue">0%</strong><span id="pieCountryLabel">Sin datos</span></div></div>
          <div class="pie-legend" id="pieCountryLegend"></div>
        </section>

        <section class="pie-card">
          <div>
            <h3>Despliegue por sprint</h3>
            <p>Tomado del campo Sprint despliegue.</p>
          </div>
          <div class="pie-figure" id="pieDeployment"><div class="pie-center"><strong id="pieDeploymentValue">0%</strong><span id="pieDeploymentLabel">Sin datos</span></div></div>
          <div class="pie-legend" id="pieDeploymentLegend"></div>
        </section>

        <section class="pie-card">
          <div>
            <h3>Prioridad DB</h3>
            <p>Distribución por prioridad DB de la hoja actual.</p>
          </div>
          <div class="pie-figure" id="piePriorityDb"><div class="pie-center"><strong id="piePriorityDbValue">0%</strong><span id="piePriorityDbLabel">Sin datos</span></div></div>
          <div class="pie-legend" id="piePriorityDbLegend"></div>
        </section>

        <section class="pie-card">
          <div>
            <h3>Responsable del reporte</h3>
            <p>Participación por responsable de reporte.</p>
          </div>
          <div class="pie-figure" id="pieResponsible"><div class="pie-center"><strong id="pieResponsibleValue">0%</strong><span id="pieResponsibleLabel">Sin datos</span></div></div>
          <div class="pie-legend" id="pieResponsibleLegend"></div>
        </section>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = <?= json_encode($apiBase, JSON_UNESCAPED_SLASHES) ?>;
    const state = {
      meta: null,
      currentSheet: null,
      rows: [],
      columns: [],
      activeFilters: {},
      latestPayload: null,
    };

    const filterContainer = document.getElementById('filters');
    const kpiGrid = document.getElementById('kpiGrid');
    const tableWrap = document.getElementById('tableWrap');
    const statusChart = document.getElementById('statusChart');
    const countryChart = document.getElementById('countryChart');
    const summaryPills = document.getElementById('summaryPills');
    const loadingState = document.getElementById('loadingState');
    const optionStatus = document.getElementById('optionStatus');
    const tableSubtitle = document.getElementById('tableSubtitle');

    const PIE_COLORS = ['#e4002b', '#111111', '#ff8aa2', '#d0b28f', '#7f1d1d', '#f3a6b5', '#6b7280'];

    function apiUrl(path, params = {}) {
      const url = new URL(path, API_BASE);
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== undefined && item !== null && String(item).trim() !== '' && String(item) !== 'all') {
              url.searchParams.append(key, item);
            }
          });
          return;
        }
        if (value !== undefined && value !== null && String(value).trim() !== '' && String(value) !== 'all') {
          url.searchParams.set(key, value);
        }
      });
      return url.toString();
    }

    function escapeHtml(value) {
      return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function formatValue(value) {
      if (value === null || value === undefined || value === '') return '—';
      return escapeHtml(value);
    }

    function getColumnName(columns, candidates) {
      const lookup = new Map(columns.map((column) => [String(column).toLowerCase(), column]));
      for (const candidate of candidates) {
        const match = lookup.get(String(candidate).toLowerCase());
        if (match) return match;
      }
      return '';
    }

    function countPieData(rows, columnName, limit = 5) {
      if (!columnName) return [];
      const counter = new Map();
      let total = 0;

      rows.forEach((row) => {
        const value = row[columnName];
        if (value === null || value === undefined || String(value).trim() === '') return;
        const key = String(value).trim();
        counter.set(key, (counter.get(key) || 0) + 1);
        total += 1;
      });

      if (!total) return [];

      const sorted = [...counter.entries()].sort((a, b) => b[1] - a[1]);
      const top = sorted.slice(0, limit - 1);
      const items = top.map(([label, count], index) => ({
        label,
        count,
        share: Math.round((count / total) * 1000) / 10,
        color: PIE_COLORS[index % PIE_COLORS.length],
      }));

      const shown = items.reduce((sum, item) => sum + item.count, 0);
      const remaining = total - shown;
      if (remaining > 0) {
        items.push({
          label: 'Otros',
          count: remaining,
          share: Math.round((remaining / total) * 1000) / 10,
          color: '#9ca3af',
        });
      }

      return items;
    }

    function buildPieGradient(items) {
      if (!items.length) return 'conic-gradient(#ddd 0deg 360deg)';
      let start = 0;
      const parts = items.map((item) => {
        const end = start + (item.share / 100) * 360;
        const piece = `${item.color} ${start}deg ${end}deg`;
        start = end;
        return piece;
      });
      return `conic-gradient(${parts.join(', ')})`;
    }

    function renderPieCard(figureId, valueId, labelId, legendId, items, emptyLabel) {
      const figure = document.getElementById(figureId);
      const value = document.getElementById(valueId);
      const label = document.getElementById(labelId);
      const legend = document.getElementById(legendId);

      if (!items.length) {
        figure.style.background = 'conic-gradient(#ddd 0deg 360deg)';
        value.textContent = '0%';
        label.textContent = emptyLabel;
        legend.innerHTML = '<div class="empty">Sin datos para este pastel.</div>';
        return;
      }

      figure.style.background = buildPieGradient(items);
      value.textContent = `${items[0].share}%`;
      label.textContent = `${items[0].label} lidera`;
      legend.innerHTML = items.map((item) => `
        <div class="legend-item">
          <span class="legend-swatch" style="background:${item.color};"></span>
          <span>${escapeHtml(item.label)}</span>
          <span class="legend-meta">${item.count} · ${item.share}%</span>
        </div>
      `).join('');
    }

    function renderInsightModal(payload) {
      const countryColumn = getColumnName(payload.columns, ['PAIS', 'País', 'pais', 'country']);
      const sprintColumn = getColumnName(payload.columns, ['Sprint despliegue']);
      const priorityColumn = getColumnName(payload.columns, ['prioridad DB', 'prioridad db']);
      const respColumn = getColumnName(payload.columns, ['Responsable de Reporte', 'Responsable reporte']);

      renderPieCard('pieCountry', 'pieCountryValue', 'pieCountryLabel', 'pieCountryLegend', countPieData(payload.rows, countryColumn), 'Sin país');
      renderPieCard('pieDeployment', 'pieDeploymentValue', 'pieDeploymentLabel', 'pieDeploymentLegend', countPieData(payload.rows, sprintColumn), 'Sin sprint despliegue');
      renderPieCard('piePriorityDb', 'piePriorityDbValue', 'piePriorityDbLabel', 'piePriorityDbLegend', countPieData(payload.rows, priorityColumn), 'Sin prioridad DB');
      renderPieCard('pieResponsible', 'pieResponsibleValue', 'pieResponsibleLabel', 'pieResponsibleLegend', countPieData(payload.rows, respColumn), 'Sin responsable');
    }

    function buildCurrentParams() {
      const params = { sheet: state.currentSheet || '' };
      Object.entries(state.activeFilters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          params[key] = value;
          return;
        }
        if (value !== undefined && value !== null && String(value).trim() !== '' && String(value) !== 'all') {
          params[key] = value;
        }
      });
      return params;
    }

    function openInsights() {
      if (!state.latestPayload) return;
      renderInsightModal(state.latestPayload);
      const modal = document.getElementById('insightModal');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeInsights() {
      const modal = document.getElementById('insightModal');
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }

    function triggerExport(format) {
      window.location.href = apiUrl(`/export/${format}`, buildCurrentParams());
    }

    async function refreshExcelData() {
      optionStatus.textContent = 'Actualizando desde Excel...';
      try {
        const response = await fetch(apiUrl('/api/reload'));
        if (!response.ok) {
          throw new Error('No fue posible actualizar desde Excel');
        }
        const data = await response.json();
        optionStatus.textContent = `Actualizado: ${data.refreshed_at} · ${data.sheet_count} hojas`;
        await loadData(true);
      } catch (error) {
        optionStatus.textContent = error.message;
      }
    }

    function renderPills(meta, rows) {
      const sheet = state.currentSheet || '';
      summaryPills.innerHTML = `
        <span class="pill"><strong>${escapeHtml(sheet)}</strong> hoja activa</span>
        <span class="pill"><strong>${meta.columns.length}</strong> columnas</span>
        <span class="pill"><strong>${rows.length}</strong> registros visibles</span>
        <span class="pill"><strong>${meta.sheets.length}</strong> hojas del libro</span>
      `;
    }

    function renderKpis(meta) {
      const items = meta.kpis || [];
      kpiGrid.innerHTML = items.map((item) => `
        <article class="panel kpi">
          <div class="label">${escapeHtml(item.label)}</div>
          <div class="value">${escapeHtml(item.value)}</div>
          <div class="hint">${escapeHtml(item.hint || '')}</div>
        </article>
      `).join('');
    }

    function renderBars(target, items) {
      if (!items.length) {
        target.innerHTML = '<div class="empty">No hay datos para mostrar con los filtros actuales.</div>';
        return;
      }
      const max = Math.max(...items.map((item) => item.count), 1);
      target.innerHTML = items.map((item) => {
        const width = Math.max(5, Math.round((item.count / max) * 100));
        return `
          <div class="bar-item">
            <div class="bar-top">
              <span>${escapeHtml(item.label)}</span>
              <span><strong>${item.count}</strong></span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${width}%;"></div></div>
          </div>
        `;
      }).join('');
    }

    function renderTable(columns, rows) {
      if (!columns.length) {
        tableWrap.innerHTML = '<div class="empty">La hoja seleccionada no tiene columnas válidas.</div>';
        return;
      }
      if (!rows.length) {
        tableWrap.innerHTML = '<div class="empty">No hay registros con esos filtros.</div>';
        return;
      }

      const visibleColumns = columns.slice(0, 18);
      const head = visibleColumns.map((col) => `<th>${escapeHtml(col)}</th>`).join('');
      const body = rows.map((row) => {
        const cells = visibleColumns.map((col) => `<td>${formatValue(row[col])}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');

      tableWrap.innerHTML = `
        <table>
          <thead><tr>${head}</tr></thead>
          <tbody>${body}</tbody>
        </table>
      `;
    }

    function renderFilters(meta) {
      const sheetOptions = meta.sheets
        .map((sheet) => `<option value="${escapeHtml(sheet)}" ${sheet === state.currentSheet ? 'selected' : ''}>${escapeHtml(sheet)}</option>`)
        .join('');

      const filterOptions = meta.availableFilters
        .map((filter) => {
          const currentValue = state.activeFilters[filter.name];
          const isSprintMulti = String(filter.name).toLowerCase() === 'sprint despliegue';
          const selectedValues = Array.isArray(currentValue) ? currentValue.map(String) : [String(currentValue || 'all')];

          if (isSprintMulti) {
            return `
              <div class="field">
                <label for="filter-${escapeHtml(filter.name)}">${escapeHtml(filter.label)} (múltiple)</label>
                <select id="filter-${escapeHtml(filter.name)}" data-filter="${escapeHtml(filter.name)}" multiple size="6">
                  ${filter.values.map((value) => `<option value="${escapeHtml(value)}" ${selectedValues.includes(String(value)) ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}
                </select>
                <span class="hint">Mantén presionado Ctrl o Shift para seleccionar más de un sprint.</span>
              </div>
            `;
          }

          return `
            <div class="field">
              <label for="filter-${escapeHtml(filter.name)}">${escapeHtml(filter.label)}</label>
              <select id="filter-${escapeHtml(filter.name)}" data-filter="${escapeHtml(filter.name)}">
                <option value="all">Todos</option>
                ${filter.values.map((value) => `<option value="${escapeHtml(value)}" ${String(currentValue || 'all') === String(value) ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}
              </select>
            </div>
          `;
        })
        .join('');

      filterContainer.innerHTML = `
        <div class="field">
          <label for="sheetSelect">Hoja</label>
          <select id="sheetSelect">${sheetOptions}</select>
        </div>
        <div class="field">
          <label for="searchInput">Búsqueda</label>
          <input id="searchInput" type="search" placeholder="Buscar en la hoja seleccionada" value="${escapeHtml(state.activeFilters.q || '')}" />
        </div>
        <div class="field field-actions">
          <label>Accionesss</label>
          <button class="option-btn secondary" id="clearFiltersBtn" type="button">Limpiar filtros</button>
        </div>
        ${filterOptions}
      `;

      document.getElementById('sheetSelect').addEventListener('change', async (event) => {
        state.currentSheet = event.target.value;
        state.activeFilters = { q: '' };
        await loadData();
      });

      document.getElementById('searchInput').addEventListener('input', debounce(async (event) => {
        state.activeFilters.q = event.target.value;
        await loadData(false);
      }, 220));

      document.getElementById('clearFiltersBtn').addEventListener('click', async () => {
        state.currentSheet = state.meta?.default_sheet || state.currentSheet;
        state.activeFilters = { q: '' };
        await loadData(true);
      });

      meta.availableFilters.forEach((filter) => {
        const select = document.getElementById(`filter-${filter.name}`);
        if (!select) return;
        select.addEventListener('change', async (event) => {
          const isSprintMulti = String(filter.name).toLowerCase() === 'sprint despliegue';
          if (isSprintMulti) {
            const selected = Array.from(event.target.selectedOptions || [])
              .map((opt) => opt.value)
              .filter((value) => value && value !== 'all');
            state.activeFilters[filter.name] = selected;
          } else {
            state.activeFilters[filter.name] = event.target.value;
          }
          await loadData(false);
        });
      });
    }

    function debounce(fn, delay) {
      let timer = null;
      return (...args) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => fn(...args), delay);
      };
    }

    async function loadMeta(initial = false) {
      const response = await fetch(apiUrl('/api/meta', { sheet: state.currentSheet || '' }));
      if (!response.ok) {
        throw new Error('No se pudo cargar metadata');
      }
      const meta = await response.json();
      state.meta = meta;
      if (initial || !state.currentSheet) {
        state.currentSheet = meta.default_sheet;
      }
      return meta;
    }

    async function loadData(resetMeta = true) {
      loadingState.style.display = 'inline-flex';
      try {
        if (resetMeta || !state.meta) {
          await loadMeta();
        }
        const response = await fetch(apiUrl('/api/data', buildCurrentParams()));
        if (!response.ok) {
          throw new Error('No se pudo cargar data');
        }
        const payload = await response.json();
        state.rows = payload.rows;
        state.columns = payload.columns;
        state.latestPayload = payload;

        renderFilters(payload.meta);
        renderKpis(payload.meta);
        renderPills(payload.meta, payload.rows);
        renderBars(statusChart, payload.status_breakdown);
        renderBars(countryChart, payload.country_breakdown);
        renderTable(payload.columns, payload.rows);
        renderInsightModal(payload);
        tableSubtitle.textContent = `${payload.rows.length} registros visibles en ${payload.sheet}`;
        optionStatus.textContent = `Sincronizado · hoja ${payload.sheet} · ${payload.rows.length} registros`;
      } catch (error) {
        tableWrap.innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
        optionStatus.textContent = error.message;
      } finally {
        loadingState.style.display = 'none';
      }
    }

    document.getElementById('openInsightsBtn').addEventListener('click', openInsights);
    document.getElementById('closeInsightsBtn').addEventListener('click', closeInsights);
    document.getElementById('exportExcelBtn').addEventListener('click', () => triggerExport('excel'));
    document.getElementById('exportPdfBtn').addEventListener('click', () => triggerExport('pdf'));
    document.getElementById('refreshExcelBtn').addEventListener('click', refreshExcelData);
    const refreshExcelBtnMain = document.getElementById('refreshExcelBtnMain');
    if (refreshExcelBtnMain) {
      refreshExcelBtnMain.addEventListener('click', refreshExcelData);
    }

    document.getElementById('insightModal').addEventListener('click', (event) => {
      if (event.target.id === 'insightModal') closeInsights();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeInsights();
    });

    loadData(true);
  </script>
</body>
</html>
