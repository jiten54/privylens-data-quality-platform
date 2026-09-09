import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Dataset,
  PIIFinding,
  QualityIssue,
  DocumentItem,
  AnomalyItem,
  AIExampleItem,
  QARule,
  ReportItem,
  AuditEvent,
  IntegrationService,
  NotificationItem,
  User,
  UserRole,
} from '../types';
import {
  CURRENT_USER,
  AVAILABLE_USERS,
  INITIAL_DATASETS,
  INITIAL_PII_FINDINGS,
  INITIAL_QUALITY_ISSUES,
  INITIAL_DOCUMENTS,
  INITIAL_ANOMALIES,
  INITIAL_AI_EXAMPLES,
  INITIAL_QA_RULES,
  INITIAL_REPORTS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_INTEGRATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

export type NavigationTab =
  | 'overview'
  | 'data-explorer'
  | 'document-review'
  | 'privacy-scanner'
  | 'pii-inventory'
  | 'quality-center'
  | 'anomaly-monitor'
  | 'ai-evaluation'
  | 'reports'
  | 'audit-trail'
  | 'rules-policies'
  | 'integrations'
  | 'settings';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  setUserRole: (role: UserRole) => void;
  currentWorkspace: string;
  setCurrentWorkspace: (ws: string) => void;
  workspaces: string[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // UI Modals
  isCommandSearchOpen: boolean;
  setIsCommandSearchOpen: (open: boolean) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;

  // Data
  datasets: Dataset[];
  selectedDatasetId: string;
  setSelectedDatasetId: (id: string) => void;
  selectedDataset: Dataset | undefined;
  piiFindings: PIIFinding[];
  qualityIssues: QualityIssue[];
  documents: DocumentItem[];
  selectedDocumentId: string;
  setSelectedDocumentId: (id: string) => void;
  selectedDocument: DocumentItem | undefined;
  anomalies: AnomalyItem[];
  aiExamples: AIExampleItem[];
  qaRules: QARule[];
  reports: ReportItem[];
  auditTrail: AuditEvent[];
  integrations: IntegrationService[];
  notifications: NotificationItem[];
  toasts: Toast[];

  // Actions
  addToast: (type: Toast['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  maskPIIFinding: (id: string) => void;
  maskAllPII: (datasetId?: string) => void;
  updatePIIStatus: (id: string, status: PIIFinding['status']) => void;
  resolveQualityIssue: (id: string, reason?: string) => void;
  assignQualityIssue: (id: string, owner: string) => void;
  ignoreQualityIssue: (id: string) => void;
  addQualityIssueComment: (id: string, text: string) => void;
  toggleQARule: (id: string) => void;
  createQARule: (newRule: Partial<QARule>) => void;
  redactDocumentAnnotation: (docId: string, annotationId: string) => void;
  approveDocumentAnnotation: (docId: string, annotationId: string) => void;
  updateDocumentStatus: (docId: string, status: DocumentItem['status']) => void;
  acknowledgeAnomaly: (id: string) => void;
  resolveAnomaly: (id: string) => void;
  evaluateAIExample: (id: string, decision: AIExampleItem['reviewerDecision'], notes?: string) => void;
  addNewDataset: (dataset: Dataset) => void;
  toggleIntegration: (id: string) => void;
  syncIntegration: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  generateNewReport: (type: ReportItem['type']) => void;
  addAuditEvent: (action: string, targetType: AuditEvent['targetType'], targetName: string, prev: string, next: string, reason: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentWorkspace, setCurrentWorkspace] = useState('Acme Enterprise FinTech');
  const workspaces = [
    'Acme Enterprise FinTech',
    'Global Healthcare Data Lake',
    'Omni Retail Analytics Corp',
    'EU Cross-Border Banking Cluster',
  ];

  const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Core Data
  const [datasets, setDatasets] = useState<Dataset[]>(INITIAL_DATASETS);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(INITIAL_DATASETS[0].id);
  const [piiFindings, setPiiFindings] = useState<PIIFinding[]>(INITIAL_PII_FINDINGS);
  const [qualityIssues, setQualityIssues] = useState<QualityIssue[]>(INITIAL_QUALITY_ISSUES);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>(INITIAL_DOCUMENTS[0].id);
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>(INITIAL_ANOMALIES);
  const [aiExamples, setAiExamples] = useState<AIExampleItem[]>(INITIAL_AI_EXAMPLES);
  const [qaRules, setQaRules] = useState<QARule[]>(INITIAL_QA_RULES);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(INITIAL_AUDIT_TRAIL);
  const [integrations, setIntegrations] = useState<IntegrationService[]>(INITIAL_INTEGRATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandSearchOpen(false);
        setIsNotificationsDrawerOpen(false);
        setIsHelpModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setUserRole = (role: UserRole) => {
    const matched = AVAILABLE_USERS.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      addToast('info', 'Switched Persona Role', `Active view permissions set to ${role} (${matched.name})`);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
      addToast('info', 'Role Updated', `Active user role set to ${role}`);
    }
  };

  const addAuditEvent = (
    action: string,
    targetType: AuditEvent['targetType'],
    targetName: string,
    prev: string,
    next: string,
    reason: string
  ) => {
    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      user: currentUser.name,
      userRole: currentUser.role,
      action,
      targetType,
      targetName,
      timestamp: 'Just now',
      previousValue: prev,
      newValue: next,
      reason,
    };
    setAuditTrail(existing => [newEvent, ...existing]);
  };

  // PII Actions
  const maskPIIFinding = (id: string) => {
    setPiiFindings(prev =>
      prev.map(item => {
        if (item.id === id) {
          addAuditEvent(
            'Masked Sensitive PII',
            'PII',
            `${item.source} (${item.piiType})`,
            item.sampleValue,
            item.maskedValue,
            'Manual single-record tokenization applied by reviewer'
          );
          return {
            ...item,
            status: 'Masked',
            isMasked: true,
          };
        }
        return item;
      })
    );
    addToast('success', 'PII Masked', 'Field tokenized with cryptographic mask.');
  };

  const maskAllPII = (datasetId?: string) => {
    let count = 0;
    setPiiFindings(prev =>
      prev.map(item => {
        if (!datasetId || item.datasetId === datasetId) {
          if (!item.isMasked) {
            count++;
            return {
              ...item,
              status: 'Masked',
              isMasked: true,
            };
          }
        }
        return item;
      })
    );
    if (count > 0) {
      addAuditEvent(
        'Batch Masked All PII',
        'PII',
        datasetId ? `Dataset ${datasetId}` : 'All Datasets',
        `${count} Unresolved PII items`,
        'Enforced HMAC-SHA256 Masked State',
        'Bulk masking executed via Privacy Scanner command center'
      );
      addToast('success', 'Bulk Mask Completed', `Successfully masked ${count} sensitive PII findings.`);
    } else {
      addToast('info', 'No Action Needed', 'All matching PII findings are already masked.');
    }
  };

  const updatePIIStatus = (id: string, status: PIIFinding['status']) => {
    setPiiFindings(prev =>
      prev.map(item => {
        if (item.id === id) {
          addAuditEvent(
            `Updated PII Status to ${status}`,
            'PII',
            `${item.source} (${item.piiType})`,
            `Status: ${item.status}`,
            `Status: ${status}`,
            'Status transition updated in Privacy Inventory'
          );
          return { ...item, status, isMasked: status === 'Masked' ? true : item.isMasked };
        }
        return item;
      })
    );
    addToast('info', 'PII Status Updated', `Finding marked as ${status}`);
  };

  // Quality Issue Actions
  const resolveQualityIssue = (id: string, reason = 'Issue remediation verified by QA rule check') => {
    setQualityIssues(prev =>
      prev.map(issue => {
        if (issue.id === id) {
          addAuditEvent(
            'Resolved Quality Issue',
            'Quality Issue',
            `${issue.id} - ${issue.issueType}`,
            `Status: ${issue.status}`,
            'Status: Resolved',
            reason
          );
          return { ...issue, status: 'Resolved' };
        }
        return issue;
      })
    );
    addToast('success', 'Issue Resolved', `Quality issue ${id} marked as Resolved.`);
  };

  const assignQualityIssue = (id: string, owner: string) => {
    setQualityIssues(prev =>
      prev.map(issue => {
        if (issue.id === id) {
          addAuditEvent(
            'Assigned Quality Issue',
            'Quality Issue',
            `${issue.id} - ${issue.issueType}`,
            `Owner: ${issue.owner}`,
            `Owner: ${owner}`,
            'Task dispatched to domain specialist'
          );
          return { ...issue, owner, status: 'Assigned' };
        }
        return issue;
      })
    );
    addToast('info', 'Issue Assigned', `Assigned to ${owner}`);
  };

  const ignoreQualityIssue = (id: string) => {
    setQualityIssues(prev =>
      prev.map(issue => {
        if (issue.id === id) {
          addAuditEvent(
            'Ignored Quality Issue',
            'Quality Issue',
            `${issue.id} - ${issue.issueType}`,
            `Status: ${issue.status}`,
            'Status: Ignored',
            'Determined as acceptable operational variance'
          );
          return { ...issue, status: 'Ignored' };
        }
        return issue;
      })
    );
    addToast('warning', 'Issue Ignored', `Issue ${id} marked as Ignored.`);
  };

  const addQualityIssueComment = (id: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      user: currentUser.name,
      text,
      time: 'Just now',
    };
    setQualityIssues(prev =>
      prev.map(issue => {
        if (issue.id === id) {
          return {
            ...issue,
            comments: [...issue.comments, newComment],
          };
        }
        return issue;
      })
    );
    addToast('success', 'Comment Added', 'Your note has been posted to the quality issue thread.');
  };

  // QA Rule Actions
  const toggleQARule = (id: string) => {
    setQaRules(prev =>
      prev.map(rule => {
        if (rule.id === id) {
          const nextState = !rule.isEnabled;
          addAuditEvent(
            nextState ? 'Enabled QA Rule' : 'Disabled QA Rule',
            'Rule',
            rule.name,
            rule.isEnabled ? 'Enabled' : 'Disabled',
            nextState ? 'Enabled' : 'Disabled',
            'Rule state changed by policy administrator'
          );
          return { ...rule, isEnabled: nextState };
        }
        return rule;
      })
    );
    addToast('info', 'Rule State Toggled', 'Quality policy execution updated.');
  };

  const createQARule = (newRuleData: Partial<QARule>) => {
    const id = `RULE-0${qaRules.length + 1}`;
    const newRule: QARule = {
      id,
      name: newRuleData.name || 'Custom Enterprise QA Rule',
      category: newRuleData.category || 'Data Quality',
      dimension: newRuleData.dimension || 'Validity',
      condition: newRuleData.condition || 'VALUE IS NOT NULL',
      targetDataset: newRuleData.targetDataset || 'All Datasets',
      severity: newRuleData.severity || 'HIGH',
      isEnabled: true,
      timesTriggered: 1,
      passRate: 100.0,
      failedCount: 0,
      falsePositiveRate: 0.0,
      lastRun: 'Just now',
      author: currentUser.name,
    };
    setQaRules(prev => [newRule, ...prev]);
    addAuditEvent(
      'Created QA Rule',
      'Rule',
      newRule.name,
      'N/A (New Rule)',
      newRule.condition,
      'New validation policy registered in Quality Center'
    );
    addToast('success', 'Rule Created', `Rule ${id} successfully deployed.`);
  };

  // Document Review Actions
  const redactDocumentAnnotation = (docId: string, annotationId: string) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          const updatedAnnotations = doc.annotations.map(ann => {
            if (ann.id === annotationId) {
              return { ...ann, isRedacted: true, status: 'Redacted' as const };
            }
            return ann;
          });
          const allRedacted = updatedAnnotations.every(a => a.isRedacted || a.status === 'Approved');
          return {
            ...doc,
            annotations: updatedAnnotations,
            status: allRedacted ? 'Redacted & Cleared' : 'In Review',
          };
        }
        return doc;
      })
    );
    addAuditEvent(
      'Redacted Sensitive Entity',
      'Document',
      `Document: ${docId}`,
      'Visible in preview',
      '[PERMANENT REDACTION APPLIED]',
      'Compliance reviewer applied blackout redaction'
    );
    addToast('success', 'Redaction Applied', 'Selected text segment permanently masked in export layer.');
  };

  const approveDocumentAnnotation = (docId: string, annotationId: string) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            annotations: doc.annotations.map(ann =>
              ann.id === annotationId ? { ...ann, status: 'Approved' as const } : ann
            ),
          };
        }
        return doc;
      })
    );
    addToast('info', 'Entity Approved', 'Item marked as legitimate verified business content.');
  };

  const updateDocumentStatus = (docId: string, status: DocumentItem['status']) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          addAuditEvent(
            `Updated Document Status to ${status}`,
            'Document',
            doc.title,
            `Status: ${doc.status}`,
            `Status: ${status}`,
            'Executive legal clearance workflow'
          );
          return { ...doc, status };
        }
        return doc;
      })
    );
    addToast('success', 'Document Status Updated', `Status set to "${status}".`);
  };

  // Anomaly Actions
  const acknowledgeAnomaly = (id: string) => {
    setAnomalies(prev =>
      prev.map(anom => (anom.id === id ? { ...anom, status: 'Investigating' } : anom))
    );
    addToast('info', 'Anomaly Acknowledged', `Anomaly ${id} moved to Investigating.`);
  };

  const resolveAnomaly = (id: string) => {
    setAnomalies(prev =>
      prev.map(anom => {
        if (anom.id === id) {
          addAuditEvent(
            'Resolved Anomaly Alert',
            'System',
            `${anom.id} - ${anom.title}`,
            `Status: ${anom.status}`,
            'Status: Resolved',
            'Automated remediation pipeline confirmed healthy threshold baseline'
          );
          return { ...anom, status: 'Resolved' };
        }
        return anom;
      })
    );
    addToast('success', 'Anomaly Resolved', `Alert ${id} cleared from active stream.`);
  };

  // AI Evaluation Actions
  const evaluateAIExample = (
    id: string,
    decision: AIExampleItem['reviewerDecision'],
    notes = ''
  ) => {
    setAiExamples(prev =>
      prev.map(ex => {
        if (ex.id === id) {
          addAuditEvent(
            `AI Evaluation Decision: ${decision}`,
            'System',
            `${ex.id} (${ex.category})`,
            `Decision: ${ex.reviewerDecision}`,
            `Decision: ${decision}`,
            notes || `Reviewer ${currentUser.name} calibrated ground-truth accuracy`
          );
          return {
            ...ex,
            reviewerDecision: decision,
            reviewerNotes: notes || ex.reviewerNotes,
            qualityScore: decision === 'Accepted' ? Math.max(90, ex.qualityScore) : ex.qualityScore,
          };
        }
        return ex;
      })
    );
    addToast('success', 'AI Evaluation Saved', `Example ${id} marked as ${decision}. Feedback synced to model training loop.`);
  };

  // Dataset Addition
  const addNewDataset = (dataset: Dataset) => {
    setDatasets(prev => [dataset, ...prev]);
    setSelectedDatasetId(dataset.id);
    addAuditEvent(
      'Ingested New Dataset',
      'Dataset',
      dataset.name,
      'N/A',
      `${dataset.rows.toLocaleString()} rows, ${dataset.columnsCount} cols`,
      'Uploaded via Data Explorer UI'
    );
    addToast('success', 'Dataset Uploaded', `Successfully indexed ${dataset.name}`);
  };

  // Integration Actions
  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'Connected' ? 'Disconnected' : 'Connected';
          addAuditEvent(
            nextStatus === 'Connected' ? 'Connected Integration' : 'Disconnected Integration',
            'System',
            item.name,
            item.status,
            nextStatus,
            'Integration status modified in Enterprise Connectors'
          );
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
    addToast('info', 'Integration Updated', 'Connection state modified.');
  };

  const syncIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, status: 'Syncing' };
        }
        return item;
      })
    );
    addToast('info', 'Sync Initiated', 'Triggering incremental crawl and schema sync...');
    setTimeout(() => {
      setIntegrations(prev =>
        prev.map(item => {
          if (item.id === id) {
            return {
              ...item,
              status: 'Connected',
              lastSync: 'Just now',
              recordsProcessed: item.recordsProcessed + 12500,
            };
          }
          return item;
        })
      );
      addToast('success', 'Sync Completed', `Incremental synchronization finished with 0 errors.`);
    }, 2000);
  };

  // Notification Actions
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    addToast('info', 'Notifications Cleared', 'All alerts marked as read.');
  };

  // Generate Report
  const generateNewReport = (type: ReportItem['type']) => {
    const id = `REP-2026-0${reports.length + 1}`;
    const newRep: ReportItem = {
      id,
      title: `${type} — Live Executive Snapshot`,
      type,
      generatedAt: 'Just now',
      author: `${currentUser.name} (${currentUser.role})`,
      trustScore: 92.8,
      riskLevel: 'LOW',
      totalRecordsScanned: datasets.reduce((acc, d) => acc + d.rows, 0),
      executiveSummary: `Real-time snapshot evaluating ${datasets.length} active enterprise datasets, ${piiFindings.filter(p => !p.isMasked).length} unresolved PII items, and ${qualityIssues.filter(q => q.status === 'Open').length} open quality issues. Generated for executive data governance review.`,
      keyFindings: [
        'Automated quality health rules validated across active pipelines.',
        'Privacy compliance barriers operational and blocking unmasked exports.',
        'Document review pipeline cleared 89% of incoming vendor agreements.',
      ],
      recommendations: [
        'Maintain continuous monitoring of high-volume sales ingestion tables.',
        'Review AI fine-tuning acceptance criteria prior to next training checkpoint.',
      ],
      actionsTaken: [
        'Generated full platform compliance report with cryptographic timestamp.',
      ],
    };
    setReports(prev => [newRep, ...prev]);
    addAuditEvent('Generated Report', 'System', newRep.title, 'N/A', id, 'Executive report generated on demand');
    addToast('success', 'Report Generated', `${newRep.title} is ready to export.`);
  };

  const selectedDataset = datasets.find(d => d.id === selectedDatasetId) || datasets[0];
  const selectedDocument = documents.find(d => d.id === selectedDocumentId) || documents[0];

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        availableUsers: AVAILABLE_USERS,
        setUserRole,
        currentWorkspace,
        setCurrentWorkspace,
        workspaces,
        theme,
        toggleTheme,
        isCommandSearchOpen,
        setIsCommandSearchOpen,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        datasets,
        selectedDatasetId,
        setSelectedDatasetId,
        selectedDataset,
        piiFindings,
        qualityIssues,
        documents,
        selectedDocumentId,
        setSelectedDocumentId,
        selectedDocument,
        anomalies,
        aiExamples,
        qaRules,
        reports,
        auditTrail,
        integrations,
        notifications,
        toasts,
        addToast,
        removeToast,
        maskPIIFinding,
        maskAllPII,
        updatePIIStatus,
        resolveQualityIssue,
        assignQualityIssue,
        ignoreQualityIssue,
        addQualityIssueComment,
        toggleQARule,
        createQARule,
        redactDocumentAnnotation,
        approveDocumentAnnotation,
        updateDocumentStatus,
        acknowledgeAnomaly,
        resolveAnomaly,
        evaluateAIExample,
        addNewDataset,
        toggleIntegration,
        syncIntegration,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        generateNewReport,
        addAuditEvent,
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
