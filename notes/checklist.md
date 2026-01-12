## 2026-01-12 11:09:11 Overlay input ranges + spacing boost
- [x] Convert overlay value fields to editable numeric inputs (percent/px) with decimal support
- [x] Expand overlay percent/px ranges to 1-1000% and -1000..1000
- [x] Increase column spacing response to percent input
- [ ] Run Playwright category-tree spec
- [x] Record memory-log entry

## 2026-01-12 07:58:32 S/S toggles on detail pages
- [x] Scan detail pages for S/S lists and confirm targets
- [x] Add S/S toggle rendering, handlers, and styles
- [ ] Verify S/S toggles on affected detail pages
- [x] Record memory-log entry

## 2026-01-12 02:14:32 Overlay per-element + dev toggle updates
- [x] Add header/footer element size and position controls in overlay
- [x] Fix header/footer room sizing to resize content area accurately
- [x] Add Dev Overlay toggle in settings
- [x] Run Playwright category-tree spec
- [x] Record memory-log entry

## 2026-01-12 00:53:47 Overlay header/footer + spacing controls
- [x] Split header room vs header content sizing and add header move controls
- [x] Switch footer controls to room-only sizing
- [x] Add per-column spacing controls
- [x] Run Playwright category-tree spec
- [x] Record memory-log entry

## 2026-01-12 00:31:54 Overlay controls: size range, column shift, header/footer
- [x] Extend pill size ceiling to 260% and add column shift controls
- [x] Add header/footer height controls via overlay variables
- [x] Run Playwright category-tree spec
- [x] Record memory-log entry

## 2026-01-11 17:12:59 Category pill size overlay controls
- [x] Increase base pill sizes and add pill-scale variable
- [x] Add overlay with per-column size controls
- [x] Run Playwright category-tree spec
- [x] Record memory-log entry

## 2026-01-11 08:10:01 Category tree sizing + centerline + animation update
- [x] Adjust root connector geometry to centerline
- [x] Shrink pill sizing and column widths, rebalance shifts
- [x] Replace moving light with full-path animation
- [x] Update Playwright category-tree spec to assert fit and centering
- [x] Run Playwright spec
- [x] Record memory-log entry

## 2026-01-10 04:12:54 Playwright suite fixes
- [x] Add Playwright config + global setup/teardown to isolate spec tests and start preview server
- [x] Update UI smoke test to use a valid Adult Airway topic
- [x] Run `npx playwright test`
- [x] Record memory-log entry

## 2026-01-10 03:53:49 Category tree line visibility + tighter rows
- [x] Move line color/thickness vars to content area so the overlay lines render
- [x] Reset light animation on list render/back navigation and stop it when list is removed
- [x] Tighten vertical spacing between pills
- [x] Run `npm run preview` and `npx playwright test dev-tools/tests/category-tree.spec.js`
- [x] Record memory-log entry

## 2026-01-10 03:04:27 Category tree drag + single-path light
- [x] Add draggable pills with live connector updates and path-aware centering
- [x] Replace legacy connector pseudo-elements with a line overlay + single moving light segment
- [x] Thicken/darken base lines and darken active-path lines
- [x] Disable old shimmer and align pill perimeter split to the moving light
- [x] Add Playwright category tree spec and capture desktop/mobile screenshots
- [x] Run `npm run preview`, `npm run test`, `npx playwright test dev-tools/tests/category-tree.spec.js`
- [x] Record memory-log entry

## 2026-01-09 19:50:36 Category tree connector direction + length pass
- [x] Reverse connector shimmer to travel leaf -> main
- [x] Halve horizontal connector spacing between columns and branch taps
- [x] Tighten root trunk gap to match shorter connectors
- [ ] Recheck list view layout in preview (manual)
- [ ] Capture updated desktop/mobile screenshots if visuals change
- [x] Record memory-log entry

## 2026-01-09 20:28:15 Category tree path light cleanup
- [x] Move active trunk line behind pills to stop crossing labels
- [x] Reduce active-path glow inheritance so only selected branch shimmers
- [x] Remove extra base vertical line when active path is present
- [x] Align connector shimmer timing for branch taps
- [ ] Recheck live list view (Adult Protocols line + shimmer continuity)
- [ ] Capture updated desktop/mobile screenshots if visuals change
- [x] Record memory-log entry

## 2026-01-09 15:50:52 Category tree alignment + darker active path
- [x] Reverse shimmer direction from leaf to root and darken active connector path
- [x] Tighten column spacing while keeping labels from overlapping
- [x] Align child columns to the top edge of the content area after layout settles
- [x] Capture updated desktop/mobile category tree screenshots
- [x] Record memory-log entry

