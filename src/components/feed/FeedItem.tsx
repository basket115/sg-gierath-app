// src/components/feed/FeedItem.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { IonButton, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { logoYoutube, openOutline } from 'ionicons/icons';
import ResultBox from './ResultBox';
import type { FeedRow } from '../../utils/feed';

type Props = { item: FeedRow };

const SCORPIONS_RED = '#C4161C';
const RESULT_RED = '#D32F2F';
const NEWS_BLUE = '#1976D2';
const WHITE = '#FFFFFF';
const DEFAULT_BALL_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png';

const API = 'https://script.google.com/macros/s/AKfycbwm0nO0XRsJD2gqWTbfZvRHdKTN0ylbJrWkJt66TcCCiBkX8l7aaV2lF5saHEBwwqeUoA/exec';
const KUNDEN_ID = 'V046';

type SponsorData = { logoUrl?: string; bannerText?: string; bannerBildUrl?: string; linkUrl?: string };
let sponsorCache: SponsorData | null | undefined = undefined;

async function loadSponsor(): Promise<SponsorData | null> {
  if (sponsorCache !== undefined) return sponsorCache;
  try {
    const d = await fetch(`${API}?action=get_sponsors&kundenId=${KUNDEN_ID}`, { redirect: 'follow' }).then(r => r.json());
    const rows = d?.sponsors || [];
    const found = rows.findLast((r: any) => String(r?.Aktiv).toUpperCase() === 'TRUE');
    sponsorCache = found ? { logoUrl: found.Logo_URL || undefined, bannerText: found.Banner_Text || undefined, bannerBildUrl: found.Banner_Bild_URL || undefined, linkUrl: found.Banner_Link_URL || undefined } : null;
  } catch { sponsorCache = null; }
  return sponsorCache;
}

function looksLikeYouTube(url?: string): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.includes('youtube.com') || u.includes('youtu.be');
}

function driveToImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const s = String(url).trim();
  if (!s) return undefined;
  let id: string | null = null;
  const m1 = s.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (m1?.[1]) id = m1[1];
  if (!id) { const m2 = s.match(/[?&]id=([^&]+)/i); if (m2?.[1] && s.includes('drive.google.com')) id = m2[1]; }
  if (!id) return s;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
}

function ImageBlock({ src, alt }: { src?: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  const finalSrc = useMemo(() => { if (broken) return DEFAULT_BALL_IMAGE; return driveToImageUrl(src) || DEFAULT_BALL_IMAGE; }, [src, broken]);
  return <img src={finalSrc} alt={alt} style={{ width: '100%', height: 210, objectFit: 'contain', objectPosition: 'center', display: 'block' }} loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} />;
}

function OverlayBadge({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ position: 'absolute', top: 12, left: 12, height: 26, padding: '0 12px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: 900, letterSpacing: '0.6px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.92)', color: color, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 6px 16px rgba(0,0,0,0.18)', backdropFilter: 'blur(6px)' }}>
      {label}
    </div>
  );
}

const SponsorBanner: React.FC = () => {
  const [sponsor, setSponsor] = useState<SponsorData | null | undefined>(undefined);
  useEffect(() => { loadSponsor().then(s => setSponsor(s)); }, []);
  if (sponsor === undefined || sponsor === null) return null;
  const inhalt = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {sponsor.logoUrl && <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 10, overflow: 'hidden', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}><img src={sponsor.logoUrl} alt="Partner" style={{ width: '100%', height: '100%', objectFit: 'contain' }} referrerPolicy="no-referrer" /></div>}
      <div style={{ flex: 1 }}>
        {sponsor.bannerText && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{sponsor.bannerText}</div>}
        {sponsor.linkUrl && <div style={{ marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Mehr erfahren →</div>}
      </div>
    </div>
  );
  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Partner</div>
      {sponsor.linkUrl ? <a href={sponsor.linkUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '10px 14px', textDecoration: 'none' }}>{inhalt}</a> : <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '10px 14px' }}>{inhalt}</div>}
    </div>
  );
};

