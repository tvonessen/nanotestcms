import type { AnalyticsAggregate } from '@/payload-types';
import {ChevronLeftIcon} from "@heroui/shared-icons";

type AnalyticsViewProps = {
  payload: {
    find: (args: Record<string, unknown>) => Promise<{
      docs: AnalyticsAggregate[];
      hasNextPage?: boolean;
    }>;
    findGlobal: (args: Record<string, unknown>) => Promise<{
      retentionDays?: number | null;
      allowRegionGranularity?: boolean | null;
      enabled?: boolean | null;
      storeRawEvents?: boolean | null;
    }>;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

const RANGE_OPTIONS = [7, 30, 90];
const DASHBOARD_PAGE_SIZE = 250;

function parseDaysParam(searchParams?: Record<string, string | string[] | undefined>): number {
  const raw = searchParams?.days;
  const first = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(first);

  if (RANGE_OPTIONS.includes(parsed)) {
    return parsed;
  }

  return 30;
}

function toSortedTopEntries(map: Map<string, number>, limit = 10): Array<[string, number]> {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function toDateLabel(input: string) {
  return new Date(input).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

function buildDailySeries(
  totals: Map<string, number>,
  days: number,
): Array<{ key: string; value: number }> {
  const series: Array<{ key: string; value: number }> = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    series.push({ key, value: totals.get(key) ?? 0 });
  }

  return series;
}

function TrendChart({ series }: { series: Array<{ key: string; value: number }> }) {
  const width = 680;
  const height = 220;
  const padding = 24;
  const maxValue = Math.max(1, ...series.map((item) => item.value));
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;
  const stepX = series.length > 1 ? graphWidth / (series.length - 1) : 0;
  const points = series
    .map((item, index) => {
      const x = padding + index * stepX;
      const y = padding + graphHeight - (item.value / maxValue) * graphHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="220"
      role="img"
      aria-label="Pageviews Trend"
      style={{ border: '1px solid var(--theme-elevation-200)', borderRadius: '8px' }}
    >
      <rect x="0" y="0" width={width} height={height} fill="var(--theme-bg)" />
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="var(--theme-elevation-300)"
      />
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="var(--theme-elevation-300)"
      />
      <polyline fill="none" stroke="#00A984" strokeWidth="3" points={points} />
    </svg>
  );
}

function SimpleBarChart({
  title,
  entries,
}: {
  title: string;
  entries: Array<[string, number]>;
}) {
  const maxValue = Math.max(1, ...entries.map(([, value]) => value));

  return (
    <article style={{ border: '1px solid var(--theme-elevation-200)', borderRadius: '8px', padding: '0.75rem' }}>
      <h3 style={{ marginBottom: '0.75rem' }}>{title}</h3>
      {entries.length ? (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {entries.map(([label, value]) => (
            <div key={label} style={{ display: 'grid', gap: '0.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: '0.85rem' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
                <strong>{value.toLocaleString('de-DE')}</strong>
              </div>
              <div
                style={{
                  height: '8px',
                  background: 'var(--theme-elevation-100)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.max(4, (value / maxValue) * 100)}%`,
                    height: '100%',
                    background: '#8A4F7D',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Keine Daten im gewählten Zeitraum.</p>
      )}
    </article>
  );
}

export function AnalyticsNavLink() {
  return (
    <a href="/admin/analytics" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
      Analytics
    </a>
  );
}

export async function AnalyticsView({ payload, searchParams }: AnalyticsViewProps) {
  const days = parseDaysParam(searchParams);
  const rangeStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const settings = await payload.findGlobal({
    slug: 'analytics-settings',
    depth: 0,
    overrideAccess: true,
  });
  let pageviews = 0;
  let uniqueVisitorsApprox = 0;
  let entryViews = 0;
  let aggregateDocs = 0;

  const pages = new Map<string, number>();
  const countries = new Map<string, number>();
  const devices = new Map<string, number>();
  const viewportBuckets = new Map<string, number>();
  const dailyTotals = new Map<string, number>();

  let page = 1;
  while (true) {
    const result = await payload.find({
      collection: 'analytics-aggregates',
      depth: 0,
      limit: DASHBOARD_PAGE_SIZE,
      page,
      pagination: true,
      where: {
        bucketStart: {
          greater_than_equal: rangeStart,
        },
      },
    });

    const docs = result.docs ?? [];
    aggregateDocs += docs.length;

    for (const doc of docs) {
      const pv = doc.pageviews ?? 0;
      const uv = doc.uniqueVisitorsApprox ?? 0;
      const ev = doc.entryViews ?? 0;
      const bucketKey = new Date(doc.bucketStart).toISOString().slice(0, 10);

      pageviews += pv;
      uniqueVisitorsApprox += uv;
      entryViews += ev;

      dailyTotals.set(bucketKey, (dailyTotals.get(bucketKey) ?? 0) + pv);
      pages.set(doc.path, (pages.get(doc.path) ?? 0) + pv);
      countries.set(doc.country ?? 'Unknown', (countries.get(doc.country ?? 'Unknown') ?? 0) + pv);
      devices.set(
        doc.deviceClass ?? 'unknown',
        (devices.get(doc.deviceClass ?? 'unknown') ?? 0) + pv,
      );
      viewportBuckets.set(
        doc.viewportBucket ?? 'unknown',
        (viewportBuckets.get(doc.viewportBucket ?? 'unknown') ?? 0) + pv,
      );
    }

    if (!result.hasNextPage) {
      break;
    }

    page += 1;
  }
 
  const topPages = toSortedTopEntries(pages);
  const topCountries = toSortedTopEntries(countries);
  const topDevices = toSortedTopEntries(devices);
  const topViewports = toSortedTopEntries(viewportBuckets);
  const trendSeries = buildDailySeries(dailyTotals, days);

  return (
    <section style={{ marginTop: '1.5rem', marginInline: '2rem', marginBottom: '3rem' }}>
      <a href="/admin" target="_self" style={{textDecoration: "none", borderBottom: "1px solid white", marginBottom: "1rem", display: "inline-block"}}><ChevronLeftIcon /> Back</a>
      <h1 style={{ marginBottom: '0.5rem' }}>Analytics</h1>
      <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
        Auswertung der Analytics Aggregates für die letzten {days} Tage.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {RANGE_OPTIONS.map((option) => (
          <a
            key={option}
            href={`/admin/analytics?days=${option}`}
            style={{
              padding: '0.3rem 0.6rem',
              borderRadius: '999px',
              border: '1px solid var(--theme-elevation-200)',
              background: option === days ? 'var(--theme-elevation-100)' : 'transparent',
              textDecoration: 'none',
            }}
          >
            {option}d
          </a>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          marginBottom: '1.5rem',
        }}
      >
        <article style={{ border: '1px solid var(--theme-elevation-200)', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Pageviews</div>
          <strong style={{ fontSize: '1.2rem' }}>{pageviews.toLocaleString('de-DE')}</strong>
        </article>
        <article style={{ border: '1px solid var(--theme-elevation-200)', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Besucher (approx.)</div>
          <strong style={{ fontSize: '1.2rem' }}>{uniqueVisitorsApprox.toLocaleString('de-DE')}</strong>
        </article>
        <article style={{ border: '1px solid var(--theme-elevation-200)', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Entry Views</div>
          <strong style={{ fontSize: '1.2rem' }}>{entryViews.toLocaleString('de-DE')}</strong>
        </article>
        <article style={{ border: '1px solid var(--theme-elevation-200)', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Aggregate-Datensätze</div>
          <strong style={{ fontSize: '1.2rem' }}>{aggregateDocs.toLocaleString('de-DE')}</strong>
        </article>
      </div>

      <article style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Pageviews Trend</h3>
        <TrendChart series={trendSeries} />
        <div
          style={{
            marginTop: '0.4rem',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            opacity: 0.75,
          }}
        >
          <span>{trendSeries[0] ? toDateLabel(trendSeries[0].key) : ''}</span>
          <span>{trendSeries.at(-1) ? toDateLabel(trendSeries.at(-1)?.key ?? '') : ''}</span>
        </div>
      </article>

      <article
        style={{
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <h3 style={{ marginBottom: '0.5rem' }}>Governance & Retention</h3>
        <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: '0.2rem' }}>
          <li>Analytics aktiv: {settings.enabled === false ? 'Nein' : 'Ja'}</li>
          <li>Retention: {Math.max(1, settings.retentionDays ?? 750)} Tage</li>
          <li>Region-Granularität: {settings.allowRegionGranularity ? 'Aktiv' : 'Deaktiviert'}</li>
          <li>Raw Events: {settings.storeRawEvents ? 'Aktiv' : 'Deaktiviert (empfohlen)'}</li>
          <li>Besucherzahl ist approximativ, keine Session-Rekonstruktion.</li>
        </ul>
        <form action="/api/cleanup-analytics" method="post" style={{ marginTop: '0.75rem' }}>
          <button
            type="submit"
            style={{
              border: '1px solid var(--theme-elevation-250)',
              borderRadius: '6px',
              background: 'transparent',
              padding: '0.35rem 0.6rem',
              cursor: 'pointer',
            }}
          >
            Retention-Cleanup jetzt ausführen
          </button>
        </form>
      </article>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        <SimpleBarChart title="Top Seiten" entries={topPages} />
        <SimpleBarChart title="Länder" entries={topCountries} />
        <SimpleBarChart title="Geräteklassen" entries={topDevices} />
        <SimpleBarChart title="Viewport-Buckets" entries={topViewports} />
      </div>
    </section>
  );
}
