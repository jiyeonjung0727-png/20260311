# Supabase 로또 번호 저장 설정 방법

추첨된 로또 번호를 Supabase에 저장하려면 아래 순서대로 진행하세요.

---

## 1. Supabase 프로젝트 만들기

1. [Supabase](https://supabase.com) 접속 후 로그인
2. **New project** → 프로젝트 이름·비밀번호 입력 후 생성
3. 프로젝트가 준비될 때까지 잠시 대기

---

## 2. 테이블 생성

Supabase 대시보드에서 **SQL Editor** 메뉴로 이동한 뒤, 아래 SQL을 실행하세요.

```sql
-- 로또 추첨 기록 테이블
create table if not exists lotto_draws (
  id uuid default gen_random_uuid() primary key,
  numbers integer[] not null,
  created_at timestamptz default now()
);

-- 익명 사용자도 insert 가능 (웹에서 바로 저장하려면)
alter table lotto_draws enable row level security;

create policy "Allow anonymous insert"
  on lotto_draws for insert
  to anon
  with check (true);

-- 조회는 누구나 (선택 사항)
create policy "Allow anonymous select"
  on lotto_draws for select
  to anon
  using (true);
```

- `numbers`: 추첨된 6개 번호 배열 (예: `[7, 12, 23, 31, 33, 45]`)
- `created_at`: 저장 시각 (자동)

---

## 3. API 키 확인

1. Supabase 대시보드에서 **Project Settings** (휴지통 아이콘 옆)
2. **API** 메뉴 선택
3. 아래 두 값을 복사:
   - **Project URL** → `SUPABASE_URL`에 넣을 값
   - **anon public** 키 → `SUPABASE_ANON_KEY`에 넣을 값

---

## 4. 배포 환경에 맞게 설정

### Vercel로 배포한 경우 (권장)

1. Vercel 대시보드 → 해당 프로젝트 → **Settings** → **Environment Variables**
2. 아래 두 개 추가:

| Name | Value |
|------|--------|
| `SUPABASE_URL` | Supabase Project URL (예: `https://xxxxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Supabase anon public 키 |

3. **Save** 후 재배포(또는 다음 배포 시)부터 적용됩니다.  
   프론트는 `/api/config`를 호출해 이 값을 받아 Supabase 클라이언트를 만듭니다.

### 로컬 또는 다른 호스팅

- `index.html`에 값을 직접 넣지 않아도 됩니다.  
- Vercel이 아닌 환경에서는 `/api/config`가 없으므로 Supabase 저장은 하지 않고, 나머지 기능(Spin, 당첨 시뮬레이션 등)은 그대로 동작합니다.

---

## 5. 저장 여부 확인 (Vercel + 환경 변수 설정 후)

Supabase 대시보드 → **Table Editor** → **lotto_draws** 테이블에서  
`numbers`, `created_at` 컬럼으로 저장된 데이터를 확인할 수 있습니다.

---

## 보안 참고

- `anon` 키는 브라우저에 노출되므로 **insert만 허용**하고, 수정/삭제는 서버나 인증된 사용자만 하도록 정책을 추가하는 것을 권장합니다.
- 추후 로그인을 넣을 경우 `auth.uid()`로 정책을 제한할 수 있습니다.
