/** Shared automatic-JEV policy. Best-effort only: unknown customer data cannot be reliably detected. */
const SENSITIVE = [
  /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/i,
  /\b(?:sk-(?:proj-)?[a-z0-9_-]{12,}|apikey_[a-z0-9_-]{8,}|gh[pousr]_[a-z0-9]{16,}|AKIA[A-Z0-9]{16})\b/i,
  /\b(?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|password|passwd|authorization)\b["']?\s*[:=]\s*["']?[^\s"',;}]{4,}/i,
  /\bBearer\s+[a-z0-9._~+/-]{8,}/i,
  /https?:\/\/[^\s/@:]+:[^\s/@]+@/i,
  /[?&](?:token|key|secret|password|signature|auth)=[^&#\s]{4,}/i,
  /(?:密钥|密码|令牌)\s*[:=：]\s*\S{4,}/,
  /\beyJ[a-z0-9_-]+\.eyJ[a-z0-9_-]+\.[a-z0-9_-]+\b/i,
  /(?:客户数据|客户名单|客户资料|保密|机密|个人身份证|customer\s+(?:data|records|list)|confidential|private\s+key)/i,
];

export function containsSensitiveContent(text: string): boolean {
  return SENSITIVE.some(pattern => pattern.test(text));
}

export function redactForJev(text: string, maxChars = 4000): string {
  // Redact on the complete string before truncation; never hide a secret from the sensitivity gate by truncating first.
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[ip]")
    .replace(/([?&](?:token|key|secret|password|signature|auth)=)[^&#\s]+/gi, "$1[redacted]")
    .replace(/(?:\/home\/|\/Users\/)[^/\s]+/g, "/home/[user]")
    .slice(0, maxChars);
}

export function isUnitConfidence(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}

/** Deadline and owner cancellation cover fetch AND body reading, even if an implementation ignores AbortSignal. */
export async function withJevDeadline<T>(
  operation: (signal: AbortSignal) => Promise<T>, timeoutMs: number, owner?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  let rejectAbort!: (error: Error) => void;
  const aborted = new Promise<never>((_resolve, reject) => { rejectAbort = reject; });
  const cancel = () => { controller.abort(); rejectAbort(new Error("JEV request canceled")); };
  const timer = setTimeout(() => { controller.abort(); rejectAbort(new Error("JEV request timed out")); }, timeoutMs);
  owner?.addEventListener("abort", cancel, { once: true });
  try {
    if (owner?.aborted) { cancel(); return await aborted; }
    return await Promise.race([Promise.resolve().then(() => operation(controller.signal)), aborted]);
  } finally {
    clearTimeout(timer);
    owner?.removeEventListener("abort", cancel);
  }
}
