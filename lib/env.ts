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

const getString = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const isProductionBuild = () => import.meta.env.PROD;

export const getClientEnvIssues = () => {
  const issues: string[] = [];

  if (isPlaceholder(getString(import.meta.env.VITE_SUPABASE_URL as string | undefined))) {
    issues.push('VITE_SUPABASE_URL is missing.');
  }
  if (isPlaceholder(getString(import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined))) {
    issues.push('VITE_SUPABASE_ANON_KEY is missing.');
  }

  return issues;
};

export const assertClientEnv = () => {
  const issues = getClientEnvIssues();
  if (issues.length > 0 && isProductionBuild()) {
    throw new Error(`Client environment is not production ready: ${issues.join(' ')}`);
  }
};

export const isDemoMode = () => !isProductionBuild() && getClientEnvIssues().length > 0;
