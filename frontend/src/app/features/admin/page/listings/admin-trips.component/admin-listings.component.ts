import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin-service';
import { TransporterTrip } from '../../../../../model/transporterTrip.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-listings.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-listings.component.html',
  styleUrl: './admin-listings.component.css',
})
export class AdminListingsComponent implements OnInit {
  private adminService = inject(AdminService);

  listings: TransporterTrip[] = [];

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.adminService.getAllListings().subscribe({
      next: (data) => {
        this.listings = data;
      },
      error: (err) => {
        console.error('Error loading listings', err);
      }
    });
  }

  onDelete(listingId: number | undefined): void {
    this.adminService.deleteUser(listingId!).subscribe({
      next: () => this.loadListings(),
      error: (err) => console.error('Error deleting listing', err)
    });
  }

  onHide(listingId: number | undefined): void {
    this.adminService.hideListing(listingId!).subscribe({
      next: () => this.loadListings(),
      error: (err) => console.error('Error hiding listing', err)
    });
  }
}
