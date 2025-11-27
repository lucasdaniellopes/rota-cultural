# language: pt
Funcionalidade: Gerenciamento de Pontos Turísticos
  Como um usuário autenticado
  Eu quero gerenciar pontos turísticos
  Para compartilhar locais interessantes

  Contexto:
    Dado que estou autenticado como "usuario@teste.com"
    E existe uma categoria "Museu" do tipo "tourist_spot"

  Cenário: Criar novo ponto turístico
    Quando eu crio um ponto turístico com os dados:
      | campo         | valor                    |
      | name          | Museu Histórico          |
      | description   | Museu da cidade          |
      | opening_time  | 08:00:00                 |
      | closing_time  | 18:00:00                 |
    Então o ponto turístico deve ser criado com sucesso
    E o ponto deve ter o nome "Museu Histórico"

  Cenário: Listar pontos turísticos
    Dado que existem 3 pontos turísticos cadastrados
    Quando eu listo os pontos turísticos
    Então devo ver 3 pontos turísticos
    E todos devem ter nome e descrição

  Cenário: Buscar ponto turístico por nome
    Dado que existe um ponto turístico chamado "Igreja Matriz"
    Quando eu busco por "Igreja"
    Então devo encontrar o ponto "Igreja Matriz"

  Cenário: Atualizar ponto turístico
    Dado que existe um ponto turístico chamado "Praça Central"
    Quando eu atualizo o nome para "Praça Getúlio Vargas"
    Então o ponto deve ter o novo nome "Praça Getúlio Vargas"

  Cenário: Deletar ponto turístico
    Dado que existe um ponto turístico chamado "Local Temporário"
    Quando eu deleto o ponto turístico
    Então o ponto não deve mais existir
