# 🏐 Placar de Vôlei

Placar digital para partidas de vôlei, desenvolvido como **PWA** (Progressive Web App) — funciona no navegador e pode ser instalado como app no celular Android.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8?style=flat-square&logo=pwa)

---

## ✨ Funcionalidades

- **Placar full-screen** — tela dividida 50/50, azul (Time A) e vermelho (Time B)
- **Pontuação automática** — detecta fim de set e fim de partida automaticamente
- **Indicador de saque** — mostra qual time está sacando
- **Histórico de sets** — placar de cada set encerrado exibido na barra inferior
- **Controle manual de sets** — botões `+` e `−` para corrigir sets manualmente
- **Nomes editáveis** — toque no nome do time para editar
- **Animação de set** — flash na tela quando um set é vencido
- **Configurações personalizáveis** — altere as regras sem precisar mexer no código
- **Funciona offline** — após instalado, não precisa de internet ou PC ligado

---

## ⚙️ Configurações

Toque no ícone de engrenagem (⚙) na barra inferior para ajustar:

| Configuração | Padrão | Descrição |
|---|---|---|
| Pontos para vencer o set | 25 | Quantos pontos encerram um set |
| Pontos para vencer o 5º set | 15 | Regra especial para o set decisivo |
| Diferença mínima | 2 | Vantagem mínima para vencer o set |

> Salvar as configurações reinicia a partida automaticamente.

---

## 📱 Instalando no celular (Android)

### Opção 1 — Via Vercel (recomendado)

1. Acesse o link do app no Chrome do celular
2. Toque em **⋮ → Instalar aplicativo**
3. Pronto — o app aparece na tela inicial e funciona offline

### Opção 2 — Via rede local (sem internet)

1. PC e celular na mesma rede Wi-Fi
2. Rode `npm run build && npm start` no PC
3. Descubra o IP do PC com `ipconfig`
4. Acesse `http://SEU_IP:3000` no Chrome do celular
5. Toque em **⋮ → Adicionar à tela inicial**

---

## 🚀 Rodando localmente

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção (gera o service worker)
npm run build
npm start
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tecnologias

- [Next.js 16](https://nextjs.org/) — framework React com App Router
- [Tailwind CSS 4](https://tailwindcss.com/) — estilização
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) — service worker e suporte a PWA

---

## 📋 Regras implementadas

- Partida: melhor de **5 sets** (primeiro a vencer 3)
- Sets 1–4: vence quem chegar a **25 pontos** com **2 de vantagem**
- 5º set: vence quem chegar a **15 pontos** com **2 de vantagem**
- Todos os valores são configuráveis pelo painel de configurações

---

## 📄 Licença

MIT
