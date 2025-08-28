import { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ProgressBar } from './components/ProgressBar';
import { ScoreBadge } from './components/ScoreBadge';
import { PreviewPane } from './components/PreviewPane';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, ] = useState(0);
  const [score, ] = useState<'red' | 'yellow' | 'green' | null>(null);
  const [originalUrl, ] = useState('');
  const [redactedUrl, ] = useState('');

  return (
    <div className="container">
      <h1>AnonymousDoc AI</h1>
      <p className="subtitle">Privacy-first document redaction</p>

      <UploadZone onFileSelect={setFile} />

      {file && <ProgressBar progress={progress} />}
      {score && <ScoreBadge score={score} />}
      {originalUrl && redactedUrl && (
        <PreviewPane originalUrl={originalUrl} redactedUrl={redactedUrl} />
      )}
    </div>
  );
}

export default App;
