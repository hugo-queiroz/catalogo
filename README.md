# 📦 Catálogo de Produtos — Vue 3 + Vite

Aplicação desenvolvida para desafio técnico **“Catálogo de Produtos**, seguindo os requisitos de responsividade, reatividade, acessibilidade, estado global, persistência e boas práticas.

A SPA permite **listar produtos, buscar, filtrar, favoritar, visualizar detalhes e simular carrinho**, com foco em **mobile-first**, velocidade e experiência do usuário.

---

## 🚀 Como rodar o projeto

Clone o repositório:

```bash
git clone https://github.com/hugo-queiroz/catalogo.git
```

Entre na pasta do projeto:

```bash
cd catalogo
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

Executar testes:

```bash
npm run test
```

---

## 🛠 Decisões Técnicas

- **Vue 3 + Composition API**: pela modularidade, reatividade aprimorada e clareza de código.
- **Vite**: escolhido pela performance, rapidez na inicialização e integração perfeita com Vue.
- **Pinia**: usado como gerenciador de estado por ser mais moderno e rápido que o Vuex.
- **TailwindCSS**: adotado para permitir estilização rápida, reutilizável e padronizada.
- **Vue Router**: para controlar navegação entre páginas (home, produto, favoritos).
- **Vitest + Testing Library**: utilizados para testes simples, rápidos e voltados à experiência do usuário.
- **Debounce (lodash.debounce)**: usado para otimizar buscas e filtros, evitando chamadas excessivas.
- **Componentização**: estrutura organizada com componentes reutilizáveis e fáceis de manter.
- **Acessibilidade**: uso de elementos semânticos, botões com atributos ARIA, modal com foco gerenciado, fechar com ESC, navegação fluida no teclado.

# Reatividade e Ciclo de Vida
### Debounce com cleanup  
Ao desmontar o componente, o timeout do debounce é limpo para evitar warnings.
### Listener de resize com cleanup  
Quando necessário, o evento `resize` é removido no `onUnmounted`.
### Sincronização com localStorage  
Tema, carrinho e favoritos usam `watch()` com persistência automática.
### AbortController  
Utilizado para cancelar buscas/fetch quando filtros mudam rapidamente.

---

## ⏳ O que faria se tivesse mais tempo

- Criaria testes unitários e de integração (ex: filtros, navegação, estado global).
- Criar animações mais detalhadas e micro-interações.
- Criar backend real em Node/Express.
- Adicionar CI/CD com GitHub Actions.
- Otimizaria o layout mobile com refinamento visual e microanimações.

---

## 📦 Scripts disponíveis

| Script | Função |
|--------|--------|
| `npm run dev`   | Executa o projeto em modo desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Faz o preview da build |
| `npm run test`  | Roda os testes com Vitest |
| `npm run test:ui` | Abre a interface gráfica de testes |

---

## 📁 Estrutura do projeto
src/
assets/
components/
pages/
router/
stores/ → Pinia (tema, carrinho, favoritos)
utils/
data/ → products.json / hook de dados
App.vue
main.js


---

## 📝 Licença

Projeto desenvolvido exclusivamente para fins de teste técnico.