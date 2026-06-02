"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa', '#38bdf8']

export function FormResponsesCharts({ fields, responses }: { fields: any[], responses: any[] }) {
    
    const chartData = useMemo(() => {
        const data: Record<string, any> = {}

        fields.forEach(field => {
            if (field.type === 'select' || field.type === 'checkbox') {
                const counts: Record<string, number> = {}
                
                // Initialize counts with 0 for all options
                field.options?.forEach((opt: string) => {
                    counts[opt] = 0
                })

                responses.forEach(r => {
                    const ans = r.answers.find((a: any) => a.field_id === field.id)
                    if (ans) {
                        if (field.type === 'select' && ans.answer_text) {
                            counts[ans.answer_text] = (counts[ans.answer_text] || 0) + 1
                        } else if (field.type === 'checkbox' && Array.isArray(ans.answer_json)) {
                            ans.answer_json.forEach((val: string) => {
                                counts[val] = (counts[val] || 0) + 1
                            })
                        }
                    }
                })

                data[field.id] = Object.entries(counts).map(([name, value]) => ({ name, value }))
            }
        })

        return data
    }, [fields, responses])

    const chartFields = fields.filter(f => f.type === 'select' || f.type === 'checkbox')

    if (chartFields.length === 0 || responses.length === 0) return null

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {chartFields.map(field => {
                const data = chartData[field.id]
                const total = data.reduce((sum: number, item: any) => sum + item.value, 0)
                
                return (
                    <Card key={field.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground uppercase tracking-widest">{field.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full mt-4">
                                {total === 0 ? (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-xl">
                                        No data yet
                                    </div>
                                ) : field.type === 'select' ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {data.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip 
                                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#27272a" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} />
                                            <RechartsTooltip 
                                                cursor={{fill: '#27272a', opacity: 0.4}}
                                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Bar dataKey="value" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                            
                            {/* Legend for Pie */}
                            {field.type === 'select' && total > 0 && (
                                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                                    {data.map((entry: any, index: number) => (
                                        <div key={entry.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            {entry.name} ({entry.value})
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
