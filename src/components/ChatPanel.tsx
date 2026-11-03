import { FormEvent, useState } from "react";
import { ArrowUp, LoaderCircle, Paperclip } from "lucide-react";
import type { ChatResponse } from "../types";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  sources?: ChatResponse["sources"];
}

interface ChatPanelProps {
  disabledReason?: string;
  onAsk: (question: string) => Promise<ChatResponse>;
}

export default function ChatPanel({
  disabledReason,
  onAsk,
}: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = question.trim();
    if (!prompt || sending) return;
    setQuestion("");
    setError("");
    setMessages((current) => [...current, { role: "user", text: prompt }]);
    setSending(true);
    try {
      const result = await onAsk(prompt);
      setMessages((current) => [
        ...current,
        { role: "assistant", text: result.answer, sources: result.sources },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "The question could not be answered.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-conversation">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state" role="status">
            <span className="empty-chat-illustration">
              <span><span /><span /></span>
              <i>✦</i>
            </span>
            <p>Start a conversation...</p>
            {disabledReason && (
              <span className="chat-prerequisite">{disabledReason}</span>
            )}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[85%] ${
                  message.role === "user"
                    ? "rounded-br-md bg-ink text-white"
                    : "rounded-bl-md bg-slate-50 text-ink"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.sources && message.sources.length > 0 && (
                  <details className="source-list">
                    <summary className="source-heading">
                      Sources ({message.sources.length})
                    </summary>
                    <div className="source-chips">
                      {message.sources.map((source) => (
                        <details
                          key={`${source.documentId}-${source.chunkIndex}`}
                          className="source-detail"
                        >
                          <summary>
                            [{source.reference}] {source.documentName}
                          </summary>
                          <p className="source-excerpt">
                            {source.excerpt}
                          </p>
                        </details>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="chat-loading">
            <LoaderCircle className="animate-spin text-brand" size={16} />
            Thinking through your question...
          </div>
        )}
        {error && (
          <div role="alert" className="chat-error">
            {error}
          </div>
        )}
      </div>

      <form onSubmit={(event) => void submit(event)} className="chat-composer">
        <button type="button" className="composer-attach" aria-label="Attach a document" disabled>
          <Paperclip size={16} />
        </button>
        <div className="composer-input-wrap">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            disabled={sending}
            maxLength={2000}
            placeholder="Ask anything about your documents or beyond..."
            aria-label="Ask the AI assistant anything"
          />
          <button
            type="submit"
            disabled={sending || !question.trim()}
            aria-label="Send question"
            className="composer-send"
          >
            {sending ? <LoaderCircle className="animate-spin" size={17} /> : <ArrowUp size={18} />}
          </button>
        </div>
      </form>
    </div>
  );
}
