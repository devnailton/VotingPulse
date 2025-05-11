import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveyFormSchema, InsertVote } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";

interface SurveyFormProps {
  voteType: "favor" | "contra";
}

export default function SurveyForm({ voteType }: SurveyFormProps) {
  const { toast } = useToast();
  const { sendMessage } = useWebSocket();
  
  const formTitle = voteType === "favor" 
    ? "Formulário de Pesquisa (A Favor)"
    : "Formulário de Pesquisa (Contra)";
  
  const buttonText = voteType === "favor"
    ? "Registrar Voto a Favor"
    : "Registrar Voto Contra";
  
  const buttonColor = voteType === "favor"
    ? "bg-[#4caf50] hover:bg-[#43a047] text-white"
    : "bg-[#f44336] hover:bg-[#e53935] text-white";
  
  const form = useForm<InsertVote>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: {
      interviewer_name: "",
      interviewee_name: "",
      interviewee_email: "",
      age: undefined,
      profession: "",
      case_example: "",
      vote_type: voteType
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertVote) => {
      const res = await apiRequest("POST", "/api/votes", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/votes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/votes/stats"] });
      
      // Send WebSocket message
      sendMessage({
        type: 'new_vote',
        data: data
      });
      
      toast({
        title: "Voto registrado com sucesso",
        description: `O voto ${voteType === "favor" ? "a favor" : "contra"} foi registrado.`
      });
      
      // Reset form
      form.reset({
        interviewer_name: "",
        interviewee_name: "",
        interviewee_email: "",
        age: undefined,
        profession: "",
        case_example: "",
        vote_type: voteType
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao registrar voto",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertVote) => {
    submitMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader className={voteType === "favor" ? "text-[#4caf50]" : "text-[#f44336]"}>
        <CardTitle className="text-xl font-medium">{formTitle}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="interviewer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Entrevistador</FormLabel>
                    <FormControl>
                      <Input {...field} className={`focus-visible:ring-${voteType === "favor" ? "[#4caf50]" : "[#f44336]"}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interviewee_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Entrevistado</FormLabel>
                    <FormControl>
                      <Input {...field} className={`focus-visible:ring-${voteType === "favor" ? "[#4caf50]" : "[#f44336]"}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="interviewee_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail do Entrevistado</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} className={`focus-visible:ring-${voteType === "favor" ? "[#4caf50]" : "[#f44336]"}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={18} 
                        max={100} 
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className={`focus-visible:ring-${voteType === "favor" ? "[#4caf50]" : "[#f44336]"}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profissão</FormLabel>
                    <FormControl>
                      <Input {...field} className={`focus-visible:ring-${voteType === "favor" ? "[#4caf50]" : "[#f44336]"}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="case_example"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exemplo de Caso Real (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={3} 
                        {...field} 
                        className={`focus-visible:ring-${voteType === "favor" ? "[#4caf50]" : "[#f44336]"}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit"
              className={buttonColor}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                buttonText
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
