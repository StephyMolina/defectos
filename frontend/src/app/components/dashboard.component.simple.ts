import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetricsService } from '../services/metrics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeMenu: string = 'dashboard';
  activeTab: string = 'specialists';
  activeSpecialistSubTab: string = 'summary';
  sidebarCollapsed: boolean = false;
  loading: boolean = false;
  error: string = '';

  // Filters
  selectedSprint: string = '';
  selectedGrupo: string = 'SOPORTE SIR';
  selectedCategoria: string = 'todos';
  selectedServicio: string = 'todos';
  selectedTipoCaso: string = 'todos';
  startDate: string = '';
  endDate: string = '';

  // Quick filters
  categoryFilters: { [key: string]: string } = {
    'SoloSIR': 'sistema integrado de restaurante',
    'soloE-commerce': 'E-commerce',
    'SoloHardware': 'Hardware',
    'SoloMaxPoint': 'ecosistema'
  };

  // Data arrays
  specialistMetrics: any[] = [];
  productMetrics: any[] = [];
  serviceMetrics: any[] = [];
  sprintsDisponibles: any[] = [];
  gruposDisponibles: string[] = [];
  categoriasDisponibles: string[] = [];
  serviciosDisponibles: string[] = [];
  tiposCasoDisponibles: string[] = [];
  availableTables: any[] = [];

  // Summary counts
  specialistsCount: number = 0;
  servicesCount: number = 0;
  productsCount: number = 0;
  resolvedCount: number = 0;
  resolvedPercentage: number = 0;

  // Period view
  specialistPeriodView: string = 'year';
  productViewMode: string = 'all';

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.loading = true;
    this.metricsService.getDashboardMetrics().subscribe({
      next: (data: any) => {
        this.specialistsCount = data.especialistas || 0;
        this.servicesCount = data.servicios || 0;
        this.productsCount = data.casos || 0;
        this.resolvedCount = data.resueltos || 0;
        this.resolvedPercentage = data.porcentaje || 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando métricas';
        this.loading = false;
      }
    });

    this.loadFilters();
  }

  loadFilters(): void {
    this.metricsService.getFilters().subscribe({
      next: (data: any) => {
        this.sprintsDisponibles = data.sprints || [];
        this.gruposDisponibles = data.grupos || [];
        this.categoriasDisponibles = data.categorias || [];
        this.serviciosDisponibles = data.servicios || [];
        this.tiposCasoDisponibles = data.tipos_caso || [];
      }
    });
  }

  loadSpecialistMetrics(): void {
    this.metricsService.getMetricsBySpecialist(this.selectedGrupo, this.selectedCategoria, this.selectedServicio).subscribe({
      next: (data: any) => {
        this.specialistMetrics = data || [];
      }
    });
  }

  loadProductMetrics(): void {
    this.metricsService.getMetricsByProduct(this.selectedGrupo, this.selectedCategoria, this.selectedServicio).subscribe({
      next: (data: any) => {
        this.productMetrics = data || [];
      }
    });
  }

  loadServiceMetrics(): void {
    this.metricsService.getMetricsByService(this.selectedGrupo, this.selectedCategoria, this.selectedServicio).subscribe({
      next: (data: any) => {
        this.serviceMetrics = data || [];
      }
    });
  }

  loadTables(): void {
    this.metricsService.getMetricsBySpecialist(this.selectedGrupo, this.selectedCategoria, this.selectedServicio).subscribe({
      next: (data: any) => {
        this.availableTables = data || [];
      }
    });
  }

  getDisplayedProductMetrics(): any[] {
    if (this.productViewMode === 'top10') {
      return this.productMetrics.slice(0, 10);
    }
    return this.productMetrics;
  }

  applyQuickCategoryFilter(filterKey: string): void {
    const searchString = this.categoryFilters[filterKey];
    if (searchString) {
      this.selectedCategoria = filterKey;
      this.loadMetrics();
    }
  }

  resetCategoryFilters(): void {
    this.selectedCategoria = 'todos';
    this.selectedServicio = 'todos';
    this.loadMetrics();
  }

  onSprintChange(): void {
    this.loadMetrics();
  }

  onGroupChange(): void {
    this.selectedCategoria = 'todos';
    this.selectedServicio = 'todos';
    this.loadMetrics();
  }

  onCategoryChange(): void {
    this.selectedServicio = 'todos';
    this.loadMetrics();
  }

  onServiceChange(): void {
    this.loadMetrics();
  }

  onTipoCasoChange(): void {
    this.loadMetrics();
  }

  onDateChange(): void {
    this.loadMetrics();
  }

  clearFilters(): void {
    this.selectedSprint = '';
    this.selectedGrupo = 'SOPORTE SIR';
    this.selectedCategoria = 'todos';
    this.selectedServicio = 'todos';
    this.selectedTipoCaso = 'todos';
    this.startDate = '';
    this.endDate = '';
    this.loadMetrics();
  }

  hasActiveFilters(): boolean {
    return this.selectedGrupo !== 'todos' || 
           this.selectedCategoria !== 'todos' || 
           this.selectedServicio !== 'todos' || 
           this.selectedTipoCaso !== 'todos';
  }

  removeFilter(filterType: string): void {
    switch(filterType) {
      case 'grupo':
        this.selectedGrupo = 'todos';
        break;
      case 'categoria':
        this.selectedCategoria = 'todos';
        break;
      case 'servicio':
        this.selectedServicio = 'todos';
        break;
      case 'tipoCaso':
        this.selectedTipoCaso = 'todos';
        break;
    }
    this.loadMetrics();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  calculateDuration(start: any, end: any): number {
    return 0;
  }
}
