// Prévia do cardápio do Rei do Xis (Santana do Livramento), montada pela RB Tech a partir do cardápio deles.
window.LOJA = {
  nome: "Rei do Xis",
  slogan: "Peça já o seu lanche delicioso!",
  cidade: "Santana do Livramento",
  whatsapp: "5555984331399",
  instagram: "reidoxislivramento",
  logo: "img/logo.svg",
  capa: "img/l7.jpg",
  aviso: "Prévia criada pela RB Tech",
  // dias: 0 = domingo ... 6 = sábado
  horario: { dias: [0, 1, 2, 3, 4, 5, 6], abre: "19:30", fecha: "02:00", texto: "Das 19h30 às 2h" },
  tempoEntrega: "40 a 60 min",
  taxaEntrega: "a combinar pelo WhatsApp",
  cores: { fundo: "#0c0c0c", destaque: "#c8161d", verde: "#2bb24c", amarelo: "#f9a51a" },
  // Link da via de impressão (impressora térmica) que vai junto no pedido
  impressao: "https://techrb.netlify.app/rei-do-xis/imprimir.html",
};

window.TAMANHOS = [
  { id: "M", nome: "Média", info: "8 fatias" },
  { id: "G", nome: "Grande", info: "12 fatias" },
  { id: "F", nome: "Família", info: "16 fatias" },
];

window.BORDAS = [];

window.ADICIONAIS = [];

const MOLHO = "Pão, maionese caseira, ketchup, mostarda, ";

