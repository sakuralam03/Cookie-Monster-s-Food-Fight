from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import spacy, fitz, re, io
from typing import List, Dict, Any

app = FastAPI(title="DocCookie API", version="1.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp = spacy.load("en_core_web_md")

VERY_PII_LABELS = ["PERSON"]
VERY_PII_PATTERNS = {
    "EMAIL": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
    "PHONE": r'\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b',
}
INDIRECT_PII_LABELS = ["ORG", "GPE", "LOC", "FAC", "DATE"]

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type.")

    contents = await file.read()
    pdf_stream = io.BytesIO(contents)
    doc_text = ""
    with fitz.open(stream=pdf_stream, filetype="pdf") as pdf_doc:
        for page in pdf_doc:
            doc_text += page.get_textpage().extractText() + "\n"

    if not doc_text.strip():
        return {"sensitivity_score": 0, "findings": {}, "message": "No text extracted."}

    nlp_doc = nlp(doc_text)
    findings = {"too sensitive": [], "moderately sensitive": [], "not sensitive": []}

    for ent in nlp_doc.ents:
        if ent.label_ in VERY_PII_LABELS:
            findings["too sensitive"].append({"text": ent.text, "label": ent.label_, "type": "entity"})
        elif ent.label_ in INDIRECT_PII_LABELS:
            findings["moderately sensitive"].append({"text": ent.text, "label": ent.label_, "type": "entity"})
        else:
            findings["not sensitive"].append({"text": ent.text, "label": ent.label_, "type": "entity"})

    for name, pattern in VERY_PII_PATTERNS.items():
        for match in re.finditer(pattern, doc_text, re.IGNORECASE):
            findings["too sensitive"].append({"text": match.group(), "label": name, "type": "pattern"})

    total = sum(len(v) for v in findings.values())
    score = int(min(100, (
        len(findings["too sensitive"]) * 1.0 +
        len(findings["moderately sensitive"]) * 0.4 +
        len(findings["not sensitive"]) * 0.1
    ) / total * 100)) if total else 0

    # Save original file for redaction use
    with open("original.pdf", "wb") as f:
        f.write(contents)

    return {"sensitivity_score": score, "findings": findings}

@app.get("/export")
def export_redacted():
    try:
        pdf_doc = fitz.open("original.pdf")
        for page in pdf_doc:
            text_instances = page.search_for("John")  # Example: redact "John"
            for inst in text_instances:
                page.add_redact_annot(inst, fill=(0, 0, 0))
            page.apply_redactions()

        output = io.BytesIO()
        pdf_doc.save(output)
        output.seek(0)
        return StreamingResponse(output, media_type="application/pdf", headers={"Content-Disposition": "inline; filename=redacted.pdf"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
