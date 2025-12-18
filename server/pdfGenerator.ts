import PDFDocument from "pdfkit";
import { Proposal } from "@shared/schema";

const COMPANY_NAME = "Átomo Energia e Soluções Ltda";
const COMPANY_ADDRESS = "Rua Dois, 25, Sala 101, Maranguape I, Paulista – PE. CEP 53444-380";
const COMPANY_PHONE = "(81) 99750-3041";
const COMPANY_EMAIL = "contato@atomosolar.com.br";
const RESPONSIBLE_NAME = "Ataulfo Dávila";

const COLORS = {
  primary: "#32B350",
  secondary: "#7AD66F",
  accent: "#FFA33A",
  dark: "#1D4B2A",
  text: "#24372E",
  textLight: "#6F8175",
  background: "#F4FBF4",
  white: "#ffffff",
  success: "#2ECC71",
  warning: "#FFC857",
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
    .text(title, leftMargin + 12, y + 5, { lineBreak: false });

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

  doc.rect(x, y, width, 4).fill(COLORS.secondary);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text(title.toUpperCase(), x + 12, y + 16, { width: width - 24, lineBreak: false });

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(value, x + 12, y + 32, { width: width - 24, lineBreak: false });

  if (subtitle) {
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(subtitle, x + 12, y + 54, { width: width - 24, lineBreak: false });
  }

  return y + cardHeight + 15;
}

function drawFooter(
  doc: PDFKit.PDFDocument,
  pageWidth: number
) {
  const footerY = doc.page.height - 35;
  doc.rect(0, footerY - 5, pageWidth, 40).fill(COLORS.dark);
}

