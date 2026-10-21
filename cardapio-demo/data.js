// Pizzaria fictícia de demonstração (RB Tech): tudo que muda de uma loja para outra fica aqui.
window.LOJA = {
  nome: "Forno & Lenha Pizzaria",
  slogan: "Pizza artesanal no forno a lenha",
  cidade: "Delivery na sua região",
  whatsapp: "5555996822565",
  instagram: "tech.rb7",
  logo: "img/logo.svg",
  capa: "img/u12.jpg",
  aviso: "Cardápio de demonstração criado pela RB Tech · Os pedidos de teste chegam no WhatsApp da RB Tech",
  // dias: 0 = domingo ... 6 = sábado
  horario: { dias: [0, 1, 2, 3, 4, 5, 6], abre: "19:30", fecha: "00:00", texto: "Todos os dias, das 19h30 à meia-noite" },
  tempoEntrega: "40 a 60 min",
  taxaEntrega: "a combinar pelo WhatsApp",
  cores: { fundo: "#0c0c0c", destaque: "#e3262b", verde: "#2bb24c", amarelo: "#f6c21c" },
};

window.TAMANHOS = [
  { id: "M", nome: "Média", info: "6 fatias" },
  { id: "G", nome: "Grande", info: "8 fatias" },
  { id: "GG", nome: "Gigante", info: "12 fatias" },
];

window.BORDAS = [
  { nome: "Sem borda recheada", preco: 0 },
  { nome: "Borda de catupiry", preco: 10 },
  { nome: "Borda de cheddar", preco: 10 },
  { nome: "Borda de chocolate", preco: 12 },
];

// preco: valores por tamanho (M, G, GG). meia: pode ser meio a meio com outro sabor da mesma categoria.
window.CARDAPIO = [
  { cat: "Pizzas salgadas", itens: [
    { id: "mussarela", nome: "Mussarela", desc: "Molho de tomate artesanal, mussarela e orégano.", preco: { M: 44.9, G: 56.9, GG: 69.9 }, img: "img/u5.jpg", meia: true },
    { id: "calabresa", nome: "Calabresa", desc: "Mussarela, calabresa fatiada, cebola e azeitonas.", preco: { M: 47.9, G: 59.9, GG: 72.9 }, img: "img/u9.jpg", meia: true, top: true },
    { id: "portuguesa", nome: "Portuguesa", desc: "Mussarela, presunto, ovos, cebola, ervilha, palmito e azeitonas.", preco: { M: 49.9, G: 62.9, GG: 76.9 }, img: "img/u3.jpg", meia: true, top: true },
    { id: "frango", nome: "Frango com Catupiry", desc: "Frango desfiado temperado, catupiry e milho.", preco: { M: 49.9, G: 62.9, GG: 76.9 }, img: "img/u13.jpg", meia: true },
    { id: "marguerita", nome: "Marguerita", desc: "Mussarela, tomate fatiado, manjericão fresco e parmesão.", preco: { M: 47.9, G: 59.9, GG: 72.9 }, img: "img/u1.jpg", meia: true },
    { id: "pepperoni", nome: "Pepperoni", desc: "Mussarela e fatias generosas de pepperoni.", preco: { M: 54.9, G: 67.9, GG: 82.9 }, img: "img/u7.jpg", meia: true, top: true },
    { id: "quatroqueijos", nome: "Quatro Queijos", desc: "Mussarela, provolone, gorgonzola e parmesão.", preco: { M: 54.9, G: 67.9, GG: 82.9 }, img: "img/u11.jpg", meia: true },
    { id: "baconmilho", nome: "Bacon com Milho", desc: "Mussarela, bacon crocante e milho verde.", preco: { M: 49.9, G: 62.9, GG: 76.9 }, img: "img/u8.jpg", meia: true },
    { id: "rucula", nome: "Rúcula com Tomate Seco", desc: "Mussarela de búfala, rúcula fresca e tomate seco.", preco: { M: 56.9, G: 69.9, GG: 84.9 }, img: "img/u4.jpg", meia: true },
    { id: "casa", nome: "Especial da Casa", desc: "Mussarela, lombo, cream cheese, cebola caramelizada e alecrim.", preco: { M: 59.9, G: 72.9, GG: 89.9 }, img: "img/u2.jpg", meia: true, top: true },
  ]},
  { cat: "Pizzas doces", itens: [
    { id: "confete", nome: "Chocolate com Confete", desc: "Chocolate ao leite coberto com confetes coloridos.", preco: { M: 44.9, G: 56.9, GG: 69.9 }, img: "img/doce1.jpg", meia: true, top: true },
    { id: "prestigio", nome: "Prestígio", desc: "Chocolate ao leite com coco ralado.", preco: { M: 44.9, G: 56.9, GG: 69.9 }, img: "img/doce2.jpg", meia: true },
    { id: "brigadeiro", nome: "Brigadeiro", desc: "Brigadeiro cremoso com granulado.", preco: { M: 44.9, G: 56.9, GG: 69.9 }, img: "img/doce1.jpg", meia: true },
    { id: "romeujulieta", nome: "Romeu e Julieta", desc: "Mussarela com goiabada cremosa.", preco: { M: 42.9, G: 54.9, GG: 66.9 }, img: "img/doce3.jpg", meia: true },
  ]},
  { cat: "Combos", itens: [
    { id: "combonoite", nome: "Combo Fechar a Noite", desc: "1 pizza grande salgada + 1 pizza média doce + refrigerante 2L.", preco: { unico: 109.9 }, img: "img/u12.jpg", combo: true, top: true },
    { id: "combocasal", nome: "Combo Casal", desc: "1 pizza média salgada + refrigerante lata.", preco: { unico: 54.9 }, img: "img/u12.jpg", combo: true },
  ]},
  { cat: "Bebidas", itens: [
    { id: "coca2l", nome: "Coca-Cola 2L", desc: "Bem gelada.", preco: { unico: 15 }, img: "img/bebida1.jpg" },
    { id: "guarana2l", nome: "Guaraná 2L", desc: "Bem gelado.", preco: { unico: 13 }, img: "img/bebida2.jpg" },
    { id: "lata", nome: "Refrigerante lata", desc: "Coca-Cola, Guaraná ou Fanta (350 ml).", preco: { unico: 6.5 }, img: "img/bebida2.jpg" },
    { id: "agua", nome: "Água mineral", desc: "Com ou sem gás (500 ml).", preco: { unico: 4 }, img: "img/bebida2.jpg" },
  ]},
];
