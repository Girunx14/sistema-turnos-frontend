import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Card from '../ui/Card'

export default function TurnosPorHora({ turnos }) {
  const conteo = {}
  for (let h = 8; h <= 18; h++) conteo[`${h}:00`] = 0

  turnos.forEach(t => {
    const hora = new Date(t.fecha_hora).getHours()
    const key = `${hora}:00`
    if (conteo[key] !== undefined) conteo[key]++
  })

  const data = Object.entries(conteo).map(([hora, turnos]) => ({ hora, turnos }))

  return (
    <Card>
      <p className="text-slate-400 text-xs uppercase tracking-wide mb-4">Turnos por hora del día</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="hora" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
            cursor={{ fill: '#1e293b' }}
          />
          <Bar dataKey="turnos" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}