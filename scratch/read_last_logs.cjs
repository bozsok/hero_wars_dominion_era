const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/Bozsó Krisztián/.gemini/antigravity-ide/brain/b594fedb-dbc3-4a47-b26f-58e9c762c11d/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(logPath)) {
  console.log('Log file not found');
  process.exit(1);
}

const lines = fs.readFileSync(logPath, 'utf8').trim().split('\n');

lines.forEach((line) => {
  try {
    const data = JSON.parse(line);
    if (data.step_index >= 210 && data.step_index <= 235) {
      console.log(`=== STEP ${data.step_index} (${data.source} / ${data.type}) ===`);
      if (data.content) {
        console.log('Content:', data.content.substring(0, 1000));
      }
      if (data.tool_calls) {
        console.log('Tool Calls:', JSON.stringify(data.tool_calls, null, 2));
      }
    }
  } catch (e) {
    // ignore
  }
});
