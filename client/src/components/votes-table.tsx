import { Vote } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VotesTableProps {
  voteType?: "favor" | "contra";
  showFilters?: boolean;
  title?: string;
  titleColor?: string;
}

export default function VotesTable({ 
  voteType, 
  showFilters = false,
  title = "Votos",
  titleColor = "text-primary"
}: VotesTableProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [professionFilter, setProfessionFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>(voteType || "all");
  
  const buttonColor = voteType === "favor" 
    ? "bg-[#4caf50]/10 hover:bg-[#4caf50]/20 text-[#4caf50]" 
    : "bg-[#f44336]/10 hover:bg-[#f44336]/20 text-[#f44336]";

  // Build query string
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (typeFilter && typeFilter !== "all") params.append("type", typeFilter);
    if (professionFilter && professionFilter !== "all") params.append("profession", professionFilter);
    if (ageFilter && ageFilter !== "all") params.append("ageRange", ageFilter);
    return params.toString() ? `?${params.toString()}` : "";
  };

  const { data: votes, isLoading, error } = useQuery<Vote[]>({
    queryKey: ["/api/votes", typeFilter, professionFilter, ageFilter],
    queryFn: async ({ queryKey }) => {
      if (!isVisible) return [];
      const queryString = buildQueryString();
      return fetch(`/api/votes${queryString}`).then(res => {
        if (!res.ok) throw new Error("Failed to fetch votes");
        return res.json();
      });
    },
    enabled: isVisible
  });

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={`text-xl font-medium ${titleColor}`}>{title}</CardTitle>
        
        <Button 
          onClick={toggleVisibility}
          variant="outline"
          className={buttonColor}
        >
          {isVisible ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Ocultar Votos
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Mostrar Votos
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent>
        {isVisible && (
          <>
            {showFilters && (
              <div className="flex flex-wrap gap-3 mb-6">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Todos os votos</option>
                  <option value="favor">A Favor</option>
                  <option value="contra">Contra</option>
                </select>

                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={professionFilter}
                  onChange={(e) => setProfessionFilter(e.target.value)}
                >
                  <option value="all">Todas as profissões</option>
                  <option value="estudante">Estudante</option>
                  <option value="professor">Professor</option>
                  <option value="engenheiro">Engenheiro</option>
                  <option value="medico">Médico</option>
                  <option value="outros">Outros</option>
                </select>

                <select
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                >
                  <option value="all">Todas as idades</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-50">36-50</option>
                  <option value="51+">51+</option>
                </select>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">
                Erro ao carregar dados: {error.message}
              </div>
            ) : votes && votes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entrevistador</TableHead>
                      <TableHead>Entrevistado</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>Profissão</TableHead>
                      {showFilters && <TableHead>Tipo de Voto</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {votes.map((vote) => (
                      <TableRow key={vote.id}>
                        <TableCell>{vote.interviewer_name}</TableCell>
                        <TableCell>{vote.interviewee_name}</TableCell>
                        <TableCell>{vote.interviewee_email}</TableCell>
                        <TableCell>{vote.age}</TableCell>
                        <TableCell>{vote.profession}</TableCell>
                        {showFilters && (
                          <TableCell>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${vote.vote_type === 'favor' 
                                ? 'bg-[#4caf50]/10 text-[#4caf50]' 
                                : 'bg-[#f44336]/10 text-[#f44336]'}`}>
                              {vote.vote_type === 'favor' ? 'A Favor' : 'Contra'}
                            </span>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Nenhum voto encontrado.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
