import { writeFile, mkdir } from "fs/promises";
import { resolve } from "path";

const variants = [
  {
    slug: "violet-grid",
    title: "Adult Protocol Detail Experiment v11 Option 01",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;600&display=swap');",
    fontBody: "\"IBM Plex Sans\", sans-serif",
    fontDisplay: "\"Space Grotesk\", sans-serif",
    colors: {
      ink: "#1c2235",
      muted: "#4b5671",
      page: "#f5f3fb",
      panel: "#ffffff",
      tier1: "#1f2a44",
      tier2: "#1d4ed8",
      tier3: "#312e81",
      tier1Accent: "#7c3aed",
      tier1AccentRgb: "124, 58, 237",
      tier2Accent: "#db2777",
      tier2AccentRgb: "219, 39, 119",
      tier3Accent: "#dbeafe",
      tier3AccentRgb: "219, 234, 254",
      panelBorder: "rgba(28, 34, 53, 0.12)",
      lineBorder: "rgba(28, 34, 53, 0.12)",
      shadow: "0 18px 40px rgba(24, 30, 55, 0.18)"
    },
    layout: {
      panelRadius: "18px",
      lineRadius: "12px",
      accentBar: "6px",
      layoutGap: "18px",
      gridGap: "10px",
      popoverWidth: "72%"
    },
    background: {
      bg1: "radial-gradient(620px 280px at 8% 10%, rgba(124, 58, 237, 0.28), transparent 60%)",
      bg2: "radial-gradient(520px 260px at 92% 14%, rgba(37, 99, 235, 0.26), transparent 60%)",
      bg3: "radial-gradient(720px 360px at 70% 90%, rgba(219, 39, 119, 0.24), transparent 60%)",
      bg4: "repeating-linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0 12px, transparent 12px 28px)"
    }
  },
  {
    slug: "crimson-shift",
    title: "Adult Protocol Detail Experiment v11 Option 02",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sora:wght@400;600&display=swap');",
    fontBody: "\"Sora\", sans-serif",
    fontDisplay: "\"Bebas Neue\", sans-serif",
    colors: {
      ink: "#1f2134",
      muted: "#5b6078",
      page: "#f7f2f7",
      panel: "#ffffff",
      tier1: "#2a1f3f",
      tier2: "#4f46e5",
      tier3: "#7c3aed",
      tier1Accent: "#e11d48",
      tier1AccentRgb: "225, 29, 72",
      tier2Accent: "#2563eb",
      tier2AccentRgb: "37, 99, 235",
      tier3Accent: "#fbcfe8",
      tier3AccentRgb: "251, 207, 232",
      panelBorder: "rgba(42, 31, 63, 0.12)",
      lineBorder: "rgba(42, 31, 63, 0.12)",
      shadow: "0 18px 38px rgba(31, 33, 52, 0.18)"
    },
    layout: {
      panelRadius: "16px",
      lineRadius: "10px",
      accentBar: "8px",
      layoutGap: "18px",
      gridGap: "10px",
      popoverWidth: "74%"
    },
    background: {
      bg1: "radial-gradient(640px 300px at 12% 10%, rgba(225, 29, 72, 0.28), transparent 62%)",
      bg2: "radial-gradient(520px 260px at 90% 18%, rgba(79, 70, 229, 0.24), transparent 60%)",
      bg3: "radial-gradient(760px 360px at 70% 88%, rgba(37, 99, 235, 0.22), transparent 60%)",
      bg4: "repeating-linear-gradient(125deg, rgba(124, 58, 237, 0.08) 0 10px, transparent 10px 26px)"
    }
  },
  {
    slug: "indigo-fog",
    title: "Adult Protocol Detail Experiment v11 Option 03",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Manrope:wght@400;600&display=swap');",
    fontBody: "\"Manrope\", sans-serif",
    fontDisplay: "\"Archivo Black\", sans-serif",
    colors: {
      ink: "#1a2035",
      muted: "#4a546d",
      page: "#f2f4fb",
      panel: "#ffffff",
      tier1: "#1f2a46",
      tier2: "#1e40af",
      tier3: "#4c1d95",
      tier1Accent: "#6366f1",
      tier1AccentRgb: "99, 102, 241",
      tier2Accent: "#ef4444",
      tier2AccentRgb: "239, 68, 68",
      tier3Accent: "#e0e7ff",
      tier3AccentRgb: "224, 231, 255",
      panelBorder: "rgba(26, 32, 53, 0.12)",
      lineBorder: "rgba(26, 32, 53, 0.12)",
      shadow: "0 18px 38px rgba(26, 32, 53, 0.18)"
    },
    layout: {
      panelRadius: "20px",
      lineRadius: "12px",
      accentBar: "6px",
      layoutGap: "20px",
      gridGap: "12px",
      popoverWidth: "70%"
    },
    background: {
      bg1: "radial-gradient(620px 280px at 10% 12%, rgba(99, 102, 241, 0.28), transparent 62%)",
      bg2: "radial-gradient(520px 260px at 88% 16%, rgba(30, 64, 175, 0.25), transparent 60%)",
      bg3: "radial-gradient(760px 360px at 70% 88%, rgba(239, 68, 68, 0.2), transparent 60%)",
      bg4: "repeating-linear-gradient(145deg, rgba(76, 29, 149, 0.07) 0 14px, transparent 14px 30px)"
    }
  },
  {
    slug: "royal-veil",
    title: "Adult Protocol Detail Experiment v11 Option 04",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Work+Sans:wght@400;600&display=swap');",
    fontBody: "\"Work Sans\", sans-serif",
    fontDisplay: "\"Playfair Display\", serif",
    colors: {
      ink: "#211e33",
      muted: "#534f6d",
      page: "#f4f1f8",
      panel: "#ffffff",
      tier1: "#2d2546",
      tier2: "#1e3a8a",
      tier3: "#6d28d9",
      tier1Accent: "#a855f7",
      tier1AccentRgb: "168, 85, 247",
      tier2Accent: "#f43f5e",
      tier2AccentRgb: "244, 63, 94",
      tier3Accent: "#e9d5ff",
      tier3AccentRgb: "233, 213, 255",
      panelBorder: "rgba(33, 30, 51, 0.12)",
      lineBorder: "rgba(33, 30, 51, 0.12)",
      shadow: "0 20px 40px rgba(33, 30, 51, 0.18)"
    },
    layout: {
      panelRadius: "22px",
      lineRadius: "14px",
      accentBar: "6px",
      layoutGap: "18px",
      gridGap: "12px",
      popoverWidth: "68%"
    },
    background: {
      bg1: "radial-gradient(640px 320px at 12% 12%, rgba(168, 85, 247, 0.26), transparent 62%)",
      bg2: "radial-gradient(520px 260px at 88% 18%, rgba(30, 58, 138, 0.25), transparent 60%)",
      bg3: "radial-gradient(760px 360px at 70% 88%, rgba(244, 63, 94, 0.22), transparent 60%)",
      bg4: "repeating-linear-gradient(120deg, rgba(109, 40, 217, 0.07) 0 12px, transparent 12px 30px)"
    }
  },
  {
    slug: "ember-prism",
    title: "Adult Protocol Detail Experiment v11 Option 05",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=Karla:wght@400;600&display=swap');",
    fontBody: "\"Karla\", sans-serif",
    fontDisplay: "\"Rubik Mono One\", sans-serif",
    colors: {
      ink: "#221a2b",
      muted: "#5a5068",
      page: "#f6f1f7",
      panel: "#ffffff",
      tier1: "#2e1a3a",
      tier2: "#3b82f6",
      tier3: "#5b21b6",
      tier1Accent: "#be123c",
      tier1AccentRgb: "190, 18, 60",
      tier2Accent: "#7c3aed",
      tier2AccentRgb: "124, 58, 237",
      tier3Accent: "#f5d0fe",
      tier3AccentRgb: "245, 208, 254",
      panelBorder: "rgba(34, 26, 43, 0.12)",
      lineBorder: "rgba(34, 26, 43, 0.12)",
      shadow: "0 18px 38px rgba(34, 26, 43, 0.18)"
    },
    layout: {
      panelRadius: "14px",
      lineRadius: "10px",
      accentBar: "8px",
      layoutGap: "18px",
      gridGap: "10px",
      popoverWidth: "72%"
    },
    background: {
      bg1: "radial-gradient(620px 280px at 10% 12%, rgba(190, 18, 60, 0.26), transparent 62%)",
      bg2: "radial-gradient(520px 260px at 88% 16%, rgba(59, 130, 246, 0.24), transparent 60%)",
      bg3: "radial-gradient(760px 360px at 70% 88%, rgba(124, 58, 237, 0.22), transparent 60%)",
      bg4: "repeating-linear-gradient(140deg, rgba(91, 33, 182, 0.08) 0 12px, transparent 12px 28px)"
    }
  },
  {
    slug: "sapphire-haze",
    title: "Adult Protocol Detail Experiment v11 Option 06",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Red+Hat+Display:wght@400;600&display=swap');",
    fontBody: "\"Red Hat Display\", sans-serif",
    fontDisplay: "\"Oswald\", sans-serif",
    colors: {
      ink: "#1a2438",
      muted: "#4a5972",
      page: "#f1f3fa",
      panel: "#ffffff",
      tier1: "#1e2a49",
      tier2: "#1d4ed8",
      tier3: "#4338ca",
      tier1Accent: "#3b82f6",
      tier1AccentRgb: "59, 130, 246",
      tier2Accent: "#ef4444",
      tier2AccentRgb: "239, 68, 68",
      tier3Accent: "#dbeafe",
      tier3AccentRgb: "219, 234, 254",
      panelBorder: "rgba(26, 36, 56, 0.12)",
      lineBorder: "rgba(26, 36, 56, 0.12)",
      shadow: "0 18px 38px rgba(26, 36, 56, 0.18)"
    },
    layout: {
      panelRadius: "18px",
      lineRadius: "12px",
      accentBar: "6px",
      layoutGap: "16px",
      gridGap: "10px",
      popoverWidth: "70%"
    },
    background: {
      bg1: "radial-gradient(620px 280px at 10% 10%, rgba(59, 130, 246, 0.26), transparent 62%)",
      bg2: "radial-gradient(520px 260px at 88% 18%, rgba(30, 64, 175, 0.25), transparent 60%)",
      bg3: "radial-gradient(760px 360px at 70% 88%, rgba(239, 68, 68, 0.2), transparent 60%)",
      bg4: "repeating-linear-gradient(135deg, rgba(67, 56, 202, 0.08) 0 12px, transparent 12px 30px)"
    }
  },
  {
    slug: "magenta-arc",
    title: "Adult Protocol Detail Experiment v11 Option 07",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&family=Montserrat:wght@400;600&display=swap');",
    fontBody: "\"Montserrat\", sans-serif",
    fontDisplay: "\"Rajdhani\", sans-serif",
    colors: {
      ink: "#231b34",
      muted: "#5a516b",
      page: "#f6f1fb",
      panel: "#ffffff",
      tier1: "#2d1f45",
      tier2: "#4f46e5",
      tier3: "#7e22ce",
      tier1Accent: "#ec4899",
      tier1AccentRgb: "236, 72, 153",
      tier2Accent: "#2563eb",
      tier2AccentRgb: "37, 99, 235",
      tier3Accent: "#fbcfe8",
      tier3AccentRgb: "251, 207, 232",
      panelBorder: "rgba(35, 27, 52, 0.12)",
      lineBorder: "rgba(35, 27, 52, 0.12)",
      shadow: "0 18px 38px rgba(35, 27, 52, 0.18)"
    },
    layout: {
      panelRadius: "20px",
      lineRadius: "12px",
      accentBar: "6px",
      layoutGap: "18px",
      gridGap: "12px",
      popoverWidth: "74%"
    },
    background: {
      bg1: "radial-gradient(620px 280px at 12% 12%, rgba(236, 72, 153, 0.26), transparent 62%)",
      bg2: "radial-gradient(520px 260px at 88% 18%, rgba(79, 70, 229, 0.24), transparent 60%)",
      bg3: "radial-gradient(760px 360px at 70% 88%, rgba(37, 99, 235, 0.22), transparent 60%)",
      bg4: "repeating-linear-gradient(120deg, rgba(126, 34, 206, 0.08) 0 12px, transparent 12px 30px)"
    }
  },
  {
    slug: "cobalt-bloom",
    title: "Adult Protocol Detail Experiment v11 Option 08",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Outfit:wght@400;600&display=swap');",
    fontBody: "\"Outfit\", sans-serif",
    fontDisplay: "\"Barlow Condensed\", sans-serif",
    colors: {
      ink: "#19263b",
      muted: "#4b5a70",
      page: "#f1f4fb",
      panel: "#ffffff",
      tier1: "#1b2b4d",
      tier2: "#4338ca",
      tier3: "#6d28d9",
      tier1Accent: "#2563eb",
      tier1AccentRgb: "37, 99, 235",
      tier2Accent: "#dc2626",
      tier2AccentRgb: "220, 38, 38",
      tier3Accent: "#dbeafe",
      tier3AccentRgb: "219, 234, 254",
      panelBorder: "rgba(25, 38, 59, 0.12)",
      lineBorder: "rgba(25, 38, 59, 0.12)",
      shadow: "0 18px 38px rgba(25, 38, 59, 0.18)"
    },
    layout: {
      panelRadius: "16px",
      lineRadius: "10px",
      accentBar: "8px",
      layoutGap: "16px",
      gridGap: "10px",
      popoverWidth: "70%"
    },
    background: {
      bg1: "radial-gradient(620px 280px at 10% 12%, rgba(37, 99, 235, 0.26), transparent 62%)",
      bg2: "radial-gradient(520px 260px at 88% 18%, rgba(67, 56, 202, 0.24), transparent 60%)",
      bg3: "radial-gradient(760px 360px at 70% 88%, rgba(220, 38, 38, 0.2), transparent 60%)",
      bg4: "repeating-linear-gradient(140deg, rgba(109, 40, 217, 0.08) 0 12px, transparent 12px 30px)"
    }
  },
  {
    slug: "plum-strata",
    title: "Adult Protocol Detail Experiment v11 Option 09",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Noto+Sans:wght@400;600&display=swap');",
    fontBody: "\"Noto Sans\", sans-serif",
    fontDisplay: "\"Bricolage Grotesque\", sans-serif",
    colors: {
      ink: "#241b3a",
      muted: "#5b526d",
      page: "#f5f1fa",
      panel: "#ffffff",
      tier1: "#2f214c",
      tier2: "#1d4ed8",
      tier3: "#6b21a8",
      tier1Accent: "#7c3aed",
      tier1AccentRgb: "124, 58, 237",
      tier2Accent: "#e11d48",
      tier2AccentRgb: "225, 29, 72",
      tier3Accent: "#ede9fe",
      tier3AccentRgb: "237, 233, 254",
      panelBorder: "rgba(36, 27, 58, 0.12)",
      lineBorder: "rgba(36, 27, 58, 0.12)",
      shadow: "0 18px 38px rgba(36, 27, 58, 0.18)"
    },
    layout: {
      panelRadius: "20px",
      lineRadius: "12px",
      accentBar: "6px",
      layoutGap: "18px",
      gridGap: "12px",
      popoverWidth: "72%"
    },
    background: {
      bg1: "radial-gradient(620px 280px at 10% 12%, rgba(124, 58, 237, 0.26), transparent 62%)",
      bg2: "radial-gradient(520px 260px at 88% 18%, rgba(29, 78, 216, 0.24), transparent 60%)",
      bg3: "radial-gradient(760px 360px at 70% 88%, rgba(225, 29, 72, 0.2), transparent 60%)",
      bg4: "repeating-linear-gradient(125deg, rgba(107, 33, 168, 0.08) 0 12px, transparent 12px 30px)"
    }
  },
  {
    slug: "ruby-aurora",
    title: "Adult Protocol Detail Experiment v11 Option 10",
    fontImport: "@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Urbanist:wght@400;600&display=swap');",
    fontBody: "\"Urbanist\", sans-serif",
    fontDisplay: "\"DM Serif Display\", serif",
    colors: {
      ink: "#231e33",
      muted: "#534f67",
      page: "#f7f2f6",
      panel: "#ffffff",
      tier1: "#2b213f",
      tier2: "#312e81",
      tier3: "#7c3aed",
      tier1Accent: "#be123c",
      tier1AccentRgb: "190, 18, 60",
      tier2Accent: "#3b82f6",
      tier2AccentRgb: "59, 130, 246",
      tier3Accent: "#fbcfe8",
      tier3AccentRgb: "251, 207, 232",
      panelBorder: "rgba(35, 30, 51, 0.12)",
      lineBorder: "rgba(35, 30, 51, 0.12)",
      shadow: "0 18px 38px rgba(35, 30, 51, 0.18)"
    },
    layout: {
      panelRadius: "22px",
      lineRadius: "12px",
      accentBar: "6px",
      layoutGap: "18px",
      gridGap: "12px",
      popoverWidth: "70%"
    },
    background: {
      bg1: "radial-gradient(620px 280px at 10% 12%, rgba(190, 18, 60, 0.26), transparent 62%)",
      bg2: "radial-gradient(520px 260px at 88% 18%, rgba(49, 46, 129, 0.24), transparent 60%)",
      bg3: "radial-gradient(760px 360px at 70% 88%, rgba(59, 130, 246, 0.2), transparent 60%)",
      bg4: "repeating-linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0 12px, transparent 12px 30px)"
    }
  }
];

