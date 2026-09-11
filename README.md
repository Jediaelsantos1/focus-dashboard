# Focus Macro Dashboard

Dashboard web (HTML/CSS/JS) para acompanhamento semanal do **Boletim Focus** do Banco Central.

## O que já está implementado

- Histórico do Boletim Focus com armazenamento local (`localStorage`)
- Leitura macro com comparação da última leitura vs. anterior
- Motor inicial de asset allocation estilo endowment
- Bloco de tactical rebalancing com gatilhos automáticos
- Framework de decisão para rotina semanal

## Como rodar

Abra `index.html` no navegador.

## Fluxo de uso semanal

1. Acesse: https://www.bcb.gov.br/publicacoes/focus
2. Abra o PDF da semana
3. Lance os principais campos no formulário do dashboard
4. Analise insights gerados automaticamente

## Próximos passos sugeridos

- Conectar fonte automática (API/ETL) para atualizar sem digitação manual
- Incluir mais variáveis do Focus (IPCA 12m, IGP-M, balança, resultado primário etc.)
- Salvar histórico em banco (Postgres) e publicar com backend/API
