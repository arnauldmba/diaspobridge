export interface MatchDto {
  id: number;
  tripId: number;
  requesterId: number;
  transporterId: number;
  originCity?: string;
  destCity?: string;
  status?: string;
  proposedBy?: string;
  lastMessagePreview?: string;
  updatedAt?: string;

  otherUserId?: number;
  otherFirstName?: string; 
  otherLastName?: string; 
  avatarUrl?: string; 
}

export interface MessageDto {
  id: number;
  matchId: number;
  senderId: number;
  body: string;
  sentAt: string;
}