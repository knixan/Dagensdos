"use client";
import React, { useEffect, useState } from "react";
import WeatherComment from "./weather-comments";
import type { Series, WeatherType } from "../lib/types/weather-types";

function getWeatherEmoji(summary?: string) {
  const s = (summary || "").toLowerCase();
  if (s.includes("clear") || s.includes("sunny")) return "☀️";
  if (s.includes("nearly clear")) return "🌤️";
  if (s.includes("partly") || s.includes("scattered")) return "⛅";
  if (s.includes("cloud") || s.includes("overcast")) return "☁️";
  if (s.includes("rain") || s.includes("shower") || s.includes("drizzle")) return "🌧️";
  if (s.includes("thunder") || s.includes("storm")) return "⛈️";
  if (s.includes("snow") || s.includes("sleet") || s.includes("blizzard")) return "❄️";
  if (s.includes("fog") || s.includes("mist") || s.includes("haze")) return "🌫️";
  return "🌥️";
}

function translateSummary(summary?: string) {
  const s = (summary || "").toLowerCase().trim();
  if (s === "clear sky") return "Klar himmel";
  if (s === "nearly clear sky") return "Nästan klar himmel";
  if (s === "halfclear sky") return "Halvklart väder";
  if (s === "variable cloudiness") return "Växlande molnighet";
  if (s === "cloudy sky") return "Molnigt väder";
  if (s === "overcast") return "Mulet";
  if (s === "fog") return "Dimma";
  if (s === "mist") return "Dis";
  if (s === "rain") return "Regn";
  if (s === "rain showers") return "Regnskurar";
  if (s === "heavy rain") return "Kraftigt regn";
  if (s === "thunder") return "Åska";
  if (s === "thunderstorm") return "Åskväder";
  if (s === "snow") return "Snö";
  if (s === "snow showers") return "Snöskurar";
  if (s === "heavy snow") return "Kraftig snö";
  if (s === "sleet") return "Snöblandat regn";
  if (s === "hail") return "Hagel";
  if (s === "light rain") return "Lätt regn";
  if (s === "drizzle") return "Duggregn";
  if (s === "freezing rain") return "Underkylt regn";
  if (s === "partly cloudy") return "Delvis molnigt";
  if (s === "mostly cloudy") return "Mestadels molnigt";
  return summary || "";
}

function getCloudCoverIcon(cloudCover?: number) {
  if (typeof cloudCover !== "number") return "🌥️";
  if (cloudCover < 20) return "☀️";
  if (cloudCover < 50) return "⛅";
  if (cloudCover < 80) return "🌥️";
  return "☁️";
}

