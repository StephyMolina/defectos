import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private apiUrl = `${environment.apiUrl}/metrics`;

  constructor(private http: HttpClient) {}

  getDashboardSummary(startDate?: string, endDate?: string, grupo?: string, tipoCaso?: string): Observable<any> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (grupo && grupo !== 'todos') params.grupo = grupo;
    if (tipoCaso && tipoCaso !== 'todos') params.tipoCaso = tipoCaso;
    return this.http.get(`${this.apiUrl}/dashboard`, { params });
  }

  getMetricsBySpecialist(startDate?: string, endDate?: string, grupo?: string, categoria?: string, servicio?: string, tipoCaso?: string): Observable<any> {
    let url = `${this.apiUrl}/specialists`;
    const params: any = {};

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (grupo && grupo !== 'todos') params.grupo = grupo;
    if (categoria && categoria !== 'todos') params.categoria = categoria;
    if (servicio && servicio !== 'todos') params.servicio = servicio;
    if (tipoCaso && tipoCaso !== 'todos') params.tipoCaso = tipoCaso;

    return this.http.get(url, { params });
  }

  getFilters(grupo?: string, categoria?: string): Observable<any> {
    const params: any = {};
    if (grupo && grupo !== 'todos') params.grupo = grupo;
    if (categoria && categoria !== 'todos') params.categoria = categoria;
    return this.http.get(`${this.apiUrl}/filters`, { params });
  }

  getMetricsByProduct(startDate?: string, endDate?: string, grupo?: string, categoria?: string, tipoCaso?: string): Observable<any> {
    let url = `${this.apiUrl}/products`;
    const params: any = {};

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (grupo && grupo !== 'todos') params.grupo = grupo;
    if (categoria && categoria !== 'todos') params.categoria = categoria;
    if (tipoCaso && tipoCaso !== 'todos') params.tipoCaso = tipoCaso;

    return this.http.get(url, { params });
  }

  getServiceMetrics(startDate?: string, endDate?: string): Observable<any> {
    let url = `${this.apiUrl}/services`;
    const params: any = {};

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get(url, { params });
  }

  getAvailableTables(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tables`);
  }

  getTableStructure(tableName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tables/${tableName}`);
  }

  // Sprint methods
  getSprints(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sprints`);
  }

  getSprintById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/sprints/${id}`);
  }

  createSprint(sprint: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sprints`, sprint);
  }

  updateSprint(id: number, sprint: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/sprints/${id}`, sprint);
  }

  deleteSprint(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/sprints/${id}`);
  }

  // Sprint evolution for management information
  getSprintEvolution(grupo?: string, tipoCaso?: string, sprintId?: string): Observable<any> {
    const params: any = {};
    if (grupo && grupo !== 'todos') params.grupo = grupo;
    if (tipoCaso && tipoCaso !== 'todos') params.tipoCaso = tipoCaso;
    if (sprintId) params.sprintId = sprintId;
    return this.http.get(`${this.apiUrl}/sprint-evolution`, { params });
  }

  // Sprint comparative (Incidentes vs Requerimientos)
  getSprintComparative(grupo?: string): Observable<any> {
    const params: any = {};
    if (grupo && grupo !== 'todos') params.grupo = grupo;
    return this.http.get(`${this.apiUrl}/sprint-comparative`, { params });
  }

  // Open/pending cases
  getOpenCases(startDate?: string, endDate?: string, grupo?: string, categoria?: string, servicio?: string, tipoCaso?: string): Observable<any> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (grupo && grupo !== 'todos') params.grupo = grupo;
    if (categoria && categoria !== 'todos') params.categoria = categoria;
    if (servicio && servicio !== 'todos') params.servicio = servicio;
    if (tipoCaso && tipoCaso !== 'todos') params.tipoCaso = tipoCaso;
    return this.http.get(`${this.apiUrl}/open-cases`, { params });
  }

  // Closed cases
  getClosedCases(startDate?: string, endDate?: string, grupo?: string, categoria?: string, servicio?: string, tipoCaso?: string): Observable<any> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (grupo && grupo !== 'todos') params.grupo = grupo;
    if (categoria && categoria !== 'todos') params.categoria = categoria;
    if (servicio && servicio !== 'todos') params.servicio = servicio;
    if (tipoCaso && tipoCaso !== 'todos') params.tipoCaso = tipoCaso;
    return this.http.get(`${this.apiUrl}/closed-cases`, { params });
  }
}
