-- Esegui questa query nel pannello SQL del tuo database PostgreSQL su Render:
ALTER TABLE favorites
ADD COLUMN likes INTEGER DEFAULT 0,
ADD COLUMN dislikes INTEGER DEFAULT 0,
ADD COLUMN locked BOOLEAN DEFAULT false;


-- Colonne per like/dislike/locked
ALTER TABLE games ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE games ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;
ALTER TABLE games ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT FALSE;
