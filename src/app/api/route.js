import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");


export async function POST(req) { 
  const body = await req.json()
  const data = JSON.stringify(body.task).replace(/"/g, '');
  const date = JSON.stringify(body.date).replace(/"/g, '');
  const user = JSON.stringify(body.assignee).replace(/"/g, '');
  console.log("this is waat the POST request receive: ", data, date, user);

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'norma37@ethereal.email',
        pass: 'eJb4GsmQA27cfmUBHG'
    }
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"EY Task Management" <maddison53@ethereal.email>', // sender address
    to: "norma37@ethereal.email", // list of receivers
    subject: "You got a task!", // Subject line
    text: `${user} this is your added task: 
    ${data} 
    And your due date is on ${date}`, // plain text body
    //html: "<b></b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);

  return NextResponse.json({ message: "Excecution went well." }, { status: 200 }); 


};