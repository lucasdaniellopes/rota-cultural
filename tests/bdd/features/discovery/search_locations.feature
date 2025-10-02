@discovery
Feature: Busca de Pontos Turísticos
  Como usuário procurando lugares específicos,
  Eu quero buscar pontos turísticos por nome ou característica
  Para encontrar rapidamente o que procuro

  Scenario: Busca por nome exato
    Given existem locations "Museu Histórico", "Museu de Arte Moderna" e "Teatro Municipal"
    When eu digito "Museu Histórico" na busca
    Then apenas o "Museu Histórico" deve ser retornado nos resultados
    And o resultado deve ser destacado no mapa

  Scenario: Busca por termo parcial
    Given existem locations "Centro Cultural", "Casa de Cultura" e "Shopping Center"
    When eu digito "Cultura" na busca
    Then "Centro Cultural" e "Casa de Cultura" devem ser retornados
    And "Shopping Center" não deve ser retornado

  Scenario: Busca sem resultados
    Given existem locations "Museu", "Teatro" e "Parque"
    When eu digito "Biblioteca" na busca
    Then nenhum resultado deve ser retornado
    And deve ser exibida mensagem "Nenhum local encontrado"
    And todos os marcadores devem permanecer visíveis no mapa

  Scenario: Busca vazia
    Given existem múltiplos locations cadastrados
    When eu deixo o campo de busca vazio
    Then todos os locations devem ser exibidos
    And nenhum filtro deve ser aplicado

  Scenario: Busca com caracteres especiais
    Given existe location "Centro de Convenções"
    When eu digito "Centro de" na busca
    Then o "Centro de Convenções" deve ser retornado
    And a busca deve ignorar maiúsculas e minúsculas

  Scenario: Busca durante carregamento
    Given a busca está sendo processada
    When eu digito um termo de busca
    Then deve ser exibido indicador de carregamento
    And a interface deve permanecer responsiva
    And os resultados devem aparecer quando a busca for concluída