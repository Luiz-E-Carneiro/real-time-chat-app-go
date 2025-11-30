# 💬 Real-time Chat Application

**Disciplina:** Programação Web III || **Professor:** Rafael Jaques

---

## 📝 Visão Geral do Projeto

Este projeto consiste na construção de uma **Aplicação de Chat em Tempo Real** utilizando uma arquitetura baseada em **Go (Backend)** e **Next.js/TypeScript (Frontend)**. O foco central é a implementação do protocolo **WebSocket** para comunicação bidirecional e de baixa latência.

### **O Conceito: Arquitetura Central (O Hub)**

O back-end em Go é estruturado para manter uma **conexão persistente** (WebSocket) entre o cliente e o servidor. O coração do sistema é o **Hub**, uma rotina concorrente (`goroutine`) responsável pela distribuição e gerenciamento de clientes:

1.  **Gerenciamento de Clientes:** O Hub utiliza *channels* (`Register` e `Unregister`) para rastrear e gerenciar os clientes ativos.
    * Um cliente é registrado e adicionado à sua respectiva sala (*Room*) após conectar via o *endpoint* WebSocket (`/ws/joinRoom`).

2.  **Distribuição de Mensagens (*Broadcast*):**
    * O método **`readMessage`** do cliente escuta a conexão e envia novas mensagens para o *channel* **`Broadcast`** do Hub.
    * O Hub distribui a mensagem do *channel* `Broadcast` para **todos os clientes** que estão na mesma sala.

3.  **Entrega Final:** Os clientes usam o método **`writeMessage`** para enviar a mensagem distribuída ao *frontend*, onde é exibida instantaneamente.

---

## 💻 Tecnologias Envolvidas

| Categoria | Tecnologia | Uso no Projeto |
| :--- | :--- | :--- |
| **Backend** | **Go (Golang)** | Servidor de WebSockets, Concorrência (`goroutines`, `channels`) e o `Hub` de comunicação. |
| **Frontend** | **Next.js & React** | Construção da interface de usuário do chat. |
| **Tipagem** | **TypeScript** | Garante a tipagem de ponta a ponta (do Backend ao Frontend). |
| **Banco de Dados** | **PostgreSQL** | Persistência de dados de usuários e mensagens. |

---

## 🚀 Milestones do Projeto (Status)

O projeto está sendo construído em fases modulares, seguindo a arquitetura em camadas (Handler, Service, Repository).

### **M1: 📘 Setup, Estudo e Ambientação com Go (Concluído)**

Fase inicial dedicada ao setup do ambiente e à base da linguagem.

* **Foco:** Instalação e aprofundamento nos conceitos essenciais de Go.
* **Ações Concluídas:**
    * Instalação e configuração do Go e Docker na máquina de desenvolvimento.
    * Estudo e aplicação dos fundamentos da sintaxe e estruturas da linguagem Go.

### **M2: 🔌 Configuração DB e Usuários (Concluído)**

Fase de estabelecimento da persistência e da primeira camada do domínio (usuário).

* **Foco:** Conexão com o banco de dados e implementação da arquitetura em camadas.
* **Ações Concluídas:**
    * Setup do banco de dados **PostgreSQL** via Docker.
    * Implementação da **Arquitetura em Camadas** (Handler, Service, Repository) no módulo `user`.
    * Criação e teste dos endpoints de autenticação: **Sign Up**, **Login** e **Log Out**.
    * Uso de **`golang-migrate`** para gerenciar o schema da tabela `users`.

### **M3: 🔑 Autenticação e Lógica de Negócios (Concluído)**

Fase de finalização do domínio do usuário com lógica de segurança e implementação do Service.

* **Foco:** Implementação da camada Service e validação de segurança.
* **Ações Concluídas:**
    * Implementação da lógica de **Hashing de Senhas** (bcrypt).
    * Configuração da geração e uso de **JWT** (JSON Web Tokens).
    * Configuração de autenticação via **Cookies HTTP-Only**.
    * Conclusão e integração de todas as camadas do módulo `user`.
