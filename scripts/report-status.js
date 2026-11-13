const r = require('../report.json');
const s = r.stats;
console.log(`expected=${s.expected} unexpected=${s.unexpected} flaky=${s.flaky} skipped=${s.skipped}`);
process.exit(s.unexpected > 0 ? 1 : 0);