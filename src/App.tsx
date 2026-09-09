import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { CommandSearchModal } from './components/CommandSearchModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { HelpShortcutsModal } from './components/HelpShortcutsModal';
import { ToastContainer } from './components/ToastContainer';

// Views
import { OverviewView } from './views/OverviewView';
import { DataExplorerView } from './views/DataExplorerView';
import { DocumentReviewView } from './views/DocumentReviewView';
import { PrivacyScannerView } from './views/PrivacyScannerView';
import { PiiInventoryView } from './views/PiiInventoryView';
import { QualityCenterView } from './views/QualityCenterView';
import { AnomalyMonitorView } from './views/AnomalyMonitorView';
import { AiEvaluationView } from './views/AiEvaluationView';
import { ReportsView } from './views/ReportsView';
import { AuditTrailView } from './views/AuditTrailView';
import { RulesPoliciesView } from './views/RulesPoliciesView';
import { IntegrationsView } from './views/IntegrationsView';

const MainContent: React.FC = () => {
  const { activeTab, isSidebarCollapsed } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'data-explorer':
        return <DataExplorerView />;
      case 'document-review':
        return <DocumentReviewView />;
      case 'privacy-scanner':
        return <PrivacyScannerView />;
      case 'pii-inventory':
        return <PiiInventoryView />;
      case 'quality-center':
        return <QualityCenterView />;
      case 'anomaly-monitor':
        return <AnomalyMonitorView />;
      case 'ai-evaluation':
        return <AiEvaluationView />;
      case 'reports':
        return <ReportsView />;
      case 'audit-trail':
        return <AuditTrailView />;
      case 'rules-policies':
        return <RulesPoliciesView />;
      case 'integrations':
        return <IntegrationsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-950">
        {/* Top Header */}
        <TopHeader />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60 custom-scrollbar">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <CommandSearchModal />
      <NotificationsDrawer />
      <HelpShortcutsModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
