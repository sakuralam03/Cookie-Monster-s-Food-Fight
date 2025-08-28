const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('upload-zone');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const scoreContainer = document.getElementById('score-container');
const scoreValue = document.getElementById('score-value');
const scoreIndicator = document.getElementById('score-indicator');
const previewContainer = document.getElementById('preview-container');
const originalPreview = document.getElementById('original-preview');
const redactedPreview = document.getElementById('redacted-preview');

fileInput.addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    simulateProcessing(file);
  }
}

function simulateProcessing(file) {
  progressContainer.classList.remove('hidden');
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressFill.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      showResults(file);
    }
  }, 300);
}

function showResults(file) {
  const score = Math.floor(Math.random() * 100);
  scoreContainer.classList.remove('hidden');
  scoreValue.textContent = score;

  if (score > 80) scoreIndicator.style.background = 'red';
  else if (score > 40) scoreIndicator.style.background = 'orange';
  else scoreIndicator.style.background = 'green';

  previewContainer.classList.remove('hidden');
  originalPreview.src = 'sample-original.pdf'; // Replace with actual file URL
  redactedPreview.src = 'sample-redacted.pdf'; // Replace with actual file URL
}

