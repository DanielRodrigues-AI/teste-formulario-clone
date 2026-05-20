document.addEventListener("DOMContentLoaded", () => {
    // 10 Variações de testes baseados no ecossistema DISC
    const testTypes = [
        { id: "disc_classic", name: "DISC Perfil Clássico" }

    ];

    const state = {
        clients: JSON.parse(localStorage.getItem("dashboard_clients")) || [],
        assessments: JSON.parse(localStorage.getItem("dashboard_assessments")) || []
    };

    // Seletores Gerais
    const clientForm = document.getElementById("client-form");
    const clientNameInput = document.getElementById("client-name");
    const clientsTableBody = document.getElementById("clients-table-body");
    const searchClientInput = document.getElementById("search-client"); // Novo seletor de busca

    const selectClient = document.getElementById("select-client");
    const selectTestType = document.getElementById("select-test-type");
    const assessmentForm = document.getElementById("assessment-form");
    const tableBody = document.getElementById("assessments-table-body");

    const menuButtons = document.querySelectorAll("#dashboard-menu button");
    const contents = document.querySelectorAll(".tab-content");

    // Lógica de navegação lateral
    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            menuButtons.forEach(b => {
                b.className = "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg border-l-4 border-transparent text-left transition-all";
            });
            btn.className = "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 bg-blue-50/50 rounded-lg border-l-4 border-blue-600 text-left transition-all";
            contents.forEach(content => content.classList.add("hidden"));
            document.getElementById(targetId).classList.remove("hidden");
        });
    });

    function init() {
        if (selectTestType) {
            selectTestType.innerHTML = '<option value="" disabled selected>Escolha o teste...</option>';
            testTypes.forEach(test => {
                const opt = new Option(test.name, test.id);
                selectTestType.add(opt);
            });
        }

        // Evento de digitação na barra de pesquisa
        if (searchClientInput) {
            searchClientInput.addEventListener("input", renderClients);
        }

        renderClients();
        renderAssessments();
    }

    // CADASTRO DE CLIENTES
    clientForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = clientNameInput.value.trim();
        if (!name) return;

        const newClient = { id: 'cli_' + Date.now(), name };
        state.clients.push(newClient);

        localStorage.setItem("dashboard_clients", JSON.stringify(state.clients));
        clientNameInput.value = "";

        renderClients();
    });

    // FUNÇÃO PARA EXCLUIR CLIENTE
    window.deleteClient = function (clientId) {
        if (confirm("Tem certeza que deseja remover este cliente do sistema?")) {
            // Remove do array de clientes
            state.clients = state.clients.filter(c => c.id !== clientId);
            localStorage.setItem("dashboard_clients", JSON.stringify(state.clients));

            // Opcional: Remove também o histórico de testes desse cliente se quiser limpar tudo
            state.assessments = state.assessments.filter(a => a.clientId !== clientId);
            localStorage.setItem("dashboard_assessments", JSON.stringify(state.assessments));

            // Atualiza a tela
            renderClients();
            renderAssessments();
        }
    };

    function renderClients() {
        if (clientsTableBody) clientsTableBody.innerHTML = "";
        if (selectClient) selectClient.innerHTML = '<option value="" disabled selected>Escolha o cliente...</option>';

        if (state.clients.length === 0) {
            if (clientsTableBody) {
                clientsTableBody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-sm text-slate-400 font-normal">Nenhum cliente no banco de dados.</td></tr>`;
            }
            return;
        }

        // Filtra os clientes com base no termo digitado na barra de pesquisa
        const searchTerm = searchClientInput ? searchClientInput.value.toLowerCase().trim() : "";
        let filteredClients = state.clients.filter(c => c.name.toLowerCase().includes(searchTerm));

        // Ordena a lista filtrada em ordem alfabética (A-Z)
        filteredClients.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));

        if (filteredClients.length === 0 && clientsTableBody) {
            clientsTableBody.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-sm text-slate-400 font-normal">Nenhum cliente correspondente encontrado.</td></tr>`;
            return;
        }

        filteredClients.forEach(client => {
            // Popula a tabela da aba "Clientes Cadastrados" com botão de lixeira
            if (clientsTableBody) {
                const tr = document.createElement("tr");
                tr.className = "border-b border-slate-50 hover:bg-slate-50/50 transition-colors";
                tr.innerHTML = `
                    <td class="py-3 text-xs text-slate-400 font-mono">#${client.id.split('_')[1]}</td>
                    <td class="py-3 font-semibold text-slate-900">${client.name}</td>
                    <td class="py-3 text-right">
                        <button type="button" onclick="deleteClient('${client.id}')" class="text-red-500 hover:text-red-700 font-bold text-sm p-1 px-2 rounded hover:bg-red-50 transition-all" title="Excluir Cliente">
                            🗑️
                        </button>
                    </td>
                `;
                clientsTableBody.appendChild(tr);
            }

            // Popula o select da aba "Liberar Testes"
            if (selectClient) {
                const opt = new Option(client.name, client.id);
                selectClient.add(opt);
            }
        });
    }

    // DISPARO DE TESTES
    // DISPARO DE TESTES (ATUALIZADO)
    // DISPARO DE TESTES (NÃO ABRE ABA, MOSTRA BOTÃO DE CÓPIA)
    // DISPARO DE TESTES (CORRIGIDO PARA CAMINHOS RELATIVOS - SEM DEPENDER DE LIVE SERVER)
    assessmentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const clientId = selectClient.value;
        const testId = selectTestType.value;

        if (!clientId || !testId) return;

        const client = state.clients.find(c => c.id === clientId);
        const test = testTypes.find(t => t.id === testId);

        const newAssessment = {
            id: 'ass_' + Date.now(),
            clientId: client.id,
            clientName: client.name,
            testId: test.id,
            testName: test.name,
            status: "Pendente",
            showResultToClient: false,
            answers: null
        };

        state.assessments.push(newAssessment);
        localStorage.setItem("dashboard_assessments", JSON.stringify(state.assessments));

        // CAPTURA O CAMINHO ATUAL DA URL DA DASHBOARD
        // Isso descobre se você está usando http://127.0.0.1 ou file:///C:/...
        const currentPath = window.location.href;

        // Remove o "dashboard.html" do final do endereço para pegar a pasta raiz "Projeto"
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));

        // Monta o link final juntando a raiz com a localização exata da pasta mapeada no seu print
        const basePath = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
        // ELEMENTOS DA CAIXA DE LINK
        const linkBox = document.getElementById("link-container-box");
        const urlInput = document.getElementById("generated-url-input");
        const btnCopy = document.getElementById("btn-copy-link");
        const copyIcon = document.getElementById("copy-icon");
        const copyText = document.getElementById("copy-btn-text");

        // Insere o link no campo e mostra a caixa na tela
        urlInput.value = testUrl;
        linkBox.classList.remove("hidden");

        // Reseta o estado do botão de cópia
        copyIcon.textContent = "📋";
        copyText.textContent = "Copiar";
        btnCopy.className = "inline-flex items-center justify-center gap-2 rounded-md text-sm font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 h-10 px-4 transition-colors";

        // CONFIGURAÇÃO DO CLIQUE DE CÓPIA
        btnCopy.onclick = () => {
            navigator.clipboard.writeText(testUrl).then(() => {
                copyIcon.textContent = "✅";
                copyText.textContent = "Copiado!";
                btnCopy.className = "inline-flex items-center justify-center gap-2 rounded-md text-sm font-bold bg-green-50 border border-green-300 text-green-700 h-10 px-4 transition-colors";
                urlInput.select();
            }).catch(() => {
                // Alternativa caso o navegador restrinja o clipboard em modo file:/// por segurança
                urlInput.select();
                document.execCommand("copy");
                copyIcon.textContent = "✅";
                copyText.textContent = "Copiado!";
            });
        };

        selectClient.value = "";
        selectTestType.value = "";

        renderAssessments();
    });
    function renderAssessments() {
        if (!tableBody) return;
        tableBody.innerHTML = "";

        if (state.assessments.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-sm text-slate-400 font-normal">Nenhuma avaliação disparada.</td></tr>`;
            return;
        }

        const sortedAssessments = [...state.assessments].sort((a, b) => a.clientName.localeCompare(b.clientName, 'pt-BR', { sensitivity: 'base' }));

        sortedAssessments.forEach(ass => {
            const tr = document.createElement("tr");
            tr.className = "border-b border-slate-50 hover:bg-slate-50/50 transition-colors";

            const statusBadge = ass.status === "Respondido"
                ? `<span class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">Respondido</span>`
                : `<span class="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">Pendente</span>`;

            tr.innerHTML = `
                <td class="py-3 px-2 font-semibold text-slate-900">${ass.clientName}</td>
                <td class="py-3 px-2 text-sm text-slate-500">${ass.testName}</td>
                <td class="py-3 px-2 text-center">${statusBadge}</td>
                <td class="py-3 px-2 text-center">
                    <label class="relative inline-flex items-center cursor-pointer mx-auto">
                        <input type="checkbox" data-id="${ass.id}" class="sr-only peer" ${ass.showResultToClient ? 'checked' : ''}>
                        <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </td>
                <td class="py-3 px-2 text-right">
                    <button class="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:opacity-30" ${ass.status !== 'Respondido' ? 'disabled' : ''} onclick="viewResult('${ass.id}')">
                        Ver Relatório
                    </button>
                </td>
            `;

            tr.querySelector('input[type="checkbox"]').addEventListener('change', (event) => {
                const currentId = event.target.getAttribute('data-id');
                const targetAss = state.assessments.find(a => a.id === currentId);
                targetAss.showResultToClient = event.target.checked;
                localStorage.setItem("dashboard_assessments", JSON.stringify(state.assessments));
            });

            tableBody.appendChild(tr);
        });
    }

    window.viewResult = function (assessmentId) {
        const target = state.assessments.find(a => a.id === assessmentId);
        alert(`REMANESCENTE DA ANÁLISE — PSICO Corporation\n\nCliente: ${target.clientName}\nAvaliação: ${target.testName}\n\nRespostas brutas capturadas do formulário:\n` + JSON.stringify(target.answers, null, 2));
    };

    init();
});