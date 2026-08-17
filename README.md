# SemUmReal Mobile

<p align="center">
  <img src="docs/home.png" alt="Home do SemUmReal: resumo da conta e transações recentes" width="320" />
</p>

App mobile do **SemUmReal**, sistema de controle financeiro. Cliente React Native (Expo) para o backend Spring Boot — visual pixel art, P&B, feito para uso no bolso.

> *Seu dinheiro sem firula.*

Este repositório é o app **Android / iOS** (Expo Go). Faz parte do mesmo produto que a [API](https://github.com/JoseMarcosEfi) (hexagonal / DDD) e o front web Angular.

Status atual: **UI da Home com dados mock**. Ainda não consome a API. Projeto de estudo e portfólio.

## Screens

- **Home** — resumo da conta (gastos do mês + total geral) e transações recentes
- **Tab bar** — Início, Transações, Novo, Relatórios, Perfil (navegação ainda visual)

Dados de exemplo na Home: café, Uber, mercado — valores em BRL.

## Stack

| | |
|---|---|
| Runtime | [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/) |
| UI | React Native 0.81 + React 19 |
| Linguagem | TypeScript |
| Fonte | [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) |
| Ícones | [Pixelarticons](https://pixelarticons.com/) + `react-native-svg` |
| Layout | `react-native-safe-area-context` |

Design tokens (`src/theme/tokens.ts`) espelham o `styles.scss` do Angular: mesma paleta, espaçamento em múltiplos de 8 e tamanhos de ícone 16 / 24 / 48.

## Estrutura

```
App.tsx                         # fonte + safe area + tela inicial
src/
├── theme/                      # tokens (cor, espaço, fonte)
├── screens/
│   └── home/
│       ├── HomeScreen.tsx      # tela da Home
│       └── home-mock.ts        # dados fake (BRL)
└── components/
    ├── pixel-icon/             # ícones pixel (nativo + .web)
    └── tab-bar/                # barra inferior
```

## Como rodar

### Requisitos

- Node.js 20+
- npm
- [Expo Go](https://expo.dev/go) **SDK 54** no celular (Play Store / App Store)

### Instalação

```bash
git clone git@github.com:JoseMarcosEfi/SemUmReal-mobile.git
cd SemUmReal-mobile
npm install
npx expo start
```

No celular, abra o **Expo Go** e leia o QR (mesmo Wi-Fi do PC).  
Web: `npx expo start --web`.

Se o QR não conectar (firewall), libere a porta **8081 TCP** na rede particular, ou use USB:

```bash
adb reverse tcp:8081 tcp:8081
```

Depois, no Expo Go: `exp://127.0.0.1:8081`.

## Próximos passos

- Navegação real nas tabs (React Navigation)
- Login / JWT contra o backend Spring
- Trocar `home-mock.ts` por chamadas REST

## Autor

**José Marcos**

Projeto pessoal de aprendizado e demonstração de portfólio: app nativo alinhado ao mesmo produto e à API em arquitetura hexagonal.
