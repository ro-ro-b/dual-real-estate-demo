/**
 * Database layer with serverless-safe fallback
 * Uses better-sqlite3 when available (local dev), falls back to in-memory store (Vercel/serverless)
 */

import { getConfig } from './env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Database: any;
let usingSqlite = false;

try {
  Database = require('better-sqlite3');
  usingSqlite = true;
} catch {
  // better-sqlite3 not available (serverless environment)
  usingSqlite = false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;

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

// ---- In-memory store for serverless ----
const memStore = {
  properties: new Map<string, DbProperty>(),
  actions: new Map<string, DbAction>(),
  webhookEvents: new Map<string, DbWebhookEvent>(),
};

// ---- SQLite functions ----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSqliteDb(): any {
  if (db) return db;
  const config = getConfig();
  const dbPath = config.databaseUrl.replace('file:', '');
  db = new Database(dbPath);
  initSqliteDb();
  return db;
}

function initSqliteDb(): void {
  const database = db;
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
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_properties_org_id ON properties(org_id);
    CREATE INDEX IF NOT EXISTS idx_properties_owner_wallet ON properties(owner_wallet);
    CREATE INDEX IF NOT EXISTS idx_actions_object_id ON actions(object_id);
    CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
  `);
}

// ---- Public API (works with both backends) ----

export function initDb(): void {
  if (usingSqlite) {
    getSqliteDb();
  }
  // In-memory store needs no init
}

export function saveProperty(
  id: string,
  templateId: string,
  orgId: string,
  ownerWallet: string,
  propertyData: Record<string, unknown>,
  onChainStatus: string = 'none'
): DbProperty {
  const now = new Date().toISOString();
  const prop: DbProperty = {
    id,
    template_id: templateId,
    org_id: orgId,
    owner_wallet: ownerWallet,
    property_data: JSON.stringify(propertyData),
    on_chain_status: onChainStatus,
    created_at: now,
    updated_at: now,
  };

  if (usingSqlite) {
    const database = getSqliteDb();
    const stmt = database.prepare(`
      INSERT OR REPLACE INTO properties (id, template_id, org_id, owner_wallet, property_data, on_chain_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, templateId, orgId, ownerWallet, prop.property_data, onChainStatus, now, now);
  } else {
    memStore.properties.set(id, prop);
  }

  return prop;
}

export function getProperty(id: string): DbProperty | null {
  if (usingSqlite) {
    const database = getSqliteDb();
    const stmt = database.prepare('SELECT * FROM properties WHERE id = ?');
    const row = stmt.get(id) as DbProperty | undefined;
    return row || null;
  }
  return memStore.properties.get(id) || null;
}

export function listProperties(limit: number = 100, offset: number = 0): DbProperty[] {
  if (usingSqlite) {
    const database = getSqliteDb();
    const stmt = database.prepare('SELECT * FROM properties ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(limit, offset) as DbProperty[];
  }
  const all = Array.from(memStore.properties.values())
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  return all.slice(offset, offset + limit);
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
  const now = new Date().toISOString();
  const resultJson = result ? JSON.stringify(result) : null;
  const action: DbAction = {
    id,
    object_id: objectId,
    action_type: actionType,
    actor,
    parameters: JSON.stringify(parameters),
    status,
    result: resultJson,
    created_at: now,
  };

  if (usingSqlite) {
    const database = getSqliteDb();
    const stmt = database.prepare(`
      INSERT OR REPLACE INTO actions (id, object_id, action_type, actor, parameters, status, result, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, objectId, actionType, actor, action.parameters, status, resultJson, now);
  } else {
    memStore.actions.set(id, action);
  }

  return action;
}

export function getActions(objectId: string): DbAction[] {
  if (usingSqlite) {
    const database = getSqliteDb();
    const stmt = database.prepare('SELECT * FROM actions WHERE object_id = ? ORDER BY created_at DESC');
    return stmt.all(objectId) as DbAction[];
  }
  return Array.from(memStore.actions.values())
    .filter(a => a.object_id === objectId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function saveWebhookEvent(
  id: string,
  eventType: string,
  objectId: string,
  data: Record<string, unknown>,
  processed: boolean = false
): DbWebhookEvent {
  const now = new Date().toISOString();
  const event: DbWebhookEvent = {
    id,
    event_type: eventType,
    object_id: objectId,
    data: JSON.stringify(data),
    processed: processed ? 1 : 0,
    created_at: now,
  };

  if (usingSqlite) {
    const database = getSqliteDb();
    const stmt = database.prepare(`
      INSERT INTO webhook_events (id, event_type, object_id, data, processed, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, eventType, objectId, event.data, event.processed, now);
  } else {
    memStore.webhookEvents.set(id, event);
  }

  return event;
}

export function getUnprocessedEvents(): DbWebhookEvent[] {
  if (usingSqlite) {
    const database = getSqliteDb();
    const stmt = database.prepare('SELECT * FROM webhook_events WHERE processed = 0 ORDER BY created_at ASC');
    return stmt.all() as DbWebhookEvent[];
  }
  return Array.from(memStore.webhookEvents.values())
    .filter(e => e.processed === 0)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function markEventProcessed(id: string): void {
  if (usingSqlite) {
    const database = getSqliteDb();
    const stmt = database.prepare('UPDATE webhook_events SET processed = 1 WHERE id = ?');
    stmt.run(id);
  } else {
    const event = memStore.webhookEvents.get(id);
    if (event) {
      event.processed = 1;
    }
  }
}

export function close(): void {
  if (usingSqlite && db) {
    db.close();
    db = null;
  }
}
