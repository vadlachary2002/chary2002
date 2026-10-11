export const BROWSERS = {
  chrome: 'chrome',
  edge: 'edge',
  firefox: 'firefox',
  safari: 'safari',
  mobile: 'mobile',
  other: 'other',
} as const;

export type Browser = (typeof BROWSERS)[keyof typeof BROWSERS];

export interface EnableSteps {
  browser: Browser;
  name: string;
  steps: string[];
}

export const WEBGL_ENABLE_STEPS: EnableSteps[] = [
  {
    browser: BROWSERS.chrome,
    name: 'Chrome',
    steps: [
      'Open the ⋮ menu and choose Settings.',
      'Go to System.',
      'Turn on "Use graphics acceleration when available".',
      'Click Relaunch, then come back to this page.',
    ],
  },
  {
    browser: BROWSERS.edge,
    name: 'Edge',
    steps: [
      'Open the … menu and choose Settings.',
      'Go to System and performance.',
      'Turn on "Use graphics acceleration when available".',
      'Click Restart, then come back to this page.',
    ],
  },
  {
    browser: BROWSERS.firefox,
    name: 'Firefox',
    steps: [
      'Open the ☰ menu and choose Settings.',
      'Under General → Performance, untick "Use recommended performance settings".',
      'Tick "Use hardware acceleration when available" and restart Firefox.',
      'Still off? Open about:config and set webgl.disabled to false.',
    ],
  },
  {
    browser: BROWSERS.safari,
    name: 'Safari',
    steps: [
      'WebGL is built into Safari and on by default.',
      'Update to the latest macOS or iOS version.',
      'If you changed developer feature flags, reset them to their defaults.',
    ],
  },
  {
    browser: BROWSERS.mobile,
    name: 'your phone or tablet',
    steps: [
      'Update your browser from the App Store or Play Store.',
      'Turn off Battery Saver or Low Power Mode, which can limit graphics.',
      'Close and reopen the browser, then reload this page.',
      'Still off? Open this page in Chrome or Safari.',
    ],
  },
  {
    browser: BROWSERS.other,
    name: 'Other browsers',
    steps: [
      'Turn on hardware or graphics acceleration in your browser settings.',
      'Update the browser to its latest version.',
      'Or open this page in Chrome, Edge, Firefox or Safari.',
    ],
  },
];

const MOBILE_PATTERN = /Android|iPhone|iPad|iPod|Mobile/;

// Best guess at the visitor's browser from its user agent; phones first, and Edge before Chrome because it reports both.
export function detectBrowser(userAgent: string): Browser {
  if (MOBILE_PATTERN.test(userAgent)) return BROWSERS.mobile;
  if (/Edg\//.test(userAgent)) return BROWSERS.edge;
  if (/Firefox\//.test(userAgent)) return BROWSERS.firefox;
  if (/Chrome\/|CriOS\//.test(userAgent)) return BROWSERS.chrome;
  if (/Safari\//.test(userAgent)) return BROWSERS.safari;
  return BROWSERS.other;
}
