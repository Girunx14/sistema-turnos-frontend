import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../ui/Card'

const COLORS = ['#3b82f6', '#ec4899', '#8b5cf6']

export default function TurnosPorGenero({ turnos }) {
  const conteo = turnos.reduce((acc, t) => {
    const nombre = t.genero?.nombre || 'Sin registrar'
    acc[nombre] = (acc[nombre] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(conteo).map(([name, value]) => ({ name, value }))

  return (
    <Card>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-4">Turnos por género</p>
      {data.length === 0 ? (
        <p className="text-slate-600 text-sm text-center py-8">Sin datos</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
            />
            <Legend formatter={(v) => <span className="text-slate-300 text-xs">{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}