window.CARDAPIO = [
  { cat: "Xis", itens: [
    { id: "xsalada", nome: "X-Salada", desc: MOLHO + "alface, tomate, bife, ovo, presunto e queijo.", preco: { unico: 26 }, img: "img/l4.jpg" },
    { id: "xbacon", nome: "X-Bacon", desc: MOLHO + "alface, tomate, bife, bacon, ovo, presunto e queijo.", preco: { unico: 32 }, img: "img/l5.jpg" },
    { id: "xcalabresa", nome: "X-Calabresa", desc: MOLHO + "alface, tomate, bife, calabresa, ovo, presunto e queijo.", preco: { unico: 30 }, img: "img/l1.jpg" },
    { id: "xcheddar", nome: "X-Cheddar", desc: MOLHO + "alface, tomate, bife, cheddar, ovo, presunto e queijo.", preco: { unico: 30 }, img: "img/l5.jpg" },
    { id: "xcoracao", nome: "X-Coração", desc: MOLHO + "alface, tomate, coração, ovo, presunto e queijo.", preco: { unico: 33 }, img: "img/l2.jpg" },
    { id: "xfrango", nome: "X-Frango", desc: MOLHO + "alface, tomate, frango, ovo, presunto e queijo.", preco: { unico: 30 }, img: "img/l6.jpg" },
    { id: "xdoble", nome: "X-Doble", desc: MOLHO + "alface, tomate, 2 bifes, bacon, 2 ovos, presunto e queijo extra.", preco: { unico: 38 }, img: "img/l2.jpg" },
    { id: "xfile", nome: "X-Filé", desc: MOLHO + "alface, tomate, filé, ovo, presunto, queijo e fritas.", preco: { unico: 37 }, img: "img/l4.jpg" },
    { id: "xentrevero", nome: "X-Entrevero", desc: MOLHO + "alface, tomate, calabresa, bacon, frango, coração, ovo, presunto e queijo.", preco: { unico: 34 }, img: "img/l2.jpg" },
    { id: "xstrogfrango", nome: "X-Strogonoff de Frango", desc: MOLHO + "alface, tomate, strogonoff de frango, batata palha, ovo, presunto e queijo.", preco: { unico: 33 }, img: "img/l6.jpg" },
    { id: "xstrogcarne", nome: "X-Strogonoff de Carne", desc: MOLHO + "alface, tomate, strogonoff de carne, batata palha, ovo, presunto e queijo.", preco: { unico: 39 }, img: "img/l1.jpg" },
    { id: "xdorei", nome: "X-Do Rei", desc: MOLHO + "alface, tomate, cebola, bife, ovo, presunto e queijo.", preco: { unico: 31 }, img: "img/l5.jpg" },
    { id: "xlombo", nome: "X-Lombo Catupiry", desc: MOLHO + "alface, tomate, bife, lombo, catupiry, ovo, presunto e queijo.", preco: { unico: 35 }, img: "img/l4.jpg" },
    { id: "xfrangocat", nome: "X-Frango Catupiry", desc: MOLHO + "alface, tomate, frango, catupiry, ovo, presunto e queijo.", preco: { unico: 34 }, img: "img/l6.jpg" },
    { id: "xtriplo", nome: "X-Triplo", desc: MOLHO + "alface, tomate, 3 bifes, 3 bacon, 3 ovos, 3 presunto e 3 queijo.", preco: { unico: 50 }, img: "img/l2.jpg" },
    { id: "xcrocante", nome: "X-Crocante", desc: MOLHO + "alface, tomate, bife, ovo, batata palha, presunto e queijo.", preco: { unico: 30 }, img: "img/l1.jpg" },
    { id: "xbaconcheddar", nome: "X-Bacon Cheddar", desc: MOLHO + "alface, tomate, bife, bacon, ovo, presunto e cheddar.", preco: { unico: 37 }, img: "img/l5.jpg" },
    { id: "xcebola", nome: "X-Cebola Caramelizada", desc: MOLHO + "alface, tomate, bife, bacon, ovo, presunto, cheddar e cebola caramelizada.", preco: { unico: 36 }, img: "img/l4.jpg" },
    { id: "x1kg", nome: "X-1Kg", desc: MOLHO + "alface, tomate, 4 bifes, 4 bacon, 4 ovos, 4 presunto e 4 queijo. Novidade!", preco: { unico: 58 }, img: "img/l2.jpg", tag: "Novo" },
    { id: "xfileacebolado", nome: "X-Filé Acebolado", desc: MOLHO + "alface, tomate, filé, ovo, presunto e cebola.", preco: { unico: 42 }, img: "img/l1.jpg" },
    { id: "xdacasa", nome: "X-Da Casa", desc: MOLHO + "alface, milho, bife, bacon, calabresa, coração, frango, ovo, presunto, mussarela e cheddar.", preco: { unico: 50 }, img: "img/l2.jpg" },
    { id: "xdacasaaceb", nome: "X-Da Casa Acebolado", desc: MOLHO + "alface, tomate, bife, bacon, calabresa, coração, frango, ovo, presunto, cebola, mussarela e cheddar.", preco: { unico: 52 }, img: "img/l2.jpg" },
    { id: "xfrangobacon", nome: "X-Frango com Bacon", desc: MOLHO + "alface, tomate, frango, bacon, ovo, presunto e queijo.", preco: { unico: 35 }, img: "img/l6.jpg" },
    { id: "x4queijos", nome: "X-4 Queijos", desc: MOLHO + "alface, tomate, bife, ovo, mussarela, parmesão, cheddar, gorgonzola e presunto.", preco: { unico: 33 }, img: "img/l5.jpg" },
    { id: "xfilebacon", nome: "X-Filé com Bacon", desc: MOLHO + "alface, tomate, filé, bacon, ovo, presunto e queijo.", preco: { unico: 48 }, img: "img/l4.jpg" },
    { id: "xportuguesa", nome: "X-Portuguesa", desc: MOLHO + "alface, tomate, bife, pimentão vermelho, cebola, azeitona, ovo, presunto e mussarela.", preco: { unico: 33 }, img: "img/l1.jpg" },
    { id: "xcalabbbq", nome: "X-Calabresa com Barbecue", desc: MOLHO + "alface, tomate, bife, calabresa, bacon, barbecue, ovo, presunto e mussarela.", preco: { unico: 34 }, img: "img/l1.jpg" },
    { id: "xbarbecue", nome: "X-Barbecue", desc: MOLHO + "alface, tomate, bife, barbecue, ovo, presunto e mussarela.", preco: { unico: 30 }, img: "img/l5.jpg" },
    { id: "xfilebaconbbq", nome: "X-Filé com Bacon e Barbecue", desc: MOLHO + "alface, tomate, filé, bacon, barbecue, ovo, presunto e mussarela.", preco: { unico: 50 }, img: "img/l4.jpg" },
    { id: "xazeitona", nome: "X-Azeitona", desc: MOLHO + "alface, tomate, bife, azeitona, ovo, presunto e mussarela.", preco: { unico: 31 }, img: "img/l1.jpg" },
    { id: "xalhooleo", nome: "X-Filé Alho e Óleo", desc: MOLHO + "alface, tomate, filé, alho e óleo, ovo, presunto e queijo.", preco: { unico: 44 }, img: "img/l4.jpg" },
    { id: "xfile4q", nome: "X-Filé a 4 Queijos", desc: MOLHO + "alface, tomate, filé, parmesão, cheddar, mussarela, ovo, presunto e queijo.", preco: { unico: 46 }, img: "img/l5.jpg" },
    { id: "xcoracaobacon", nome: "X-Coração com Bacon", desc: MOLHO + "alface, tomate, coração, bacon, ovo, presunto e queijo.", preco: { unico: 40 }, img: "img/l2.jpg" },
    { id: "xvegetariano", nome: "X-Vegetariano", desc: MOLHO + "alface, tomate, cebola, cenoura, omelete da casa e mussarela.", preco: { unico: 29 }, img: "img/l6.jpg" },
    { id: "xcalabacon", nome: "X-CalaBacon", desc: MOLHO + "alface, tomate, bife, calabresa, bacon, ovo, presunto e mussarela.", preco: { unico: 35 }, img: "img/l1.jpg" },
  ]},
  { cat: "Burgers", itens: [
    { id: "burger", nome: "Burger", desc: "Pão, maionese caseira, tomate, hambúrguer bovino 180 g e queijo.", preco: { unico: 30 }, img: "img/l1.jpg" },
    { id: "burgeramericano", nome: "Burger Americano", desc: "Pão, maionese caseira, hambúrguer bovino 140 g e queijo.", preco: { unico: 26 }, img: "img/l1.jpg" },
    { id: "burgerbacon", nome: "Burger Bacon", desc: "Pão, maionese caseira, alface, tomate, hambúrguer bovino 180 g, bacon e queijo.", preco: { unico: 34 }, img: "img/l2.jpg" },
    { id: "burgerdcheddar", nome: "Burger Double Cheddar", desc: "Pão, molho, 2x hambúrguer bovino e 2x queijo cheddar.", preco: { unico: 40 }, img: "img/l2.jpg" },
    { id: "cheeseburger", nome: "Cheese Burger", desc: "Pão, molho, hambúrguer bovino e queijo cheddar.", preco: { unico: 25 }, img: "img/l1.jpg" },
    { id: "burgerdbacon", nome: "Burger Double Bacon", desc: "Pão, maionese caseira, alface, tomate, 2x hambúrguer bovino, 2x bacon e 2x queijo.", preco: { unico: 42 }, img: "img/l2.jpg" },
    { id: "texasburger", nome: "Texas Burger", desc: "Pão, maionese caseira, alface, tomate, hambúrguer bovino, queijo e cebola crocante.", preco: { unico: 34 }, img: "img/l1.jpg" },
  ]},
  { cat: "Chivito e Galinhão", itens: [
    { id: "chivito", nome: "Chivito", desc: "Pão, maionese caseira, ketchup, mostarda, alface, tomate, azeitona, filé, presunto e queijo.", preco: { unico: 37 }, img: "img/l4.jpg" },
    { id: "galinhao", nome: "Galinhão", desc: "Pão, maionese caseira, ketchup, mostarda, alface, tomate, frango e mussarela.", preco: { unico: 21 }, img: "img/l6.jpg" },
  ]},
  { cat: "Pancho", itens: [
    { id: "panchosimples", nome: "Pancho Simples", desc: "Pão, maionese caseira, ketchup, mostarda, salsicha, queijo ou batata palha.", preco: { unico: 10 }, img: "img/hd2.jpg" },
    { id: "panchocompleto", nome: "Pancho Completo", desc: "Pão, maionese caseira, ketchup, mostarda, salsicha, alface, tomate, queijo e batata palha.", preco: { unico: 13 }, img: "img/hd1.jpg" },
    { id: "panchobacon", nome: "Pancho Bacon Mussa", desc: "Pão, maionese caseira, ketchup, mostarda, salsicha, bacon, mussarela e batata palha.", preco: { unico: 21 }, img: "img/hd1.jpg" },
  ]},
  { cat: "Torradas", itens: [
    { id: "torradasimples", nome: "Torrada Simples", desc: "Pão de sanduíche, presunto, queijo e maionese caseira.", preco: { unico: 12 }, img: "img/l3.jpg" },
    { id: "torradacompleta", nome: "Torrada Completa", desc: "Pão de sanduíche, ovo, carne, bacon, presunto, queijo e maionese caseira.", preco: { unico: 20 }, img: "img/l3.jpg" },
    { id: "torradasimplesm", nome: "Torrada Simples c/ Mussarela Derretida", desc: "Pão de sanduíche, presunto, queijo, maionese caseira e mussarela derretida.", preco: { unico: 16 }, img: "img/l3.jpg" },
    { id: "torradacompletam", nome: "Torrada Completa c/ Mussarela Derretida", desc: "Pão de sanduíche, ovo, carne, bacon, presunto, queijo, maionese caseira e mussarela derretida.", preco: { unico: 24 }, img: "img/l3.jpg" },
  ]},
  { cat: "Pizzas", itens: [
    { id: "pizza", nome: "Pizza", desc: "Escolha o tamanho e escreva os sabores na observação.", preco: { M: 65, G: 75, F: 85 }, img: "img/u9.jpg" },
  ]},
  { cat: "Porções", itens: [
    { id: "fritasmini", nome: "Fritas Mini", desc: "Porção pequena de batata frita.", preco: { unico: 10 }, img: "img/fr2.jpg" },
    { id: "fritas", nome: "Fritas", desc: "Porção de batata frita.", preco: { unico: 20 }, img: "img/fr2.jpg" },
    { id: "fritascompleta", nome: "Fritas Completa", desc: "Porção de batata frita com mussarela e bacon.", preco: { unico: 27 }, img: "img/fr1.jpg" },
    { id: "aneis", nome: "Anéis de Cebola", desc: "Porção de anéis de cebola.", preco: { unico: 26 }, img: "img/fr2.jpg" },
    { id: "polenta", nome: "Polenta Frita", desc: "Porção de polenta frita.", preco: { unico: 27 }, img: "img/fr2.jpg" },
  ]},
  { cat: "Combos", itens: [
    { id: "combofamilia", nome: "Combo Família", desc: "1 X-Doble + 1 X-Entrevero + 1 X-Bacon + Coca-Cola 2L.", preco: { unico: 115 }, img: "img/l7.jpg", combo: true },
    { id: "combo1", nome: "Combo 1", desc: "1 X-Bacon + 1 X-Coração + Coca-Cola 2L.", preco: { unico: 77 }, img: "img/l7.jpg", combo: true },
    { id: "combo2", nome: "Combo 2", desc: "1 X-Frango + 1 X-Salada + 1 porção de fritas completa.", preco: { unico: 76 }, img: "img/l7.jpg", combo: true },
    { id: "combo3", nome: "Combo 3", desc: "1 X-Cheddar + 1 X-Bacon + 1 Coca-Cola 2L + fritas média.", preco: { unico: 95 }, img: "img/l7.jpg", combo: true },
    { id: "maiscombo", nome: "+ Combo", desc: "Batata mini + refrigerante 350 ml.", preco: { unico: 18 }, img: "img/fr2.jpg", combo: true },
  ]},
  { cat: "Bebidas", itens: [
    { id: "lata", nome: "Refrigerante Lata", desc: "Coca-Cola, Fanta ou Sprite 350 ml (escreva qual na observação).", preco: { unico: 10 }, img: "img/bebida2.jpg" },
    { id: "pet2l", nome: "Refrigerante Pet 2 Litros", desc: "Coca-Cola, Fanta ou Sprite 2 litros (escreva qual na observação).", preco: { unico: 17 }, img: "img/bebida1.jpg" },
    { id: "litrao", nome: "Cerveja Litrão", desc: "Cerveja 1 litro (consulte o rótulo disponível).", preco: { unico: 19 }, img: "img/bebida2.jpg" },
    { id: "delvalle", nome: "Suco Del Valle", desc: "Suco 200 ml (sabores variados).", preco: { unico: 8 }, img: "img/bebida2.jpg" },
    { id: "agua", nome: "Água Mineral", desc: "Água mineral 500 ml.", preco: { unico: 6 }, img: "img/bebida2.jpg" },
  ]},
];
