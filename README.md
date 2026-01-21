# Jornal da UFC 📰

Um portal de notícias digital moderno e dinâmico, desenvolvido para conectar a comunidade acadêmica da Universidade Federal do Ceará (UFC) com eventos, pesquisas e oportunidades. Focado em **Experiência do Usuário (UX)** e um design visual impactante (**Glassmorphism**).

## ✨ Funcionalidades

### 🏠 Portal Público
- **Feed de Notícias**: Listagem cronológica com carregamento rápido.
- **Notícia em Destaque**: Espaço nobre na Home para a matéria mais relevante da semana.
- **Categorias**: Filtragem por Eventos, Pesquisa, Extensão, Editais e Geral.
- **Interação**:
  - Sistema de **curtidas persistentes** (sincronizadas com a conta do usuário).
  - Botão de **compartilhamento** nativo.
  - Barra lateral com **"Outras Notícias"** dinâmicas.

### ⚙️ Painel de Gestão (Admin)
- **CMS Completo**: Criação, edição e exclusão de notícias.
- **Moderação**: Sistema de status **Rascunho** (Draft) vs **Publicado**.
- **Gestão de Destaques**: Seletor exclusivo para definir a notícia principal da capa.
- **Upload de Imagens**: Integração automática com Google Drive para hospedagem de capas.
- **Visibilidade por Papel**: Usuários comuns veem apenas suas próprias postagens; Admins veem tudo.

## 🚀 Tecnologias Utilizadas

- **Core**: Next.js 15 (App Router), React.
- **Estilização**: CSS Modules, Design System próprio (Variáveis CSS), Glassmorphism.
- **Banco de Dados**: MongoDB (via Mongoose).
- **Integrações**: Google Drive API (Armazenamento de imagens).

## 🛠️ Como Rodar Localmente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/adailtonbsf/ufc-news-portal.git
   cd ufc-news-portal
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Renomeie o arquivo `.env.example` para `.env` e preencha as chaves necessárias:
   - `MONGODB_URI`: Sua string de conexão do MongoDB Atlas.
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.: Para upload de imagens (opcional, pode funcionar apenas com URLs externas se preferir).

4. **Execute o Projeto**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

## 🔐 Acesso ao Admin

Para acessar o painel administrativo na versão de demonstração:
1. Clique em **Login** no cabeçalho.
2. Utilize as credenciais de teste (ou crie uma conta):
   - **Email**: `admin@ufc.br`
   - **Senha**: `admin123`

---
Desenvolvido como parte do projeto da disciplina de Gerência de Projetos.
