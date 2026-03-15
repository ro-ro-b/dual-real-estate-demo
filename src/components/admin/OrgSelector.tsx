/**
 * Organization selector dropdown component
 */

'use client';

import { useEffect, useState } from 'react';
import { Organization } from '@/types';

export function OrgSelector() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrganizations();
    loadSelectedOrg();
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/organizations');
      if (response.ok) {
        const data = (await response.json()) as {
          success: boolean;
          data?: Organization[];
        };
        if (data.success && data.data) {
          setOrgs(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSelectedOrg = () => {
    const stored = localStorage.getItem('dual-org-id');
    if (stored) {
      setSelectedOrgId(stored);
    }
  };

  const handleOrgChange = (orgId: string) => {
    setSelectedOrgId(orgId);
    localStorage.setItem('dual-org-id', orgId);
    window.dispatchEvent(new CustomEvent('org-changed', { detail: { orgId } }));
  };

  const handleCreateNew = () => {
    const orgName = prompt('Enter organization name:');
    if (!orgName) return;

    createOrganization(orgName);
  };

  const createOrganization = async (name: string) => {
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        await fetchOrganizations();
      }
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const selectedOrg = orgs.find(o => o.id === selectedOrgId);

  return (
    <div className="org-selector">
      <select value={selectedOrgId} onChange={e => handleOrgChange(e.target.value)} disabled={loading}>
        <option value="">Select Organization</option>
        {orgs.map(org => (
          <option key={org.id} value={org.id}>
            {org.name} ({org.members.length} members)
          </option>
        ))}
        <option value="__create">+ Create New Organization</option>
      </select>

      {selectedOrg && (
        <div className="org-info">
          <span>{selectedOrg.name}</span>
          <span className="member-count">{selectedOrg.members.length} members</span>
        </div>
      )}

      {loading && <span className="loading">Loading...</span>}

      <style jsx>{`
        .org-selector {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .org-info {
          display: flex;
          gap: 8px;
          font-size: 14px;
        }

        .member-count {
          color: #666;
        }

        .loading {
          color: #999;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
