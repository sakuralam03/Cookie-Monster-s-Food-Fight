import React, { useState } from 'react';
import UploadZone from '../components/UploadZone';
import ProgressBar from '../components/ProgressBar';
import DocumentPreview from '../components/DocumentPreview';
import SensitivityScore from '../components/SensitivityScore';

export default function Home() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(null);

  const simulateProcessing = () => {
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setScore(Math.floor(Math.random() * 100)); // Simulated score
      }
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">AnonymousDoc AI</h1>
      <UploadZone onFileUpload={(f) => { setFile(f); simulateProcessing(); }} />
      {file && <ProgressBar progress={progress} />}
      {score !== null && <SensitivityScore score={score} />}
      {progress === 100 && (
        <DocumentPreview
          originalUrl="/sample-original.pdf"
          redactedUrl="/sample-redacted.pdf"
        />
      )}
    </div>
  );
}
