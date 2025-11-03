import { User } from "./users.model";

export interface TransporterTrip {
  id?: number;
  transporter: User;             // Relation ManyToOne (backend)
  originCity: string;
  originCountry: string;
  destCity: string;
  destCountry: string;
  departDate: string;            // LocalDate → string (format ISO, ex: "2025-11-01")
  maxWeightKg?: number;          // BigDecimal → number
  acceptedTypes?: string;        // CSV ex: "DOCUMENT,PHONE,LAPTOP"
  isActive: boolean;
  note?: string;
  createdAt?: string;            // Instant → string
  updatedAt?: string;            // Instant → string
}