import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

function DanceabilityScatter({ songs = [] }) {
  const data = songs.map((s) => ({
    index: s.index,
    danceability: s.danceability,
    title: s.title,
  }))

  return (
    <div className="chart-card">
      <h3 className="chart-title">Danceability by Track Index</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" name="Index" label={{ value: 'Index', position: 'insideBottom', offset: -10 }} />
          <YAxis
            dataKey="danceability"
            name="Danceability"
            domain={[0, 1]}
            label={{ value: 'Danceability', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
            if (!payload || !payload.length) return null
            const d = payload[0]?.payload
            return (
              <div className="custom-tooltip">
                <p><strong>{d?.title}</strong></p>
                <p>Index: {d?.index}</p>
                <p>Danceability: {d?.danceability?.toFixed(3)}</p>
              </div>
            )
          }} />
          <Legend />
          <Scatter name="Songs" data={data} fill="#6366f1" opacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DanceabilityScatter
