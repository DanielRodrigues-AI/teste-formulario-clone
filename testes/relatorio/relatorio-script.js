document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const assessmentId = urlParams.get('id');

    if (!assessmentId) {
        document.body.innerHTML = "<h1 class='text-center mt-10 text-red-500 font-bold'>Erro: ID do relatório não informado.</h1>";
        return;
    }

    // Busca os dados armazenados
    const assessments = JSON.parse(localStorage.getItem("dashboard_assessments")) || [];
    const targetData = assessments.find(a => a.id === assessmentId);

    if (!targetData || !targetData.answers) {
        document.body.innerHTML = "<h1 class='text-center mt-10 text-slate-500 font-bold'>Relatório pendente ou não encontrado.</h1>";
        return;
    }

    // Preenche os dados do cabeçalho
    document.getElementById("rep-client-name").textContent = targetData.clientName;
    document.getElementById("rep-test-name").textContent = targetData.testName;

    // Renderiza o gráfico simples em barras
    const container = document.getElementById("results-bars-container");
    container.innerHTML = ""; // Limpa o texto de carregamento

    const labels = {
        D: { name: "Dominância (D)", color: "bg-red-500" },
        I: { name: "Influência (I)", color: "bg-amber-500" },
        S: { name: "Estabilidade (S)", color: "bg-green-500" },
        C: { name: "Conformidade (C)", color: "bg-blue-500" }
    };

    // Percorre as respostas salvas e cria as barras visuais
    Object.entries(targetData.answers).forEach(([key, value]) => {
        const info = labels[key];
        if (!info) return;

        // Calcula uma porcentagem simples para a barra (supondo que o máximo de pontos seja 25)
        const percentage = Math.min((value / 25) * 100, 100);

        const barRow = document.createElement("div");
        barRow.className = "space-y-1";
        barRow.innerHTML = `
            <div class="flex justify-between text-sm font-semibold">
                <span class="text-slate-700">${info.name}</span>
                <span class="text-slate-900">${value} pts</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <div class="${info.color} h-4 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
            </div>
        `;
        container.appendChild(barRow);
    });
});