export default function DocumentPreview({ originalUrl, redactedUrl }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <iframe src={originalUrl} className="w-full h-96 border" title="Original Document" />
      <iframe src={redactedUrl} className="w-full h-96 border" title="Redacted Document" />
    </div>
  );
}
