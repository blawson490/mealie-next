import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Search,
  Trash2,
  Play,
  Pause,
  Download,
  Terminal,
  X,
  ChevronDown,
  ChevronRight,
  Filter,
  Activity,
  Copy,
  Globe,
  Monitor
} from 'lucide-react';

// --- Mock Data Generator Utilities ---

const MOCK_COMPONENTS = ['AuthService', 'PaymentGateway', 'UserProfile', 'Navigation', 'DataFetcher', 'RenderEngine'];
const MOCK_ERRORS = [
  'TypeError: Cannot read properties of undefined (reading \'id\')',
  'NetworkError: 503 Service Unavailable',
  'TimeoutError: Request took too long to complete',
  'ReferenceError: variable is not defined',
  'Invariant Violation: Invalid hook call'
];
const MOCK_WARNINGS = [
  'DeprecationWarning: usage of legacy API',
  'Performance: Component took 50ms to render',
  'Cache miss for key: user_settings',
  'Retrying connection (1/3)...'
];
const MOCK_INFOS = [
  'User logged in successfully',
  'Navigation event: /dashboard',
  'Data fetched: 45 records',
  'Service worker registered'
];

const MOCK_USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
];

const getBrowserContext = () => ({
  userAgent: navigator.userAgent,
  language: navigator.language,
  platform: navigator.platform,
  screenResolution: `${window.screen.width}x${window.screen.height}`,
  url: window.location.href,
  referrer: document.referrer || 'Direct'
});

const generateLog = () => {
  const rand = Math.random();
  let level = 'info';
  let message = '';
  let stack = null;

  if (rand < 0.2) {
    level = 'error';
    message = MOCK_ERRORS[Math.floor(Math.random() * MOCK_ERRORS.length)];
    stack = `Error: ${message}\n    at ${MOCK_COMPONENTS[Math.floor(Math.random() * MOCK_COMPONENTS.length)]} (main.js:123:45)\n    at React.render (react-dom.js:456:78)`;
  } else if (rand < 0.5) {
    level = 'warn';
    message = MOCK_WARNINGS[Math.floor(Math.random() * MOCK_WARNINGS.length)];
  } else {
    level = 'info';
    message = MOCK_INFOS[Math.floor(Math.random() * MOCK_INFOS.length)];
  }

  // Generate Mock Context/Headers
  const mockContext = {
    userAgent: MOCK_USER_AGENTS[Math.floor(Math.random() * MOCK_USER_AGENTS.length)],
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
    platform: Math.random() > 0.5 ? 'MacIntel' : 'Win32',
    language: 'en-US',
    screenResolution: '1920x1080',
    url: 'https://app.example.com/dashboard',
  };

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    level,
    component: MOCK_COMPONENTS[Math.floor(Math.random() * MOCK_COMPONENTS.length)],
    message,
    stack,
    context: mockContext,
    metadata: {
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      sessionId: crypto.randomUUID().slice(0, 8),
      environment: 'production'
    }
  };
};

// --- Main Application ---

