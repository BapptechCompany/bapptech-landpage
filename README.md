# Landing page Bapptech

Landing page responsiva e sem dependências externas, baseada no manual de identidade visual oficial da Bapptech.

Revisão SEO e identidade: 2026-07-26.

## Conteúdo do pacote

- `index.html`: estrutura semântica, metadados SEO, Open Graph, Twitter Card e JSON-LD em `@graph`.
- `styles.css`: layout responsivo, tokens oficiais Bapptech, animações progressivas, acessibilidade e suporte a `prefers-reduced-motion`.
- `script.js`: menu móvel, animações de entrada com fallback, navegação ativa e formulário para WhatsApp.
- `robots.txt` e `sitemap.xml`: arquivos básicos para rastreamento.
- `site.webmanifest`, favicons e Open Graph oficiais.
- `404.html`: página de erro simples e alinhada à identidade.

## Publicação

O projeto pode ser publicado como site estático em Azure Static Web Apps, Azure Storage Static Website, GitHub Pages, Cloudflare Pages, Netlify, Vercel ou servidor web tradicional.

Para testar localmente:

```bash
python -m http.server 8080
```

Abra `http://localhost:8080`.

## SEO após a publicação

1. Verifique se o site responde em `https://bapptech.com.br/` e redireciona versões alternativas para uma única URL canônica.
2. Cadastre o domínio no Google Search Console.
3. Envie `https://bapptech.com.br/sitemap.xml` no Search Console.
4. Valide os dados estruturados de organização, serviço, página e FAQ no Rich Results Test.
5. Meça LCP, INP e CLS com PageSpeed Insights e dados reais do Chrome UX Report quando houver tráfego.
6. Crie páginas próprias para cada serviço e conteúdos úteis sobre dúvidas reais dos clientes. Uma única landing page pode indexar, mas páginas específicas aumentam a cobertura de pesquisas relevantes.
7. Conecte o formulário a um backend ou CRM quando precisar armazenar leads; a versão atual apenas abre o WhatsApp e não grava dados.

## Dados usados

- Domínio: `bapptech.com.br`
- E-mail: `contato@bapptech.com.br`
- WhatsApp: `(11) 92273-7502`
- Localidade: São Paulo — SP

## Observação

As imagens em `assets/` foram copiadas diretamente do pacote oficial fornecido. Não altere as cores internas, proporções ou efeitos da marca.
