import React from 'react';

type UploadZoneProps = {
  onFileSelect: (file: File | null) => void;
};

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileSelect(selectedFile);
  };

  return (
    <div className="upload-zone">
      <label htmlFor="file-upload" className="upload-label">
        Select a document to redact
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleChange}
        className="upload-input"
      />
    </div>
  );
}
