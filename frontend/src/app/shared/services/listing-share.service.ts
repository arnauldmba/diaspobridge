import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TransporterTrip } from '../../model/transporterTrip.model';

export type ShareResult = 'shared' | 'copied' | 'cancelled';

@Injectable({
  providedIn: 'root'
})
export class ListingShareService {

  /**
   * Générer l'URL publique d'une annonce
   */
  getShareUrl(trip: TransporterTrip): string {

    if (trip.id == null) {
      throw new Error('Annonce sans identifiant');
    }

    const baseUrl = environment.siteUrl.replace(/\/+$/, '');

    return `${baseUrl}/listing-details/${trip.id}`;
  }

  /**
   * Construire le message de partage personnalisé
   */
  private buildShareMessage(
    trip: TransporterTrip,
    includeUrl: boolean = true
  ): string {

    const description = (trip.note ?? '')
      .replace(/\s+/g, ' ')
      .trim();

    const shortDescription =
      description.length > 160
        ? description.slice(0, 157).trimEnd() + '...'
        : description;

    const message = [
      '✈️ Voyage disponible sur MbokoGO !',

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
        ? `💬 Message du voyageur : ${shortDescription}`
        : null

    ].filter((line): line is string => line !== null)
      .join('\n');

    if (!includeUrl) {
      return message;
    }

    return `${message}\n\n🔗 Consultez l'annonce :\n${this.getShareUrl(trip)}`;
  }

  /**
   * Partage natif
   * iPhone, Android, Mac et autres appareils compatibles
   */
  async shareTrip(trip: TransporterTrip): Promise<ShareResult> {

    const url = this.getShareUrl(trip);
    const message = this.buildShareMessage(trip, false);

    if (navigator.share) {

      try {
        await navigator.share({
          title: `${trip.originCity} → ${trip.destCity} | MbokoGO`,
          text: message,
          url
        });

        return 'shared';

      } catch (error) {

        // L'utilisateur a annulé le partage
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return 'cancelled';
        }

        console.warn('Partage natif indisponible :', error);
      }
    }

    // Fallback : copier le message complet
    await navigator.clipboard.writeText(
      this.buildShareMessage(trip)
    );

    return 'copied';
  }

  /**
   * Partage direct via WhatsApp
   * Message personnalisé avec toutes les informations
   */
  getWhatsAppUrl(trip: TransporterTrip): string {

    const message = this.buildShareMessage(trip);

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  /**
   * Copier uniquement le lien de l'annonce
   */
  async copyTripLink(trip: TransporterTrip): Promise<void> {

    const url = this.getShareUrl(trip);

    await navigator.clipboard.writeText(url);
  }
}