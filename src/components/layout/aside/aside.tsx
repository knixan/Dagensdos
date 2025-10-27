import * as React from "react";
import MostPopularServer from "@/components/layout/aside/MostPopular.server";
import SubscribeNow from "@/components/layout/aside/SubscribeNow";
import WeatherAside from "@/components/layout/aside/WeatherAside";
import ElectricityPrices from "@/components/layout/aside/ElectricityPrices";

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
  weather?: WeatherData;
  onSubscribeClick?: () => void;
}

export default function Aside({ weather, onSubscribeClick }: AsideProps) {
  return (
    <aside className="space-y-8">
      <MostPopularServer />
      <SubscribeNow onSubscribeClick={onSubscribeClick} />
      <WeatherAside weather={weather} />
      <ElectricityPrices />
    </aside>
  );
}
