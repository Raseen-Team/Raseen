# رسين: كود Lovable بتصميم رسين

This is the team's Lovable app (raseen-pulse-ai) with the Raseen design applied. The data and the page logic are unchanged. Only the look changed.

## What changed

| File | Change |
|---|---|
| `src/styles.css` | The deck palette (navy `#0B2432`, teal `#168B92`/`#3CC8CF`, mustard `#D5AD25`, paper `#F5F7F4`) and the Noto Kufi Arabic font |
| `src/components/raseen/shell.tsx` | A top menu instead of the sidebar, with a moving navy band (GLSL) behind the page header and an «ابدأ رصدًا» button |
| `src/components/raseen/blocks.tsx` | The page header sits on the band, and the number cards are quieter |
| `src/components/raseen/logo.tsx` | The Raseen logo from `public/brand/` |
| `src/routes/index.tsx` | The home header sits on the band |
| `src/routes/start.tsx` | New page: the orbit → radar → stories → story → brief flow, from `public/flow/index.html` |
| `src/routes/__root.tsx` | The font link |

## Run

```sh
bun install
bun run dev
```

`.preview/` holds a separate static build with hash routing, used only to share a preview link: `bunx vite build -c .preview/vite.config.ts`. Lovable does not use it.

## Next

`/start` loads the flow from a static HTML file for now. When the backend is ready, move these screens into React pages that read from the API.
