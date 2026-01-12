from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
import io

app = FastAPI(title="PDF Parser API")

# Enable CORS for Next.js (development and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in production (or restrict to your Vercel domain)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    """Extract text from uploaded PDF file."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        reader = PdfReader(pdf_file)
        
        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        
        extracted_text = "\n".join(text_parts)
        
        if not extracted_text.strip():
            raise HTTPException(
                status_code=400, 
                detail="Could not extract text. The PDF may be scanned or image-based."
            )
        
        return {"text": extracted_text, "pages": len(reader.pages)}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
