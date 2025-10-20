"use client";

import * as React from "react";
import MostPopular from "@/components/layout/aside/MostPopular";
import SubscribeNow from "@/components/layout/aside/SubscribeNow";
import WeatherAside from "@/components/layout/aside/WeatherAside";
import ElectricityPrices from "@/components/layout/aside/ElectricityPrices";

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
  return (
    <aside className="space-y-8">
      <MostPopular popular={popular} />
      <SubscribeNow onSubscribeClick={onSubscribeClick} />
      <WeatherAside weather={weather} />
      <ElectricityPrices />
    </aside>
  );
}
