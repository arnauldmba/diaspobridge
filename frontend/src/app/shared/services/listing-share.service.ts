import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TransporterTrip } from '../../model/transporterTrip.model';

export type ShareResult = 'shared' | 'copied' | 'cancelled';

@Injectable({
  providedIn: 'root'
})
export class ListingShareService {

  // Générer le lien d'une annonce
  getShareUrl(trip: TransporterTrip): string {
    if (trip.id == null) {
      throw new Error('Annonce sans identifiant');
    }

    return `${environment.siteUrl}/listing-details/${trip.id}`;
  }

  // Partager une annonce
  async shareTrip(trip: TransporterTrip): Promise<ShareResult> {

    const url = this.getShareUrl(trip);

    const description = (trip.note ?? '')
      .replace(/\s+/g, ' ')
      .trim();

    const shortDescription =
      description.length > 160
        ? description.slice(0, 157).trimEnd() + '...'
        : description;

    // Informations du voyage
    const message = [
      `✈️ Voyage disponible sur MbokoGO !`,
      `📍 ${trip.originCity} → ${trip.destCity}`,

      trip.departDate
        ? `📅 Départ : ${trip.departDate}`
        : null,

      trip.maxWeightKg != null
        ? `📦 Poids disponible : ${trip.maxWeightKg} kg`
        : null,

      trip.pricePerKg != null
        ? `💰 Prix : ${trip.pricePerKg} €/kg`
        : null,

      shortDescription
        ? `💬 ${shortDescription}`
        : null

    ].filter((line): line is string => line !== null)
      .join('\n');

    // Partage natif
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip.originCity} → ${trip.destCity} | MbokoGO`,
          text: message,
          url: url
        });

        return 'shared';

      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return 'cancelled';
        }
      }
    }

    // Fallback : copier le message et le lien
    await navigator.clipboard.writeText(`${message}\n\n${url}`);

    return 'copied';
  }

  // Partage direct via WhatsApp
  getWhatsAppUrl(trip: TransporterTrip): string {

    const url = this.getShareUrl(trip);

    const message =
      `✈️ Voyage disponible sur MbokoGO !\n` +
      `📍 ${trip.originCity} → ${trip.destCity}\n\n` +
      `Consultez l'annonce : ${url}`;

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
}