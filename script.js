document.addEventListener('DOMContentLoaded', function() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const editorButton = document.getElementById('editor-button');
    const closeCart = document.getElementById('close-cart');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const stockContainer = document.getElementById('stock-container');
    const cartItems = document.getElementById('cart-items');
    const alertBox = document.getElementById('alert');
    const clearCartBtn = document.getElementById('clear-cart');
    const stockDecrementBtn = document.getElementById('stock-decrement');
    
    const FILTERS = {
        rarity: document.getElementById('rarity'),
        type: document.getElementById('type'),
        energy: document.getElementById('energy'),
        sort: document.getElementById('sort')
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let stock = JSON.parse(localStorage.getItem('stock')) || [];

    function renderStock() {
        stockContainer.innerHTML = '';
        stock.forEach(item => {
            if (item.quantity > 0) {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="details">
                        <p><strong>Nome:</strong> ${item.name}</p>
                        <p><strong>Tipo:</strong> ${item.type}</p>
                        <p><strong>Energia:</strong> ${item.energy}</p>
                        <p><strong>Raridade:</strong> ${item.rarity}</p>
                        <p class="price">R$ ${item.price.toFixed(2)}</p>
                        <button class="add-to-cart-btn" data-id="${item.id}">Adicionar ao Carrinho</button>
                    </div>
                `;
                stockContainer.appendChild(card);
            }
        });
        addCartButtons();
    }

    function addCartButtons() {
        const addButtons = document.querySelectorAll('.add-to-cart-btn');
        addButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = button.getAttribute('data-id');
                addToCart(id);
                showAlert('Item adicionado ao carrinho!');
            });
        });
    }

    function addToCart(id) {
        const item = stock.find(i => i.id == id);
        const cartItem = cart.find(i => i.id == id);

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function renderCart() {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>${item.name} - R$ ${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button ${item.quantity <= 1 ? 'disabled' : ''} data-id="${item.id}" class="decrease-quantity">-</button>
                    <span>${item.quantity}</span>
                    <button data-id="${item.id}" class="increase-quantity">+</button>
                </div>
                <button data-id="${item.id}" class="remove-item">Remover</button>
            `;
            cartItems.appendChild(cartItem);
        });
        addCartControls();
    }

    function addCartControls() {
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = button.getAttribute('data-id');
                removeFromCart(id);
            });
        });

        const decreaseButtons = document.querySelectorAll('.decrease-quantity');
        decreaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = button.getAttribute('data-id');
                changeQuantity(id, -1);
            });
        });

        const increaseButtons = document.querySelectorAll('.increase-quantity');
        increaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = button.getAttribute('data-id');
                changeQuantity(id, 1);
            });
        });
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id != id);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function changeQuantity(id, amount) {
        const cartItem = cart.find(item => item.id == id);
        if (cartItem) {
            cartItem.quantity += amount;
            if (cartItem.quantity <= 0) {
                removeFromCart(id);
            } else {
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }
    }

    function showAlert(message) {
        alertBox.innerText = message;
        alertBox.style.display = 'block';
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    }

    function clearFilters() {
        Object.values(FILTERS).forEach(select => {
            select.value = '';
        });
        renderStock();
    }

    function filterStock() {
        const rarity = FILTERS.rarity.value;
        const type = FILTERS.type.value;
        const energy = FILTERS.energy.value;
        const sort = FILTERS.sort.value;

        let filteredStock = [...stock];

        if (rarity) filteredStock = filteredStock.filter(item => item.rarity === rarity);
        if (type) filteredStock = filteredStock.filter(item => item.type === type);
        if (energy) filteredStock = filteredStock.filter(item => item.energy === energy);

        if (sort === 'name-asc') {
            filteredStock.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'name-desc') {
            filteredStock.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sort === 'price-asc') {
            filteredStock.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-desc') {
            filteredStock.sort((a, b) => b.price - a.price);
        }

        stockContainer.innerHTML = '';
        filteredStock.forEach(item => {
            if (item.quantity > 0) {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="details">
                        <p><strong>Nome:</strong> ${item.name}</p>
                        <p><strong>Tipo:</strong> ${item.type}</p>
                        <p><strong>Energia:</strong> ${item.energy}</p>
                        <p><strong>Raridade:</strong> ${item.rarity}</p>
                        <p class="price">R$ ${item.price.toFixed(2)}</p>
                        <button class="add-to-cart-btn" data-id="${item.id}">Adicionar ao Carrinho</button>
                    </div>
                `;
                stockContainer.appendChild(card);
            }
        });
        addCartButtons();
    }

    function clearCart() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function decrementStock() {
        const password = prompt('Digite a senha para dar baixa no estoque:');
        if (password === '84953622') {
            stock.forEach(item => {
                const cartItem = cart.find(i => i.id === item.id);
                if (cartItem) {
                    item.quantity -= cartItem.quantity;
                }
            });
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('stock', JSON.stringify(stock));
            renderCart();
            renderStock();
            showAlert('Estoque atualizado com sucesso!');
        } else {
            alert('Senha incorreta.');
        }
    }

    editorButton.addEventListener('click', function() {
        cartSidebar.classList.toggle('open');
    });

    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('open');
    });

    clearFiltersBtn.addEventListener('click', clearFilters);
    FILTERS.sort.addEventListener('change', filterStock);
    FILTERS.rarity.addEventListener('change', filterStock);
    FILTERS.type.addEventListener('change', filterStock);
    FILTERS.energy.addEventListener('change', filterStock);
    clearCartBtn.addEventListener('click', clearCart);
    stockDecrementBtn.addEventListener('click', decrementStock);

    renderStock();
    renderCart();
});
