import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin-service';
import { AdminDashboardStats } from '../models/admin-dashboard-stats.model';

@Component({
  selector: 'app-admin-dashbord.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashbord.component.html',
  styleUrl: './admin-dashbord.component.css',
})
export class AdminDashbordComponent implements OnInit{

  private adminService = inject(AdminService);

  stats: AdminDashboardStats | null = null;

  ngOnInit(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error loading dashboard stats', err);
      }
    });
  }


}
