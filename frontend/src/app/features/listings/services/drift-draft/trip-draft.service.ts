import { Injectable } from '@angular/core';
import { CreateTripRequest } from '../../models/create-trip-request';

@Injectable({
  providedIn: 'root'
})
export class TripDraftService {

  private readonly storageKey = 'guestTripDraft';

  save(draft: CreateTripRequest): void {
    sessionStorage.setItem(
      this.storageKey,
      JSON.stringify(draft)
    );
  }

  get(): CreateTripRequest | null {
    const storedDraft = sessionStorage.getItem(this.storageKey);

    if (!storedDraft) {
      return null;
    }

    try {
      return JSON.parse(storedDraft) as CreateTripRequest;
    } catch {
      this.clear();
      return null;
    }
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  exists(): boolean {
    return sessionStorage.getItem(this.storageKey) !== null;
  }
}