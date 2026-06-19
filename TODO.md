# TODO - Avaliação com Tela/Modal de Detalhes (Admin)

## Passo a passo
- [ ] 1) Implementar endpoint/fluxo de UI: adicionar botão "Ver Detalhes" na lista de produtos pendentes do Admin.
- [ ] 2) Criar componente/modal dedicado para exibir todos os detalhes do produto para o Admin.
- [ ] 3) Integrar botões do modal: ✅ Aprovar Produto e ❌ Recusar Produto chamando `PUT /api/products/{id}/status?status=APROVADO|REPROVADO` via funções existentes (sem duplicar lógica).
- [ ] 4) Garantir que após resposta da API a lista de produtos do admin seja atualizada automaticamente.
- [ ] 5) Regra de UX: impedir aprovação/recusa sem antes visualizar os detalhes.
- [ ] 6) Validar que não foi alterada a lógica de criação de produto (backend intacto) e que a identidade visual do admin foi preservada.

