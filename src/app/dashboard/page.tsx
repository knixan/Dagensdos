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


export default async function Dashboard() {

    const currentDate = new Date();

    //Total subscriptions
    const subscriptionCount = await db.subscription.count();



    //Premium subscription
    const premium = await db.subscriptionType.findUnique({
        where: { name: 'premium' },
        include: {
            subscriptions: {
                select: { id: true },
            },
        },
    })
    const totalProfitPremium = premium ? premium.price * premium.subscriptions.length : 0 || 0
    console.log("totalProfitPremium", totalProfitPremium)


    const lastYearStart = startOfYear(subYears(new Date(), 1))
    const lastYearEnd = endOfYear(subYears(new Date(), 1))

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
    })

    //Compute total profit
    const totalProfitLastYear = subscriptionsLastYear.reduce(
        (sum, sub) => sum + sub.type.price, 0) || 0

    console.log({ totalProfitLastYear })

    const thirtyDaysAgo = subDays(new Date(), 30)
    const subscriptionsLast30Days = await db.subscription.findMany({
        where: {
            createdAt: {
                gte: thirtyDaysAgo, // createdAt >= 30 days ago
            },
        },
        include: {
            type: {
                select: { price: true },
            },
        },
    })

    // Calculate profit last 30 days
    const totalProfitLast30Days = subscriptionsLast30Days.reduce(
        (sum, sub) => sum + sub.type.price, 0) || 0

    console.log({ totalProfitLast30Days })

    const recentUsers = await db.user.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 7
    })
    const UserData: UserDataProps[] = recentUsers.map((account: {
        name: string; email: string; /*image: unknown;*/ createdAt: Date;
    }) => ({
        name: account.name || 'Unknown',
        email: account.email || 'Unknown',
        // image: account.image || "/images/user-icon.jpg",
        time: formatDistanceToNow(new Date(account.createdAt), { addSuffix: true }),
    }))

    const usersThisMonth = await db.user.groupBy({
        by: ['createdAt'],
        _count: { createdAt: true },
        orderBy: { createdAt: 'asc' }
    })

    const monthlyUsersData = eachMonthOfInterval({
        start: startOfMonth(new Date(usersThisMonth[0]?.createdAt || new Date())),
        end: endOfMonth(currentDate)
    }).map(month => {
        const monthString = format(month, 'MMM');
        const userMonthly = usersThisMonth.filter(user => format(new Date(user.createdAt), 'MMM') === monthString).reduce((total, user) => total
            + user._count.createdAt, 0);
        return { month: monthString, total: userMonthly }
    })
    console.log(monthlyUsersData)


    /*** */
    const sixMonthsAgo = subMonths(currentDate, 6)

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
    })

    // Group by month and sum prices
    const revenueByMonth: Record<string, number> = {}

    subscriptionsLast6Months.forEach((sub) => {
        const monthKey = format(sub.createdAt, "yyyy-MM")
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + sub.type.price
    })

    // Ensure all months exist (even with 0)
    const monthlyRevenueData = []
    for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(currentDate, i)
        const monthKey = format(monthDate, "yyyy-MM")
        monthlyRevenueData.push({
            month: format(monthDate, "MMM"),
            total: revenueByMonth[monthKey] || 0,
        })
    }

    console.log(monthlyRevenueData)
    /*** */

    //Fetch recent sales
    const recentSales = await db.order.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 7,
        include: {
            user: true
        }
    })

    const PurchaseCard: UserPurchaseProps[] = recentSales.map((
        purchase => ({
            name: purchase.user?.name || 'Unknown',
            email: purchase.user?.email || 'Unknown',
            paid: purchase.paid ? 'Paid' : 'Unpaid',
            //image: purchase.user?. || "/images/user-icon.jpg",_count

        }))
    )

    const goalAmount = 5000;
    const goalProgress = totalProfitPremium / goalAmount * 100

    return (
        <div className="flex flex-col gap-5 w-full">
            <h1 className="text-2xl font-bold text-bold text-center mx-6">Dashboard</h1>
            <div className="container mx-auto py-8">
                <div className="flex flex-col gap-5 w-full">
                    <section className="grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
                        gap-4 gap-x-8 transition-all">
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
                                    //image={data.image}
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
                            {PurchaseCard.map((data, index) => (
                                <UserPurchaseCard
                                    key={index}
                                    name={data.name}
                                    //image={data.image}
                                    email={data.email}
                                    paid={data.paid}
                                >
                                </UserPurchaseCard>
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
    )
}