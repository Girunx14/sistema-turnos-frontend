import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import Card from '../ui/Card'

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export default function TurnosPorArea({ turnos }) {
  const conteo = turnos.reduce((acc, t) => {
    const nombre = t.area?.nombre || 'Sin área'
    acc[nombre] = (acc[nombre] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(conteo).map(([area, total]) => ({ area, total }))

  return (
    <Card>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-4">Turnos por área</p>
      {data.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-8">Sin datos</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={28} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="area" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
              cursor={{ fill: '#0f172a' }}
            />
            <Bar dataKey="total" radius={[0, 6, 6, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}