export default function ClientGeoWeather() {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "ready">("idle");
  const [weather, setWeather] = useState<WeatherType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator?.geolocation) {
      setError("Geolocation stöds inte i din webbläsare.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch("/api/weather", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat, lon }),
          });
          if (!res.ok) throw new Error(`Serverfel: ${res.status}`);
          const data = (await res.json()) as WeatherType;
          setWeather(data);
          setStatus("ready");
        } catch (err: unknown) {
          setError((err as Error)?.message ?? "Misslyckades hämta väder");
          setStatus("error");
        }
      },
      (err) => {
        setError(err?.message ?? "Kunde inte hämta plats");
        setStatus("error");
      },
      { timeout: 15000 }
    );
  }, []);

  if (status === "loading") {
    return (
      <div className="text-center bg-card rounded-md border-2 border-secondary" style={{ padding: "48px 24px" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📍</div>
        <div style={{ fontSize: 16 }}>Hämtar ditt lokala väder…</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center bg-card rounded-md border-2 border-secondary" style={{ padding: "48px 24px" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 16, marginBottom: 8 }}>{error ?? "Kunde inte hämta väder."}</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>Skriv istället in en stad i sökfältet ovan.</div>
      </div>
    );
  }

  if (!weather) return null;

  const current = weather.timeseries?.[0] ?? null;

  // Compute 10-day midday list (closest measurement to 12:00 each day)
  function getNextDaysMidday(timeseries: Series[] = [], days = 10) {
    const out: Series[] = [];
    const now = new Date();
    for (let i = 0; i < days; i++) {
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 12, 0, 0);

      const sameDay = timeseries.filter((s: Series) => {
        try {
          const d = new Date(s.validTime);
          return (
            d.getFullYear() === target.getFullYear() &&
            d.getMonth() === target.getMonth() &&
            d.getDate() === target.getDate()
          );
        } catch {
          return false;
        }
      });

      if (sameDay.length === 0) continue;

      let best = sameDay[0];
      let bestDiff = Math.abs(new Date(best.validTime).getHours() - 12);
      for (const s of sameDay) {
        const diff = Math.abs(new Date(s.validTime).getHours() - 12);
        if (diff < bestDiff) {
          best = s;
          bestDiff = diff;
        }
      }
      out.push(best);
    }
    return out;
  }

  // exclude today: request 11 days and drop the first entry
  const tenDayMidday = getNextDaysMidday(weather?.timeseries ?? [], 11).slice(1);

  return (
    <section>
      {current && (
        <div className="current-card flex items-center gap-4 mb-5 p-3 bg-card rounded-lg border border-border shadow-sm">
          <div style={{ fontSize: 48, lineHeight: 1 }}>{getWeatherEmoji(current.summary)}</div>

          <div className="temp-col flex flex-col">
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }} className="text-primary">
              {typeof current.temp === "number" ? `${current.temp}°C` : "—"}
            </div>
            <div style={{ fontSize: 14, opacity: 0.8 }} className="text-foreground">
              {translateSummary(current.summary)}
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }} className="text-foreground">{new Date(current.validTime).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }).replace(".", "")}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }} className="text-foreground">{new Date(current.validTime).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", hour12: false })}</div>
          </div>

          <div className="temp-right" style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }} className="text-foreground">Känns som</div>
            <div style={{ fontSize: 14, fontWeight: 600 }} className="text-foreground">{typeof current.temp === "number" ? `${current.temp}°C` : "—"}</div>
            <WeatherComment temp={current?.temp} summary={translateSummary(current?.summary)} />
          </div>
        </div>
      )}

      {current && (
        <div className="pt-6 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", borderTop: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "4px" }} className="text-foreground">Luftfuktighet</div>
            <div style={{ fontSize: "20px", fontWeight: "600" }} className="text-primary">💧 {current.humidity}%</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "4px" }} className="text-foreground">Lufttryck</div>
            <div style={{ fontSize: "20px", fontWeight: "600" }} className="text-primary">🌡️ {current.airPressure} hPa</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "4px" }} className="text-foreground">Sikt</div>
            <div style={{ fontSize: "20px", fontWeight: "600" }} className="text-primary">👁️ {(current.visibility ?? 0 / 1000).toFixed(1)} km</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", opacity: 0.6, marginBottom: "4px" }} className="text-foreground">Molntäcke</div>
            <div style={{ fontSize: "20px", fontWeight: "600" }} className="text-primary">{getCloudCoverIcon(current.cloudCover)} {current.cloudCover}%</div>
          </div>
        </div>
      )}

      {/* 10-dagarsprognos — temperatur vid kl. 12 */}
      {tenDayMidday.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 700 }} className="text-primary">10-dagarsprognos — temperatur vid kl. 12</h3>

          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 12 }}>
            {tenDayMidday.map((s: Series, idx: number) => (
              <div key={idx} className="bg-card rounded-md p-4 border border-border shadow-sm" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 13, opacity: 0.8 }} className="text-foreground">{new Date(s.validTime).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }).replace(".", "")}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }} className="text-foreground">{new Date(s.validTime).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", hour12: false })}</div>
                </div>

                <div style={{ fontSize: 48, lineHeight: 1 }}>{getWeatherEmoji(s.summary)}</div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }} className="text-primary">{typeof s.temp === "number" ? `${s.temp}°C` : "—"}</div>
                  <div style={{ fontSize: 14, opacity: 0.85 }} className="text-foreground">{translateSummary(s.summary)}</div>
                </div>

                <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 12, opacity: 0.7 }} className="text-foreground">Känns som</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }} className="text-foreground">{typeof s.temp === "number" ? `${s.temp}°C` : "—"}</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }} className="text-foreground">Nederbörd: <strong>{s.precipitationMean ?? "—"} mm</strong></div>
                  <div><WeatherComment temp={s.temp} summary={translateSummary(s.summary)} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
