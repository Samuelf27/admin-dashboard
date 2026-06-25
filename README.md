<h1 align="center">📊 Admin Dashboard — React + TypeScript</h1>

<p align="center">
Painel administrativo de nível profissional: autenticação, CRUD completo, tabela de dados, gráficos e dark mode.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white"/>
  <img src="https://github.com/Samuelf27/admin-dashboard/actions/workflows/deploy.yml/badge.svg"/>
</p>

<p align="center">
  <a href="https://samuelf27.github.io/admin-dashboard/"><b>🔗 Ver demo ao vivo</b></a>
  &nbsp;·&nbsp; 🔑 <code>admin@empresa.com</code> / <code>123456</code>
</p>

<p align="center"><img src="https://raw.githubusercontent.com/Samuelf27/admin-dashboard/main/preview.png" alt="Preview do painel" width="820" /></p>

---

## 📌 Sobre o projeto

Um **painel administrativo completo** como os usados em produtos corporativos — o tipo de interface presente em praticamente toda empresa de software. Construído com foco em **boas práticas**, tipagem forte e uma camada de API desacoplada (pronta para plugar um back-end real).

## ✨ Funcionalidades

- 🔐 **Autenticação** com rota protegida e sessão persistida
- 👥 **CRUD completo de usuários** — criar, editar e remover com **modal e validação**
- 🔎 **Tabela de dados** com **busca**, **ordenação por coluna** e **paginação**
- 📈 **Dashboard** com KPIs e gráficos (área e pizza) via Recharts
- 🌗 **Dark mode** persistente + design totalmente **responsivo**
- 🔔 Sistema de **toasts**, estados de **carregamento** (skeletons) e vazio
- ⚙️ **CI/CD** — build e deploy automáticos no GitHub Pages via GitHub Actions

<p align="center"><img src="https://raw.githubusercontent.com/Samuelf27/admin-dashboard/main/preview-users.png" alt="Tela de usuários (CRUD)" width="820" /></p>

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite |
| Estilo | Tailwind CSS (dark mode por classe) |
| Rotas | React Router |
| Gráficos | Recharts |
| Ícones | lucide-react |
| CI/CD | GitHub Actions → GitHub Pages |

## 🏗️ Arquitetura

```
src/
├── lib/
│   ├── api.ts        # camada de dados (mock com latência; troque por API real)
│   ├── auth.tsx      # contexto de autenticação
│   ├── theme.ts      # hook de tema (dark mode)
│   └── types.ts      # tipos de domínio
├── components/       # Layout, Toast, Modal, StatCard, ProtectedRoute
└── pages/            # Login, Dashboard, Users (CRUD), Settings
```

> 💡 A `api.ts` foi desenhada para ser substituída por um back-end real (como a [br-validator-api](https://github.com/Samuelf27/br-validator-api)) sem alterar os componentes.

## 🚀 Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (typecheck + bundle)
```

## 📄 Licença

[MIT](LICENSE) © Samuel Ferreira

---

<p align="center">
  <a href="https://github.com/Samuelf27">GitHub</a> · <a href="https://www.linkedin.com/in/samuel-ferreira27/">LinkedIn</a>
</p>
