import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Database,
  FileStack,
  Home,
  Layers3,
  Lightbulb,
  LogOut,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import {
  askQuestion,
  deleteDocument,
  getCurrentUser,
  getDocuments,
  getHealth,
  signOut,
  uploadDocument,
  type AuthUser,
} from "./api";
import ChatPanel from "./components/ChatPanel";
import DocumentList from "./components/DocumentList";
import UploadPanel from "./components/UploadPanel";
import type { ApiHealth, DocumentItem } from "./types";

const workspaceLinks = [
  { id: "overview", label: "Dashboard", icon: Home },
  { id: "knowledge-base", label: "Knowledge Base", icon: BookOpen },
];
const workspaceSections = new Set(workspaceLinks.map(({ id }) => id));

function getWorkspaceSection(hash: string): string {
  const section = hash.replace(/^#/, "");
  if (section === "documents" || section === "upload") return "knowledge-base";
  if (section === "chat") return "overview";
  return workspaceSections.has(section) ? section : "overview";
}

function Workspace() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [chatOpen, setChatOpen] = useState(() => window.location.hash === "#chat");
  const [activeSection, setActiveSection] = useState(() => getWorkspaceSection(window.location.hash));

  useEffect(() => {
    function syncActiveSection() {
      setActiveSection(getWorkspaceSection(window.location.hash));
      if (window.location.hash === "#chat") setChatOpen(true);
    }

    window.addEventListener("hashchange", syncActiveSection);
    return () => window.removeEventListener("hashchange", syncActiveSection);
  }, []);

  useEffect(() => {
    if (!chatOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setChatOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [chatOpen]);

  const refresh = useCallback(async () => {
    const [nextDocuments, nextHealth] = await Promise.all([getDocuments(), getHealth()]);
    setDocuments(nextDocuments);
    setHealth(nextHealth);
    setPageError("");
  }, []);

  useEffect(() => {
    void getCurrentUser()
      .then(async (currentUser) => {
        if (!currentUser) {
          window.location.replace("/login");
          return;
        }
        setUser(currentUser);
        await refresh();
      })
      .catch((error: unknown) => {
        setPageError(error instanceof Error ? error.message : "Unable to connect to the API.");
      })
      .finally(() => setLoadingDocuments(false));
  }, [refresh]);

  const readyDocuments = useMemo(
    () => documents.filter((document) => document.status === "ready"),
    [documents],
  );
  const totalChunks = useMemo(
    () => readyDocuments.reduce((sum, document) => sum + document.chunkCount, 0),
    [readyDocuments],
  );
  const successRate = documents.length
    ? Math.round((readyDocuments.length / documents.length) * 100)
    : 0;
  const vectorReady = health?.vectorSearch.status === "ready";
  const chatDisabledReason =
    readyDocuments.length === 0
      ? "I can answer general questions. Upload a document for document-specific answers."
      : !vectorReady
        ? "Document search is not ready, but I can still answer general questions."
        : undefined;
  const visibleDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? documents.filter((document) => document.name.toLowerCase().includes(query))
      : documents;
  }, [documents, search]);
  const profileName = user?.name.trim() || user?.email || "";
  const profileInitials = profileName
    .split("@")[0]
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  async function handleUpload(file: File) {
    setUploading(true);
    setPageError("");
    const temporaryId = `processing-${Date.now()}`;
    const temporaryDocument: DocumentItem = {
      _id: temporaryId,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      status: "processing",
      chunkCount: 0,
      createdAt: new Date().toISOString(),
    };
    setDocuments((current) => [temporaryDocument, ...current]);

    try {
      const created = await uploadDocument(file);
      setDocuments((current) => [created, ...current.filter((item) => item._id !== temporaryId)]);
      await refresh();
    } catch (error) {
      setDocuments((current) => current.filter((item) => item._id !== temporaryId));
      const uploadMessage = error instanceof Error ? error.message : "Document upload failed.";
      setPageError(uploadMessage);
      try {
        setDocuments(await getDocuments());
      } catch (refreshError) {
        const refreshMessage =
          refreshError instanceof Error ? refreshError.message : "Unable to refresh documents.";
        setPageError(`${uploadMessage} ${refreshMessage}`);
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(document: DocumentItem) {
    if (!window.confirm(`Delete "${document.name}" and its indexed passages?`)) return;
    try {
      await deleteDocument(document._id);
      setDocuments((current) => current.filter((item) => item._id !== document._id));
      setPageError("");
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Document could not be deleted.");
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      window.location.replace("/login");
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Unable to sign out.");
    }
  }

  return (
    <div className={`dashboard-shell min-h-screen text-ink ${activeSection === "knowledge-base" ? "knowledge-base-active" : ""}`}>
      <aside className="dashboard-sidebar">
        <a href="#overview" className="brand-lockup" aria-label="RAGMind AI dashboard">
          <span className="brand-mark"><Layers3 size={25} strokeWidth={2.5} /></span>
          <span>
            <strong>RAGMind AI</strong>
            <small>Build. Index. Ask.</small>
          </span>
        </a>

        <p className="sidebar-label">Workspace</p>
        <nav className="sidebar-nav" aria-label="Workspace navigation">
          {workspaceLinks.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              className={`sidebar-link ${activeSection === id ? "active" : ""}`}
              href={`#${id}`}
              aria-current={activeSection === id ? "page" : undefined}
              title={label}
              onClick={() => setActiveSection(id)}
            >
              <Icon size={17} />
              {label}
            </a>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="powered-card">
          <Sparkles size={16} className="text-amber-500" />
          <span className="powered-caption">Your intelligent</span>
          <strong>RAG Assistant</strong>
          <small>Smart. Accurate. Reliable.</small>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <label className="global-search">
            <Search size={16} />
            <input
              aria-label="Search documents"
              placeholder="Search documents, queries..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                if (event.target.value && activeSection !== "knowledge-base") {
                  window.location.hash = "knowledge-base";
                  setActiveSection("knowledge-base");
                }
              }}
            />
            <kbd>Ctrl K</kbd>
          </label>
          <div className="topbar-actions">
            <span className={`api-pill ${health ? "connected" : "disconnected"}`}>
              <span className="status-dot" />
              {health ? "API Connected" : "API Disconnected"}
            </span>
            <details className="account-menu">
              <summary
                className="topbar-profile"
                aria-label={profileName ? `Account menu for ${profileName}` : "Account menu"}
              >
                <span className="profile-avatar" aria-hidden="true">
                  {profileInitials || "U"}
                </span>
                <span className="topbar-profile-details">
                  {profileName && <strong>{profileName}</strong>}
                  {user?.name.trim() && user.email && <small>{user.email}</small>}
                </span>
              </summary>
              <div className="account-menu-popover">
                <div className="account-menu-identity">
                  {profileName && <strong>{profileName}</strong>}
                  {user?.name.trim() && user.email && <small>{user.email}</small>}
                </div>
                <button
                  type="button"
                  className="account-menu-signout"
                  onClick={() => void handleSignOut()}
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </details>
          </div>
        </header>

        <div className={`dashboard-content ${activeSection === "knowledge-base" ? "knowledge-base-content" : ""}`}>
          {pageError && (
            <div role="alert" className="dashboard-error">
              <CircleHelp size={17} />
              <span>{pageError}</span>
              <button type="button" onClick={() => void refresh().catch((error: unknown) => setPageError(error instanceof Error ? error.message : "Unable to refresh."))}>
                Retry
              </button>
            </div>
          )}

          <section
            id="overview"
            className="workspace-panel dashboard-overview"
            aria-labelledby="dashboard-title"
            hidden={activeSection !== "overview"}
          >
            <section className="hero-banner">
              <div className="hero-copy">
                <span className="hero-eyebrow">YOUR AI KNOWLEDGE WORKSPACE</span>
                <h1 id="dashboard-title">RAGMind AI</h1>
                <p>Upload your documents, build knowledge, and ask anything!</p>
                <div className="hero-steps">
                  <a href="#upload"><UploadCloud size={15} />Upload Files</a>
                  <a href="#pipeline"><Zap size={15} />Build Index</a>
                  <button type="button" onClick={() => setChatOpen(true)}><MessageSquare size={15} />Ask Questions</button>
                </div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="art-glow" />
                <span className="art-spark spark-one">✦</span>
                <span className="art-spark spark-two">✦</span>
                <span className="art-document document-left"><i /><i /><i /></span>
                <span className="art-database"><Database size={54} strokeWidth={1.5} /></span>
                <span className="art-document document-right"><i /><i /><i /></span>
                <span className="art-search"><Search size={16} />Ask about your documents...</span>
              </div>
            </section>

            <section id="analytics" className="metrics-grid" aria-label="Workspace overview">
              <article className="metric-tile">
                <span className="metric-icon gold"><FileStack size={19} /></span>
                <span className="metric-copy"><small>Total Documents</small><strong>{loadingDocuments ? "—" : documents.length}</strong></span>
                <span className="metric-detail">{readyDocuments.length} ready</span>
                <ArrowUpRight className="metric-trend positive" size={16} />
              </article>
              <article className="metric-tile">
                <span className="metric-icon green"><CheckCircle2 size={20} /></span>
                <span className="metric-copy"><small>Processing Success</small><strong>{loadingDocuments ? "—" : `${successRate}%`}</strong></span>
                <span className="metric-detail">of documents</span>
                {successRate === 100 && documents.length > 0
                  ? <ArrowUpRight className="metric-trend positive" size={16} />
                  : <Activity className="metric-trend neutral" size={16} />}
              </article>
              <article className="metric-tile">
                <span className="metric-icon violet"><Search size={20} /></span>
                <span className="metric-copy"><small>Indexed Passages</small><strong>{loadingDocuments ? "—" : totalChunks}</strong></span>
                <span className="metric-detail">in knowledge base</span>
                <Database className="metric-trend neutral" size={16} />
              </article>
              <article className="metric-tile">
                <span className="metric-icon blue"><Clock3 size={20} /></span>
                <span className="metric-copy"><small>Vector Search</small><strong className="metric-status">{vectorReady ? "Active" : "Setup needed"}</strong></span>
                <span className="metric-detail">{vectorReady ? "Atlas connected" : "Atlas index"}</span>
                {vectorReady
                  ? <ArrowDownRight className="metric-trend positive" size={16} />
                  : <CircleHelp className="metric-trend neutral" size={16} />}
              </article>
            </section>

          <section id="pipeline" className="dashboard-card pipeline-card">
            <div className="card-heading">
              <div>
                <h2>Pipeline Status</h2>
                <p>Document processing stages</p>
              </div>
              <span className={`pipeline-badge ${vectorReady && readyDocuments.length ? "complete" : "pending"}`}>
                {vectorReady && readyDocuments.length ? "Completed" : "Ready to start"}
                {vectorReady && readyDocuments.length ? <Check size={13} /> : <Clock3 size={13} />}
              </span>
            </div>
            <div className="pipeline-stages">
              {[
                { label: "Upload\nFile", done: documents.length > 0 },
                { label: "Extract\nContent", done: readyDocuments.length > 0 },
                { label: "Split\nChunks", done: readyDocuments.length > 0 },
                { label: "Generate\nEmbeddings", done: readyDocuments.length > 0 },
                { label: "Store in\nVector DB", done: vectorReady && readyDocuments.length > 0 },
              ].map((stage, index) => (
                <div className={`pipeline-stage ${stage.done ? "done" : ""}`} key={stage.label}>
                  <span className="stage-marker">{stage.done ? <Check size={13} /> : index + 1}</span>
                  <span>{stage.label.split("\n").map((line) => <span key={line}>{line}</span>)}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="dashboard-support-grid">
            <aside id="help" className="pro-tip">
              <span className="tip-icon"><Lightbulb size={20} /></span>
              <span><strong>Pro Tip</strong><small>Ask specific questions for better results, e.g. “Summarize this document”.</small></span>
            </aside>

            <section id="settings" className="setup-note">
              <ShieldCheck size={17} />
              <span>{health?.vectorSearch.message || "Checking database and vector search status..."}</span>
            </section>
          </div>
          </section>

          <section
            id="knowledge-base"
            className="workspace-panel knowledge-base-panel"
            aria-labelledby="knowledge-base-title"
            hidden={activeSection !== "knowledge-base"}
          >
            <div className="workspace-section-heading">
              <span className="workspace-section-icon"><BookOpen size={22} /></span>
              <div>
                <h1 id="knowledge-base-title">Knowledge Base</h1>
                <p>Upload, organize, and manage the documents your assistant can search.</p>
              </div>
            </div>
            <div className="knowledge-base-grid">
              <div id="upload" className="anchor-section">
                <UploadPanel maxUploadMb={health?.maxUploadMb || 10} uploading={uploading} onUpload={handleUpload} />
              </div>
              <DocumentList
                documents={visibleDocuments}
                loading={loadingDocuments}
                onDelete={(document) => void handleDelete(document)}
              />
            </div>
            <section className="setup-note knowledge-base-status">
              <ShieldCheck size={17} />
              <span>{health?.vectorSearch.message || "Checking database and vector search status..."}</span>
            </section>
          </section>

          <footer className="dashboard-footer">
            <span>RAGMind AI · Document-grounded answers</span>
            <span><Wifi size={13} /> Secure workspace</span>
          </footer>
        </div>
      </main>

      <div
        id="chatbot-modal"
        className="chatbot-overlay"
        hidden={!chatOpen}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setChatOpen(false);
        }}
      >
        <section
          className="chatbot-window"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
        >
          <header className="chatbot-header">
            <span className="chatbot-avatar"><Bot size={20} /></span>
            <span className="chatbot-heading">
              <strong id="chatbot-title">RAG Assistant</strong>
              <small>Ask about your documents</small>
            </span>
            <button
              type="button"
              className="chatbot-close"
              aria-label="Close chat"
              onClick={() => setChatOpen(false)}
            >
              <X size={19} />
            </button>
          </header>
          <ChatPanel disabledReason={chatDisabledReason} onAsk={askQuestion} />
        </section>
      </div>

      <button
        type="button"
        className="chatbot-launcher"
        aria-label="Open chat assistant"
        aria-haspopup="dialog"
        aria-expanded={chatOpen}
        hidden={chatOpen}
        onClick={() => setChatOpen(true)}
      >
        <img src="/ai-chat-logo.png" alt="" aria-hidden="true" />
      </button>
    </div>
  );
}

export default Workspace;
