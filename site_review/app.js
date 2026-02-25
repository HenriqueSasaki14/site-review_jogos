/* ============
  Dados (reviews + campeonatos) + seguir jogos
  - Seguimento: localStorage["followedGames"] (array)
  - Perfil: localStorage["profileName"], localStorage["profilePhoto"] (opcional)
============== */

const DATA = {
    valorant: {
        name: "Valorant",
        logo: "assets/valorantlogo.png",
        color: "Vermelho",
        page: "vermelho.html",
        genre: "FPS tático 5v5",
        review: {
            nota: 8.3,
            resumo:
                "FPS tático competitivo com forte foco em mira + habilidades de agentes, rounds curtos e alto teto de aprendizado. Excelente para quem curte estratégia e execução em equipe.",
            fonte: "Metacritic + guias/jornalismo de eSports"
        },
        tournaments: [
            {
                title: "VALORANT Masters Santiago 2026",
                date: "28 Fev – 15 Mar 2026",
                url: "https://liquipedia.net/valorant/VCT/2026/Stage_1/Masters"
            },
            {
                title: "VALORANT Masters London 2026",
                date: "05 – 21 Jun 2026",
                url: "https://liquipedia.net/valorant/VCT/2026/Stage_1/Masters"
            },
            {
                title: "VALORANT Champions 2026",
                date: "24 Set – 18 Out 2026",
                url: "https://liquipedia.net/valorant/VCT/2026/Stage_1/Masters"
            }
        ],
        sources: [
            "VLR.gg (VCT)",
            "Liquipedia (VCT 2026)"
        ]
    },
    fortnite: {
        name: "Fortnite",
        logo: "assets/fortnitelogo.png",
        color: "Azul",
        page: "azul.html",
        genre: "Battle Royale / Zero Build",
        review: {
            nota: 7.8,
            resumo:
                "Battle royale com identidade única por causa da construção (e modos alternativos), ritmo rápido e eventos frequentes. Muito forte em conteúdo sazonal e competitivo online.",
            fonte: "Metacritic + cenário competitivo oficial"
        },
        tournaments: [
            {
                title: "FNCS Trial (início do caminho)",
                date: "31 Jan 2026",
                url: "https://fortnitetracker.com/events?region=BR"
            },
            {
                title: "FNCS Major 1 Finals",
                date: "25 – 26 Abr 2026",
                url: "https://fortnitetracker.com/events?region=BR"
            },
            {
                title: "FNCS Major 2 Finals",
                date: "08 – 09 Ago 2026",
                url: "https://fortnitetracker.com/events?region=BR"
            },
            {
                title: "FNCS Major 3 Finals",
                date: "10 – 11 Out 2026",
                url: "https://fortnitetracker.com/events?region=BR"
            },
            {
                title: "Fortnite Global Championship",
                date: "Nov 2026",
                url: "https://fortnitetracker.com/events?region=BR"
            }
        ],
        sources: [
            "Fortnite Competitive (FNCS 2026 overview)"
        ]
    },
    r6: {
        name: "Rainbow Six Siege",
        logo: "assets/r6logo.jpg",
        color: "Amarelo",
        page: "amarelo.html",
        genre: "FPS tático (breach/defesa)",
        review: {
            nota: 8.0,
            resumo:
                "FPS tático intenso, baseado em informação, destruição e coordenação. Curva de aprendizado é pesada, mas entrega partidas tensas e estratégicas quando o time encaixa.",
            fonte: "Metacritic + cobertura competitiva"
        },
        tournaments: [
            {
                title: "Six Invitational 2026 (Paris)",
                date: "02 – 15 Fev 2026",
                url: "https://liquipedia.net/rainbowsix/Main_Page"
            },
            {
                title: "Esports World Cup 2026 (R6)",
                date: "04 – 14 Ago 2026",
                url: "https://liquipedia.net/rainbowsix/Main_Page"
            }
        ],
        sources: [
            "Ubisoft R6 Esports (SI 2026 / calendário)",
            "Liquipedia (EWC 2026 R6)"
        ]
    }
};

/* ============
  Seguidores
============== */
function getFollowedGames() {
    try {
        return JSON.parse(localStorage.getItem("followedGames")) || [];
    } catch {
        return [];
    }
}
function setFollowedGames(arr) {
    localStorage.setItem("followedGames", JSON.stringify(arr));
}
function isFollowing(gameKey) {
    return getFollowedGames().includes(gameKey);
}
function followGame(gameKey) {
    const list = getFollowedGames();
    if (!list.includes(gameKey)) {
        list.push(gameKey);
        setFollowedGames(list);
    }
}
function unfollowGame(gameKey) {
    const list = getFollowedGames().filter(g => g !== gameKey);
    setFollowedGames(list);
}

/* ============
  UI helpers
============== */
function $(sel) { return document.querySelector(sel); }
function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v);
    });
    children.forEach(c => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
}

function renderFollowButton(gameKey) {
    const btn = el("button", { class: "btn primary", type: "button" }, []);
    const refresh = () => {
        btn.textContent = isFollowing(gameKey) ? "Seguindo ✅" : "Seguir +";
    };
    btn.addEventListener("click", () => {
        if (isFollowing(gameKey)) unfollowGame(gameKey);
        else followGame(gameKey);
        refresh();
        // Atualiza badges/contadores em páginas que tenham isso
        window.dispatchEvent(new Event("follow:update"));
    });
    refresh();
    return btn;
}

