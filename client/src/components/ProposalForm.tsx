import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, User, Zap, Package, Shield, DollarSign, FileDown, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import FormSection from "./FormSection";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";

const proposalSchema = z.object({
  nomeCliente: z.string().min(1, "Nome do cliente é obrigatório"),
  cidadeUf: z.string().optional(),
  dataProposta: z.date(),
  validadeDias: z.number().min(1, "Validade deve ser maior que 0"),
  potenciaKwp: z.number().min(0.01, "Potência é obrigatória"),
  geracaoEstimadaKwh: z.number().min(0.01, "Geração estimada é obrigatória"),
  areaUtilM2: z.number().optional(),
  modeloModulo: z.string().min(1, "Modelo do módulo é obrigatório"),
  quantidadeModulo: z.number().min(1, "Quantidade de módulos é obrigatória"),
  modeloInversor: z.string().min(1, "Modelo do inversor é obrigatório"),
  quantidadeInversor: z.number().min(1, "Quantidade de inversores é obrigatória"),
  outrosItens: z.string().optional(),
  garantiaServicos: z.string().default("Instalação – 1 ano"),
  garantiaModulosEquipamento: z.string().default("Equipamento – 15 anos"),
  garantiaModulosPerformance: z.string().default("Performance – 25 anos"),
  garantiaInversor: z.string().default("Inversor – 10 anos"),
  valorTotalAvista: z.number().min(0.01, "Valor total é obrigatório"),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

export default function ProposalForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      nomeCliente: "",
      cidadeUf: "",
      dataProposta: new Date(),
      validadeDias: 4,
      potenciaKwp: 0,
      geracaoEstimadaKwh: 0,
      areaUtilM2: undefined,
      modeloModulo: "",
      quantidadeModulo: 1,
      modeloInversor: "",
      quantidadeInversor: 1,
      outrosItens: "",
      garantiaServicos: "Instalação – 1 ano",
      garantiaModulosEquipamento: "Equipamento – 15 anos",
      garantiaModulosPerformance: "Performance – 25 anos",
      garantiaInversor: "Inversor – 10 anos",
      valorTotalAvista: 0,
    },
  });

  const createProposalMutation = useMutation({
    mutationFn: async (data: ProposalFormData) => {
      const payload = {
        ...data,
        dataProposta: format(data.dataProposta, "yyyy-MM-dd"),
        areaUtilM2: data.areaUtilM2 || null,
        cidadeUf: data.cidadeUf || null,
        outrosItens: data.outrosItens || null,
      };
      const response = await apiRequest("POST", "/api/proposals", payload);
      return response.json();
    },
    onSuccess: async (proposal) => {
      queryClient.invalidateQueries({ queryKey: ["/api/proposals"] });
      
      toast({
        title: "Proposta criada com sucesso!",
        description: `Iniciando download do PDF...`,
      });
      
      window.open(`/api/proposals/${proposal.id}/pdf`, "_blank");
      
      setLocation("/propostas");
    },
    onError: (error) => {
      console.error("Error creating proposal:", error);
      toast({
        title: "Erro ao criar proposta",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: ProposalFormData) => {
    createProposalMutation.mutate(data);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-2xl mx-auto px-6 md:px-12 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-page-title">Nova Proposta</h1>
        <p className="text-muted-foreground">
          Preencha os dados abaixo para gerar uma proposta comercial em PDF.
        </p>
      </div>

      <FormSection title="Dados do Cliente" icon={User}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nomeCliente">Nome do Cliente *</Label>
            <Input
              id="nomeCliente"
              placeholder="Nome completo do cliente"
              {...form.register("nomeCliente")}
              data-testid="input-nome-cliente"
            />
            {form.formState.errors.nomeCliente && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.nomeCliente.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cidadeUf">Cidade/UF</Label>
            <Input
              id="cidadeUf"
              placeholder="Ex: Recife/PE"
              {...form.register("cidadeUf")}
              data-testid="input-cidade-uf"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data da Proposta *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("dataProposta") && "text-muted-foreground"
                    )}
                    data-testid="button-date-picker"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("dataProposta") ? (
                      format(form.watch("dataProposta"), "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch("dataProposta")}
                    onSelect={(date) => date && form.setValue("dataProposta", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="validadeDias">Validade (dias) *</Label>
              <Input
                id="validadeDias"
                type="number"
                min={1}
                {...form.register("validadeDias", { valueAsNumber: true })}
                data-testid="input-validade-dias"
              />
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Dados Técnicos" icon={Zap}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="potenciaKwp">Potência Proposta (kWp) *</Label>
            <Input
              id="potenciaKwp"
              type="number"
              step="0.01"
              min={0}
              placeholder="Ex: 4.27"
              {...form.register("potenciaKwp", { valueAsNumber: true })}
              data-testid="input-potencia-kwp"
            />
            {form.formState.errors.potenciaKwp && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.potenciaKwp.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="geracaoEstimadaKwh">Geração Estimada (kWh/mês) *</Label>
            <Input
              id="geracaoEstimadaKwh"
              type="number"
              step="0.01"
              min={0}
              placeholder="Ex: 532"
              {...form.register("geracaoEstimadaKwh", { valueAsNumber: true })}
              data-testid="input-geracao-estimada"
            />
            {form.formState.errors.geracaoEstimadaKwh && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.geracaoEstimadaKwh.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="areaUtilM2">Área Útil (m²)</Label>
            <Input
              id="areaUtilM2"
              type="number"
              step="0.01"
              min={0}
              placeholder="Ex: 17"
              {...form.register("areaUtilM2", { valueAsNumber: true })}
              data-testid="input-area-util"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Equipamentos" icon={Package}>
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Módulos Fotovoltaicos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modeloModulo">Modelo *</Label>
                <Input
                  id="modeloModulo"
                  placeholder="Ex: Canadian Solar 550W"
                  {...form.register("modeloModulo")}
                  data-testid="input-modelo-modulo"
                />
                {form.formState.errors.modeloModulo && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.modeloModulo.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="quantidadeModulo">Quantidade *</Label>
                <Input
                  id="quantidadeModulo"
                  type="number"
                  min={1}
                  {...form.register("quantidadeModulo", { valueAsNumber: true })}
                  data-testid="input-quantidade-modulo"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Inversor(es)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modeloInversor">Modelo *</Label>
                <Input
                  id="modeloInversor"
                  placeholder="Ex: Growatt MIN 5000TL-X"
                  {...form.register("modeloInversor")}
                  data-testid="input-modelo-inversor"
                />
                {form.formState.errors.modeloInversor && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.modeloInversor.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="quantidadeInversor">Quantidade *</Label>
                <Input
                  id="quantidadeInversor"
                  type="number"
                  min={1}
                  {...form.register("quantidadeInversor", { valueAsNumber: true })}
                  data-testid="input-quantidade-inversor"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="outrosItens">Outros Itens (opcional)</Label>
            <Textarea
              id="outrosItens"
              placeholder="Estrutura de fixação, cabos, conectores, etc."
              className="min-h-24"
              {...form.register("outrosItens")}
              data-testid="input-outros-itens"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Garantias Incluídas" icon={Shield}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="garantiaServicos">Serviços</Label>
            <Input
              id="garantiaServicos"
              placeholder="Instalação – 1 ano"
              {...form.register("garantiaServicos")}
              data-testid="input-garantia-servicos"
            />
          </div>
          <div>
            <Label htmlFor="garantiaModulosEquipamento">Módulos (Equipamento)</Label>
            <Input
              id="garantiaModulosEquipamento"
              placeholder="Equipamento – 15 anos"
              {...form.register("garantiaModulosEquipamento")}
              data-testid="input-garantia-modulos-equip"
            />
          </div>
          <div>
            <Label htmlFor="garantiaModulosPerformance">Módulos (Performance)</Label>
            <Input
              id="garantiaModulosPerformance"
              placeholder="Performance – 25 anos"
              {...form.register("garantiaModulosPerformance")}
              data-testid="input-garantia-modulos-perf"
            />
          </div>
          <div>
            <Label htmlFor="garantiaInversor">Inversor</Label>
            <Input
              id="garantiaInversor"
              placeholder="Inversor – 10 anos"
              {...form.register("garantiaInversor")}
              data-testid="input-garantia-inversor"
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          A garantia dos equipamentos é de responsabilidade dos fabricantes.
        </p>
      </FormSection>

      <FormSection title="Valor do Investimento" icon={DollarSign}>
        <div>
          <Label htmlFor="valorTotalAvista">Valor Total à Vista *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
            <Input
              id="valorTotalAvista"
              type="number"
              step="0.01"
              min={0}
              className="pl-10"
              placeholder="0,00"
              {...form.register("valorTotalAvista", { valueAsNumber: true })}
              data-testid="input-valor-total"
            />
          </div>
          {form.formState.errors.valorTotalAvista && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.valorTotalAvista.message}</p>
          )}
          {form.watch("valorTotalAvista") > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Valor formatado: {formatCurrency(form.watch("valorTotalAvista"))}
            </p>
          )}
        </div>
      </FormSection>

      <div className="sticky bottom-0 bg-background border-t py-4 -mx-6 px-6 md:-mx-12 md:px-12 mt-8">
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto gap-2"
          disabled={createProposalMutation.isPending}
          data-testid="button-generate-pdf"
        >
          {createProposalMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando PDF...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              Gerar Proposta PDF
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
