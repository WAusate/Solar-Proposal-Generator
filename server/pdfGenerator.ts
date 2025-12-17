import PDFDocument from "pdfkit";
import { Proposal } from "@shared/schema";

const COMPANY_NAME = "SolarPro Energia";
const COMPANY_ADDRESS = "Rua Dois, 25, Sala 101, Maranguape I, Paulista – PE. CEP 53444-380";
const COMPANY_PHONE = "(81) 99999-9999";
const COMPANY_EMAIL = "contato@solarpro.com.br";
const RESPONSIBLE_NAME = "Consultor Comercial";

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

  doc.rect(x, y, width, 4).fill(COLORS.secondary);

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

function drawFooter(
  doc: PDFKit.PDFDocument,
  pageNumber: number,
  totalPages: number,
  pageWidth: number,
  contentWidth: number,
  leftMargin: number
) {
  const footerY = doc.page.height - 35;

  doc.rect(0, footerY - 5, pageWidth, 40).fill(COLORS.dark);

  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor(COLORS.white)
    .text(`${COMPANY_NAME} | ${COMPANY_ADDRESS}`, leftMargin, footerY + 5, {
      width: contentWidth - 60,
      align: "left",
    });

  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor(COLORS.white)
    .text(`${pageNumber} / ${totalPages}`, pageWidth - 80, footerY + 5, {
      width: 30,
      align: "right",
    });
}

