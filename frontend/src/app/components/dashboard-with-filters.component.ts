import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetricsService } from '../services/metrics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>📊 Dashboard de Métricas ARANDA</h1>
        <p>Sistema de Gestión de Servicios - Análisis de Especialistas y Productos</p>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <label>Fecha Inicio:</label>
          <input type="date" [(ngModel)]="startDate" (change)="loadMetrics()" />
        </div>
        <div class="filter-group">
          <label>Fecha Fin:</label>
          <input type="date" [(ngModel)]="endDate" (change)="loadMetrics()" />
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
          <select [(ngModel)]="selectedCategoria" (change)="onCategoryChange()" class="filter-select">
            <option value="todos">Todas las categorías</option>
            <option *ngFor="let cat of categoriasDisponibles.slice(0, 50)" [value]="cat">{{ cat }}</option>
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
          <p class="metric-label">Total Activos</p>
        </div>

        <div class="metric-card">
          <div class="card-icon">📦</div>
          <h3>Productos</h3>
          <p class="metric-value">{{ productsCount }}</p>
          <p class="metric-label">En Gestión</p>
        </div>

        <div class="metric-card">
          <div class="card-icon">🎫</div>
          <h3>Servicios</h3>
          <p class="metric-value">{{ servicesCount }}</p>
          <p class="metric-label">Atendidos</p>
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

        <!-- Tab: Productos (igual que antes) -->
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

        <!-- Resto de tabs igual que antes... -->
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
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 30px;
      padding: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

    .filter-select {
      cursor: pointer;
      background: white;
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
      background: #667eea;
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
      color: #667eea;
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
      color: #667eea;
      background: #f5f5f5;
    }

    .tab.active {
      color: #667eea;
      border-bottom-color: #667eea;
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
      color: #667eea;
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
      border-top: 4px solid #667eea;
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
  selectedGrupo = 'todos';
  selectedCategoria = 'todos';
  gruposDisponibles: string[] = [];
  categoriasDisponibles: string[] = [];

  specialistsCount = 0;
  productsCount = 0;
  servicesCount = 0;
  resolvedCount = 0;
  resolvedPercentage = 0;

  activeTab = 'specialists';

  specialistMetrics: any[] = [];
  productMetrics: any[] = [];
  serviceMetrics: any[] = [];
  availableTables: any[] = [];

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.setDefaultDates();
    this.loadFilters();
    this.loadMetrics();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDay = new Date(2025, 0, 1); // 1 de enero 2025

    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  loadFilters(): void {
    this.metricsService.getFilters().subscribe({
      next: (response) => {
        this.gruposDisponibles = response.data.grupos || [];
        this.categoriasDisponibles = response.data.categorias || [];
      },
      error: (err) => {
        console.error('Error loading filters:', err);
      }
    });
  }

  loadMetrics(): void {
    this.loading = true;
    this.error = '';

    this.metricsService.getDashboardSummary().subscribe({
      next: (response) => {
        const data = response.data;
        this.specialistsCount = data.totalEspecialistas || 0;
        this.productsCount = data.totalServicios || 0;
        this.servicesCount = data.totalCasos || 0;
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
      this.selectedCategoria
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

  onGroupChange(): void {
    this.loadSpecialistMetrics();
  }

  onCategoryChange(): void {
    this.loadSpecialistMetrics();
  }

  clearFilters(): void {
    this.selectedGrupo = 'todos';
    this.selectedCategoria = 'todos';
    this.loadSpecialistMetrics();
  }

  removeFilter(type: string): void {
    if (type === 'grupo') {
      this.selectedGrupo = 'todos';
    } else if (type === 'categoria') {
      this.selectedCategoria = 'todos';
    }
    this.loadSpecialistMetrics();
  }

  hasActiveFilters(): boolean {
    return this.selectedGrupo !== 'todos' || this.selectedCategoria !== 'todos';
  }
}
