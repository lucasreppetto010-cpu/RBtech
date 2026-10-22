// Pizzaria fictícia de demonstração (RB Tech): tudo que muda de uma loja para outra fica aqui.
window.LOJA = {
  nome: "Forno & Lenha",
  slogan: "Pizzas no forno a lenha, xis e lanches na chapa",
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
  { id: "M", nome: "Média", info: "6 fatias", sabores: 2 },
  { id: "G", nome: "Grande", info: "8 fatias", sabores: 3 },
  { id: "GG", nome: "Gigante", info: "12 fatias", sabores: 4 },
];

window.BORDAS = [
  { nome: "Sem borda recheada", preco: 0 },
  { nome: "Borda de catupiry", preco: 10 },
  { nome: "Borda de cheddar", preco: 10 },
  { nome: "Borda de chocolate", preco: 12 },
];

// Adicionais dos lanches (itens com adic: true). Cada um soma no preço do lanche.
window.ADICIONAIS = [
  { nome: "Bacon", preco: 5 },
  { nome: "Ovo", preco: 3 },
  { nome: "Cheddar", preco: 4 },
  { nome: "Catupiry", preco: 4 },
  { nome: "Hambúrguer extra", preco: 8 },
  { nome: "Calabresa", preco: 4 },
  { nome: "Milho e ervilha", preco: 2 },
];

// preco: valores por tamanho (M, G, GG) ou { unico }. meia: pode dividir a pizza com outros sabores da mesma categoria (até TAMANHOS[].sabores).
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
  { cat: "Xis", itens: [
    { id: "xsalada", nome: "Xis Salada", desc: "Pão de xis prensado, hambúrguer, queijo, presunto, ovo, alface, tomate, milho, ervilha e maionese da casa.", preco: { unico: 29.9 }, img: "img/l4.jpg", adic: true, top: true },
    { id: "xbacon", nome: "Xis Bacon", desc: "Hambúrguer, bacon crocante, queijo, presunto, ovo, alface, tomate, milho e maionese.", preco: { unico: 34.9 }, img: "img/l5.jpg", adic: true, top: true },
    { id: "xcoracao", nome: "Xis Coração", desc: "Coração de frango na chapa, queijo, presunto, ovo, alface, tomate, milho e maionese.", preco: { unico: 36.9 }, img: "img/l2.jpg", adic: true },
    { id: "xfrango", nome: "Xis Frango", desc: "Frango desfiado temperado, catupiry, queijo, alface, tomate, milho e maionese.", preco: { unico: 32.9 }, img: "img/l6.jpg", adic: true },
    { id: "xcalabresa", nome: "Xis Calabresa", desc: "Calabresa acebolada, hambúrguer, queijo, ovo, alface, tomate e maionese.", preco: { unico: 33.9 }, img: "img/l1.jpg", adic: true },
    { id: "xtudo", nome: "Xis Tudo", desc: "Hambúrguer, bacon, calabresa, coração, frango, queijo, presunto, ovo, alface, tomate, milho e maionese. Para quem chega com fome!", preco: { unico: 44.9 }, img: "img/l2.jpg", adic: true, top: true },
  ]},
  { cat: "Hambúrgueres", itens: [
    { id: "classico", nome: "Burger Clássico", desc: "Pão brioche, blend de 150 g, queijo cheddar, alface, tomate e molho da casa.", preco: { unico: 27.9 }, img: "img/l1.jpg", adic: true },
    { id: "smash", nome: "Smash Duplo Bacon", desc: "Dois smash de 90 g, cheddar duplo, bacon e cebola caramelizada.", preco: { unico: 34.9 }, img: "img/l2.jpg", adic: true, top: true },
    { id: "crispy", nome: "Chicken Crispy", desc: "Frango empanado crocante, molho barbecue, picles e salada.", preco: { unico: 29.9 }, img: "img/l6.jpg", adic: true },
  ]},
  { cat: "Cachorro-quente", itens: [
    { id: "dogsimples", nome: "Cachorro-quente Simples", desc: "Pão, salsicha, molho de tomate, milho, ervilha e batata palha.", preco: { unico: 16.9 }, img: "img/hd2.jpg", adic: true },
    { id: "dogcompleto", nome: "Cachorro-quente Completo", desc: "Duas salsichas, molho, milho, ervilha, purê, queijo ralado, batata palha e maionese.", preco: { unico: 22.9 }, img: "img/hd1.jpg", adic: true, top: true },
  ]},
  { cat: "Porções", itens: [
    { id: "batata", nome: "Batata Frita", desc: "Porção de 400 g, crocante e bem sequinha.", preco: { unico: 22.9 }, img: "img/fr2.jpg" },
    { id: "batatacb", nome: "Batata com Cheddar e Bacon", desc: "Porção de 400 g coberta com cheddar cremoso e bacon.", preco: { unico: 32.9 }, img: "img/fr1.jpg", top: true },
  ]},
  { cat: "Combos", itens: [
    { id: "comboxis", nome: "Combo Xis", desc: "1 Xis Salada + batata frita pequena + refrigerante lata.", preco: { unico: 42.9 }, img: "img/l3.jpg", combo: true, top: true },
    { id: "combodupla", nome: "Combo Dupla de Lanches", desc: "2 Burgers Clássicos + batata frita + 2 refrigerantes lata.", preco: { unico: 69.9 }, img: "img/l7.jpg", combo: true },
    { id: "combonoite", nome: "Combo Fechar a Noite", desc: "1 pizza grande salgada + 1 pizza média doce + refrigerante 2L.", preco: { unico: 109.9 }, img: "img/u12.jpg", combo: true },
    { id: "combocasal", nome: "Combo Casal", desc: "1 pizza média salgada + refrigerante lata.", preco: { unico: 54.9 }, img: "img/u12.jpg", combo: true },
  ]},
  { cat: "Bebidas", itens: [
    { id: "coca2l", nome: "Coca-Cola 2L", desc: "Bem gelada.", preco: { unico: 15 }, img: "img/bebida1.jpg" },
    { id: "guarana2l", nome: "Guaraná 2L", desc: "Bem gelado.", preco: { unico: 13 }, img: "img/bebida2.jpg" },
    { id: "lata", nome: "Refrigerante lata", desc: "Coca-Cola, Guaraná ou Fanta (350 ml).", preco: { unico: 6.5 }, img: "img/bebida2.jpg" },
    { id: "agua", nome: "Água mineral", desc: "Com ou sem gás (500 ml).", preco: { unico: 4 }, img: "img/bebida2.jpg" },
  ]},
];
