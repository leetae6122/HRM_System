import config from '../config/configServer';
import { mailerSendMail } from '../utils/mailer/mailer.util';

class MailService {
    async sendMailForgotPassword(receiverEmail, token) {
        const url = `${config.app.client_url}/auth/reset-password?token=${token}`
        const payload = {
            to: receiverEmail,
            subject: 'Reset Your Password',
            context: {
                url,
            },
            template: 'forgot-password'
        };
        await mailerSendMail(payload);
    }

    async sendMailRespondLeaveRequests(leaveData) {
        if (leaveData.status === 'Pending') return;
        const { employeeData, handlerData } = leaveData;
        let payload = {
            to: employeeData.email,
            subject: 'Respond to leave requests',
            context: {
                receiver: `${employeeData.firstName} ${employeeData.lastName}`,
                leaveFrom: new Date(leaveData.leaveFrom).toDateString(),
                leaveTo: new Date(leaveData.leaveTo).toDateString(),
                title: leaveData.title,
                requestHandler: `${handlerData.firstName} ${handlerData.lastName}`,
            },
        };

        if (leaveData.status === 'Approved') {
            payload = {
                ...payload,
                template: 'approve-request-leave'
            };
        }

        if (leaveData.status === 'Reject') {
            payload = {
                ...payload,
                context: {
                    ...payload.context,
                    dateHandle: new Date(leaveData.updatedAt).toDateString(),
                    reasonRejection: leaveData.reasonRejection
                },
                template: 'reject-request-leave'
            };
        }

        await mailerSendMail(payload);
    }
}

module.exports = new MailService;