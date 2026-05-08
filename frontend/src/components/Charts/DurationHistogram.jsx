import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

function DurationHistogram({ songs = [] }) {
  if (!songs.length) return <div className="chart-card"><h3 className="chart-title">Duration Distribution</h3><p>No data</p></div>

  const durations = songs.map((s) => s.duration_ms).filter(Boolean)
  const min = Math.min(...durations)
  const max = Math.max(...durations)
  const bucketCount = 10
  const bucketSize = (max - min) / bucketCount || 1

  const buckets = Array.from({ length: bucketCount }, (_, i) => {
    const start = min + i * bucketSize
    const end = start + bucketSize
    return {
      label: `${Math.round(start / 1000)}s-${Math.round(end / 1000)}s`,
      count: 0,
      start,
      end,
    }
  })

  durations.forEach((d) => {
    const idx = Math.min(
      Math.floor((d - min) / bucketSize),
      bucketCount - 1
    )
    buckets[idx].count++
  })

  return (
    <div className="chart-card">
      <h3 className="chart-title">Duration Distribution (10 Buckets)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={buckets} margin={{ top: 10, right: 20, bottom: 40, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            angle={-35}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 10 }}
          />
          <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(v) => [v, 'Songs']} />
          <Bar dataKey="count" fill="#10b981" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DurationHistogram
