let cart = [];
let modalQt = 1;
let modalKey = 0;

const d = (element) => document.querySelector(element);
const ds = (element) => document.querySelectorAll(element);

// listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = d('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        let key = event.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;


        d('.pizzaBig img').src = pizzaJson[key].img;
        d('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        d('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        d('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        d('.pizzaInfo--size.selected').classList.remove('selected');
        ds('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            };
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        d('.pizzaInfo--qt').innerHTML = modalQt;
        d('.pizzaWindowArea').style.opacity = 0;
        d('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            d('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    d('.pizza-area').append(pizzaItem);
});

//Eventos do modal 
function closeModal() {
    d('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        d('.pizzaWindowArea').style.display = 'none';
    }, 500);
};

ds('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

d('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        d('.pizzaInfo--qt').innerHTML = modalQt;
    };
});

d('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    d('.pizzaInfo--qt').innerHTML = modalQt;
});

ds('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (event) => {
        d('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

d('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(d('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);
    if (key > -1) {
        cart[key].quantity += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size: size,
            quantity: modalQt
        });
    };
    updateCart();
    closeModal();
});

function updateCart() {
    d('.menu-openner span').innerHTML = cart.length;
    d('.menu-openner').addEventListener('click', () => {
        if (cart.length > 0) {
            d('aside').style.left = '0';
        }
    });
    d('.menu-closer').addEventListener('click', () => {
        d('aside').style.left = '100vw';
    });
    if (cart.length > 0) {
        d('aside').classList.add('show');
        d('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].quantity;
            let cartItem = d('.models .cart--item').cloneNode(true);

            let pizzasizeName;
            switch (cart[i].size) {
                case 0:
                    pizzasizeName = 'P'
                    break;
                case 1:
                    pizzasizeName = 'M'
                    break;
                case 2:
                    pizzasizeName = 'G'
                    break
            };
            let pizzaName = `${pizzaItem.name} (${pizzasizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantity;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].quantity > 1) {
                    cart[i].quantity--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].quantity++;
                updateCart();
            });

            d('.cart').append(cartItem);
        };
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        d('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        d('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        d('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
        console.log(subtotal);
    } else {
        d('aside').classList.remove('show');
        d('aside').style.left = '100vw';
    };
};