import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
} from "recharts";

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
  tick: { fill: "var(--muted-foreground)", fontSize: 11 },
  tickMargin: 8,
};

const grid = {
  stroke: "var(--border)",
  strokeDasharray: "2 6",
  strokeOpacity: 0.9,
} as const;

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    fontSize: "12px",
    direction: "rtl" as const,
    color: "var(--popover-foreground)",
    boxShadow: "var(--shadow-lg)",
    padding: "10px 12px",
  },
  labelStyle: {
    color: "var(--muted-foreground)",
    marginBottom: 6,
    fontSize: 11,
    fontWeight: 600,
  },
  itemStyle: { padding: "2px 0" },
  cursor: { stroke: "var(--border-strong)", strokeWidth: 1, strokeDasharray: "3 3" },
};

const legendStyle = {
  wrapperStyle: {
    fontSize: 12,
    direction: "rtl" as const,
    paddingTop: 12,
    color: "var(--muted-foreground)",
  },
  iconType: "circle" as const,
  iconSize: 8,
};

export function ChartFrame({
  children,
  height = 280,
}: {
  children: React.ReactElement;
  height?: number;
}) {
  return (
    <div style={{ height }} className="w-full [&_.recharts-surface]:overflow-visible">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}


export function SentimentAreaChart({
  data,
  height = 280,
}: {
  data: { day: string; positive: number; negative: number; neutral: number }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="gPos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--positive)" stopOpacity={0.34} />
            <stop offset="100%" stopColor="var(--positive)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gNeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--negative)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--negative)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...grid} vertical={false} />
        <XAxis dataKey="day" {...axis} reversed />
        <YAxis {...axis} orientation="right" width={38} />
        <Tooltip {...tooltipStyle} />
        <Legend
          {...legendStyle}
          formatter={(v) =>
            v === "positive" ? "إيجابي" : v === "negative" ? "سلبي" : "محايد"
          }
        />
        <Area
          type="monotoneX"
          dataKey="positive"
          stroke="var(--positive)"
          fill="url(#gPos)"
          strokeWidth={2.25}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
        />
        <Area
          type="monotoneX"
          dataKey="negative"
          stroke="var(--negative)"
          fill="url(#gNeg)"
          strokeWidth={2.25}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }}
        />
        <Area
          type="monotoneX"
          dataKey="neutral"
          stroke="var(--neutral)"
          fill="transparent"
          strokeWidth={1.75}
          strokeDasharray="4 4"
          dot={false}
          activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--card)" }}
        />
      </AreaChart>
    </ChartFrame>
  );
}

export function TrendLineChart({
  data,
  height = 280,
  keys = [{ key: "volume", label: "حجم التغطية", color: "var(--chart-1)" }],
}: {
  data: Record<string, string | number>[];
  height?: number;
  keys?: { key: string; label: string; color: string }[];
}) {
  return (
    <ChartFrame height={height}>
      <LineChart data={data} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid {...grid} vertical={false} />
        <XAxis dataKey="t" {...axis} reversed />
        <YAxis {...axis} orientation="right" width={44} />
        <Tooltip
          {...tooltipStyle}
          formatter={(value, name) => [
            value as number,
            keys.find((k) => k.key === name)?.label ?? (name as string),
          ]}
        />
        {keys.length > 1 ? (
          <Legend {...legendStyle} formatter={(v) => keys.find((k) => k.key === v)?.label ?? v} />
        ) : null}
        {keys.map((k) => (
          <Line
            key={k.key}
            type="monotoneX"
            dataKey={k.key}
            stroke={k.color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 2.5, stroke: "var(--card)" }}
          />
        ))}
      </LineChart>
    </ChartFrame>
  );
}

export function HorizontalBars({
  data,
  height = 280,
  color = "var(--chart-1)",
}: {
  data: { name: string; value: number }[];
  height?: number;
  color?: string;
}) {
  return (
    <ChartFrame height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <CartesianGrid {...grid} horizontal={false} />
        <XAxis type="number" {...axis} />
        <YAxis
          type="category"
          dataKey="name"
          {...axis}
          orientation="right"
          width={132}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <Tooltip
          {...tooltipStyle}
          cursor={{ fill: "var(--surface-2)", opacity: 0.6 }}
          formatter={(v) => [v as number, "الحجم"]}
        />
        <Bar
          dataKey="value"
          fill={color}
          radius={[8, 0, 0, 8]}
          barSize={14}
          background={{ fill: "var(--surface-2)", radius: 8 }}
        />
      </BarChart>
    </ChartFrame>
  );
}

export function GroupedBars({
  data,
  keys,
  height = 300,
}: {
  data: Record<string, string | number>[];
  keys: { key: string; label: string; color: string }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <BarChart data={data} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid {...grid} vertical={false} />
        <XAxis dataKey="name" {...axis} reversed />
        <YAxis {...axis} orientation="right" width={40} />
        <Tooltip
          {...tooltipStyle}
          cursor={{ fill: "var(--surface-2)", opacity: 0.6 }}
          formatter={(value, name) => [
            value as number,
            keys.find((k) => k.key === name)?.label ?? (name as string),
          ]}
        />
        <Legend {...legendStyle} formatter={(v) => keys.find((k) => k.key === v)?.label ?? v} />
        {keys.map((k) => (
          <Bar key={k.key} dataKey={k.key} fill={k.color} radius={[7, 7, 0, 0]} barSize={18} />
        ))}
      </BarChart>
    </ChartFrame>
  );
}

export function DonutChart({
  data,
  height = 260,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <PieChart>
        <Tooltip {...tooltipStyle} cursor={false} />
        <Legend {...legendStyle} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="60%"
          outerRadius="84%"
          paddingAngle={2.5}
          cornerRadius={4}
          stroke="var(--card)"
          strokeWidth={2}
        >
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartFrame>
  );
}

export function CompareRadar({
  data,
  height = 300,
}: {
  data: { metric: string; base: number; rival: number }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--border)" strokeDasharray="2 5" />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Tooltip {...tooltipStyle} cursor={false} />
        <Radar
          name="الجهة الأساسية"
          dataKey="base"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="var(--chart-1)"
          fillOpacity={0.24}
        />
        <Radar
          name="المنافس الأول"
          dataKey="rival"
          stroke="var(--gold)"
          strokeWidth={2}
          fill="var(--gold)"
          fillOpacity={0.16}
        />
        <Legend {...legendStyle} />
      </RadarChart>
    </ChartFrame>
  );
}

