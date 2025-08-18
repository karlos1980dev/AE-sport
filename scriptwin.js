let saldo = parseFloat(localStorage.getItem("saldo")) || 0;
let numerosSelecionados = [];
let numerosBloqueados = [];
let codigoUsado = JSON.parse(localStorage.getItem("codigoUsado")) || [];
const custoPorJogo = 2.00;
const valorAcerto = 200;
let ganhoTotal = 0;

// Array de códigos de recarga
const codigosRecarga = {
    50: ["716412153", "592315254", "846882055",
"14081980", "195668863","653096775","504350967","635551900", "286671413", "732888662"],
    
    40: ["217565914", "919970432", "284338877", "101696966", "702396411", "229654597", "874019900", "621211660", "336075928", "485986854",],
    
    30: ["739656664", "465396612", "189768711", "112988691", "966044327", "595658875", "109617523", "899800852", "755223288", "960909264",],
    
    20: ["446224299", "394127635", "812879695", "960907900", "491988844", "249227980", "956544658", "349657657", "840757998", "217686049",],
    
    10: ["691539989", "811999998", "108784815", "313505598", "806528891", "366228474", "716094153", "592329854", "846668855", "504376967",],
    
    9:["874016500", "621216610", "336090028", "485980154", "635598519", "286682713", "732880862", "195658863", "653677587", "129458884",],
    
    8:["956535448", "003496557", "840776998", "217612049", "739668764", "466345912", "189763211", "112967891", "904432227", "595665575",],
    
    
    7:[ "673207856", "209122885", "487021874", "337834017", "596597699", "387881987", "978833854", "699939985", "767384775", "560098454",],
    
    
    6:[

"673275056", "209651885", "487029814", "337808817", "596587999", "367871987", "309878265", "317746673", "507846877", "999297604",],
    
    5: [
"986476585", "443438755", "978638854", "699975985", "767388775", "005600454", "647728865", "878863674", "441365795", "965878854"],
    
    4:[
"109613223", "899876852", "755228448", "960976264", "216594314", "919098432", "284337447", "101697666", "702397611", "229654597",],

    3:[
"309821965", "317663273", "507683477", "929766404", "446224552", "394128835", "887963495", "960901270", "491987744", "249212270"],
    
    2:[
"647720985", "878867472", "441379895", "987877854", "691997689", "811977998", "108488515", "313503398", "806521291", "366222274"],
     1:["teste1336262","teste00001122","teste0062525","teste97288862999","teste62527882","teste4425252516"
  ]
};

// Atualiza saldo e botão verificar
function atualizarSaldo(){
    document.getElementById("saldo").innerText = `Saldo: R$ ${saldo.toFixed(2).replace('.',',')}`;
    document.getElementById("verificar").disabled = saldo < custoPorJogo || numerosSelecionados.length!==15;
    localStorage.setItem("saldo", saldo.toFixed(2));
    localStorage.setItem("codigoUsado", JSON.stringify(codigoUsado));
}

// Criar botões dos números
function criarBotoes(){
    const container = document.getElementById("numeros");
    container.innerHTML = '';
    for(let i=1;i<=50;i++){
        let btn = document.createElement("button");
        btn.classList.add("btn");
        btn.innerText = i;
        btn.id = `num${i}`;
        btn.onclick = () => selecionarNumero(i);
        btn.disabled = saldo < custoPorJogo;
        if(numerosBloqueados.includes(i) && !numerosSelecionados.includes(i)) btn.classList.add("blocked");
        if(numerosSelecionados.includes(i)) btn.classList.add("selected");
        if(numerosSelecionados.includes(i) && numerosBloqueados.includes(i)) btn.classList.add("acertou");
        container.appendChild(btn);
    }
}

// Seleciona ou desmarca números
function selecionarNumero(num){
    if(numerosSelecionados.includes(num)){
        // Se já estava marcado, desmarca
        numerosSelecionados = numerosSelecionados.filter(n => n!==num);
        document.getElementById(`num${num}`).classList.remove("selected","limite");
    } else if(numerosSelecionados.length<15){
        numerosSelecionados.push(num);
        document.getElementById(`num${num}`).classList.add("selected");
    }
    
    document.getElementById("contadorNumeros").innerText = 
        `Números selecionados: ${numerosSelecionados.length}/15`;

    // Remove azul de todos
    numerosSelecionados.forEach(n=>{
        document.getElementById(`num${n}`).classList.remove("limite");
    });

    // Se já tem 15, o último marcado fica azul
    if(numerosSelecionados.length === 15){
        let ultimo = numerosSelecionados[numerosSelecionados.length - 1];
        document.getElementById(`num${ultimo}`).classList.add("limite");
    }

    atualizarSaldo();
}

// Usar código de recarga
document.getElementById("usarCodigo").addEventListener("click", ()=>{
    const codigo = document.getElementById("codigoRecarga").value.trim();
    let codigoValido = false;

    for(const valor in codigosRecarga){
        if(codigosRecarga[valor].includes(codigo)){
            if(!codigoUsado.includes(codigo)){
                saldo += parseFloat(valor);
                codigoUsado.push(codigo);
                alert(`Código válido! Saldo adicionado: R$ ${valor}`);
                document.getElementById("codigoRecarga").value="";
                criarBotoes();
                atualizarSaldo();
                codigoValido = true;
                break;
            } else {
                alert("Este código já foi usado.");
                codigoValido = true;
                break;
            }
        }
    }

    if(!codigoValido){
        alert("Código inválido.");
    }
});

