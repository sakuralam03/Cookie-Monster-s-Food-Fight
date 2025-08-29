import React from 'react';
import { analyzeDocument } from "../api"; // ⬅ add this at top


type UploadZoneProps = {
  onFileSelect: (file: File) => void;
};

export function UploadZone({ onFileSelect }: UploadZoneProps) {

const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
      if (selectedFile){
        onFileSelect(selectedFile);
      }
    }


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
