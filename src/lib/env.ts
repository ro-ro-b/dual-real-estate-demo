/**
 * Environment configuration validation
 */

interface Config {
  dualApiUrl: string;
  dualApiKey: string;
  dualOrgId: string;
  dualTemplateId: string;
  dualWebhookSecret: string;
  dualWebhookCallbackUrl: string;
  databaseUrl: string;
  isDualConfigured: boolean;
}

let cachedConfig: Config | null = null;

export function getConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  const dualApiUrl = process.env.DUAL_API_URL || '';
  const dualApiKey = process.env.DUAL_API_KEY || '';
  const dualOrgId = process.env.DUAL_ORG_ID || '';
  const dualTemplateId = process.env.DUAL_TEMPLATE_ID || '';
  const dualWebhookSecret = process.env.DUAL_WEBHOOK_SECRET || '';
  const dualWebhookCallbackUrl = process.env.DUAL_WEBHOOK_CALLBACK_URL || '';
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
  const dualConfigured = process.env.DUAL_CONFIGURED === 'true';

  // Validate required vars only if DUAL_CONFIGURED is true
  if (dualConfigured) {
    const errors: string[] = [];

    if (!dualApiUrl) errors.push('DUAL_API_URL is required when DUAL_CONFIGURED=true');
    if (!dualApiKey) errors.push('DUAL_API_KEY is required when DUAL_CONFIGURED=true');
    if (!dualOrgId) errors.push('DUAL_ORG_ID is required when DUAL_CONFIGURED=true');
    if (!dualTemplateId) errors.push('DUAL_TEMPLATE_ID is required when DUAL_CONFIGURED=true');
    if (!dualWebhookSecret) errors.push('DUAL_WEBHOOK_SECRET is required when DUAL_CONFIGURED=true');
    if (!dualWebhookCallbackUrl) errors.push('DUAL_WEBHOOK_CALLBACK_URL is required when DUAL_CONFIGURED=true');

    if (errors.length > 0) {
      throw new Error(`Missing required environment variables:\n${errors.join('\n')}`);
    }
  }

  cachedConfig = {
    dualApiUrl,
    dualApiKey,
    dualOrgId,
    dualTemplateId,
    dualWebhookSecret,
    dualWebhookCallbackUrl,
    databaseUrl,
    isDualConfigured: dualConfigured,
  };

  return cachedConfig;
}

export function isDualConfigured(): boolean {
  return getConfig().isDualConfigured;
}
