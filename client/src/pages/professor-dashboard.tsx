import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import DashboardStats from "@/components/dashboard-stats";
import VoteCharts from "@/components/vote-charts";
import VotesTable from "@/components/votes-table";
import { Download } from "lucide-react";

export default function ProfessorDashboard() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const handleDownloadExcel = () => {
    // Create a download link and trigger click
    const downloadUrl = '/api/votes/download';
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'votos.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        
        {/* Download button */}
        <div className="flex justify-end mb-6">
          <Button 
            onClick={handleDownloadExcel}
            variant="outline"
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
          >
            <Download className="h-4 w-4" />
            Baixar Planilha Excel
          </Button>
        </div>
        
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
