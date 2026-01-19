-- Rádio Cidadania FM - Schema PostgreSQL para Supabase
-- Execute este script no SQL Editor do Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- News table
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('destaque', 'eventos', 'radio', 'saude', 'educacao', 'esportes')),
  image_url TEXT,
  author VARCHAR(255),
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  host VARCHAR(255) NOT NULL,
  host_photo TEXT,
  day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo')),
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  position INTEGER DEFAULT 1 NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_programs_day ON programs(day_of_week);
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs(active);
CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(read);
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements(active);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON advertisements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news
CREATE POLICY "Anyone can view published news" ON news
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own news" ON news
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own news" ON news
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for programs
CREATE POLICY "Anyone can view active programs" ON programs
  FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can manage programs" ON programs
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for contacts
CREATE POLICY "Anyone can insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contacts" ON contacts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for advertisements
CREATE POLICY "Anyone can view active advertisements" ON advertisements
  FOR SELECT USING (active = true);

CREATE POLICY "Authenticated users can manage advertisements" ON advertisements
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for settings
CREATE POLICY "Anyone can view settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings for social media links
INSERT INTO settings (key, value, description) VALUES
  ('whatsapp_url', '', 'Link do WhatsApp da rádio'),
  ('facebook_url', '', 'Link do Facebook da rádio'),
  ('instagram_url', '', 'Link do Instagram da rádio')
ON CONFLICT (key) DO NOTHING;

-- Insert sample data (optional)
-- Uncomment if you want some initial data

-- INSERT INTO programs (title, description, host, day_of_week, start_time, end_time) VALUES
--   ('Programa Manhã na Cidade', 'Notícias e música para começar o dia', 'João Silva', 'segunda', '06:00', '09:00'),
--   ('Esportes em Foco', 'Tudo sobre esportes locais e nacionais', 'Maria Santos', 'terca', '18:00', '19:00');

COMMENT ON TABLE news IS 'Notícias do site da rádio';
COMMENT ON TABLE programs IS 'Programação da rádio';
COMMENT ON TABLE contacts IS 'Mensagens de contato recebidas';
COMMENT ON TABLE advertisements IS 'Anúncios exibidos no site';
COMMENT ON TABLE settings IS 'Configurações gerais do site';
