-- Track which teams have been sent QR code emails
ALTER TABLE hackathon_teams ADD COLUMN IF NOT EXISTS qr_emailed BOOLEAN DEFAULT false;
