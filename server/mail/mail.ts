import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
//import puppeteer from 'puppeteer';

// export function mail() {
//   let transporter = nodemailer.createTransport({
//     service: process.env.SERVICE,
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });
//   return transporter;
// }
export function mail() {
var smtpTransport = nodemailer.createTransport({
  host: process.env.SERVICE,
  port: 587,
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
  }
});
return smtpTransport;
}
export async function sendMail(templateLocation, sender, subject, content, attachLocation?, attachData?) {
  const templatePath = path.resolve(__dirname, templateLocation);
  const template = fs.readFileSync(templatePath, 'UTF-8');
  const compliedTemplate = handlebars.compile(template, {
    noEscape: true,
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: sender,
    subject: subject,
    html: compliedTemplate(content),
  };

 return mail().sendMail(mailOptions);
}

