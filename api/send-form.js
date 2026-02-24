import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const form = formidable({
      multiples: false,
      allowEmptyFiles: true,
      minFileSize: 0,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const dniValue = Array.isArray(fields.dni) ? fields.dni[0] : fields.dni || "";
    const teNIE = /^[0-9]/.test(dniValue) ? "No" : "Sí";

    const discapacitatValue = Array.isArray(fields.discapacitat)
      ? fields.discapacitat[0]
      : fields.discapacitat;

    const collectiuValue = Array.isArray(fields.collectiu)
      ? fields.collectiu[0]
      : fields.collectiu;

    const teCollectiu =
      discapacitatValue === "Sí" ||
      (collectiuValue && collectiuValue !== "Cap")
        ? "Sí"
        : "No";

    const attachments = [];
    let cvBase64 = "";
    let cvFileName = "";

    if (files.cv) {
      const file = Array.isArray(files.cv) ? files.cv[0] : files.cv;

  if (file && file.filepath) {
  const fileBuffer = fs.readFileSync(file.filepath);

  cvBase64 = Buffer.from(fileBuffer).toString("base64");
  cvFileName = file.originalFilename || "CV.pdf";
}
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Agència Foment Formació" <${process.env.EMAIL_USER}>`,
      to: "jalejo@fomentformacio.com",
      subject: "Nova inscripció Agència de Col·locació",
      html: "<p>Nova inscripció rebuda</p>",

    });

    const normalizeValue = (value) => {
      if (Array.isArray(value)) value = value[0];
      if (typeof value === "string") return value;
      return "";
    };

    const toUpper = (value) => normalizeValue(value).toUpperCase();
    const dataFormatada = normalizeValue(fields.dataNaixement).replace(/-/g, "");

const googleRes = await fetch(process.env.GOOGLE_SCRIPT_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    dni: toUpper(fields.dni),
    nom: toUpper(fields.nom),
    cognom1: toUpper(fields.cognom1),
    cognom2: toUpper(fields.cognom2),
    dataNaixement: dataFormatada,
    genere: toUpper(fields.genere),
    estudis: toUpper(fields.estudis),
    discapacitat: toUpper(fields.discapacitat),
    teNIE: toUpper(teNIE),
    teCollectiu: toUpper(teCollectiu),
    feina2mesos: toUpper(fields.feina2mesos),
    email: toUpper(fields.email),
    telefon: toUpper(fields.telefon),
    poblacio: toUpper(fields.poblacio),
    prestacio: toUpper(fields.prestacio),
    sector: toUpper(fields.sector),
    disponibilitat: toUpper(fields.disponibilitat),
    cvBase64,
    cvFileName
  }),
});

const googleText = await googleRes.text();
console.log("GOOGLE STATUS:", googleRes.status);
console.log("GOOGLE TEXT:", googleText);

if (!googleRes.ok) {
  console.error("Google Sheets error:", googleText);
}

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("ERROR REAL:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
