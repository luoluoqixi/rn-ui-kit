const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

/** 整个发布过程共用一把锁；只有其构建子进程可以复用持有者的 token。 */
function withReleaseLock(repoRoot, action, inheritedToken = "") {
  const lockDir = path.join(repoRoot, "dist/.package-release.lock");
  const ownerFile = path.join(lockDir, "owner.json");
  if (inheritedToken) {
    const owner = JSON.parse(fs.readFileSync(ownerFile, "utf8"));
    if (owner.token !== inheritedToken) throw new Error(`Invalid release lock: ${lockDir}`);
    return action(inheritedToken);
  }

  fs.mkdirSync(path.dirname(lockDir), { recursive: true });
  try {
    fs.mkdirSync(lockDir);
  } catch (error) {
    if (error.code === "EEXIST")
      throw new Error(`Another release build holds the release lock: ${lockDir}`);
    throw error;
  }
  try {
    const token = randomUUID();
    fs.writeFileSync(ownerFile, JSON.stringify({ token, pid: process.pid }));
    return action(token);
  } finally {
    fs.rmSync(lockDir, { recursive: true, force: true });
  }
}

module.exports = { withReleaseLock };
