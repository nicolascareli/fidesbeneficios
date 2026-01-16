// ========== BOTÃO WHATSAPP ==========
const btnWhatsapp = document.getElementById("btn-whatsapp");

if (btnWhatsapp) {
    btnWhatsapp.addEventListener("click", function() {
        const telefone = "5511917328282";
        const mensagem = "Olá! Quero saber mais sobre os planos da Fides Benefícios.";
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
    });
}

// ========== BANNER DE COOKIES ==========
document.addEventListener("DOMContentLoaded", function() {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptButton = document.getElementById("accept-cookies");

    if (!cookieBanner || !acceptButton) return;

    const cookiesAccepted = localStorage.getItem("cookiesAccepted");

    if (!cookiesAccepted) {
        cookieBanner.style.display = "block";
    }

    acceptButton.addEventListener("click", function() {
        localStorage.setItem("cookiesAccepted", "true");
        cookieBanner.style.display = "none";
    });
});

// ========== NAVBAR MOBILE ==========
document.addEventListener("DOMContentLoaded", function() {
    const navbar = document.getElementById("navbarFides");
    const toggler = document.querySelector(".navbar-toggler");

    if (!navbar || !toggler) return;

    const navLinks = navbar.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");

            if (targetId.startsWith("#") && window.innerWidth < 992) {
                e.preventDefault();
                toggler.click();

                setTimeout(() => {
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                    }
                }, 300);
            }
        });
    });
});