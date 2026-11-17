// Produtos do catálogo
const produtos = [
    { id: 1, time: "Palmeiras", nome: "Camisa titular 2026", marca: "Puma", preco: 429.90, tag: "Destaque", imagem: "uni.palmeiras.avif", loja: "https://www.palmeiras.com.br/" },
    { id: 2, time: "Corinthians", nome: "Camisa alvinegra 2026", marca: "Nike", preco: 399.90, tag: "Coleção", imagem: "uni.corinthians.webp", loja: "https://www.corinthians.com.br/" },
    { id: 3, time: "São Paulo", nome: "Camisa tricolor 2026", marca: "New Balance", preco: 349.90, tag: "Tricolor", imagem: "uni.saopaulo.jpg", loja: "https://www.saopaulofc.net/" },
    { id: 4, time: "Flamengo", nome: "Manto rubro-negro 2026", marca: "Adidas", preco: 449.90, tag: "Destaque", imagem: "uni.flamengo.webp", loja: "https://www.flamengo.com.br/" },
    { id: 5, time: "Santos", nome: "Camisa alvinegra 2026", marca: "Umbro", preco: 329.90, tag: "Clássica", imagem: "uni.santos.avif", loja: "https://www.santosfc.com.br/" },
    { id: 6, time: "Grêmio", nome: "Camisa tricolor 2026", marca: "Umbro", preco: 329.90, tag: "Tricolor", imagem: "uni.gremio.webp", loja: "https://gremio.net/" },
    { id: 7, time: "Internacional", nome: "Camisa colorada 2026", marca: "Adidas", preco: 339.90, tag: "Colorado", imagem: "uni.internacional.webp", loja: "https://www.internacional.com.br/" },
    { id: 8, time: "Vasco", nome: "Camisa cruzmaltina 2026", marca: "Kappa", preco: 329.90, tag: "Tradicional", imagem: "uni.vasco.avif", loja: "https://vasco.com.br/" }
];

let clubeAtual = "";
let carrinho = [];
const favoritos = new Set();

const listaProdutos = document.getElementById("products");
const busca = document.getElementById("search");
const ordenacao = document.getElementById("sort");
let temporizadorToast;

// Formata os preços em reais.
function dinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Mostra mensagens na tela.
function mostrarAviso(mensagem) {
    const aviso = document.getElementById("toast");
    aviso.textContent = mensagem;
    aviso.classList.add("show");

    clearTimeout(temporizadorToast);

    temporizadorToast = setTimeout(() => {
        aviso.classList.remove("show");
    }, 2200);
}

// Mostra os produtos e aplica os filtros.
function mostrarProdutos() {
    const termo = busca.value.toLowerCase().trim();

    let encontrados = produtos.filter(produto => {
        const texto = (
            produto.time + " " + produto.nome + " " + produto.marca
        ).toLowerCase();

        return texto.includes(termo) &&
            (clubeAtual === "" || produto.time === clubeAtual);
    });

    if (ordenacao.value === "low") {
        encontrados.sort((a, b) => a.preco - b.preco);
    }

    if (ordenacao.value === "high") {
        encontrados.sort((a, b) => b.preco - a.preco);
    }

    listaProdutos.innerHTML = encontrados.map(produto => `
        <article class="product-card">
            <div class="product-photo">
                <img class="shirt-art" src="${produto.imagem}" alt="Camisa do ${produto.time}">
                <span class="product-tag">${produto.tag}</span>

                <button class="favorite ${favoritos.has(produto.id) ? "active" : ""}" data-favorite="${produto.id}">
                    ${favoritos.has(produto.id) ? "♥" : "♡"}
                </button>
            </div>

            <div class="product-info">
                <div class="product-team">${produto.time}</div>
                <h3>${produto.nome}</h3>
                <p class="product-meta">${produto.marca} • Uniforme de futebol</p>

                <div class="product-bottom">
                    <div class="product-price">
                        ${dinheiro(produto.preco)}
                        <small>Preço ilustrativo</small>
                    </div>

                    <button class="add-button" data-add="${produto.id}">
                        ADICIONAR
                    </button>
                </div>

                <a class="official-link" href="${produto.loja}" target="_blank">
                    SITE DO CLUBE ↗
                </a>
            </div>
        </article>
    `).join("");

    document.getElementById("product-total").textContent = encontrados.length;

    document.getElementById("empty").classList.toggle(
        "hidden",
        encontrados.length > 0
    );
}

