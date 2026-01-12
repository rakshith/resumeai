#!/usr/bin/env python3
"""
PDF text extraction script using PyPDF2.
Reads PDF from stdin (base64 encoded) and outputs extracted text to stdout.
"""

import sys
import base64
import io

try:
    from pypdf import PdfReader
except ImportError:
    try:
        from PyPDF2 import PdfReader
    except ImportError:
        print("ERROR: Please install pypdf: pip install pypdf", file=sys.stderr)
        sys.exit(1)


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text from PDF bytes."""
    pdf_file = io.BytesIO(pdf_bytes)
    reader = PdfReader(pdf_file)
    
    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)
    
    return "\n".join(text_parts)


def main():
    # Read base64 encoded PDF from stdin
    base64_input = sys.stdin.read().strip()
    
    if not base64_input:
        print("ERROR: No input received", file=sys.stderr)
        sys.exit(1)
    
    try:
        pdf_bytes = base64.b64decode(base64_input)
    except Exception as e:
        print(f"ERROR: Failed to decode base64: {e}", file=sys.stderr)
        sys.exit(1)
    
    try:
        text = extract_text_from_pdf(pdf_bytes)
        print(text)
    except Exception as e:
        print(f"ERROR: Failed to extract text: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
