const twilio = require('twilio');

class WhatsAppService {
    constructor() {
        this.client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        this.fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // formato: whatsapp:+1234567890
        this.sentAlerts = new Set(); // Controle de alertas enviados
    }

    async sendAlert(accountId, balance, phoneNumber) {
        const alertKey = `${accountId}_${Date.now()}`;
        
        // Verificar se já foi enviado alerta para esta conta recentemente (últimos 30 minutos)
        const recentAlert = Array.from(this.sentAlerts).find(key => 
            key.startsWith(accountId) && 
            (Date.now() - parseInt(key.split('_')[1])) < 30 * 60 * 1000
        );

        if (recentAlert) {
            console.log(`Alerta já enviado recentemente para conta ${accountId}`);
            return false;
        }

        try {
            const message = `🚨 Atenção! Sua conta de anúncios (ID: ${accountId}) está com saldo crítico: R$${balance.toFixed(2)}.\n\nAcesse: https://business.facebook.com/ads/payment/?act=${accountId} para recarregar.`;

            await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to: `whatsapp:${phoneNumber}`
            });

            // Registrar alerta enviado
            this.sentAlerts.add(alertKey);
            
            // Limpar alertas antigos (mais de 1 hora)
            this.cleanOldAlerts();

            console.log(`Alerta WhatsApp enviado para conta ${accountId}`);
            return true;
        } catch (error) {
            console.error('Erro ao enviar alerta WhatsApp:', error);
            return false;
        }
    }

    cleanOldAlerts() {
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        this.sentAlerts = new Set(
            Array.from(this.sentAlerts).filter(key => {
                const timestamp = parseInt(key.split('_')[1]);
                return timestamp > oneHourAgo;
            })
        );
    }
}

module.exports = new WhatsAppService(); 