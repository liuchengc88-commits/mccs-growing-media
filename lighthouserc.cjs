module.exports = {
  ci: {
    collect: {
      staticDistDir: '.',
      url: ['http://localhost/', 'http://localhost/products/', 'http://localhost/contact/', 'http://localhost/ar/'],
      numberOfRuns: 2,
      settings: { chromeFlags: '--no-sandbox' }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }]
      }
    },
    upload: { target: 'filesystem', outputDir: 'tmp/lighthouse-reports' }
  }
};
