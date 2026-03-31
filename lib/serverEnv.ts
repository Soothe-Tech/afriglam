const isPlaceholder = (value: string | undefined) => {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return (
    normalized.length === 0 ||
    normalized.includes('your_') ||
    normalized.includes('placeholder') ||
    normalized.includes('example') ||
    normalized.startsWith('sk_test_your') ||
    normalized.startsWith('whsec_your')
  );
};

const readEnv = (name: string) => {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
};

export const getRequiredServerEnv = (name: string) => {
  const value = readEnv(name);
  if (isPlaceholder(value)) {
    return null;
  }
  return value;
};

export const hasServerEnv = (name: string) => getRequiredServerEnv(name) !== null;

export const getAppOrigin = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return getRequiredServerEnv('APP_ORIGIN') ?? 'http://localhost:5173';
};
