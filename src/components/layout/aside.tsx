"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as React from "react";
import WeatherComment from "@/components/weather-comments";

interface PopularItem {
  title: string;
  href?: string;
}

interface WeatherTimeseriesItem {
  temp: number | null;
  summary?: string;
}

interface WeatherData {
  tempC?: number;
  location?: string;
  condition?: string;
  timeseries?: WeatherTimeseriesItem[];
}

interface AsideProps {
  popular?: PopularItem[];
  weather?: WeatherData;
  onSubscribeClick?: () => void;
}

export function Aside({
  popular = [
    { title: "Den genomsnittliga livslängden på ett Twitter‑utbrott." },
    { title: "Hur man ignorerar notiser och ändå får ångest." },
    { title: "Politikern som sa det du ville höra (och gjorde tvärtom)." },
  ],
  weather,
  onSubscribeClick,
}: AsideProps): React.ReactElement {
  const getWeatherEmoji = (summary?: string) => {
    const s = (summary || "").toLowerCase();
    if (s.includes("sun") || s.includes("klart") || s.includes("clear")) return "☀️";
    if (s.includes("partly") || s.includes("delvis") || s.includes("moln")) return "🌤️";
    if (s.includes("cloud") || s.includes("mulet")) return "☁️";
    if (s.includes("rain") || s.includes("regn")) return "🌧️";
    if (s.includes("snow") || s.includes("snö")) return "❄️";
    if (s.includes("storm") || s.includes("åska")) return "⛈️";
    if (s.includes("fog") || s.includes("dimma")) return "🌫️";
    return "🌤️";
  };

  const translateSummary = (summary?: string) => {
    if (!summary) return "";
    const s = summary.toLowerCase();
    if (s.includes("clear") || s.includes("klart")) return "Klart";
    if (s.includes("partly") || s.includes("delvis")) return "Delvis molnigt";
    if (s.includes("cloud") || s.includes("mulet")) return "Mulet";
    if (s.includes("rain") || s.includes("regn")) return "Regn";
    if (s.includes("snow") || s.includes("snö")) return "Snö";
    if (s.includes("storm") || s.includes("åska")) return "Åska";
    if (s.includes("fog") || s.includes("dimma")) return "Dimma";
    return summary;
  };

  // use WeatherComment from components/weather-comments.tsx

  // client-side geo + fetch of lexlink via /api/weather
  const [geoWeather, setGeoWeather] = React.useState<WeatherData | undefined>(undefined);

  React.useEffect(() => {
    if (weather) return; // respect explicit prop
    if (!("geolocation" in navigator)) return;

  let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;
        try {
          const { latitude, longitude } = pos.coords;

          const res = await fetch("/api/weather", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: latitude, lon: longitude }),
          });

          if (!res.ok) return;

          const data = await res.json();

          if (!cancelled && data) {
            const first = data?.timeseries?.[0];
            type RawSeries = { temp?: number | null; summary?: string };
            setGeoWeather({
              tempC: typeof first?.temp === "number" ? Math.round(first.temp) : undefined,
              location: data?.location?.display_name ?? data?.location?.name ?? undefined,
              condition: first?.summary ?? undefined,
              timeseries: Array.isArray(data?.timeseries)
                ? data.timeseries.map((s: RawSeries) => ({ temp: s.temp ?? null, summary: s.summary }))
                : undefined,
            });
          }
        } catch {
          // ignore
        }
      },
      () => {},
      { maximumAge: 60_000, timeout: 10_000 }
    );

    return () => {
      cancelled = true;
    };
  }, [weather]);

  const effectiveWeather = weather ?? geoWeather;

  const current =
    effectiveWeather?.timeseries && effectiveWeather.timeseries[0]
      ? effectiveWeather.timeseries[0]
      : typeof effectiveWeather?.tempC === "number"
      ? { temp: effectiveWeather.tempC, summary: effectiveWeather?.condition }
      : undefined;

  return (
    <aside className="space-y-8">
      {/* Mest Populärt */}
      <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Mest Populärt</h3>
        <ul className="space-y-4">
          {popular.map((item, i) => {
            const numberColor = i === 0 ? "text-primary" : "text-muted-foreground";
            const borderColor = i === 0 ? "border-primary/60" : "border-muted";
            const content = (
              <>
                <span className={`font-bold mr-2 ${numberColor}`}>{i + 1}.</span>
                {item.title}
              </>
            );
            return (
              <li
                key={item.title}
                className={`text-sm md:text-base leading-snug cursor-pointer border-l-4 ${borderColor} pl-3 hover:text-primary transition-colors`}
              >
                {item.href ? (
                  <Link href={item.href} className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Prenumeration */}
      <section className="rounded-xl p-6 shadow bg-primary text-primary-foreground text-center">
        <h3 className="text-2xl font-bold mb-3">Vill du ha mer än en Dos?</h3>
        <p className="mb-4 text-sm md:text-base opacity-90">Lås upp de riktigt deprimerande nyheterna med premium.</p>
        <Button variant="secondary" onClick={onSubscribeClick} asChild={!onSubscribeClick} className="font-medium">
          {onSubscribeClick ? <span>Prenumerera Nu →</span> : <Link href="/prenumeration">Prenumerera Nu →</Link>}
        </Button>
      </section>

      {/* Väder (kompakt kort om timeseries finns, annars fallback som tidigare) */}
      <section className="rounded-xl border bg-card text-card-foreground p-6 shadow">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">Lokalt Väder</h3>

        {current ? (
          <div className="current-card flex items-center gap-4 p-3 bg-card rounded-lg border border-border shadow-sm">
            <div style={{ fontSize: 48, lineHeight: 1 }}>{getWeatherEmoji(current?.summary)}</div>

            <div className="temp-col flex flex-col">
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }} className="text-primary">
                {typeof current?.temp === "number" ? `${current.temp}°C` : "—"}
              </div>
              <div style={{ fontSize: 14, opacity: 0.8 }} className="text-foreground">
                {translateSummary(current?.summary)}
              </div>
            </div>

            <div className="temp-right" style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 12, opacity: 0.7 }} className="text-foreground">
                Känns som
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }} className="text-foreground">
                {typeof current?.temp === "number" ? `${current.temp}°C` : "—"}
              </div>
              <WeatherComment temp={current?.temp ?? null} summary={translateSummary(current?.summary)} />
            </div>
          </div>
        ) : (
          <div className="text-center bg-card rounded-md border-2 border-secondary" style={{ padding: "24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌤️</div>
            <p className="text-foreground" style={{ opacity: 0.7, fontSize: "14px", margin: 0 }}>
              Ingen väderdata tillgänglig
            </p>
          </div>
        )}

        {/* Knapp för 10 dygns prognos */}
        <div className="mt-3">
          <Button variant="secondary" asChild={!!effectiveWeather} className="w-full">
            {effectiveWeather ? <Link href="/vader">10‑dygnsprognos</Link> : <span className="opacity-70">10‑dygnsprognos</span>}
          </Button>
        </div>
      </section>

      {/* Annons / Elpriser */}
      <section className="rounded-xl p-6 text-center shadow bg-muted">
        <h3 className="text-lg font-bold mb-2 text-foreground">Annons</h3>
        <p className="text-sm text-muted-foreground">Få dina elpriser direkt i inboxen. Som om det hjälpte.</p>
        <Link href="#" className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
          Visa Elpriser (API)
        </Link>
      </section>
    </aside>
  );
}