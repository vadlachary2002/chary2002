// Print styles mirroring the on-site resume viewer: Georgia serif, 15px body, 18px ruled headings.
export const RESUME_STYLES = `
@page { size: A4; margin: 0.5in 0.6in; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #ffffff; }
body {
  color: #1b1b1f;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 15px;
  line-height: 1.5;
  -webkit-print-color-adjust: exact;
}
a { color: inherit; text-decoration: none; }
h1, h2, h3, p, ul { margin: 0; }
.header { text-align: center; margin-bottom: 20px; }
.header h1 { font-size: 32px; font-weight: 700; line-height: 1.2; }
.header .headline { margin-top: 2px; font-size: 16px; }
.header .contact { margin-top: 6px; font-size: 13px; }
.block { margin-top: 18px; }
.block h2 {
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid #1b1b1f;
  padding-bottom: 2px;
  margin-bottom: 8px;
  break-after: avoid;
}
.block p { margin: 0 0 4px; }
.block ul { margin: 4px 0 10px; padding-left: 20px; }
.block li { break-inside: avoid; }
.entry { margin-bottom: 10px; }
.entry-head { display: flex; justify-content: space-between; gap: 12px; break-after: avoid; }
.entry-head span { white-space: nowrap; }
.entry-sub { font-style: italic; break-after: avoid; }
.stack { color: #4a4a52; }
`;
