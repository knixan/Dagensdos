import SpotChart from "@/components/spotchart";
import { getSpotPrices } from "@/lib/spotprices";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Aside from "@/components/layout/aside/aside";

export default async function SpotPricePage() {
  const todayLocal = new Date().toLocaleDateString("sv-SE");
  const data = await getSpotPrices(todayLocal);

  return (
    <>
      <Navbar />
      <main className="flex grow pt-8 pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
             
              <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
                 Spotpriser för el i Sverige ({todayLocal})
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <SpotChart
                  key="1"
                  data={data.SE1}
                  title="SE1"
                  color="var(--chart-1)"
                />
                <SpotChart
                  key="2"
                  data={data.SE2}
                  title="SE2"
                  color="var(--chart-3)"
                />
                <SpotChart
                  key="3"
                  data={data.SE3}
                  title="SE3"
                  color="var(--chart-4)"
                />
                <SpotChart
                  key="4"
                  data={data.SE4}
                  title="SE4"
                  color="var(--chart-5)"
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <Aside />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
