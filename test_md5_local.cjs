const crypto = require('crypto');
const sigData = '1:ps-uNlXJfoDZFChETnbj/aPBRiGSrzMYmHQKcqAWOtVsLUp+I-1781041914-91.120.84.8-3f9499b148bd4870bee6303591f9a858:iw2516rkmeut09:{"session": null, "calls": [{"ident": "heroGetAll", "name": "heroGetAll", "args": {}}]}:LIBRARY-VERSION=1UNIQUE-SESSION-ID=246786681941269158UNIQUE-SESSION-UUID=3b885072-03c8-4dc8-8524-86932b9ee722';
console.log('sigData:', sigData);
console.log('MD5:', crypto.createHash('md5').update(sigData).digest('hex'));
