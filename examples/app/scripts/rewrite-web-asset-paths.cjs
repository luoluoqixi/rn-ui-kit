// Cloudflare Pages 会忽略构建产物中名为 node_modules 的目录。
// Expo Web 会将部分依赖资源导出到 assets/node_modules，因此需改为可上传的 assets/vendor。
const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = path.resolve(__dirname, "..", "dist");
const assetsDirectory = path.join(outputDirectory, "assets");
const sourceDirectory = path.join(assetsDirectory, "node_modules");
const targetDirectory = path.join(assetsDirectory, "vendor");
const sourceUrl = "/assets/node_modules/";
const targetUrl = "/assets/vendor/";
const textFileExtensions = new Set([".css", ".html", ".js", ".json", ".map"]);

function visitTextFiles(directory, visitor) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      visitTextFiles(filePath, visitor);
      continue;
    }

    if (!textFileExtensions.has(path.extname(entry.name))) continue;
    visitor(filePath);
  }
}

function rewriteAssetUrls(directory) {
  visitTextFiles(directory, (filePath) => {
    const contents = fs.readFileSync(filePath, "utf8");
    if (!contents.includes(sourceUrl)) return;
    fs.writeFileSync(filePath, contents.replaceAll(sourceUrl, targetUrl));
  });
}

function findSourceUrlReferences(directory) {
  const filePaths = [];

  visitTextFiles(directory, (filePath) => {
    if (fs.readFileSync(filePath, "utf8").includes(sourceUrl)) {
      filePaths.push(filePath);
    }
  });

  return filePaths;
}

if (!fs.existsSync(sourceDirectory)) {
  const references = findSourceUrlReferences(outputDirectory);
  if (references.length > 0) {
    throw new Error(
      `Found ${references.length} generated file(s) that reference ${sourceUrl}, but ${sourceDirectory} does not exist.`
    );
  }

  console.log("No node_modules assets to rewrite.");
  process.exit(0);
}

if (fs.existsSync(targetDirectory)) {
  throw new Error(`Target asset directory already exists: ${targetDirectory}`);
}

fs.renameSync(sourceDirectory, targetDirectory);
rewriteAssetUrls(outputDirectory);
const references = findSourceUrlReferences(outputDirectory);
if (references.length > 0) {
  throw new Error(
    `Found ${references.length} generated file(s) that still reference ${sourceUrl}`
  );
}
console.log("Rewrote Web asset URLs from /assets/node_modules to /assets/vendor.");
