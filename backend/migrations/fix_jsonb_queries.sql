-- JSONB 쿼리 안정화를 위한 스키마 업데이트
-- Supabase SQL Editor에서 실행하세요

-- analysis_meta JSONB 필드 추가 (없는 경우)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS analysis_meta JSONB DEFAULT '{}'::jsonb;

-- is_zombie 필드 추가 (없는 경우)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS is_zombie BOOLEAN DEFAULT FALSE;

-- zombie_score 필드 추가 (없는 경우)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS zombie_score FLOAT;

-- item_id 필드 추가 (없는 경우, ebay_item_id와 별도)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS item_id VARCHAR;

-- platform 필드 추가 (없는 경우, marketplace와 별도)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS platform VARCHAR;

-- GIN 인덱스 추가 (JSONB 쿼리 성능 향상)
CREATE INDEX IF NOT EXISTS idx_listings_analysis_meta 
ON listings USING GIN (analysis_meta);

-- 이미 있는 경우 무시
CREATE INDEX IF NOT EXISTS idx_listings_metrics_gin 
ON listings USING GIN (metrics);

-- JSONB 내부 키 인덱스 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_listings_metrics_zombie_score 
ON listings ((metrics->>'zombie_score'));

CREATE INDEX IF NOT EXISTS idx_listings_analysis_meta_action 
ON listings ((analysis_meta->'recommendation'->>'action'));

-- 복합 인덱스 (user_id + JSONB 필터 최적화)
-- ✅ FIX: user_id 필터와 JSONB 쿼리를 함께 사용하는 경우 성능 향상
CREATE INDEX IF NOT EXISTS idx_listings_user_metrics_gin 
ON listings (user_id) 
WHERE metrics IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_listings_user_platform 
ON listings (user_id, platform) 
WHERE platform IS NOT NULL;

-- JSONB 내부 키 복합 인덱스 (자주 사용되는 쿼리 패턴 최적화)
CREATE INDEX IF NOT EXISTS idx_listings_user_metrics_sales 
ON listings (user_id, ((metrics->>'sales'))) 
WHERE metrics IS NOT NULL AND metrics ? 'sales';

CREATE INDEX IF NOT EXISTS idx_listings_user_metrics_views 
ON listings (user_id, ((metrics->>'views'))) 
WHERE metrics IS NOT NULL AND metrics ? 'views';

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ JSONB 쿼리 안정화 스키마 업데이트 완료!';
    RAISE NOTICE '✅ analysis_meta, is_zombie, zombie_score 필드 추가됨';
    RAISE NOTICE '✅ GIN 인덱스 생성 완료';
    RAISE NOTICE '✅ 복합 인덱스 생성 완료 (user_id + JSONB 최적화)';
END $$;