## 2026-01-09 14:20:38 Category tree column spacing + connector alignment
- [x] Measure column widths per tree and prevent overlap across sibling columns
- [x] Extend connector runs to account for child column shift offsets
- [x] Remove active-card horizontal offset so trunk stays centered
- [x] Capture updated desktop/mobile category tree screenshots
- [x] Record memory-log entry

## 2026-01-09 09:17:33 Category tree alignment + travel-line polish
- [x] Recenter root trunk through category title pills and keep the trunk visible on load
- [x] Shrink/move active path rows with diminishing offsets and no overlap
- [x] Raise active path toward header edge and collapse sibling branches
- [x] Slow shimmer travel and brighten active path connector + pill perimeter
- [x] Capture updated desktop/mobile category tree screenshots
- [x] Record memory-log entry

## 2026-01-09 00:04:29 Category tree connector animation + title chips
- [x] Resize category title pills to text width and keep indicator separate
- [x] Add connector line animations for expanded categories and subcategories
- [x] Update list rendering to flag expanded groups for connector styling
- [x] Record memory-log entry

## 2026-01-09 05:11:18 Category tree connector fixes + active path styling
- [x] Stop connector trunks at last visible item and fix missing segments
- [x] Prevent list columns from shifting vertically on expand (absolute child columns)
- [x] Add active path shifts/shrink and highlight styling for connectors and cards
- [x] Hide Show/Hide indicator text across category/detail UI
- [x] Record memory-log entry

## 2026-01-08 15:49:43 Adult detail v12 rollout (adult-seizure + adult-sepsis)
- [x] Map adult-seizure and adult-sepsis detail text to tier/class system
- [x] Apply v12 detail-space base styling and per-topic overrides
- [x] Add tiered markdown renderer and detail-space class toggles
- [x] Capture Playwright screenshots (desktop + mobile, expanded toggles)
- [x] Record memory-log entry

## 2026-01-07 21:57:54 Adult Anaphylaxis v12 styling (tier/class mapping + readability)
- [x] Map adult-anaphylaxis detail text to tier/class system
- [x] Apply v12 space-card styling to adult anaphylaxis detail page (no text edits)
- [x] Verify full visibility on desktop + mobile with Playwright and fix readability issues
- [x] Record memory-log entry

## 2026-01-07 19:02:18 Adult detail experiments v12 (space-like variants)
- [x] Create 10 v12 HTML variants based on the reference layout with space-like backgrounds
- [x] Capture before/after screenshots for each v12 option
- [ ] Review screenshots for class 3 visibility and text-only compliance
- [x] Record memory-log entry

## 2026-01-07 18:23:55 Adult detail experiments v11 (purple-blue-red variants)
- [x] Generate 10 HTML variants based on the liked layout with purple/blue/red dominant artistic backgrounds
- [x] Capture before/after screenshots for each v11 option
- [ ] Review screenshots for class 3 visibility and text-only compliance
- [x] Record memory-log entry

## 2026-01-07 10:57:04 Adult detail experiments v10 (tier remap)
- [x] Align v10 options 01-08 to tier/class mapping and inline class 3 styling
- [x] Capture before/after screenshots for each option
- [ ] Review screenshots for class 3 visibility and text-only compliance
- [x] Record memory-log entry

## 2026-01-07 06:47:30 Adult detail experiments v9 (visual-only variants)
- [x] Create four HTML mockups (Stacked Triage Rail, Split Focus Columns, Command Card Deck, Signal Ladder) using only generic text
- [x] Capture before/after screenshots for each option
- [x] Review screenshots for class 3 visibility and text-only compliance
- [x] Record memory-log entry

## 2026-01-06 23:23:08 Adult detail experiments v8 (high-acuity variants)
- [x] Create four HTML mockups (Stacked Triage Rail, Split Focus Columns, Command Card Deck, Signal Ladder) using only generic text
- [x] Capture before/after screenshots for each option
- [x] Review screenshots for class 3 visibility and text-only compliance
- [x] Record memory-log entry

## 2026-01-05 00:22:45 Adult detail experiments v2
- [x] Remove prior experiment mockups and screenshots
- [x] Create new Adult Protocol detail mockups with tier/class differentiation
- [x] Capture before/after screenshots for each option
- [x] Review screenshots for layout and hidden content states
- [x] Gather research sources for visual hierarchy and attention cues
- [x] Record memory-log entry

## 2026-01-05 03:00:30 Adult detail experiments v3 (dramatic)
- [x] Research complementary color wheel guidance for dramatic palettes
- [x] Create dramatic Adult Protocol mockups with tier-specific interactions
- [x] Capture before/after screenshots for each option
- [x] Review screenshots for layout and hidden content states
- [x] Record memory-log entry

