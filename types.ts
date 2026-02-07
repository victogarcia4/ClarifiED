export type AudienceType = 'Students' | 'Staff' | 'Faculty';
export type StyleType = 'Regular' | 'Engaging' | 'Social Media';
export type ToneType = 'Formal' | 'Friendly';

export interface RewriterOptions {
  audience: AudienceType;
  style: StyleType;
  tone: ToneType;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}