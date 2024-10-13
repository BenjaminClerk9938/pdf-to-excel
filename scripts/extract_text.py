import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_path, output_text_path):
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text() + "  "  # Adding newline for separation
    with open(output_text_path, 'w') as file:
        file.write(full_text)

# Usage
pdf_path = "../data/input.pdf"
output_text_path = "../data/extracted_text.txt"
extract_text_from_pdf(pdf_path, output_text_path)
