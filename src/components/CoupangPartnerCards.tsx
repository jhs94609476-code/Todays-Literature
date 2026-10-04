'use client';

const INSTA_CSS = `
  .cp-insta-card {
    margin: 48px auto;
    max-width: 480px; /* 정방형 비율이 가장 예쁘게 잡히는 가로 폭 */
    background: #ffffff;
    border: 1px solid #fecdd3;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 12px 30px -8px rgba(244, 63, 94, 0.12), 0 4px 10px rgba(0, 0, 0, 0.03);
    font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .cp-insta-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -8px rgba(244, 63, 94, 0.2);
  }
  .cp-insta-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  /* 1:1 정방형(Square) 이미지 영역 */
  .cp-insta-img-box {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1; /* 인스타 규격 1:1 정사각형 고정 */
    background-color: #fdf2f8;
    overflow: hidden;
  }
  .cp-insta-img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transition: transform 0.4s ease;
  }
  .cp-insta-card:hover .cp-insta-img-box img {
    transform: scale(1.04);
  }
  /* 상단 감성 플로팅 태그 */
  .cp-insta-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    background: rgba(17, 24, 39, 0.72);
    backdrop-filter: blur(6px);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  /* 하단 설명 & 버튼 영역 */
  .cp-insta-body {
    padding: 22px;
    background: linear-gradient(180deg, #ffffff 0%, #fffbfb 100%);
  }
  .cp-insta-tag {
    display: inline-block;
    color: #e11d48;
    background: #ffe4e6;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 6px;
    margin-bottom: 8px;
  }
  .cp-insta-title {
    margin: 0 0 6px 0;
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.35;
    word-break: keep-all;
  }
  .cp-insta-desc {
    margin: 0 0 18px 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    word-break: keep-all;
  }
  .cp-insta-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 14px;
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(225, 29, 72, 0.28);
    box-sizing: border-box;
    transition: opacity 0.2s ease;
  }
  .cp-insta-card:hover .cp-insta-btn {
    opacity: 0.92;
  }
`;

const BOOK_CSS = `
  .cp-book-card {
    margin: 48px auto;
    max-width: 480px;
    background: #ffffff;
    border: 1px solid #bfdbfe;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 12px 30px -8px rgba(59, 130, 246, 0.12), 0 4px 10px rgba(0, 0, 0, 0.03);
    font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .cp-book-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -8px rgba(59, 130, 246, 0.2);
  }
  .cp-book-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .cp-book-img-box {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #eff6ff;
    overflow: hidden;
  }
  .cp-book-img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transition: transform 0.4s ease;
  }
  .cp-book-card:hover .cp-book-img-box img {
    transform: scale(1.04);
  }
  .cp-book-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    background: rgba(17, 24, 39, 0.75);
    backdrop-filter: blur(6px);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  .cp-book-body {
    padding: 22px;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  }
  .cp-book-tag {
    display: inline-block;
    color: #1d4ed8;
    background: #dbeafe;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 6px;
    margin-bottom: 8px;
  }
  .cp-book-title {
    margin: 0 0 6px 0;
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.35;
    word-break: keep-all;
  }
  .cp-book-desc {
    margin: 0 0 18px 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    word-break: keep-all;
  }
  .cp-book-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 14px;
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(29, 78, 216, 0.28);
    box-sizing: border-box;
    transition: opacity 0.2s ease;
  }
  .cp-book-card:hover .cp-book-btn {
    opacity: 0.92;
  }
`;

const LIGHT_CSS = `
  .cp-light-card {
    margin: 48px auto;
    max-width: 480px;
    background: #ffffff;
    border: 1px solid #fed7aa;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 12px 30px -8px rgba(249, 115, 22, 0.12), 0 4px 10px rgba(0, 0, 0, 0.03);
    font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .cp-light-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -8px rgba(249, 115, 22, 0.2);
  }
  .cp-light-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  .cp-light-img-box {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #fff7ed;
    overflow: hidden;
  }
  .cp-light-img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transition: transform 0.4s ease;
  }
  .cp-light-card:hover .cp-light-img-box img {
    transform: scale(1.04);
  }
  .cp-light-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    background: rgba(17, 24, 39, 0.75);
    backdrop-filter: blur(6px);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  .cp-light-body {
    padding: 22px;
    background: linear-gradient(180deg, #ffffff 0%, #fffbf7 100%);
  }
  .cp-light-tag {
    display: inline-block;
    color: #c2410c;
    background: #ffedd5;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 6px;
    margin-bottom: 8px;
  }
  .cp-light-title {
    margin: 0 0 6px 0;
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.35;
    word-break: keep-all;
  }
  .cp-light-desc {
    margin: 0 0 18px 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    word-break: keep-all;
  }
  .cp-light-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 14px;
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(234, 88, 12, 0.28);
    box-sizing: border-box;
    transition: opacity 0.2s ease;
  }
  .cp-light-card:hover .cp-light-btn {
    opacity: 0.92;
  }
`;

