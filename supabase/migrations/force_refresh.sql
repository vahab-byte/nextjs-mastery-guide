-- METHOD 1: Standard Reload Command
NOTIFY pgrst, 'reload config';

-- METHOD 2: Schema Metadata Update (Forces cache invalidation)
COMMENT ON TABLE public.modules IS 'Course modules content - Cache Refresh';

-- METHOD 3: Toggle RLS (Forces policy cache rebuild)
ALTER TABLE public.modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- METHOD 4: Verify visibility
-- If this query returns data, the table definitely exists.
SELECT count(*) as module_count FROM public.modules;
