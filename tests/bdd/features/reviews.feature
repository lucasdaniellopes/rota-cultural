# language: pt
Funcionalidade: Sistema de Avaliações
  Como um usuário autenticado
  Eu quero avaliar pontos turísticos e eventos
  Para compartilhar minha experiência

  Contexto:
    Dado que estou autenticado como "usuario@teste.com"

  Cenário: Criar avaliação para ponto turístico
    Dado que existe um ponto turístico "Museu Histórico"
    Quando eu crio uma avaliação com:
      | campo   | valor                    |
      | rating  | 5                        |
      | title   | Excelente!               |
      | comment | Lugar muito interessante |
    Então a avaliação deve ser criada com sucesso
    E a avaliação deve ter nota 5

  Cenário: Listar avaliações de um local
    Dado que existe um ponto turístico "Praça Central"
    E existem 3 avaliações para este ponto
    Quando eu listo as avaliações do ponto
    Então devo ver 3 avaliações

  Cenário: Atualizar minha avaliação
    Dado que criei uma avaliação com nota 4
    Quando eu atualizo a nota para 5
    Então a avaliação deve ter nota 5

  Cenário: Deletar minha avaliação
    Dado que criei uma avaliação para "Igreja Matriz"
    Quando eu deleto minha avaliação
    Então a avaliação não deve mais existir

  Cenário: Validar nota entre 1 e 5
    Dado que existe um ponto turístico "Teatro Municipal"
    Quando eu tento criar uma avaliação com nota 6
    Então devo receber uma mensagem de erro
    E a avaliação não deve ser criada
