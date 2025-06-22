const express = require('express');
const router = express.Router();
const metaService = require('../services/metaService');
const whatsappService = require('../services/whatsappService');
const alertScheduler = require('../services/alertScheduler');
const { checkPixBalance, checkCardStatus, formatBalance } = require('../utils/alertUtils');
const util = require('util');

// Armazenamento simples dos números de WhatsApp (em produção, use um banco de dados)
let managerPhoneNumbers = {};

// Endpoint para configurar número de WhatsApp do gestor
router.post('/setManagerPhone', (req, res) => {
    try {
        const { accountId, phoneNumber } = req.body;
        
        if (!accountId || !phoneNumber) {
            return res.status(400).json({ error: 'accountId e phoneNumber são obrigatórios' });
        }

        managerPhoneNumbers[accountId] = phoneNumber;
        alertScheduler.setManagerPhoneNumber(accountId, phoneNumber);
        
        res.json({ 
            success: true, 
            message: `Número de WhatsApp configurado para conta ${accountId}` 
        });
    } catch (error) {
        console.error('Erro ao configurar número:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Endpoint para listar números configurados
router.get('/managerPhones', (req, res) => {
    res.json({ managerPhoneNumbers });
});

// Endpoint para testar envio de WhatsApp
router.post('/testWhatsApp', async (req, res) => {
    try {
        const { accountId, phoneNumber } = req.body;
        
        if (!accountId || !phoneNumber) {
            return res.status(400).json({ error: 'accountId e phoneNumber são obrigatórios' });
        }

        const success = await whatsappService.sendAlert(accountId, 15.00, phoneNumber);
        
        if (success) {
            res.json({ success: true, message: 'Mensagem de teste enviada com sucesso!' });
        } else {
            res.status(500).json({ error: 'Erro ao enviar mensagem de teste' });
        }
    } catch (error) {
        console.error('Erro ao testar WhatsApp:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/checkAllAccounts', async (req, res) => {
    try {
        const adAccounts = await metaService.getUserAdAccounts();
        const allAccounts = [];
        const alerts = [];

        for (const details of adAccounts) {
            console.log(details); // Debug: ver o que a API retorna
            // Identificação do tipo de conta
            let tipoConta = details.funding_source_details?.funding_source_type || 'N/A';
            // Heurística extra para cartão
            if (
                tipoConta === 'N/A' &&
                details.funding_source_details &&
                typeof details.funding_source_details.display_string === 'string' &&
                /(mastercard|visa|amex|elo|diners|hipercard)/i.test(details.funding_source_details.display_string)
            ) {
                tipoConta = 'CREDIT_CARD';
            }

            // Saldo
            let saldoDisplay = null;
            if (
                details.funding_source_details &&
                typeof details.funding_source_details.display_string === 'string' &&
                details.funding_source_details.display_string.match(/R\$([\d.,]+)/)
            ) {
                saldoDisplay = details.funding_source_details.display_string.match(/R\$([\d.,]+)/)[1];
            }

            let saldoFinal = 'Não disponível';
            if (tipoConta === 'CREDIT_CARD') {
                saldoFinal = 'N/A';
            } else if (saldoDisplay) {
                saldoFinal = `R$ ${saldoDisplay}`;
            } else if (details.balance !== undefined && details.balance !== null && details.balance !== '') {
                saldoFinal = formatBalance(Number(details.balance));
            }

            // Extrair valor numérico do saldo
            let saldoNumerico = null;
            if (saldoDisplay) {
                saldoNumerico = Number(saldoDisplay.replace(/\./g, '').replace(',', '.'));
            } else if (details.balance !== undefined && details.balance !== null && details.balance !== '') {
                saldoNumerico = Number(details.balance);
            }

            const accountData = {
                id: details.id,
                name: details.name || 'Não disponível',
                type: tipoConta,
                cardStatus: details.funding_source_details?.funding_source_status || 'N/A',
                balance: saldoFinal,
                hasAlert: false,
                alertMessage: '',
                whatsapp: managerPhoneNumbers[details.id] || null
            };

            // Verificar alertas
            // Alerta de saldo baixo para qualquer conta (exceto cartão) com saldo < 30
            if (
                accountData.type !== 'CREDIT_CARD' &&
                saldoNumerico !== null &&
                !isNaN(saldoNumerico) &&
                checkPixBalance(saldoNumerico)
            ) {
                accountData.hasAlert = true;
                accountData.alertMessage = '🔴 ALERTA: Saldo abaixo de R$30,00';
                alerts.push(accountData);
            }
            // Alerta de problema no cartão SOMENTE se o status for diferente de 'ACTIVE'
            else if (
                accountData.type === 'CREDIT_CARD' &&
                accountData.cardStatus &&
                checkCardStatus(accountData.cardStatus)
            ) {
                accountData.hasAlert = true;
                accountData.alertMessage = '🔴 ALERTA: Problema no cartão';
                alerts.push(accountData);
            }

            allAccounts.push(accountData);
        }

        res.json({
            accounts: allAccounts,
            alerts: alerts
        });
    } catch (error) {
        if (error.response) {
            console.error('Erro ao verificar contas:', util.inspect(error.response.data, { depth: null }));
            res.status(500).json({ error: 'Erro ao verificar contas', details: error.response.data });
        } else {
            console.error('Erro ao verificar contas:', error.message);
            res.status(500).json({ error: 'Erro ao verificar contas', details: error.message });
        }
    }
});

module.exports = router; 