import { NextRequest, NextResponse } from "next/server";
import {
  getCacheStats,
  clearCache,
  clearOldCache,
} from "@/lib/cache";

/**
 * GET /api/cache - Get cache statistics
 */
export async function GET(req: NextRequest) {
  try {
    const stats = await getCacheStats();

    return NextResponse.json({
      success: true,
      stats: {
        totalEntries: stats.totalEntries,
        totalSizeBytes: stats.totalSize,
        totalSizeMB: (stats.totalSize / 1024 / 1024).toFixed(2),
        oldestEntry: stats.oldestEntry ? new Date(stats.oldestEntry).toISOString() : null,
        newestEntry: stats.newestEntry ? new Date(stats.newestEntry).toISOString() : null,
      },
    });
  } catch (err: any) {
    console.error("Cache stats error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cache - Clear cache
 * Query params:
 *   - maxAge: (optional) Clear entries older than this many milliseconds
 */
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const maxAge = searchParams.get("maxAge");

    let deletedCount: number;

    if (maxAge) {
      const maxAgeMs = parseInt(maxAge, 10);
      if (isNaN(maxAgeMs) || maxAgeMs < 0) {
        return NextResponse.json(
          { error: "Invalid maxAge parameter" },
          { status: 400 }
        );
      }
      deletedCount = await clearOldCache(maxAgeMs);
    } else {
      deletedCount = await clearCache();
    }

    return NextResponse.json({
      success: true,
      message: `Cleared ${deletedCount} cache entries`,
      deletedCount,
    });
  } catch (err: any) {
    console.error("Cache clear error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
