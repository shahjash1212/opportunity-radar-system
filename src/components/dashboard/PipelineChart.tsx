
import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead, PIPELINE_STAGES } from '@/types/lead';
import { formatCurrency } from '@/lib/formatters';

interface PipelineChartProps {
  leads: Lead[];
}

export function PipelineChart({ leads }: PipelineChartProps) {
  // Process data for the chart
  const stageData = PIPELINE_STAGES.map(stage => {
    const stageLeads = leads.filter(lead => lead.stage === stage.id);
    const count = stageLeads.length;
    const value = stageLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
    
    return {
      name: stage.name,
      count,
      value,
      color: stage.color,
    };
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p>Leads: {data.count}</p>
          <p>Value: {formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Pipeline Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stageData}
              margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#888', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fill: '#888', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                // Use the color from the data
                fill="#9b87f5"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
