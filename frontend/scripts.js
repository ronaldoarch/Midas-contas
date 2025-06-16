document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.getElementById('refreshButton');
    const alertsList = document.getElementById('alertsList');
    const accountsList = document.getElementById('accountsList');

    const createAccountCard = (account) => {
        const card = document.createElement('div');
        card.className = `account-card ${account.hasAlert ? 'alert' : 'ok'}`;
        
        const content = `
            <h3>${account.hasAlert ? '🔴' : '✅'} Conta: ${account.id}</h3>
            <p>Nome: ${account.name}</p>
            <p>Tipo: ${account.type}</p>
            ${account.type === 'CREDIT_CARD' ? `<p>Status do Cartão: ${account.cardStatus}</p>` : ''}
            <p>Saldo: ${account.balance}</p>
            ${account.hasAlert ? `<p class="alert-message">${account.alertMessage}</p>` : ''}
        `;
        
        card.innerHTML = content;
        return card;
    };

    const updateUI = (data) => {
        // Limpar listas
        alertsList.innerHTML = '';
        accountsList.innerHTML = '';

        // Atualizar alertas
        if (data.alerts.length === 0) {
            alertsList.innerHTML = '<p>Nenhum alerta ativo</p>';
        } else {
            data.alerts.forEach(account => {
                alertsList.appendChild(createAccountCard(account));
            });
        }

        // Atualizar todas as contas
        data.accounts.forEach(account => {
            accountsList.appendChild(createAccountCard(account));
        });
    };

    const fetchData = async () => {
        try {
            refreshButton.disabled = true;
            refreshButton.textContent = 'Atualizando...';
            
            const response = await fetch('http://localhost:3003/monitor/checkAllAccounts');
            const data = await response.json();
            
            updateUI(data);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            alert('Erro ao buscar dados. Por favor, tente novamente.');
        } finally {
            refreshButton.disabled = false;
            refreshButton.textContent = 'Atualizar Agora';
        }
    };

    // Carregar dados iniciais
    fetchData();

    // Configurar botão de atualização
    refreshButton.addEventListener('click', fetchData);
}); 