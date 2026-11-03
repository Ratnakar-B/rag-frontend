import { useRef, useState } from "react";
import { FileUp, FileText, LoaderCircle, UploadCloud } from "lucide-react";

interface UploadPanelProps {
  maxUploadMb: number;
  uploading: boolean;
  onUpload: (file: File) => Promise<void>;
}

export default function UploadPanel({
  maxUploadMb,
  uploading,
  onUpload,
}: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  async function acceptFile(file?: File) {
    if (!file) return;
    const extension = file.name.toLowerCase().split(".").pop();
    if (!["pdf", "docx", "txt"].includes(extension || "")) {
      setError("Choose a PDF, DOCX, or TXT file.");
      return;
    }
    if (file.size > maxUploadMb * 1024 * 1024) {
      setError(`This file is larger than ${maxUploadMb} MB.`);
      return;
    }
    setError("");
    await onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section className="dashboard-card upload-card">
      <div className="card-heading">
        <div className="card-heading-icon"><FileUp size={19} /></div>
        <div>
          <h2>Upload Documents</h2>
          <p>Add your files and build a knowledge base</p>
        </div>
      </div>
      <button
        type="button"
        className={`upload-dropzone ${
          dragging
            ? "drag-active"
            : ""
        } ${uploading ? "uploading" : ""}`}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void acceptFile(event.dataTransfer.files[0]);
        }}
      >
        {uploading ? (
          <LoaderCircle className="animate-spin text-brand" size={25} />
        ) : (
          <span className="upload-cloud-icon">
            <UploadCloud size={28} />
          </span>
        )}
        <span className="upload-main-label">
          {uploading ? "Processing your document..." : "Drop a file here or browse"}
        </span>
        <span className="upload-sub-label">
          PDF, DOCX, or TXT · up to {maxUploadMb} MB
        </span>
      </button>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(event) => void acceptFile(event.target.files?.[0])}
      />
      <div className="upload-formats" aria-label="Supported formats">
        <span className="format-chip pdf"><i />PDF</span>
        <span className="format-chip docx"><i />DOCX</span>
        <span className="format-chip txt"><i />TXT</span>
      </div>
      {error && <p role="alert" className="upload-error">{error}</p>}
    </section>
  );
}