// Filtro por clube.
document.getElementById("club-list").addEventListener("click", event => {
    const botao = event.target.closest("[data-team]");

    if (!botao) return;

    clubeAtual = botao.dataset.team;

    document.querySelectorAll(".club-chip").forEach(item => {
        item.classList.remove("selected");
    });

    botao.classList.add("selected");

    mostrarProdutos();
});

busca.addEventListener("input", mostrarProdutos);
ordenacao.addEventListener("change", mostrarProdutos);

// Limpa os filtros.
document.getElementById("reset").addEventListener("click", () => {
    busca.value = "";
    ordenacao.value = "featured";
    clubeAtual = "";

    document.querySelectorAll(".club-chip").forEach(item => {
        item.classList.remove("selected");
    });

    document.querySelector('[data-team=""]').classList.add("selected");

    mostrarProdutos();
});

// Favoritos e botão de adicionar ao carrinho.
listaProdutos.addEventListener("click", event => {
    const favorito = event.target.closest("[data-favorite]");

    if (favorito) {
        const id = Number(favorito.dataset.favorite);

        if (favoritos.has(id)) {
            favoritos.delete(id);
        } else {
            favoritos.add(id);
        }

        mostrarProdutos();
        return;
    }

    const botao = event.target.closest("[data-add]");

    if (botao) {
        adicionarAoCarrinho(Number(botao.dataset.add));
    }
});

// Adiciona uma camisa à sacola.
function adicionarAoCarrinho(id) {
    const item = carrinho.find(produto => produto.id === id);

    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({
            ...produtos.find(produto => produto.id === id),
            quantidade: 1
        });
    }

    mostrarCarrinho();
    mostrarAviso("Camisa adicionada à sacola!");
}

