import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  ShieldCheck, 
  Code2, 
  GitBranch, 
  CheckCircle2, 
  Workflow, 
  Database,
  ArrowRight,
  Cpu,
  Github,
  Zap,
  Copy,
  Check
} from 'lucide-react';

const navItems = [
  { label: 'Rules Registry', url: 'https://github.com/voku/slop-scan/blob/main/docs/rules.md' },
  { label: 'Baseline Docs', url: 'https://github.com/voku/slop-scan/blob/main/docs/delta-comparisons.md' },
  { label: 'Integration Guide', url: 'https://github.com/voku/slop-scan/blob/main/docs/configuration.md' }
];

const terminalTabs = [
  {
    id: 'cli',
    label: 'CLI Scan',
    language: 'bash',
    code: `vendor/bin/slop-scan --path src/ \\
  --min-score 50 \\
  --json \\
  --ignore "tests/Fixtures"`
  },
  {
    id: 'config',
    label: 'Config',
    language: 'json',
    code: `{
  "paths": ["src/"],
  "ignorePaths": ["vendor/", "var/"],
  "rules": {
    "php.empty-catch": { "enabled": true },
    "php.debug-output": { "enabled": true }
  },
  "reporters": ["text", "json"]
}`
  },
  {
    id: 'baseline',
    label: 'Baseline',
    language: 'bash',
    code: `# 1. Generate the baseline for legacy code
vendor/bin/slop-scan --generate-baseline

# 2. Run future scans against the baseline
vendor/bin/slop-scan --baseline-file slop-baseline.json`
  },
  {
    id: 'github',
    label: 'GitHub Actions CI',
    language: 'yaml',
    code: `name: Slop Scan
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
      - run: composer install
      - run: vendor/bin/slop-scan --github`
  },
  {
    id: 'agent',
    label: 'Agent Repair',
    language: 'markdown',
    code: `You are an AI coding assistant. Review the following 
slop-scan JSON report. Fix all findings above score 50.

Report:
{
  "findings": [
    {
      "ruleId": "php.empty-catch",
      "path": "src/App.php",
      "line": 42
    }
  ]
}`
  }
];

const rules = [
  { id: 'php.empty-catch', title: 'Empty Catch Block', desc: 'Detects swallowed exceptions without logging or rethrow. High risk for silent failures.' },
  { id: 'php.swallowed-error', title: 'Exception Wrapping', desc: 'Catches exceptions wrapped into new exceptions without passing the previous exception.' },
  { id: 'php.blanket-suppress', title: 'Blanket Suppressions', desc: 'Flags PHPStan or Psalm suppressions that lack specific rule identities.' },
  { id: 'php.debug-output', title: 'Debug Artifacts', desc: 'Heuristics for var_dump, print_r, and leftover die() statements in production code.' },
  { id: 'php.mock-heavy', title: 'Brittle Test Logic', desc: 'Finds PHPUnit tests with high mock density and zero assertions or logic.' },
  { id: 'php.misleading-doc', title: 'Misleading PHPDoc', desc: 'Identifies PHPDoc types that drift or contradict the strictly typed PHP signatures.' },
  { id: 'php.clone-cluster', title: 'Clone Clusters', desc: 'Highlights repetitive boilerplate clusters that suggest missing abstractions.' },
  { id: 'php.type-escape', title: 'Type Hotspots', desc: 'Identifies regions with excessive mixed-type casts or static analysis suppressions.' },
  { id: 'php.pass-through', title: 'Pass-through Wrappers', desc: 'Finds wrapper methods that do nothing but call another method with exact matching arguments.' },
  { id: 'php.commented-code', title: 'Commented-out Code', desc: 'Detects large blocks of commented-out code that should be removed and left to version control.' },
  { id: 'md.low-signal', title: 'Low-signal Markdown', desc: 'Checks Markdown documentation for boilerplate descriptions lacking concrete code examples.' },
  { id: 'php.complex-switch', title: 'Bloated Switch Blocks', desc: 'Highlights massive switch or match blocks that should be refactored into polymorphic structures.' }
];

const pipelineSteps = [
  { icon: <Database className="w-5 h-5 text-emerald-600" />, title: 'Discover', desc: 'Finds supported repository files quickly.' },
  { icon: <Zap className="w-5 h-5 text-emerald-600" />, title: 'Compute', desc: 'Generates reusable file, directory, and repo facts.' },
  { icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, title: 'Analyze', desc: 'Runs rules by scope against cached facts.' },
  { icon: <GitBranch className="w-5 h-5 text-emerald-600" />, title: 'Filter', desc: 'Applies path ignores and legacy baseline deltas.' },
  { icon: <Terminal className="w-5 h-5 text-emerald-600" />, title: 'Report', desc: 'Emits JSON, Lint, Text, NDJSON, or GitHub annotations.' }
];

