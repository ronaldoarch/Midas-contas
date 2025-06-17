const axios = require('axios');

class MetaService {
    constructor() {
        this.baseUrl = 'https://graph.facebook.com/v18.0';
        this.accessToken = process.env.ACCESS_TOKEN;
    }

    async getBusinessManagers() {
        try {
            const response = await axios.get(`${this.baseUrl}/me/businesses`, {
                params: {
                    access_token: this.accessToken
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar Business Managers:', error);
            throw error;
        }
    }

    async getAdAccounts(businessId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${businessId}/owned_ad_accounts`, {
                params: {
                    access_token: this.accessToken,
                    fields: 'id,name,funding_source_details,balance'
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Erro ao buscar Ad Accounts:', error);
            throw error;
        }
    }

    async getAccountDetails(accountId) {
        try {
            const response = await axios.get(`${this.baseUrl}/${accountId}`, {
                params: {
                    access_token: this.accessToken,
                    fields: 'id,name,funding_source_details,balance'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar detalhes da conta:', error);
            throw error;
        }
    }

    async getUserAdAccounts() {
        try {
            let allAccounts = [];
            let url = `${this.baseUrl}/me/adaccounts`;
            let params = {
                access_token: this.accessToken,
                fields: 'id,name,balance,funding_source_details'
            };
            while (url) {
                const response = await axios.get(url, { params });
                allAccounts = allAccounts.concat(response.data.data);
                // Verifica se há próxima página
                if (response.data.paging && response.data.paging.next) {
                    url = response.data.paging.next;
                    params = {}; // O link já contém todos os parâmetros
                } else {
                    url = null;
                }
            }
            return allAccounts;
        } catch (error) {
            console.error('Erro ao buscar Ad Accounts do usuário:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = new MetaService(); 