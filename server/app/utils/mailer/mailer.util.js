import config from '../../config/configServer.js';
import nodemailer from "nodemailer";
import hbs from 'nodemailer-express-handlebars';
import { join } from 'path';

export const mailerSendMail = async ({to, subject, context, template}) => {
    let transporter = nodemailer.createTransport({
        host: config.mailer.host,
        port: config.mailer.port,
        auth: {
            user: config.mailer.user,
            pass: config.mailer.pass,
        },
    });
    transporter.use('compile', hbs({
        viewEngine: {
            extname: '.handlebars',
            partialsDir: join(__dirname, '/templates'),
            defaultLayout: false
        },
        viewPath: join(__dirname, '/templates'),
        extName: '.handlebars'
    }));
    const mailOptions = {
        from: config.mailer.from,
        to,
        subject,        
        template,
        context
    };

    transporter.sendMail(mailOptions);
}