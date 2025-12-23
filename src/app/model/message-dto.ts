export interface MessageDto {
  id: number;
  senderId: number;
  body: string;
  sentAt: string; // ISO
}