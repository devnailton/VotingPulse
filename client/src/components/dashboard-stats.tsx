import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsResponse {
  totalVotes: number;
  favorVotes: number;
  contraVotes: number;
  ageDistribution: Record<string, { favor: number, contra: number }>;
  professionDistribution: Array<{ name: string; favor: number; contra: number }>;
}

export default function DashboardStats() {
  const { data: stats, isLoading, error } = useQuery<StatsResponse>({
    queryKey: ["/api/votes/stats"],
    refetchInterval: 5000, // Refresh stats every 5 seconds
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Erro ao carregar estatísticas: {error.message}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Nenhuma estatística disponível.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Total Votes */}
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0 flex items-center">
          <div className="rounded-full bg-primary bg-opacity-10 p-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm">Total de Votos</h3>
            <p className="text-2xl font-medium">{stats.totalVotes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Favor Votes */}
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0 flex items-center">
          <div className="rounded-full bg-[#4caf50] bg-opacity-10 p-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#4caf50]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm">Votos a Favor</h3>
            <p className="text-2xl font-medium">{stats.favorVotes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contra Votes */}
      <Card className="bg-white rounded-lg shadow p-6">
        <CardContent className="p-0 flex items-center">
          <div className="rounded-full bg-[#f44336] bg-opacity-10 p-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#f44336]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-muted-foreground text-sm">Votos Contra</h3>
            <p className="text-2xl font-medium">{stats.contraVotes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
