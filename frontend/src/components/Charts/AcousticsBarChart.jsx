import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

function AcousticsBarChart({ songs = [] }) {
  const data = songs.slice(0, 20).map((s) => ({
    title: s.title?.length > 12 ? s.title.slice(0, 12) + '…' : s.title,
    fullTitle: s.title,
    acousticness: s.acousticness,
  }))

  return (
    <div className="chart-card">
      <h3 className="chart-title">Acousticness (First 20 Songs)</h3>
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
          <YAxis
            domain={[0, 1]}
            label={{ value: 'Acousticness', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(v) => [v?.toFixed(4), 'Acousticness']}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullTitle || ''}
          />
          <Bar dataKey="acousticness" fill="#f59e0b" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AcousticsBarChart
