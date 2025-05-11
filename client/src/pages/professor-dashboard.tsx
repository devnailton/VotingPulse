import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import DashboardStats from "@/components/dashboard-stats";
import VoteCharts from "@/components/vote-charts";
import VotesTable from "@/components/votes-table";

export default function ProfessorDashboard() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div>
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-medium">Sistema de Votação - Painel do Professor</h1>
          <div className="flex items-center space-x-4">
            <span>{user?.username}</span>
            <Button 
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Dashboard Stats */}
        <DashboardStats />
        
        {/* Charts */}
        <VoteCharts />
        
        {/* Votes Table */}
        <VotesTable 
          showFilters={true} 
          title="Tabela de Votos" 
        />
      </main>
    </div>
  );
}
