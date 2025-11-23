# Gen2 Response Caching System

## Overview

A robust, persistent file-based caching mechanism for the `/api/gen2` endpoint that dramatically reduces API costs and response times by caching identical requests.

## How It Works

### 1. Input Hashing
When a request is received, the system creates a deterministic SHA256 hash from:
- **Image content**: Hash of the image buffer
- **Metadata**: Normalized JSON (sorted keys) of patent information

This ensures identical inputs always produce the same hash.

### 2. Cache Flow

```
Request → Hash Input → Check Cache
                          ↓
                    Cache Hit?
                    ↙        ↘
                  YES         NO
                   ↓          ↓
            Return Cached   Execute Pipeline
            Response        (OpenAI + FAL + S3)
                                ↓
                           Cache Response
                                ↓
                           Return Response
```

### 3. What Gets Cached

**Cache Hits (identical inputs) skip:**
- OpenAI API call (~$0.01-0.05 per request)
- FAL.ai image generation (~$0.05-0.10 per request)
- S3 upload and storage costs
- 10-30 seconds of processing time

**Response includes:**
```json
{
  "success": true,
  "patent": {...},
  "generatedPrompt": {...},
  "falOutput": {...},
  "falRequestId": "...",
  "s3Url": "https://...",
  "cached": true/false,
  "cacheTimestamp": 1234567890
}
```

## Cache Storage

- **Location**: `.cache/gen2/` in project root
- **Format**: JSON files named `{hash}.json`
- **Excluded from git**: Added to `.gitignore`

### Cache Entry Structure

```json
{
  "hash": "abc123...",
  "timestamp": 1234567890,
  "input": {
    "metaHash": "def456...",
    "imageHash": "ghi789..."
  },
  "response": {
    "success": true,
    "patent": {...},
    "generatedPrompt": {...},
    "falOutput": {...},
    "falRequestId": "...",
    "s3Url": "..."
  }
}
```

## API Endpoints

### GET /api/cache

Get cache statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalEntries": 15,
    "totalSizeBytes": 1234567,
    "totalSizeMB": "1.18",
    "oldestEntry": "2025-01-15T10:30:00.000Z",
    "newestEntry": "2025-01-23T14:45:00.000Z"
  }
}
```

### DELETE /api/cache

Clear cache entries.

**Clear all cache:**
```bash
curl -X DELETE http://localhost:3000/api/cache
```

**Clear entries older than 7 days:**
```bash
# 7 days = 604800000 milliseconds
curl -X DELETE "http://localhost:3000/api/cache?maxAge=604800000"
```

**Response:**
```json
{
  "success": true,
  "message": "Cleared 12 cache entries",
  "deletedCount": 12
}
```

## Cache Headers

All `/api/gen2` responses include cache headers:

**Cache Hit:**
```
X-Cache: HIT
X-Cache-Hash: abc123...
```

**Cache Miss:**
```
X-Cache: MISS
X-Cache-Hash: abc123...
```

## Usage Examples

### Check Cache Stats

```bash
curl http://localhost:3000/api/cache
```

### Clear Old Cache (30 days)

```bash
# 30 days = 2592000000 ms
curl -X DELETE "http://localhost:3000/api/cache?maxAge=2592000000"
```

### Clear All Cache

```bash
curl -X DELETE http://localhost:3000/api/cache
```

## Benefits

### Cost Savings
- **OpenAI**: Eliminates duplicate GPT-5.1 calls
- **FAL.ai**: Eliminates duplicate image generations
- **S3**: Reduces storage and bandwidth (cached responses reuse S3 URLs)

### Performance
- **Cache Hit**: ~10-50ms response time
- **Cache Miss**: ~10-30 seconds (OpenAI + FAL processing)
- **Speed Improvement**: 200-3000x faster for cached requests

### Deterministic
- Same input = same output (always)
- Perfect for iterative testing and development

## Implementation Details

### Files Modified
- `app/api/gen2/route.ts`: Integrated caching logic
- `lib/cache.ts`: Cache utility functions (NEW)
- `app/api/cache/route.ts`: Cache management API (NEW)
- `.gitignore`: Added `.cache/` directory

### Key Functions

**lib/cache.ts**:
- `createInputHash(imageBuffer, meta)`: Create deterministic hash
- `getCacheEntry(hash)`: Retrieve cached response
- `setCacheEntry(hash, imageBuffer, meta, response)`: Store response
- `getCacheStats()`: Get cache statistics
- `clearCache()`: Clear all entries
- `clearOldCache(maxAge)`: Clear entries older than maxAge

### Error Handling

The cache system is **fault-tolerant**:
- Cache read failures → Proceed with API calls
- Cache write failures → Return response without caching
- Invalid cache files → Skipped during stats/cleanup
- File system errors → Logged but don't crash requests

## Best Practices

1. **Monitor cache size**: Use `GET /api/cache` to track storage
2. **Periodic cleanup**: Run `DELETE /api/cache?maxAge=X` to remove old entries
3. **Development**: Clear cache when testing new features
4. **Production**: Let cache grow to maximize savings

## Testing

The cache is transparent to existing code. To verify:

1. **First request** (cache miss):
   - Check response: `"cached": false`
   - Check headers: `X-Cache: MISS`
   - Note the response time (~15-25s)

2. **Second identical request** (cache hit):
   - Check response: `"cached": true`, `"cacheTimestamp": ...`
   - Check headers: `X-Cache: HIT`
   - Note the response time (~20-50ms)

3. **Check logs**:
   ```
   [CACHE MISS] Processing new request for hash: abc123...
   [CACHE WRITE] Cached response for hash: abc123...
   [CACHE HIT] Returning cached response for hash: abc123...
   ```

## Troubleshooting

### Cache not working
- Check file permissions in `.cache/gen2/`
- Check console logs for cache errors
- Verify TypeScript compilation succeeded

### Cache growing too large
- Use `DELETE /api/cache?maxAge=X` to prune old entries
- Consider implementing automatic cleanup (e.g., daily cron job)

### Need to bust cache for specific input
- Delete specific cache file: `.cache/gen2/{hash}.json`
- Or clear entire cache: `curl -X DELETE http://localhost:3000/api/cache`

## Future Enhancements

Potential improvements:
- Redis/database backend for distributed caching
- TTL (time-to-live) for automatic expiration
- Cache warming for common requests
- Cache analytics and hit rate tracking
- LRU eviction policy for size limits