function CodeBlock({ code, language = "bash" }: { code: string, language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="font-mono bg-slate-50 border border-slate-200 rounded relative group">
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 z-10"
        aria-label="Copy code"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
      </button>
      <div className="overflow-x-auto text-sm text-slate-800 leading-relaxed rounded">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: 'inherit',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(terminalTabs[0].id);
  const [tabCopied, setTabCopied] = useState(false);
  const [agentCopied, setAgentCopied] = useState(false);

  const handleTabCopy = () => {
    const code = terminalTabs.find(t => t.id === activeTab)?.code;
    if (code) {
      navigator.clipboard.writeText(code);
      setTabCopied(true);
      setTimeout(() => setTabCopied(false), 2000);
    }
  };

  const handleAgentCopy = () => {
    navigator.clipboard.writeText(`{\n  "rule_id": "php.empty-catch",\n  "score": 8.5,\n  "fingerprint": "a8f2...9b",\n  "evidence": "catch (Throwable $e) {}"\n}`);
    setAgentCopied(true);
    setTimeout(() => setAgentCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-slate-200 bg-white flex-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center font-bold text-white text-sm shadow-sm">SL</div>
          <span className="font-extrabold tracking-tighter text-xl text-slate-900">slop-scan</span>
        </div>
        <div className="flex gap-4 sm:gap-6 text-sm font-medium text-slate-500 items-center">
          <div className="hidden md:flex gap-6 items-center">
            {navItems.map(item => (
                <a key={item.label} href={item.url} target="_blank" rel="noreferrer" aria-label={`open ${item.label} in new tab`} className="cursor-pointer hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1">{item.label}</a>
            ))}
          </div>
          <a href="https://github.com/voku/slop-scan" target="_blank" rel="noreferrer" aria-label="open GitHub repository in new tab" className="text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded px-1">
            <Github className="w-5 h-5 sm:w-4 sm:h-4"/> <span className="hidden sm:inline">GitHub ↗</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-200 flex-none bg-white">
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="tag text-emerald-600 mb-4 inline-block tracking-widest font-bold">Deterministic PHP Analysis</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter mb-6 text-slate-900">
            Explainable slop heuristics <br className="hidden xl:block"/>for PHP repositories.
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-600 max-w-xl mb-4 leading-relaxed">
            Find reviewable code patterns before they settle into your legacy. Concrete findings with rule IDs, evidence, and stable fingerprints.
          </p>
        </div>
        <div className="lg:col-span-5 p-6 sm:p-8 md:p-12 lg:p-16 bg-slate-50 flex flex-col justify-center">
          <div className="tag text-slate-400 mb-3 inline-block">Quick Start</div>
          <div className="font-mono bg-white border border-slate-200 p-4 rounded text-sm text-emerald-700 mb-4 shadow-sm overflow-x-auto whitespace-pre">
            $ composer global require voku/slop-scan<br/>
            $ slop-scan scan ./src --lint
          </div>
          <div className="text-xs text-slate-500 italic font-mono">
            // Supports PHP 8.3+, JSON, Text, NDJSON, GitHub Actions
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Rules Grid */}
        <section className="p-6 sm:p-8 md:p-12 border-b border-slate-200 bg-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-3 sm:gap-0">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 m-0">Heuristic Rules <span className="text-slate-400 font-medium">(Default Registry)</span></h2>
            <span className="text-[11px] sm:text-xs text-emerald-700 font-mono bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full inline-block w-fit font-bold tracking-wide">+14 Built-in Detectors</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {rules.map((rule) => (
              <div key={rule.id} className="rule-card p-5 bg-slate-50 rounded-r">
                <div className="text-[11px] font-mono text-emerald-600 mb-1.5 font-semibold tracking-wide">{rule.id}</div>
                <div className="font-bold text-sm mb-2 text-slate-900 tracking-tight">{rule.title}</div>
                <div className="text-sm text-slate-600 leading-relaxed font-medium">{rule.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Examples section */}
        <section className="p-6 sm:p-8 md:p-12 border-b border-slate-200 bg-slate-50 grid lg:grid-cols-12 gap-8 lg:gap-6">
           <div className="lg:col-span-8 flex flex-col min-h-0">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6 w-full lg:hidden block">Pipelines & Workflows</h2>
              <div className="border border-slate-200 rounded-lg flex flex-col h-full bg-white shadow-sm overflow-hidden">
                 <div className="flex flex-nowrap overflow-x-auto custom-scrollbar border-b border-slate-200 bg-slate-50/80" role="tablist" aria-label="Pipelines and Workflows">
                    {terminalTabs.map((tab) => (
                      <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 sm:px-6 py-3.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:bg-white rounded-t ${
                          activeTab === tab.id 
                            ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white font-bold' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border-b-2 border-transparent'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  
                  <div 
                    className="p-4 sm:p-6 flex-1 bg-white overflow-hidden rounded-b relative group"
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                    tabIndex={0}
                  >
                    <button 
                      onClick={handleTabCopy}
                      className="absolute top-4 right-4 p-2 rounded bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 z-10"
                      aria-label="Copy code"
                    >
                      {tabCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <SyntaxHighlighter
                          className="font-mono text-xs sm:text-[13px] text-slate-700 overflow-x-auto custom-scrollbar leading-relaxed"
                          language={terminalTabs.find(t => t.id === activeTab)?.language || 'bash'}
                          style={oneLight}
                          customStyle={{
                            margin: 0,
                            padding: 0,
                            background: 'transparent',
                            fontSize: 'inherit',
                          }}
                        >
                          {terminalTabs.find(t => t.id === activeTab)?.code || ''}
                        </SyntaxHighlighter>
                      </motion.div>
                    </AnimatePresence>
                  </div>
              </div>
           </div>

           {/* Bottom Panels from design */}
           <div className="lg:col-span-4 flex flex-col gap-6 pt-0 lg:pt-[3.35rem]">
              <div className="p-5 sm:p-6 border border-slate-200 rounded-lg flex flex-col flex-1 bg-white shadow-sm">
                <div className="tag mb-4 text-slate-400 inline-flex items-center gap-1.5 tracking-widest font-bold">
                  <Cpu className="w-4 h-4"/> Agent-Friendly Reporting
                </div>
                <div className="font-mono mb-5 leading-relaxed overflow-x-auto custom-scrollbar text-slate-600 bg-slate-50 p-4 border border-slate-100 rounded flex-1 relative group">
                  <button 
                    onClick={handleAgentCopy}
                    className="absolute top-2 right-2 p-1.5 rounded bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 z-10"
                    aria-label="Copy code"
                  >
                    {agentCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <SyntaxHighlighter
                    language="json"
                    style={oneLight}
                    className="text-xs sm:text-[13px]"
                    customStyle={{
                      margin: 0,
                      padding: 0,
                      background: 'transparent',
                      fontSize: 'inherit',
                    }}
                  >
{`{
  "rule_id": "php.empty-catch",
  "score": 8.5,
  "fingerprint": "a8f2...9b",
  "evidence": "catch (Throwable $e) {}"
}`}
                  </SyntaxHighlighter>
                </div>
                <div className="mt-auto pt-2">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Portable agent skills for automated remediation. Baselines allow adoption on legacy repos without noise.
                  </p>
                </div>
              </div>
           </div>
        </section>

        {/* Example Before / After */}
        <section className="p-6 sm:p-8 md:p-12 bg-white">
           <div className="mb-10 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">Findings Identity</h2>
            <p className="text-slate-600 font-medium sm:text-lg max-w-2xl text-center sm:text-left mx-auto sm:mx-0">
              Findings are prompts for review, not verdicts. Real output for <code className="text-emerald-700 font-mono text-sm bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold tracking-tight">php.empty-catch</code>.
            </p>
          </div>

           <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl">
            <div className="bg-white p-5 sm:p-6 border border-slate-200 rounded shadow-sm">
               <h4 className="font-mono text-xs text-slate-500 mb-4 tracking-wider font-semibold">src/Payments/Gateway.php</h4>
               <CodeBlock code={`try {
    $this->api->charge($card, $amount);
} catch (Throwable $e) {
    // something went wrong
}`} language="php" />
            </div>

            <div className="bg-amber-50/30 p-5 sm:p-6 border-l-[3px] border-l-amber-500 border border-slate-200 rounded shadow-sm flex flex-col">
               <h4 className="font-mono text-xs text-slate-500 mb-4 tracking-wider font-semibold">Detection Event</h4>
               <div className="font-mono text-xs text-slate-800 bg-white p-4 rounded border border-slate-200 shadow-sm flex-1">
                 <div className="text-amber-600 mb-3 font-bold text-[13px] flex items-center gap-1.5">
                    <span className="text-base leading-none mt-[-2px]">⚠</span> php.empty-catch
                 </div>
                 <div className="text-slate-700 mb-3">Message: Found empty PHP catch block</div>
                 <div className="text-slate-600 bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed">
                    Evidence: Swallows \`Throwable\` type without any statements in catch block. Occurred 1 time.
                 </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 bg-slate-100 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-[11px] font-mono text-slate-500 flex-none gap-3 text-center md:text-left">
        <div className="uppercase tracking-wider">DETERMINISTIC PIPELINE: Discover → Compute Facts → Apply Rules → Sort Findings → Persist Cache</div>
        <div>© voku/slop-scan | Stable Fingerprints for Review Consistency</div>
      </footer>
    </div>
  );
}
