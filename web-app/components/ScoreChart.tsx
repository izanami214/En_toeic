'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

interface ScoreChartProps {
    data: {
        date: string;
        score: number | null; // Allow null for detailed calculation
        title: string;
    }[];
}

export default function ScoreChart({ data }: ScoreChartProps) {
    // Format data for chart
    const chartData = data
        .filter((item) => item.score !== null)
        .slice(0, 10) // Take last 10 tests
        .reverse(); // Show chronological order

    if (chartData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-400">
                Chưa đủ dữ liệu để vẽ biểu đồ
            </div>
        );
    }

    return (
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        domain={[0, 990]}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                    />
                    <ReferenceLine y={450} label="Mục tiêu" stroke="red" strokeDasharray="3 3" />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