export function generateProposalPDF(proposal: Proposal): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 0, bottom: 40, left: 50, right: 50 },
  });

  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 100;
  const leftMargin = 50;

  // ============ PAGE 1: COVER ============

  doc.rect(0, 0, pageWidth, doc.page.height).fill(COLORS.white);

  const coverImagePath = "./server/assets/capa-corel.png";

  // Remove o height para evitar forçar quebra de página
  doc.image(coverImagePath, 0, 0, {
    width: pageWidth,
  });

  const leftMarginCover = 25;
  const textWidthCover = pageWidth - leftMarginCover - 60;

  let currentY = 520;

  doc
    .font("Helvetica-Bold")
    .fontSize(30)
    .fillColor(COLORS.dark)
    .text("PROPOSTA", leftMarginCover, currentY, {
      width: textWidthCover,
    });

  currentY += 30;

  doc
    .font("Helvetica-Bold")
    .fontSize(30)
    .fillColor(COLORS.primary)
    .text("COMERCIAL", leftMarginCover, currentY, {
      width: textWidthCover,
    });

  currentY += 55;

  const cardsY = currentY;
  const cardHeight = 90;
  const gapBetweenCards = 24;

  const totalCardsWidth = pageWidth - leftMarginCover - 60;
  const singleCardWidth = (totalCardsWidth - gapBetweenCards) / 2;

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
    .text("CLIENTE", infoX, infoY);

  infoY += 14;

  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(proposal.nomeCliente, infoX, infoY, {
      width: singleCardWidth - 36,
    });

  infoY = doc.y + 6;

  if (proposal.cidadeUf) {
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(COLORS.textLight)
      .text(proposal.cidadeUf, infoX, infoY);
  }

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
    .text("DATA", infoX, infoY);

  infoY += 14;

  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(formatDate(proposal.dataProposta), infoX, infoY, {
      width: singleCardWidth - 36,
    });

  infoY += 24;

  doc
    .fontSize(9)
    .font("Helvetica-Bold")
    .fillColor(COLORS.textLight)
    .text("VALIDADE", infoX, infoY);

  infoY += 14;

  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(`${proposal.validadeDias} dias`, infoX, infoY);

  const logoPath = "./server/assets/Logo Átomo Solar.png";
  const logoWidth = 120;
  const bottomLogoY = 120;

  doc.image(logoPath, pageWidth - logoWidth - 50, doc.page.height - bottomLogoY, {
    width: logoWidth,
  });

  drawFooter(doc, 1, 3, pageWidth, contentWidth, leftMargin);

  // ============ PAGE 2: TECHNICAL SPECS ============

  doc.addPage();

  currentY = 0;

  doc.rect(0, 0, pageWidth, 60).fill(COLORS.primary);

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

  currentY = drawSectionHeader(
    doc,
    "EQUIPAMENTOS PRINCIPAIS",
    currentY,
    contentWidth
  );

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
    .text("ITEM", tableX + 12, currentY + 8, { width: colItemWidth - 24 });

  doc.text("MODELO", tableX + colItemWidth + 12, currentY + 8, {
    width: colModelWidth - 24,
  });

  doc.text("QTD", tableX + colItemWidth + colModelWidth + 12, currentY + 8, {
    width: colQtyWidth - 24,
    align: "right",
  });

  currentY += rowHeight + 4;

  drawRoundedRect(doc, tableX, currentY, contentWidth, rowHeight, 4, COLORS.white);

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text("Módulos Fotovoltaicos", tableX + 12, currentY + 8, {
      width: colItemWidth - 24,
    });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(proposal.modeloModulo, tableX + colItemWidth + 12, currentY + 8, {
      width: colModelWidth - 24,
    });

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(proposal.quantidadeModulo.toString(), tableX + colItemWidth + colModelWidth, currentY + 8, {
      width: colQtyWidth - 12,
      align: "right",
    });

  currentY += rowHeight + 2;

  drawRoundedRect(doc, tableX, currentY, contentWidth, rowHeight, 4, COLORS.background);

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text("Inversor(es)", tableX + 12, currentY + 8, {
      width: colItemWidth - 24,
    });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.text)
    .text(proposal.modeloInversor, tableX + colItemWidth + 12, currentY + 8, {
      width: colModelWidth - 24,
    });

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor(COLORS.dark)
    .text(proposal.quantidadeInversor.toString(), tableX + colItemWidth + colModelWidth, currentY + 8, {
      width: colQtyWidth - 12,
      align: "right",
    });

  currentY += rowHeight + 20;

  currentY = drawSectionHeader(
    doc,
    "GARANTIAS INCLUÍDAS",
    currentY,
    contentWidth
  );

  const warrantyWidth = (contentWidth - 20) / 3;

  drawRoundedRect(doc, leftMargin, currentY, warrantyWidth, 80, 8, COLORS.background);

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("SERVIÇOS", leftMargin + 12, currentY + 12, {
      width: warrantyWidth - 24,
    });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.dark)
    .text(proposal.garantiaServicos, leftMargin + 12, currentY + 32, {
      width: warrantyWidth - 24,
    });

  const modsX = leftMargin + warrantyWidth + 10;

  drawRoundedRect(doc, modsX, currentY, warrantyWidth, 80, 8, COLORS.background);

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("MÓDULOS FOTOVOLTAICOS", modsX + 12, currentY + 12, {
      width: warrantyWidth - 24,
    });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.dark)
    .text(proposal.garantiaModulosEquipamento, modsX + 12, currentY + 32, {
      width: warrantyWidth - 24,
    });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.dark)
    .text(proposal.garantiaModulosPerformance, modsX + 12, currentY + 48, {
      width: warrantyWidth - 24,
    });

  const invX = leftMargin + (warrantyWidth + 10) * 2;

  drawRoundedRect(doc, invX, currentY, warrantyWidth, 80, 8, COLORS.background);

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("INVERSORES", invX + 12, currentY + 12, {
      width: warrantyWidth - 24,
    });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.dark)
    .text(proposal.garantiaInversor, invX + 12, currentY + 32, {
      width: warrantyWidth - 24,
    });

  currentY += 100;

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text(
      "A garantia dos equipamentos é de responsabilidade dos fabricantes.",
      leftMargin,
      currentY,
      {
        width: contentWidth,
        align: "center",
      }
    );

  currentY += 35;

  currentY = drawSectionHeader(
    doc,
    "CRONOGRAMA DE EXECUÇÃO",
    currentY,
    contentWidth
  );

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

    if (step.desc) {
      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(COLORS.textLight)
        .text(step.desc, stepX, currentY + 55, { width: stepWidth, align: "center" });
    }

    doc.restore();
  });

  drawFooter(doc, 2, 3, pageWidth, contentWidth, leftMargin);

  // ============ PAGE 3: INVESTMENT ============

  doc.addPage();

  doc.rect(0, 0, pageWidth, 60).fill(COLORS.primary);

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .fillColor(COLORS.white)
    .text("INVESTIMENTO E CONDIÇÕES", leftMargin, 22);

  currentY = 90;

  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 120, 12, COLORS.background);

  doc.rect(leftMargin, currentY, 6, 120).fill(COLORS.accent);

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
      .text("✓", leftMargin + 4, itemY + 2);

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor(COLORS.text)
      .text(item, leftMargin + 25, itemY);

    doc.restore();
  });

  currentY += includedItems.length * 28 + 30;

  currentY = drawSectionHeader(
    doc,
    "SOLUÇÕES FINANCEIRAS",
    currentY,
    contentWidth
  );

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

  drawRoundedRect(doc, leftMargin, currentY, contentWidth, 70, 10, COLORS.background);

  doc.rect(leftMargin, currentY, contentWidth, 4).fill(COLORS.warning);

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
      `Esta proposta é válida em todos os seus termos por ${proposal.validadeDias} dias corridos contados a partir da data de emissão (${formatDate(
        proposal.dataProposta
      )}).`,
      leftMargin + 20,
      currentY + 38,
      { width: contentWidth - 40 }
    );

  currentY += 100;

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
    .text(proposal.nomeCliente, leftMargin, currentY + 58, {
      width: signatureWidth,
      align: "center",
    });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("Cliente", leftMargin, currentY + 74, {
      width: signatureWidth,
      align: "center",
    });

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
    .text(RESPONSIBLE_NAME, leftMargin + signatureWidth + 40, currentY + 58, {
      width: signatureWidth,
      align: "center",
    });

  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor(COLORS.textLight)
    .text("Responsável Comercial", leftMargin + signatureWidth + 40, currentY + 74, {
      width: signatureWidth,
      align: "center",
    });

  drawFooter(doc, 3, 3, pageWidth, contentWidth, leftMargin);

  return doc;
}