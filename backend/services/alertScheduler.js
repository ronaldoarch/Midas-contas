const cron = require('node-cron');
const metaService = require('./metaService');
const whatsappService = require('./whatsappService');

class AlertScheduler {
    constructor() {
        this.minBalanceThreshold = 20; // R$ 20,00
        this.checkInterval = '*/5 * * * *'; // A cada 5 minutos
        this.managerPhoneNumbers = {}; // Armazenamento dos números
    }

    start() {
        console.log('Iniciando agendador de alertas...');
        
        // Executar verificação imediatamente
        this.checkLowBalances();
        
        // Agendar verificação a cada 5 minutos
        cron.schedule(this.checkInterval, () => {
            this.checkLowBalances();
        });
    }

    async checkLowBalances() {
        try {
            console.log('Verificando saldos baixos...');
            const adAccounts = await metaService.getUserAdAccounts();
            
            for (const account of adAccounts) {
                // Pular contas de cartão de crédito
                if (account.funding_source_details?.funding_source_type === 'CREDIT_CARD') {
                    continue;
                }

                // Extrair saldo numérico
                let balance = null;
                if (account.funding_source_details?.display_string) {
                    const match = account.funding_source_details.display_string.match(/R\$([\d.,]+)/);
                    if (match) {
                        balance = Number(match[1].replace(/\./g, '').replace(',', '.'));
                    }
                } else if (account.balance !== undefined && account.balance !== null && account.balance !== '') {
                    balance = Number(account.balance);
                }

                // Verificar se saldo está baixo
                if (balance !== null && !isNaN(balance) && balance < this.minBalanceThreshold) {
                    const phoneNumber = this.getManagerPhoneNumber(account.id);
                    
                    if (phoneNumber) {
                        await whatsappService.sendAlert(account.id, balance, phoneNumber);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao verificar saldos baixos:', error);
        }
    }

    getManagerPhoneNumber(accountId) {
        return this.managerPhoneNumbers[accountId] || process.env.DEFAULT_WHATSAPP_NUMBER;
    }

    setManagerPhoneNumber(accountId, phoneNumber) {
        this.managerPhoneNumbers[accountId] = phoneNumber;
    }

    setMinBalanceThreshold(threshold) {
        this.minBalanceThreshold = threshold;
    }
}

module.exports = new AlertScheduler(); 