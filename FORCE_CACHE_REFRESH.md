# Leaderboard Cache Issue - Force Refresh

## Step 1: Verify Database is Actually Updated

Run this query in Supabase SQL Editor to check the student's current XP:

```sql
SELECT 
    u.name,
    u.email,
    u.xp_points as current_xp_in_db,
    COALESCE(SUM(xa.xp_amount), 0) as total_from_awards
FROM next_auth.users u
LEFT JOIN xp_awards xa ON u.id = xa.user_id
WHERE u.email = '2022278936.shahrzan@g.sharda.ac.in'
GROUP BY u.id, u.name, u.email, u.xp_points;
```

**Expected Result**: Both columns should show **85**

If they don't match, the UPDATE didn't work. If they DO match, it's a caching issue.

---

## Step 2: Force Cache Invalidation

The leaderboard is cached for 60 seconds. Even after database update, you're seeing old cached data.

### Option A: Wait 60 seconds
Just wait 1 minute and refresh the page.

### Option B: Force Cache Clear (Immediate)

Run this in your terminal:

```bash
cd /Users/mohammadsameer/Desktop/College/Technova_2025_to_2026/technova_website_v2

# Restart the Next.js dev server
# Press Ctrl+C to stop the current server
# Then restart with:
npm run dev
```

After restart, refresh the leaderboard page.

---

## Step 3: Alternative - Trigger Cache Revalidation

If the above doesn't work, we can trigger cache revalidation by checking in a student (any student) to any event. This will call `revalidateTag('leaderboard')` which clears the cache.

---

## If Database Shows Wrong XP

If Step 1 shows the XP is still 5 in the database, then we need to check:

### Check if xp_awards has the data:

```sql
SELECT 
    user_id,
    event_id,
    xp_amount,
    awarded_at
FROM xp_awards
WHERE user_id IN (
    SELECT id FROM next_auth.users 
    WHERE email = '2022278936.shahrzan@g.sharda.ac.in'
)
ORDER BY awarded_at DESC;
```

This should show 4 rows: 5, 50, 15, 15

### Then run the UPDATE again with explicit schema:

```sql
UPDATE next_auth.users
SET xp_points = (
    SELECT COALESCE(SUM(xp_amount), 0)
    FROM xp_awards
    WHERE xp_awards.user_id = next_auth.users.id
)
WHERE id IN (
    SELECT user_id FROM xp_awards
);
```

---

## Quick Debug: Check Cache Tags

The issue is likely Next.js cache. The `unstable_cache` in leaderboard.ts caches for 60 seconds with tag 'leaderboard'.

When you update the database directly via SQL, Next.js doesn't know to invalidate the cache.

**Solution**: Restart dev server OR wait 60 seconds OR trigger a check-in to force revalidation.
