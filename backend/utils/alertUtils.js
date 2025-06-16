const checkPixBalance = (balance) => {
    return balance < 30;
};

const checkCardStatus = (status) => {
    return status !== 'ACTIVE';
};

const formatBalance = (balance) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(balance);
};

module.exports = {
    checkPixBalance,
    checkCardStatus,
    formatBalance
}; 