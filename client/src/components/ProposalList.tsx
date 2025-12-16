import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileDown, Search, FileText, Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Proposal } from "@shared/schema";

export default function ProposalList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: proposals = [], isLoading } = useQuery<Proposal[]>({
    queryKey: ["/api/proposals"],
  });

  const filteredProposals = proposals.filter((proposal) =>
    proposal.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleDownload = (proposal: Proposal) => {
    toast({
      title: "Download iniciado",
      description: `Baixando proposta de ${proposal.nomeCliente}`,
    });
    window.open(`/api/proposals/${proposal.id}/pdf`, "_blank");
  };

  const formatDateString = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const formatDateStringShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "dd/MM/yy", { locale: ptBR });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-10 w-full mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-proposals-title">Propostas</h1>
          <p className="text-muted-foreground mt-1">
            {filteredProposals.length} proposta{filteredProposals.length !== 1 ? "s" : ""} encontrada{filteredProposals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/">
          <Button className="gap-2" data-testid="button-new-proposal">
            <Plus className="h-4 w-4" />
            Nova Proposta
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome do cliente..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="input-search"
        />
      </div>

      {filteredProposals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2" data-testid="text-empty-state">
              {searchTerm ? "Nenhuma proposta encontrada" : "Nenhuma proposta ainda"}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm
                ? "Tente buscar por outro termo."
                : "Crie sua primeira proposta para começar."}
            </p>
            {!searchTerm && (
              <Link href="/">
                <Button className="gap-2" data-testid="button-create-first">
                  <Plus className="h-4 w-4" />
                  Criar Primeira Proposta
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden lg:block">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium text-sm uppercase tracking-wide">Cliente</TableHead>
                    <TableHead className="font-medium text-sm uppercase tracking-wide">Cidade/UF</TableHead>
                    <TableHead className="font-medium text-sm uppercase tracking-wide">Data</TableHead>
                    <TableHead className="font-medium text-sm uppercase tracking-wide text-right">Potência</TableHead>
                    <TableHead className="font-medium text-sm uppercase tracking-wide text-right">Valor</TableHead>
                    <TableHead className="font-medium text-sm uppercase tracking-wide text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id} data-testid={`row-proposal-${proposal.id}`}>
                      <TableCell className="font-medium" data-testid={`text-cliente-${proposal.id}`}>
                        {proposal.nomeCliente}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {proposal.cidadeUf || "-"}
                      </TableCell>
                      <TableCell>
                        {formatDateString(proposal.dataProposta)}
                      </TableCell>
                      <TableCell className="text-right">
                        {proposal.potenciaKwp.toFixed(2)} kWp
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(proposal.valorTotalAvista)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownload(proposal)}
                          data-testid={`button-download-${proposal.id}`}
                        >
                          <FileDown className="h-4 w-4" />
                          Baixar PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="lg:hidden space-y-4">
            {filteredProposals.map((proposal) => (
              <Card key={proposal.id} data-testid={`card-proposal-${proposal.id}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <h3 className="font-medium">{proposal.nomeCliente}</h3>
                      <p className="text-sm text-muted-foreground">
                        {proposal.cidadeUf || "Sem localização"}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDateStringShort(proposal.dataProposta)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center gap-4 mb-4">
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {proposal.potenciaKwp.toFixed(2)} kWp
                      </span>
                      <span className="font-medium">
                        {formatCurrency(proposal.valorTotalAvista)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => handleDownload(proposal)}
                  >
                    <FileDown className="h-4 w-4" />
                    Baixar PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
