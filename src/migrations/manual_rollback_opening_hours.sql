-- Script de rollback para eliminar los campos agregados
-- Ejecutar este script si necesitas revertir la migración

-- Eliminar índices
DROP INDEX IF EXISTS "idx_places_opening_time";
DROP INDEX IF EXISTS "idx_places_closing_time";
DROP INDEX IF EXISTS "idx_places_tour_duration";

-- Eliminar columnas
ALTER TABLE "places" 
DROP COLUMN IF EXISTS "openingTime",
DROP COLUMN IF EXISTS "closingTime",
DROP COLUMN IF EXISTS "tourDuration";