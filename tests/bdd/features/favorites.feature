# language: pt
Funcionalidade: Sistema de Favoritos
  Como um usuário autenticado
  Eu quero favoritar pontos turísticos e eventos
  Para acessá-los rapidamente depois

  Contexto:
    Dado que estou autenticado como "usuario@teste.com"

  Cenário: Adicionar ponto turístico aos favoritos
    Dado que existe um ponto turístico "Museu do Cariri"
    Quando eu adiciono o ponto aos favoritos
    Então o ponto deve estar na minha lista de favoritos

  Cenário: Remover ponto dos favoritos
    Dado que tenho um ponto turístico "Praça Central" nos favoritos
    Quando eu removo o ponto dos favoritos
    Então o ponto não deve mais estar nos favoritos

  Cenário: Listar meus favoritos
    Dado que tenho 3 itens nos favoritos
    Quando eu listo meus favoritos
    Então devo ver 3 itens favoritos

  Cenário: Não permitir favorito duplicado
    Dado que existe um ponto turístico "Igreja Matriz"
    E o ponto já está nos meus favoritos
    Quando eu tento adicionar o mesmo ponto novamente
    Então devo receber uma mensagem de erro
    E deve continuar tendo apenas 1 favorito deste item
