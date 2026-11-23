// =====================================================================
//  CARTAS DE BOKADO — edita este archivo para dar carta propia a cada restaurante
//
//  Cada sección es una página del libro:
//    { t: 'Nombre de la sección', k: 'comida' | 'bebida', img: URL,
//      items: [ ['Plato', 'Descripción corta', precio], ... ] }
//  Máximo 5 platos por página (si pones más, se crea otra página sola).
//
//  Carta propia: agrégala en CARTAS con la clave  categoria__nombre-en-minusculas
//  (sin tildes, espacios por guiones). Ejemplo al final del archivo.
//  Si un restaurante no tiene carta propia, se usa la de su categoría (CARTAS_BASE).
// =====================================================================
const u = id => 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=900&q=80';
const IMG = {
  llanera: u('1544025162-d76694265947'), mar: u('1534422298391-e4f8c172dddb'), desayuno: u('1533089860892-a7c6f0a88666'),
  rapida: u('1561758033-d89a9ad46330'), burger: u('1568901346375-23c9450c58cd'), mex: u('1565299585323-38d6b0865b47'),
  pastel: u('1578985545062-69928b1d9587'), postre: u('1587314168485-3236d6710814'), autor: u('1517248135467-4c7edcad34c4'),
  bebida: u('1544145945-f90425340c7e'), cafe: u('1495474472287-4d71bcdd2085'), coctel: u('1551024709-8f23befc6f87')
};

