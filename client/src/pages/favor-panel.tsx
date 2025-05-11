import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import SurveyForm from "@/components/survey-form";
import VotesTable from "@/components/votes-table";

export default function FavorPanel() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <div>
      {/* Header */}
      <header className="bg-[#4caf50] text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-medium">Sistema de Votação - Painel A Favor</h1>
          <div className="flex items-center space-x-4">
            <span>{user?.username}</span>
            <Button 
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              className="bg-white text-[#4caf50] hover:bg-gray-100"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Survey Form */}
        <div className="mb-6">
          <SurveyForm voteType="favor" />
        </div>
        
        {/* Votes Table */}
        <VotesTable 
          voteType="favor" 
          title="Votos a Favor" 
          titleColor="text-[#4caf50]" 
        />
      </main>
    </div>
  );
}
