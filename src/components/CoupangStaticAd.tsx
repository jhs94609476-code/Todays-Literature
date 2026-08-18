'use client';

interface CoupangStaticAdProps {
  type: 'top' | 'bottom';
}

export default function CoupangStaticAd({ type }: CoupangStaticAdProps) {
  if (type === 'top') {
    return (
      <div className="flex justify-center my-6 w-full overflow-hidden">
        <a
          href="https://link.coupang.com/a/fTi3H3h0Am"
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          referrerPolicy="unsafe-url"
          className="inline-block hover:opacity-95 transition-opacity max-w-full"
        >
          <img
            src="https://ads-partners.coupang.com/banners/1013100?trackingCode=AF5508221&subId=&traceId=V0-301-969b06e95b87326d-I1013100&w=728&h=90"
            alt="쿠팡 특가 배너"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </a>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-6 w-full overflow-hidden">
      <a
        href="https://link.coupang.com/a/fTiWhkkHXU"
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        referrerPolicy="unsafe-url"
        className="inline-block hover:opacity-95 transition-opacity max-w-full"
      >
        <img
          src="https://ads-partners.coupang.com/banners/1013118?trackingCode=AF5508221&subId=&traceId=V0-301-879dd1202e5c73b2-I1013118&w=728&h=90"
          alt="쿠팡 특가 배너"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </a>
    </div>
  );
}
