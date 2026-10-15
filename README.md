<div align="center">

# RB Tech · Landing Page

**Site institucional da RB Tech, empresa de soluções digitais.**
Projeto de design e desenvolvimento front-end, feito do zero com HTML, CSS e JavaScript puros.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

<br>

![Topo do site da RB Tech](docs/hero.jpg)

</div>

---

## Sobre o projeto

A RB Tech precisava de uma página que apresentasse a empresa, mostrasse todos os serviços e transformasse visitantes em pedidos de orçamento pelo WhatsApp. O resultado é uma landing page de uma só página, com identidade visual em preto e azul elétrico baseada no logo da marca.

A página foi pensada para vender. Ela começa com a proposta de valor, apresenta a empresa e os serviços, mostra projetos reais já entregues e termina com chamadas diretas para contato.

## Destaques técnicos

- **Sem frameworks nem dependências.** O site inteiro é um único `index.html`, com CSS e JavaScript escritos à mão. Carrega rápido e pode ser hospedado em qualquer lugar.
- **Animação em Canvas.** O fundo do topo é uma rede de pontos conectados, desenhada em `<canvas>` com `requestAnimationFrame`, que reage ao movimento do mouse.
- **Layout responsivo.** CSS Grid e Flexbox com `clamp()` para tipografia fluida, testado da largura de celular ao monitor grande, sem rolagem lateral.
- **Design system com variáveis CSS.** Cores, fontes e espaçamentos definidos como tokens em `:root` e reaproveitados em todo o projeto, incluindo `color-mix()` para variações de cor.
- **Micro-interações.** Efeito de luz que acompanha o cursor nos cards, logo que reage ao mouse, revelação suave das seções com `IntersectionObserver` e faixa animada de serviços.
- **Acessibilidade.** HTML semântico, textos alternativos nas imagens, foco visível no teclado e respeito à preferência `prefers-reduced-motion`, que desliga as animações para quem pede.
- **SEO e compartilhamento.** Meta tags Open Graph, dados estruturados `schema.org` em JSON-LD e `robots.txt` para indexação no Google.
- **Conversão.** Botões de WhatsApp com mensagem pronta, botão flutuante fixo, número com cópia em um clique e Instagram em destaque.

## Seções da página

| Seção | Objetivo |
| --- | --- |
| Topo | Proposta de valor, chamadas para orçamento e Instagram |
| Quem somos | Apresentação da empresa, missão e jeito de trabalhar |
| Serviços | Grade com todos os serviços oferecidos |
| Por que a RB Tech | Diferenciais da empresa |
| Como funciona | Processo de trabalho em quatro etapas |
| Projetos realizados | Sistema de gestão e sites de clientes, com links |
| Instagram | Destaque para o perfil onde a empresa publica os projetos |
| Contato | WhatsApp, telefone e Instagram |

<details>
<summary><strong>Ver mais telas</strong></summary>
<br>

**Serviços**

![Seção de serviços](docs/servicos.jpg)

**Projetos realizados**

![Seção de projetos realizados](docs/projetos.jpg)

</details>

## Projetos apresentados no site

Trabalhos reais da RB Tech que aparecem na seção de portfólio:

| Projeto | Segmento | Link |
| --- | --- | --- |
| SB Barbearia | Barbearia | [sb-barbearia.netlify.app](https://sb-barbearia.netlify.app/) |
| Ultra Sorriso | Odontologia | [ultrasorriso.netlify.app](https://ultrasorriso.netlify.app/) |
| Almada Outlet | Loja virtual | [almada-outlet.onrender.com](https://almada-outlet.onrender.com/) |
| Koreia Barber Shop | Barbearia | [koreiabarbershop.netlify.app](https://koreiabarbershop.netlify.app/) |
| CR Cleaning | Limpeza (EUA) | [cr-cleaning.netlify.app](https://cr-cleaning.netlify.app/) |
| StoreVault | Sistema de gestão para desktop | PDV, caixa, estoque, financeiro e importação de XML de NF-e |

## Como rodar localmente

Não há instalação nem etapa de build. Basta abrir o `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
npx http-server@14.1.1 -p 5178 .
```

Depois acesse `http://localhost:5178`.

## Estrutura

```
.
├── index.html   # o site completo (HTML, CSS, JS e imagens embutidas)
├── robots.txt   # regras de indexação para buscadores
└── docs/        # imagens usadas neste README
```

## Autor

**Lucas Reppetto** · fundador da RB Tech

Desenvolvo sites, landing pages, lojas virtuais e sistemas de gestão para pequenas e médias empresas.

[![Instagram](https://img.shields.io/badge/Instagram-@tech.rb7-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/tech.rb7/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-(55)%2099682--2565-25D366?style=flat-square&logo=whatsapp&logoColor=white)](https://wa.me/5555996822565)
[![GitHub](https://img.shields.io/badge/GitHub-lucasreppetto010--cpu-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/lucasreppetto010-cpu)
