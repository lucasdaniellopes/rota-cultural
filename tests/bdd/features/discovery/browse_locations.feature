@discovery
Feature: Descoberta de Pontos Turísticos
  Como usuário explorando a cidade,
  Eu quero visualizar todos os pontos turísticos disponíveis
  Para encontrar lugares interessantes para visitar

  Scenario: Listar todos os pontos turísticos disponíveis
    Given existem múltiplos locations cadastrados no sistema
    When eu acesso a página principal do mapa
    Then todos os locations devem ser exibidos como marcadores no mapa
    And cada marcador deve estar na posição geográfica correta
    And ao clicar em um marcador, deve exibir o nome do local

  Scenario: Buscar local por nome
    Given existem locations "Museu Histórico", "Teatro Municipal" e "Parque da Cidade"
    When eu busco por "Museu"
    Then apenas locations com "Museu" no nome devem ser destacados
    And outros locations devem permanecer visíveis mas não destacados

  Scenario: Sistema está vazio
    Given não existem locations cadastrados
    When eu acesso a página principal
    Then deve ser exibida mensagem "Nenhum ponto turístico cadastrado"
    And o mapa deve estar vazio de marcadores

  Scenario: Localização com coordenadas inválidas
    Given existe location "Local Inválido" com coordenadas nulas
    When eu acesso a página principal
    Then o "Local Inválido" não deve ser exibido no mapa
    And deve ser exibido aviso sobre local com coordenadas inválidas

  Scenario: Carregar múltiplos locations
    Given existem 10 locations cadastrados no sistema
    When eu acesso a página principal
    Then todos os 10 locations devem ser carregados
    And o tempo de carregamento deve ser inferior a 3 segundos
    And a interface deve permanecer responsiva durante o carregamento