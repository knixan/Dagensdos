import React from "react";
import LinkButton from "@/components/Buttons/LinkButton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { requireAdmin } from '@/lib/server-auth';
import { DashboardCard, DashboardCardContent } from "@/components/dashboard/dashboard-card";
import UserDataCard, { UserDataProps } from "@/components/dashboard/user-data-card";
import { Calendar, Coins, CreditCard, UserRoundCheck, Users } from "lucide-react";
import { db } from "@/lib/db";
import { eachMonthOfInterval, endOfMonth, format, formatDistanceToNow, startOfMonth, subDays, subMonths } from "date-fns";
import { subYears, startOfYear, endOfYear } from 'date-fns'
import BarChart from "@/components/dashboard/barchart";
import LineGraph from "@/components/dashboard/line-graph";
import UserPurchaseCard, { UserPurchaseProps } from "@/components/dashboard/user-purchase-card";
import GoalDataCard from "@/components/dashboard/goal";

type RecentUser = {
  name?: string | null;
  email?: string | null;
  createdAt?: Date | string | null;
};

type UserGroup = {
  createdAt?: Date | string | null;
  _count?: { createdAt?: number | null } | null;
};

export default async function AdminPage() {
  await requireAdmin();

  const currentDate = new Date();

  // Total subscriptions
  const subscriptionCount = await db.subscription.count();

  // Premium subscription
  const premium = await db.subscriptionType.findUnique({
    where: { name: 'premium' },
    include: {
      subscriptions: {
        select: { id: true },
      },
    },
  });
  const totalProfitPremium = (premium ? (premium.price * (premium.subscriptions?.length || 0)) : 0) || 0;

  const lastYearStart = startOfYear(subYears(new Date(), 1));
  const lastYearEnd = endOfYear(subYears(new Date(), 1));

  const subscriptionsLastYear = await db.subscription.findMany({
    where: {
      createdAt: {
        gte: lastYearStart,
        lte: lastYearEnd,
      },
    },
    include: {
      type: {
        select: { price: true, name: true },
      },
    },
  });

  // Compute total profit last year
  const totalProfitLastYear = subscriptionsLastYear.reduce(
    (sum, sub) => sum + (sub.type?.price || 0), 0) || 0;

  const thirtyDaysAgo = subDays(new Date(), 30);
  const subscriptionsLast30Days = await db.subscription.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    include: {
      type: {
        select: { price: true },
      },
    },
  });

  // Calculate profit last 30 days
  const totalProfitLast30Days = subscriptionsLast30Days.reduce(
    (sum, sub) => sum + (sub.type?.price || 0), 0) || 0;

  const recentUsers = await db.user.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 7
  });

  const UserData: UserDataProps[] = recentUsers.map((account: RecentUser) => ({
    name: account?.name ?? 'Unknown',
    email: account?.email ?? 'Unknown',
    time: account?.createdAt
      ? formatDistanceToNow(new Date(account.createdAt), { addSuffix: true })
      : 'Okänt',
  }));

  // Prepare monthly user data (last available months up to current)
  const usersThisMonthRaw = await db.user.groupBy({
    by: ['createdAt'],
    _count: { createdAt: true },
    orderBy: { createdAt: 'asc' }
  }).catch(() => [] as UserGroup[]); // fallback if groupBy unsupported

  const usersThisMonth = usersThisMonthRaw as UserGroup[];

  const monthlyUsersData = eachMonthOfInterval({
    start: startOfMonth(new Date(usersThisMonth[0]?.createdAt ?? new Date())),
    end: endOfMonth(currentDate)
  }).map(month => {
    const monthString = format(month, 'MMM');
    const userMonthly = usersThisMonth
      .filter((user) => {
        const created = user.createdAt ?? null;
        if (!created) return false;
        return format(new Date(created), 'MMM') === monthString;
      })
      .reduce((total, user) => total + (user._count?.createdAt ?? 0), 0);
    return { month: monthString, total: userMonthly };
  });

  // Last 6 months revenue
  const sixMonthsAgo = subMonths(currentDate, 5); // include current month and previous 5
  const subscriptionsLast6Months = await db.subscription.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
        lte: currentDate,
      },
    },
    include: {
      type: {
        select: { price: true },
      },
    },
  });

  // Group by month and sum prices
  const revenueByMonth: Record<string, number> = {};
  subscriptionsLast6Months.forEach((sub) => {
    const monthKey = format(sub.createdAt, "yyyy-MM");
    revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + (sub.type?.price || 0);
  });

  // Ensure all months exist (even with 0)
  const monthlyRevenueData = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(currentDate, i);
    const monthKey = format(monthDate, "yyyy-MM");
    monthlyRevenueData.push({
      month: format(monthDate, "MMM"),
      total: revenueByMonth[monthKey] || 0,
    });
  }

  // Fetch recent sales
  const recentSales = await db.order.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 7,
    include: {
      user: true
    }
  });

  const recentPurchases = recentSales.map((purchase) => ({
    name: purchase.user?.name ?? 'Unknown',
    email: purchase.user?.email ?? 'Unknown',
    paid: purchase.paid ? 'Paid' : 'Unpaid', // eller `paid: !!purchase.paid` om UserPurchaseProps.paid är boolean
  }));

  const goalAmount = 5000;
  const goalProgress = goalAmount > 0 ? (totalProfitPremium / goalAmount) * 100 : 0;

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-8">Adminpanel</h1>
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
            <LinkButton href="/admin/artiklar" variant="primary" className="w-full md:w-auto text-center text-lg py-4 px-8">Artiklar</LinkButton>
            <LinkButton href="/admin/artiklar-ai" variant="primary" className="w-full md:w-auto text-center text-lg py-4 px-8">Artiklar AI</LinkButton>
            <LinkButton href="/admin/kategorier" variant="primary" className="w-full md:w-auto text-center text-lg py-4 px-8">Kategorier</LinkButton>
            <LinkButton href="/admin/anvandare" variant="primary" className="w-full md:w-auto text-center text-lg py-4 px-8">Användare</LinkButton>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex flex-col gap-5 w-full">
            <h2 className="text-2xl font-bold text-center mx-6">Dashboard</h2>
            <div className="container mx-auto py-8">
              <div className="flex flex-col gap-5 w-full">
                <section className="grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 gap-x-8 transition-all">
                  <DashboardCard
                    label={"Prenumeranter"}
                    Icon={Users}
                    amount={subscriptionCount}
                    description="Totalt"
                  />
                  <DashboardCard
                    label={"Vinst Premium"}
                    Icon={Coins}
                    amount={`${totalProfitPremium} Kr`}
                    description="Totalt"
                  />
                  <DashboardCard
                    label={"Vinst senaste 30 dagar"}
                    Icon={Calendar}
                    amount={`${totalProfitLast30Days} Kr`}
                    description="Totalt"
                  />
                  <DashboardCard
                    label={"Vinst förra året"}
                    Icon={Calendar}
                    amount={`${totalProfitLastYear} Kr`}
                    description="Totalt"
                  />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 transition-all">
                  <DashboardCardContent>
                    <section className="flex justify-between gap-2 pb-2">
                      <p>Senaste användare</p>
                      <UserRoundCheck className="h-4 w-4" />
                    </section>
                    {UserData.map((data, index) => (
                      <UserDataCard
                        key={index}
                        name={data.name}
                        email={data.email}
                        time={data.time}>
                      </UserDataCard>
                    ))}
                  </DashboardCardContent>

                  <DashboardCardContent>
                    <section className="flex justify-between gap-2 pb-2">
                      <p>Senaste köp</p>
                      <CreditCard className="h-4 w-4" />
                    </section>
                    {recentPurchases.map((data, index) => (
                      <UserPurchaseCard
                        key={index}
                        name={data.name}
                        email={data.email}
                        paid={data.paid}
                      />
                    ))}
                  </DashboardCardContent>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 transition-all">
                  <BarChart data={monthlyUsersData}></BarChart>
                  <LineGraph data={monthlyRevenueData} />
                </section>

                <GoalDataCard goal={goalAmount} value={totalProfitPremium} bar={goalProgress} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
