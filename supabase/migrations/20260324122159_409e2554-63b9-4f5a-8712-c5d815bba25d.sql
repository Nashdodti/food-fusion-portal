CREATE TABLE public.recipes (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    title character varying NOT NULL,
    description text,
    ingredients text[] NOT NULL,
    instructions text[] NOT NULL,
    prep_time integer NOT NULL,
    cook_time integer NOT NULL,
    servings integer NOT NULL,
    image_url text,
    category character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert recipes" ON public.recipes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update recipes" ON public.recipes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete recipes" ON public.recipes FOR DELETE USING (true);