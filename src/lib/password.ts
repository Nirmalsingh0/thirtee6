import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

function sha256Hex(input: string) {
  const h = createHash("sha256");
  h.update(input);
  return h.digest("hex");
}

export function makePasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const digest = sha256Hex(`${salt}:${password}`);
  return `sha256:${salt}:${digest}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algo, salt, digest] = stored.split(":");
  if (algo !== "sha256" || !salt || !digest) return false;

  const expected = Buffer.from(sha256Hex(`${salt}:${password}`), "hex");
  const actual = Buffer.from(digest, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

