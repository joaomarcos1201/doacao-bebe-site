# Resumo dos testes – Além do Positivo

Data da execução: 18/09/2026.

| Indicador | Quantidade |
|---|---:|
| Total de casos | 25 |
| Aprovados | 6 |
| Reprovados | 2 |
| Bloqueados | 17 |
| Defeitos encontrados | 2 |
| Defeitos corrigidos | 0 |
| Defeitos abertos | 2 |

## Execuções realizadas

- Frontend: `npm test -- --watchAll=false --runInBand --verbose`. Uma suíte e um teste foram aprovados. Houve somente um aviso de depreciação do `act` do React.
- Backend: `mvn test`. Quatro testes de integração de venda foram aprovados, sem falhas, erros ou testes ignorados. A execução usa H2 no perfil de teste.
- Segurança: inspeção estática da configuração de segurança e dos controladores. Foram encontrados os defeitos D001 e D002.

## Limitações

- Não foram utilizados credenciais nem dados da base de produção.
- Não houve execução manual autenticada no navegador, captura de telas ou teste em dispositivos reais.
- Não foi localizado um projeto React Native/Expo no diretório analisado; por isso, os testes mobile ficaram bloqueados.
- O teste de carga e a compatibilidade entre navegadores não foram executados.
- Os resultados bloqueados requerem ambiente controlado, contas de teste e coleta manual de evidências antes de serem concluídos.
