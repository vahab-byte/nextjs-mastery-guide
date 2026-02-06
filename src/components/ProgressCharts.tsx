import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp } from "lucide-react";

interface ProgressChartsProps {
    data?: any[];
}

const ProgressCharts = ({ data }: ProgressChartsProps) => {
    // Mock data if none provided, to show the UI
    const chartData = data || [
        { name: "Mon", xp: 120 },
        { name: "Tue", xp: 200 },
        { name: "Wed", xp: 150 },
        { name: "Thu", xp: 300 },
        { name: "Fri", xp: 250 },
        { name: "Sat", xp: 350 },
        { name: "Sun", xp: 400 },
    ];

    return (
        <Card className="col-span-1 md:col-span-2 h-[400px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Weekly Progress (XP)
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', background: 'rgba(20,20,30,0.95)', color: '#fff' }}
                        />
                        <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary)/0.3)"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default ProgressCharts;
