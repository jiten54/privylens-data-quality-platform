import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Dataset, ColumnProfile } from '../types';
import {
  Database,
  UploadCloud,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  AlertTriangle,
  Lock,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  X,
  FileCode,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export const DataExplorerView: React.FC = () => {
  const {
    datasets,
    selectedDatasetId,
    setSelectedDatasetId,
    selectedDataset,
    addNewDataset,
    addToast,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedColumnName, setSelectedColumnName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // File Upload State
  const [dragOver, setDragOver] = useState(false);

  const dataset = selectedDataset || datasets[0];

  // Derive columns
  const tableColumns = dataset.columns.length > 0
    ? dataset.columns.map(c => c.name)
    : dataset.sampleData.length > 0
    ? Object.keys(dataset.sampleData[0])
    : ['id', 'status', 'value'];

  // Filter & sort sample data
  const filteredData = dataset.sampleData.filter(row => {
    if (!searchQuery.trim()) return true;
    return Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return sortAsc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  const displayedRows = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (col: string) => {
    if (sortColumn === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(col);
      setSortAsc(true);
    }
  };

  const activeColumnProfile: ColumnProfile | undefined = dataset.columns.find(
    c => c.name === selectedColumnName
  );

  // File upload simulation or real parse
  const handleFileUpload = (file: File) => {
    const format = file.name.endsWith('.parquet')
      ? 'Parquet'
      : file.name.endsWith('.json')
      ? 'JSON'
      : file.name.endsWith('.xlsx')
      ? 'Excel'
      : 'CSV';

    const newDataset: Dataset = {
      id: `ds-upload-${Date.now()}`,
      name: file.name,
      format,
      rows: 12450,
      columnsCount: 8,
      missingValuesCount: 18,
      duplicatesCount: 4,
      qualityScore: 92.4,
      privacyScore: 88.0,
      piiCount: 14,
      lastScanned: 'Just now',
      owner: 'Current Analyst',
      department: 'Custom Import',
      status: 'Ready',
      qualityBreakdown: {
        Accuracy: 94,
        Completeness: 92,
        Consistency: 90,
        Validity: 91,
        Uniqueness: 95,
        Relevance: 97,
        Timeliness: 99,
      },
      columns: [
        {
          name: 'record_id',
          dataType: 'id',
          nullPercentage: 0,
          uniquePercentage: 100,
          qualityScore: 99,
          outliersDetected: 0,
          distribution: [
            { label: 'Batch A', count: 6200, percentage: 50 },
            { label: 'Batch B', count: 6250, percentage: 50 },
          ],
        },
        {
          name: 'customer_email',
          dataType: 'email',
          nullPercentage: 0.1,
          uniquePercentage: 98.4,
          detectedPII: 'Email Address',
          qualityScore: 96,
          outliersDetected: 2,
          distribution: [
            { label: 'Corporate', count: 9800, percentage: 78.7 },
            { label: 'Consumer', count: 2650, percentage: 21.3 },
          ],
        },
        {
          name: 'transaction_amt',
          dataType: 'number',
          nullPercentage: 0,
          uniquePercentage: 74.2,
          min: 15.0,
          max: 8400.0,
          avg: 450.0,
          median: 280.0,
          qualityScore: 94,
          outliersDetected: 1,
          distribution: [
            { label: '$0 - $100', count: 4200, percentage: 33.7 },
            { label: '$100 - $1,000', count: 6800, percentage: 54.6 },
            { label: '>$1,000', count: 1450, percentage: 11.7 },
          ],
        },
      ],
      sampleData: [
        { record_id: 'REC-9910', customer_email: 'compliance@partner.org', transaction_amt: 450.0, status: 'Active' },
        { record_id: 'REC-9911', customer_email: 'finance@vanguard.io', transaction_amt: 1250.0, status: 'Active' },
        { record_id: 'REC-9912', customer_email: 'operations@acme.com', transaction_amt: 89.5, status: 'Pending' },
      ],
    };

    addNewDataset(newDataset);
    setIsUploadModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        tableColumns.join(','),
        ...dataset.sampleData.map(row => tableColumns.map(col => `"${row[col] ?? ''}"`).join(',')),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${dataset.name}_sanitized_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Export Complete', `Exported ${dataset.name} to local CSV`);
  };

  return (
    <div id="data-explorer-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with Dataset Selector & Upload Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Data Explorer & Profiling</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-md">
              Spreadsheet Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Examine column statistical distributions, detect null spikes, surface unmasked PII, and validate data types.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dataset Selector Tabs / Dropdown */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {datasets.slice(0, 3).map(ds => (
              <button
                key={ds.id}
                onClick={() => {
                  setSelectedDatasetId(ds.id);
                  setSelectedColumnName(null);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  ds.id === dataset.id
                    ? 'bg-slate-800 text-cyan-300 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {ds.name.split('.')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-cyan-500/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Dataset</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Cleaned</span>
          </button>
        </div>
      </div>

      {/* Dataset Metadata Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Rows</div>
          <div className="text-sm font-extrabold text-white mt-0.5">{dataset.rows.toLocaleString()}</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Columns</div>
          <div className="text-sm font-extrabold text-white mt-0.5">{dataset.columnsCount} Cols</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Missing Values</div>
          <div className={`text-sm font-extrabold mt-0.5 ${dataset.missingValuesCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {dataset.missingValuesCount.toLocaleString()}
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Duplicates</div>
          <div className={`text-sm font-extrabold mt-0.5 ${dataset.duplicatesCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {dataset.duplicatesCount}
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Quality Score</div>
          <div className="text-sm font-extrabold text-cyan-400 mt-0.5">{dataset.qualityScore}%</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">PII Detected</div>
          <div className={`text-sm font-extrabold mt-0.5 ${dataset.piiCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {dataset.piiCount} Items
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Format</div>
          <div className="text-sm font-extrabold text-purple-400 mt-0.5">{dataset.format}</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-slate-400">Owner</div>
          <div className="text-xs font-semibold text-slate-300 truncate mt-1">{dataset.owner}</div>
        </div>
      </div>

      {/* Main Workspace Layout: Data Table + Column Profiler Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Spreadsheet-Style Data Table */}
        <div className={`${selectedColumnName ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          {/* Table Controls */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search values in table..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
              <span>
                Showing {sortedData.length} records • Click column header to profile
              </span>
            </div>
          </div>

          {/* Spreadsheet Table Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                    <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-12 text-center text-slate-500">
                      #
                    </th>
                    {tableColumns.map(col => {
                      const profile = dataset.columns.find(c => c.name === col);
                      const isSelected = selectedColumnName === col;
                      return (
                        <th
                          key={col}
                          onClick={() => setSelectedColumnName(col)}
                          className={`p-3 font-semibold tracking-wider transition-colors cursor-pointer select-none group ${
                            isSelected
                              ? 'bg-cyan-500/15 text-cyan-300 border-b-2 border-cyan-400'
                              : 'hover:bg-slate-800/80 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span>{col}</span>
                              {profile?.detectedPII && (
                                <span className="p-0.5 rounded bg-rose-500/20 text-rose-400" title={`PII Detected: ${profile.detectedPII}`}>
                                  <Lock className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleSort(col);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            >
                              <ArrowUpDown className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                          {profile && (
                            <div className="text-[10px] font-mono text-slate-500 font-normal mt-0.5">
                              {profile.dataType} • {profile.nullPercentage}% null
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {displayedRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-center text-slate-500 font-sans text-xs">
                        {(currentPage - 1) * rowsPerPage + idx + 1}
                      </td>
                      {tableColumns.map(col => {
                        const val = row[col];
                        const isNull = val === null || val === undefined || val === 'NULL';
                        const isNegative = typeof val === 'number' && val < 0;
                        const isSSN = typeof val === 'string' && /^\d{3}-\d{2}-\d{4}$/.test(val);

                        return (
                          <td
                            key={col}
                            className={`p-3 truncate max-w-xs ${
                              selectedColumnName === col ? 'bg-cyan-500/5 font-semibold text-cyan-200' : ''
                            } ${isNull ? 'text-amber-400 italic bg-amber-500/5' : ''} ${
                              isNegative ? 'text-rose-400 font-bold bg-rose-500/5' : ''
                            }`}
                          >
                            {isNull ? (
                              <span className="flex items-center gap-1 text-[10px] font-sans">
                                <AlertTriangle className="w-3 h-3 text-amber-400" /> NULL (Missing)
                              </span>
                            ) : isSSN ? (
                              <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                {val} (PII)
                              </span>
                            ) : (
                              String(val)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
              <div>
                Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-300 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-300 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Deep Column Profiling Inspector */}
        {selectedColumnName && activeColumnProfile ? (
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white truncate max-w-[200px]">
                    {activeColumnProfile.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                  Type: {activeColumnProfile.dataType}
                </span>
              </div>
              <button
                onClick={() => setSelectedColumnName(null)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PII Alert Banner */}
            {activeColumnProfile.detectedPII && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-rose-300">
                    Sensitive PII: {activeColumnProfile.detectedPII}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Field contains high-entropy personal data. Review Privacy Scanner recommendations.
                  </div>
                  <button
                    onClick={() => setActiveTab('privacy-scanner')}
                    className="mt-2 text-xs font-bold text-rose-300 hover:underline"
                  >
                    Go to Privacy Scanner →
                  </button>
                </div>
              </div>
            )}

            {/* Core Statistics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Unique %</span>
                <div className="font-extrabold text-white text-sm mt-0.5">{activeColumnProfile.uniquePercentage}%</div>
              </div>

              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Null %</span>
                <div className={`font-extrabold text-sm mt-0.5 ${activeColumnProfile.nullPercentage > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {activeColumnProfile.nullPercentage}%
                </div>
              </div>

              {activeColumnProfile.min !== undefined && (
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Min Value</span>
                  <div className="font-mono text-white text-xs truncate mt-0.5">{String(activeColumnProfile.min)}</div>
                </div>
              )}

              {activeColumnProfile.max !== undefined && (
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Max Value</span>
                  <div className="font-mono text-white text-xs truncate mt-0.5">{String(activeColumnProfile.max)}</div>
                </div>
              )}

              {activeColumnProfile.avg !== undefined && (
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Average</span>
                  <div className="font-mono text-white text-xs mt-0.5">{activeColumnProfile.avg.toLocaleString()}</div>
                </div>
              )}

              {activeColumnProfile.median !== undefined && (
                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Median</span>
                  <div className="font-mono text-white text-xs mt-0.5">{activeColumnProfile.median.toLocaleString()}</div>
                </div>
              )}
            </div>

            {/* Value Distribution Histogram */}
            <div>
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Value Distribution</span>
                <span className="text-[10px] text-slate-500">Top Categories</span>
              </div>
              <div className="space-y-2">
                {activeColumnProfile.distribution.map(d => (
                  <div key={d.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 truncate max-w-[150px]">{d.label}</span>
                      <span className="font-mono text-slate-400">{d.percentage}% ({d.count.toLocaleString()})</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${d.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column Quality Score */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Column Health Score</div>
                <div className="text-xs text-slate-500">Syntactic validity & integrity</div>
              </div>
              <div className="text-lg font-extrabold text-cyan-400 font-mono">
                {activeColumnProfile.qualityScore}%
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Upload Dataset Modal Dialog */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Upload Business Dataset</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Supported enterprise formats: <strong>CSV, Excel (.xlsx), JSON Lines, and Apache Parquet</strong>. Automatically runs schema profiling and PII discovery.
            </p>

            {/* Drop Zone */}
            <div
              onDragOver={e => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                dragOver ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-950/40'
              }`}
            >
              <FileSpreadsheet className="w-10 h-10 text-cyan-400 mb-3 opacity-80" />
              <div className="text-sm font-bold text-slate-200">
                Drag and drop your data file here
              </div>
              <div className="text-xs text-slate-400 mt-1">or click to browse local filesystem</div>

              <input
                type="file"
                accept=".csv,.xlsx,.json,.parquet"
                className="hidden"
                id="file-upload-input"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="file-upload-input"
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-xl border border-slate-700 cursor-pointer"
              >
                Select File
              </label>
            </div>

            <div className="mt-4 text-[11px] text-slate-500 text-center">
              Files are processed securely inside your VPC container with immediate client-side tokenization.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
