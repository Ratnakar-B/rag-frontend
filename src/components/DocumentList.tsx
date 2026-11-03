import { FileText, Trash2 } from "lucide-react";
import type { DocumentItem } from "../types";
import StatusBadge from "./StatusBadge";

interface DocumentListProps {
  documents: DocumentItem[];
  loading: boolean;
  onDelete: (document: DocumentItem) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({
  documents,
  loading,
  onDelete,
}: DocumentListProps) {
  return (
    <section className="dashboard-card document-list-card">
      <div className="card-heading document-list-heading">
        <div>
          <h2>Documents</h2>
          <p>{documents.length} {documents.length === 1 ? "file" : "files"} in your library</p>
        </div>
        <span className="document-ready-count">{documents.filter((document) => document.status === "ready").length} ready</span>
      </div>

      {loading ? (
        <div className="document-empty">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="document-empty">
          <span className="document-empty-icon">
            <FileText size={18} />
          </span>
          <p>Your library is empty</p>
          <small>Uploaded files will appear here.</small>
        </div>
      ) : (
        <ul className="document-list-items">
          {documents.map((document) => (
            <li key={document._id} className="document-list-item">
              <span className="document-file-icon">
                <FileText size={18} />
              </span>
              <div className="document-file-meta">
                <p title={document.name}>
                  {document.name}
                </p>
                <small>
                  {formatSize(document.size)}
                  {document.status === "ready" ? ` · ${document.chunkCount} passages` : ""}
                  {document.status === "error" && document.error ? ` · ${document.error}` : ""}
                </small>
              </div>
              <StatusBadge status={document.status} />
              <button
                type="button"
                aria-label={`Delete ${document.name}`}
                title="Delete document"
                onClick={() => onDelete(document)}
                className="document-delete"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
