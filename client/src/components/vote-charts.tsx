import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface StatsResponse {
  totalVotes: number;
  favorVotes: number;
  contraVotes: number;
  ageDistribution: Record<string, { favor: number, contra: number }>;
  professionDistribution: Array<{ name: string; favor: number; contra: number }>;
}

export default function VoteCharts() {
  const { data: stats, isLoading, error } = useQuery<StatsResponse>({
    queryKey: ["/api/votes/stats"],
    refetchInterval: 5000, // Refresh stats every 5 seconds
  });
  
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartInstance = useRef<Chart | null>(null);
  
  const ageChartRef = useRef<HTMLCanvasElement>(null);
  const ageChartInstance = useRef<Chart | null>(null);
  
  const professionChartRef = useRef<HTMLCanvasElement>(null);
  const professionChartInstance = useRef<Chart | null>(null);

  // Setup distribution pie chart
  useEffect(() => {
    if (!pieChartRef.current || !stats) return;
    
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }
    
    const ctx = pieChartRef.current.getContext('2d');
    if (ctx) {
      pieChartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['A Favor', 'Contra'],
          datasets: [{
            data: [stats.favorVotes, stats.contraVotes],
            backgroundColor: ['#4caf50', '#f44336'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
    
    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
    };
  }, [stats]);

  // Setup age distribution chart
  useEffect(() => {
    if (!ageChartRef.current || !stats || !stats.ageDistribution) return;
    
    if (ageChartInstance.current) {
      ageChartInstance.current.destroy();
    }
    
    const ageGroups = Object.keys(stats.ageDistribution);
    const favorData = ageGroups.map(group => stats.ageDistribution[group].favor);
    const contraData = ageGroups.map(group => stats.ageDistribution[group].contra);
    
    const ctx = ageChartRef.current.getContext('2d');
    if (ctx) {
      ageChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ageGroups,
          datasets: [
            {
              label: 'A Favor',
              data: favorData,
              backgroundColor: '#4caf50',
              borderWidth: 0
            },
            {
              label: 'Contra',
              data: contraData,
              backgroundColor: '#f44336',
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    return () => {
      if (ageChartInstance.current) {
        ageChartInstance.current.destroy();
      }
    };
  }, [stats]);

  // Setup profession distribution chart
  useEffect(() => {
    if (!professionChartRef.current || !stats || !stats.professionDistribution) return;
    
    if (professionChartInstance.current) {
      professionChartInstance.current.destroy();
    }
    
    const professions = stats.professionDistribution.map(p => p.name);
    const favorData = stats.professionDistribution.map(p => p.favor);
    const contraData = stats.professionDistribution.map(p => p.contra);
    
    const ctx = professionChartRef.current.getContext('2d');
    if (ctx) {
      professionChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: professions,
          datasets: [
            {
              label: 'A Favor',
              data: favorData,
              backgroundColor: '#4caf50',
              borderWidth: 0
            },
            {
              label: 'Contra',
              data: contraData,
              backgroundColor: '#f44336',
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            },
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45
              }
            }
          }
        }
      });
    }
    
    return () => {
      if (professionChartInstance.current) {
        professionChartInstance.current.destroy();
      }
    };
  }, [stats]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Erro ao carregar gráficos: {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Distribuição de Votos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
        
        {/* Bar Chart - Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Votos por Faixa Etária</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <canvas ref={ageChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart - Profession Distribution */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Votos por Profissão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={professionChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
