import FormSection from "../FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export default function FormSectionExample() {
  return (
    <FormSection title="Dados do Cliente" icon={User}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome do Cliente *</Label>
          <Input id="nome" placeholder="Nome completo" />
        </div>
        <div>
          <Label htmlFor="cidade">Cidade/UF</Label>
          <Input id="cidade" placeholder="Ex: Recife/PE" />
        </div>
      </div>
    </FormSection>
  );
}