const CARTAS_BASE = {
  comidallanera: [
    { t: 'Entrantes', k: 'comida', img: IMG.llanera, items: [['Hayaca llanera', 'Masa de maíz con cerdo y pollo', 12000], ['Tungos', 'Hojas de plátano rellenas de arroz y carne', 14000], ['Chorizo llanero', 'Con yuca frita y guacamole', 15000]] },
    { t: 'Platos fuertes', k: 'comida', img: IMG.llanera, items: [['Mamona al carbón', 'Ternera asada lento, yuca, papa y ensalada', 48000], ['Carne a la perra', 'Cerdo a la brasa con plátano maduro', 42000], ['Chigüiro guisado', 'Receta tradicional con yuca', 38000], ['Pabellón llanero', 'Carne desmechada, arroz, caraotas y tajada', 34000]] },
    { t: 'Bebidas', k: 'bebida', img: IMG.bebida, items: [['Limonada de panela', 'Con hielo y hierbabuena', 7000], ['Jugo de maracuyá', 'Natural, en agua o leche', 8000], ['Guarapo', 'Caña fresca', 6000], ['Cerveza', 'Nacional', 6000]] },
    { t: 'Postres', k: 'comida', img: IMG.postre, items: [['Cuajada con melao', 'Tradicional del Llano', 9000], ['Arroz de leche', 'Con canela', 8000]] }
  ],
  comidadelmar: [
    { t: 'Entrantes', k: 'comida', img: IMG.mar, items: [['Ceviche de camarón', 'Limón, cebolla morada y cilantro', 32000], ['Empanadas de pescado', 'Con ají de la casa', 14000], ['Aros de calamar', 'Con salsa tártara', 24000]] },
    { t: 'Del mar y el río', k: 'comida', img: IMG.mar, items: [['Mojarra frita', 'Patacón, arroz de coco y ensalada', 36000], ['Cazuela de mariscos', 'Leche de coco y mariscos mixtos', 45000], ['Filete de pescado', 'Al ajillo con papas', 38000]] },
    { t: 'Bebidas', k: 'bebida', img: IMG.bebida, items: [['Limonada de coco', 'Cremosa y fría', 9000], ['Jugo de lulo', 'Natural', 8000], ['Cerveza', 'Nacional', 6000]] },
    { t: 'Postres', k: 'comida', img: IMG.postre, items: [['Cocadas', 'Coco y panela', 6000], ['Flan de coco', 'Con caramelo', 9000]] }
  ],
  almuerzoydesayunos: [
    { t: 'Desayunos', k: 'comida', img: IMG.desayuno, items: [['Calentado llanero', 'Arroz, frijol, huevo y carne', 16000], ['Caldo de costilla', 'Con arepa', 12000], ['Changua', 'Leche, huevo y calado', 10000], ['Huevos pericos', 'Con arepa y chocolate', 11000]] },
    { t: 'Almuerzos', k: 'comida', img: IMG.llanera, items: [['Ejecutivo del día', 'Sopa, seco y jugo', 15000], ['Bandeja llanera', 'Carne, arroz, yuca y ensalada', 22000], ['Sancocho', 'De gallina, con arroz', 20000]] },
    { t: 'Bebidas', k: 'bebida', img: IMG.cafe, items: [['Tinto', 'Café colombiano', 2500], ['Chocolate caliente', 'Con queso', 5000], ['Jugo natural', 'En agua o leche', 6000]] }
  ],
  comidasrapidas: [
    { t: 'Entrantes', k: 'comida', img: IMG.rapida, items: [['Nachos', 'Con carne, guacamole y jalapeños', 18000], ['Alitas de pollo x8', 'Con salsa BBQ', 26000], ['Aros de cebolla', 'Con salsa de la casa', 12000]] },
    { t: 'Hamburguesas', k: 'comida', img: IMG.burger, items: [['Clásica', 'Carne 150 g, queso y papas', 22000], ['Doble queso', 'Dos carnes y cheddar', 28000], ['Pollo crispy', 'Con coleslaw', 24000], ['Perro especial', 'Tocineta y papa ripio', 16000]] },
    { t: 'Bebidas', k: 'bebida', img: IMG.bebida, items: [['Gaseosa', '400 ml', 4000], ['Limonada natural', 'Fría y granizada', 6000], ['Malteada', 'Vainilla o chocolate', 12000]] },
    { t: 'Postres', k: 'comida', img: IMG.postre, items: [['Brownie con helado', 'Tibio', 12000], ['Cheesecake', 'Con fresa', 11000]] }
  ],
  comidamexicana: [
    { t: 'Entrantes', k: 'comida', img: IMG.mex, items: [['Nachos', 'Guacamole y pico de gallo', 22000], ['Guacamole', 'Con totopos', 16000], ['Quesadilla', 'Queso fundido', 20000]] },
    { t: 'Platos', k: 'comida', img: IMG.mex, items: [['Tacos al pastor x3', 'Piña, cebolla y cilantro', 24000], ['Burrito de pollo', 'Frijol, arroz y queso', 26000], ['Enchiladas', 'Salsa roja y queso', 28000]] },
    { t: 'Bebidas', k: 'bebida', img: IMG.coctel, items: [['Agua de jamaica', 'Fría', 7000], ['Margarita', 'Limón y sal', 18000], ['Cerveza', 'Con limón', 8000]] },
    { t: 'Postres', k: 'comida', img: IMG.postre, items: [['Churros', 'Con chocolate', 12000], ['Flan napolitano', 'Casero', 9000]] }
  ],
  postreriaypasteleria: [
    { t: 'Tortas y postres', k: 'comida', img: IMG.pastel, items: [['Torta de chocolate', 'Porción con ganache', 11000], ['Cheesecake de maracuyá', 'Base de galleta', 12000], ['Tres leches', 'Clásica', 10000], ['Brownie', 'Con nueces', 8000]] },
    { t: 'Para compartir', k: 'comida', img: IMG.postre, items: [['Torta entera', 'Por encargo, 12 porciones', 90000], ['Caja de galletas', 'x12', 28000], ['Ponqué casero', 'Tradicional', 24000]] },
    { t: 'Cafés y bebidas', k: 'bebida', img: IMG.cafe, items: [['Café de especialidad', 'Origen colombiano', 6000], ['Capuchino', 'Espumoso', 7000], ['Helado artesanal', 'Dos bolas', 9000], ['Limonada de cereza', 'Fría', 8000]] }
  ],
  experienciasnuevas: [
    { t: 'Para empezar', k: 'comida', img: IMG.autor, items: [['Crema de plátano', 'Con crocante de cerdo', 22000], ['Carpaccio llanero', 'Res curada y queso', 26000]] },
    { t: 'Menú de autor', k: 'comida', img: IMG.autor, items: [['Degustación 5 tiempos', 'Cocina de autor', 95000], ['Plato de temporada', 'Cambia según el mercado', 48000]] },
    { t: 'Maridajes', k: 'bebida', img: IMG.coctel, items: [['Maridaje', 'Selección de bebidas', 40000], ['Coctel de la casa', 'Con frutas del Llano', 22000]] }
  ]
};

// Cartas propias por restaurante. Ejemplo (bórralo o cámbialo):
const CARTAS = {
  'comidasrapidas__el-palacio-de-la-pizza': [
    { t: 'Pizzas', k: 'comida', img: IMG.rapida, items: [['Margarita', 'Tomate, mozzarella y albahaca', 24000], ['Pepperoni', 'Doble queso', 28000], ['Hawaiana', 'Jamón y piña', 27000]] },
    { t: 'Bebidas', k: 'bebida', img: IMG.bebida, items: [['Gaseosa 1.5 L', 'Para compartir', 8000], ['Limonada', 'Natural', 6000]] }
  ]
};