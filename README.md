# 💬 Real-time Chat Application

**Disciplina:** Programação Web III || **Professor:** Rafael Jaques

---

## 📝 Visão Geral do Projeto

Este projeto consiste na construção de uma **Aplicação de Chat em Tempo Real** utilizando uma arquitetura baseada em **Go (Backend)** e **Next.js/TypeScript (Frontend)**. O foco central é a implementação do protocolo **WebSocket** para comunicação bidirecional e de baixa latência.

### **O Conceito: Arquitetura Central (O Hub)**

Diferente de uma API REST comum, este sistema mantém uma **conexão persistente** (WebSocket) entre o cliente e o servidor. O coração do *backend* em Go é o **Hub**, uma rotina concorrente (`goroutine`) que age como o centro de distribuição e gerenciamento:

1.  **Gerenciamento de Clientes:** O Hub utiliza *channels* (`Register` e `Unregister`) para rastrear e gerenciar os clientes ativos em diferentes salas (*Rooms*).
    * Um cliente, ao se conectar via o *endpoint* WebSocket (`/ws/joinRoom`), é registrado e adicionado à sua respectiva sala.

2.  **Distribuição de Mensagens (*Broadcast*):**
    * Cada cliente possui um método **`readMessage`** que escuta sua conexão WebSocket. Ao receber uma nova mensagem, ele a envia para o *channel* **`Broadcast`** do Hub.
    * O Hub recebe a mensagem do *channel* `Broadcast` e a distribui (**broadcasts**) para **todos os clientes** que estão na mesma sala.

3.  **Entrega Final:** Os clientes recebem a mensagem distribuída e utilizam seu método **`writeMessage`** para enviá-la ao *frontend*, onde é exibida instantaneamente.

---

## 💻 Tecnologias Envolvidas

| Categoria | Tecnologia | Uso no Projeto |
| :--- | :--- | :--- |
| **Backend** | **Go (Golang)** | Servidor de WebSockets, Concorrência (`goroutines`, `channels`) e o `Hub` de comunicação. |
| **Frontend** | **Next.js & React** | Construção da interface de usuário do chat. |
| **Tipagem** | **TypeScript** | Garante a tipagem de ponta a ponta (do Backend ao Frontend). |

---

## 🚀 Milestones do Projeto (Status)

O projeto está sendo construído em fases modulares. O primeiro *milestone* foca em estabelecer a base da linguagem e do servidor Go.

### **M1: 🎯 Setup e Ambientação com Go (Concluído)**

Esta fase inicial foi dedicada à construção da base da linguagem Go, essencial para a concorrência do M2.

* **Foco:** Aprender e aplicar a sintaxe e as estruturas de concorrência em Go.
* **Ações Concluídas:**
    * Setup do ambiente de desenvolvimento Go.
    * Estudo geral de **`goroutines`** e **`channels`** (os pilares do Hub).
    
### **M2: ⚡ WebSockets e Hub (Próxima Fase)**

(em desenvolvimento)

---
