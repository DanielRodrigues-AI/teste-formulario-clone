document.addEventListener("DOMContentLoaded", () => {
    const discQuestions = [
        { id: 1, words: [{ text: "Dominante", type: "D" }, { text: "Inspirador", type: "I" }, { text: "Solidário", type: "S" }, { text: "Cauteloso", type: "C" }] },
        { id: 2, words: [{ text: "Competitivo", type: "D" }, { text: "Alegre", type: "I" }, { text: "Considerado", type: "S" }, { text: "Perfeccionista", type: "C" }] },
        { id: 3, words: [{ text: "Decidido", type: "D" }, { text: "Entusiasta", type: "I" }, { text: "Leal", type: "S" }, { text: "Analítico", type: "C" }] },
        { id: 4, words: [{ text: "Aventureiro", type: "D" }, { text: "Visionário", type: "I" }, { text: "Pacífico", type: "S" }, { text: "Preciso", type: "C" }] },
        { id: 5, words: [{ text: "Ousado", type: "D" }, { text: "Comunicativo", type: "I" }, { text: "Calmo", type: "S" }, { text: "Organizado", type: "C" }] },
        { id: 6, words: [{ text: "Determinado", type: "D" }, { text: "Convincente", type: "I" }, { text: "Gentil", type: "S" }, { text: "Disciplinado", type: "C" }] },
        { id: 7, words: [{ text: "Assertivo", type: "D" }, { text: "Sociável", type: "I" }, { text: "Paciente", type: "S" }, { text: "Meticuloso", type: "C" }] },
        { id: 8, words: [{ text: "Independente", type: "D" }, { text: "Otimista", type: "I" }, { text: "Confiável", type: "S" }, { text: "Detalhista", type: "C" }] },
        { id: 9, words: [{ text: "Enérgico", type: "D" }, { text: "Expressivo", type: "I" }, { text: "Tranquilo", type: "S" }, { text: "Cuidadoso", type: "C" }] },
        { id: 10, words: [{ text: "Corajoso", type: "D" }, { text: "Influente", type: "I" }, { text: "Amigável", type: "S" }, { text: "Sistemático", type: "C" }] },
        { id: 11, words: [{ text: "Direto", type: "D" }, { text: "Animado", type: "I" }, { text: "Acolhedor", type: "S" }, { text: "Criterioso", type: "C" }] },
        { id: 12, words: [{ text: "Persistente", type: "D" }, { text: "Persuasivo", type: "I" }, { text: "Atencioso", type: "S" }, { text: "Exato", type: "C" }] },
        { id: 13, words: [{ text: "Franco", type: "D" }, { text: "Espontâneo", type: "I" }, { text: "Estável", type: "S" }, { text: "Rigoroso", type: "C" }] },
        { id: 14, words: [{ text: "Desafiador", type: "D" }, { text: "Carismático", type: "I" }, { text: "Compreensivo", type: "S" }, { text: "Prudente", type: "C" }] },
        { id: 15, words: [{ text: "Audacioso", type: "D" }, { text: "Motivador", type: "I" }, { text: "Colaborativo", type: "S" }, { text: "Racional", type: "C" }] },
        { id: 16, words: [{ text: "Firme", type: "D" }, { text: "Empolgante", type: "I" }, { text: "Diplomático", type: "S" }, { text: "Ponderado", type: "C" }] },
        { id: 17, words: [{ text: "Resoluto", type: "D" }, { text: "Encantador", type: "I" }, { text: "Tolerante", type: "S" }, { text: "Lógico", type: "C" }] },
        { id: 18, words: [{ text: "Pragmático", type: "D" }, { text: "Criativo", type: "I" }, { text: "Receptivo", type: "S" }, { text: "Investigativo", type: "C" }] },
        { id: 19, words: [{ text: "Objetivo", type: "D" }, { text: "Divertido", type: "I" }, { text: "Harmonioso", type: "S" }, { text: "Minucioso", type: "C" }] },
        { id: 20, words: [{ text: "Realizador", type: "D" }, { text: "Popular", type: "I" }, { text: "Prestativo", type: "S" }, { text: "Convencional", type: "C" }] },
        { id: 21, words: [{ text: "Competente", type: "C" }, { text: "Acolhedor", type: "S" }, { text: "Animado", type: "I" }, { text: "Direto", type: "D" }] },
        { id: 22, words: [{ text: "Exato", type: "C" }, { text: "Atencioso", type: "S" }, { text: "Persuasivo", type: "I" }, { text: "Persistente", type: "D" }] },
        { id: 23, words: [{ text: "Criterioso", type: "C" }, { text: "Gentil", type: "S" }, { text: "Influente", type: "I" }, { text: "Corajoso", type: "D" }] },
        { id: 24, words: [{ text: "Minucioso", type: "C" }, { text: "Harmonioso", type: "S" }, { text: "Divertido", type: "I" }, { text: "Objetivo", type: "D" }] },
        { id: 25, words: [{ text: "Sistemático", type: "C" }, { text: "Amigável", type: "S" }, { text: "Expressivo", type: "I" }, { text: "Enérgico", type: "D" }] }
    ];

    let currentPage = 0;
    const questionsPerPage = 5;
    const totalQuestions = 25;
    const userAnswers = {};

    // Captura o ID da avaliação passada via parâmetro URL (?id=ass_...)
    const urlParams = new URLSearchParams(window.location.search);
    const assessmentId = urlParams.get('id');

    const container = document.getElementById("questions-container");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const greetingTitle = document.getElementById("client-greeting-title");

    // Tenta identificar o cliente com base no estado do dashboard para saudação
    const dbAssessments = JSON.parse(localStorage.getItem("dashboard_assessments")) || [];
    const currentAssessment = dbAssessments.find(a => a.id === assessmentId);

    if (currentAssessment) {
        greetingTitle.textContent = `Olá, ${currentAssessment.clientName}!`;
    }

    function renderPage() {
        container.innerHTML = "";
        const start = currentPage * questionsPerPage;
        const end = start + questionsPerPage;
        const currentQuestions = discQuestions.slice(start, end);

        currentQuestions.forEach(q => {
            const blockDiv = document.createElement("div");
            blockDiv.className = "rounded-lg border border-slate-200 bg-white p-6 pt-4 shadow-sm";
            blockDiv.setAttribute("data-block-id", q.id);

            let tableHTML = `
                <div class="flex items-center gap-2 mb-4">
                    <div class="inline-flex items-center justify-center rounded-full bg-blue-600 font-bold text-xs h-6 w-6 text-white">${q.id}</div>
                    <span class="text-sm font-medium text-slate-900">Escolha a que MAIS e a que MENOS descreve você</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-slate-100 text-slate-500 font-medium">
                                <th class="text-left py-2 font-medium">Característica</th>
                                <th class="text-center py-2 w-24 font-medium text-green-600">MAIS</th>
                                <th class="text-center py-2 w-24 font-medium text-red-500">MENOS</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
            `;

            q.words.forEach(w => {
                tableHTML += `
                    <tr data-word-type="${w.type}">
                        <td class="py-3 font-medium text-slate-700">${w.text}</td>
                        <td class="text-center py-3">
                            <button type="button" data-type="mais" class="h-6 w-6 rounded-full border-2 border-slate-300 transition-all mx-auto block hover:border-green-500 focus:outline-none"></button>
                        </td>
                        <td class="text-center py-3">
                            <button type="button" data-type="menos" class="h-6 w-6 rounded-full border-2 border-slate-300 transition-all mx-auto block hover:border-red-500 focus:outline-none"></button>
                        </td>
                    </tr>
                `;
            });

            tableHTML += `</tbody></table></div>`;
            blockDiv.innerHTML = tableHTML;
            container.appendChild(blockDiv);

            // Restaura respostas anteriores na navegação de abas
            if (userAnswers[`block_${q.id}`]) {
                const ans = userAnswers[`block_${q.id}`];
                if (ans.mais) applyVisualSelection(q.id, ans.mais, "mais");
                if (ans.menos) applyVisualSelection(q.id, ans.menos, "menos");
            }
        });

        updateNavigation();
    }

    function applyVisualSelection(blockId, wordType, selectionType) {
        const blockEl = container.querySelector(`[data-block-id="${blockId}"]`);
        if (!blockEl) return;

        const row = blockEl.querySelector(`tr[data-word-type="${wordType}"]`);
        const targetBtn = row.querySelector(`button[data-type="${selectionType}"]`);
        const oppositeBtn = row.querySelector(`button[data-type="${selectionType === 'mais' ? 'menos' : 'mais'}"]`);

        if (selectionType === "mais") {
            targetBtn.className = "h-6 w-6 rounded-full border-2 transition-all mx-auto block bg-green-500 border-green-500";
        } else {
            targetBtn.className = "h-6 w-6 rounded-full border-2 transition-all mx-auto block bg-red-500 border-red-500";
        }

        // BLOQUEIO CIRÚRGICO DA MESMA LINHA: Impede clique e muda cursor para "not-allowed"
        oppositeBtn.setAttribute("disabled", "true");
        oppositeBtn.className = "h-6 w-6 rounded-full border-2 border-slate-200 bg-slate-100 opacity-40 mx-auto block cursor-not-allowed";
    }

    function clearVisualSelection(blockId, wordType, selectionType) {
        const blockEl = container.querySelector(`[data-block-id="${blockId}"]`);
        if (!blockEl) return;

        const row = blockEl.querySelector(`tr[data-word-type="${wordType}"]`);
        const targetBtn = row.querySelector(`button[data-type="${selectionType}"]`);
        const oppositeBtn = row.querySelector(`button[data-type="${selectionType === 'mais' ? 'menos' : 'mais'}"]`);

        targetBtn.className = `h-6 w-6 rounded-full border-2 border-slate-300 transition-all mx-auto block hover:border-${selectionType === 'mais' ? 'green' : 'red'}-500 focus:outline-none`;

        // Desbloqueia a linha restaurando o cursor padrão de clique
        oppositeBtn.removeAttribute("disabled");
        oppositeBtn.className = `h-6 w-6 rounded-full border-2 border-slate-300 transition-all mx-auto block hover:border-${selectionType === 'mais' ? 'red' : 'green'}-500 focus:outline-none`;
    }

    container.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-type]");
        if (!btn || btn.hasAttribute("disabled")) return;

        const blockId = btn.closest("[data-block-id]").getAttribute("data-block-id");
        const row = btn.closest("tr");
        const wordType = row.getAttribute("data-word-type");
        const currentType = btn.getAttribute("data-type");

        if (!userAnswers[`block_${blockId}`]) {
            userAnswers[`block_${blockId}`] = { mais: null, menos: null };
        }

        const currentSelection = userAnswers[`block_${blockId}`][currentType];

        if (currentSelection === wordType) {
            clearVisualSelection(blockId, wordType, currentType);
            userAnswers[`block_${blockId}`][currentType] = null;
        } else {
            if (currentSelection) {
                clearVisualSelection(blockId, currentSelection, currentType);
            }

            userAnswers[`block_${blockId}`][currentType] = wordType;
            applyVisualSelection(blockId, wordType, currentType);
        }

        validatePageAnswers();
    });

    function validatePageAnswers() {
        const start = currentPage * questionsPerPage;
        const end = start + questionsPerPage;
        const currentQuestions = discQuestions.slice(start, end);

        let allAnswered = true;
        currentQuestions.forEach(q => {
            if (!userAnswers[`block_${q.id}`]?.mais || !userAnswers[`block_${q.id}`]?.menos) {
                allAnswered = false;
            }
        });

        if (allAnswered) {
            btnNext.removeAttribute("disabled");
        } else {
            btnNext.setAttribute("disabled", "true");
        }

        const totalAnswered = Object.keys(userAnswers).filter(k => userAnswers[k].mais && userAnswers[k].menos).length;
        const percentage = (totalAnswered / totalQuestions) * 100;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${totalAnswered} / ${totalQuestions}`;
    }

    function updateNavigation() {
        if (currentPage === 0) {
            btnPrev.setAttribute("disabled", "true");
        } else {
            btnPrev.removeAttribute("disabled");
        }

        if (currentPage === 4) {
            btnNext.textContent = "Enviar Teste DISC";
        } else {
            btnNext.textContent = "Próximo";
        }

        validatePageAnswers();
    }

    btnNext.addEventListener("click", () => {
        if (currentPage < 4) {
            currentPage++;
            renderPage();
            window.scrollTo(0, 0);
        } else {
            finalizeAssessment();
        }
    });

    btnPrev.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            renderPage();
            window.scrollTo(0, 0);
        }
    });

    function finalizeAssessment() {
        const activeAssessments = JSON.parse(localStorage.getItem("dashboard_assessments")) || [];
        const index = activeAssessments.findIndex(a => a.id === assessmentId);

        if (index !== -1) {
            // ==========================================
            // CÁLCULO DINÂMICO DOS PONTOS DISC
            // ==========================================
            const scores = { D: 0, I: 0, S: 0, C: 0 };

            // Percorre cada bloco respondido pelo usuário e soma os pontos
            Object.values(userAnswers).forEach(ans => {
                // Quem ele marcou como MAIS ganha +1 ponto no vetor correspondente
                if (ans.mais && scores[ans.mais] !== undefined) {
                    scores[ans.mais]++;
                }
                // (Opcional) Se quiser pontuar o "MENOS", pode adicionar lógica aqui.
                // Para simplificar o gráfico clássico, contamos os fatores dominantes (MAIS).
            });

            // Altera o status e salva o objeto consolidado com os pontos somados
            activeAssessments[index].status = "Respondido";
            activeAssessments[index].answers = scores; // Salva { D: X, I: Y, S: Z, C: W }

            localStorage.setItem("dashboard_assessments", JSON.stringify(activeAssessments));

            // Oculta o formulário de perguntas
            document.getElementById("test-box").classList.add("hidden");

            // Exibe a tela de agradecimento final
            const resultBox = document.getElementById("result-box");
            const resultMessage = document.getElementById("result-message");
            resultBox.classList.remove("hidden");

            // Define qual é o maior fator para mostrar na tela se o analista liberou
            const perfilDominante = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
            const nomesPerfil = { D: "Dominância (D)", I: "Influência (I)", S: "Estabilidade (S)", C: "Conformidade (C)" };

            if (activeAssessments[index].showResultToClient) {
                resultMessage.innerHTML = `Sua avaliação foi processada! Seu perfil predominante mapeado foi: <strong>${nomesPerfil[perfilDominante]}</strong>. Uma análise detalhada foi enviada ao seu profissional responsável.`;
            } else {
                resultMessage.innerHTML = `Sua avaliação foi enviada com sucesso! Os resultados foram encaminhados diretamente ao painel do seu analista responsável.`;
            }
        } else {
            alert("Erro: ID de avaliação inválido ou não encontrado no sistema principal.");
        }
    }

    renderPage();
});