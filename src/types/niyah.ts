export interface NiyahMetadata {
  intent: string;
  dialect: string;
  confidence: number;
  isArabic: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'niyah';
  content: string;
  timestamp: number;
  metadata?: NiyahMetadata;
}
