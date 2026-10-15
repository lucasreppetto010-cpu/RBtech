# RB Tech

Landing page da RB Tech — soluções digitais para o seu negócio.

- `index.html`: o site pronto para publicar (Netlify publica a raiz do repositório).
- `rb-tech.src.html`: o código-fonte da página, com marcadores para o logo, os prints e o link do WhatsApp.
- `build.ps1`: gera o `index.html` a partir do código-fonte, embutindo o logo e os prints de `shots/`.
- `mockup-sistema-ilustrativo.html`: tela ilustrativa de sistema de gestão guardada para uso futuro.

Para atualizar o site depois de editar `rb-tech.src.html`:

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```
