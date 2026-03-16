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

  const dualApiUrl = process.env.NEXT_PUBLIC_DUAL_API_URL || 'https://blockv-labs.io';
  const dualApiKey = process.env.DUAL_API_TOKEN || '';
  const dualOrgId = process.env.DUAL_ORG_ID || '';
  const dualTemplateId = process.env.DUAL_TEMPLATE_ID || '';
  const dualWebhookSecret = process.env.DUAL_WEBHOOK_SECRET || '';
  const dualWebhookCallbackUrl = process.env.DUAL_WEBHOOK_CALLBACK_URL || '';
  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
  const dualConfigured = process.env.NEXT_PUBLIC_DUAL_CONFIGURED === 'true'
    && !!process.env.DUAL_API_TOKEN;

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
