import nodemailer from "nodemailer";

let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
} else {
  console.warn("SMTP_USER/SMTP_PASS not set — task-assignment emails will be skipped.");
}

export const sendTaskAssignedEmail = async ({ to, assigneeName, taskTitle, boardName, boardId }) => {
  if (!transporter) return;

  const boardUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/boards/${boardId}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: `You were assigned: ${taskTitle}`,
      html: `
        <div style="font-family: sans-serif; background:#132A28; color:#F2EFE7; padding:32px;">
          <h2 style="margin:0 0 12px; color:#F2EFE7;">Hi ${assigneeName},</h2>
          <p style="margin:0 0 20px; color:#F2EFE7;">
            You were assigned a task on <strong>${boardName}</strong>:
          </p>
          <p style="margin:0 0 24px; padding:12px 16px; background:#1C3A37; border-radius:8px; color:#F2EFE7;">
            ${taskTitle}
          </p>
          <a href="${boardUrl}" style="display:inline-block; background:#E8B34E; color:#0F1F1D; text-decoration:none; font-weight:600; padding:10px 18px; border-radius:6px;">
            Open board
          </a>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send task-assignment email:", err.message);
  }
};
