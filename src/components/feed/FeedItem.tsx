// PFAD: src/components/feed/FeedItem.tsx
// ÄNDERUNG: Bildgröße auf 210px optimiert (nicht zu groß, nicht zu klein)

import React, { useMemo, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { logoYoutube, openOutline } from 'ionicons/icons';
import ResultBox from './ResultBox';
import type { FeedRow } from '../../utils/feed';

type Props = {
  item: FeedRow;
};

const SCORPIONS_RED = '#C4161C';
const RESULT_RED = '#D32F2F';
const NEWS_BLUE = '#1976D2';
const WHITE = '#FFFFFF';

const DEFAULT_BALL_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png';

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

  if (!id) {
    const m2 = s.match(/[?&]id=([^&]+)/i);
    if (m2?.[1] && s.includes('drive.google.com')) id = m2[1];
  }

  if (!id) return s;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
}

function ImageBlock({
  src,
  alt,
  radius = 16,
}: {
  src?: string;
  alt: string;
  radius?: number;
}) {

  const [broken, setBroken] = useState(false);

  const finalSrc = useMemo(() => {
    if (broken) return DEFAULT_BALL_IMAGE;
    return driveToImageUrl(src) || DEFAULT_BALL_IMAGE;
  }, [src, broken]);

  return (
    <img
      src={finalSrc}
      alt={alt}
      style={{
        width: '100%',
        height: 210,
        objectFit: 'contain',
        objectPosition: 'center',
        display: 'block',
      }}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setBroken(true)}
    />
  );
}

function OverlayBadge({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        height: 26,
        padding: '0 12px',
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: '0.6px',
        textTransform: 'uppercase',
        background: 'rgba(255,255,255,0.92)',
        color: color,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {label}
    </div>
  );
}

function OverlayId({ id }: { id: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        height: 26,
        padding: '0 10px',
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: '0.2px',
        background: 'rgba(0,0,0,0.35)',
        color: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(255,255,255,0.18)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {id}
    </div>
  );
}

const FeedItem: React.FC<Props> = ({ item }) => {
  const kind = item.kind;

  if (kind === 'result') {
    const showYoutube = looksLikeYouTube(item.linkUrl);
    const linkLabel =
      item.linkLabel || (showYoutube ? 'YouTube' : 'Link öffnen');

    return (
      <IonCard
        style={{
          borderRadius: 22,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 14px 34px rgba(0,0,0,0.25)',
          background: `linear-gradient(180deg, ${RESULT_RED}, rgba(211,47,47,0.85))`,
        }}
      >
        <IonCardContent style={{ padding: 16 }}>
  <div
    style={{
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden'
    }}
  >
    <ImageBlock
      src={item.image}
      alt="Spielbild"
    />

    <OverlayBadge
      label="Ergebnis"
      color={RESULT_RED}
    />

    {/* ID deaktiviert */}
    {/* {item.id && <OverlayId id={item.id} />} */}
  </div>


          <div style={{ marginTop: 14 }}>
            <ResultBox
              home={item.home}
              away={item.away}
              homeScore={item.homeScore}
              awayScore={item.awayScore}
              teams={item.teams}
              competition={item.competition}
            />
          </div>

          {(item.title || item.text || item.venue || item.dateLabel) && (
            <div style={{ marginTop: 14 }}>
              {item.title && (
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: '-0.2px',
                    color: WHITE,
                    textShadow: '0 2px 10px rgba(0,0,0,0.18)',
                  }}
                >
                  {item.title}
                </div>
              )}

              {item.text && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14,
                    lineHeight: 1.45,
                    opacity: 0.95,
                    color: WHITE,
                    whiteSpace: 'pre-wrap',
                    textShadow: '0 2px 10px rgba(0,0,0,0.14)',
                  }}
                >
                  {item.text}
                </div>
              )}

              {item.venue && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    opacity: 0.92,
                    color: WHITE,
                  }}
                >
                  {item.venue}
                </div>
              )}

              {item.dateLabel && (
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    opacity: 0.92,
                    color: WHITE,
                  }}
                >
                  {item.dateLabel}
                </div>
              )}
            </div>
          )}

          {item.linkUrl && (
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <IonButton
                href={item.linkUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontWeight: 900,
                }}
              >
                <IonIcon
                  icon={showYoutube ? logoYoutube : openOutline}
                  slot="start"
                />
                {linkLabel}
              </IonButton>
            </div>
          )}
        </IonCardContent>
      </IonCard>
    );
  }

  if (kind === 'training') {
    return (
      <IonCard
        style={{
          borderRadius: 18,
          boxShadow: '0 10px 26px rgba(0,0,0,0.14)',
          border: '1px solid rgba(255,255,255,0.18)',
          background: 'rgba(255,255,255,0.92)',
        }}
      >
        <IonCardContent style={{ padding: 16 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 26,
                padding: '0 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                background: 'rgba(0,0,0,0.08)',
                color: 'rgba(0,0,0,0.85)',
              }}
            >
              Training
            </span>
            {item.id && (
              <span style={{ fontSize: 12, opacity: 0.55 }}>{item.id}</span>
            )}
          </div>

          {item.title && (
            <div
              style={{
                marginTop: 12,
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: '-0.2px',
              }}
            >
              {item.title}
            </div>
          )}

          {item.text && (
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 1.45,
                opacity: 0.85,
                whiteSpace: 'pre-wrap',
              }}
            >
              {item.text}
            </div>
          )}

          {item.dateLabel && (
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
              {item.dateLabel}
            </div>
          )}
        </IonCardContent>
      </IonCard>
    );
  }

  const showYoutube = looksLikeYouTube(item.linkUrl);
  const linkLabel = item.linkLabel || (showYoutube ? 'YouTube' : 'Link öffnen');

  return (
    <IonCard
      style={{
        borderRadius: 22,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 14px 34px rgba(0,0,0,0.25)',
        background: `linear-gradient(180deg, ${NEWS_BLUE}, rgba(25,118,210,0.85))`,
      }}
    >
      <IonCardContent style={{ padding: 16 }}>
        <div style={{ position: 'relative' }}>
          {item.image ? (
            <>
              <ImageBlock src={item.image} alt={item.title || 'Bild'} />
              <OverlayBadge label="News" color={NEWS_BLUE} />
              {/* {item.id && <OverlayId id={item.id} />} */}

            </>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 26,
                  padding: '0 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  background: 'rgba(255,255,255,0.92)',
                  color: NEWS_BLUE,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                News
              </span>
              {item.id && (
                <span style={{ fontSize: 12, opacity: 0.75, color: WHITE }}>
                  {item.id}
                </span>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: item.image ? 14 : 12 }}>
          {item.title && (
            <div
              style={{
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: '-0.2px',
                color: WHITE,
                textShadow: '0 2px 10px rgba(0,0,0,0.18)',
              }}
            >
              {item.title}
            </div>
          )}

          {item.text && (
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 1.45,
                opacity: 0.95,
                color: WHITE,
                whiteSpace: 'pre-wrap',
                textShadow: '0 2px 10px rgba(0,0,0,0.14)',
              }}
            >
              {item.text}
            </div>
          )}

          {item.dateLabel && (
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                opacity: 0.92,
                color: WHITE,
              }}
            >
              {item.dateLabel}
            </div>
          )}
        </div>

        {item.linkUrl && (
          <div style={{ marginTop: 12 }}>
            <IonButton
              href={item.linkUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontWeight: 900,
              }}
            >
              <IonIcon
                icon={showYoutube ? logoYoutube : openOutline}
                slot="start"
              />
              {linkLabel}
            </IonButton>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default FeedItem;