const template = (variant, index) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${variant.title}</title>
  <style>
    ${variant.fontImport}

    :root {
      --font-body: ${variant.fontBody};
      --font-display: ${variant.fontDisplay};
      --ink: ${variant.colors.ink};
      --muted: ${variant.colors.muted};
      --page: ${variant.colors.page};
      --panel: ${variant.colors.panel};
      --tier1: ${variant.colors.tier1};
      --tier2: ${variant.colors.tier2};
      --tier3: ${variant.colors.tier3};
      --tier1-accent: ${variant.colors.tier1Accent};
      --tier1-accent-rgb: ${variant.colors.tier1AccentRgb};
      --tier2-accent: ${variant.colors.tier2Accent};
      --tier2-accent-rgb: ${variant.colors.tier2AccentRgb};
      --tier3-accent: ${variant.colors.tier3Accent};
      --tier3-accent-rgb: ${variant.colors.tier3AccentRgb};
      --panel-border: ${variant.colors.panelBorder};
      --line-border: ${variant.colors.lineBorder};
      --shadow: ${variant.colors.shadow};
      --panel-radius: ${variant.layout.panelRadius};
      --line-radius: ${variant.layout.lineRadius};
      --accent-bar: ${variant.layout.accentBar};
      --layout-gap: ${variant.layout.layoutGap};
      --grid-gap: ${variant.layout.gridGap};
      --popover-width: ${variant.layout.popoverWidth};
      --bg-1: ${variant.background.bg1};
      --bg-2: ${variant.background.bg2};
      --bg-3: ${variant.background.bg3};
      --bg-4: ${variant.background.bg4};
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: var(--font-body);
      color: var(--ink);
      background: var(--bg-1), var(--bg-2), var(--bg-3), var(--bg-4), var(--page);
    }

    .scene { padding: 36px 22px 60px; }

    .layout {
      max-width: 1180px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 0.38fr);
      grid-template-areas:
        "main side"
        "wide side";
      gap: var(--layout-gap);
      align-items: start;
    }

    .main-card { grid-area: main; }
    .side-stack { grid-area: side; display: grid; gap: var(--layout-gap); }
    .wide-card { grid-area: wide; }

    .tier {
      background: var(--panel);
      border-radius: var(--panel-radius);
      border: 1px solid var(--panel-border);
      box-shadow: var(--shadow);
      padding: 16px 16px 10px;
      position: relative;
      animation: floatIn 0.75s ease both;
    }

    .tier::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: var(--accent-bar);
      background: linear-gradient(90deg, var(--tier1-accent), transparent 85%);
      border-radius: var(--panel-radius) var(--panel-radius) 0 0;
      opacity: 0.9;
    }

    .tier-2::before {
      background: linear-gradient(90deg, var(--tier2-accent), transparent 85%);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--grid-gap);
    }

    .span-2 { grid-column: span 2; }

    .line {
      display: block;
      width: 100%;
      padding: 10px 12px;
      border-radius: var(--line-radius);
      border: 1px solid var(--line-border);
      background: rgba(255, 255, 255, 0.92);
      text-align: left;
      font-size: 14px;
      line-height: 1.35;
      color: var(--muted);
    }

    .t1.c1 {
      font-family: var(--font-display);
      font-size: 20px;
      letter-spacing: 0.02em;
      color: var(--tier1);
      background: rgba(var(--tier1-accent-rgb), 0.12);
    }

    .t1.c2 { color: var(--ink); background: rgba(var(--tier1-accent-rgb), 0.04); }

    .t1.c3 {
      color: var(--tier1);
      background: rgba(var(--tier1-accent-rgb), 0.18);
      border: 1px dashed rgba(var(--tier1-accent-rgb), 0.45);
    }

    .t2.c1 {
      color: var(--tier2);
      font-weight: 700;
      background: rgba(var(--tier2-accent-rgb), 0.14);
    }

    .t2.c2 { color: var(--muted); background: rgba(var(--tier2-accent-rgb), 0.06); }

    .t2.c3 {
      color: var(--tier2);
      background: rgba(var(--tier2-accent-rgb), 0.2);
      border: 1px dashed rgba(var(--tier2-accent-rgb), 0.5);
    }

    .t3.c3 {
      color: var(--tier3);
      background: rgba(var(--tier3-accent-rgb), 0.85);
      border: 1px solid rgba(var(--tier3-accent-rgb), 0.6);
      font-weight: 600;
    }

    .is-hidden { display: none; }

    .inline-tag {
      display: inline-block;
      padding: 0 6px;
      border-radius: 999px;
    }

    button.line {
      appearance: none;
      border: 1px solid var(--line-border);
      background: inherit;
      font: inherit;
      cursor: pointer;
    }

    .clickable { animation: shimmer 1.9s ease-in-out infinite; }

    .slide {
      display: inline-block;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      vertical-align: bottom;
      transform: translateX(-6px);
      transition: max-width 0.45s ease, opacity 0.3s ease, transform 0.3s ease;
    }

    .slide.is-open {
      max-width: 1000px;
      opacity: 1;
      transform: translateX(0);
    }

    .pop-anchor { position: relative; }

    .popover {
      position: absolute;
      right: 0;
      top: 100%;
      width: var(--popover-width);
      display: grid;
      gap: 8px;
      opacity: 0;
      transform: translateY(-6px);
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
      z-index: 2;
    }

    .popover.is-open { opacity: 1; transform: translateY(6px); }

    .popover::before {
      content: "";
      position: absolute;
      right: 16px;
      top: -10px;
      width: 16px;
      height: 16px;
      background: rgba(var(--tier3-accent-rgb), 0.9);
      border: 1px solid rgba(var(--tier3-accent-rgb), 0.6);
      transform: rotate(45deg);
    }

    @keyframes shimmer {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.2); }
    }

    @keyframes floatIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 980px) {
      .layout {
        grid-template-columns: 1fr;
        grid-template-areas:
          "main"
          "side"
          "wide";
      }

      .popover {
        position: relative;
        right: 0;
        top: 0;
        width: 100%;
        margin-top: 8px;
      }

      .popover::before { display: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .clickable { animation: none; }
      .tier { animation: none; }
      .popover, .slide { transition: none; }
    }
  </style>
</head>
<body>
  <main class="scene">
    <div class="layout">
      <section class="tier tier-1 main-card">
        <div class="grid">
          <div class="line t1 c1 span-2">Adult pt Illness:</div>
          <div class="line t1 c2">Treat if pt has these conditions met.</div>
          <div class="line t1 c2">Don't treat if pt has this condition.</div>
          <div class="line t1 c1 span-2">Administer drug.</div>
          <div class="line t1 c1 span-2">Repeat drug administration after x amount of time, max dose of drug is.</div>
          <div class="line t1 c2">Consult for further orders.</div>
          <div class="line t1 c1">Administer this other drug, may repeat every x amount of minutes prn.</div>
          <div class="line t1 c2">Take caution for.</div>
          <div class="line t1 c2">What out for these S/S.</div>
        </div>
      </section>

      <aside class="side-stack">
        <section class="tier tier-2 pop-card">
          <div class="line t2 c2">Drug has this function.</div>
          <div class="pop-anchor">
            <button class="line t2 c1 clickable" data-toggle="interaction" type="button">
              <span class="swap" data-collapsed="interaction">Drug wont function if this interaction.</span>
              <span class="swap slide" data-expanded="interaction">Drug wont function if this interaction<span class="inline-tag t2 c3">, Drug function interaction on cellular level.</span></span>
            </button>
            <div class="popover" data-hidden="tier3">
              <div class="line t3 c3">Illness background Info.</div>
              <div class="line t3 c3">More Illness background Info, Classic recognition signs, Longterm pt signs, Less important illness info.</div>
              <div class="line t3 c3">Why we should do this.</div>
            </div>
          </div>
        </section>

        <section class="tier tier-2 mini-card">
          <div class="line t2 c1">Severity potential.</div>
          <div class="line t2 c2">Potential for harm issues.</div>
        </section>
      </aside>

      <section class="tier tier-1 wide-card">
        <div class="line t1 c2">When pt has Illness and this other thing.</div>
        <button class="line t1 c1 clickable" data-toggle="tx" type="button">
          <span class="swap" data-collapsed="tx">Begin this additional Tx en route, Don't let this happen during administration.</span>
          <span class="swap slide" data-expanded="tx">Begin this additional Tx en route, Don't let this happen during administration<span class="inline-tag t1 c3">, Why this could happen on a cellular level.</span></span>
        </button>
      </section>
    </div>
  </main>

  <script>
    const expandAll = new URLSearchParams(window.location.search).get("expanded") === "1";

    const toggleInline = (key, forceOpen) => {
      const collapsed = document.querySelector('[data-collapsed="' + key + '"]');
      const expanded = document.querySelector('[data-expanded="' + key + '"]');
      if (!collapsed || !expanded) return;
      const open = typeof forceOpen === "boolean" ? forceOpen : collapsed.classList.contains("is-hidden");
      collapsed.classList.toggle("is-hidden", open);
      expanded.classList.toggle("is-open", open);
    };

    const toggleTier3 = (forceOpen) => {
      const targets = document.querySelectorAll('[data-hidden="tier3"]');
      targets.forEach((el) => {
        const open = typeof forceOpen === "boolean" ? forceOpen : !el.classList.contains("is-open");
        el.classList.toggle("is-open", open);
      });
    };

    document.querySelectorAll('[data-toggle="interaction"]').forEach((button) => {
      button.addEventListener("click", () => {
        toggleInline("interaction");
        toggleTier3();
      });
    });

    document.querySelectorAll('[data-toggle="tx"]').forEach((button) => {
      button.addEventListener("click", () => toggleInline("tx"));
    });

    if (expandAll) {
      toggleInline("interaction", true);
      toggleInline("tx", true);
      toggleTier3(true);
    }
  </script>
</body>
</html>
`;

const run = async () => {
  const baseDir = resolve("notes", "experiments");
  await mkdir(baseDir, { recursive: true });

  for (let i = 0; i < variants.length; i += 1) {
    const variant = variants[i];
    const index = String(i + 1).padStart(2, "0");
    const fileName = `adult-protocol-detail-v11-option-${index}-${variant.slug}.html`;
    const filePath = resolve(baseDir, fileName);
    await writeFile(filePath, template(variant, index), "utf8");
  }
};

run();
