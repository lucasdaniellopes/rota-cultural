# language: pt
Funcionalidade: Autenticação de Usuário
  Como um visitante do sistema
  Eu quero me cadastrar e fazer login
  Para acessar funcionalidades autenticadas

  Cenário: Cadastro de novo usuário
    Dado que não existe um usuário com email "novo@teste.com"
    Quando eu me cadastro com os dados:
      | campo      | valor           |
      | email      | novo@teste.com  |
      | password   | Senha@123       |
      | full_name  | Novo Usuário    |
    Então o usuário deve ser criado com sucesso
    E o usuário deve estar ativo

  Cenário: Login com credenciais válidas
    Dado que existe um usuário com email "teste@teste.com" e senha "Senha@123"
    Quando eu faço login com email "teste@teste.com" e senha "Senha@123"
    Então eu devo receber um token de acesso
    E o token deve ser válido

  Cenário: Login com credenciais inválidas
    Dado que existe um usuário com email "teste@teste.com" e senha "Senha@123"
    Quando eu faço login com email "teste@teste.com" e senha "SenhaErrada"
    Então eu não devo receber um token de acesso
    E devo receber uma mensagem de erro

  Cenário: Cadastro com email duplicado
    Dado que existe um usuário com email "existente@teste.com"
    Quando eu tento me cadastrar com email "existente@teste.com"
    Então o cadastro deve falhar
    E devo receber uma mensagem de email já cadastrado
