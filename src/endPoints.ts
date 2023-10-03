import * as fs from "fs";
import Table from "cli-table3";


interface EndpointCounts {
  [endpoint: string]: number;
}

const logData: string[] = fs.readFileSync("prod-api-prod-out.log", "utf8").split("\n");

const endpointCounts: EndpointCounts = {};

logData.forEach((line: string) => {
  const parts: string[] = line.split(" ");
  if (parts.length >= 12) {
    const endpoint: string = parts.slice(9, 12).join(" ");
    if (endpoint in endpointCounts) {
      endpointCounts[endpoint]++;
    } else {
      endpointCounts[endpoint] = 1;
    }
  }
});

const table = new Table({
  head: ["Endpoint", "Count"],
  colWidths: [80, 10],
});

for (const [endpoint, count] of Object.entries(endpointCounts)) {
  table.push([endpoint, count]);
}

console.log(table.toString());
