import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '../../../../../model/users.model';
import { AdminService } from '../../../services/admin-service';

@Component({
  selector: 'app-admin-users.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css',
})
export class AdminUsersComponent {

private adminService = inject(AdminService);

  users: User[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        console.log('User: ', data);
        this.users = data;
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  onActif(userId: number) {
    this.adminService.activkUser(userId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error blocking user', err)
    });
  }

  onDeactif(userId: number) {
    this.adminService.deactivkUser(userId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error blocking user', err)
    });
  }

  deleteUser(userId: number) {
    this.adminService.deleteUser(userId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error unblocking user', err)
    });
  }

  restoreUser(userId: number) {
    this.adminService.restoreUser(userId).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error unblocking user', err)
    });
  }

  getStatus(user: User): string {
    if (user.deletedAt) return 'Deleted';
    if (user.isBlocked) return 'Blocked';
    if (user.isActive) return 'Active';
    return 'Inactive';
  }
}
