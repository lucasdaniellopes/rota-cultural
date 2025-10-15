@routing
Feature: Visualização de Rotas no Mapa
  Como usuário planejando minha visita,
  Eu quero ver a rota visualmente no mapa
  Para entender o trajeto e me orientar durante o percurso

  Scenario: Exibir rota calculada no mapa
    Given existem locations "Praça Centenário" e "Estação Rodoviária" no sistema
    And eu calculei a rota entre esses dois pontos
    When a rota é calculada com sucesso
    Then uma linha poligonal deve ser desenhada no mapa conectando os pontos
    And a linha deve ter cor azul
    And a linha deve ter espessura visível
    And o mapa deve centralizar na rota calculada

  Scenario: Exibir informações da rota
    Given eu calculei uma rota entre dois pontos
    When a rota é calculada com sucesso
    Then a distância total deve ser exibida em metros
    And o tempo estimado deve ser exibido em minutos
    And as informações devem ser formatadas de forma legível
    And as informações devem estar visíveis na interface

  Scenario: Remover rota do mapa
    Given uma rota está sendo exibida no mapa
    When eu clico em "Limpar Rota"
    Then a linha poligonal deve ser removida do mapa
    And as informações de distância e tempo devem desaparecer
    And o mapa deve voltar ao estado inicial

  Scenario: Rota com múltiplos segmentos
    Given eu calculei uma rota com três pontos: "A", "B" e "C"
    When a rota é calculada com sucesso
    Then segmentos devem ser desenhados conectando "A" → "B" e "B" → "C"
    And todos os segmentos devem ter a mesma cor e espessura
    And os marcadores devem permanecer visíveis para cada ponto

  Scenario: Erro na visualização da rota
    Given eu tentei calcular uma rota inválida
    When o sistema retorna erro da API OSRM
    Then nenhuma linha deve ser desenhada no mapa
    And mensagem de erro deve ser exibida para o usuário
    And os marcadores dos pontos devem permanecer visíveis