export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  branches: JSON;
  sex: string;
  profile_photo: string;
  photos: JSON;
  is_validated: boolean;
  is_premium: boolean;
}