export function generateProposalPDF(proposal: Proposal): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "A4",
    autoFirstPage: true,
    bufferPages: true, // Importante para controlar as páginas
  });

  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 100;
  const leftMargin = 50;

  // ============ PAGE 1: COVER ============

  const coverImagePath = "./server/assets/capa-corel.png";
  doc.image(coverImagePath, 0, 0, { width: pageWidth });

  const leftMarginCover = 25;

  let currentY = 520;

  doc
    .font("Helvetica-Bold")
    .fontSize(30)
    .fillColor(COLORS.dark)
    .text("PROPOSTA", leftMarginCover, currentY, { lineBreak: false });

  currentY += 30;

  doc
    .font("Helvetica-Bold")
    .fontSize(30)
    .fillColor(COLORS.primary)
    .text("COMERCIAL", leftMarginCover, currentY, { lineBreak: false });

  currentY += 55;

  const cardsY = currentY;
  const cardHeight = 90;
  const gapBetweenCards = 24;

  const totalCardsWidth = pageWidth - leftMarginCover - 60;
  const singleCardWidth = (totalCardsWidth - gapBetweenCards) / 2;

  // CARD 1 – CLIENTE
  drawRoundedRect(
    doc,
    leftMarginCover,
    cardsY,
    singleCardWidth,
    cardHeight,
    14,
    COLORS.background
  );

  let infoX = leftMarginCover + 18;
  let infoY = cardsY + 16;

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(COLORS.textLight)
    .text("CLIENTE", infoX, infoY, { lineBreak: false });

  infoY += 14;

  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(proposal.nomeCliente, infoX, infoY, { width: singleCardWidth - 36, lineBreak: false });

  infoY += 20;

  if (proposal.cidadeUf) {
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(proposal.cidadeUf, infoX, infoY, { lineBreak: false });
  }

  // CARD 2 – DATA / VALIDADE
  const secondCardX = leftMarginCover + singleCardWidth + gapBetweenCards;

  drawRoundedRect(
    doc,
    secondCardX,
    cardsY,
    singleCardWidth,
    cardHeight,
    14,
    COLORS.background
  );

  infoX = secondCardX + 18;
  infoY = cardsY + 16;

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(COLORS.textLight)
    .text("DATA", infoX, infoY, { lineBreak: false });

  infoY += 14;

  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(formatDate(proposal.dataProposta), infoX, infoY, { lineBreak: false });

  infoY += 24;

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(COLORS.textLight)
    .text("VALIDADE", infoX, infoY, { lineBreak: false });

  infoY += 14;

  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(`${proposal.validadeDias} dias`, infoX, infoY, { lineBreak: false });

  // Logo
  const logoPath = "./server/assets/Logo Átomo Solar.png";
  doc.image(logoPath, pageWidth - 170, doc.page.height - 120, { width: 120 });

  // Rodapé página 1
  drawFooter(doc, pageWidth);

  // ============ PAGE 2: TECHNICAL SPECS ============

  doc.addPage();

  currentY = 0;

  doc.rect(0, 0, pageWidth, 60).fill(COLORS.primary);

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor(COLORS.white)
    .text("DIMENSIONAMENTO DO SISTEMA", leftMargin, 22, { lineBreak: false });

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

  currentY = 145; // Posição fixa após o texto

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

  currentY = 250;

  currentY = drawSectionHeader(doc, "EQUIPAMENTOS PRINCIPAIS", currentY, contentWidth);

  const tableX = leftMargin;
  const colItemWidth = 180;
  const colModelWidth = contentWidth - colItemWidth - 80;
  const colQtyWidth = 60;
  const rowHeight = 26;

  drawRoundedRect(doc, tableX, currentY, contentWidth, rowHeight, 6, COLORS.background);

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(COLORS.textLight)
    .text("ITEM", tableX + 12, currentY + 8, { lineBreak: false });

  doc.text("MODELO", tableX + colItemWidth + 12, currentY + 8, { lineBreak: false });

  doc.text("QTD", tableX + colItemWidth + colModelWidth + 12, currentY + 8, { lineBreak: false });

  currentY += rowHeight + 4;

  drawRoundedRect(doc, tableX, currentY, contentWidth, rowHeight, 4, COLORS.white);

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text("Módulos Fotovoltaicos", tableX + 12, currentY + 8, { lineBreak: false });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(proposal.modeloModulo, tableX + colItemWidth + 12, currentY + 8, { lineBreak: false });

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(proposal.quantidadeModulo.toString(), tableX + colItemWidth + colModelWidth + 12, currentY + 8, { lineBreak: false });

  currentY += rowHeight + 2;

  drawRoundedRect(doc, tableX, currentY, contentWidth, rowHeight, 4, COLORS.background);

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text("Inversor(es)", tableX + 12, currentY + 8, { lineBreak: false });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(proposal.modeloInversor, tableX + colItemWidth + 12, currentY + 8, { lineBreak: false });

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(proposal.quantidadeInversor.toString(), tableX + colItemWidth + colModelWidth + 12, currentY + 8, { lineBreak: false });

  currentY += rowHeight + 30;

  currentY = drawSectionHeader(doc, "GARANTIAS INCLUÍDAS", currentY, contentWidth);

  const warrantyWidth = (contentWidth - 20) / 3;

  drawRoundedRect(doc, leftMargin, currentY, warrantyWidth, 80, 8, COLORS.background);

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("SERVIÇOS", leftMargin + 12, currentY + 12, { lineBreak: false });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.dark)
    .text(proposal.garantiaServicos, leftMargin + 12, currentY + 32, { width: warrantyWidth - 24, lineBreak: false });

  const modsX = leftMargin + warrantyWidth + 10;

  drawRoundedRect(doc, modsX, currentY, warrantyWidth, 80, 8, COLORS.background);

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("MÓDULOS FOTOVOLTAICOS", modsX + 12, currentY + 12, { lineBreak: false });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.dark)
    .text(proposal.garantiaModulosEquipamento, modsX + 12, currentY + 32, { width: warrantyWidth - 24, lineBreak: false });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.dark)
    .text(proposal.garantiaModulosPerformance, modsX + 12, currentY + 48, { width: warrantyWidth - 24, lineBreak: false });

  const invX = leftMargin + (warrantyWidth + 10) * 2;

  drawRoundedRect(doc, invX, currentY, warrantyWidth, 80, 8, COLORS.background);

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("INVERSORES", invX + 12, currentY + 12, { lineBreak: false });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.dark)
    .text(proposal.garantiaInversor, invX + 12, currentY + 32, { width: warrantyWidth - 24, lineBreak: false });

  currentY += 100;

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text(
      "A garantia dos equipamentos é de responsabilidade dos fabricantes.",
      leftMargin,
      currentY,
      { width: contentWidth, align: "center", lineBreak: false }
    );

  currentY += 45;

  currentY = drawSectionHeader(doc, "CRONOGRAMA DE EXECUÇÃO", currentY, contentWidth);

  const timelineSteps = [
    { day: "Dia A", title: "Aprovação da Proposta Comercial", desc: "" },
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
      .text(step.day, stepX, currentY + 10, { width: stepWidth, align: "center", lineBreak: false });

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
      .text(step.title, stepX, currentY + 40, { width: stepWidth, align: "center", lineBreak: false });

    if (step.desc) {
      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(COLORS.textLight)
        .text(step.desc, stepX, currentY + 55, { width: stepWidth, align: "center", lineBreak: false });
    }

    doc.restore();
  });

  // Rodapé página 2
  drawFooter(doc, pageWidth);

  // ============ PAGE 3: INVESTMENT ============

  doc.addPage();

  doc.rect(0, 0, pageWidth, 60).fill(COLORS.primary);

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor(COLORS.white)
    .text("INVESTIMENTO E CONDIÇÕES", leftMargin, 22, { lineBreak: false });

  currentY = 90;

  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 120, 12, COLORS.background);

  doc.rect(leftMargin, currentY, 6, 120).fill(COLORS.accent);

  doc
    .fontSize(12)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("VALOR DO INVESTIMENTO", leftMargin + 25, currentY + 25, { lineBreak: false });

  doc
    .fontSize(36)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(formatCurrency(proposal.valorTotalAvista), leftMargin + 25, currentY + 50, { lineBreak: false });

  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("Pagamento à vista", leftMargin + 25, currentY + 92, { lineBreak: false });

  currentY = 230;

  currentY = drawSectionHeader(doc, "O QUE ESTÁ INCLUSO", currentY, contentWidth);

  const includedItems = [
    "Todos os equipamentos descritos nesta proposta",
    "Materiais e estruturas de fixação",
    "Mão de obra especializada para instalação",
    "Homologação junto à distribuidora de energia",
    "Suporte técnico durante todo o processo",
  ];

  includedItems.forEach((item, index) => {
    const itemY = currentY + index * 28;

    doc.save().circle(leftMargin + 8, itemY + 6, 6).fill(COLORS.success);

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor(COLORS.white)
      .text("✓", leftMargin + 4, itemY + 2, { lineBreak: false });

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor(COLORS.text)
      .text(item, leftMargin + 25, itemY, { width: contentWidth - 25, lineBreak: false });

    doc.restore();
  });

  currentY += includedItems.length * 28 + 20;

  currentY = drawSectionHeader(doc, "SOLUÇÕES FINANCEIRAS", currentY, contentWidth);

  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(
      "Temos parcerias com diversos bancos como Santander, BV Financeira, Sol Fácil, Credisolaris, dentre outros. Faça uma análise da sua taxa real conosco.",
      leftMargin,
      currentY,
      { width: contentWidth, align: "justify", lineGap: 4, lineBreak: false }
    );

  currentY += 50;

  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 70, 10, COLORS.background);

  doc.rect(leftMargin, currentY, contentWidth, 4).fill(COLORS.warning);

  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text("VALIDADE DA PROPOSTA", leftMargin + 20, currentY + 18, { lineBreak: false });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(
      `Esta proposta é válida em todos os seus termos por ${proposal.validadeDias} dias corridos contados a partir da data de emissão (${formatDate(proposal.dataProposta)}).`,
      leftMargin + 20,
      currentY + 38,
      { width: contentWidth - 40, lineBreak: false }
    );

  currentY += 90;

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
    .text(proposal.nomeCliente, leftMargin, currentY + 58, { width: signatureWidth, align: "center", lineBreak: false });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("Cliente", leftMargin, currentY + 74, { width: signatureWidth, align: "center", lineBreak: false });

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
    .text(RESPONSIBLE_NAME, leftMargin + signatureWidth + 40, currentY + 58, { width: signatureWidth, align: "center", lineBreak: false });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("Responsável Comercial", leftMargin + signatureWidth + 40, currentY + 74, { width: signatureWidth, align: "center", lineBreak: false });

  currentY += 100;

  // Informações da empresa
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text(
      `${COMPANY_NAME} | ${COMPANY_ADDRESS}`,
      leftMargin,
      currentY,
      { width: contentWidth, align: "center" }
    );

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text(
      `${COMPANY_PHONE} | ${COMPANY_EMAIL}`,
      leftMargin,
      currentY + 15,
      { width: contentWidth, align: "center", lineBreak: false }
    );

  // Rodapé página 3
  drawFooter(doc, pageWidth);

  return doc;
}