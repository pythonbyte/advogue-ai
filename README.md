# Advogue.ai — site

Landing estática para [advogue.ai](https://advogue.ai). GitHub Pages + lista de espera.

## Publicar

```bash
git init -b main
git add .
git commit -m "Landing Advogue.ai"
gh repo create pythonbyte/advogue-ai --public --source=. --remote=origin --push
```

No GitHub: **Settings → Pages → Deploy from a branch → `main` / root**.

Ou:

```bash
gh api repos/pythonbyte/advogue-ai/pages -f build_type=legacy -f source[branch]=main -f source[path]=/
```

A URL temporária fica `https://pythonbyte.github.io/advogue-ai/`. Com o domínio apontado, passa a ser `https://advogue.ai`.

## DNS (domínio apex)

Na registradora de `advogue.ai`:

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `pythonbyte.github.io` |

Depois, em **Pages → Custom domain**, coloque `advogue.ai` e marque HTTPS. O arquivo `CNAME` neste repositório já declara o domínio.

## Lista de espera

O formulário envia para o e-mail em `config.js` via [FormSubmit](https://formsubmit.co/).

1. Coloque o seu e-mail pessoal em `config.js` (não use e-mail de empresa antiga).
2. O **primeiro** envio pede confirmação no e-mail (cheque spam).
3. Os seguintes chegam como mensagem `Lista de espera Advogue.ai`.
