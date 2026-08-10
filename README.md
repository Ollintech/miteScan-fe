# 🐝 MiteScan - Front-end

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)

Interface web moderna para a plataforma **MiteScan**, um sistema desenvolvido para auxiliar apicultores na gestão de apiários e colmeias, além de realizar a identificação e monitoramento de infestações pelo ácaro *Varroa destructor* em colmeias através da captura de imagens/vídeo via câmera conectada.

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Detalhes de Implementação Chave](#-detalhes-de-implementação-chave)
- [Licença](#-licença)

---

## 🔍 Visão Geral


1. **Gerenciamento de Colmeias**: Cadastro, edição, listagem e remoção de colmeias com especificações do tipo de abelha.
2. **Localização no Mapa**: Mapeamento geográfico interativo das colmeias com geocodificação reversa.
3. **Conexão com Câmeras**: Reconhecimento e stream de vídeo de câmeras/dispositivos acoplados para análises em tempo real.
4. **Análises & Histórico**: Visualização dos diagnósticos de infestações de Varroa com relatórios históricos.
5. **Gestão de Usuários**: Sistema de controle de acesso (Root e Usuários Associados) com rotas protegidas.

---

## ✨ Funcionalidades Principais

### 🔒 Autenticação & Autorização
- Login para contas Root e Usuários Associados.
- Armazenamento seguro de tokens JWT no `localStorage`.
- Rotas públicas (`PublicRoute`), protegidas para usuários autenticados (`PrivateRoute`) e exclusivas para administradores (`AdminRoute`).

### 🐝 Gestão de Colmeias (CRUD)
- Cadastro de colmeias com nome, tipo de abelha, localização e câmera vinculada.
- Listagem detalhada das colmeias com estatísticas de análises recentes.
- Edição e remoção de colmeias registradas.

### 🗺️ Mapeamento Interativo (`MapSelect`)
- Seleção visual do local exato da colmeia sobre mapas da OpenStreetMap via **Leaflet**.
- Interceptação de eventos de clique (`useMapEvents`) para obtenção automática de latitude e longitude (`e.latlng`).
- Consulta à API **Nominatim** (OSM) para resolver automaticamente o nome da cidade baseando-se nas coordenadas selecionadas.

### 📷 Detecção de Câmera (`ConnectCamera`)
- Enumerador de dispositivos de entrada de vídeo (`navigator.mediaDevices.enumerateDevices`).
- Seleção e inicialização do fluxo de vídeo em tempo real (`navigator.mediaDevices.getUserMedia`).
- Transmissão dos dados da câmera para a tela de análise.

### 📊 Análises de Infestação de Varroa & Histórico
- Envio e processamento de solicitações de análise de saúde da colmeia.
- Exibição de cards explicativos e relatórios históricos de varroose por colmeia.

### 👥 Painel Administrativo de Usuários
- Cadastro de novos usuários associados (`/new-user`).
- Gerenciamento de acessos e permissões (`/users`, `/edit-user/:id`, `/delete-user/:id`).

---

## 🛠️ Tecnologias Utilizadas

- **Core**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Linguagem**: JavaScript (ES6+)
- **Roteamento**: [React Router DOM v7](https://reactrouter.com/)
- **Estilização & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Headless UI](https://headlessui.com/), [React Icons](https://react-icons.github.io/react-icons/)
- **Mapas & Geolocalização**: [Leaflet](https://leafletjs.com/), [React Leaflet v5](https://react-leaflet.js.org/), API OpenStreetMap (Nominatim)
- **Requisições HTTP**: [Axios](https://axios-http.com/)
- **Animações & Transições**: React Transition Group e Keyframes CSS
- **Qualidade de Código**: ESLint 9

---

## 📁 Arquitetura do Projeto

```text
miteScan-fe/
├── anotacoes.txt             # Anotações internas do projeto
├── LICENSE                   # Licença do repositório
├── README.md                 # Documentação principal
└── miteScan/                 # Aplicação React (Vite)
    ├── .env                  # Variáveis de ambiente
    ├── index.html            # Ponto de entrada HTML
    ├── package.json          # Dependências e scripts
    ├── vite.config.js        # Configuração do Vite
    └── src/
        ├── assets/           # Imagens e recursos estáticos
        ├── components/       # Componentes reutilizáveis
        │   ├── analysis/     # Componentes de análise e resultados
        │   ├── AuthForms/    # Formulários de Login/Registro e Rotas Protegidas
        │   ├── connectCamera/# Componente de conexão com câmera
        │   ├── FormsHives/   # Formulários de criar/editar/deletar colmeias
        │   ├── historical/   # Cards e histórico de análises
        │   ├── hives/        # Listagem de colmeias
        │   ├── home/         # Dashboard e resumos
        │   ├── mapselect/    # Mapa Leaflet para seleção de local
        │   └── user/         # Gerenciamento de usuários
        ├── pages/            # Telas da aplicação (Home, Login, Hives, etc.)
        ├── styles/           # Estilos globais CSS
        ├── App.jsx           # Definição de rotas e fluxo principal
        └── main.jsx          # Renderização do React no DOM
```

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **Node.js**: versão 18.0.0 ou superior
- **npm** (incluso no Node.js) ou **yarn** / **pnpm**
- Servidor Backend do MiteScan em execução (padrão em `http://localhost:8000`)

---

## 🚀 Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/miteScan-fe.git
   cd miteScan-fe
   ```

2. **Navegue até a pasta da aplicação e instale as dependências:**
   ```bash
   cd miteScan
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie ou edite o arquivo `.env` no diretório `miteScan/`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:5173` (ou porta indicada no terminal).

---

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | URL base do servidor backend API | `http://localhost:8000` |

---

## 📜 Scripts Disponíveis

No diretório `miteScan/`, você pode rodar os seguintes comandos:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Hot Reload via Vite. |
| `npm run build` | Compila os arquivos da aplicação para produção na pasta `dist`. |
| `npm run preview` | Executa localmente o build de produção para testes. |
| `npm run lint` | Executa a verificação estática de código com ESLint. |

---

## 💡 Detalhes de Implementação Chave

- **SplashScreen**: Animação de entrada desenvolvida com *keyframes* CSS + efeito no `useEffect` com tempo de transição definido para a inicialização da aplicação.
- **Integração com Câmeras**: Utilização da Web API nativa `navigator.mediaDevices` para listar câmeras ativas e capturar o *stream* ao vivo sem necessidade de plugins externos.
- **Geocodificação Reversa no Mapa**: Integração de eventos do `react-leaflet` com requisição HTTP em tempo real à API Nominatim do OpenStreetMap para conversão automática das coordenadas de latitude/longitude no nome do município correspondente.

---

## 📄 Licença

Este projeto é distribuído sob a licença definida no arquivo [LICENSE](LICENSE). Consulte o arquivo para obter mais detalhes.

