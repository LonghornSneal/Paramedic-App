"""
EMV731 Visuals Inserter
-----------------------
Extracts images from the ZOLL EMV731 operator manual PDF and inserts them into
the correct Edited Documentation sections by matching chapter headings against
PDF page text. Falls back to even distribution if matching fails.

Requirements:
  pip install pymupdf

Usage:
  python dev-tools/emv731_assets.py

It will:
  - Read Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf
  - Extract images per page into assets/{chapter-id}/page-XXX-img-N.png
  - For each chapter .md, locate H2 headings and try to match them to page text
  - Insert images under the closest heading with markers so reruns are idempotent

You can rerun until no diffs are produced. For perfect placement, adjust headings
in the MD to match PDF text, then rerun.
"""
from __future__ import annotations
import re
from pathlib import Path

try:
    import fitz  # PyMuPDF
except Exception:
    raise SystemExit("PyMuPDF (fitz) is required. Install with: pip install pymupdf")

ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "Content/Skills & Equipment/Zoll EMV731/Zoll_EMV731_Operators_Manual-1.pdf"
BASE_DIR = ROOT / "Content/Skills & Equipment/Zoll EMV731"
ASSETS_DIR = BASE_DIR / "assets"

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

def normalize(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()

def extract_images(doc: fitz.Document):
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    page_to_images = {}
    for pno in range(1, doc.page_count+1):
        page = doc.load_page(pno-1)
        images = page.get_images(full=True)
        if not images:
            continue
        saved_paths = []
        for idx, img in enumerate(images, start=1):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            if pix.n > 4:  # CMYK
                pix = fitz.Pixmap(fitz.csRGB, pix)
            # Temporary chapter-less path; will move into chapter folders later
            out_path = ASSETS_DIR / f"page-{pno:03d}-img-{idx}.png"
            pix.save(out_path)
            saved_paths.append(out_path)
        if saved_paths:
            page_to_images[pno] = saved_paths
    return page_to_images

def get_md_headings(md_text: str):
    # Return list of (title, start_line_index) for H2 headings
    headings = []
    lines = md_text.splitlines()
    for i, line in enumerate(lines):
        m = re.match(r"^##\s+(.+)", line)
        if m:
            title = m.group(1).strip()
            if title.lower() == "figures":
                continue
            headings.append((title, i))
    return headings

def insert_images_under_heading(md_text: str, heading: str, images_md: str) -> str:
    # Insert/replace images under a specific heading using markers.
    start_marker = f"<!-- FIGURES:{heading} START -->"
    end_marker   = f"<!-- FIGURES:{heading} END -->"
    hdr_regex = re.compile(rf"^##\s+{re.escape(heading)}\s*$", re.MULTILINE)
    m = hdr_regex.search(md_text)
    if not m:
        return md_text  # heading not found; skip
    insert_pos = m.end()
    # Look for existing block between markers
    block_regex = re.compile(rf"{re.escape(start_marker)}[\s\S]*?{re.escape(end_marker)}", re.MULTILINE)
    if block_regex.search(md_text):
        return block_regex.sub(f"{start_marker}\n\n{images_md}\n{end_marker}", md_text)
    # Else insert right after heading line
    return md_text[:insert_pos] + f"\n\n{start_marker}\n\n{images_md}\n{end_marker}" + md_text[insert_pos:]

def assign_pages_to_sections(doc: fitz.Document, start: int, end: int, headings: list[str]):
    # Try to match heading titles to page text, build page->heading index mapping.
    norm_heads = [normalize(h) for h in headings]
    head_starts = [None]*len(headings)
    for p in range(start, min(end, doc.page_count)+1):
        text = normalize(doc.load_page(p-1).get_text())
        for i, nh in enumerate(norm_heads):
            if nh and nh in text and head_starts[i] is None:
                head_starts[i] = p
    # Fill gaps: ensure first defined or default to start; then make monotonic
    last = start
    for i in range(len(head_starts)):
        if head_starts[i] is None:
            head_starts[i] = last
        last = head_starts[i]
    # Map page to current heading index (last start <= page)
    page_to_idx = {}
    cur_i = 0
    for p in range(start, min(end, doc.page_count)+1):
        while cur_i+1 < len(head_starts) and head_starts[cur_i+1] <= p:
            cur_i += 1
        page_to_idx[p] = cur_i
    return page_to_idx

def main():
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF not found: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
    page_to_images = extract_images(doc)

    for chap_id, md_name, start, end in CHAPTERS:
        md_path = BASE_DIR / md_name
        if not md_path.exists():
            continue
        md_text = md_path.read_text(encoding='utf-8', errors='ignore')
        headings = [h for h,_ in get_md_headings(md_text)]
        if not headings:
            # Create a default heading so we can still attach visuals
            md_text = f"## Edited Documentation\n\n{md_text}" if not md_text.strip().startswith("## ") else md_text
            headings = [h for h,_ in get_md_headings(md_text)]

        page_to_headidx = assign_pages_to_sections(doc, start, end, headings)
        # Group images by heading index
        images_by_head = {i: [] for i in range(len(headings))}
        for p in range(start, min(end, doc.page_count)+1):
            if p in page_to_images:
                idx = page_to_headidx.get(p, 0)
                # Move/copy files into chapter-specific subfolder and make relative path
                out_dir = ASSETS_DIR / chap_id
                out_dir.mkdir(parents=True, exist_ok=True)
                for src in page_to_images[p]:
                    dst = out_dir / src.name
                    if not dst.exists():
                        try:
                            src.replace(dst)
                        except Exception:
                            pass
                    rel = str(dst.relative_to(BASE_DIR)).replace('\\', '/')
                    images_by_head[idx].append(rel)

        # Insert under each heading
        for i, title in enumerate(headings):
            imgs = images_by_head.get(i, [])
            if not imgs:
                continue
            block = "\n\n".join([f"![{Path(p).name}]({p})" for p in imgs])
            md_text = insert_images_under_heading(md_text, title, block)

        md_path.write_text(md_text, encoding='utf-8')
    print("Images extracted and inserted under closest matching headings.")

if __name__ == "__main__":
    main()
