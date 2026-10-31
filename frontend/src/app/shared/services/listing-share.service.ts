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

    // Description rédigée par le voyageur
    const description = (trip.note ?? '')
      .replace(/\s+/g, ' ')
      .trim();

    const shortDescription =
      description.length > 160
        ? description.slice(0, 157).trimEnd() + '...'
        : description;

    const shareData = {
      title: `${trip.originCity} → ${trip.destCity} | MbokoGO`,

      text: [
        `✈️ ${trip.originCity} → ${trip.destCity}`,
        shortDescription
          ? `💬 ${shortDescription}`
          : 'Découvrez ce voyage sur MbokoGO !'
      ].join('\n\n'),

      url
    };

    // Partage natif sur les appareils compatibles
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return 'shared';
      } catch (error) {
        // L'utilisateur a fermé le menu de partage
        if (error instanceof DOMException &&
            error.name === 'AbortError') {
          return 'cancelled';
        }
      }
    }

    // Sinon, copier le lien
    await navigator.clipboard.writeText(url);
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