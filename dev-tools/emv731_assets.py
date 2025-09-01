"""
Extract images from the ZOLL EMV731 operator manual PDF and attach them to the
corresponding Markdown chapters as a Figures section.

Requirements:
  pip install pymupdf Pillow

Usage:
  python dev-tools/emv731_assets.py

It will:
  - Read Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf
  - Extract images per page into assets folders per chapter
  - Update the 11 chapter .md files to include a '## Figures' section with inline images

Page mapping is derived from Data/VentilationDetailsData.js pdfPage fields.
Edit CHAPTERS below to adjust ranges if chapter end pages change.
"""
from __future__ import annotations
import os
import re
from pathlib import Path

try:
    import fitz  # PyMuPDF
except Exception as e:
    raise SystemExit("PyMuPDF (fitz) is required. Install with: pip install pymupdf")

ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf"
BASE_DIR = ROOT / "Content/Skills & Equipment/Zoll EMV731"

# Chapter ID to file name + start page (1-based). End pages are inclusive.
CHAPTERS = [
    ("zoll-emv731-general-information",       "general-information.md",       7,   26),
    ("zoll-emv731-product-overview",          "product-overview.md",         27,  42),
    ("zoll-emv731-setting-up-the-ventilator", "setting-up-ventilator.md",    43,  56),
    ("zoll-emv731-using-the-ventilator",      "using-ventilator.md",         57,  80),
    ("zoll-emv731-alarms",                    "alarms.md",                    81, 112),
    ("zoll-emv731-operating-environments",    "operating-environments.md",    113, 120),
    ("zoll-emv731-maintenance",               "maintenance.md",              121, 130),
    ("zoll-emv731-specifications",            "specifications.md",           131, 138),
    ("zoll-emv731-accessories",               "accessories.md",              139, 142),
    ("zoll-emv731-pulse-oximeter-principles", "pulse-oximeter-principles.md",143, 144),
    ("zoll-emv731-patient-circuits",          "patient-circuits.md",         145, 9999),
]

ASSETS_DIR = BASE_DIR / "assets"

def extract_images():
    doc = fitz.open(PDF_PATH)
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    # Precompute page to chapter map
    page_to_ch = {}
    for cid, md, start, end in CHAPTERS:
        for p in range(start, min(end, doc.page_count)+1):
            page_to_ch[p] = (cid, md)

    saved = []
    for pno in range(1, doc.page_count+1):
        if pno not in page_to_ch:
            continue
        page = doc.load_page(pno-1)
        images = page.get_images(full=True)
        if not images:
            continue
        cid, md = page_to_ch[pno]
        out_dir = ASSETS_DIR / cid
        out_dir.mkdir(parents=True, exist_ok=True)
        for idx, img in enumerate(images, start=1):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            if pix.n > 4:  # CMYK
                pix = fitz.Pixmap(fitz.csRGB, pix)
            out_path = out_dir / f"page-{pno:03d}-img-{idx}.png"
            pix.save(out_path)
            saved.append((cid, md, out_path))
    return saved

FIGURES_HDR = "## Figures"

def update_md_figures():
    # Group saved images per chapter
    saved = extract_images()
    by_ch = {}
    for cid, md, path in saved:
        by_ch.setdefault((cid, md), []).append(path)

    for (cid, md), paths in by_ch.items():
        md_path = BASE_DIR / md
        if not md_path.exists():
            continue
        rel_paths = [str(p.relative_to(BASE_DIR)).replace('\\', '/') for p in sorted(paths)]
        figures_block = FIGURES_HDR + "\n\n" + "\n\n".join([f"![{Path(p).name}]({p})" for p in rel_paths]) + "\n"
        text = md_path.read_text(encoding='utf-8', errors='ignore')
        if FIGURES_HDR in text:
            # Replace existing Figures section
            pattern = re.compile(r"^##\s+Figures[\s\S]*?(?=^##\s|\Z)", re.MULTILINE)
            if pattern.search(text):
                text = pattern.sub(figures_block, text)
            else:
                # Edge case: header present but regex failed; append anyway
                text += "\n\n" + figures_block
        else:
            # Append at end
            text += "\n\n" + figures_block
        md_path.write_text(text, encoding='utf-8')

if __name__ == "__main__":
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF not found: {PDF_PATH}")
    update_md_figures()
    print("Images extracted and Markdown Figures sections updated.")

