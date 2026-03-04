CREATE MATERIALIZED VIEW IF NOT EXISTS daily_metrics AS
SELECT date("dropoffPlannedAt") AS date,
       count(*) AS total_loads,
       sum(CASE WHEN status='DELIVERED' THEN 1 ELSE 0 END) AS delivered_loads,
       100.0 * avg(CASE WHEN "dropoffActualAt" <= "dropoffPlannedAt" THEN 1 ELSE 0 END) AS on_time_dropoff_pct,
       avg("costUsd" / GREATEST("distanceMiles", 1)) AS avg_cost_per_mile
FROM "Load"
GROUP BY 1;
-- Refresh with: REFRESH MATERIALIZED VIEW daily_metrics;
