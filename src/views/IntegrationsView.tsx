import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Database,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Plus,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
} from 'lucide-react';

interface Connector {
  id: string;
  name: string;
  category: 'Warehouse' | 'Object Store' | 'Database' | 'SaaS Application';
  status: 'Connected' | 'Syncing' | 'Offline';
  recordsIngested: string;
  lastSync: string;
  description: string;
  latency: string;
}

export const IntegrationsView: React.FC = () => {
  const { addToast } = useApp();
  const [testingId, setTestingId] = useState<string | null>(null);

  const [connectors, setConnectors] = useState<Connector[]>([
    {
      id: 'conn-snowflake',
      name: 'Snowflake Data Cloud',
      category: 'Warehouse',
      status: 'Connected',
      recordsIngested: '1.2M rows/day',
      lastSync: '4 minutes ago',
      description: 'Production read-replica connecting PROD_ANALYTICS warehouse and CRM raw tables.',
      latency: '18ms',
    },
    {
      id: 'conn-s3',
      name: 'Amazon S3 Document Lake',
      category: 'Object Store',
      status: 'Connected',
      recordsIngested: '450 docs/hr',
      lastSync: '12 minutes ago',
      description: 'Incoming customer contract PDF and KYC image repository in us-east-1.',
      latency: '24ms',
    },
    {
      id: 'conn-bigquery',
      name: 'Google BigQuery',
      category: 'Warehouse',
      status: 'Connected',
      recordsIngested: '4.8M rows/day',
      lastSync: '1 minute ago',
      description: 'Clickstream telemetry and marketing attribution datasets with auto-PII scrubber.',
      latency: '14ms',
    },
    {
      id: 'conn-databricks',
      name: 'Databricks Unity Catalog',
      category: 'Warehouse',
      status: 'Connected',
      recordsIngested: '850k rows/day',
      lastSync: '22 minutes ago',
      description: 'Delta Lake tables serving feature stores for recommendation models.',
      latency: '31ms',
    },
    {
      id: 'conn-postgres',
      name: 'PostgreSQL Production Aurora',
      category: 'Database',
      status: 'Connected',
      recordsIngested: '320k rows/day',
      lastSync: '8 minutes ago',
      description: 'Transactional primary database with real-time logical CDC replication.',
      latency: '9ms',
    },
    {
      id: 'conn-sharepoint',
      name: 'Microsoft 365 / SharePoint',
      category: 'SaaS Application',
      status: 'Connected',
      recordsIngested: '120 docs/day',
      lastSync: '1 hour ago',
      description: 'Executive internal policy documents, board decks, and employee handbooks.',
      latency: '85ms',
    },
  ]);

  const handleTestConnection = (connector: Connector) => {
    setTestingId(connector.id);
    setTimeout(() => {
      setTestingId(null);
      addToast(
        'success',
        'Connection Verified',
        `Mutual TLS handshake and credentials valid for ${connector.name}. Latency: ${connector.latency}`
      );
    }, 900);
  };

  const handleTriggerSync = (connector: Connector) => {
    addToast('info', 'Sync Dispatched', `Ingestion job queued for ${connector.name}. Checking for delta files.`);
  };

  return (
    <div id="integrations-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Enterprise Connectors & Ingestion Pipelines</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-md">
              Zero-Copy Scanning
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Connect Snowflake, Databricks, BigQuery, AWS S3, and Salesforce to continuously scan for quality issues and sensitive data.
          </p>
        </div>

        <button
          onClick={() => addToast('info', 'Connector Wizard', 'Contact enterprise administrator to provision new VPC endpoints.')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Data Connector</span>
        </button>
      </div>

      {/* Grid of Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map(connector => (
          <div
            key={connector.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    {connector.category}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{connector.name}</h3>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {connector.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {connector.description}
              </p>

              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ingestion Throughput:</span>
                  <span className="font-mono font-bold text-slate-200">{connector.recordsIngested}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Telemetry Heartbeat:</span>
                  <span className="text-slate-300">{connector.lastSync}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Encrypted VPC Latency:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{connector.latency}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => handleTestConnection(connector)}
                disabled={testingId === connector.id}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Zap className={`w-3.5 h-3.5 ${testingId === connector.id ? 'animate-spin text-amber-400' : 'text-cyan-400'}`} />
                <span>{testingId === connector.id ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <button
                onClick={() => handleTriggerSync(connector)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
