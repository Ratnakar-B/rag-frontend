import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FileText,
  LockKeyhole,
  MessageCircle,
  Play,
  Search,
  Settings,
  Sparkles,
  Target,
  UploadCloud,
  Workflow,
  Zap,
} from "lucide-react";
import LoginPage from "./LoginPage";
import Workspace from "./Workspace";

const workspaceUrl = "/workspace";
const loginUrl = "/login";
const signupUrl = "/signup";

const capabilities = [
  {
    title: "Ask Questions",
    description: "Ask questions about your uploaded documents using natural language.",
  },
  {
    title: "Find Relevant Information",
    description: "Quickly locate useful details across lengthy documents.",
  },
  {
    title: "Get Contextual Answers",
    description: "Receive answers grounded in information retrieved from your files.",
  },
  {
    title: "Explore Your Documents",
    description: "Understand reports, research papers, manuals, policies, and more.",
  },
  {
    title: "Verify Sources",
    description: "See which document passages support an answer.",
  },
];

function ProductPreview() {
  return (
    <div className="landing-preview" aria-label="Preview of the document chat workspace">
      <div className="preview-window">
        <aside className="preview-sidebar">
          <div className="preview-logo"><LayersIcon /> <span>RAGMind <b>AI</b></span></div>
          <span className="preview-nav-item"><Workflow size={12} /> Dashboard</span>
          <span className="preview-nav-item"><FileText size={12} /> Documents</span>
          <span className="preview-nav-item active"><MessageCircle size={12} /> Chat with Documents</span>
        </aside>
        <div className="preview-main">
          <div className="preview-heading">
            <div>
              <strong>Chat with your documents</strong>
              <small>Get accurate answers grounded in your uploaded files.</small>
            </div>
            <span className="preview-online"><i /> Ready</span>
          </div>
          <div className="preview-question">What are the key findings in this report?</div>
          <div className="preview-answer">
            <span className="preview-bot"><Sparkles size={15} /></span>
            <div>
              <p>Based on the uploaded report, here are the key findings:</p>
              <ol>
                <li>Revenue increased over the previous quarter.</li>
                <li>Customer retention improved across key segments.</li>
                <li>Growth opportunities are highlighted in the report.</li>
              </ol>
              <div className="preview-source"><FileText size={11} /> Quarterly_Report.pdf <span>Page 4</span></div>
            </div>
          </div>
          <div className="preview-input"><span><UploadCloud size={13} /></span>Ask a question about your documents...<b><ArrowRight size={14} /></b></div>
        </div>
      </div>
      <div className="preview-files">
        <strong>Your Documents</strong>
        {["Quarterly_Report.pdf", "Product_Strategy.docx", "Market_Analysis.pdf"].map((file, index) => (
          <div className="preview-file" key={file}>
            <span className={`preview-file-icon file-${index}`}><FileText size={12} /></span>
            <span>{file}<small>{index + 2}.4 MB</small></span>
            <i>Indexed</i>
          </div>
        ))}
      </div>
      <div className="preview-pipeline">
        <strong><Workflow size={13} /> RAGMind AI</strong>
        <div className="preview-pipeline-steps">
          {["Upload", "Process", "Embed", "Store", "Search"].map((step) => (
            <span key={step}><i><Check size={9} /></i>{step}</span>
          ))}
        </div>
      </div>
      <span className="preview-orbit orbit-one" />
      <span className="preview-star star-one">✦</span>
      <span className="preview-star star-two">✦</span>
      <span className="preview-paper paper-one"><i /><i /><i /></span>
      <span className="preview-paper paper-two"><i /><i /><i /></span>
    </div>
  );
}

