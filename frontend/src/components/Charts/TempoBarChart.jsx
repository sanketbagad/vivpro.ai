import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

function TempoBarChart({ songs = [] }) {
  const data = songs.slice(0, 20).map((s) => ({
    title: s.title?.length > 12 ? s.title.slice(0, 12) + '…' : s.title,
    fullTitle: s.title,
    tempo: s.tempo,
  }))

  return (
    <div className="chart-card">
      <h3 className="chart-title">Tempo (First 20 Songs)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 60, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="title"
            angle={-40}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 10 }}
          />
          <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(v) => [v?.toFixed(1) + ' BPM', 'Tempo']}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullTitle || ''}
          />
          <Bar dataKey="tempo" fill="#ec4899" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TempoBarChart
