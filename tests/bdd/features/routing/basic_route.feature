@routing
Feature: Planejamento de Rotas Básicas
  Como visitante da cidade,
  Eu quero selecionar pontos turísticos para calcular a rota entre eles
  Para otimizar meu deslocamento e tempo

  Scenario: Rota básica com dois pontos turísticos
    Given existem locations "Museu Histórico" e "Teatro Municipal" no sistema
    And o "Museu Histórico" está na coordenada [-7.0221, -37.2741]
    And o "Teatro Municipal" está na coordenada [-7.0305, -37.2819]
    When eu seleciono "Museu Histórico" como partida
    And eu seleciono "Teatro Municipal" como destino
    And eu clico em "Calcular Rota"
    Then o sistema deve calcular a rota usando OSRM
    And a rota deve ter uma distância maior que zero
    And a rota deve ter um tempo estimado maior que zero
    And a rota deve ser exibida visualmente no mapa

  Scenario: Tentar calcular rota sem selecionar partida
    Given existem locations "Museu Histórico" e "Teatro Municipal" no sistema
    When eu não seleciono nenhum ponto de partida
    And eu seleciono "Teatro Municipal" como destino
    And eu clico em "Calcular Rota"
    Then o sistema deve exibir erro "Selecione um ponto de partida"
    And nenhuma rota deve ser calculada

  Scenario: Tentar calcular rota sem selecionar destino
    Given existem locations "Museu Histórico" e "Teatro Municipal" no sistema
    When eu seleciono "Museu Histórico" como partida
    And eu não seleciono nenhum ponto de destino
    And eu clico em "Calcular Rota"
    Then o sistema deve exibir erro "Selecione um ponto de destino"
    And nenhuma rota deve ser calculada

  Scenario: Calcular rota com os mesmos pontos
    Given existe location "Museu Histórico" no sistema
    And o "Museu Histórico" está na coordenada [-7.0221, -37.2741]
    When eu seleciono "Museu Histórico" como partida
    And eu seleciono "Museu Histórico" como destino
    And eu clico em "Calcular Rota"
    Then o sistema deve exibir erro "Selecione pontos diferentes"
    And nenhuma rota deve ser calculada