import PDFDocument from "pdfkit";
import { Proposal } from "@shared/schema";

const COMPANY_NAME = "SolarPro Energia";
const COMPANY_ADDRESS = "Rua Dois, 25, Sala 101, Maranguape I, Paulista – PE. CEP 53444-380";
const COMPANY_PHONE = "(81) 99999-9999";
const COMPANY_EMAIL = "contato@solarpro.com.br";
const RESPONSIBLE_NAME = "Consultor Comercial";

const COLORS = {
  primary: "#33A851",
  secondary: "#6CCF7F",
  accent: "#FF9E32",
  dark: "#1E5130",
  text: "#2F3B3A",
  textLight: "#6C7A75",
  background: "#F3FBF5",
  white: "#ffffff",
  success: "#2ECC71",
  warning: "#F6A623",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("pt-BR", options);
}

function drawRoundedRect(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor: string
) {
  doc
    .save()
    .roundedRect(x, y, width, height, radius)
    .fill(fillColor)
    .restore();
}

function drawSectionHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  y: number,
  pageWidth: number
) {
  const leftMargin = 50;
  
  doc
    .save()
    .rect(leftMargin, y, 4, 24)
    .fill(COLORS.secondary);
  
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(title, leftMargin + 12, y + 5);
  
  doc.restore();
  return y + 35;
}

function drawInfoCard(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  title: string,
  value: string,
  subtitle?: string
) {
  const cardHeight = 70;
  
  drawRoundedRect(doc, x, y, width, cardHeight, 8, COLORS.background);
  
  doc
    .rect(x, y, width, 4)
    .fill(COLORS.secondary);
  
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text(title.toUpperCase(), x + 12, y + 16, { width: width - 24 });
  
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(value, x + 12, y + 32, { width: width - 24 });
  
  if (subtitle) {
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(subtitle, x + 12, y + 54, { width: width - 24 });
  }
  
  return y + cardHeight + 15;
}