/* ============
  Home (preto.html)
============== */
function initHome() {
    const grid = $("#gamesGrid");
    if (!grid) return;

    grid.innerHTML = "";
    Object.entries(DATA).forEach(([key, game]) => {
        const card = el("div", { class: "card" }, [
            el("div", { class: "card-title" }, [
                el("div", { class: "card-left" }, [
                    el("img", { class: "card-logo", src: game.logo, alt: `Logo ${game.name}` }),
                    el("h2", {}, [game.name]),
                ]),
                el("span", { class: "badge" }, [game.genre])
            ]),
            el("p", {}, [game.review.resumo]),
            el("div", { class: "kpi" }, [
                el("span", { class: "pill" }, [`Nota: ${game.review.nota}/10`])
            ]),
            el("div", { class: "actions" }, [
                el("a", { class: "btn", href: game.page }, ["Ver review →"]),
                renderFollowButton(key)
            ])
        ]);
        grid.appendChild(card);
    });

    const count = $("#followingCount");
    const updateCount = () => {
        const n = getFollowedGames().length;
        if (count) count.textContent = `${n} jogo(s) seguido(s)`;
    };
    updateCount();
    window.addEventListener("follow:update", updateCount);
}

/* ============
  Página de jogo (vermelho/azul/amarelo)
============== */
function initGamePage(gameKey) {
    const root = $("#gameRoot");
    if (!root) return;

    const game = DATA[gameKey];
    if (!game) return;

    $("#gameName").textContent = game.name;
    $("#gameGenre").textContent = game.genre;
    $("#gameNote").textContent = `${game.review.nota}/10`;
    $("#gameSummary").textContent = game.review.resumo;

    const followSlot = $("#followSlot");
    followSlot.innerHTML = "";
    followSlot.appendChild(renderFollowButton(gameKey));

    const tbody = $("#tournamentsBody");
    tbody.innerHTML = "";
    game.tournaments.forEach(t => {
        const tr = el("tr", {}, [
            el("td", {}, [t.title]),
            el("td", {}, [t.date])
        ]);
        tbody.appendChild(tr);
    });

    const src = $("#sourcesList");
    if (src) {
        src.innerHTML = "";
        game.sources.forEach(s => src.appendChild(el("li", {}, [s])));
    }
}

/* ============
  Perfil (verde.html)
============== */
function initProfile() {
    const followedList = $("#followedList");
    if (!followedList) return;

    const nameInput = $("#profileName");
    const saveNameBtn = $("#saveNameBtn");
    const photoInput = $("#profilePhoto");
    const avatarImg = $("#avatarImg");
    const avatarFallback = $("#avatarFallback");

    // Carrega nome
    const savedName = localStorage.getItem("profileName") || "";
    if (nameInput) nameInput.value = savedName;

    // Carrega foto (base64) se tiver
    const savedPhoto = localStorage.getItem("profilePhoto");
    if (savedPhoto && avatarImg) {
        avatarImg.src = savedPhoto;
        avatarImg.style.display = "block";
        if (avatarFallback) avatarFallback.style.display = "none";
    }

    saveNameBtn?.addEventListener("click", () => {
        localStorage.setItem("profileName", nameInput.value.trim());
        alert("Nome salvo!");
    });

    photoInput?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            localStorage.setItem("profilePhoto", dataUrl);
            if (avatarImg) {
                avatarImg.src = dataUrl;
                avatarImg.style.display = "block";
            }
            if (avatarFallback) avatarFallback.style.display = "none";
        };
        reader.readAsDataURL(file);
    });

    const render = () => {
        const followed = getFollowedGames();
        followedList.innerHTML = "";

        if (followed.length === 0) {
            followedList.appendChild(el("p", { class: "small" }, ["Você ainda não segue nenhum jogo. Volte na Home e clique em “Seguir +”."]));
        } else {
            followed.forEach(key => {
                const g = DATA[key];
                const row = el("div", { class: "section", style: "margin-top:12px; padding:14px;" }, [
                    el("div", { class: "card-title" }, [
                        el("div", { class: "card-left" }, [
                            el("img", { class: "card-logo", src: game.logo, alt: `Logo ${game.name}` }),
                            el("h2", {}, [game.name]),
                        ]),
                        el("span", { class: "badge" }, [game.genre])
                    ]),
                    el("div", { class: "actions" }, [
                        el("a", { class: "btn", href: g?.page || "preto.html" }, ["Abrir página →"]),
                        el("button", {
                            class: "btn danger",
                            type: "button",
                            onclick: () => {
                                unfollowGame(key);
                                window.dispatchEvent(new Event("follow:update"));
                            }
                        }, ["Deixar de seguir"])
                    ])
                ]);
                followedList.appendChild(row);
            });
        }

        // Lista para seguir (todos)
        const all = $("#allGames");
        if (all) {
            all.innerHTML = "";
            Object.entries(DATA).forEach(([key, g]) => {
                const item = el("div", { class: "section", style: "margin-top:12px; padding:14px;" }, [
                    el("div", { class: "title" }, [
                        el("strong", {}, [g.name]),
                        el("span", { class: "badge" }, [isFollowing(key) ? "Seguindo" : "Não seguindo"])
                    ]),
                    el("div", { class: "actions" }, [
                        el("a", { class: "btn", href: g.page }, ["Ver review →"]),
                        renderFollowButton(key)
                    ])
                ]);
                all.appendChild(item);
            });
        }
    };

    render();
    window.addEventListener("follow:update", render);
}

/* ============
  Boot
============== */
document.addEventListener("DOMContentLoaded", () => {
    initHome();
    // Páginas de jogo chamam initGamePage(...) inline
    initProfile();
});