function KeyringCard() {
  return (
    <>
      <style>{INSTA_CSS}</style>

      {/* 쿠팡 파트너스 SNS 피드형 정사각형 카드 (다다랜드 몽실구름 키링) */}
      <div className="cp-insta-card">
        <a
          href="https://link.coupang.com/a/hzxzJ4YTC0"
          target="_blank"
          rel="nofollow sponsored noopener"
          className="cp-insta-link"
        >
          {/* SNS 1:1 정사각형 썸네일 */}
          <div className="cp-insta-img-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/keyring.jpg"
              alt="다다랜드 몽실구름 복슬 인형 데일리 키링"
            />
          </div>

          {/* 하단 텍스트 & CTA 버튼 */}
          <div className="cp-insta-body">
            <span className="cp-insta-tag">🔥 SNS 화제의 백꾸템</span>
            <h3 className="cp-insta-title">다다랜드 몽실구름 복슬 인형 데일리 키링</h3>
            <p className="cp-insta-desc">
              가방·파우치에 달아두면 다들 어디서 샀냐고 물어보는 몽글몽글 뽀글이 키링
            </p>
            <div className="cp-insta-btn">실물 디테일 &amp; 최저가 보러가기 ➔</div>
          </div>
        </a>
      </div>
    </>
  );
}

function BookCard() {
  return (
    <>
      <style>{BOOK_CSS}</style>

      {/* 쿠팡 파트너스 추천 카드 (도서: 인생 망치지 않고 웬만큼 잘 사는 법) */}
      <div className="cp-book-card">
        <a
          href="https://link.coupang.com/a/hzyu26oDPU"
          target="_blank"
          rel="nofollow sponsored noopener"
          className="cp-book-link"
        >
          <div className="cp-book-img-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/book.jpg"
              alt="인생 망치지 않고 웬만큼 잘 사는 법"
            />
            <span className="cp-book-badge">⚡ 현실 직시 필독서</span>
          </div>

          <div className="cp-book-body">
            <span className="cp-book-tag">📖 인문·처세 베스트셀러</span>
            <h3 className="cp-book-title">인생 망치지 않고 웬만큼 잘 사는 법</h3>
            <p className="cp-book-desc">
              뜬구름 잡는 위로 대신, 진짜 나를 지키며 단단하게 살아남는 현실적인 조언
            </p>
            <div className="cp-book-btn">도서 리뷰 &amp; 로켓배송 확인하기 ➔</div>
          </div>
        </a>
      </div>
    </>
  );
}

function LightCard() {
  return (
    <>
      <style>{LIGHT_CSS}</style>

      {/* 쿠팡 파트너스 추천 카드 (실용템: 휴대용 미니 독서등) */}
      <div className="cp-light-card">
        <a
          href="https://link.coupang.com/a/hzyx3YwlZQ"
          target="_blank"
          rel="nofollow sponsored noopener"
          className="cp-light-link"
        >
          <div className="cp-light-img-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/booklight.jpg"
              alt="휴대용 충전식 미니 독서등 북라이트"
            />
            <span className="cp-light-badge">🌙 야간 독서 필수템</span>
          </div>

          <div className="cp-light-body">
            <span className="cp-light-tag">💡 눈이 편안한 꿀템</span>
            <h3 className="cp-light-title">클립형 초경량 미니 LED 독서등</h3>
            <p className="cp-light-desc">
              불 끄고 침대에서 책 볼 때 삶의 질 상승! 눈부심 없는 집게형 휴대 조명
            </p>
            <div className="cp-light-btn">실물 디테일 &amp; 최저가 확인하기 ➔</div>
          </div>
        </a>
      </div>
    </>
  );
}

export type CoupangCardVariant = 'keyring' | 'book' | 'light';

export default function CoupangPartnerCards({ variant }: { variant: CoupangCardVariant }) {
  if (variant === 'keyring') return <KeyringCard />;
  if (variant === 'book') return <BookCard />;
  return <LightCard />;
}
