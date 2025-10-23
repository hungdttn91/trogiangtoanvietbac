
export interface Message {
  id: string;
  sender: 'user' | 'robot';
  text: string;
  imageUrl?: string;
}
