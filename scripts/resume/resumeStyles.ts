// Print styles in the on-site resume viewer's look, sized down to fit two A4 pages.
export const RESUME_STYLES = `
@page { size: A4; margin: 0.42in 0.55in; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #ffffff; }
body {
  color: #1b1b1f;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 13px;
  line-height: 1.36;
  -webkit-print-color-adjust: exact;
}
a { color: inherit; text-decoration: underline; text-underline-offset: 2px; text-decoration-thickness: 0.5px; }
.external-icon { width: 9px; height: 9px; margin-left: 2px; vertical-align: baseline; }
h1, h2, h3, p, ul { margin: 0; }
.header { text-align: center; margin-bottom: 10px; }
.header h1 { font-size: 28px; font-weight: 700; line-height: 1.2; }
.header .title { margin-top: 2px; font-size: 14px; }
.header .headline { margin-top: 1px; font-size: 12px; color: #6b6b74; }
.header .contact { margin-top: 5px; font-size: 11.5px; }
.block { margin-top: 10px; }
.block h2 {
  font-size: 15.5px;
  font-weight: 700;
  border-bottom: 1px solid #1b1b1f;
  padding-bottom: 2px;
  margin-bottom: 5px;
  break-after: avoid;
}
.block p { margin: 0 0 2px; }
.block ul { margin: 1px 0 6px; padding-left: 18px; }
.block li { break-inside: avoid; }
.entry { margin-bottom: 5px; }
.entry-head { display: flex; justify-content: space-between; gap: 12px; break-after: avoid; }
.entry-head span { white-space: nowrap; }
.entry-sub { font-style: italic; break-after: avoid; }
.employer { font-size: 14px; font-weight: 700; margin: 0 0 3px; break-after: avoid; }
.entry--grouped { margin-left: 12px; }
.stack { color: #4a4a52; }
`;
