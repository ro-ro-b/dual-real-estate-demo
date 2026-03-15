/**
 * SQLite database layer using better-sqlite3
 */

import Database from 'better-sqlite3';
import { getConfig } from './env';

let db: Database.Database | null = null;

export interface DbProperty {
  id: string;
  template_id: string;
  org_id: string;
  owner_wallet: string;
  property_data: string;
  on_chain_status: string;
  created_at: string;
  updated_at: string;
}

export interface DbAction {
  id: string;
  object_id: string;
  action_type: string;
  actor: string;
  parameters: string;
  status: string;
  result: string | null;
  created_at: string;
}

export interface DbWebhookEvent {
  id: string;
  event_type: string;
  object_id: string;
  data: string;
  processed: number;
  created_at: string;
}

function getDb(): Database.Database {
  if (db) {
    return db;
  }

  const config = getConfig();
  const dbPath = config.databaseUrl.replace('file:', '');

  db = new Database(dbPath);
  initDb();

  return db;
}

export function initDb(): void {
  const database = getDb();

  // Properties table
  database.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      template_id TEXT NOT NULL,
      org_id TEXT NOT NULL,
      owner_wallet TEXT NOT NULL,
      property_data TEXT NOT NULL,
      on_chain_status TEXT DEFAULT 'none',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Actions table
  database.exec(`
    CREATE TABLE IF NOT EXISTS actions (
      id TEXT PRIMARY KEY,
      object_id TEXT NOT NULL,
      action_type TEXT NOT NULL,
      actor TEXT NOT NULL,
      parameters TEXT NOT NULL,
      status TEXT NOT NULL,
      result TEXT,
      created_at TEXT NOT NULL
    )
  `);

  // Webhook events table
  database.exec(`
    CREATE TABLE IF NOT EXISTS webhook_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      object_id TEXT NOT NULL,
      data TEXT NOT NULL,
      processed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);

  // Create indices
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_properties_org_id ON properties(org_id);
    CREATE INDEX IF NOT EXISTS idx_properties_owner_wallet ON properties(owner_wallet);
    CREATE INDEX IF NOT EXISTS idx_actions_object_id ON actions(object_id);
    CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
  `);
}

export function saveProperty(
  id: string,
  templateId: string,
  orgId: string,
  ownerWallet: string,
  propertyData: Record<string, unknown>,
  onChainStatus: string = 'none'
): DbProperty {
  const database = getDb();
  const now = new Date().toISOString();

  const stmt = database.prepare(`
    INSERT OR REPLACE INTO properties (id, template_id, org_id, owner_wallet, property_data, on_chain_status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, templateId, orgId, ownerWallet, JSON.stringify(propertyData), onChainStatus, now, now);

  return {
    id,
    template_id: templateId,
    org_id: orgId,
    owner_wallet: ownerWallet,
    property_data: JSON.stringify(propertyData),
    on_chain_status: onChainStatus,
    created_at: now,
    updated_at: now,
  };
}

export function getProperty(id: string): DbProperty | null {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM properties WHERE id = ?');
  const row = stmt.get(id) as DbProperty | undefined;
  return row || null;
}

export function listProperties(limit: number = 100, offset: number = 0): DbProperty[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM properties ORDER BY created_at DESC LIMIT ? OFFSET ?');
  const rows = stmt.all(limit, offset) as DbProperty[];
  return rows;
}

export function saveAction(
  id: string,
  objectId: string,
  actionType: string,
  actor: string,
  parameters: Record<string, unknown>,
  status: string,
  result?: Record<string, unknown>
): DbAction {
  const database = getDb();
  const now = new Date().toISOString();

  const stmt = database.prepare(`
    INSERT OR REPLACE INTO actions (id, object_id, action_type, actor, parameters, status, result, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const resultJson = result ? JSON.stringify(result) : null;
  stmt.run(id, objectId, actionType, actor, JSON.stringify(parameters), status, resultJson, now);

  return {
    id,
    object_id: objectId,
    action_type: actionType,
    actor,
    parameters: JSON.stringify(parameters),
    status,
    result: resultJson,
    created_at: now,
  };
}

export function getActions(objectId: string): DbAction[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM actions WHERE object_id = ? ORDER BY created_at DESC');
  const rows = stmt.all(objectId) as DbAction[];
  return rows;
}

export function saveWebhookEvent(
  id: string,
  eventType: string,
  objectId: string,
  data: Record<string, unknown>,
  processed: boolean = false
): DbWebhookEvent {
  const database = getDb();
  const now = new Date().toISOString();

  const stmt = database.prepare(`
    INSERT INTO webhook_events (id, event_type, object_id, data, processed, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, eventType, objectId, JSON.stringify(data), processed ? 1 : 0, now);

  return {
    id,
    event_type: eventType,
    object_id: objectId,
    data: JSON.stringify(data),
    processed: processed ? 1 : 0,
    created_at: now,
  };
}

export function getUnprocessedEvents(): DbWebhookEvent[] {
  const database = getDb();
  const stmt = database.prepare('SELECT * FROM webhook_events WHERE processed = 0 ORDER BY created_at ASC');
  const rows = stmt.all() as DbWebhookEvent[];
  return rows;
}

export function markEventProcessed(id: string): void {
  const database = getDb();
  const stmt = database.prepare('UPDATE webhook_events SET processed = 1 WHERE id = ?');
  stmt.run(id);
}

export function close(): void {
  if (db) {
    db.close();
    db = null;
  }
}
