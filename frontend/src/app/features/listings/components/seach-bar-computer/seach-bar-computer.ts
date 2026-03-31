import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import { MatFormFieldModule, MatHint } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CityAutocompleteComponent } from '../../../../shared/components/city-autocomplete-component/city-autocomplete-component';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { BaseCity } from '../../../../shared/models/cities-model';
import { CityDataService } from '../../../../shared/services/city-data.services';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-seach-bar-computer',
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    CityAutocompleteComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
    TranslatePipe
],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './seach-bar-computer.html',
  styleUrl: './seach-bar-computer.css',
})
export class SeachBarComputer {
  @Output() search = new EventEmitter<{
    destCity: string | null;
    fromDate: Date | null;
    toDate: Date | null;
  }>();

  destCity: string | null = null;
  fromDate: Date | null = null;
  toDate: Date | null = null;

  cities: BaseCity[] = []; // je recupere la liste de ville static

  constructor(private cityDataService: CityDataService) {}

  ngOnInit(): void {
    this.cities = this.cityDataService.getAllCities();
  }

  get canSearch(): boolean {
    const hasCity = !!this.destCity?.trim();
    const hasBothDates = !!this.fromDate && !!this.toDate;
    const hasOnlyOneDate = (!!this.fromDate && !this.toDate) || (!this.fromDate && !!this.toDate);

    if (hasOnlyOneDate) {
      return false;
    }

    return hasCity || hasBothDates;
  }

  onSearch(): void {
    if (!this.canSearch) return;

    this.search.emit({
      destCity: this.destCity?.trim() || null,
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }
}