// Atualiza a sacola.
function mostrarCarrinho() {
    const itens = document.getElementById("cart-items");

    itens.innerHTML = carrinho.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.time}</strong><br>
                <small>${dinheiro(item.preco)} cada</small><br>

                <button data-menos="${item.id}">-</button>
                ${item.quantidade}
                <button data-mais="${item.id}">+</button>
                <button data-remover="${item.id}">Remover</button>
            </div>

            <strong>${dinheiro(item.preco * item.quantidade)}</strong>
        </div>
    `).join("");

    const quantidade = carrinho.reduce(
        (total, item) => total + item.quantidade, 0
    );

    const subtotal = carrinho.reduce(
        (total, item) => total + item.preco * item.quantidade, 0
    );

    document.getElementById("cart-count").textContent = quantidade;
    document.getElementById("subtotal").textContent = dinheiro(subtotal);

    document.getElementById("cart-empty").style.display =
        carrinho.length ? "none" : "block";

    document.getElementById("cart-bottom").style.display =
        carrinho.length ? "block" : "none";
}

// Altera quantidades e remove produtos.
document.getElementById("cart-items").addEventListener("click", event => {
    const id = Number(
        event.target.dataset.mais ||
        event.target.dataset.menos ||
        event.target.dataset.remover
    );

    if (!id) return;

    const item = carrinho.find(produto => produto.id === id);

    if (event.target.dataset.mais) {
        item.quantidade++;
    }

    if (event.target.dataset.menos) {
        item.quantidade--;
    }

    if (event.target.dataset.remover || item.quantidade <= 0) {
        carrinho = carrinho.filter(produto => produto.id !== id);
    }

    mostrarCarrinho();
});

// Abre e fecha a sacola.
function abrirCarrinho() {
    document.getElementById("cart-drawer").classList.add("open");
    document.getElementById("overlay").classList.add("show");
}

function fecharCarrinho() {
    document.getElementById("cart-drawer").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");
}

document.getElementById("open-cart").addEventListener("click", abrirCarrinho);
document.getElementById("close-cart").addEventListener("click", fecharCarrinho);
document.getElementById("continue-shopping").addEventListener("click", fecharCarrinho);
document.getElementById("overlay").addEventListener("click", fecharCarrinho);

// Finalização demonstrativa.
document.getElementById("checkout").addEventListener("click", () => {
    mostrarAviso("Demonstração concluída! Nenhuma compra foi realizada.");

    carrinho = [];

    mostrarCarrinho();
    fecharCarrinho();
});

// Menu para telas pequenas.
document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("nav").classList.toggle("open");
});

// Modo escuro.
document.getElementById("dark-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const escuro = document.body.classList.contains("dark");

    document.getElementById("dark-mode").textContent =
        escuro ? "Modo claro" : "Modo escuro";
});

// Simulador de recomendação.
document.getElementById("ia-botao").addEventListener("click", () => {
    const clube = document.getElementById("ia-clube").value;
    const resultado = document.getElementById("ia-resultado");

    if (!clube) {
        resultado.textContent = "Escolha um clube primeiro.";
        return;
    }

    const camisa = produtos.find(produto => produto.time === clube);

    resultado.textContent =
        "Nossa sugestão para você é: " +
        camisa.nome + " do " + camisa.time + ".";
});

// Quiz de futebol.
document.getElementById("quiz-form").addEventListener("submit", event => {
    event.preventDefault();

    const respostas = {
        q1: "11",
        q2: "Brasil",
        q3: "Corinthians"
    };

    let acertos = 0;

    for (let pergunta in respostas) {
        const marcada = document.querySelector(
            'input[name="' + pergunta + '"]:checked'
        );

        if (marcada && marcada.value === respostas[pergunta]) {
            acertos++;
        }
    }

    document.getElementById("quiz-resultado").textContent =
        "Você acertou " + acertos + " de 3 perguntas!";
});

// LOGIN E CRIAÇÃO DE CONTA.
const accountBackdrop = document.getElementById("account-backdrop");
const accountForm = document.getElementById("account-form");

let modoConta = "login";

// Abre a janela de login.
function abrirConta() {
    accountBackdrop.classList.add("show");
}

// Fecha a janela de login.
function fecharConta() {
    accountBackdrop.classList.remove("show");
}

// Alterna entre login e cadastro.
function mudarModoConta(modo) {
    modoConta = modo;

    const cadastro = modo === "register";

    document.getElementById("account-title").textContent =
        cadastro ? "Criar uma conta" : "Entrar na conta";

    document.getElementById("account-submit").textContent =
        cadastro ? "CRIAR CONTA" : "ENTRAR";

    document.getElementById("name-field").classList.toggle(
        "hidden",
        !cadastro
    );

    document.getElementById("account-name").required = cadastro;

    document.getElementById("login-tab").classList.toggle(
        "active",
        !cadastro
    );

    document.getElementById("register-tab").classList.toggle(
        "active",
        cadastro
    );
}

// Botões da conta.
document.getElementById("open-account").addEventListener("click", abrirConta);
document.getElementById("close-account").addEventListener("click", fecharConta);

document.getElementById("login-tab").addEventListener("click", () => {
    mudarModoConta("login");
});

document.getElementById("register-tab").addEventListener("click", () => {
    mudarModoConta("register");
});

// Fecha a janela ao clicar fora.
accountBackdrop.addEventListener("click", event => {
    if (event.target === accountBackdrop) {
        fecharConta();
    }
});

// Envio do formulário.
accountForm.addEventListener("submit", event => {
    event.preventDefault();

    const nome = document.getElementById("account-name").value.trim();

    const mensagem = modoConta === "register"
        ? "Conta demonstrativa criada" + (nome ? " para " + nome : "") + "!"
        : "Login demonstrativo realizado!";

    fecharConta();
    accountForm.reset();
    mudarModoConta("login");

    mostrarAviso(mensagem);
});

// BANNER FLUTUANTE.
document.getElementById("close-floating-banner").addEventListener("click", () => {
    document.getElementById("floating-banner").classList.add("fechado");
});

// Fecha o banner ao clicar no link.
document.getElementById("floating-banner-link").addEventListener("click", () => {
    document.getElementById("floating-banner").classList.add("fechado");
});

// Inicia o site.
mostrarProdutos();
mostrarCarrinho();