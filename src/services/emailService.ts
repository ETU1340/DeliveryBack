import { transporter } from "../configs/mailer";


exports.sendEmails = async (mailOptions: any,res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: boolean; message: string; }): any; new(): any; }; }; }) => {
  try {
    console.log('send mailllll');
    await transporter.sendMail(mailOptions);
  } catch (error) {
    return res.status(500).json({error:true , message: 'send email fail' });
  }
};
