document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const assessmentId = urlParams.get('id');

    if (!assessmentId) {
        document.body.innerHTML = "<h1 class='text-center mt-10 text-red-500 font-bold'>Erro: ID do relatório inválido.</h1>";
        return;
    }

    const assessments = JSON.parse(localStorage.getItem("dashboard_assessments")) || [];
    const data = assessments.find(a => a.id === assessmentId);

    if (!data || !data.answers) {
        document.body.innerHTML = "<h1 class='text-center mt-10 text-slate-500 font-bold'>Aguardando o preenchimento do teste pelo cliente...</h1>";
        return;
    }

    // Injeta os nomes no cabeçalho
    document.getElementById("client-name-title").textContent = data.clientName;
    document.getElementById("test-name-subtitle").textContent = data.testName;
    document.getElementById("report-date").textContent = `Análise processada pelo Sistema Integra`;

    // Configurações e textos de suporte para cada perfil dominante
    const profilesMeta = {
        D: {
            title: "Dominância (D) — Executor",
            emoji: "🦁",
            color: "rgb(220, 38, 38)",
            bgColor: "from-red-500/10 to-red-600/5",
            borderColor: "border-red-600",
            desc: "Orientado a resultados, assertivo e toma decisões rapidamente. É um líder natural que busca desafios, autonomia e eficiência. Comunica-se de forma direta e objetiva, preferindo ambientes dinâmicos onde possa ter controle sobre as situações.",
            com: "Direto, objetivo e conciso. Vai direto ao ponto sem rodeios.",
            dec: "Rápido e assertivo. Decide com base em resultados esperados.",
            lid: "Autocrático e orientado a metas. Lidera pelo exemplo e determinação.",
            mot: "Resultados práticos, desafios, poder de decisão e autonomia."
        },
        I: {
            title: "Influência (I) — Comunicador",
            emoji: "🦋",
            color: "rgb(245, 158, 11)",
            bgColor: "from-amber-500/10 to-amber-600/5",
            borderColor: "border-amber-500",
            desc: "Entusiasta, comunicativo e altamente sociável. Possui grande poder de persuasão e gosta de trabalhar em equipe. É motivado pelo reconhecimento social e foca em construir relacionamentos harmônicos e criativos.",
            com: "Expressivo, caloroso e focado em histórias e conexões emocionais.",
            dec: "Rápido e intuitivo. Decide com base em sentimentos e no impacto interpessoal.",
            lid: "Inspirador e carismático. Lidera estimulando a criatividade e a união da equipe.",
            mot: "Reconhecimento público, aprovação do grupo e liberdade criativa."
        },
        S: {
            title: "Estabilidade (S) — Planejador",
            emoji: "🐢",
            color: "rgb(22, 163, 74)",
            bgColor: "from-green-500/10 to-green-600/5",
            borderColor: "border-green-600",
            desc: "Paciente, confiável e focado na cooperação. Valoriza a segurança, a constância e ambientes de trabalho previsíveis e calmos. Ouve com atenção extrema e trabalha para manter a harmonia interna do grupo.",
            com: "Calmo, ponderado e focado no bem-estar mútuo. Ouve mais do que fala.",
            dec: "Metódico e seguro. Demanda tempo para analisar o impacto das mudanças.",
            lid: "Participativo e focado no suporte. Apoia a equipe oferecendo segurança.",
            mot: "Ambientes previsíveis, rotinas claras e espírito de colaboração mútua."
        },
        C: {
            title: "Conformidade (C) — Analista",
            emoji: "🦉",
            color: "rgb(37, 99, 235)",
            bgColor: "from-blue-500/10 to-blue-600/5",
            borderColor: "border-blue-600",
            desc: "Analítico, disciplinado e focado na exatidão. Busca a excelência por meio do cumprimento rigoroso de dados, regras e fatos combinados. Detalhista por natureza, evita riscos agindo com cautela lógica.",
            com: "Formal, técnico e baseado em evidências. Fundamenta todas as frases.",
            dec: "Lógico e racional. Só escolhe após checar todas as variáveis possíveis.",
            lid: "Técnico e normativo. Lidera garantindo a qualidade e perfeição do processo.",
            mot: "Organização sistêmica, exatidão técnica e processos lógicos definidos."
        }
    };

    // Descobre qual letra recebeu a maior pontuação para definir o perfil principal
    const scores = data.answers; // Ex: { D: 12, I: 4, S: 5, C: 4 }
    const dominantKey = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const meta = profilesMeta[dominantKey];

    // Alimenta o Bloco de Destaque com o perfil calculado do cliente
    const mainCard = document.getElementById("main-profile-card");
    mainCard.className = `rounded-lg border-2 bg-gradient-to-br ${meta.bgColor} ${meta.borderColor} p-6 shadow-sm`;
    
    document.getElementById("profile-emoji").textContent = meta.emoji;
    document.getElementById("profile-badge").style.backgroundColor = meta.color;
    document.getElementById("profile-badge").textContent = `Perfil Dominante: ${dominantKey}`;
    document.getElementById("profile-title").textContent = meta.title;
    document.getElementById("profile-description").textContent = meta.desc;

    // Alimenta a seção de dinâmicas comportamentais
    document.getElementById("dyn-com").textContent = meta.com;
    document.getElementById("dyn-dec").textContent = meta.dec;
    document.getElementById("dyn-lid").textContent = meta.lid;
    document.getElementById("dyn-mot").textContent = meta.mot;

    // Renderização Inteligente do Gráfico de Barras
    const chartContainer = document.getElementById("bars-chart-container");
    chartContainer.innerHTML = ""; // Limpa estrutura anterior

    const labelsConfig = {
        D: { name: "D — Dominância", barColor: "bg-red-600" },
        I: { name: "I — Influência", barColor: "bg-amber-500" },
        S: { name: "S — Estabilidade", barColor: "bg-green-600" },
        C: { name: "C — Conformidade", barColor: "bg-blue-600" }
    };

    // Varre as chaves e monta o gráfico responsivo
    Object.entries(scores).forEach(([key, value]) => {
        const config = labelsConfig[key];
        // O teste possui 25 blocos, calculamos a porcentagem exata
        const percentage = Math.round((value / 25) * 100);

        const row = document.createElement("div");
        row.className = "space-y-1";
        row.innerHTML = `
            <div class="flex justify-between text-sm font-semibold">
                <span class="text-slate-700">${config.name}</span>
                <span class="text-slate-900 font-bold">${percentage}% <span class="text-xs font-normal text-slate-400">(${value}/25 pts)</span></span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-5 overflow-hidden border border-slate-200/60">
                <div class="${config.barColor} h-5 rounded-full transition-all duration-700 shadow-inner" style="width: ${percentage}%"></div>
            </div>
        `;
        chartContainer.appendChild(row);
    });
});