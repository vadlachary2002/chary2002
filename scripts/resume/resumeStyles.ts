// Print styles in the on-site resume viewer's look, sized down to fit two A4 pages.
export const RESUME_STYLES = `
@page { size: A4; margin: 0.5in 0.6in; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #ffffff; }
body {
  color: #1b1b1f;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 13px;
  line-height: 1.42;
  -webkit-print-color-adjust: exact;
}
a { color: inherit; text-decoration: underline; text-underline-offset: 2px; text-decoration-thickness: 0.5px; }
.external-icon { width: 9px; height: 9px; margin-left: 2px; vertical-align: baseline; }
h1, h2, h3, p, ul { margin: 0; }
.header { text-align: center; margin-bottom: 14px; }
.header h1 { font-size: 28px; font-weight: 700; line-height: 1.2; }
.header .headline { margin-top: 2px; font-size: 14px; }
.header .contact { margin-top: 5px; font-size: 11.5px; }
.block { margin-top: 13px; }
.block h2 {
  font-size: 15.5px;
  font-weight: 700;
  border-bottom: 1px solid #1b1b1f;
  padding-bottom: 2px;
  margin-bottom: 6px;
  break-after: avoid;
}
.block p { margin: 0 0 3px; }
.block ul { margin: 2px 0 7px; padding-left: 18px; }
.block li { break-inside: avoid; }
.entry { margin-bottom: 7px; }
.entry-head { display: flex; justify-content: space-between; gap: 12px; break-after: avoid; }
.entry-head span { white-space: nowrap; }
.entry-sub { font-style: italic; break-after: avoid; }
.stack { color: #4a4a52; }
`;
