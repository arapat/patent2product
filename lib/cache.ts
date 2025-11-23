import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache", "gen2");

export interface CacheEntry<T = any> {
  hash: string;
  timestamp: number;
  input: {
    metaHash: string;
    imageHash: string;
  };
  response: T;
}

/**
 * Initialize cache directory
 */
async function ensureCacheDir(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err: any) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}

/**
 * Create a deterministic hash from input data
 */
export function createInputHash(imageBuffer: Buffer, meta: any): string {
  // Hash image content
  const imageHash = createHash("sha256").update(imageBuffer).digest("hex");

  // Normalize metadata by sorting keys and stringifying
  const normalizedMeta = JSON.stringify(meta, Object.keys(meta).sort());
  const metaHash = createHash("sha256").update(normalizedMeta).digest("hex");

  // Combine both hashes
  const combinedHash = createHash("sha256")
    .update(imageHash + metaHash)
    .digest("hex");

  return combinedHash;
}

/**
 * Get cache file path for a given hash
 */
function getCachePath(hash: string): string {
  return path.join(CACHE_DIR, `${hash}.json`);
}

/**
 * Read cache entry if it exists
 */
export async function getCacheEntry<T = any>(
  hash: string
): Promise<CacheEntry<T> | null> {
  try {
    await ensureCacheDir();
    const cachePath = getCachePath(hash);
    const data = await fs.readFile(cachePath, "utf-8");
    const entry: CacheEntry<T> = JSON.parse(data);
    return entry;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return null; // Cache miss
    }
    // Log other errors but don't crash
    console.error("Cache read error:", err);
    return null;
  }
}

/**
 * Write cache entry
 */
export async function setCacheEntry<T = any>(
  hash: string,
  imageBuffer: Buffer,
  meta: any,
  response: T
): Promise<void> {
  try {
    await ensureCacheDir();

    const imageHash = createHash("sha256").update(imageBuffer).digest("hex");
    const normalizedMeta = JSON.stringify(meta, Object.keys(meta).sort());
    const metaHash = createHash("sha256").update(normalizedMeta).digest("hex");

    const entry: CacheEntry<T> = {
      hash,
      timestamp: Date.now(),
      input: {
        metaHash,
        imageHash,
      },
      response,
    };

    const cachePath = getCachePath(hash);
    await fs.writeFile(cachePath, JSON.stringify(entry, null, 2), "utf-8");
  } catch (err) {
    // Log error but don't crash the request
    console.error("Cache write error:", err);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalEntries: number;
  totalSize: number;
  oldestEntry: number | null;
  newestEntry: number | null;
}> {
  try {
    await ensureCacheDir();
    const files = await fs.readdir(CACHE_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    let totalSize = 0;
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;

    for (const file of jsonFiles) {
      const filePath = path.join(CACHE_DIR, file);
      const stat = await fs.stat(filePath);
      totalSize += stat.size;

      try {
        const data = await fs.readFile(filePath, "utf-8");
        const entry: CacheEntry = JSON.parse(data);
        if (oldestEntry === null || entry.timestamp < oldestEntry) {
          oldestEntry = entry.timestamp;
        }
        if (newestEntry === null || entry.timestamp > newestEntry) {
          newestEntry = entry.timestamp;
        }
      } catch {
        // Skip invalid cache files
      }
    }

    return {
      totalEntries: jsonFiles.length,
      totalSize,
      oldestEntry,
      newestEntry,
    };
  } catch (err) {
    console.error("Cache stats error:", err);
    return {
      totalEntries: 0,
      totalSize: 0,
      oldestEntry: null,
      newestEntry: null,
    };
  }
}

/**
 * Clear all cache entries
 */
export async function clearCache(): Promise<number> {
  try {
    await ensureCacheDir();
    const files = await fs.readdir(CACHE_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    for (const file of jsonFiles) {
      await fs.unlink(path.join(CACHE_DIR, file));
    }

    return jsonFiles.length;
  } catch (err) {
    console.error("Cache clear error:", err);
    return 0;
  }
}

/**
 * Delete cache entries older than specified milliseconds
 */
export async function clearOldCache(maxAge: number): Promise<number> {
  try {
    await ensureCacheDir();
    const files = await fs.readdir(CACHE_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const now = Date.now();
    let deletedCount = 0;

    for (const file of jsonFiles) {
      const filePath = path.join(CACHE_DIR, file);
      try {
        const data = await fs.readFile(filePath, "utf-8");
        const entry: CacheEntry = JSON.parse(data);
        if (now - entry.timestamp > maxAge) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      } catch {
        // Skip invalid cache files
      }
    }

    return deletedCount;
  } catch (err) {
    console.error("Cache cleanup error:", err);
    return 0;
  }
}
