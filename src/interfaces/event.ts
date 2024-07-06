import { User } from '@prisma/client';

export interface Event {
  eventDate: Date;
  updatedAt: Date;
  createdAt: Date;
  participants: JSON;
  owner: User;
  latitude: number;
  longitude: number;
  address: string;
  branch: string;
  description: string;
}
