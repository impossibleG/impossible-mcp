import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import process from "node:process";

// Match Windows profile paths written with single (C:\Users\) or JSON-escaped (C:\\Users\\) separators.
const patterns = [
  /[A-Za-z]:\\{1,2}Users\\{1,2}/,
  /\/Users\//,
  /\/home\//,
  /BEGIN PRIVATE KEY/,
  /api_key=/,
];
const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
for (const pattern of patterns) {
  const matches = [];
  for (const path of tracked) {
    if (path.endsWith("privacy-check.mjs")) continue;
    try {
      if (pattern.test(await readFile(path, "utf8"))) matches.push(path);
    } catch {
      // Binary and inaccessible files do not participate in the text scan.
    }
  }
  if (matches.length) throw new Error(`Privacy check matched ${pattern} in ${matches.join(", ")}`);
}
process.stdout.write("privacy check passed\n");
