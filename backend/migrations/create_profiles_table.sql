-- Profiles 테이블 생성 (Lemon Squeezy 구독 관리)
-- Supabase SQL Editor에서 실행하세요

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR UNIQUE NOT NULL,  -- 사용자 고유 ID (auth.users.id와 연결)
    
    -- Lemon Squeezy 구독 정보
    ls_customer_id VARCHAR,  -- Lemon Squeezy Customer ID
    ls_subscription_id VARCHAR,  -- Lemon Squeezy Subscription ID
    subscription_status VARCHAR DEFAULT 'inactive',  -- 'active', 'cancelled', 'expired', 'inactive'
    subscription_plan VARCHAR,  -- 'pro', 'free', etc.
    
    -- 플랜 제한
    total_listings_limit INTEGER DEFAULT 100,  -- Pro 플랜: 무제한 또는 큰 수, Free: 100
    
    -- 메타데이터
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_ls_customer_id ON profiles(ls_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_ls_subscription_id ON profiles(ls_subscription_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 완료 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ profiles 테이블 생성 완료!';
    RAISE NOTICE '✅ Lemon Squeezy 구독 관리 준비 완료';
END $$;

