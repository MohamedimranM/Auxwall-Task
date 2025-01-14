const express = require("express");
const qrcode = require("qrcode");
const db = require("../config/db");
const router = express.Router();
const pdfkit = require("pdfkit");
const qrImage = require("qr-image");

router.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", { user: req.session.user, data: null });
  } else {
    res.redirect("/login");
  }
});

// routes generate qr
router.post("/generateqr", async (req, res) => {
  
  const pool = await db;
  const settingsResult = await pool.request().query("SELECT * FROM setting");
  const settings = settingsResult.recordset[0];
  // console.log(settings.maxExpiryTime)

  const code = Math.random().toString().slice(2, 12);
  const generatedDate = new Date();
  const expiryDate = new Date(
    generatedDate.getTime() + `${settings.maxExpiryTime}` * 24 * 60 * 60 * 1000
  ); 
  // Generate QR code
  try {
    // Insert into database
    const pool = await db;
    await pool.request().query(`
        INSERT INTO vouchers (code, generated_date, expiry_date)
        VALUES ('${code}', '${generatedDate.toISOString()}', '${expiryDate.toISOString()}')
        `);
    console.log("created");
  } catch (error) {
    console.log(`error creating a data ${error}`);
  }
  const qrCode = await qrcode.toDataURL(code);
  res.render("generateqr", {
    code,
    qrCode,
    successMessage: "QR Code generated successfully!",
  });
});

router.get("/dashboards", async (req, res) => {
  try {
    const pool = await db;
    const result = await pool.request().query("SELECT * FROM vouchers");
    const data = result.recordset;
    res.render("dashboard", { user: req.session.user, data: data });
  } catch (error) {
    console.log(`Error fetching vouchers: ${error}`);
    res.status(500).send("Error fetching vouchers");
  }
});

// Routes generate PDF

router.get("/generatepdf/:id", async (req, res) => {
  const voucherId = req.params.id;

  try {
    const pool = await db;

    // Fetch voucher details
    const voucherResult = await pool
      .request()
      .input("id", voucherId)
      .query("SELECT * FROM vouchers WHERE id = @id");

    const voucher = voucherResult.recordset[0];
    if (!voucher) {
      return res.status(404).send("Voucher not found");
    }

    // Fetch settings
    const settingsResult = await pool.request().query("SELECT * FROM setting");
    const settings = settingsResult.recordset[0];
    if (!settings) {
      return res.status(500).send("Settings not configured");
    }

    // Generate the QR code image
    const qrCodeImage = qrImage.imageSync(voucher.code, { type: "png" });

    // Create a PDF document
    const doc = new pdfkit();
    const filename = `voucher_${voucher.code}.pdf`;

    // Set headers for downloading the PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe the document to the response
    doc.pipe(res);

    // Use dynamic settings for font sizes
    doc
      .fontSize(settings.titleFontSize)
      .font("Helvetica-Bold")
      .text("Voucher Details", { align: "center", lineGap: 10 });

    doc.moveDown(1);

    doc
      .fontSize(settings.textFontSize)
      .font("Helvetica")
      .text(`Code: ${voucher.code}`, { align: "center" });

    doc.moveDown(0.5);
    doc.text(
      `Generated Date: ${new Date(
        voucher.generated_date
      ).toLocaleDateString()}`,
      { align: "center" }
    );

    doc.moveDown(0.5);
    doc.text(
      `Expiry Date: ${new Date(voucher.expiry_date).toLocaleDateString()}`,
      { align: "center" }
    );

    doc.moveDown(1);

    // Set dimensions dynamically based on settings
    const qrCodeWidth = settings.voucherWidth;
    const xPos = (doc.page.width - qrCodeWidth) / 2;

    doc.image(qrCodeImage, xPos, doc.y, { width: qrCodeWidth });
    doc.moveDown(1);

    doc.end();
  } catch (error) {
    console.error(`Error generating PDF: ${error}`);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;