## 2026-01-05 04:18:13 Adult detail experiments v4 (tactical layouts)
- [x] Create tactical UI mockups with unique layouts
- [x] Capture before/after screenshots for each option
- [x] Review screenshots for layout and hidden content states
- [x] Record memory-log entry

## 2026-01-05 08:45:11 Adult detail experiments v5 (seizure mapping rules)
- [x] Remove unselected experiment screenshots and references
- [x] Create seizure mapping example mockup with corrected class visibility
- [x] Capture before/after screenshots for the new example
- [x] Record memory-log entry

## 2026-01-05 10:40:28 Adult detail experiments v6 (generic sequence)
- [x] Draft updated ruleset text for experimental layouts
- [x] Build one new example using generic text flow
- [x] Capture before/after screenshots for the new example
- [x] Record memory-log entry

## 2026-01-03 02:22:23 Anaphylaxis restructure + split protocols
- [x] Create new protocol topics (CPR initiation/termination, OOH DNR + surrogate, death documentation) and move content
- [x] Update categories + markdown maps + slug list for new topics
- [x] Redesign anaphylaxis markdown layout for fast scanning
- [x] Add anaphylaxis-specific CSS visual treatment
- [x] Capture updated screenshots
- [x] Verify ASCII-only content
- [x] Record memory-log entry
- [x] Update README Chapter 8 entry for protocol changes

## 2026-01-03 03:00:00 Anaphylaxis redesign (layout match)
- [x] Restructure anaphylaxis markdown to match Rx-first layout
- [x] Update anaphylaxis CSS treatment to match reference image
- [x] Capture updated screenshots (desktop + mobile)
- [x] Run a11y audit for the updated layout
- [x] Update README Chapter 8 entry
- [x] Record memory-log entry

## 2026-01-02 12:00:16 Adult anaphylaxis visual redesign
- [x] Capture baseline screenshot of Content/Adult Protocols/adult-anaphylaxis.md
- [x] Redesign markdown layout (sections, lists, emphasis) without deleting info
- [x] Capture updated screenshots during redesign review
- [x] Verify ASCII and completeness
- [x] Record memory-log entry

## 2026-01-01 13:03:37 AGENTS.md formatting fix
- [x] Identify literal \\r\\n sequences in AGENTS.md
- [x] Replace with real line breaks and keep ASCII
- [x] Scan for non-ASCII artifacts
- [x] Record memory-log entry

## 2026-01-01 13:26:38 Skill validation sweep
- [x] Inventory skills and extract feature lists
- [ ] Define per-skill feature map and validation method
- [ ] Test a11y-audit features
- [ ] Test agent-care features
- [ ] Test checklist features
- [ ] Test code-review-checklist features
- [ ] Test docs-updater features
- [ ] Test emergency-transport-planner features
- [ ] Test figma-tokens features
- [ ] Test filesystem-ops features
  - [ ] Subtask: read/write/list/move
  - [ ] Subtask: search/metadata/delete
- [ ] Test firecrawl features
- [ ] Test git-helper features
- [ ] Test git-ops features
- [ ] Test healthcare-research features
- [ ] Test hooks-runner features
- [ ] Test issue-triage features
- [ ] Test lighthouse-audit features
- [ ] Test mcp-everything features
- [ ] Test memory-log features
- [ ] Test playwright-browser features
- [ ] Test release-helper features
- [ ] Test repo-onboarding features
- [ ] Test security-privacy features
- [ ] Test sequential-thinking features
- [ ] Test shell-exec features
- [ ] Test skill-creator features
- [ ] Test skill-installer features
- [ ] Test smart-crawler features
- [ ] Test source-citation features
- [ ] Test test-runner features
- [ ] Test vscode-diagnostics features
- [ ] Test web-fetch features
- [ ] Test web-fetcher features
- [ ] Test webpick features
- [ ] Test workflow-clinical-update features
- [ ] Test workflow-dev-loop features
- [ ] Test workflow-ui-quality features
- [ ] Test workflow-web-research features
- [ ] Compile report and write memory-log entry

## 2026-01-05 14:29:59 Specified-text experiment v7
- [x] Update v7 experiment to use only user-provided text
- [x] Capture before/after screenshots
- [x] Add capture script
- [x] Record memory-log entry

## 2026-01-02 12:04:52 Unreferenced markdown investigation
- [x] Inspect data wiring (ParamedicCategoriesData, VentilationDetailsData, ProtocolMarkdownMap, AbbreviationGroups)
- [x] Review listed markdown files for duplication/usage
- [x] Summarize reasons for unreferenced status and options
- [x] Record memory-log entry

## 2026-01-02 12:43:21 Remove unused abbreviation markdowns
- [x] Delete unreferenced abbreviation markdown files per user request
- [x] Record memory-log entry
