import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetricsService } from '../services/metrics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-wrapper">
      <!-- Menú Lateral -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <button class="toggle-btn" (click)="toggleSidebar()">
            {{ sidebarCollapsed ? '☰' : '×' }}
          </button>
          <h2 *ngIf="!sidebarCollapsed">⚙️ Configuración</h2>
        </div>

        <nav class="sidebar-nav" *ngIf="!sidebarCollapsed">
          <button
            class="nav-item"
            [class.active]="activeMenu === 'dashboard'"
            (click)="activeMenu = 'dashboard'">
            📅 Gestión de Sprints
          </button>
          <button
            class="nav-item"
            [class.active]="activeMenu === 'dashboard'"
            (click)="activeMenu = 'dashboard'">
            📊 Dashboard
          </button>
        </nav>

        <!-- Contenido del Menú Lateral -->
        <div class="sidebar-content" *ngIf="!sidebarCollapsed && activeMenu === 'dashboard'">
          <h3>Gestión de Sprints</h3>

          <!-- Formulario Sprint -->
          <div class="sprint-form-sidebar">
            <h4>{{ editingSprintId ? 'Editar' : 'Nuevo' }} Sprint</h4>

            <div class="form-field-sidebar">
              <label>Nombre:</label>
              <input type="text" [(ngModel)]="newSprintNombre" placeholder="Sprint 2026-02" />
            </div>

            <div class="form-field-sidebar">
              <label>Desde:</label>
              <input type="date" [(ngModel)]="newSprintFechaInicio" />
            </div>

            <div class="form-field-sidebar">
              <label>Hasta:</label>
              <input type="date" [(ngModel)]="newSprintFechaFin" />
            </div>

            <div class="form-actions-sidebar">
              <button class="btn-save-small" (click)="saveSprint()">
                {{ editingSprintId ? '💾' : '➕' }}
              </button>
              <button class="btn-cancel-small" (click)="cancelEditSprint()" *ngIf="editingSprintId">
                ✖
              </button>
            </div>
          </div>

          <!-- Lista de Sprints -->
          <div class="sprints-list-sidebar">
            <h4>Sprints ({{ sprintsDisponibles.length }})</h4>
            <div class="sprint-item" *ngFor="let sprint of sprintsDisponibles">
              <div class="sprint-info">
                <strong>{{ sprint.nombre }}</strong>
                <small>{{ sprint.fechaInicio | date:'dd/MM' }} - {{ sprint.fechaFin | date:'dd/MM/yy' }}</small>
              </div>
              <div class="sprint-actions">
                <button (click)="editSprint(sprint)" title="Editar">✏️</button>
                <button (click)="confirmDeleteSprint(sprint.id)" title="Eliminar">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Contenido Principal -->
      <main class="main-content" [class.expanded]="sidebarCollapsed">
        <div class="dashboard-container">
          <div class="dashboard-header">
            <h1>📊 Dashboard de Métricas ARANDA</h1>
            <p>Sistema de Gestión de Servicios - Análisis de Especialistas y Productos</p>
          </div>

          <div class="filters-section">
            <div class="filter-group">
              <label>Sprint:</label>
              <select [(ngModel)]="selectedSprint" (change)="onSprintChange()" class="filter-select">
                <option value="">Seleccionar sprint ({{ sprintsDisponibles.length }})</option>
                <option *ngFor="let sprint of sprintsDisponibles" [value]="sprint.id">{{ sprint.nombre }}</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Fecha Inicio:</label>
              <input type="date" [(ngModel)]="startDate" (change)="onDateChange()" [disabled]="selectedSprint !== ''" />
            </div>
            <div class="filter-group">
              <label>Fecha Fin:</label>
              <input type="date" [(ngModel)]="endDate" (change)="onDateChange()" [disabled]="selectedSprint !== ''" />
            </div>

            <div class="filter-group">
              <label>Grupo de Especialista:</label>
              <select [(ngModel)]="selectedGrupo" (change)="onGroupChange()" class="filter-select">
                <option value="todos">Todos los grupos</option>
                <option *ngFor="let grupo of gruposDisponibles" [value]="grupo">{{ grupo }}</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Categoría:</label>
              <select [(ngModel)]="selectedCategoria" (change)="onCategoryChange()" class="filter-select" [disabled]="selectedGrupo === 'todos'">
                <option value="todos">Todas las categorías</option>
                <option *ngFor="let cat of categoriasDisponibles" [value]="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Servicio:</label>
              <select [(ngModel)]="selectedServicio" (change)="onServiceChange()" class="filter-select" [disabled]="selectedCategoria === 'todos'">
                <option value="todos">Todos los servicios</option>
                <option *ngFor="let serv of serviciosDisponibles" [value]="serv">{{ serv }}</option>
              </select>
            </div>

            <button class="btn-refresh" (click)="loadMetrics()">🔄 Actualizar</button>
            <button class="btn-clear" (click)="clearFilters()">✖ Limpiar Filtros</button>
          </div>

          <!-- Indicador de filtros activos -->
          <div class="active-filters" *ngIf="hasActiveFilters()">
            <span class="filter-badge" *ngIf="selectedGrupo !== 'todos'">
              Grupo: {{ selectedGrupo }}
              <button class="remove-filter" (click)="removeFilter('grupo')">×</button>
            </span>
            <span class="filter-badge" *ngIf="selectedCategoria !== 'todos'">
              Categoría: {{ selectedCategoria }}
              <button class="remove-filter" (click)="removeFilter('categoria')">×</button>
            </span>
            <span class="filter-badge" *ngIf="selectedServicio !== 'todos'">
              Servicio: {{ selectedServicio }}
              <button class="remove-filter" (click)="removeFilter('servicio')">×</button>
            </span>
          </div>

          <div *ngIf="loading" class="loading-spinner">
            <div class="spinner"></div>
            <p>Cargando métricas...</p>
          </div>

          <div *ngIf="error" class="error-message">
            ⚠️ {{ error }}
          </div>

          <!-- Tarjetas de resumen -->
          <div class="metrics-grid" *ngIf="!loading">
            <div class="metric-card">
              <div class="card-icon">👥</div>
              <h3>Especialistas</h3>
              <p class="metric-value">{{ specialistsCount }}</p>
              <p class="metric-label">{{ selectedGrupo !== 'todos' ? 'del Grupo' : 'Total Activos' }}</p>
            </div>

            <div class="metric-card">
              <div class="card-icon">🎫</div>
              <h3>Servicios</h3>
              <p class="metric-value">{{ servicesCount }}</p>
              <p class="metric-label">Atendidos</p>
            </div>

            <div class="metric-card">
              <div class="card-icon">📦</div>
              <h3>Casos</h3>
              <p class="metric-value">{{ productsCount }}</p>
              <p class="metric-label">Total</p>
            </div>

            <div class="metric-card">
              <div class="card-icon">✅</div>
              <h3>Resueltos</h3>
              <p class="metric-value">{{ resolvedCount }}</p>
              <p class="metric-label">{{resolvedPercentage}}% Completado</p>
            </div>
          </div>

          <!-- Tabs de navegación -->
          <div class="tabs-container">
            <button
              class="tab"
              [class.active]="activeTab === 'specialists'"
              (click)="activeTab = 'specialists'; loadSpecialistMetrics()">
              👥 Por Especialista ({{specialistMetrics.length}})
            </button>
            <button
              class="tab"
              [class.active]="activeTab === 'products'"
              (click)="activeTab = 'products'; loadProductMetrics()">
              📦 Por Producto
            </button>
            <button
              class="tab"
              [class.active]="activeTab === 'services'"
              (click)="activeTab = 'services'; loadServiceMetrics()">
              🎫 Servicios
            </button>
            <button
              class="tab"
              [class.active]="activeTab === 'tables'"
              (click)="activeTab = 'tables'; loadTables()">
              🗂️ Explorar Tablas
            </button>
          </div>

          <!-- Contenido de tabs -->
          <div class="tab-content">
            <!-- Tab: Especialistas -->
            <div *ngIf="activeTab === 'specialists'" class="data-section">
              <h2>Especialistas - Rendimiento</h2>
              <p class="subtitle" *ngIf="hasActiveFilters()">
                Filtrado por:
                <strong *ngIf="selectedGrupo !== 'todos'">Grupo: {{selectedGrupo}}</strong>
                <strong *ngIf="selectedCategoria !== 'todos'">Categoría: {{selectedCategoria}}</strong>
                <strong *ngIf="selectedServicio !== 'todos'">Servicio: {{selectedServicio}}</strong>
              </p>
              <div *ngIf="specialistMetrics.length === 0" class="no-data">
                No hay datos disponibles con los filtros seleccionados
              </div>
              <table *ngIf="specialistMetrics.length > 0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Especialista</th>
                    <th>Grupo</th>
                    <th>Servicios</th>
                    <th>Resueltos</th>
                    <th>Pendientes</th>
                    <th>Eficiencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of specialistMetrics; let i = index">
                    <td>{{i + 1}}</td>
                    <td><strong>{{ item.nombre }}</strong></td>
                    <td><span class="badge">{{ item.grupo }}</span></td>
                    <td>{{ item.total_servicios }}</td>
                    <td>{{ item.resueltos }}</td>
                    <td>{{ item.pendientes }}</td>
                    <td>
                      <span class="efficiency" [class.high]="item.eficiencia >= 95"
                            [class.medium]="item.eficiencia >= 85 && item.eficiencia < 95"
                            [class.low]="item.eficiencia < 85">
                        {{ item.eficiencia }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tab: Productos -->
            <div *ngIf="activeTab === 'products'" class="data-section">
              <h2>Métricas por Producto/Servicio</h2>
              <div *ngIf="productMetrics.length === 0" class="no-data">
                No hay datos disponibles
              </div>
              <table *ngIf="productMetrics.length > 0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Total</th>
                    <th>Cerrados</th>
                    <th>Activos</th>
                    <th>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of productMetrics">
                    <td><strong>{{ item.producto }}</strong></td>
                    <td>{{ item.categoria }}</td>
                    <td>{{ item.total_servicios }}</td>
                    <td>{{ item.cerrados }}</td>
                    <td>{{ item.activos }}</td>
                    <td>{{ item.prioridad }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div *ngIf="activeTab === 'services'" class="data-section">
              <h2>Métricas de Servicios</h2>
              <p>Por estado, prioridad y tipo de caso</p>
            </div>

            <div *ngIf="activeTab === 'tables'" class="data-section">
              <h2>Tablas Disponibles en ARANDABI</h2>
              <p class="info-text">Total de tablas: {{ availableTables.length }}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      display: flex;
      min-height: 100vh;
      background: #f5f5f5;
    }

    /* Sidebar */
    .sidebar {
      width: 320px;
      background: white;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      transition: width 0.3s ease;
      overflow-y: auto;
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .sidebar.collapsed {
      width: 60px;
    }

    .sidebar-header {
      padding: 20px;
      background: linear-gradient(135deg, #E4002B 0%, #C1001F 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toggle-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 20px;
      transition: background 0.3s;
    }

    .toggle-btn:hover {
      background: rgba(255,255,255,0.3);
    }

    .sidebar-header h2 {
      margin: 0;
      font-size: 18px;
    }

    .sidebar-nav {
      padding: 10px;
    }

    .nav-item {
      width: 100%;
      padding: 12px 15px;
      background: transparent;
      border: none;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      border-radius: 6px;
      margin-bottom: 5px;
      transition: all 0.3s;
      color: #333;
    }

    .nav-item:hover {
      background: #f0f0f0;
    }

    .nav-item.active {
      background: #E4002B;
      color: white;
    }

    .sidebar-content {
      padding: 20px;
    }

    .sidebar-content h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #333;
    }

    .sidebar-content h4 {
      margin: 15px 0 10px 0;
      font-size: 14px;
      color: #E4002B;
    }

    .sprint-form-sidebar {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .form-field-sidebar {
      margin-bottom: 12px;
    }

    .form-field-sidebar label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #555;
      margin-bottom: 5px;
    }

    .form-field-sidebar input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    }

    .form-actions-sidebar {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }

    .btn-save-small, .btn-cancel-small {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .btn-save-small {
      background: #28a745;
      color: white;
    }

    .btn-cancel-small {
      background: #6c757d;
      color: white;
    }

    .sprints-list-sidebar {
      max-height: 400px;
      overflow-y: auto;
    }

    .sprint-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .sprint-info {
      flex: 1;
    }

    .sprint-info strong {
      display: block;
      font-size: 13px;
      color: #333;
    }

    .sprint-info small {
      display: block;
      font-size: 11px;
      color: #666;
      margin-top: 2px;
    }

    .sprint-actions {
      display: flex;
      gap: 5px;
    }

    .sprint-actions button {
      background: transparent;
      border: 1px solid #ddd;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .sprint-actions button:hover {
      background: #E4002B;
      border-color: #E4002B;
    }

    /* Main Content */
    .main-content {
      margin-left: 320px;
      flex: 1;
      transition: margin-left 0.3s ease;
    }

    .main-content.expanded {
      margin-left: 60px;
    }

    .dashboard-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 30px;
      padding: 30px;
      background: linear-gradient(135deg, #E4002B 0%, #C1001F 100%);
      color: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .dashboard-header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: 700;
    }

    .dashboard-header p {
      margin: 0;
      opacity: 0.95;
      font-size: 16px;
    }

    .filters-section {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
      min-width: 180px;
    }

    .filter-group label {
      font-weight: 600;
      font-size: 14px;
      color: #555;
    }

    .filter-group input, .filter-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .filter-group input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      color: #999;
    }

    .filter-select {
      cursor: pointer;
      background: white;
    }

    .filter-select:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
      color: #999;
    }

    .btn-refresh, .btn-clear {
      padding: 8px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      align-self: flex-end;
      transition: background 0.3s;
    }

    .btn-refresh {
      background: #28a745;
      color: white;
    }

    .btn-refresh:hover {
      background: #218838;
    }

    .btn-clear {
      background: #6c757d;
      color: white;
    }

    .btn-clear:hover {
      background: #545b62;
    }

    .active-filters {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filter-badge {
      background: #E4002B;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .remove-filter {
      background: rgba(255,255,255,0.3);
      border: none;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }

    .remove-filter:hover {
      background: rgba(255,255,255,0.5);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .metric-card {
      background: white;
      padding: 25px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .metric-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }

    .card-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }

    .metric-card h3 {
      margin: 0 0 10px 0;
      color: #555;
      font-size: 16px;
      font-weight: 600;
    }

    .metric-value {
      font-size: 36px;
      font-weight: bold;
      color: #E4002B;
      margin: 10px 0;
    }

    .metric-label {
      color: #888;
      font-size: 14px;
    }

    .tabs-container {
      display: flex;
      gap: 5px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
      flex-wrap: wrap;
    }

    .tab {
      padding: 12px 24px;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      color: #666;
      transition: all 0.3s;
    }

    .tab:hover {
      color: #E4002B;
      background: #f5f5f5;
    }

    .tab.active {
      color: #E4002B;
      border-bottom-color: #E4002B;
      background: #f5f5ff;
    }

    .tab-content {
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      min-height: 400px;
    }

    .data-section h2 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 24px;
    }

    .subtitle {
      color: #666;
      font-size: 14px;
      margin-bottom: 15px;
    }

    .subtitle strong {
      color: #E4002B;
      margin-right: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #555;
    }

    tr:hover {
      background: #f5f5f5;
    }

    .badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .efficiency {
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .efficiency.high {
      background: #d4edda;
      color: #155724;
    }

    .efficiency.medium {
      background: #fff3cd;
      color: #856404;
    }

    .efficiency.low {
      background: #f8d7da;
      color: #721c24;
    }

    .loading-spinner {
      text-align: center;
      padding: 50px;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #E4002B;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #999;
      font-size: 16px;
    }

    .info-text {
      color: #666;
      margin-bottom: 15px;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        position: relative;
      }

      .main-content {
        margin-left: 0;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .filters-section {
        flex-direction: column;
      }

      .btn-refresh, .btn-clear {
        align-self: stretch;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = false;
  error = '';

  startDate = '';
  endDate = '';

  // Filtros
  selectedSprint: any = '';
  selectedGrupo = 'todos';
  selectedCategoria = 'todos';
  selectedServicio = 'todos';
  sprintsDisponibles: any[] = [];
  gruposDisponibles: string[] = [];
  categoriasDisponibles: string[] = [];
  serviciosDisponibles: string[] = [];

  specialistsCount = 0;
  productsCount = 0;
  servicesCount = 0;
  resolvedCount = 0;
  resolvedPercentage = 0;

  activeTab = 'specialists';
  activeMenu = 'dashboard';
  sidebarCollapsed = false;

  specialistMetrics: any[] = [];
  productMetrics: any[] = [];
  serviceMetrics: any[] = [];
  availableTables: any[] = [];

  // Variables para gestión de sprints
  newSprintNombre = '';
  newSprintFechaInicio = '';
  newSprintFechaFin = '';
  editingSprintId: any = null;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadSprints();
    this.loadFilters();
    this.loadMetrics();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDay = new Date(2025, 0, 1);

    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  loadSprints(): void {
    this.metricsService.getSprints().subscribe({
      next: (response) => {
        this.sprintsDisponibles = response.data || [];
      },
      error: (err) => {
        console.error('Error loading sprints:', err);
      }
    });
  }

  loadFilters(): void {
    this.metricsService.getFilters(this.selectedGrupo, this.selectedCategoria).subscribe({
      next: (response) => {
        this.gruposDisponibles = response.data.grupos || [];
        this.categoriasDisponibles = response.data.categorias || [];
        this.serviciosDisponibles = response.data.servicios || [];
      },
      error: (err) => {
        console.error('Error loading filters:', err);
      }
    });
  }

  loadMetrics(): void {
    this.loading = true;
    this.error = '';

    this.metricsService.getDashboardSummary(this.startDate, this.endDate, this.selectedGrupo).subscribe({
      next: (response) => {
        const data = response.data;
        this.specialistsCount = data.totalEspecialistas || 0;
        this.productsCount = data.totalCasos || 0;
        this.servicesCount = data.totalServicios || 0;
        this.resolvedCount = data.totalResueltos || 0;
        this.resolvedPercentage = data.porcentajeResolucion || 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar métricas del dashboard';
        this.loading = false;
        console.error(err);
      }
    });

    this.loadSpecialistMetrics();
  }

  loadSpecialistMetrics(): void {
    this.metricsService.getMetricsBySpecialist(
      this.startDate,
      this.endDate,
      this.selectedGrupo,
      this.selectedCategoria,
      this.selectedServicio
    ).subscribe({
      next: (response) => {
        this.specialistMetrics = response.data || [];
      },
      error: (err) => {
        console.error('Error loading specialist metrics:', err);
      }
    });
  }

  loadProductMetrics(): void {
    this.metricsService.getMetricsByProduct(this.startDate, this.endDate).subscribe({
      next: (response) => {
        this.productMetrics = response.data || [];
      },
      error: (err) => {
        console.error('Error loading product metrics:', err);
      }
    });
  }

  loadServiceMetrics(): void {
    this.metricsService.getServiceMetrics(this.startDate, this.endDate).subscribe({
      next: (response) => {
        this.serviceMetrics = response.data || [];
      },
      error: (err) => {
        console.error('Error loading service metrics:', err);
      }
    });
  }

  loadTables(): void {
    this.metricsService.getAvailableTables().subscribe({
      next: (response) => {
        this.availableTables = response.data || [];
      },
      error: (err) => {
        console.error('Error loading tables:', err);
      }
    });
  }

  onSprintChange(): void {
    if (this.selectedSprint) {
      const sprint = this.sprintsDisponibles.find(s => s.id === parseInt(this.selectedSprint));
      if (sprint) {
        this.startDate = sprint.fechaInicio;
        this.endDate = sprint.fechaFin;
        this.loadMetrics();
      }
    } else {
      this.setDefaultDates();
      this.loadMetrics();
    }
  }

  onDateChange(): void {
    if (!this.selectedSprint) {
      this.loadMetrics();
    }
  }

  onGroupChange(): void {
    // Resetear categoría y servicio cuando cambia el grupo
    this.selectedCategoria = 'todos';
    this.selectedServicio = 'todos';

    // Recargar filtros en cascada
    this.loadFilters();

    // Actualizar métricas
    this.loadMetrics();
  }

  onCategoryChange(): void {
    // Resetear servicio cuando cambia la categoría
    this.selectedServicio = 'todos';

    // Recargar servicios basados en categoría
    this.loadFilters();

    // Actualizar métricas de especialistas
    this.loadSpecialistMetrics();
  }

  onServiceChange(): void {
    this.loadSpecialistMetrics();
  }

  clearFilters(): void {
    this.selectedSprint = '';
    this.selectedGrupo = 'todos';
    this.selectedCategoria = 'todos';
    this.selectedServicio = 'todos';
    this.setDefaultDates();
    this.loadFilters();
    this.loadMetrics();
  }

  removeFilter(type: string): void {
    if (type === 'grupo') {
      this.selectedGrupo = 'todos';
      this.selectedCategoria = 'todos';
      this.selectedServicio = 'todos';
      this.loadFilters();
      this.loadMetrics();
    } else if (type === 'categoria') {
      this.selectedCategoria = 'todos';
      this.selectedServicio = 'todos';
      this.loadFilters();
      this.loadSpecialistMetrics();
    } else if (type === 'servicio') {
      this.selectedServicio = 'todos';
      this.loadSpecialistMetrics();
    }
  }

  hasActiveFilters(): boolean {
    return this.selectedGrupo !== 'todos' ||
           this.selectedCategoria !== 'todos' ||
           this.selectedServicio !== 'todos';
  }

  // Métodos para gestión de sprints
  calculateDuration(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  saveSprint(): void {
    if (!this.newSprintNombre || !this.newSprintFechaInicio || !this.newSprintFechaFin) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (new Date(this.newSprintFechaInicio) >= new Date(this.newSprintFechaFin)) {
      alert('La fecha de inicio debe ser anterior a la fecha de fin');
      return;
    }

    const sprintData = {
      nombre: this.newSprintNombre,
      fechaInicio: this.newSprintFechaInicio,
      fechaFin: this.newSprintFechaFin
    };

    if (this.editingSprintId) {
      this.metricsService.updateSprint(this.editingSprintId, sprintData).subscribe({
        next: (response) => {
          alert('Sprint actualizado exitosamente');
          this.loadSprints();
          this.clearSprintForm();
        },
        error: (err) => {
          console.error('Error updating sprint:', err);
          alert('Error al actualizar sprint');
        }
      });
    } else {
      this.metricsService.createSprint(sprintData).subscribe({
        next: (response) => {
          alert('Sprint creado exitosamente');
          this.loadSprints();
          this.clearSprintForm();
        },
        error: (err) => {
          console.error('Error creating sprint:', err);
          alert('Error al crear sprint');
        }
      });
    }
  }

  editSprint(sprint: any): void {
    this.editingSprintId = sprint.id;
    this.newSprintNombre = sprint.nombre;
    this.newSprintFechaInicio = sprint.fechaInicio;
    this.newSprintFechaFin = sprint.fechaFin;
    this.activeMenu = 'dashboard';
  }

  cancelEditSprint(): void {
    this.clearSprintForm();
  }

  clearSprintForm(): void {
    this.newSprintNombre = '';
    this.newSprintFechaInicio = '';
    this.newSprintFechaFin = '';
    this.editingSprintId = null;
  }

  confirmDeleteSprint(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este sprint?')) {
      this.metricsService.deleteSprint(id).subscribe({
        next: (response) => {
          alert('Sprint eliminado exitosamente');
          this.loadSprints();

          if (this.selectedSprint === id.toString()) {
            this.selectedSprint = '';
            this.setDefaultDates();
          }
        },
        error: (err) => {
          console.error('Error deleting sprint:', err);
          alert('Error al eliminar sprint');
        }
      });
    }
  }
}

