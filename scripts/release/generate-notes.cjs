#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "../..");
const tagPattern =
  /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const conventionalCommitPattern =
  /^([a-z][a-z0-9-]*)(?:\(([^)]+)\))?(!)?:\s+(.+)$/i;
const sections = [
  { type: "feat", title: "Features" },
  { type: "fix", title: "Bug Fixes" },
  { type: "perf", title: "Performance" },
  { type: "refactor", title: "Refactoring" },
  { type: "build", title: "Build" },
  { type: "revert", title: "Reverts" },
];
const includedTypes = new Set(sections.map(({ type }) => type));

function printUsage() {
  console.log(
    "Usage: bun run release:notes <tag> [--from <tag>] [--output <file>] [--require-tag]",
  );
  console.log("Example: bun run release:notes v1.2.3 --output dist/release-notes.md");
}

function fail(message) {
  throw new Error(message);
}

function parseOptions(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const options = {
    tag: "",
    previousTag: "",
    outputPath: "",
    requireTag: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--from" || arg === "--output") {
      const value = argv[index + 1];
      if (!value || value.startsWith("-")) {
        fail(`${arg} requires a value.`);
      }

      if (arg === "--from") {
        options.previousTag = value;
      } else {
        options.outputPath = path.resolve(repoRoot, value);
      }

      index += 1;
      continue;
    }

    if (arg === "--require-tag") {
      options.requireTag = true;
      continue;
    }

    if (arg.startsWith("-")) {
      fail(`Unknown option: ${arg}`);
    }

    if (options.tag) {
      fail("Exactly one release tag is required.");
    }

    options.tag = arg;
  }

  if (!options.tag) {
    fail("A release tag is required.");
  }

  for (const tag of [options.tag, options.previousTag].filter(Boolean)) {
    if (!tagPattern.test(tag)) {
      fail(`Invalid release tag "${tag}". Expected v<semver>.`);
    }
  }

  if (options.previousTag === options.tag) {
    fail("The previous tag must be different from the release tag.");
  }

  return options;
}

function runGit(args, { allowFailure = false } = {}) {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    if (allowFailure) {
      return "";
    }

    const stderr = (result.stderr || "").trim();
    fail(stderr || `git ${args.join(" ")} exited with status ${result.status}.`);
  }

  return (result.stdout || "").trim();
}

function tagExists(tag) {
  return Boolean(
    runGit(["rev-parse", "--verify", "--quiet", `refs/tags/${tag}^{commit}`], {
      allowFailure: true,
    }),
  );
}

function assertTagExists(tag) {
  if (!tagExists(tag)) {
    fail(`Release tag "${tag}" does not exist.`);
  }
}

function findPreviousTag(revision) {
  return runGit(
    [
      "describe",
      "--tags",
      "--abbrev=0",
      "--match",
      "v[0-9]*.[0-9]*.[0-9]*",
      revision,
    ],
    { allowFailure: true },
  );
}

function readCommits(targetRevision, previousTag) {
  const revision = previousTag ? `${previousTag}..${targetRevision}` : targetRevision;
  const output = runGit(["log", "--no-merges", "--format=%H%x09%s", revision]);

  if (!output) {
    return [];
  }

  return output.split(/\r?\n/).map((line) => {
    const separatorIndex = line.indexOf("\t");
    if (separatorIndex === -1) {
      fail(`Unexpected git log entry: ${line}`);
    }

    return {
      hash: line.slice(0, separatorIndex),
      subject: line.slice(separatorIndex + 1),
    };
  });
}

function parseCommit(commit) {
  const match = conventionalCommitPattern.exec(commit.subject);
  if (!match) {
    return null;
  }

  const [, rawType, scope, breakingMarker, subject] = match;
  const type = rawType.toLowerCase();

  if (!includedTypes.has(type)) {
    return null;
  }

  return {
    ...commit,
    type,
    scope: scope || "",
    breaking: Boolean(breakingMarker),
    description: subject.trim(),
  };
}

function resolveRepositoryUrl() {
  if (process.env.GITHUB_REPOSITORY) {
    const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
    return `${serverUrl.replace(/\/+$/, "")}/${process.env.GITHUB_REPOSITORY}`;
  }

  const remoteUrl = runGit(["remote", "get-url", "origin"], { allowFailure: true });
  if (!remoteUrl) {
    return "";
  }

  const sshMatch = /^git@([^:]+):(.+?)(?:\.git)?$/.exec(remoteUrl);
  if (sshMatch) {
    return `https://${sshMatch[1]}/${sshMatch[2].replace(/\.git$/, "")}`;
  }

  const httpMatch = /^(https?:\/\/.+?)(?:\.git)?$/.exec(remoteUrl);
  return httpMatch ? httpMatch[1].replace(/\.git$/, "") : "";
}

function formatCommit(commit, repositoryUrl) {
  const shortHash = commit.hash.slice(0, 7);
  const commitReference = repositoryUrl
    ? `[\`${shortHash}\`](${repositoryUrl}/commit/${commit.hash})`
    : `\`${shortHash}\``;
  const scope = commit.scope ? `**${commit.scope}:** ` : "";

  return `- ${scope}${commit.description} (${commitReference})`;
}

function generateNotes(tag, previousTag, commits) {
  const repositoryUrl = resolveRepositoryUrl();
  const parsedCommits = commits.map(parseCommit).filter(Boolean);
  const breakingCommits = parsedCommits.filter(({ breaking }) => breaking);
  const lines = [];

  if (breakingCommits.length > 0) {
    lines.push("## Breaking Changes", "");
    lines.push(...breakingCommits.map((commit) => formatCommit(commit, repositoryUrl)), "");
  }

  for (const section of sections) {
    const sectionCommits = parsedCommits.filter(
      ({ type, breaking }) => type === section.type && !breaking,
    );

    if (sectionCommits.length === 0) {
      continue;
    }

    lines.push(`## ${section.title}`, "");
    lines.push(...sectionCommits.map((commit) => formatCommit(commit, repositoryUrl)), "");
  }

  if (parsedCommits.length === 0) {
    lines.push("_No user-facing changes were found in the commit history._", "");
  }

  if (repositoryUrl && previousTag) {
    lines.push(
      `**Full Changelog:** [${previousTag}...${tag}]` +
        `(${repositoryUrl}/compare/${previousTag}...${tag})`,
      "",
    );
  }

  return `${lines.join("\n").trim()}\n`;
}

function writeNotes(notes, outputPath) {
  if (!outputPath) {
    process.stdout.write(notes);
    return;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, notes, "utf8");
  console.log(`Release notes: ${outputPath}`);
}

function main() {
  const options = parseOptions(process.argv.slice(2));
  const targetTagExists = tagExists(options.tag);

  if (!targetTagExists && options.requireTag) {
    fail(`Release tag "${options.tag}" does not exist.`);
  }

  const targetRevision = targetTagExists ? options.tag : "HEAD";
  const previousRevision = targetTagExists ? `${options.tag}^` : targetRevision;
  const previousTag = options.previousTag || findPreviousTag(previousRevision);
  if (previousTag) {
    if (!tagPattern.test(previousTag)) {
      fail(`Previous tag "${previousTag}" is not a supported release tag.`);
    }

    assertTagExists(previousTag);
  }

  if (!targetTagExists) {
    console.error(
      `Release tag "${options.tag}" does not exist; previewing commits through HEAD.`,
    );
  }

  const commits = readCommits(targetRevision, previousTag);
  const notes = generateNotes(options.tag, previousTag, commits);
  writeNotes(notes, options.outputPath);
}

try {
  main();
} catch (error) {
  console.error(`Release notes failed: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
}
