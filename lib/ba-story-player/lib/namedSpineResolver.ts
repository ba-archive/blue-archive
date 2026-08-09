/**
 * Named character spines (e.g. hasumi_spr, justice_normal1_spr) may live on either
 * ba-all-data or ba-all-data-spine42, and either copy may be Spine 3.8 or 4.2.
 * Generic ch/np sprites always use spine42 and skip this resolver.
 */

const SPINE_VERSION_IN_BINARY = /(?:3\.8|4\.[0-2])(?:\.\d+)*/;
const PEEK_BYTES = 255;
const resolveCache = new Map<string, Promise<string>>();

export function toSpine42CdnUrl(url: string): string {
  if (url.includes("ba-all-data-spine42")) {
    return url;
  }
  return url.replaceAll("ba-all-data", "ba-all-data-spine42");
}

export function toBaAllDataCdnUrl(url: string): string {
  return url.replaceAll("ba-all-data-spine42", "ba-all-data");
}

/** Folder id without `_spr`, e.g. `hasumi` / `ch0066` / `justice_normal1`. */
function spineFolderId(skelUrl: string): string | null {
  const folder = skelUrl.match(/\/spine\/([^/]+)\//i)?.[1];
  if (!folder || !/_spr$/i.test(folder)) {
    return null;
  }
  return folder.replace(/_spr$/i, "");
}

export function isGenericCharacterSpineId(id: string): boolean {
  return /^(ch|np)\d+$/i.test(id);
}

/** Named *_spr character skeletons need CDN+version probing. */
export function needsNamedSpineResolve(skelUrl: string): boolean {
  const id = spineFolderId(skelUrl);
  return id !== null && !isGenericCharacterSpineId(id);
}

function parseSpineVersionFromBytes(buf: Uint8Array): string | null {
  if (buf.length === 0) {
    return null;
  }
  // JSON export
  if (buf[0] === 0x7b /* { */) {
    const text = new TextDecoder().decode(buf);
    return text.match(/"spine"\s*:\s*"([^"]+)"/)?.[1] ?? null;
  }
  // Binary: hash layout differs 3.8 vs 4.x — scan for a version-looking ASCII run.
  const text = new TextDecoder("latin1").decode(buf);
  return text.match(SPINE_VERSION_IN_BINARY)?.[0] ?? null;
}

type PeekResult = {
  url: string;
  ok: boolean;
  version: string | null;
};

async function peekSpineSkel(url: string): Promise<PeekResult> {
  try {
    let res = await fetch(url, {
      headers: { Range: `bytes=0-${PEEK_BYTES}` },
    });

    if (res.status === 404) {
      return { url, ok: false, version: null };
    }

    // Some CDNs ignore Range or reject it; fall back to a full GET.
    if (!res.ok && res.status !== 206) {
      res = await fetch(url);
      if (res.status === 404) {
        return { url, ok: false, version: null };
      }
      if (!res.ok) {
        return { url, ok: false, version: null };
      }
    }

    const raw = new Uint8Array(await res.arrayBuffer());
    const buf = raw.byteLength > PEEK_BYTES + 1 ? raw.slice(0, PEEK_BYTES + 1) : raw;
    return { url, ok: true, version: parseSpineVersionFromBytes(buf) };
  } catch (err) {
    console.warn(`[ba-story-player] Failed to peek spine skel: ${url}`, err);
    return { url, ok: false, version: null };
  }
}

function isSpine42Version(version: string | null): boolean {
  return Boolean(version?.startsWith("4.2"));
}

/**
 * Pick a reachable Spine 4.2 .skel for a named character sprite.
 * Prefer ba-all-data-spine42 when both CDNs have 4.2.
 */
export async function resolveNamedSpineSkelUrl(skelUrl: string): Promise<string> {
  const cacheKey = toBaAllDataCdnUrl(skelUrl);
  const cached = resolveCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const task = (async () => {
    const spine42Url = toSpine42CdnUrl(skelUrl);
    const dataUrl = toBaAllDataCdnUrl(skelUrl);

    const [spine42, data] = await Promise.all([
      peekSpineSkel(spine42Url),
      peekSpineSkel(dataUrl),
    ]);

    const candidates = [spine42, data];
    const v42 = candidates.find(c => c.ok && isSpine42Version(c.version));
    if (v42) {
      if (v42.url !== skelUrl) {
        console.info(
          `[ba-story-player] Named spine resolved to 4.2:\n  ${skelUrl}\n  -> ${v42.url} (spine ${v42.version})`
        );
      }
      return v42.url;
    }

    const available = candidates.filter(c => c.ok);
    if (available.length > 0) {
      const summary = available
        .map(c => `${c.url} (spine ${c.version ?? "unknown"})`)
        .join("\n  ");
      throw new Error(
        `Named spine has no Spine 4.2 copy (runtime only supports 4.2):\n  ${summary}`
      );
    }

    throw new Error(`Named spine 404 on both CDNs:\n  ${spine42Url}\n  ${dataUrl}`);
  })();

  resolveCache.set(cacheKey, task);
  try {
    return await task;
  } catch (err) {
    resolveCache.delete(cacheKey);
    throw err;
  }
}
