import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import byodCompaniesImage from "../assets/byod-companies.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cultura BYOD</h1>
          <Link href="/auth">
            <Button className="bg-white text-primary hover:bg-gray-100">
              Acessar Sistema
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">BYOD: Bring Your Own Device</h2>
            <p className="text-xl mb-8">
              Uma iniciativa que permite aos funcionários utilizarem seus próprios dispositivos 
              para acessar recursos e sistemas corporativos, impulsionando a produtividade e 
              flexibilidade no ambiente de trabalho.
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Participar da Pesquisa
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* What is BYOD */}
          <div>
            <h3 className="text-3xl font-bold text-primary mb-6">O que é BYOD?</h3>
            <p className="text-gray-700 mb-4">
              BYOD (Bring Your Own Device) é uma política empresarial que permite aos funcionários 
              utilizarem seus próprios dispositivos pessoais (laptops, smartphones, tablets) 
              para realizar suas atividades profissionais, acessando os sistemas e dados da empresa.
            </p>
            <p className="text-gray-700 mb-4">
              Esta tendência vem crescendo globalmente, com benefícios como maior satisfação dos funcionários, 
              aumento de produtividade e redução de custos com equipamentos.
            </p>
            <div className="rounded-lg overflow-hidden shadow-lg mt-6">
              <img 
                src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Pessoas trabalhando com seus dispositivos"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* Advantages and disadvantages */}
          <div>
            <h3 className="text-3xl font-bold text-primary mb-6">Vantagens e Desafios</h3>
            
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Vantagens:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Maior satisfação e engajamento dos funcionários</li>
              <li>Redução de custos com aquisição e manutenção de equipamentos</li>
              <li>Aumento da produtividade e flexibilidade</li>
              <li>Dispositivos mais atualizados tecnologicamente</li>
              <li>Mobilidade aprimorada</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">Desafios:</h4>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Preocupações com segurança da informação</li>
              <li>Gestão de dispositivos heterogêneos</li>
              <li>Suporte técnico mais complexo</li>
              <li>Questões de privacidade e conformidade</li>
              <li>Separação entre dados pessoais e corporativos</li>
            </ul>

            <div className="rounded-lg overflow-hidden shadow-lg mt-6">
              <img 
                src="https://images.unsplash.com/photo-1521898284481-a5ec348cb555?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Dispositivos conectados"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Companies section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-primary mb-12 text-center">BYOD no Brasil</h3>
          
          {/* Display the image with companies listing */}
          <div className="flex justify-center mb-8">
            <img 
              src={byodCompaniesImage} 
              alt="Empresas que adotam e não adotam BYOD"
              className="w-full max-w-3xl shadow-lg rounded-lg"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Companies that use BYOD */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h4 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Empresas que adotam BYOD
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-primary font-bold">Itaú</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Itaú Unibanco</h5>
                    <p className="text-gray-600">Implementou políticas BYOD para aumentar a flexibilidade dos colaboradores e reduzir custos de TI.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-primary font-bold">Petrobras</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Petrobras</h5>
                    <p className="text-gray-600">Utiliza BYOD para equipes de campo, permitindo maior mobilidade e acesso aos sistemas em tempo real.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-primary font-bold">Vale</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Vale</h5>
                    <p className="text-gray-600">Adotou BYOD para melhorar produtividade em escritórios e operações remotas com forte investimento em segurança.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-primary font-bold">Natura</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Natura</h5>
                    <p className="text-gray-600">Implementou BYOD para consultoras e equipe administrativa, permitindo maior flexibilidade nas vendas.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-primary font-bold">Nubank</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Nubank</h5>
                    <p className="text-gray-600">Como banco digital, adota BYOD como parte da cultura de autonomia e está na vanguarda dessa prática.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Companies that don't use BYOD */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h4 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Empresas que não adotam BYOD
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-red-600 font-bold">BB</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Banco do Brasil</h5>
                    <p className="text-gray-600">Devido a rigorosas políticas de segurança, mantém controle total sobre os dispositivos usados nas operações.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-red-600 font-bold">Caixa</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Caixa Econômica Federal</h5>
                    <p className="text-gray-600">Como instituição pública, mantém controle restrito sobre equipamentos para garantir conformidade e segurança.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-red-600 font-bold">Bradesco</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Bradesco</h5>
                    <p className="text-gray-600">Restringe o uso de dispositivos pessoais em ambientes corporativos devido a preocupações com segurança bancária.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-red-600 font-bold">Embraer</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Embraer</h5>
                    <p className="text-gray-600">Por questões de segurança industrial e propriedade intelectual, controla rigidamente os dispositivos utilizados.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded mr-4">
                    <span className="text-red-600 font-bold">Correios</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold">Correios</h5>
                    <p className="text-gray-600">Como empresa pública, mantém política de uso exclusivo de equipamentos corporativos para fins de segurança.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4">Participe da nossa Pesquisa sobre BYOD</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Compartilhe sua opinião sobre a adoção de dispositivos pessoais no ambiente de trabalho
            e ajude a formar um panorama desta tendência no Brasil.
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Acessar o Sistema
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Sistema de Votação BYOD. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}