import { TransporterTrip } from "../model/transporterTrip.model";
import { USERS_LIST } from "./users.mock";

export const TRANSPORTER_TRIPS: TransporterTrip[] = [
  {
    id: 101,
    transporter: USERS_LIST[0],
    originCity: 'Düsseldorf',
    originCountry: 'Germany',
    destCity: 'Douala',
    destCountry: 'Cameroon',
    departDate: '2025-11-05',
    maxWeightKg: 25.5,
    acceptedTypes: 'DOCUMENT,PHONE,LAPTOP',
    isActive: true,
    note: 'Peut prendre de petits colis électroniques',
    createdAt: '2025-10-20T10:15:00Z',
    updatedAt: '2025-10-25T12:30:00Z'
  },
  {
    id: 102,
    transporter: USERS_LIST[1],
    originCity: 'Paris',
    originCountry: 'France',
    destCity: 'Yaoundé',
    destCountry: 'Cameroon',
    departDate: '2025-11-12',
    maxWeightKg: 30,
    acceptedTypes: 'CLOTHES,FOOD,SHOES',
    isActive: true,
    note: 'Pas d’objets électroniques, seulement vêtements et nourriture',
    createdAt: '2025-10-22T09:00:00Z',
    updatedAt: '2025-10-26T09:00:00Z'
  },
  {
    id: 103,
    transporter: USERS_LIST[0],
    originCity: 'Bruxelles',
    originCountry: 'Belgium',
    destCity: 'Abidjan',
    destCountry: 'Côte d’Ivoire',
    departDate: '2025-11-18',
    maxWeightKg: 20,
    acceptedTypes: 'DOCUMENT,PHONE',
    isActive: false,
    note: 'Voyage complet — plus de place disponible',
    createdAt: '2025-10-10T08:00:00Z',
    updatedAt: '2025-10-24T11:00:00Z'
  }
];