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

  const color = score >= 70 ? 'crimson' : score >= 30 ? 'gold' : 'limegreen';
  scoreIndicator.style.backgroundColor = color;
}

function renderFindings(findings) {
  const container = document.getElementById('findings-container');
  container.innerHTML = '';
  ['too sensitive', 'moderately sensitive', 'not sensitive'].forEach(level => {
    findings[level].forEach(item => {
      const div = document.createElement('div');
      div.textContent = `[${level}] ${item.text} (${item.label})`;
      container.appendChild(div);
    });
  });
  showElement('findings-container');
}

async function analyzePDF(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("http://localhost:8000/analyze", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  return await res.json();
}

async function fetchRedactedPDF() {
  const res = await fetch("http://localhost:8000/export");
  if (!res.ok) throw new Error("Redacted PDF fetch failed");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  showElement('progress-container');
  updateProgressBar(20);

  try {
    const result = await analyzePDF(file);
    updateProgressBar(70);
    showElement('score-container');
    updateScoreBadge(result.sensitivity_score);
    renderFindings(result.findings);

    document.getElementById('original-preview').src = URL.createObjectURL(file);
    const redactedUrl = await fetchRedactedPDF();
    document.getElementById('redacted-preview').src = redactedUrl;

    showElement('preview-container');
    updateProgressBar(100);
  } catch (err) {
    console.error(err);
    alert("Something went wrong during analysis.");
    updateProgressBar(0);
  }
});
