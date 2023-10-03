import * as fs from 'fs';
import  Table from 'cli-table3';

// Read the log file
const logData: string[] = fs.readFileSync('prod-api-prod-out.log', 'utf8').split('\n');

// Create an object to store API calls per minute
const callsPerMinute: { [minute: string]: number } = {};

// Parse each log entry and count calls per minute
logData.forEach((line) => {
  const parts: string[] = line.split(' ');
  if (parts.length >= 5) {
    const timestamp: string = parts.slice(0, 5).join(' ');
    const minute: string = timestamp.substring(0, 16); // Extract the minute portion of the timestamp
    if (minute in callsPerMinute) {
      callsPerMinute[minute]++;
    } else {
      callsPerMinute[minute] = 1;
    }
  }
});

// Create a table
const table = new Table({
  head: ['Minute', 'API Calls'],
  colWidths: [20, 10],
});

// Populate the table with API calls per minute data
for (const [minute, callCount] of Object.entries(callsPerMinute)) {
  table.push([minute, callCount]);
}

// Display the table
console.log(table.toString());
