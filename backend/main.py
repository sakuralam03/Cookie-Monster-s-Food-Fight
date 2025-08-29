from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import spacy
import fitz  # PyMuPDF
import re
import io
from typing import List, Dict, Any

# Initialize the FastAPI application
app = FastAPI(title="DocCookie API", description="API for analyzing document privacy.", version="1.0")

# Configure CORS to allow requests from the frontend
# In a hackathon, it's easiest to just allow all origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Change for production.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.).
    allow_headers=["*"],  # Allows all headers.
)

# Load the spaCy model. We'll use the medium English model.
# Run this command in your terminal AFTER installing spacy to download the model:
# python -m spacy download en_core_web_md
try:
    nlp = spacy.load("en_core_web_md")
except OSError:
    raise RuntimeError("Please download the spaCy model first. Run: `python -m spacy download en_core_web_md`")

# Define our sensitivity classification rules
VERY_PII_LABELS = ["PERSON"]  # Direct Identifiers

# Patterns for high-sensitivity data that spaCy might not catch
VERY_PII_PATTERNS = {
    "EMAIL": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    "PHONE": r'\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b',
    "SSN": r'\b\d{3}[-]?\d{2}[-]?\d{4}\b',
    "CREDIT_CARD": r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b',
    "IP_ADDRESS": r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'
}

INDIRECT_PII_LABELS = ["ORG", "GPE", "LOC", "FAC", "DATE"]  # Indirect Identifiers
# GPE (Countries, cities, states), LOC (Non-GPE locations), FAC (Buildings, airports)

# Note: Everything else will be classified as "not sensitive"
# spaCy has many labels (LAW, PRODUCT, EVENT, etc.). We can adjust these lists later.

@app.get("/")
def read_root():
    """A simple health check endpoint to see if the API is running."""
    return {"message": "DocCookie API is online! Send a PDF to /analyze."}

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)): # type: ignore
    """
    Analyze an uploaded PDF document for sensitive information.
    Returns a breakdown of findings categorized as 'spy', 'suspicious', or 'yummy'.
    """
    # 1. Validate that the uploaded file is a PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    try:
        # 2. Read the file contents into memory
        contents = await file.read()
        # Create a bytes stream that PyMuPDF can read
        pdf_stream = io.BytesIO(contents)
        
        # 3. Extract text from the PDF using PyMuPDF
        doc_text = ""
        with fitz.open(stream=pdf_stream, filetype="pdf") as pdf_doc:
            for page_num in range(len(pdf_doc)):
                page = pdf_doc[page_num]
                page_text = page.get_textpage().extractText()
                if page_text:
                    doc_text += page_text + "\n"
                # doc_text += page.get_text("text") + "\n"  # Extract as plain text
        
        # Quick check in case the PDF was image-based and had no extractable text
        if not doc_text.strip(): # type: ignore
            return {
                "cookie_score": {"too sensitive": 0, "moderately sensitive": 0, "not sensitive": 0},
                "findings": {"too sensitive": [], "moderately sensitive": [], "not sensitive": []},
                "message": "No text could be extracted from the PDF. It might be image-based."
            } # type: ignore

        # 4. Analyze the extracted text with spaCy
        nlp_doc = nlp(doc_text)

        # 5. Categorize the found entities into our sensitivity jars
        findings: Dict[str, List[Dict[str, Any]]] = {
            "too sensitive": [], 
            "moderately sensitive": [], 
            "not sensitive": []
            }

        # First, check with spaCy entities
        for ent in nlp_doc.ents:
            if ent.label_ in VERY_PII_LABELS:
                findings["too sensitive"].append({"text": ent.text, "label": ent.label_, "type": "entity"})
            elif ent.label_ in INDIRECT_PII_LABELS:
                findings["moderately sensitive"].append({"text": ent.text, "label": ent.label_, "type": "entity"})
            else:
                findings["not sensitive"].append({"text": ent.text, "label": ent.label_, "type": "entity"})

        # Second, check with regex patterns for high-sensitivity PII
        for pattern_name, pattern_regex in VERY_PII_PATTERNS.items():
            matches = re.finditer(pattern_regex, doc_text, re.IGNORECASE)
            for match in matches:
                # Add each match to the "too sensitive" category
                findings["too sensitive"].append({
                    "text": match.group(),
                    "label": pattern_name,
                    "type": "pattern"
                })
                
        # 5.5 Calculate a single sensitivity score (0-100)
        total_findings = len(findings["too sensitive"]) + len(findings["moderately sensitive"]) + len(findings["not sensitive"])

        if total_findings > 0:
            # Weight the findings: "too sensitive" counts much more than others
            weighted_score = (
                (len(findings["too sensitive"]) * 1.0) +  # High risk = full weight
                (len(findings["moderately sensitive"]) * 0.4) +  # Medium risk = partial weight
                (len(findings["not sensitive"]) * 0.1)  # Low risk = minimal weight
            )
            # Convert to percentage (capped at 100)
            sensitivity_score = min(100, int((weighted_score / total_findings) * 100))
        else:
            sensitivity_score = 0  # No findings = not sensitive
                
        # 6. Prepare the final response
        response = {
            "filename": file.filename,
            "sensitivity_score": sensitivity_score,
            "status": {
                "too sensitive": len(findings["too sensitive"]),
                "moderately sensitive": len(findings["moderately sensitive"]),
                "not sensitive": len(findings["not sensitive"])
            },
            "findings": findings
        }
        
        return response

    except Exception as e:
        # Catch any unexpected errors during processing
        raise HTTPException(status_code=500, detail=f"An error occurred during processing: {str(e)}")

# This block allows us to run the app with: `python main.py`
if __name__ == "__main__":
    import uvicorn
    # Runs the server on http://localhost:8000
    uvicorn.run(app, host="0.0.0.0", port=8000)