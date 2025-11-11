export type configTypes = {
  SERVER_PORT: number;
  SERVER_HOST: string;
  DB_TYPE: string;
  DB_USER: string;
  DB_SCHEMA: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_HOST: string;
  LOG_LEVEL?: string;
  SESSION_TIMEOUT?: number;
  API_TIMEOUT?: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string | number;
  REFRESH_JWT_EXPIRES_IN?: string;
  JWT_TOKEN_AUDIENCE?: string;
  JWT_TOKEN_ISSUER?: string;
};
