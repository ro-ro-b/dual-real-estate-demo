/**
 * Webhook event processing and handlers
 */

import * as db from './db';
import { WebhookEvent } from '@/types';
import { sseManager } from './realtime';

export type WebhookHandler = (
  event: WebhookEvent,
  database: ReturnType<typeof db.initDb>
) => Promise<void>;

/**
 * Handle property anchored event
 */
async function handlePropertyAnchored(event: WebhookEvent): Promise<void> {
  console.log('Property anchored:', event.objectId);

  const property = db.getProperty(event.objectId);
  if (!property) {
    console.warn('Property not found:', event.objectId);
    return;
  }

  // Update on-chain status
  const propertyData = JSON.parse(property.property_data);
  db.saveProperty(
    property.id,
    property.template_id,
    property.org_id,
    property.owner_wallet,
    propertyData,
    'anchored'
  );

  // Broadcast via SSE
  sseManager.broadcast('property-anchored', {
    objectId: event.objectId,
    transactionHash: event.data.transactionHash,
  });
}

/**
 * Handle anchoring failed event
 */
async function handleAnchoringFailed(event: WebhookEvent): Promise<void> {
  console.error('Property anchoring failed:', event.objectId, event.data.error);

  const property = db.getProperty(event.objectId);
  if (!property) {
    console.warn('Property not found:', event.objectId);
    return;
  }

  // Update status to failed
  const propertyData = JSON.parse(property.property_data);
  db.saveProperty(
    property.id,
    property.template_id,
    property.org_id,
    property.owner_wallet,
    propertyData,
    'failed'
  );

  // Broadcast via SSE
  sseManager.broadcast('property-anchoring-failed', {
    objectId: event.objectId,
    error: event.data.error,
  });
}

/**
 * Handle action completed event
 */
async function handleActionCompleted(event: WebhookEvent): Promise<void> {
  console.log('Action completed:', event.objectId);

  const data = event.data as Record<string, unknown>;
  const actionId = data.actionId as string;
  const result = data.result as Record<string, unknown>;

  // Find and update action in DB
  const property = db.getProperty(event.objectId);
  if (!property) {
    console.warn('Property not found:', event.objectId);
    return;
  }

  const actions = db.getActions(event.objectId);
  const action = actions.find(a => a.id === actionId);

  if (action) {
    db.saveAction(
      actionId,
      event.objectId,
      action.action_type,
      action.actor,
      JSON.parse(action.parameters),
      'completed',
      result
    );
  }

  // Broadcast via SSE
  sseManager.broadcast('action-completed', {
    objectId: event.objectId,
    actionId,
    result,
  });
}

/**
 * Handle action failed event
 */
async function handleActionFailed(event: WebhookEvent): Promise<void> {
  console.error('Action failed:', event.objectId, event.data.error);

  const data = event.data as Record<string, unknown>;
  const actionId = data.actionId as string;
  const error = data.error as string;

  // Find and update action in DB
  const property = db.getProperty(event.objectId);
  if (!property) {
    console.warn('Property not found:', event.objectId);
    return;
  }

  const actions = db.getActions(event.objectId);
  const action = actions.find(a => a.id === actionId);

  if (action) {
    // Note: db.saveAction doesn't have error field, store in result
    db.saveAction(
      actionId,
      event.objectId,
      action.action_type,
      action.actor,
      JSON.parse(action.parameters),
      'failed',
      { error }
    );
  }

  // Broadcast via SSE
  sseManager.broadcast('action-failed', {
    objectId: event.objectId,
    actionId,
    error,
  });
}

/**
 * Map of event type handlers
 */
const handlers: Record<string, WebhookHandler> = {
  'property.anchored': handlePropertyAnchored,
  'property.anchoring_failed': handleAnchoringFailed,
  'action.completed': handleActionCompleted,
  'action.failed': handleActionFailed,
};

/**
 * Process webhook event dispatcher
 */
export async function processWebhookEvent(event: WebhookEvent): Promise<void> {
  console.log('Processing webhook event:', event.type, event.id);

  try {
    db.initDb();

    const handler = handlers[event.type];
    if (!handler) {
      console.warn('No handler for event type:', event.type);
      return;
    }

    await handler(event);

    // Mark as processed
    db.markEventProcessed(event.id);
  } catch (error) {
    console.error('Error processing webhook event:', event.id, error);
    throw error;
  }
}

export { handlers };
