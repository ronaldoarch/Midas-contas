// ... existing code ...
// Conteúdo do scripts.js do frontend
// ... existing code ... 

document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.getElementById('refreshButton');
    const alertsList = document.getElementById('alertsList');
    const accountsList = document.getElementById('accountsList');
    const showAllButton = document.getElementById('showAllButton');

    // Armazenar contas ocultas
    let hiddenAccounts = new Set();

    const createAccountCard = (account) => {
        if (hiddenAccounts.has(account.id)) return null;
        const card = document.createElement('div');
        card.className = `account-card ${account.hasAlert ? 'alert' : 'ok'}`;
        
        // Remover prefixo 'act_' do ID se existir
        const accountIdSemPrefixo = account.id.replace('act_', '');
        // Montar URL de recarga com business_id
        const urlRecarga = `https://business.facebook.com/billing_hub/accounts/details?asset_id=${accountIdSemPrefixo}&business_id=${account.business_id}&placement=standalone&payment_account_id=${accountIdSemPrefixo}`;
        const addBalanceBtn = account.business_id ? `<button class=\"add-balance-btn\" onclick=\"window.open('${urlRecarga}', '_blank')\">Adicionar Saldo</button>` : '';
        const content = `
            <h3>${account.hasAlert ? '🔴' : '✅'} Conta: ${account.id}</h3>
            <p>Nome: ${account.name}</p>
            <p>Tipo: ${account.type}</p>
            ${account.type === 'CREDIT_CARD' ? `<p>Status do Cartão: ${account.cardStatus}</p>` : ''}
            <p>Saldo: ${account.balance}</p>
            ${account.hasAlert ? `<p class=\"alert-message\">${account.alertMessage}</p>` : ''}
            <div class=\"card-actions\">
                <button class=\"minimize-btn\" data-id=\"${account.id}\">Minimizar</button>
                ${addBalanceBtn}
            </div>
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
                const card = createAccountCard(account);
                if (card) alertsList.appendChild(card);
            });
        }

        // Atualizar todas as contas
        data.accounts.forEach(account => {
            const card = createAccountCard(account);
            if (card) accountsList.appendChild(card);
        });

        // Adicionar eventos aos botões de minimizar
        document.querySelectorAll('.minimize-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                hiddenAccounts.add(id);
                updateUI(data);
            });
        });
    };

    const fetchData = async () => {
        try {
            refreshButton.disabled = true;
            refreshButton.textContent = 'Atualizando...';
            
            const response = await fetch('/monitor/checkAllAccounts');
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

    // Botão para mostrar todas as contas novamente
    showAllButton.addEventListener('click', () => {
        hiddenAccounts.clear();
        fetchData();
    });

    // Atualização automática a cada 5 minutos (300.000 ms)
    setInterval(fetchData, 300000);
}); 