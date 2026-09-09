export type UserRole = 'Admin' | 'Data Analyst' | 'Privacy Officer' | 'Reviewer' | 'Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organization: string;
  department: string;
}

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type QualityDimension =
  | 'Accuracy'
  | 'Completeness'
  | 'Consistency'
  | 'Validity'
  | 'Uniqueness'
  | 'Relevance'
  | 'Timeliness';

export type PIIType =
  | 'Government ID'
  | 'Passport Number'
  | 'Social Security Number'
  | 'Credit Card Number'
  | 'Bank Account / IBAN'
  | 'Email Address'
  | 'Phone Number'
  | 'Physical Address'
  | 'Full Name'
  | 'Date of Birth'
  | 'IP Address'
  | 'Employee ID'
  | 'Health / Medical Record'
  | 'Salary / Financial Identifier';

export interface PIIFinding {
  id: string;
  piiType: PIIType;
  sampleValue: string;
  maskedValue: string;
  location: string;
  datasetId: string;
  datasetName: string;
  columnName?: string;
  documentId?: string;
  confidence: number;
  severity: Severity;
  source: string;
  department: string;
  recommendedAction: string;
  status: 'Unresolved' | 'Masked' | 'Verified' | 'Ignored';
  detectedAt: string;
  isMasked: boolean;
}

export interface ColumnProfile {
  name: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'email' | 'id';
  nullPercentage: number;
  uniquePercentage: number;
  min?: string | number;
  max?: string | number;
  avg?: number;
  median?: number;
  distribution: { label: string; count: number; percentage: number }[];
  detectedPII?: PIIType;
  qualityScore: number;
  outliersDetected: number;
}

export interface Dataset {
  id: string;
  name: string;
  format: 'CSV' | 'Excel' | 'JSON' | 'Parquet';
  rows: number;
  columnsCount: number;
  missingValuesCount: number;
  duplicatesCount: number;
  qualityScore: number;
  privacyScore: number;
  piiCount: number;
  lastScanned: string;
  owner: string;
  department: string;
  status: 'Ready' | 'Scanning' | 'Attention Needed' | 'Review In Progress';
  columns: ColumnProfile[];
  sampleData: Record<string, any>[];
  qualityBreakdown: Record<QualityDimension, number>;
}

export type IssueStatus =
  | 'Open'
  | 'Investigating'
  | 'Assigned'
  | 'Resolved'
  | 'Verified'
  | 'Closed'
  | 'Ignored';

export interface QualityIssue {
  id: string;
  datasetId: string;
  datasetName: string;
  column: string;
  issueType: string;
  dimension: QualityDimension;
  severity: Severity;
  detectedDate: string;
  owner: string;
  status: IssueStatus;
  description: string;
  impactScore: number;
  affectedRows: number;
  suggestedFix: string;
  comments: { id: string; user: string; text: string; time: string }[];
}

export interface DocumentAnnotation {
  id: string;
  text: string;
  type: 'PII' | 'Compliance' | 'Inconsistency' | 'MissingInfo' | 'Quality';
  category: string;
  severity: Severity;
  confidence: number;
  page: number;
  startOffset?: number;
  endOffset?: number;
  isRedacted: boolean;
  status: 'Flagged' | 'Redacted' | 'Approved' | 'Rejected' | 'Escalated';
  recommendation: string;
  assignee?: string;
  comment?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  format: 'PDF' | 'DOCX' | 'TXT' | 'CSV' | 'XLSX';
  fileSize: string;
  uploadedAt: string;
  uploader: string;
  department: string;
  status: 'Pending Review' | 'In Review' | 'Approved' | 'Rejected' | 'Redacted & Cleared';
  reviewerConfidence: number;
  pageCount: number;
  contentSample: string;
  annotations: DocumentAnnotation[];
  piiCount: number;
  complianceViolations: number;
}

export interface AnomalyItem {
  id: string;
  title: string;
  type:
    | 'Sudden Value Change'
    | 'Duplicate Spike'
    | 'Missing-Value Spike'
    | 'Unexpected Category'
    | 'Statistical Outlier'
    | 'Broken Format'
    | 'Data Drift'
    | 'Schema Change';
  datasetName: string;
  columnName: string;
  severity: Severity;
  detectedAt: string;
  status: 'Detected' | 'Investigating' | 'Mitigated' | 'Resolved';
  whatChanged: string;
  whyUnusual: string;
  whatCouldBeAffected: string;
  recommendedAction: string;
  confidence: number;
  metricDelta: string;
}

export interface AIExampleItem {
  id: string;
  modelDataset: string;
  category: string;
  input: string;
  expectedOutput: string;
  aiOutput: string;
  reviewerDecision: 'Pending' | 'Accepted' | 'Rejected' | 'Needs Correction' | 'Escalated';
  qualityScore: number;
  privacyStatus: 'Compliant' | 'PII Leak Detected' | 'Sensitive Toxic' | 'Masked';
  reason: string;
  reviewerNotes?: string;
  agreementScore: number;
  submittedAt: string;
}

export type AiTrainingExample = AIExampleItem;

export interface QARule {
  id: string;
  name: string;
  category: 'Data Quality' | 'PII' | 'Privacy' | 'Security' | 'Compliance' | 'AI Evaluation';
  dimension?: QualityDimension;
  condition: string;
  targetDataset: string;
  severity: Severity;
  isEnabled: boolean;
  timesTriggered: number;
  passRate: number;
  failedCount: number;
  falsePositiveRate: number;
  lastRun: string;
  author: string;
}

export type GovernanceRule = QARule;

export interface ReportItem {
  id: string;
  title: string;
  type:
    | 'Data Quality Report'
    | 'Privacy Report'
    | 'PII Exposure Report'
    | 'Document Review Report'
    | 'QA Report'
    | 'AI Dataset Readiness Report'
    | 'Compliance Report';
  generatedAt: string;
  author: string;
  trustScore: number;
  executiveSummary: string;
  keyFindings: string[];
  riskLevel: Severity;
  recommendations: string[];
  actionsTaken: string[];
  totalRecordsScanned: number;
}

export interface AuditEvent {
  id: string;
  user: string;
  userRole: string;
  action: string;
  targetType: 'Dataset' | 'Document' | 'PII' | 'Quality Issue' | 'Rule' | 'System';
  targetName: string;
  timestamp: string;
  previousValue: string;
  newValue: string;
  reason: string;
}

export interface IntegrationService {
  id: string;
  name: string;
  iconName: string;
  type: 'Cloud Storage' | 'Warehouse' | 'Database' | 'Messaging';
  status: 'Connected' | 'Disconnected' | 'Syncing' | 'Error';
  lastSync: string;
  recordsProcessed: number;
  errorCount: number;
  endpoint: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
  actionLabel?: string;
}
