import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Gestión de Usuarios</h1>

      <div class="form-container">
        <h2>{{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
        <form (ngSubmit)="saveUser()">
          <div class="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              [(ngModel)]="currentUser.nombre"
              name="nombre"
              required
              placeholder="Ingrese el nombre"
            />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input
              type="email"
              [(ngModel)]="currentUser.email"
              name="email"
              required
              placeholder="Ingrese el email"
            />
          </div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary">
              {{ editingUser ? 'Actualizar' : 'Crear' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="cancelEdit()" *ngIf="editingUser">
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div class="table-container">
        <h2>Lista de Usuarios</h2>
        <div *ngIf="loading" class="loading">Cargando...</div>
        <div *ngIf="error" class="error">{{ error }}</div>

        <table *ngIf="!loading">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.id }}</td>
              <td>{{ user.nombre }}</td>
              <td>{{ user.email }}</td>
              <td>
                <button class="btn btn-edit" (click)="editUser(user)">Editar</button>
                <button class="btn btn-delete" (click)="deleteUser(user.id!)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 30px;
    }

    h2 {
      color: #555;
      margin-bottom: 20px;
    }

    .form-container {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .button-group {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .btn-edit {
      background-color: #28a745;
      color: white;
      margin-right: 5px;
    }

    .btn-edit:hover {
      background-color: #218838;
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;
    }

    .btn-delete:hover {
      background-color: #c82333;
    }

    .table-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f8f9fa;
      font-weight: bold;
      color: #333;
    }

    tr:hover {
      background-color: #f5f5f5;
    }

    .loading, .error {
      text-align: center;
      padding: 20px;
      font-size: 16px;
    }

    .error {
      color: #dc3545;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  currentUser: User = { nombre: '', email: '' };
  editingUser: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
        console.error(err);
      }
    });
  }

  saveUser(): void {
    if (this.editingUser && this.currentUser.id) {
      this.userService.updateUser(this.currentUser.id, this.currentUser).subscribe({
        next: (response) => {
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al actualizar usuario';
          console.error(err);
        }
      });
    } else {
      this.userService.createUser(this.currentUser).subscribe({
        next: (response) => {
          this.loadUsers();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al crear usuario';
          console.error(err);
        }
      });
    }
  }

  editUser(user: User): void {
    this.currentUser = { ...user };
    this.editingUser = true;
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: (response) => {
          this.loadUsers();
        },
        error: (err) => {
          this.error = 'Error al eliminar usuario';
          console.error(err);
        }
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentUser = { nombre: '', email: '' };
    this.editingUser = false;
  }
}
