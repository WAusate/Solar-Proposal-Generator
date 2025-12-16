import PDFDocument from "pdfkit";
import { Proposal } from "@shared/schema";

const COMPANY_NAME = "SolarPro Energia";
const COMPANY_ADDRESS = "Jaboatão dos Guararapes, PE";
const COMPANY_PHONE = "(81) 99999-9999";
const COMPANY_EMAIL = "contato@solarpro.com.br";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

export function generateProposalPDF(proposal: Proposal): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });

  const pageWidth = doc.page.width - 100;

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("Proposta Comercial", { align: "center" });

  doc.moveDown(0.5);
  doc
    .fontSize(14)
    .font("Helvetica")
    .fillColor("#666666")
    .text(COMPANY_NAME, { align: "center" });

  doc.moveDown(2);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#000000")
    .text("DADOS DO CLIENTE", { underline: true });
  doc.moveDown(0.5);

  doc.font("Helvetica").fontSize(11);
  doc.text(`Cliente: ${proposal.nomeCliente}`);
  if (proposal.cidadeUf) {
    doc.text(`Localização: ${proposal.cidadeUf}`);
  }
  doc.text(`Data da Proposta: ${formatDate(proposal.dataProposta)}`);
  doc.text(`Validade: ${proposal.validadeDias} dias corridos`);

  doc.moveDown(1.5);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("DADOS TÉCNICOS DO SISTEMA", { underline: true });
  doc.moveDown(0.5);

  doc.font("Helvetica").fontSize(11);
  doc.text(`${proposal.potenciaKwp.toFixed(2)} kWp – Potência Proposta`);
  doc.text(`${proposal.geracaoEstimadaKwh.toFixed(0)} kWh/mês – Geração Estimada`);
  if (proposal.areaUtilM2) {
    doc.text(`${proposal.areaUtilM2.toFixed(0)} m² – Área Útil`);
  }

  doc.moveDown(1.5);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("EQUIPAMENTOS PRINCIPAIS", { underline: true });
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const col1 = 50;
  const col2 = 200;
  const col3 = 450;
  const rowHeight = 25;

  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("ITEM", col1, tableTop);
  doc.text("MODELO", col2, tableTop);
  doc.text("QTD", col3, tableTop);

  doc
    .moveTo(col1, tableTop + 15)
    .lineTo(col1 + pageWidth, tableTop + 15)
    .stroke();

  let currentY = tableTop + rowHeight;

  doc.font("Helvetica").fontSize(10);
  doc.text("Módulos Fotovoltaicos", col1, currentY);
  doc.text(proposal.modeloModulo, col2, currentY);
  doc.text(proposal.quantidadeModulo.toString(), col3, currentY);

  currentY += rowHeight;
  doc.text("Inversor(es)", col1, currentY);
  doc.text(proposal.modeloInversor, col2, currentY);
  doc.text(proposal.quantidadeInversor.toString(), col3, currentY);

  if (proposal.outrosItens) {
    currentY += rowHeight;
    doc.text("Outros Itens", col1, currentY);
    doc.text(proposal.outrosItens.substring(0, 50), col2, currentY);
    doc.text("-", col3, currentY);
  }

  doc.y = currentY + rowHeight + 10;
  doc.moveDown(1.5);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("GARANTIAS INCLUÍDAS", { underline: true });
  doc.moveDown(0.5);

  doc.font("Helvetica").fontSize(10);

  const garantiaTableTop = doc.y;

  doc.font("Helvetica-Bold");
  doc.text("NOSSOS SERVIÇOS", col1, garantiaTableTop);
  doc.text("MÓDULOS FOTOVOLTAICOS", col2, garantiaTableTop);
  doc.text("INVERSORES", col3, garantiaTableTop);

  doc
    .moveTo(col1, garantiaTableTop + 15)
    .lineTo(col1 + pageWidth, garantiaTableTop + 15)
    .stroke();

  const garantiaRow1 = garantiaTableTop + 25;
  doc.font("Helvetica").fontSize(9);
  doc.text(proposal.garantiaServicos, col1, garantiaRow1, { width: 130 });
  doc.text(`EQUIPAMENTO: ${proposal.garantiaModulosEquipamento}`, col2, garantiaRow1, { width: 200 });
  doc.text(proposal.garantiaInversor, col3, garantiaRow1, { width: 100 });

  const garantiaRow2 = garantiaRow1 + 20;
  doc.text("", col1, garantiaRow2);
  doc.text(`DESEMPENHO: ${proposal.garantiaModulosPerformance}`, col2, garantiaRow2, { width: 200 });

  doc.y = garantiaRow2 + 30;
  doc.moveDown(0.5);
  doc
    .fontSize(9)
    .fillColor("#666666")
    .text("A garantia dos equipamentos é de responsabilidade dos fabricantes.", { align: "center" });

  doc.moveDown(2);
  doc.fillColor("#000000");

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("CONDIÇÕES COMERCIAIS", { underline: true });
  doc.moveDown(0.5);

  const investimentoY = doc.y;
  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("INVESTIMENTO", col1, investimentoY);
  doc.text("VALOR", col2, investimentoY);

  doc
    .moveTo(col1, investimentoY + 15)
    .lineTo(col1 + pageWidth, investimentoY + 15)
    .stroke();

  const valorRow = investimentoY + 25;
  doc.font("Helvetica").fontSize(11);
  doc.text("À vista", col1, valorRow);
  doc.font("Helvetica-Bold").fontSize(14);
  doc.text(formatCurrency(proposal.valorTotalAvista), col2, valorRow);

  doc.y = valorRow + 40;
  doc.moveDown(2);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor("#000000")
    .text("CRONOGRAMA DE EXECUÇÃO", { underline: true });
  doc.moveDown(0.5);

  doc.font("Helvetica").fontSize(10);
  const cronogramaItems = [
    "A: Aprovação da proposta",
    "D: Validação do projeto pelo setor técnico e assinatura de contrato",
    "D+30 dias: Encomenda dos equipamentos e preparação da infraestrutura",
    "D+60 dias: Montagem do sistema",
    "D+90 dias: Testes e homologação na distribuidora",
  ];

  cronogramaItems.forEach((item) => {
    doc.text(`• ${item}`);
    doc.moveDown(0.3);
  });

  doc.moveDown(2);

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("SOBRE NÓS", { underline: true });
  doc.moveDown(0.5);

  doc.font("Helvetica").fontSize(10);
  doc.text(
    "Somos uma empresa especializada no desenvolvimento de soluções de energia fotovoltaica. " +
    "Nosso compromisso é oferecer sistemas de alta qualidade, com equipamentos de primeira linha " +
    "e instalação profissional, garantindo economia e sustentabilidade para nossos clientes.",
    { align: "justify" }
  );

  doc.moveDown(1);
  doc.text(
    "Contamos com parcerias com os principais bancos para análise de financiamento, " +
    "facilitando o acesso à energia solar para residências e empresas.",
    { align: "justify" }
  );

  const footerY = doc.page.height - 80;
  doc
    .fontSize(9)
    .fillColor("#666666")
    .text(
      `${COMPANY_NAME} | ${COMPANY_ADDRESS}`,
      50,
      footerY,
      { align: "center", width: pageWidth }
    );
  doc.text(
    `${COMPANY_PHONE} | ${COMPANY_EMAIL}`,
    50,
    footerY + 12,
    { align: "center", width: pageWidth }
  );

  doc
    .fontSize(8)
    .text(
      `Esta proposta é válida em todos os seus termos por ${proposal.validadeDias} dias corridos contados a partir da data de envio.`,
      50,
      footerY + 30,
      { align: "center", width: pageWidth }
    );

  return doc;
}
