export const PreviewPane = ({ originalUrl, redactedUrl }: { originalUrl: string; redactedUrl: string }) => (
  <div className="preview-container">
    <iframe src={originalUrl} title="Original Document" />
    <iframe src={redactedUrl} title="Redacted Document" />
  </div>
);
