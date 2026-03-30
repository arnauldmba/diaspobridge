import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-listing-skeleton',
  imports: [],
  templateUrl: './listing-skeleton.html',
  styleUrl: './listing-skeleton.css',
})
export class ListingSkeleton {
  @Input() count = 6;

  skeletonItems = Array.from({ length: this.count }, (_, i) => i);
}