function LayersIcon() {
  return <span className="landing-logo-mark"><Workflow size={19} /></span>;
}

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <a className="landing-brand" href="#home" aria-label="RAGMind AI home">
          <LayersIcon />
          <span>RAGMind <b>AI</b></span>
        </a>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          {/* <a href="#use-cases">Use Cases</a> */}
          <a href="#faq">FAQ</a>
        </nav>
        <div className="landing-header-actions">
          <a className="button button-outline button-small" href={loginUrl}>Sign in</a>
          <a className="button button-gold button-small" href={signupUrl}>Get Started <ArrowRight size={14} /></a>
        </div>
      </header>

      <main>
        <section id="home" className="landing-hero">
          <div className="hero-content">
            <span className="landing-eyebrow"><Sparkles size={13} /> AI-Powered Document Intelligence</span>
            <h1>Turn Your Documents<br /><em>Into Answers</em></h1>
            <h2>Chat with your documents. Find insights faster.</h2>
            <p className="hero-description">
              Upload your documents and ask questions in natural language. Our AI-powered RAG platform finds relevant information from your files and generates answers based on their content, helping you find what you need without manually searching through pages of information.
            </p>
            <div className="hero-actions">
              <a className="button button-gold" href={signupUrl}>Get Started <ArrowRight size={16} /></a>
              <a className="button button-outline explore-button" href="#how-it-works"><Play size={15} /> Explore How It Works</a>
            </div>
            <div className="trust-points">
              <span><CheckCircle2 size={15} />Secure &amp; Private</span>
              <span><CheckCircle2 size={15} />Multiple File Formats</span>
              <span><CheckCircle2 size={15} />Accurate Answers</span>
              <span><CheckCircle2 size={15} />Source References</span>
            </div>
          </div>
          <ProductPreview />
        </section>

        <section id="features" className="info-cards">
          <div className="section-heading features-heading">
            <span className="landing-eyebrow"><Sparkles size={13} /> DOCUMENT INTELLIGENCE</span>
            <h2>Everything you need to work smarter</h2>
            <p>Understand your files, find the details, and get answers you can trust.</p>
          </div>
          <article className="info-card">
            <span className="info-icon"><FileText size={22} /></span>
            <h2>What is RAG?</h2>
            <p>
              Retrieval-Augmented Generation (RAG) retrieves relevant information from your documents and uses it to generate context-aware answers. Instead of relying only on general knowledge, the AI uses your document content to help answer your questions.
            </p>
          </article>
          <article id="use-cases" className="info-card">
            <span className="info-icon"><Settings size={22} /></span>
            <h2>What can you do with it?</h2>
            <ul className="capability-list">
              {capabilities.map((item) => (
                <li key={item.title}>
                  <Check size={12} />
                  <span><strong>{item.title}:</strong> {item.description}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="info-card">
            <span className="info-icon"><Target size={23} /></span>
            <h2>Why use this platform?</h2>
            <p className="why-copy">
              Spend less time searching and more time understanding. Whether you're reviewing business reports, studying research materials, or exploring technical documentation, find relevant information through a simple conversational interface.
            </p>
          </article>
        </section>

        <section id="how-it-works" className="how-section">
          <div className="section-heading">
            <span className="landing-eyebrow"><Zap size={13} /> SIMPLE BY DESIGN</span>
            <h2>From files to useful answers</h2>
            <p>Your documents move through a clear, secure retrieval workflow.</p>
          </div>
          <div className="how-steps">
            {[
              { title: "Upload", text: "Add PDF, DOCX, or TXT files.", icon: UploadCloud },
              { title: "Prepare", text: "Text is extracted and split into passages.", icon: FileText },
              { title: "Index", text: "Embeddings make passages searchable.", icon: Workflow },
              { title: "Ask", text: "Get grounded answers with source references.", icon: MessageCircle },
            ].map(({ title, text, icon: Icon }, index) => (
              <article className="how-step" key={title}>
                <span className="how-step-number">0{index + 1}</span>
                <span className="how-step-icon"><Icon size={20} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="pricing-note">
          <span className="pricing-icon"><LockKeyhole size={19} /></span>
          <div>
            <h2>Simple, transparent setup</h2>
            <p>Run the app with your own Gemini API key and MongoDB Atlas cluster. Provider usage or infrastructure charges may apply.</p>
          </div>
          <a className="button button-outline" href={loginUrl}>Open Workspace <ArrowRight size={14} /></a>
        </section>

        <section id="faq" className="faq-section">
          <div className="section-heading">
            <span className="landing-eyebrow"><CircleHelp size={13} /> GOOD TO KNOW</span>
            <h2>Frequently asked questions</h2>
          </div>
          <details>
            <summary>Which file types can I upload?<ChevronDown size={16} /></summary>
            <p>The workspace currently accepts PDF, DOCX, and TXT files up to the configured upload limit.</p>
          </details>
          <details>
            <summary>Where are my documents and API key stored?<ChevronDown size={16} /></summary>
            <p>The backend stores extracted passages and embeddings in your MongoDB database. The Gemini API key stays in the backend environment and is never sent to the browser.</p>
          </details>
          <details>
            <summary>Do answers include sources?<ChevronDown size={16} /></summary>
            <p>Answers include references to retrieved document passages. Open a source reference in the chat to inspect its excerpt.</p>
          </details>
        </section>

        <section className="landing-cta">
          <span className="cta-decoration cta-left"><FileText size={48} /></span>
          <span className="cta-decoration cta-right"><FileText size={48} /></span>
          <span className="landing-eyebrow">GET STARTED TODAY</span>
          <h2>Your documents. Your questions. Smarter answers.</h2>
          <p>Upload a document, start a conversation, and discover the information inside.</p>
          <div className="hero-actions">
            <a className="button button-gold" href={signupUrl}>Get Started <ArrowRight size={15} /></a>
            <a className="button button-outline explore-button" href="#how-it-works"><Play size={14} /> Explore How It Works</a>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <a className="landing-brand" href="#home"><LayersIcon /><span>RAGMind <b>AI</b></span></a>
        <p>Document-grounded answers, backed by your sources.</p>
        <span>Gemini · MongoDB Atlas</span>
      </footer>
    </div>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === workspaceUrl) return <Workspace />;
  if (path === loginUrl) return <LoginPage initialMode="login" />;
  if (path === "/signup") return <LoginPage initialMode="signup" />;
  return <LandingPage />;
}