const FeedItem: React.FC<Props> = ({ item }) => {
  const kind = item.kind;

  if (kind === 'result') {
    const showYoutube = looksLikeYouTube(item.linkUrl);
    const linkLabel = item.linkLabel || (showYoutube ? 'YouTube' : 'Link öffnen');
    return (
      <IonCard style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 14px 34px rgba(0,0,0,0.25)', background: `linear-gradient(180deg, ${RESULT_RED}, rgba(211,47,47,0.85))` }}>
        <IonCardContent style={{ padding: 16 }}>
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
            <ImageBlock src={item.image} alt="Spielbild" />
            <OverlayBadge label="Ergebnis" color={RESULT_RED} />
          </div>
          <div style={{ marginTop: 14 }}>
            <ResultBox home={item.home} away={item.away} homeScore={item.homeScore} awayScore={item.awayScore} teams={item.teams} competition={item.competition} />
          </div>
          {(item.title || item.text || item.venue || item.dateLabel) && (
            <div style={{ marginTop: 14 }}>
              {item.title && <div style={{ fontSize: 18, fontWeight: 900, color: WHITE, textShadow: '0 2px 10px rgba(0,0,0,0.18)' }}>{item.title}</div>}
              {item.text && <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45, opacity: 0.95, color: WHITE, whiteSpace: 'pre-wrap', textShadow: '0 2px 10px rgba(0,0,0,0.14)' }}>{item.text}</div>}
              {item.venue && <div style={{ marginTop: 10, fontSize: 12, opacity: 0.92, color: WHITE }}>{item.venue}</div>}
              {item.dateLabel && <div style={{ marginTop: 6, fontSize: 12, opacity: 0.92, color: WHITE }}>{item.dateLabel}</div>}
            </div>
          )}
          {item.linkUrl && <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}><IonButton href={item.linkUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}><IonIcon icon={showYoutube ? logoYoutube : openOutline} slot="start" />{linkLabel}</IonButton></div>}
          <SponsorBanner />
        </IonCardContent>
      </IonCard>
    );
  }

  if (kind === 'training') {
    return (
      <IonCard style={{ borderRadius: 18, boxShadow: '0 10px 26px rgba(0,0,0,0.14)', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.92)' }}>
        <IonCardContent style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 900, letterSpacing: '0.6px', textTransform: 'uppercase', background: 'rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.85)' }}>Training</span>
          </div>
          {item.title && <div style={{ marginTop: 12, fontSize: 18, fontWeight: 900 }}>{item.title}</div>}
          {item.text && <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45, opacity: 0.85, whiteSpace: 'pre-wrap' }}>{item.text}</div>}
          {item.dateLabel && <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>{item.dateLabel}</div>}
        </IonCardContent>
      </IonCard>
    );
  }

  const showYoutube = looksLikeYouTube(item.linkUrl);
  const linkLabel = item.linkLabel || (showYoutube ? 'YouTube' : 'Link öffnen');
  return (
    <IonCard style={{ borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 14px 34px rgba(0,0,0,0.25)', background: `linear-gradient(180deg, ${NEWS_BLUE}, rgba(25,118,210,0.85))` }}>
      <IonCardContent style={{ padding: 16 }}>
        <div style={{ position: 'relative' }}>
          {item.image ? (
            <><ImageBlock src={item.image} alt={item.title || 'Bild'} /><OverlayBadge label="News" color={NEWS_BLUE} /></>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 900, letterSpacing: '0.6px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.92)', color: NEWS_BLUE, border: '1px solid rgba(0,0,0,0.08)' }}>News</span>
          )}
        </div>
        <div style={{ marginTop: item.image ? 14 : 12 }}>
          {item.title && <div style={{ fontSize: 18, fontWeight: 900, color: WHITE, textShadow: '0 2px 10px rgba(0,0,0,0.18)' }}>{item.title}</div>}
          {item.text && <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45, opacity: 0.95, color: WHITE, whiteSpace: 'pre-wrap', textShadow: '0 2px 10px rgba(0,0,0,0.14)' }}>{item.text}</div>}
          {item.dateLabel && <div style={{ marginTop: 10, fontSize: 12, opacity: 0.92, color: WHITE }}>{item.dateLabel}</div>}
        </div>
        {item.linkUrl && <div style={{ marginTop: 12 }}><IonButton href={item.linkUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}><IonIcon icon={showYoutube ? logoYoutube : openOutline} slot="start" />{linkLabel}</IonButton></div>}
        <SponsorBanner />
      </IonCardContent>
    </IonCard>
  );
};

export default FeedItem;
