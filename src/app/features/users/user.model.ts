export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'officer' | 'viewer';
  organizationId: string;
  createdAt?: Date;
}