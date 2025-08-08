# API - Desafio E-commerce

API RESTful desenvolvida como parte de um desafio de e-commerce. Construída com Node.js, Fastify e TypeScript, esta API oferece uma base para gerenciar lentes.

## ✨ Funcionalidades

- **CRUD**: Criação, leitura, atualização e exclusão de lentes.
- **Banco de Dados**: Integração com [SQLite](https://www.sqlite.org/index.html) através do query builder [Knex.js](https://knexjs.org/) para gerenciamento de migrações e consultas.
- **Validação de Dados**: Schemas e validação de entrada seguros e explícitos com [Zod](https://zod.dev/).
- **Documentação de API**: Geração automática de documentação interativa com [Swagger (OpenAPI)](https://swagger.io/).
- **Tipagem Estática**: Totalmente escrita em [TypeScript](https://www.typescriptlang.org/) para um código mais seguro e de facil manutenção.
- **Testes Automatizados**: Ambiente de testes configurado com [Vitest](https://vitest.dev/) e [Supertest](https://github.com/ladjs/supertest) para garantir a estabilidade da API.

## 🛠️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [Knex.js](https://knexjs.org/)
- [SQLite3](https://www.sqlite.org/index.html)
- [Zod](https://zod.dev/)
- [Vitest](https://vitest.dev/)
- [Dotenv](https://github.com/motdotla/dotenv)
- [Swagger (OpenAPI)](http://swagger.io/)

## 🚀 Começando

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

### Instalação

1.  Clone o repositório para sua máquina local:

    ```bash
    git clone <url-do-seu-repositorio>
    cd desafio-e-commerce
    ```

2.  Instale as dependências do projeto:

    ```bash
    npm install
    ```

3.  Crie uma cópia do arquivo de ambiente de exemplo:

    ```bash
    cp .env.example .env
    ```

    _Observação: Se você não tiver um `.env.example`, crie um arquivo `.env` na raiz do projeto. Ele é usado para carregar as variáveis de ambiente (como a porta do servidor)._

4.  Execute as migrações do banco de dados para criar as tabelas necessárias:
    ```bash
    npm run -- knex:migrate:latest
    ```

### Executando a Aplicação

- **Modo de Desenvolvimento**

  Para iniciar o servidor em modo de desenvolvimento com hot-reload (reinicia automaticamente ao salvar alterações):

  ```bash
  npm run dev
  ```

  O servidor estará disponível em `http://localhost:3333` (ou a porta que você definir no seu arquivo `.env`).

- **Executando os Testes**

  Para rodar a suíte de testes automatizados:

  ```bash
  npm test
  ```

## 📖 Documentação da API

Após iniciar o servidor, a documentação da API gerada pelo Swagger estará disponível. Você pode acessá-la e interagir com os endpoints através do seu navegador:

- **URL da Documentação**: http://localhost:3333/doc
