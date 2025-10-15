
'use client';

import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TermsOfUsePage({ params: { lang } }: { params: { lang: string } }) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <Link href={`/${lang}`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Início
            </Link>
            <Link href={`/${lang}/login`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Login
            </Link>
            <Link href={`/${lang}/signup`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Cadastro
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-12 md:py-20 px-4 md:px-6">
        <section className="prose prose-invert max-w-none">
          <h1>Termos de Uso</h1>
          <p>Última atualização: 17 de setembro de 2025</p>

          <h2>1. Introdução</h2>
          <p>Estes Termos de Uso ("Termos") estabelecem as condições gerais para o uso da plataforma Invest Prime ("Plataforma"), operada pela Invest Prime Investimentos Alternativos Ltda., inscrita no CNPJ sob o nº 12.345.678/0001-90, com sede na Avenida Paulista, 1234, São Paulo, SP, Brasil. Ao acessar ou utilizar a Plataforma, você ("Usuário") concorda em cumprir estes Termos, que formam um contrato de adesão entre você e a Invest Prime. Caso não concorde, não utilize a Plataforma. A Invest Prime não oferece assessoria financeira personalizada e não garante quaisquer retornos sobre investimentos. Todos os investimentos envolvem riscos significativos, incluindo a possibilidade de perda total do capital.</p>

          <h2>2. Definições</h2>
          <p>Para fins destes Termos:</p>
          <ul>
              <li><strong>Usuário</strong>: Pessoa física ou jurídica que acessa ou utiliza a Plataforma.</li>
              <li><strong>Investimento</strong>: Aquisição de royalties ou outros ativos alternativos oferecidos na Plataforma, sujeitos a riscos de mercado.</li>
              <li><strong>Dados Pessoais</strong>: Informações relacionadas a pessoa natural identificada ou identificável, conforme definido na LGPD (Lei nº 13.709/2018).</li>
              <li><strong>Royalties</strong>: Direitos sobre receitas futuras de projetos selecionados, com valor mínimo de R$ 100,00 e retorno esperado de até 5,5% ao mês, sujeito a variações e sem garantia.</li>
          </ul>

          <h2>3. Aceitação dos Termos</h2>
          <p>Ao cadastrar-se, acessar ou utilizar a Plataforma, o Usuário manifesta sua aceitação livre, expressa e informada destes Termos e da Política de Privacidade integrada. O Usuário deve ser maior de 18 anos e plenamente capaz civilmente, conforme Código Civil Brasileiro. Menores ou incapazes precisam de representação legal devidamente comprovada. A aceitação inclui o consentimento para o tratamento de dados pessoais conforme descrito na seção 11.</p>

          <h2>4. Arcabouço Legal</h2>
          <p>A Plataforma opera em conformidade com a legislação brasileira, incluindo:</p>
          <ul>
              <li>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018), com atualizações de 2025 relativas a consentimento digital e transferência internacional de dados;</li>
              <li>Código de Defesa do Consumidor (CDC - Lei nº 8.078/1990);</li>
              <li>Marco Civil da Internet (Lei nº 12.965/2014);</li>
              <li>Normas da Comissão de Valores Mobiliários (CVM), incluindo Resolução CVM nº 88/2022 (crowdfunding de investimento), Resolução CVM nº 175/2023 (fundos de investimento), Resolução CVM nº 232/2025 (facilitação de acesso a capital) e Resolução CVM nº 226/2025 (marco legal das garantias). A Invest Prime opera sob o regime de crowdfunding de investimento, devidamente registrada na CVM, e não realiza ofertas públicas sem aprovação prévia.</li>
          </ul>
          <p>A Invest Prime não é uma instituição financeira regulada pelo Banco Central do Brasil para todos os serviços e não oferece garantias de rentabilidade. Investimentos são de alto risco e não contam com proteção do Fundo Garantidor de Créditos (FGC).</p>

          <h2>5. Descrição dos Serviços</h2>
          <p>A Invest Prime oferece uma plataforma digital para investimentos alternativos em royalties de projetos selecionados, com simulação de investimentos, compra de royalties, programa de indicação e suporte ao usuário. Os serviços são prestados "como estão", sem garantias de performance ou disponibilidade contínua.</p>

          <h2>6. Investimentos em Royalties</h2>
          <p>6.1 Características do Investimento:</p>
          <ul>
              <li>Valor mínimo por royalty: R$ 100,00;</li>
              <li>Retorno esperado: Até 5,5% ao mês, projetado com base em estimativas históricas, mas sujeito a variações de mercado e sem garantia;</li>
              <li>Prazo mínimo de investimento: 12 meses para o principal investido.</li>
          </ul>
          <p>6.2 Prazo de Carência: O investimento principal possui prazo mínimo de 12 meses para retirada, conforme regras da CVM. Os rendimentos podem ser sacados mensalmente, sujeito a disponibilidade, taxas administrativas e conformidade fiscal. A Invest Prime não é responsável por atrasos ou perdas decorrentes de fatores externos.</p>

          <h2>7. Programa de Indicação</h2>
          <p>7.1 Estrutura de Comissões:</p>
          <ul>
              <li>1º Nível: 1% sobre os rendimentos gerados pelos indicados diretos;</li>
              <li>2º Nível: 0,5% sobre os rendimentos gerados pelos indicados dos indicados diretos.</li>
          </ul>
          <p>7.2 Limitações: O programa é limitado a dois níveis e não constitui esquema de pirâmide financeira, conforme proibido pela Lei nº 1.521/1951. As comissões são calculadas apenas sobre rendimentos reais gerados e estão sujeitas a impostos. A Invest Prime reserva-se o direito de suspender o programa a qualquer momento.</p>

          <h2>8. Riscos do Investimento</h2>
          <p>Todo investimento na Plataforma envolve riscos significativos e não há garantia de retornos. O Usuário reconhece e aceita que:</p>
          <ul>
              <li>Os valores podem variar conforme condições de mercado, econômicas ou regulatórias;</li>
              <li>Não há garantia de rentabilidade ou recuperação do principal;</li>
              <li>O investimento possui prazo mínimo de permanência e liquidez limitada;</li>
              <li>Pode ocorrer perda total ou parcial do capital investido;</li>
              <li>A Invest Prime, seus colaboradores, diretores e afiliados não serão responsáveis por quaisquer perdas, danos ou prejuízos decorrentes de decisões de investimento do Usuário.</li>
          </ul>
          <p>O Usuário deve realizar sua própria due diligence e consultar profissionais qualificados (ex.: consultores financeiros independentes) antes de investir. A Invest Prime não fornece recomendações personalizadas e não assume responsabilidade por resultados negativos.</p>

          <h2>9. Direitos do Usuário</h2>
          <p>Conforme CDC, LGPD e CVM, o Usuário tem direito a:</p>
          <ul>
              <li>Informação clara e adequada sobre os serviços e riscos;</li>
              <li>Proteção contra práticas abusivas ou enganosas;</li>
              <li>Direito de arrependimento em 7 dias para transações online, conforme Art. 49 do CDC, com reembolso integral (exceto taxas processadas);</li>
              <li>Acesso, correção, exclusão, anonimização, portabilidade e revogação de consentimento para dados pessoais, conforme Art. 18 da LGPD;</li>
              <li>Receber relatórios periódicos sobre investimentos, conforme normas CVM.</li>
          </ul>
          <p>Para exercer esses direitos, contate o Encarregado de Proteção de Dados (DPO) em dpo@grupoinvestprimebrazil.com.br.</p>

          <h2>10. Responsabilidades do Usuário</h2>
          <ul>
              <li>Fornecer informações verdadeiras, completas e atualizadas, incluindo documentos comprobatórios;</li>
              <li>Manter a confidencialidade de suas credenciais de acesso;</li>
              <li>Usar a Plataforma exclusivamente para fins lícitos, em conformidade com estes Termos e a legislação aplicável;</li>
              <li>Não realizar atividades fraudulentas, manipulação de mercado ou violação de direitos de terceiros;</li>
              <li>Assumir todos os riscos associados aos investimentos e indenizar a Invest Prime por quaisquer danos causados por seu uso indevido da Plataforma.</li>
          </ul>
          <p>A violação destas responsabilidades pode resultar em suspensão ou cancelamento da conta, sem prejuízo de ações legais.</p>

          <h2>11. Política de Privacidade e Proteção de Dados (LGPD)</h2>
          <p>A Invest Prime trata dados pessoais com base nas seguintes hipóteses legais (Art. 7º da LGPD): consentimento do titular, execução de contrato, cumprimento de obrigação legal ou regulatória, e legítimo interesse (ex.: prevenção a fraudes). Dados coletados incluem: nome, e-mail, CPF, dados financeiros (ex.: dados de cartão para pagamentos processados por terceiros), endereço IP e dados de navegação.</p>
          <p><strong>Finalidades do Tratamento</strong>: Cadastro, execução de investimentos, envio de notificações, cumprimento fiscal (ex.: relatórios à Receita Federal), análise de risco e melhoria dos serviços. Os dados são armazenados por até 5 anos após o término da relação contratual, ou conforme exigido por lei.</p>
          <p><strong>Compartilhamento</strong>: Dados podem ser compartilhados com autoridades regulatórias (ex.: CVM, Receita Federal), processadores de pagamento (ex.: gateways certificados) e parceiros para fins estritamente necessários, sob cláusulas contratuais de confidencialidade. Não vendemos dados pessoais. Transferências internacionais ocorrem apenas para países com nível adequado de proteção ou com cláusulas contratuais padrão, conforme Resolução ANPD de 2025.</p>
          <p><strong>Direitos do Titular</strong>: Acesso, correção, exclusão, oposição, portabilidade e revogação de consentimento. Solicitações devem ser enviadas ao DPO em dpo@grupoinvestprimebrazil.com.br, com resposta em até 15 dias.</p>
          <p><strong>Incidentes de Segurança</strong>: Em caso de vazamento ou incidente, notificaremos os titulares afetados e a ANPD conforme Art. 48 da LGPD.</p>
          <p><strong>Cookies</strong>: Usamos cookies essenciais, de performance e analíticos para melhorar a experiência. Você pode gerenciá-los nas configurações do navegador ou revogar consentimento a qualquer momento.</p>

          <h2>12. Segurança dos Dados</h2>
          <p>Adotamos medidas técnicas e administrativas alinhadas às melhores práticas, incluindo criptografia (HTTPS/TLS), firewalls, auditorias regulares, controle de acesso e treinamento de colaboradores. No entanto, nenhum sistema é infalível, e a Invest Prime não se responsabiliza por violações causadas por terceiros ou falhas do Usuário (ex.: senhas fracas). O Usuário deve adotar práticas seguras, como uso de senhas fortes e autenticação de dois fatores.</p>

          <h2>13. Limitação de Responsabilidade</h2>
          <p>A Invest Prime, seus colaboradores, diretores, afiliados e fornecedores não serão responsáveis por danos indiretos, incidentais, consequenciais, especiais ou punitivos decorrentes do uso da Plataforma, incluindo perdas financeiras, lucros cessantes ou danos morais, mesmo se avisados da possibilidade. A responsabilidade total da Invest Prime está limitada ao valor efetivamente pago pelo Usuário nos últimos 12 meses. Esta limitação aplica-se na máxima extensão permitida pela lei brasileira, incluindo CDC e CVM.</p>

          <h2>14. Modificações dos Termos</h2>
          <p>A Invest Prime reserva-se o direito de modificar estes Termos a qualquer momento, com comunicação prévia aos Usuários via Plataforma ou e-mail. As alterações entram em vigor 30 dias após a notificação. O uso continuado da Plataforma após esse período implica aceitação das mudanças.</p>

          <h2>15. Resolução de Disputas</h2>
          <p>Qualquer controvérsia decorrente destes Termos será resolvida preferencialmente de forma amigável. Caso contrário, as partes elegem o foro da Comarca de São Paulo, SP, Brasil, com renúncia a qualquer outro, por mais privilegiado que seja.</p>

          <h2>16. Lei Aplicável</h2>
          <p>Estes Termos são regidos exclusivamente pelas leis da República Federativa do Brasil.</p>

          <h2>17. Contato</h2>
          <p>Para dúvidas, reclamações ou exercício de direitos, entre em contato:</p>
          <ul>
              <li>E-mail: contato@grupoinvestprimebrazil.com.br</li>
              <li>DPO: dpo@grupoinvestprimebrazil.com.br</li>
              <li>Telefone: (11) 9999-9999</li>
              <li>WhatsApp: (11) 9999-9999</li>
              <li>Endereço: Avenida Paulista, 1234, São Paulo, SP, CEP 01310-100</li>
          </ul>
        </section>
      </main>

      <footer className="bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="grid gap-8 md:grid-cols-4">
                <div className="space-y-4">
                    <Logo />
                    <p className="text-sm text-muted-foreground">Investimentos alternativos para um futuro sustentável</p>
                </div>
                <div className="footer-links">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Links Úteis</h4>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <Link href={`/${lang}`} className="text-sm text-muted-foreground hover:text-primary">Início</Link>
                        </li>
                        <li>
                            <Link href={`/${lang}/terms`} className="text-sm text-muted-foreground hover:text-primary">Termos de Uso</Link>
                        </li>
                        <li>
                           <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Política de Privacidade</Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contato</h4>
                    <ul className="mt-4 space-y-2">
                        <li className="text-sm text-muted-foreground">contato@grupoinvestprimebrazil.com.br</li>
                        <li className="text-sm text-muted-foreground">(11) 9999-9999</li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
              {currentYear && <p>&copy; {currentYear} Invest Prime. Todos os direitos reservados.</p>}
            </div>
        </div>
      </footer>
    </div>
  );
}

    
