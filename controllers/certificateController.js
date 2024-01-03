/* eslint-disable import/no-extraneous-dependencies */
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const fontkit = require("@pdf-lib/fontkit");

const generateCertificate = async (userName, courseName) => {
  const templatedCertificate = fs.readFileSync(
    "public/doc/template-certificate.pdf"
  );

  const pdfDoc = await PDFDocument.load(templatedCertificate);
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.getPages()[0];

  const fontBytes = fs.readFileSync("public/fonts/Sacramento.ttf");
  const Sacramento = await pdfDoc.embedFont(fontBytes);

  const fontBytes2 = fs.readFileSync("public/fonts/Montserrat.ttf");
  const Montserrat = await pdfDoc.embedFont(fontBytes2);

  const thisMonth = new Date().toLocaleString("default", { month: "long" });
  const thisYear = new Date().getFullYear();

  page.drawText(userName, { x: 86, y: 285, font: Sacramento, size: 56 });
  page.drawText("Has successfully completed", {
    x: 86,
    y: 220,
    font: Montserrat,
    size: 20,
  });
  page.drawText(courseName, { x: 86, y: 190, font: Montserrat, size: 20 });
  page.drawText(`on ${thisMonth} ${thisYear}`, {
    x: 86,
    y: 160,
    font: Montserrat,
    size: 20,
  });

  const modifiedPdfBytes = await pdfDoc.save();

  return modifiedPdfBytes;
};

module.exports = generateCertificate;
