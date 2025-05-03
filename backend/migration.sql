-- Esegui questa query nel pannello SQL del tuo database PostgreSQL su Render:
ALTER TABLE favorites
ADD COLUMN likes INTEGER DEFAULT 0,
ADD COLUMN dislikes INTEGER DEFAULT 0,
ADD COLUMN locked BOOLEAN DEFAULT false;
