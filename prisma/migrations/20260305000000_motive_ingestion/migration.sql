-- AlterEnum
ALTER TYPE "LoadStatus" ADD VALUE IF NOT EXISTS 'OTHER';

-- AlterTable
ALTER TABLE "Load" ADD COLUMN IF NOT EXISTS "motiveDispatchId" TEXT;
ALTER TABLE "Load" ADD COLUMN IF NOT EXISTS "motiveVehicleId" TEXT;
ALTER TABLE "Load" ADD COLUMN IF NOT EXISTS "motiveDriverId" TEXT;
ALTER TABLE "Load" ADD COLUMN IF NOT EXISTS "rawStatus" TEXT;
ALTER TABLE "Load" ADD COLUMN IF NOT EXISTS "vehicleId" TEXT;

ALTER TABLE "Location" ADD COLUMN IF NOT EXISTS "motiveDispatchLocationId" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Vehicle" (
  "id" TEXT NOT NULL,
  "motiveVehicleId" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "name" TEXT,
  CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Load_motiveDispatchId_key" ON "Load"("motiveDispatchId");
CREATE INDEX IF NOT EXISTS "Load_motiveDispatchId_idx" ON "Load"("motiveDispatchId");
CREATE INDEX IF NOT EXISTS "Load_motiveVehicleId_idx" ON "Load"("motiveVehicleId");
CREATE INDEX IF NOT EXISTS "Load_motiveDriverId_idx" ON "Load"("motiveDriverId");
CREATE INDEX IF NOT EXISTS "Load_vehicleId_idx" ON "Load"("vehicleId");

CREATE UNIQUE INDEX IF NOT EXISTS "Location_motiveDispatchLocationId_key" ON "Location"("motiveDispatchLocationId");
CREATE INDEX IF NOT EXISTS "Location_motiveDispatchLocationId_idx" ON "Location"("motiveDispatchLocationId");

CREATE UNIQUE INDEX IF NOT EXISTS "Vehicle_motiveVehicleId_key" ON "Vehicle"("motiveVehicleId");
CREATE INDEX IF NOT EXISTS "Vehicle_motiveVehicleId_idx" ON "Vehicle"("motiveVehicleId");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'Load_vehicleId_fkey'
  ) THEN
    ALTER TABLE "Load" ADD CONSTRAINT "Load_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
