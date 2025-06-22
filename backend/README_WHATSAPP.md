# Configuração do Sistema de Alerta WhatsApp

## Variáveis de Ambiente Necessárias

Adicione estas variáveis no Railway (ou seu servidor):

```
# Token de acesso do Facebook/Meta
ACCESS_TOKEN=EAAMlFg6NFM0BOZBt26YdseFrZBpZAP1M4RhpZA9ZA1ERVnyCDOZAFg6DK17NH6bFaCjJ3RFtCZC6UW6uY0hqTiWkEjnqmWubZAmf8acfhRI3HevSmBckWJSUuTFU602G9DRZBTJdWDXuepixNOQsRiP8MfmLSR62H6gShH9A3hyN5CB8GgD0HuQ3BGn9ZBMemtvqaWvAEPN7N1wHIpmFKU

# Configurações do Twilio para WhatsApp
TWILIO_ACCOUNT_SID=seu_account_sid_aqui
TWILIO_AUTH_TOKEN=195df297f23943d8df92a95019e8e12d
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890

# Número padrão do WhatsApp (fallback)
DEFAULT_WHATSAPP_NUMBER=+5511999999999

# Habilitar alertas WhatsApp (true/false)
ENABLE_WHATSAPP_ALERTS=true
```

## Como Configurar o Twilio WhatsApp

1. Crie uma conta no [Twilio](https://www.twilio.com/)
2. Ative o WhatsApp Sandbox ou configure um número WhatsApp Business
3. Obtenha o Account SID e Auth Token
4. Configure o número do WhatsApp no formato: `whatsapp:+1234567890`

## Endpoints Disponíveis

### Configurar número de WhatsApp para uma conta:
```
POST /monitor/setManagerPhone
{
  "accountId": "123456789",
  "phoneNumber": "+5511999999999"
}
```

### Listar números configurados:
```
GET /monitor/managerPhones
```

### Testar envio de WhatsApp:
```
POST /monitor/testWhatsApp
{
  "accountId": "123456789",
  "phoneNumber": "+5511999999999"
}
```

## Funcionalidades

- ✅ Botão "Adicionar Saldo" em cada conta
- ✅ Verificação automática de saldo a cada 5 minutos
- ✅ Alerta WhatsApp quando saldo < R$ 20,00
- ✅ Controle de envio duplicado (máximo 1 alerta por 30 minutos)
- ✅ Configuração de números por conta 