// Função verificar jogada
function verificar(){
    if(saldo < custoPorJogo || numerosSelecionados.length !== 15){
        alert("Saldo insuficiente ou selecione 15 números!");
        return;
    }
    saldo -= custoPorJogo;
    atualizarSaldo();

    // Gerar números bloqueados
    numerosBloqueados = [];
    while(numerosBloqueados.length < 5){
        let num = Math.floor(Math.random()*50)+1;
        if(!numerosBloqueados.includes(num)) numerosBloqueados.push(num);
    }

    // Limpar classes antigas
    for(let i=1;i<=50;i++){
        const btn = document.getElementById(`num${i}`);
        btn.classList.remove("blocked","acertou","selected");
    }

    // Marcar acertos e erros
    numerosBloqueados.forEach(n=>{
        const btn = document.getElementById(`num${n}`);
        if(btn){
            if(numerosSelecionados.includes(n)){
                btn.classList.add("acertou"); // verde
            } else {
                btn.classList.add("blocked"); // vermelho
            }
        }
    });

    let acertos = numerosSelecionados.filter(n => numerosBloqueados.includes(n)).length;
    ganhoTotal = acertos * valorAcerto;

    // Atualizar mensagem e botão Ganho Total
    if(acertos===5){
        document.getElementById("mensagem").innerText = "Parabéns, você ganhou!";
        document.getElementById("enviar").style.display = "block";
        const btnGanho = document.getElementById("ganhoTotal");
        btnGanho.classList.add("habilitado");
        btnGanho.innerText = `Ganho Total: R$${ganhoTotal}`;
    } else {
        document.getElementById("mensagem").innerText = `Tente novamente. Acertos: ${acertos}`;
        document.getElementById("enviar").style.display = "none";
        const btnGanho = document.getElementById("ganhoTotal");
        btnGanho.classList.remove("habilitado");
        btnGanho.innerText = `Ganho Total: R$0,00`;
    }

    // Limpar automaticamente após 30 segundos
    setTimeout(()=>{
        numerosSelecionados = [];
        numerosBloqueados = [];
        criarBotoes();
        document.getElementById("contadorNumeros").innerText = `Números selecionados: 0/15`;
        document.getElementById("mensagem").innerText = "";
        document.getElementById("enviar").style.display = "none";
        document.getElementById("ganhoTotal").classList.remove("habilitado");
        document.getElementById("ganhoTotal").innerText = `Ganho Total: R$0,00`;
    }, 20000);
}

// Modal Ganho Total
const modal = document.getElementById("modal");
document.getElementById("ganhoTotal").addEventListener("click", ()=>{
    if(ganhoTotal === 5*valorAcerto){
        document.getElementById("valorGanhoModal").innerText = `Valor disponível: R$${ganhoTotal}`;
        modal.style.display = "flex";
    } else {
        alert("Você precisa acertar os 5 números para sacar.");
    }
});

document.getElementById("enviarWhats").addEventListener("click", ()=>{
    const nome = document.getElementById("nomePix").value.trim();
    const pix = document.getElementById("chavePix").value.trim();
    if(nome === "" || pix === ""){
        alert("Preencha todos os campos.");
        return;
    }
    const mensagem = `PIX: ${pix}\nNome: ${nome}\nValor Ganho: R$${ganhoTotal}`;
    const url = "https://api.whatsapp.com/send?phone=5571992290058&text="+encodeURIComponent(mensagem);
    window.open(url,"_blank");
    modal.style.display = "none";
    ganhoTotal = 0;
    document.getElementById("ganhoTotal").innerText = `Ganho Total: R$0,00`;
    document.getElementById("ganhoTotal").classList.remove("habilitado");
});

// Envio WhatsApp do resultado normal
function enviarViaWhatsApp(){
    let numeroBloqueadosTexto = `Números Bloqueados: ${numerosBloqueados.join(", ")}`;
    let numerosSelecionadosTexto = `Números Selecionados: ${numerosSelecionados.join(", ")}`;
    let dataAtual = new Date();
    let mensagem = `PIX: 71992290058\n${numeroBloqueadosTexto}\n${numerosSelecionadosTexto}\nData: ${dataAtual.toLocaleDateString()}\nHora: ${dataAtual.toLocaleTimeString()}`;
    let url = "https://api.whatsapp.com/send?phone=5571992290058&text="+encodeURIComponent(mensagem);
    window.open(url,"_blank");

    numerosSelecionados = [];
    numerosBloqueados = [];
    criarBotoes();
    document.getElementById("contadorNumeros").innerText = `Números selecionados: 0/15`;
    document.getElementById("mensagem").innerText = "";
    document.getElementById("enviar").style.display = "none";
}

// Eventos
document.getElementById("verificar").addEventListener("click", verificar);
document.getElementById("enviar").addEventListener("click", enviarViaWhatsApp);

// Inicializar
criarBotoes();
atualizarSaldo();
