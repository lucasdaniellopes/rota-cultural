@routing
Feature: Roteiro com Múltiplas Paradas
  Como turista planejando meu dia,
  Eu quero adicionar várias paradas ao meu roteiro
  Para otimizar meu tempo na cidade e visitar múltiplos locais

  Scenario: Rota com três pontos turísticos
    Given existem locations "Museu Histórico", "Igreja Matriz" e "Teatro Municipal" no sistema
    And o "Museu Histórico" está na coordenada [-7.0221, -37.2741]
    And a "Igreja Matriz" está na coordenada [-7.0250, -37.2778]
    And o "Teatro Municipal" está na coordenada [-7.0305, -37.2819]
    When eu adiciono "Museu Histórico" como primeira parada
    And eu adiciono "Igreja Matriz" como segunda parada
    And eu adiciono "Teatro Municipal" como terceira parada
    And eu clico em "Calcular Rota"
    Then o sistema deve calcular uma rota completa passando pelos três pontos
    And a rota deve ter distância acumulada maior que a rota entre apenas dois pontos
    And a rota deve ter tempo estimado acumulado maior que a rota entre apenas dois pontos
    And a rota deve ser exibida visualmente com múltiplos segmentos

  Scenario: Adicionar e remover paradas do roteiro
    Given existem locations "Museu Histórico", "Teatro Municipal" e "Parque da Cidade" no sistema
    And eu adicionei "Museu Histórico" ao meu roteiro
    And eu adicionei "Teatro Municipal" ao meu roteiro
    When eu adiciono "Parque da Cidade" como terceira parada
    Then o roteiro deve conter três paradas
    When eu removo "Teatro Municipal" do roteiro
    Then o roteiro deve conter apenas duas paradas
    And "Museu Histórico" deve continuar na primeira posição
    And "Parque da Cidade" deve estar na segunda posição

  Scenario: Reordenar paradas do roteiro
    Given existem locations "Museu", "Igreja" e "Teatro" no sistema
    And eu adicionei "Museu" como primeira parada
    And eu adicionei "Igreja" como segunda parada
    And eu adicionei "Teatro" como terceira parada
    When eu movo "Teatro" para a segunda posição
    Then a ordem do roteiro deve ser: "Museu", "Teatro", "Igreja"
    And o sistema deve recalcular a rota com a nova ordem

  Scenario: Limpar todas as paradas do roteiro
    Given eu tenho múltiplas paradas no meu roteiro
    When eu clico em "Limpar Roteiro"
    Then todas as paradas devem ser removidas
    And o roteiro deve estar vazio
    And nenhuma rota deve ser exibida no mapa