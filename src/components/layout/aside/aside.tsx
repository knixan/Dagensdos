"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MostPopular from "@/components/layout/aside/MostPopular";
import SubscribeNow from "@/components/layout/aside/SubscribeNow";
import TipUs from "@/components/layout/aside/TipUs";
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

interface PopularItem {
  title: string;
  category?: string;
  href?: string;
}

interface AsideProps {
  weather?: WeatherData;
  popularItems?: PopularItem[];
}

function AsideContent({ weather, popularItems }: AsideProps) {
  return (
    <>
      <MostPopular popular={popularItems} />
      <SubscribeNow />
      <TipUs />
      <WeatherAside weather={weather} />
      <ElectricityPrices />
    </>
  );
}

export default function Aside({ weather, popularItems }: AsideProps) {
  return (
    <>
      {/* Desktop: static sidebar */}
      <aside className="hidden lg:block space-y-8">
        <AsideContent weather={weather} popularItems={popularItems} />
      </aside>

      {/* Mobile: tucked away in a Sheet instead of stacking inline */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Menu className="h-4 w-4" />
              Mer innehåll
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Mer</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4 space-y-8">
              <AsideContent weather={weather} popularItems={popularItems} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