export function generateProposalPDF(proposal: Proposal): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 0, bottom: 40, left: 50, right: 50 },
    bufferPages: true,
  });

  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 100;
  const leftMargin = 50;

  // ============ PAGE 1: COVER ============
  
  doc
    .rect(0, 0, pageWidth, 280)
    .fill(COLORS.primary);
  
  doc
    .rect(0, 260, pageWidth, 40)
    .fill(COLORS.secondary);
  
  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor(COLORS.white)
    .text(COMPANY_NAME.toUpperCase(), leftMargin, 50);
  
  doc
    .fontSize(42)
    .font("Helvetica-Bold")
    .fillColor(COLORS.white)
    .text("PROPOSTA", leftMargin, 120);
  
  doc
    .fontSize(42)
    .font("Helvetica-Bold")
    .fillColor(COLORS.accent)
    .text("COMERCIAL", leftMargin, 165);
  
  doc
    .fontSize(14)
    .font("Helvetica")
    .fillColor(COLORS.white)
    .text(`Sistema Fotovoltaico`, leftMargin, 230);
  
  let currentY = 320;
  
  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 100, 10, COLORS.background);
  
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("CLIENTE", leftMargin + 20, currentY + 20);
  
  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(proposal.nomeCliente, leftMargin + 20, currentY + 38);
  
  if (proposal.cidadeUf) {
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(proposal.cidadeUf, leftMargin + 20, currentY + 68);
  }
  
  const dateBoxX = pageWidth - 200;
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("DATA", dateBoxX, currentY + 20);
  
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(formatDate(proposal.dataProposta), dateBoxX, currentY + 38);
  
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("VALIDADE", dateBoxX, currentY + 60);
  
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(`${proposal.validadeDias} dias`, dateBoxX, currentY + 78);
  
  currentY += 130;
  
  // Mission section
  currentY = drawSectionHeader(doc, "NOSSA MISSÃO E COMPROMISSO", currentY, contentWidth);
  
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(
      "Somos uma empresa especializada no desenvolvimento de soluções de energia fotovoltaica para residências, empresas, indústrias e agronegócios.",
      leftMargin,
      currentY,
      { width: contentWidth, align: "justify", lineGap: 4 }
    );
  
  currentY = doc.y + 12;
  
  doc
    .text(
      "Nosso compromisso é garantir a produção de energia e performance do seu sistema, oferecendo soluções exclusivas de financiamento para viabilizar a implementação do seu sistema fotovoltaico.",
      leftMargin,
      currentY,
      { width: contentWidth, align: "justify", lineGap: 4 }
    );
  
  currentY = doc.y + 30;
  
  // How it works
  currentY = drawSectionHeader(doc, "COMO FUNCIONA A ENERGIA SOLAR", currentY, contentWidth);
  
  const steps = [
    { title: "Painéis Solares", desc: "Os painéis captam a energia do Sol e a transformam em energia elétrica." },
    { title: "Inversor", desc: "Converte a energia gerada em formato idêntico ao fornecido pela distribuidora." },
    { title: "Quadro de Distribuição", desc: "A energia é conectada para uso em qualquer equipamento." },
    { title: "Medidor Bidirecional", desc: "Mede o consumo e a energia injetada na rede." },
    { title: "Rede de Distribuição", desc: "Absorve excedentes e fornece energia quando necessário." },
  ];
  
  steps.forEach((step, index) => {
    const stepY = currentY + index * 32;
    
    doc
      .save()
      .circle(leftMargin + 10, stepY + 8, 10)
      .fill(COLORS.secondary);
    
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor(COLORS.white)
      .text((index + 1).toString(), leftMargin + 6, stepY + 4);
    
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor(COLORS.dark)
      .text(step.title, leftMargin + 30, stepY);
    
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(step.desc, leftMargin + 30, stepY + 14, { width: contentWidth - 40 });
    
    doc.restore();
  });

  // ============ PAGE 2: TECHNICAL SPECS ============
  doc.addPage();
  
  doc
    .rect(0, 0, pageWidth, 60)
    .fill(COLORS.primary);
  
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor(COLORS.white)
    .text("DIMENSIONAMENTO DO SISTEMA", leftMargin, 22);
  
  currentY = 90;
  
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(
      "O sistema foi dimensionado baseando-se na análise das imagens por satélite e em seu consumo energético mensal, adotando-se como premissa que a área disponível é adequada para a instalação.",
      leftMargin,
      currentY,
      { width: contentWidth, align: "justify", lineGap: 4 }
    );
  
  currentY = doc.y + 25;
  
  // Technical cards
  const cardWidth = (contentWidth - 20) / 3;
  
  drawInfoCard(
    doc,
    leftMargin,
    currentY,
    cardWidth,
    "Potência Proposta",
    `${proposal.potenciaKwp.toFixed(2)} kWp`,
    "Capacidade do sistema"
  );
  
  drawInfoCard(
    doc,
    leftMargin + cardWidth + 10,
    currentY,
    cardWidth,
    "Geração Estimada",
    `${proposal.geracaoEstimadaKwh.toFixed(0)} kWh`,
    "Por mês"
  );
  
  drawInfoCard(
    doc,
    leftMargin + (cardWidth + 10) * 2,
    currentY,
    cardWidth,
    "Área Útil",
    `${proposal.areaUtilM2?.toFixed(0) || "—"} m²`,
    "Espaço necessário"
  );
  
  currentY += 100;
  
  // Equipment section
  currentY = drawSectionHeader(doc, "EQUIPAMENTOS PRINCIPAIS", currentY, contentWidth);
  
  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 30, 5, COLORS.primary);
  
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.white)
    .text("ITEM", leftMargin + 15, currentY + 10)
    .text("MODELO", leftMargin + 140, currentY + 10)
    .text("QTD", leftMargin + contentWidth - 50, currentY + 10);
  
  currentY += 35;
  
  // Modules row
  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 35, 3, COLORS.background);
  
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text("Módulos Fotovoltaicos", leftMargin + 15, currentY + 12);
  
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(proposal.modeloModulo, leftMargin + 140, currentY + 12, { width: 280 });
  
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.secondary)
    .text(proposal.quantidadeModulo.toString(), leftMargin + contentWidth - 50, currentY + 12);
  
  currentY += 40;
  
  // Inverter row
  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 35, 3, COLORS.white);
  
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text("Inversor(es)", leftMargin + 15, currentY + 12);
  
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(proposal.modeloInversor, leftMargin + 140, currentY + 12, { width: 280 });
  
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.secondary)
    .text(proposal.quantidadeInversor.toString(), leftMargin + contentWidth - 50, currentY + 12);
  
  currentY += 55;
  
  // Warranty section
  currentY = drawSectionHeader(doc, "GARANTIAS INCLUÍDAS", currentY, contentWidth);
  
  const warrantyWidth = (contentWidth - 20) / 3;
  
  // Services warranty
  drawRoundedRect(doc, leftMargin, currentY, warrantyWidth, 80, 8, COLORS.background);
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("NOSSOS SERVIÇOS", leftMargin + 12, currentY + 12, { width: warrantyWidth - 24 });
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text("Instalação", leftMargin + 12, currentY + 30);
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor(COLORS.secondary)
    .text(proposal.garantiaServicos, leftMargin + 12, currentY + 50);
  
  // Modules warranty
  drawRoundedRect(doc, leftMargin + warrantyWidth + 10, currentY, warrantyWidth, 80, 8, COLORS.background);
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("MÓDULOS FOTOVOLTAICOS", leftMargin + warrantyWidth + 22, currentY + 12, { width: warrantyWidth - 24 });
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.dark)
    .text(`Equipamento: ${proposal.garantiaModulosEquipamento}`, leftMargin + warrantyWidth + 22, currentY + 35);
  doc
    .text(`Desempenho: ${proposal.garantiaModulosPerformance}`, leftMargin + warrantyWidth + 22, currentY + 55);
  
  // Inverter warranty
  drawRoundedRect(doc, leftMargin + (warrantyWidth + 10) * 2, currentY, warrantyWidth, 80, 8, COLORS.background);
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("INVERSORES", leftMargin + (warrantyWidth + 10) * 2 + 12, currentY + 12, { width: warrantyWidth - 24 });
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor(COLORS.secondary)
    .text(proposal.garantiaInversor, leftMargin + (warrantyWidth + 10) * 2 + 12, currentY + 45);
  
  currentY += 100;
  
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("Obs: A garantia dos equipamentos é de responsabilidade dos fabricantes.", leftMargin, currentY, {
      width: contentWidth,
      align: "center",
    });
  
  currentY += 35;
  
  // Timeline section
  currentY = drawSectionHeader(doc, "CRONOGRAMA DE EXECUÇÃO", currentY, contentWidth);
  
  const timelineSteps = [
    { day: "Dia A", title: "Aprovação da Proposta", desc: "Comercial" },
    { day: "Dia D", title: "Validação Técnica", desc: "Assinatura do contrato" },
    { day: "D+30", title: "Preparação", desc: "Encomenda e infraestrutura" },
    { day: "D+60", title: "Instalação", desc: "Montagem do sistema" },
    { day: "D+90", title: "Conclusão", desc: "Testes e homologação" },
  ];
  
  const stepWidth = contentWidth / 5;
  
  timelineSteps.forEach((step, index) => {
    const stepX = leftMargin + index * stepWidth;
    
    doc
      .save()
      .circle(stepX + stepWidth / 2, currentY + 15, 18)
      .fill(index === 0 ? COLORS.secondary : COLORS.background);
    
    doc
      .fontSize(8)
      .font("Helvetica-Bold")
      .fillColor(index === 0 ? COLORS.white : COLORS.secondary)
      .text(step.day, stepX, currentY + 10, { width: stepWidth, align: "center" });
    
    if (index < timelineSteps.length - 1) {
      doc
        .moveTo(stepX + stepWidth / 2 + 20, currentY + 15)
        .lineTo(stepX + stepWidth - 5, currentY + 15)
        .strokeColor(COLORS.accent)
        .lineWidth(2)
        .stroke();
    }
    
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .fillColor(COLORS.dark)
      .text(step.title, stepX, currentY + 40, { width: stepWidth, align: "center" });
    
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(step.desc, stepX, currentY + 55, { width: stepWidth, align: "center" });
    
    doc.restore();
  });

  // ============ PAGE 3: INVESTMENT ============
  doc.addPage();
  
  doc
    .rect(0, 0, pageWidth, 60)
    .fill(COLORS.primary);
  
  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor(COLORS.white)
    .text("INVESTIMENTO E CONDIÇÕES", leftMargin, 22);
  
  currentY = 90;
  
  // Investment highlight box
  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 120, 12, COLORS.background);
  
  doc
    .rect(leftMargin, currentY, 6, 120)
    .fill(COLORS.secondary);
  
  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("VALOR DO INVESTIMENTO", leftMargin + 25, currentY + 25);
  
  doc
    .fontSize(36)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(formatCurrency(proposal.valorTotalAvista), leftMargin + 25, currentY + 50);
  
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("Pagamento à vista", leftMargin + 25, currentY + 92);
  
  currentY += 150;
  
  // What's included
  currentY = drawSectionHeader(doc, "O QUE ESTÁ INCLUSO", currentY, contentWidth);
  
  const includedItems = [
    "Todos os equipamentos descritos nesta proposta",
    "Projeto técnico completo",
    "Materiais e estruturas de fixação",
    "Mão de obra especializada para instalação",
    "Homologação junto à distribuidora de energia",
    "Suporte técnico durante todo o processo",
  ];
  
  includedItems.forEach((item, index) => {
    const itemY = currentY + index * 28;
    
    doc
      .save()
      .circle(leftMargin + 8, itemY + 6, 6)
      .fill(COLORS.success);
    
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor(COLORS.white)
      .text("✓", leftMargin + 4, itemY + 2);
    
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor(COLORS.text)
      .text(item, leftMargin + 25, itemY);
    
    doc.restore();
  });
  
  currentY += includedItems.length * 28 + 30;
  
  // Financing section
  currentY = drawSectionHeader(doc, "SOLUÇÕES FINANCEIRAS", currentY, contentWidth);
  
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(
      "Temos parcerias com diversos bancos como Santander, BV Financeira, Sol Fácil, Credisolaris, dentre outros. Faça uma análise da sua taxa real conosco.",
      leftMargin,
      currentY,
      { width: contentWidth, align: "justify", lineGap: 4 }
    );
  
  currentY = doc.y + 40;
  
  // Validity section
  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 70, 10, COLORS.warning + "15");
  
  doc
    .rect(leftMargin, currentY, contentWidth, 4)
    .fill(COLORS.warning);
  
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text("VALIDADE DA PROPOSTA", leftMargin + 20, currentY + 18);
  
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(
      `Esta proposta é válida em todos os seus termos por ${proposal.validadeDias} dias corridos contados a partir da data de emissão (${formatDate(proposal.dataProposta)}).`,
      leftMargin + 20,
      currentY + 38,
      { width: contentWidth - 40 }
    );
  
  currentY += 100;
  
  // Signature section
  currentY = drawSectionHeader(doc, "ACEITE DA PROPOSTA", currentY, contentWidth);
  
  const signatureWidth = (contentWidth - 40) / 2;
  
  doc
    .moveTo(leftMargin, currentY + 50)
    .lineTo(leftMargin + signatureWidth, currentY + 50)
    .strokeColor(COLORS.textLight)
    .lineWidth(1)
    .stroke();
  
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(proposal.nomeCliente, leftMargin, currentY + 58, { width: signatureWidth, align: "center" });
  
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("Cliente", leftMargin, currentY + 74, { width: signatureWidth, align: "center" });
  
  doc
    .moveTo(leftMargin + signatureWidth + 40, currentY + 50)
    .lineTo(leftMargin + contentWidth, currentY + 50)
    .strokeColor(COLORS.textLight)
    .lineWidth(1)
    .stroke();
  
  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(RESPONSIBLE_NAME, leftMargin + signatureWidth + 40, currentY + 58, { width: signatureWidth, align: "center" });
  
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("Responsável Comercial", leftMargin + signatureWidth + 40, currentY + 74, { width: signatureWidth, align: "center" });

  // ============ FOOTER ON ALL PAGES ============
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    
    const footerY = doc.page.height - 35;
    
    doc
      .rect(0, footerY - 5, pageWidth, 40)
      .fill(COLORS.dark);
    
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor(COLORS.white)
      .text(
        `${COMPANY_NAME} | ${COMPANY_ADDRESS}`,
        leftMargin,
        footerY + 5,
        { width: contentWidth - 60, align: "left" }
      );
    
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor(COLORS.white)
      .text(
        `${i + 1} / ${pages.count}`,
        pageWidth - 80,
        footerY + 5,
        { width: 30, align: "right" }
      );
  }

  return doc;
}
