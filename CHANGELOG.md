# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao versionamento semântico.

---

## [Unreleased] - 2026-08-12

### TelaConvertido.jsx (App do Convertido)
* **Adicionado:** Links diretos para "Termos de Uso" e "Políticas de Privacidade" logo abaixo do checkbox da LGPD.
* **Adicionado (Header do Card da Igreja):** Substituição do topo estático com ícone de templo por um container de **Prévia Interativa de Mapa** (tema escuro com pino vermelho centralizado). O container inteiro do topo atua como área clicável (`cursor: pointer`), redirecionando para o Google Maps via URL scheme utilizando o endereço exato/coordenadas da igreja cadastrada no banco de dados. A badge de distância (`1.2 km de você`) é mantida flutuando no canto superior direito sobre o mapa.
* **Modificado:** Campo "Sexo" no formulário restrito estritamente a `['Masculino', 'Feminino']`.
* **Mantido (Rodapé do Card da Igreja):** Botão do WhatsApp intacto em largura total (full-width), sem dividir espaço em grid com outros botões.
* **Mantido:** Rótulo/badge de denominação no Card da Igreja (ex: "Presbiteriana").
* **Removido:** Componentes sociais de likes e compartilhamentos do DOM do `VideoSlide`, além do estado `likedVideos`.
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