import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { BaseCity } from '../../models/cities-model';
import { citySearchKey, normalizeCityQuery } from '../../data/cities-de';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-city-autocomplete-component',
  standalone: true,
  templateUrl: './city-autocomplete-component.html',
  styleUrl: './city-autocomplete-component.css',
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    TranslatePipe
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CityAutocompleteComponent),
      multi: true,
    },
  ],
})
export class CityAutocompleteComponent implements ControlValueAccessor, OnChanges, OnInit {

  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() icon: string | null = '';
  @Output() backClick = new EventEmitter<void>();

  @Input() showSearchIcon = false;
  @Output() searchClick = new EventEmitter<void>();


  @ViewChild(MatAutocompleteTrigger) autoTrigger!: MatAutocompleteTrigger;

  @Input() cities: BaseCity[] = [];
  @Input() required = false;
  @Input() minlength = 2;

  value = '';
  disabled = false;

  filteredCities$!: Observable<BaseCity[]>;

  private indexed: { city: BaseCity; key: string }[] = [];

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private router: Router){}

  ngOnInit(): void {
    this.rebuildIndex();
    this.refreshFiltered(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cities']) {
      this.indexed = (this.cities ?? []).map(c => ({ city: c, key: citySearchKey(c) }));
      this.refreshFiltered(this.value);
    }
  }

  writeValue(v: string | null): void {
    this.value = v ?? '';
    this.refreshFiltered(this.value);
  }

  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  private rebuildIndex(): void {
    this.indexed = (this.cities ?? []).map(c => ({ 
      city: c, key: citySearchKey(c) 
    }));
  }

  // appelé à chaque frappe
  onInput(v: string): void {
    this.value = v;
    this.onChange(v);
    this.refreshFiltered(v);
  }

  onBlur(): void {
    this.onTouched();

    const raw = (this.value ?? '').trim();
    if (!raw) {
      this.value = '';
      this.onChange('');
      return;
    }

    // resolve exact name/alias si possible
    const q = normalizeCityQuery(raw);
    const found = (this.cities ?? []).find(c => {
      const normalizedName = normalizeCityQuery(c.name);
      const normalizedAliases = (c.aliases || []).map(a => normalizeCityQuery(a));
      return normalizedName === q || normalizedAliases.includes(q);
    });

    if (found) {
      this.value = found.name;
      this.onChange(this.value);
    }
  }

  // option cliquée dans la liste
  onSelected(cityName: string): void {
    this.value = cityName;
    this.onChange(this.value);
    this.onTouched();
    this.refreshFiltered(this.value);
    this.autoTrigger?.closePanel();
    this.onSearch();
  }

  private refreshFiltered(input: string): void {
    const q = normalizeCityQuery(input || '');

    this.filteredCities$ = of(q).pipe(
      debounceTime(120),
      distinctUntilChanged(),
      map(val => {
        if (!val || val.length < this.minlength) return [];

        return this.indexed
          .filter(x => x.key.includes(val))
          .map(x => x.city)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20);
      })
    );
  }

  onEnter(): void {
    const raw = (this.value ?? '').trim();
    if (!raw) return;

    const q = normalizeCityQuery(raw);

    const found = this.indexed.find(x => x.key.startsWith(q))
  || this.indexed.find(x => x.key.includes(q));

    if (found) {
      this.value = found.city.name;
      this.onChange(this.value);
    }

    // 👉 fermer le dropdown
    this.autoTrigger?.closePanel();

    // 🚀 lancer la recherche
    this.onSearch();
  }

  onClearClick(event: MouseEvent): void {
    event.stopPropagation(); // 🔥 empêche le focus input
    this.clear();
  }

  onSearchClick(event: MouseEvent): void {
    event.stopPropagation(); // 🔥 empêche le focus input
    this.autoTrigger?.closePanel();
    this.onSearch();
  }

  onBackClick(event: MouseEvent): void{
    event.stopPropagation(); // 🔥 empêche le focus input
    this.autoTrigger?.closePanel();
    this.backClick.emit();
  }

  clear(): void {
    this.value = '';
    this.onChange('');
    /*this.router.navigate(['/listings'], {
      queryParams: {
        pickupCity: null,
        dest: null,
        fromDate: null,
        toDate: null,
        page: 0,
        size: 12
      }
    });*/
    this.refreshFiltered('');
  }
  
  onSearch(): void {
    this.searchClick.emit();
  }
}
