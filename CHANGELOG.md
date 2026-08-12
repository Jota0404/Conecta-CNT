# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao versionamento semântico.

---

## [Unreleased] - 2026-08-12

### TelaConvertido.jsx (App do Convertido)
* **Adicionado:** Links diretos para "Termos de Uso" e "Políticas de Privacidade" logo abaixo do checkbox da LGPD.
* **Adicionado:** Botão de Pin de Localização no Card da Igreja, gerando link dinâmico do Google Maps via URL scheme (busca por nome da igreja e bairro).
* **Modificado:** Campo "Sexo" no formulário restrito estritamente a `['Masculino', 'Feminino']`.
* **Modificado:** Botão do WhatsApp redimensionado para dividir layout em grid com o novo botão de localização.
* **Removido:** Rótulo/badge de denominação do Card da Igreja.
* **Removido:** Componentes sociais de likes e compartillhamentos do DOM do `VideoSlide`, além do estado `likedVideos`.
* **Removido:** Vídeo sobre batismo extirpado da lista de mocks de dados.

### TelaIgrejaParceira.jsx (Painel da Igreja)
* **Adicionado:** Regra de SLA Crítico via flag `isSlaBreached` (ativa quando status é "Esperando Contato" e tempo for >= 14 dias).
* **Adicionado:** Alerta visual estrutural no Card (background vermelho escuro) e badge "Alerta SLA (14+ dias)" com animação de pulso.
* **Modificado:** Trava condicional no botão "✨ Marcar como Membro Local" para renderizar exclusivamente quando o status da pessoa for `CONTACTADO`. No status `ESPERANDO`, exibe apenas botão de WhatsApp.

### TelaLideranca.jsx (Dashboard Executivo)
* **Adicionado:** Exportação para Excel via biblioteca `xlsx` na aba "Lista de Convertidos", acompanhada de botão utilitário visual verde.
* **Modificado:** Métrica KPI "Impactados na Rua" renomeada para "Total de Cadastros" na função `KpiRow`.
* **Modificado:** Tabela de monitoramento renomeada para "Monitoramento de Igrejas Parceiras", com contagem de funil por congregação (Encaminhados, Contactados, Membros).
* **Modificado:** Substituição do componente de mapa (`HeatmapPanel` em SVG) pelo `GeographicBarChartPanel` utilizando a biblioteca `recharts` (gráfico de barras horizontais agrupadas por Cidade e Zonas).
* **Removido:** Aba de Mapa de Calor do menu lateral de navegação.