import { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ProgressBar } from './components/ProgressBar';
import { ScoreBadge } from './components/ScoreBadge';
import { PreviewPane } from './components/PreviewPane';
import { analyzeDocument, AnalyzeResponse } from "./api";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState<'red' | 'yellow' | 'green' | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [redactedUrl, setRedactedUrl] = useState('');  
  const [loading, setLoading] = useState(false);

    const handleFileSelect = async (file: File) => {
    setFile(file);
    setProgress(10);
    setLoading(true);

    try {
      const result: AnalyzeResponse = await analyzeDocument(file);
      console.log("Backend result:", result);

      // Map numeric sensitivity_score → color
      if (result.sensitivity_score > 80) {
        setScore("red");
      } else if (result.sensitivity_score > 40) {
        setScore("yellow");
      } else {
        setScore("green");
      }

      // Keep original PDF for preview
      setOriginalUrl(URL.createObjectURL(file));

      // 🔴 placeholder: backend doesn’t yet return redacted PDF,
      // so for now we’ll just reuse original
      setRedactedUrl(URL.createObjectURL(file));

      setProgress(100);
    } catch (err) {
      console.error("Error analyzing document:", err);
    } finally {
      setLoading(false);
    }
  };

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
