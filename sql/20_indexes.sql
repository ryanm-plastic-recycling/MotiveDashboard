CREATE INDEX IF NOT EXISTS idx_loads_pickup_planned_at ON "Load" ("pickupPlannedAt");
CREATE INDEX IF NOT EXISTS idx_loads_dropoff_planned_at ON "Load" ("dropoffPlannedAt");
CREATE INDEX IF NOT EXISTS idx_loads_status ON "Load" ("status");
CREATE INDEX IF NOT EXISTS idx_loads_carrier ON "Load" ("carrierId");
CREATE INDEX IF NOT EXISTS idx_loads_customer ON "Load" ("customerId");
CREATE INDEX IF NOT EXISTS idx_events_load_event_at ON "LoadEvent" ("loadId", "eventAt");
CREATE INDEX IF NOT EXISTS idx_locations_lat_lon ON "Location" (lat, lon);
