const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('fileUpload');

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('drag-active');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-active');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-active');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    handleFileUpload(file);
  }
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type === 'application/pdf') {
    handleFileUpload(file);
  }
});

function handleFileUpload(file) {
  console.log('File uploaded:', file.name);
  // You can add preview, processing, or backend upload logic here
}
