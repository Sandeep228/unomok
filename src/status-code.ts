import * as fs from 'fs';
import  Table from 'cli-table3';

const logData: string[] = fs.readFileSync('prod-api-prod-out.log', 'utf8').split('\n');

// Define an object to store status counts
const statusCounts: { [statusCode: string]: number } = {
  '200': 0,
  '404': 0,
  '500': 0,
  '304': 0,
  // Add more status codes as needed
};

// Parse each log entry and count status codes
logData.forEach((line) => {
  // Extract status code from access log entries
  const accessLogRegex = /"GET \/.* HTTP\/1\.1" (\d+)/;
  const match = line.match(accessLogRegex);
  if (match) {
    const httpStatus = match[1];
    if (httpStatus in statusCounts) {
      statusCounts[httpStatus]++;
    }
  }
});

// Create a table
const table = new Table({
  head: ['status_info', 'status_code', 'count'],
  colWidths: [20, 10, 10],
});

// Populate the table with status count data
for (const [statusCode, count] of Object.entries(statusCounts)) {
  let statusInfo: string;
  switch (statusCode) {
    case '200':
      statusInfo = 'OK';
      break;
    case '404':
      statusInfo = 'Not found';
      break;
    case '500':
      statusInfo = 'Server Error';
      break;
    case '304':
      statusInfo = 'Not changed';
      break;
    default:
      statusInfo = 'Unknown';
      break;
  }

  table.push([statusInfo, statusCode, count]);
}

// Display the table
console.log(table.toString());
