export interface DashboardSummary {
  totalEspecialistas: number;
  totalProductos: number;
  totalServicios: number;
  totalResueltos: number;
  periodo: {
    inicio: string;
    fin: string;
  };
}

export interface SpecialistMetric {
  id?: number;
  nombre: string;
  email?: string;
  totalServicios: number;
  resueltos: number;
  pendientes: number;
  tiempoPromedio?: number;
  eficiencia?: number;
}

export interface ProductMetric {
  id?: number;
  nombre: string;
  categoria?: string;
  totalServicios: number;
  activos: number;
  cerrados: number;
  prioridad?: string;
}

export interface ServiceMetric {
  id?: number;
  tipo: string;
  estado: string;
  cantidad: number;
  porcentaje?: number;
  tendencia?: 'up' | 'down' | 'stable';
}

export interface TableInfo {
  TABLE_SCHEMA: string;
  TABLE_NAME: string;
  TABLE_TYPE: string;
}

export interface ColumnInfo {
  COLUMN_NAME: string;
  DATA_TYPE: string;
  CHARACTER_MAXIMUM_LENGTH: number | null;
  IS_NULLABLE: string;
  COLUMN_DEFAULT: string | null;
}
