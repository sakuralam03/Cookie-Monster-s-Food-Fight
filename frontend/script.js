// Utility functions
function showElement(id) {
  document.getElementById(id).classList.remove('hidden');
}

function updateProgressBar(percent) {
  const fill = document.getElementById('progress-fill');
  fill.style.width = `${percent}%`;
  fill.textContent = `${percent}%`;
}

function updateScoreBadge(score) {
  const scoreValue = document.getElementById('score-value');
  const scoreIndicator = document.getElementById('score-indicator');

  scoreValue.textContent = score;

  const colors = {
    red: 'crimson',
    yellow: 'gold',
    green: 'limegreen'
  };

  scoreIndicator.style.backgroundColor = colors[score] || 'gray';
}

// Main logic
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  console.log('File selected:', file);

  // Show progress bar and simulate progress
  showElement('progress-container');
  updateProgressBar(50); // Simulate 50% progress

  // Show score badge
  showElement('score-container');
  updateScoreBadge('yellow'); // Simulate score

  // Show preview pane
  showElement('preview-container');
  document.getElementById('original-preview').src = '/sample.pdf';
  document.getElementById('redacted-preview').src = '/redacted.pdf';
});
