export interface Incident {
  id: string;
  description: string;
  imageUrl: string;
  longitude: number;
  latitude: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
