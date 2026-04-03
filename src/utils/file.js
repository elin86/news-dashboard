import fs from "fs-extra";

export async function readJson(path) {
  return fs.readJson(path);
}

export async function writeJson(path, data) {
  await fs.outputJson(path, data, { spaces: 2 });
}