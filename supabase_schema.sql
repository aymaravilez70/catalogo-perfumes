-- ==========================================
-- TABLA DE PERFUMES (JOUFAB PERFUMES)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.perfumes (
    id TEXT PRIMARY KEY,
    num TEXT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    page INTEGER,
    category TEXT,
    gender TEXT,
    description TEXT,
    occasions TEXT,
    votes JSONB DEFAULT '{}'::jsonb,
    notes JSONB DEFAULT '{"salida":[],"corazon":[],"base":[]}'::jsonb,
    banner_page INTEGER,
    image TEXT,
    page_image TEXT,
    banner_image TEXT,
    bottle_side TEXT DEFAULT 'LEFT',
    badge TEXT,
    season_badge TEXT,
    best_season TEXT DEFAULT 'todo-el-ano',
    best_moment TEXT DEFAULT 'versatil',
    tags JSONB DEFAULT '[]'::jsonb,
    accords JSONB DEFAULT '[]'::jsonb,
    price NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 5.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Seguridad RLS
ALTER TABLE public.perfumes ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público
DROP POLICY IF EXISTS "Permitir lectura publica de perfumes" ON public.perfumes;
CREATE POLICY "Permitir lectura publica de perfumes" ON public.perfumes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir insercion de perfumes" ON public.perfumes;
CREATE POLICY "Permitir insercion de perfumes" ON public.perfumes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizacion de perfumes" ON public.perfumes;
CREATE POLICY "Permitir actualizacion de perfumes" ON public.perfumes FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir eliminacion de perfumes" ON public.perfumes;
CREATE POLICY "Permitir eliminacion de perfumes" ON public.perfumes FOR DELETE USING (true);

-- BUCKET DE IMAGENES PARA SUBIR FOTOS DE PERFUMES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('perfume-images', 'perfume-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Politicas para Storage
DROP POLICY IF EXISTS "Lectura publica de fotos de perfumes" ON storage.objects;
CREATE POLICY "Lectura publica de fotos de perfumes" ON storage.objects FOR SELECT USING (bucket_id = 'perfume-images');

DROP POLICY IF EXISTS "Subida publica de fotos de perfumes" ON storage.objects;
CREATE POLICY "Subida publica de fotos de perfumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'perfume-images');

DROP POLICY IF EXISTS "Actualizacion de fotos de perfumes" ON storage.objects;
CREATE POLICY "Actualizacion de fotos de perfumes" ON storage.objects FOR UPDATE USING (bucket_id = 'perfume-images');

DROP POLICY IF EXISTS "Eliminacion de fotos de perfumes" ON storage.objects;
CREATE POLICY "Eliminacion de fotos de perfumes" ON storage.objects FOR DELETE USING (bucket_id = 'perfume-images');

-- ==========================================
-- CARGA INICIAL DE PERFUMES
-- ==========================================

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'khamrah-qahwa', '01', 'Khamrah Qahwa', 'Lattafa', 2,
  'Gourmand Especiado', 'Unisex', 'Khamrah Qahwa envuelve con una dulzura cálida y sofisticada, donde el café aporta profundidad a un acorde especiado, cremoso y gourmand.', 'Ideal para noches frescas, citas especiales, cenas elegantes y celebraciones nocturnas, especialmente en climas fríos y ambientes cerrados.',
  '{"invierno":11700,"primavera":1900,"verano":751,"otoño":9300,"dia":3800,"noche":9700}'::jsonb, '{"salida":["Canela","Cardamomo","Jengibre"],"corazon":["Praliné","Frutas Confitadas","Flores Blancas"],"base":["Café","Vainilla","Haba Tonka","Benjuí","Almizcle"]}'::jsonb, NULL,
  '/assets/perfumes/khamrah-qahwa.jpg', '/assets/perfumes/khamrah-qahwa_page.jpg', NULL, 'LEFT',
  'Top Gourmand ☕', 'Invierno / Otoño', 'invierno', 'noche',
  '["Café","Canela","Dulce","Cálido","Citas"]'::jsonb, '["Cálido Especiado","Café","Dulce Gourmand","Avainillado"]'::jsonb, 55, 4.9, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'hawas-kobra', '02', 'Hawas Kobra', 'Rasasi', 3,
  'Cítrico Especiado', 'Masculino', 'Una estimulante y especiada apertura de jengibre y cítricos vibrantes que evoluciona hacia un elegante corazón de té verde y canela. Su fondo ambarino y amaderado sella una estela limpia, magnética y sofisticada.', 'Ideal para salidas nocturnas en clima fresco, citas especiales por la noche, eventos formales y reuniones corporativas importantes.',
  '{"invierno":417,"primavera":1400,"verano":1600,"otoño":879,"dia":1500,"noche":690}'::jsonb, '{"salida":["Jengibre","Bergamota","Naranja Tangerina"],"corazon":["Canela","Té Verde","Neroli"],"base":["Almizcle","Amaderado","Ámbar"]}'::jsonb, NULL,
  '/assets/perfumes/hawas-kobra.jpg', '/assets/perfumes/hawas-kobra_page.jpg', NULL, 'RIGHT',
  'Nuevo Lanzamiento 🐍', 'Versátil / Primavera', 'primavera', 'versatil',
  '["Jengibre","Té Verde","Cítrico","Limpio","Elegante"]'::jsonb, '["Cítrico Especiado","Té Verde","Amaderado","Ámbar"]'::jsonb, 50, 4.8, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'hawas-ice', '03', 'Hawas Ice', 'Rasasi', 4,
  'Acuático Frutal Fresco', 'Masculino', 'Una revitalizante y gélida explosión frutal de manzana y limón italiano con un toque especiado de anís, que evoluciona hacia un corazón de ciruela y azahar. Fondo moderno de ámbar y almizcle.', 'Ideal para actividades al aire libre en clima cálido, salidas casuales durante el día, eventos deportivos veraniegos y citas informales.',
  '{"invierno":1300,"primavera":5300,"verano":6200,"otoño":2600,"dia":5500,"noche":2300}'::jsonb, '{"salida":["Manzana","Limón Italiano","Bergamota","Anís Estrellado"],"corazon":["Ciruela","Flor Azahar de Naranjo","Cardamomo"],"base":["Trozos de Madera","Musgo","Almizcle","Ámbar"]}'::jsonb, 5,
  '/assets/perfumes/hawas-ice.jpg', '/assets/perfumes/hawas-ice_page.jpg', '/assets/banners/hawas-ice_banner.jpg', 'LEFT',
  'Best Seller Verano ❄️', 'Verano / Calor', 'verano', 'dia',
  '["Manzana","Menta","Fresco","Acuático","Verano"]'::jsonb, '["Aromático Frutal","Acuático","Cítrico Gélido","Almizclado"]'::jsonb, 60, 5, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'fakhar-black', '04', 'Fakhar Black', 'Lattafa', 6,
  'Fougère Amaderado Aromático', 'Masculino', 'Una sofisticada y magnética armonía que combina la frescura chispeante de la manzana y la bergamota con un corazón aromático de lavanda y salvia, sobre un fondo cálido de haba tonka y cedro.', 'Ideal para el uso diario en la oficina, salidas casuales en clima templado, citas nocturnas especiales y eventos sociales versátiles.',
  '{"invierno":1100,"primavera":3800,"verano":3200,"otoño":2400,"dia":4100,"noche":2700}'::jsonb, '{"salida":["Jengibre","Bergamota","Manzana"],"corazon":["Lavanda","Salvia","Geranio","Bayas de Enebro"],"base":["Haba Tonka","Cedro","Vetiver","Madera de Ámbar"]}'::jsonb, NULL,
  '/assets/perfumes/fakhar-black.jpg', '/assets/perfumes/fakhar-black_page.jpg', NULL, 'RIGHT',
  'Firma Elegante 🖤', 'Todo el Año', 'primavera', 'versatil',
  '["Manzana","Lavanda","Oficina","Fougère","Versátil"]'::jsonb, '["Fougère Fresco","Aromático","Amaderado","Limpio"]'::jsonb, 45, 4.7, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'khamrah', '05', 'Khamrah', 'Lattafa', 7,
  'Gourmand Cálido Dulce', 'Unisex', 'Khamrah envuelve con una dulzura cálida, especiada y sofisticada, combinando frutos maduros, vainilla y maderas en un aroma gourmand de presencia inolvidable.', 'Ideal para citas nocturnas, cenas elegantes, fiestas formales, noches frías y eventos especiales en ambientes sofisticados.',
  '{"invierno":14200,"primavera":1200,"verano":450,"otoño":11300,"dia":2900,"noche":13800}'::jsonb, '{"salida":["Canela","Nuez Moscada","Bergamota"],"corazon":["Dátiles","Praliné","Mahonial","Nardos"],"base":["Vainilla","Benjuí","Amberwood","Mirra","Akigalawood","Haba Tonka"]}'::jsonb, NULL,
  '/assets/perfumes/khamrah.jpg', '/assets/perfumes/khamrah_page.jpg', NULL, 'LEFT',
  'El Rey Gourmand 👑', 'Invierno / Noches', 'invierno', 'noche',
  '["Dátiles","Canela","Praliné","Vainilla","Fiesta"]'::jsonb, '["Canela Cálida","Dulce Dátil","Amaderado","Ámbar"]'::jsonb, 52, 4.9, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'honor-and-glory', '06', 'Bade''e Al Oud Honor & Glory', 'Lattafa', 8,
  'Gourmand Frutal Especiado', 'Unisex', 'Una opulenta y envolvente armonía que fusiona la cremosidad de la piña caramelizada con la calidez especiada de la cúrcuma y la canela, sobre un fondo adictivo de crème brûlée, vainilla y sándalo.', 'Ideal para citas especiales por la noche, eventos elegantes en clima fresco, salidas nocturnas formales y ocasiones memorables durante el invierno.',
  '{"invierno":8900,"primavera":2400,"verano":950,"otoño":7100,"dia":3500,"noche":7800}'::jsonb, '{"salida":["Piña Caramelizada","Crème Brûlée"],"corazon":["Canela","Benjuí","Pimienta Negra","Azafrán de la India"],"base":["Vainilla","Sándalo","Musgo","Cachemira"]}'::jsonb, 9,
  '/assets/perfumes/honor-and-glory.jpg', '/assets/perfumes/honor-and-glory_page.jpg', '/assets/banners/honor-and-glory_banner.jpg', 'RIGHT',
  'Exótico & Adictivo 🍍', 'Otoño / Invierno', 'invierno', 'noche',
  '["Piña","Crème Brûlée","Canela","Sándalo","Gourmand"]'::jsonb, '["Piña Caramelizada","Cremoso Dulce","Especias Cálidas","Sándalo"]'::jsonb, 58, 4.9, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'odyssey-homme', '07', 'Odyssey Homme White Edition', 'Armaf', 10,
  'Acuático Cítrico Especiado', 'Masculino', 'Una luminosa y envolvente armonía que fusiona la frescura chispeante de los cítricos y notas acuáticas con un corazón especiado y un fondo cálido de vainilla y maderas preciosas.', 'Ideal para salidas informales en clima cálido, uso diario en la oficina, citas románticas veraniegas y eventos casuales al aire libre.',
  '{"invierno":1400,"primavera":4900,"verano":5800,"otoño":2800,"dia":5100,"noche":2600}'::jsonb, '{"salida":["Cardamomo","Pimienta Rosa","Menta"],"corazon":["Salvia","Notas Acuáticas","Piña"],"base":["Cedro","Amberwood","Vainilla"]}'::jsonb, 11,
  '/assets/perfumes/odyssey-homme.jpg', '/assets/perfumes/odyssey-homme_page.jpg', '/assets/banners/odyssey-homme_banner.jpg', 'LEFT',
  'Frescura Imponente 🌊', 'Verano / Primavera', 'verano', 'dia',
  '["Acuático","Cardamomo","Menta","Oficina","Limpio"]'::jsonb, '["Acuático Cítrico","Especiado Fresco","Vainilla Suave","Maderas"]'::jsonb, 48, 4.6, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'odyssey-mandarin-sky', '14', 'Odyssey Mandarin Sky', 'Armaf', 12,
  'Cítrico Acaramelado Ambarino', 'Masculino', 'Una deslumbrante fusión de cítricos luminosos y un irresistible corazón ambarino con matices de caramelo. Equilibra a la perfección la frescura frutal con la elegancia dulce moderna.', 'Ideal para salidas informales en clima cálido, citas nocturnas memorables, uso diario en la oficina y eventos sociales todo el año.',
  '{"invierno":2800,"primavera":5200,"verano":4100,"otoño":4600,"dia":4800,"noche":4200}'::jsonb, '{"salida":["Mandarina","Naranja","Salvia","Azafrán"],"corazon":["Caramelo","Haba Tonka","Cempasúchil"],"base":["Ambroxán","Vetiver","Cedro"]}'::jsonb, 13,
  '/assets/perfumes/odyssey-mandarin-sky.jpg', '/assets/perfumes/odyssey-mandarin-sky_page.jpg', '/assets/banners/odyssey-mandarin-sky_banner.jpg', 'RIGHT',
  'Adictivo & Cítrico 🍊', 'Todo el Año', 'primavera', 'versatil',
  '["Mandarina","Caramelo","Haba Tonka","Moderno","Citas"]'::jsonb, '["Cítrico Brillante","Caramelo Dulce","Ambarino","Almizcle"]'::jsonb, 50, 4.8, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'club-de-nuit-milestone', '08', 'Club De Nuit Milestone', 'Armaf', 14,
  'Marino Frutal Amaderado', 'Unisex', 'Una vibrante y sofisticada fusión de notas marinas, frutos rojos y bergamota con un corazón amaderado y un fondo cálido de almizcle y sándalo. Un aroma fresco, elegante y distintivo.', 'Ideal para el uso diario en la oficina, salidas casuales en clima cálido, eventos diurnos al aire libre y citas especiales en verano.',
  '{"invierno":900,"primavera":4800,"verano":6500,"otoño":2300,"dia":6100,"noche":1900}'::jsonb, '{"salida":["Notas Acuáticas","Frutas Rojas","Bergamota"],"corazon":["Sándalo","Maderas Blancas","Violeta"],"base":["Almizcle","Vetiver","Ambroxan"]}'::jsonb, 15,
  '/assets/perfumes/club-de-nuit-milestone.jpg', '/assets/perfumes/club-de-nuit-milestone_page.jpg', '/assets/banners/club-de-nuit-milestone_banner.jpg', 'RIGHT',
  'Lujo Marino & Salado 💎', 'Verano / Calor', 'verano', 'dia',
  '["Marino","Frutos Rojos","Brisa Salada","Elegante","Verano"]'::jsonb, '["Marino Mineral","Frutas Rojas","Amaderado Refinado","Almizcle"]'::jsonb, 54, 4.8, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  '9-pm', '09', '9 PM', 'Afnan', 16,
  'Dulce Avainillado Seductor', 'Masculino', 'Una irresistible y seductora armonía que funde la dulzura de la manzana y la canela con un corazón de flor de azahar, sobre un fondo adictivo de vainilla y ámbar. Un aroma audaz, cálido y magnético.', 'Ideal para salidas nocturnas en clima frío, citas románticas especiales, fiestas memorables y eventos nocturnos formales.',
  '{"invierno":9400,"primavera":3100,"verano":1200,"otoño":7900,"dia":2100,"noche":10500}'::jsonb, '{"salida":["Manzana","Canela","Bergamota","Lavanda"],"corazon":["Lirio de los Valles","Flor de Azahar de Naranjo"],"base":["Vainilla","Haba Tonka","Pachulí","Ámbar"]}'::jsonb, NULL,
  '/assets/perfumes/9-pm.jpg', '/assets/perfumes/9-pm_page.jpg', NULL, 'LEFT',
  'Imán de Cumplidos 🔥', 'Noche / Invierno', 'invierno', 'noche',
  '["Manzana","Vainilla","Canela","Fiesta","Seducción"]'::jsonb, '["Dulce Seductor","Avainillado","Canela Especiada","Ámbar"]'::jsonb, 46, 4.9, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  '9-am-dive', '10', '9 AM Dive', 'Afnan', 17,
  'Acuático Cítrico Menta Fresco', 'Unisex', 'Una revitalizante y luminosa armonía que fusiona la frescura chispeante de la menta, los cítricos y la grosella negra con un corazón especiado y un fondo amaderado y almizclado.', 'Ideal para el uso diario en la oficina, salidas casuales en clima cálido, actividades deportivas al aire libre y eventos diurnos informales.',
  '{"invierno":1100,"primavera":5800,"verano":6900,"otoño":2500,"dia":6700,"noche":1800}'::jsonb, '{"salida":["Menta","Limón","Pimienta Rosa","Grosellas Negras"],"corazon":["Manzana","Incienso","Cedro"],"base":["Jengibre","Sándalo","Jazmín","Pachulí"]}'::jsonb, 18,
  '/assets/perfumes/9-am-dive.jpg', '/assets/perfumes/9-am-dive_page.jpg', '/assets/banners/9-am-dive_banner.jpg', 'RIGHT',
  'Chute de Energía ⚡', 'Verano / Deporte', 'verano', 'dia',
  '["Menta","Limón","Grosellas","Fresco","Gym"]'::jsonb, '["Menta Helada","Cítrico Vibrante","Acuático","Almizclado"]'::jsonb, 48, 4.7, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'asad', '11', 'Asad', 'Lattafa', 19,
  'Especiado Cálido Ámbar Tabaco', 'Masculino', 'Una imponente y especiada armonía que fusiona la calidez de la pimienta negra, el tabaco y la piña con un corazón profundo de café y pachulí, sobre un fondo adictivo de vainilla, ládano y ámbar.', 'Ideal para salidas nocturnas en clima frío, citas románticas especiales, eventos formales nocturnos y ocasiones elegantes durante el invierno.',
  '{"invierno":10800,"primavera":2100,"verano":680,"otoño":8900,"dia":2400,"noche":11200}'::jsonb, '{"salida":["Pimienta Negra","Tabaco","Piña"],"corazon":["Iris","Café","Pachulí"],"base":["Vainilla","Benjuí","Madera Seca","Ámbar","Ládano"]}'::jsonb, NULL,
  '/assets/perfumes/asad.jpg', '/assets/perfumes/asad_page.jpg', NULL, 'LEFT',
  'Potencia Masculina 🦁', 'Invierno / Formal', 'invierno', 'noche',
  '["Pimienta","Tabaco","Café","Pachulí","Autoridad"]'::jsonb, '["Especiado Oscuro","Tabaco","Café Amargo","Ámbar Cálido"]'::jsonb, 45, 4.8, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'nitro-red', '12', 'Nitro Red', 'Dumont', 20,
  'Frutal Acuático Dulce', 'Masculino', 'Una explosión frutal vibrante y moderna que fusiona la frescura chispeante de la sandía y la manzana con un fondo ambarino y magnético. Audaz, enérgico y altamente cumplidor.', 'Ideal para salidas nocturnas en clima templado, citas especiales por la noche, eventos casuales en días cálidos y reuniones sociales.',
  '{"invierno":1800,"primavera":4600,"verano":5900,"otoño":3200,"dia":4700,"noche":4100}'::jsonb, '{"salida":["Manzana","Lavanda","Bergamota"],"corazon":["Sandía","Cedro","Cálamo"],"base":["Ámbar","Sándalo","Pachulí"]}'::jsonb, 21,
  '/assets/perfumes/nitro-red.jpg', '/assets/perfumes/nitro-red_page.jpg', '/assets/banners/nitro-red_banner.jpg', 'RIGHT',
  'Bomba de Sandía 🍉', 'Primavera / Verano', 'verano', 'versatil',
  '["Sandía","Manzana","Juicy","Proyección Bestial","Casual"]'::jsonb, '["Frutal Dulce Sandía","Aromático","Ámbar Moderno","Pachulí"]'::jsonb, 52, 4.9, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'eclaire', '13', 'Eclaire', 'Lattafa', 22,
  'Gourmand Lactónico Dulce', 'Unisex / Femenino', 'Una deliciosa y envolvente armonía gourmand que fusiona la calidez del caramelo y la leche con un corazón de miel y flores blancas, sobre un fondo adictivo de vainilla y praliné.', 'Ideal para citas románticas en clima fresco, salidas nocturnas informales, eventos elegantes de tarde y uso diario acogedor en invierno.',
  '{"invierno":9800,"primavera":2800,"verano":1100,"otoño":8400,"dia":4200,"noche":8600}'::jsonb, '{"salida":["Caramelo","Leche","Azúcar"],"corazon":["Miel","Flores Blancas"],"base":["Vainilla","Praliné","Almizcle"]}'::jsonb, NULL,
  '/assets/perfumes/eclaire.jpg', '/assets/perfumes/eclaire_page.jpg', NULL, 'LEFT',
  'Dulzura Gourmet 🍨', 'Otoño / Invierno', 'invierno', 'noche',
  '["Caramelo","Leche","Miel","Vainilla","Acogedor"]'::jsonb, '["Lactónico Dulce","Caramelo Dorado","Vainilla Cremosa","Miel"]'::jsonb, 55, 5, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;

INSERT INTO public.perfumes (
  id, num, name, brand, page, category, gender, description, occasions,
  votes, notes, banner_page, image, page_image, banner_image, bottle_side,
  badge, season_badge, best_season, best_moment, tags, accords, price, rating, is_active
) VALUES (
  'yara-pink', '15', 'Yara Pink', 'Lattafa', 23,
  'Dulce Tropical Almizclado', 'Femenino', 'Una delicada y envolvente armonía tropical que fusiona la suavidad de la orquídea y el heliotropo con un corazón cremoso de frutas exóticas, sobre un fondo adictivo de vainilla y almizcle.', 'Ideal para el uso diario en la oficina, salidas casuales en clima templado, citas románticas diurnas y eventos sociales informales.',
  '{"invierno":2600,"primavera":5400,"verano":4300,"otoño":2900,"dia":5700,"noche":1800}'::jsonb, '{"salida":["Heliotropo","Orquídea","Mandarina"],"corazon":["Acorde Gourmand","Frutas Tropicales"],"base":["Vainilla","Sándalo","Almizcle"]}'::jsonb, NULL,
  '/assets/perfumes/yara-pink.jpg', '/assets/perfumes/yara-pink_page.jpg', NULL, 'LEFT',
  'Fresa & Crema Chic 🍓', 'Primavera / Diario', 'primavera', 'dia',
  '["Orquídea","Frutas Tropicales","Dulce","Femenino","Limpio"]'::jsonb, '["Dulce Atalcado","Tropical Suave","Vainilla","Almizclado"]'::jsonb, 42, 4.8, true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  notes = EXCLUDED.notes,
  tags = EXCLUDED.tags,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender;
