// config.ts
try {
  process.loadEnvFile();
} catch (error) {
  console.warn(
    "Warning: No local .env file found, using system environment variables.",
  );
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(
      `[Config Error]: Required environment variable '${key}' is not defined.`,
    );
  }
  return value;
}

export interface Config {
  host: string;
  port: number;
  aiHost: string;
  corsOrigin: string;
}

const config: Config = {
  host: getEnv("HOST"),
  port: Number(getEnv("PORT")),
  aiHost: getEnv("AI_HOST"),
  corsOrigin: getEnv("CORS_ORIGIN")
} as const;

Object.freeze(config);

export default config;
