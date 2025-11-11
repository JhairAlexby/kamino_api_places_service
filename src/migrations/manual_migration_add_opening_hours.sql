-- Migración para agregar campos de horario y duración de tour a la tabla places
-- Ejecutar este script directamente en tu base de datos PostgreSQL

-- Agregar las nuevas columnas
ALTER TABLE "places" 
ADD COLUMN IF NOT EXISTS "openingTime" TIME NULL,
ADD COLUMN IF NOT EXISTS "closingTime" TIME NULL,
ADD COLUMN IF NOT EXISTS "tourDuration" INTEGER NULL;

-- Comentarios para documentar las columnas
COMMENT ON COLUMN "places"."openingTime" IS 'Hora de apertura del lugar';
COMMENT ON COLUMN "places"."closingTime" IS 'Hora de cierre del lugar';
COMMENT ON COLUMN "places"."tourDuration" IS 'Duración estimada del tour en minutos';

-- Índice para mejorar búsquedas por horario (opcional)
CREATE INDEX IF NOT EXISTS "idx_places_opening_time" ON "places" ("openingTime");
CREATE INDEX IF NOT EXISTS "idx_places_closing_time" ON "places" ("closingTime");
CREATE INDEX IF NOT EXISTS "idx_places_tour_duration" ON "places" ("tourDuration");

-- Verificar que las columnas se agregaron correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'places' 
AND column_name IN ('openingTime', 'closingTime', 'tourDuration');