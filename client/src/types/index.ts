export interface HealthResponse {
  status: "ok";
  timestamp: string;
  uptime: number;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
