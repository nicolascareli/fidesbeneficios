document.getElementById("btn-whatsapp").addEventListener("click", function() {
    // número fictício, depois a gente troca
    const telefone = "5511999999999";

    const mensagem = "Olá! Quero saber mais sobre os planos da Fides Benefícios.";

    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
});

// ========== BANNER DE COOKIES ==========

// Espera a página carregar
document.addEventListener("DOMContentLoaded", function() {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptButton = document.getElementById("accept-cookies");

    // Verifica se o usuário já aceitou os cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");

    // Se NÃO aceitou ainda, mostra o banner
    if (!cookiesAccepted) {
        cookieBanner.style.display = "block";
    }

    // Quando clicar em aceitar
    acceptButton.addEventListener("click", function() {
        localStorage.setItem("cookiesAccepted", "true");
        cookieBanner.style.display = "none";
    });
});