
## Branches

Duas branches permanentes, e só duas:

| Branch | O que é |
| --- | --- |
| **`dev`** | Onde o trabalho acontece. É a branch **padrão** — mande seu PR para cá. |
| **`main`** | O que está publicado (npm / GitHub Pages). Só recebe merge de PR vindo da `dev`. |

**Contribuindo de fora?** Abra o PR contra a `dev`. Como ela é a branch padrão, é
o alvo que o GitHub já sugere.

`main` é protegida: push direto, force push e exclusão estão bloqueados, e todo
merge exige PR. Um PR para `main` vindo de qualquer branch que não seja `dev` é
reprovado por
[`.github/workflows/fluxo-de-branches.yml`](.github/workflows/fluxo-de-branches.yml).

Branch temporária é exceção, não fluxo: nasce de `dev`, volta para `dev`, e é
apagada no merge. Ela nunca fala com `main`.

### Publicar uma versão

```bash
gh pr create --base main --head dev --title "Release: <o que vai sair>"
# com o CI verde, mergeie — e depois traga a main de volta para a dev:
git checkout dev && git merge main && git push origin dev
```

O último passo não é opcional. O merge de promoção cria um commit que só existe na
`main`, e eles acumulam até esconder alguma coisa de verdade no meio do ruído.
