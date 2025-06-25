// Tailwind configuration and custom styles
tailwind.config = {
  theme: {
    extend: {
      // Ensure the Inter font is used as the sans-serif font
      fontFamily: { sans: ["Inter", "sans-serif"] }
      // (You can add other theme extensions here if needed)
    }
  },
  plugins: [
    function ({ addBase, addComponents, theme }) {
      // Base styles for global elements and IDs (from styles.css)
      addBase({
    ":root": { "--vh": "1vh" },
    "html": {
      "-webkit-text-size-adjust": "100%", // For Chrome, Safari, and newer Edge
      "-moz-text-size-adjust": "100%",    // For Firefox
      "text-size-adjust": "100%"         // The standard property
    },
        "body": {
          fontFamily: "'Inter', sans-serif",
          overscrollBehaviorY: "contain",
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(var(--vh, 1vh) * 100)"
        }
      });
      // Component (and utility) styles corresponding to styles.css content
      addComponents({
        /* Sidebar and Overlay */
        "#patient-sidebar": {
          position: "fixed",
          top: "0", left: "0",
          width: "300px", maxWidth: "80%",
          height: "calc(var(--vh, 1vh) * 100)",
          backgroundColor: theme("colors.gray.50"),
          borderRight: "1px solid " + theme("colors.gray.200"),
          padding: "1rem", overflowY: "auto",
          zIndex: "100",
          transform: "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
        },
        "#patient-sidebar.open": {
          transform: "translateX(0)"
        },
        "#sidebar-overlay": {
          position: "fixed",
          top: "0", left: "0",
          width: "100%", height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: "99",
          opacity: "0", visibility: "hidden",
          transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out"
        },
        "#sidebar-overlay.active": {
          opacity: "1", visibility: "visible"
        },
        "#app-container": {
          display: "flex",
          flexDirection: "column",
          flexGrow: "1",
          width: "100%",
          transition: "margin-left 0.3s ease-in-out"
        },

        /* Hierarchical List (Categories/Topics) */
        ".category-item > .category-header": {
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0.75rem 1rem",
          backgroundColor: theme("colors.gray.100"),
          border: "1px solid " + theme("colors.gray.200"),
          borderRadius: theme("borderRadius.md"),
          cursor: "pointer",
          fontWeight: theme("fontWeight.medium"),
          transition: "background-color 0.2s"
        },
        ".category-item > .category-header:hover": {
          backgroundColor: theme("colors.gray.200")
        },
        ".category-children": {
          display: "none",
          paddingLeft: "1rem", /* indent child list */
          marginTop: "0.25rem",
          borderLeft: "2px solid " + theme("colors.gray.300")
        },
        ".category-item.expanded > .category-children": {
          display: "block"
        },
        ".category-item.expanded > .category-header .icon-toggle-open": {
          display: "inline-block"
        },
        ".category-item.expanded > .category-header .icon-toggle-closed": {
          display: "none"
        },
        ".icon-toggle-open": { display: "none" },
        ".icon-toggle-closed": { display: "inline-block" },

        /* Topic Links */
        ".topic-link-item": {
          display: "block",
          padding: "0.6rem 1rem",
          backgroundColor: theme("colors.white"),
          border: "1px solid " + theme("colors.gray.200"),
          borderRadius: theme("borderRadius.md"),
          marginTop: "0.25rem",
          cursor: "pointer",
          transition: "background-color 0.2s, transform 0.1s"
        },
        ".topic-link-item:hover": {
          backgroundColor: theme("colors.sky.100")
        },
        ".topic-link-item:active": {
          transform: "scale(0.98)"
        },
        ".topic-link-item.recently-viewed": {
          backgroundColor: theme("colors.amber.100")  /* #fef3c7 */
        },
        ".strikethrough": {
          textDecoration: "line-through",
          color: theme("colors.gray.500")
        },

        /* Search result item in sidebar */
        ".search-topic-item": {
          padding: "0.75rem 1rem",
          backgroundColor: theme("colors.gray.50"),
          borderRadius: theme("borderRadius.md"),
          cursor: "pointer",
          border: "1px solid " + theme("colors.gray.200"),
          marginBottom: "0.5rem"
        },
        ".search-topic-item:hover": {
          backgroundColor: theme("colors.sky.100")
        },

        /* Form inputs in sidebar */
        ".sidebar-input": {
          width: "100%",
          padding: "0.5rem",
          border: "1px solid " + theme("colors.gray.300"),
          borderRadius: theme("borderRadius.md"),
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          outline: "none"
        },
        ".sidebar-input:focus": {
          boxShadow: "0 0 0 2px " + theme("colors.blue.500"),
          borderColor: theme("colors.blue.500")
        },
        ".sidebar-label": {
          display: "block",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          fontWeight: theme("fontWeight.medium"),
          color: theme("colors.gray.700"),
          marginBottom: "0.25rem"
        },

        /* Sidebar sections */
        ".sidebar-section": {
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid " + theme("colors.gray.200")
        },
        ".sidebar-section-title": {
          fontSize: "1.125rem",
          fontWeight: theme("fontWeight.semibold"),
          color: theme("colors.blue.600"),
          marginBottom: "0.5rem"
        },

        /* Autocomplete suggestions dropdown */
        ".autocomplete-container": { position: "relative" },
        ".autocomplete-suggestions": {
          position: "absolute",
          border: "1px solid " + theme("colors.gray.300"),
          borderTop: "none",
          zIndex: "101",  /* above sidebar content */
          maxHeight: "150px",
          overflowY: "auto",
          backgroundColor: theme("colors.white"),
          width: "100%",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          borderRadius: "0 0 " + theme("borderRadius.md") + " " + theme("borderRadius.md")
        },
        ".autocomplete-suggestion-item": {
          padding: "0.5rem",
          cursor: "pointer",
          fontSize: "0.875rem"
        },
        ".autocomplete-suggestion-item:hover": {
          backgroundColor: theme("colors.sky.100")
        },

        /* Utility: hidden (override to ensure it hides even if other display is set) */
        ".hidden": {
          display: "none !important"
        },

        /* Medication Detail page styles */
        ".detail-section": { marginBottom: "1rem" },
        ".detail-section-title": {
          fontSize: "1rem",
          fontWeight: theme("fontWeight.semibold"),
          color: theme("colors.blue.700"),
          borderBottom: "1px solid " + theme("colors.blue.200"),
          paddingBottom: "0.25rem",
          marginBottom: "0.5rem"
        },
        ".detail-list": {
          listStyleType: "disc", listStylePosition: "inside",
          paddingLeft: "0.5rem",
          color: theme("colors.gray.700")
        },
        ".detail-list li + li": {
          marginTop: "0.25rem"
        },
        ".detail-text": {
          color: theme("colors.gray.700"),
          whiteSpace: "pre-wrap"
        },
        ".med-concentration": {
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          color: theme("colors.gray.500"),
          marginLeft: "0.5rem"
        },

        /* Toggle info links */
        ".toggle-info": {
          color: theme("colors.green.700"),         /* #15803d */
          cursor: "pointer",
          textDecorationLine: "underline",
          textDecorationColor: "#15803d",
          textUnderlineOffset: "2px"
        },
        ".toggle-info:hover": {
          color: theme("colors.emerald.800"),       /* #065f46 */
          backgroundColor: theme("colors.emerald.100")  /* #d1fae5 */
        },
        ".toggle-info .info-text": {
          marginLeft: "0.25rem"
        },
        ".toggle-category": {
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        },
        ".arrow": {
          transition: "transform 0.2s",
          marginLeft: "0.25rem"
        },
        ".arrow.rotate": {
          transform: "rotate(-180deg)"
        },

        /* Header navigation buttons (top-right corner buttons) */
        ".header-nav-button": {
          padding: "0.5rem",
          borderRadius: theme("borderRadius.md"),
          color: theme("colors.white")
        },
        ".header-nav-button:hover": {
          backgroundColor: theme("colors.blue.700")
        },
        ".header-nav-button:disabled": {
          opacity: "0.5",
          cursor: "not-allowed"
        },

        /* Warning message boxes */
        ".warning-box": {
          marginTop: "1rem", marginBottom: "1rem",
          padding: "0.75rem",
          border: "1px solid " + theme("colors.gray.300"),
          borderRadius: theme("borderRadius.md"),
          fontSize: "0.875rem"
        },
        ".warning-box > * + *": {
          marginTop: "0.5rem"  /* space between lines inside warning box */
        },
        ".warning-box-red": {
          borderColor: theme("colors.red.400"),
          backgroundColor: theme("colors.red.50"),
          color: theme("colors.red.700")
        },
        ".warning-box-orange": {
          borderColor: theme("colors.orange.400"),
          backgroundColor: theme("colors.orange.50"),
          color: theme("colors.orange.700")
        },
        ".warning-box-yellow": {
          borderColor: theme("colors.yellow.400"),
          backgroundColor: theme("colors.yellow.50"),
          color: theme("colors.yellow.800")
        },
        ".warning-box div": {
          display: "flex", alignItems: "flex-start"
        },
        ".warning-box svg": {
          width: "1.25rem", height: "1.25rem",
          marginRight: "0.5rem",
          flexShrink: "0"
        },

        /* Custom scrollbar styling */
        "::-webkit-scrollbar": { width: "8px" },
        "::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "10px" },
        "::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "10px" },
        "::-webkit-scrollbar-thumb:hover": { background: "#94a3b8" }
      });
    }
  ]
};
