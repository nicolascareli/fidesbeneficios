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

/* =========================
  [Fides] CALCULADORA ROI - JS
  Arquivo: roi-calculadora.js
========================== */

(function() {
    // ---------- Helpers de moeda (pt-BR) ----------
    const fmtBRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

    function parseBRL(input) {
        // Aceita "R$ 15.000,00", "15000", "15.000,00"
        const cleaned = String(input || "")
            .replace(/[^\d,.-]/g, "") // mantém números, vírgula, ponto, sinal
            .replace(/\./g, "") // remove separador milhar
            .replace(",", "."); // vírgula -> ponto
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : 0;
    }

    function formatBRL(n) {
        return fmtBRL.format(Number(n || 0));
    }

    function clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }

    // Anima número (efeito “uau”)
    function animateValue(el, from, to, duration = 650, formatter = (x) => x) {
        const start = performance.now();
        const diff = to - from;

        function tick(now) {
            const p = clamp((now - start) / duration, 0, 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3);
            const v = from + diff * eased;
            el.textContent = formatter(v);
            if (p < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    // ---------- Elements ----------
    const $ = (id) => document.getElementById(id);

    const elColabs = $("roiColabs");
    const elBenefMes = $("roiBenefMes");
    const elTurnover = $("roiTurnover");
    const elSalario = $("roiSalario");
    const elCustoSub = $("roiCustoSub");
    const elReducao = $("roiReducao");
    const elBtn = $("roiBtn");

    const outEconomia = $("roiEconomia");
    const outBenefAno = $("roiBenefAno");
    const outPessoasAno = $("roiPessoasAno");
    const outCustoTurnover = $("roiCustoTurnover");
    const outTotal = $("roiTotal");
    const outMainSub = $("roiMainSub");
    const outExplain = $("roiExplain");

    // ---------- Máscara simples ao sair do campo ----------
    function attachMoneyMask(inputEl) {
        inputEl.addEventListener("blur", () => {
            const n = parseBRL(inputEl.value);
            inputEl.value = formatBRL(n);
        });
    }
    attachMoneyMask(elBenefMes);
    attachMoneyMask(elSalario);

    // ---------- Cálculo ----------
    function calcular() {
        const colaboradores = clamp(parseInt(elColabs.value || "0", 10) || 0, 0, 1000000);
        const benefMes = clamp(parseBRL(elBenefMes.value), 0, 1e12);
        const turnoverPct = clamp(parseFloat(elTurnover.value || "0") || 0, 0, 200);
        const salarioMedio = clamp(parseBRL(elSalario.value), 0, 1e12);

        const custoSubMultiplicador = clamp(parseFloat(elCustoSub.value || "1.5") || 1.5, 0, 10);
        const reducao = clamp(parseFloat(elReducao.value || "0.2") || 0.2, 0, 1);

        // Benefícios anual
        const benefAno = benefMes * 12;

        // Turnover (pessoas/ano)
        const pessoasAno = colaboradores * (turnoverPct / 100);

        // Custo anual do turnover estimado:
        // pessoasAno * (salarioMedio * multiplicador)
        const custoTurnover = pessoasAno * (salarioMedio * custoSubMultiplicador);

        // Total visível
        const total = benefAno + custoTurnover;

        // Economia estimada: redução percentual aplicada no custo do turnover
        const economia = custoTurnover * reducao;

        // --------- UI “impactante” ---------
        const prevEconomia = parseBRL(outEconomia.textContent);
        const prevBenefAno = parseBRL(outBenefAno.textContent);
        const prevCustoTurnover = parseBRL(outCustoTurnover.textContent);
        const prevTotal = parseBRL(outTotal.textContent);

        animateValue(outEconomia, prevEconomia, economia, 800, formatBRL);
        animateValue(outBenefAno, prevBenefAno, benefAno, 650, formatBRL);
        animateValue(outCustoTurnover, prevCustoTurnover, custoTurnover, 650, formatBRL);
        animateValue(outTotal, prevTotal, total, 650, formatBRL);

        // Pessoas/ano (inteiro ou 1 casa)
        outPessoasAno.textContent = pessoasAno < 10 ? pessoasAno.toFixed(1) : Math.round(pessoasAno).toString();

        outMainSub.textContent =
            `Com redução de ${(reducao * 100).toFixed(0)}% no turnover (premissa), essa é a economia potencial só com retenção.`;

        outExplain.textContent =
            `Hoje, com ${turnoverPct.toFixed(1)}% de turnover, você troca ~${outPessoasAno.textContent} pessoas/ano.
Isso tende a custar cerca de ${formatBRL(custoTurnover)} (≈ ${custoSubMultiplicador}x salário por troca).
Se o programa reduzir o turnover em ${(reducao * 100).toFixed(0)}%, a economia estimada é ${formatBRL(economia)}.`;
    }

    // Clique principal
    elBtn.addEventListener("click", calcular);

    // Recalcular ao apertar Enter em inputs
    [elColabs, elBenefMes, elTurnover, elSalario].forEach((el) => {
        el.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                calcular();
            }
        });
    });
})();





/* =========================
  [HOME] PROVA SOCIAL — SLIDING REVIEWS
  Arquivo: main.js
========================== */

(function initSlidingReviews() {
    const marquees = document.querySelectorAll(".psl-marquee");
    if (!marquees.length) return;

    marquees.forEach((mq) => {
        const track = mq.querySelector(".psl-track");
        if (!track) return;

        // Duplica conteúdo para loop infinito suave
        const original = track.innerHTML;
        track.innerHTML = original + original;

        // Direção e velocidade
        const dir = (mq.getAttribute("data-direction") || "left").toLowerCase();
        const speed = Number(mq.getAttribute("data-speed") || 40); // segundos

        // Mede metade da largura (conteúdo original)
        // Espera imagens carregarem para medir certo
        const update = () => {
            const half = track.scrollWidth / 2;
            track.style.setProperty("--psl-duration", `${speed}s`);
            track.style.setProperty("--psl-shift", `${half}px`);

            // Se for direita, inverte via scaleX (simples e estável)
            if (dir === "right") {
                mq.style.transform = "scaleX(-1)";
                track.style.transform = "scaleX(-1)";
            } else {
                mq.style.transform = "";
                track.style.transform = "";
            }
        };

        // roda agora e após load
        update();
        window.addEventListener("load", update);
        window.addEventListener("resize", () => {
            clearTimeout(mq._t);
            mq._t = setTimeout(update, 120);
        }, { passive: true });
    });
})();