import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { BaseCity } from '../model/cities-base';
import { CITIES_DE, citySearchKey, normalizeCityQuery } from '../model/cities-de';
import { ALL_CITIES } from '../model/cities-all';

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
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CityAutocompleteComponent),
      multi: true,
    },
  ],
})
export class CityAutocompleteComponent implements ControlValueAccessor, OnChanges {

  @Input() label = 'Ville';
  @Input() placeholder = 'Ex : Douala…';
  @Input() hint = '';
  @Input() icon: string | null = 'location_on';

  // ✅ liste de villes injectée
  @Input() cities: BaseCity[] = ALL_CITIES;

  // ✅ validations template-driven
  @Input() required = false;
  @Input() minlength = 2;

  // Valeur du control (string)
  value = '';
  disabled = false;

  // Liste filtrée
  filteredCities$!: Observable<BaseCity[]>;

  private indexed: { city: BaseCity; key: string }[] = [];

  // --- CVA ---
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string | null): void {
    this.value = v ?? '';
    this.refreshFiltered(this.value);
  }

  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cities']) {
      this.indexed = (this.cities ?? []).map(c => ({ city: c, key: citySearchKey(c) }));
      this.refreshFiltered(this.value);
    }
  }

  ngOnInit(): void {
    this.rebuildIndex();
    this.refreshFiltered(this.value);
  }

  private rebuildIndex(): void {
    this.indexed = (this.cities ?? []).map(c => ({ city: c, key: citySearchKey(c) }));
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
  onSelected(city: BaseCity): void {
    this.value = city.name;
    this.onChange(this.value);
    this.onTouched();
    this.refreshFiltered(this.value);
  }

  private refreshFiltered(input: string): void {
    const q = normalizeCityQuery(input || '');
    const base = (this.cities ?? []);

    // petit debounce "light" via rxjs (simple)
    this.filteredCities$ = of(q).pipe(
      debounceTime(120),
      distinctUntilChanged(),
      map(val => {
        // ✅ Ne rien afficher tant que l’utilisateur ne tape pas assez
        if (!val || val.length < this.minlength) return [];

        return this.indexed
          .filter(x => x.key.includes(val))
          .map(x => x.city)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20);
      })
    );
  }
}