export default function LogViewer() {
  const [logs, setLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [selectedLevels, setSelectedLevels] = useState({ error: true, warn: true, info: true, debug: false });
  const [selectedLog, setSelectedLog] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const bottomRef = useRef(null);
  const originalConsole = useRef<Record<string, any>>({});

  // --- Console Interception ---
  useEffect(() => {
    if (isCapturing) {
      const methods = ['log', 'error', 'warn', 'info', 'debug'];

      methods.forEach(method => {
        const consoleAny = console as any;
        originalConsole.current[method] = consoleAny[method];
        consoleAny[method] = (...args) => {
          // Call original
          originalConsole.current[method](...args);

          // Add to internal state
          const newLog = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            level: method === 'log' ? 'info' : method,
            component: 'Console',
            message: args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
            stack: new Error().stack, // Capture stack trace of where console was called
            context: getBrowserContext(), // Capture real browser context
            metadata: {
              source: 'browser_console',
              capturedAt: Date.now()
            }
          };

          setLogs(prev => [...prev.slice(-999), newLog]); // Keep last 1000
        };
      });
    } else {
      // Restore original console
      Object.keys(originalConsole.current).forEach(method => {
        (console as any)[method] = originalConsole.current[method];
      });
    }

    return () => {
      // Cleanup on unmount
      Object.keys(originalConsole.current).forEach(method => {
        (console as any)[method] = originalConsole.current[method];
      });
    };
  }, [isCapturing]);

  // --- Simulation Loop ---
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setLogs(prev => [...prev.slice(-999), generateLog()]);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // --- Auto Scroll ---
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // --- Filtering Logic ---
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (!selectedLevels[log.level]) return false;
      if (filterText) {
        const searchStr = filterText.toLowerCase();
        return (
          log.message.toLowerCase().includes(searchStr) ||
          log.component.toLowerCase().includes(searchStr) ||
          log.timestamp.includes(searchStr)
        );
      }
      return true;
    });
  }, [logs, filterText, selectedLevels]);

  const stats = useMemo(() => {
    return logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      acc.total++;
      return acc;
    }, { error: 0, warn: 0, info: 0, debug: 0, total: 0 });
  }, [logs]);

  const handleClear = () => setLogs([]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warn': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'debug': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'error': return 'bg-red-500';
      case 'warn': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
      case 'debug': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const LogRow = ({ log, onClick }) => (
    <div
      onClick={() => onClick(log)}
      className="group flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer text-sm font-mono transition-colors"
    >
      <div className={`w-2 h-2 rounded-full shrink-0 ${getLevelBadgeColor(log.level)}`} />
      <div className="text-gray-400 w-24 shrink-0 text-xs">{log.timestamp.split('T')[1].slice(0, 12)}</div>
      <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase w-16 text-center shrink-0 ${getLevelColor(log.level)}`}>
        {log.level}
      </div>
      <div className="text-gray-600 w-32 shrink-0 truncate font-semibold" title={log.component}>
        [{log.component}]
      </div>
      <div className="text-gray-800 truncate flex-1 group-hover:text-black">
        {log.message}
      </div>
      {log.stack && (
        <Terminal size={14} className="text-gray-400 shrink-0" />
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 bg-slate-50 border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 font-bold text-lg text-slate-800">
            <Activity className="text-blue-600" />
            <span>LogStream</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Client-Side Logger</div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500 uppercase font-semibold">Total</div>
              <div className="text-xl font-bold text-gray-800">{stats.total}</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 shadow-sm">
              <div className="text-xs text-red-500 uppercase font-semibold">Errors</div>
              <div className="text-xl font-bold text-red-700">{stats.error}</div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 shadow-sm">
              <div className="text-xs text-amber-500 uppercase font-semibold">Warns</div>
              <div className="text-xl font-bold text-amber-700">{stats.warn}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm">
              <div className="text-xs text-blue-500 uppercase font-semibold">Infos</div>
              <div className="text-xl font-bold text-blue-700">{stats.info}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Controls</h3>

            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${isSimulating ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span className="flex items-center gap-2">
                {isSimulating ? <Pause size={14} /> : <Play size={14} />}
                {isSimulating ? 'Generating...' : 'Simulate Traffic'}
              </span>
              {isSimulating && <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>}
            </button>

            <button
              onClick={() => setIsCapturing(!isCapturing)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${isCapturing ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span className="flex items-center gap-2">
                <Bug size={14} />
                {isCapturing ? 'Listening to Console' : 'Capture Console'}
              </span>
              {isCapturing && <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>}
            </button>

            <button
              onClick={handleClear}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <Trash2 size={14} />
              Clear Logs
            </button>

            <button
              onClick={handleExport}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download size={14} />
              Export JSON
            </button>
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level Filter</h3>
              <Filter size={12} className="text-gray-400" />
            </div>

            <div className="space-y-2">
              {['error', 'warn', 'info', 'debug'].map(level => (
                <label key={level} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedLevels[level]}
                    onChange={() => setSelectedLevels(prev => ({ ...prev, [level]: !prev[level] }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">

        {/* Top Bar */}
        <div className="h-16 border-b border-gray-200 flex items-center px-4 gap-4 bg-white">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search logs by message, component, or ID..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={() => setAutoScroll(!autoScroll)}
                className="rounded border-gray-300"
              />
              Auto-scroll
            </label>
          </div>
        </div>

        {/* Log List */}
        <div className="flex-1 overflow-auto bg-white">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Search size={32} className="opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No logs found</h3>
              <p className="max-w-xs mx-auto">Try adjusting your filters, start the simulator, or capture console events.</p>
              <button
                onClick={() => setIsSimulating(true)}
                className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Simulation
              </button>
            </div>
          ) : (
            <div className="min-w-full inline-block align-middle">
              {filteredLogs.map(log => (
                <LogRow key={log.id} log={log} onClick={setSelectedLog} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Footer Status */}
        <div className="h-8 border-t border-gray-200 bg-gray-50 flex items-center px-4 text-xs text-gray-500 justify-between shrink-0">
          <div>Showing {filteredLogs.length} of {logs.length} events</div>
          <div>{isCapturing ? '● Live Capture Active' : '○ Capture Inactive'}</div>
        </div>

      </div>

      {/* Detail Modal/Panel (Right side overlay or panel) */}
      {selectedLog && (
        <div className="w-[500px] border-l border-gray-200 bg-white flex flex-col shadow-xl shrink-0 absolute right-0 top-0 bottom-0 z-10 lg:static lg:shadow-none">
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-gray-50">
            <h2 className="font-bold text-gray-800">Event Details</h2>
            <button
              onClick={() => setSelectedLog(null)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Header Info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getLevelColor(selectedLog.level)}`}>
                  {selectedLog.level}
                </span>
                <span className="text-xs text-gray-500 font-mono">{selectedLog.timestamp}</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 leading-snug break-words">
                {selectedLog.message}
              </h3>
            </div>

            {/* Context/Headers Section */}
            {selectedLog.context && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <Globe size={12} />
                  Client Context & Headers
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <tbody>
                      {Object.entries(selectedLog.context).map(([key, value]) => (
                        <tr key={key} className="border-b border-blue-100 last:border-0">
                          <th className="px-4 py-2 font-medium text-gray-600 bg-blue-50/50 w-1/3 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </th>
                          <td className="px-4 py-2 text-gray-800 font-mono text-xs break-all">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Stack Trace */}
            {selectedLog.stack && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Terminal size={12} />
                  Stack Trace
                </div>
                <div className="bg-slate-900 text-slate-300 p-4 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre leading-relaxed border border-slate-800 shadow-inner">
                  {selectedLog.stack}
                </div>
              </div>
            )}

            {/* Metadata Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Metadata</div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2 font-medium text-gray-600 bg-gray-100/50 w-1/3">Component</th>
                      <td className="px-4 py-2 text-gray-800 font-mono">{selectedLog.component}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2 font-medium text-gray-600 bg-gray-100/50">Event ID</th>
                      <td className="px-4 py-2 text-gray-800 font-mono text-xs">{selectedLog.id}</td>
                    </tr>
                    {selectedLog.metadata && Object.entries(selectedLog.metadata).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-100 last:border-0">
                        <th className="px-4 py-2 font-medium text-gray-600 bg-gray-100/50 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                        <td className="px-4 py-2 text-gray-800 font-mono">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
              }}
            >
              <Copy size={14} />
              Copy Event JSON
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
