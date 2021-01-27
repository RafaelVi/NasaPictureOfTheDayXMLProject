
class nasaModel  {
    constructor(){
        this._descricao = "";
        this._img = "";
        this._data = "";
        
        //cria meus dados porém atribui valores vazios, visto que serão pegos da api na função requestData
    }

    get descricao(){
        return this._descricao;//sem o get não é possivel pegar os dados fora do meu objeto
    }
    get img(){
        return this._img;
    }
    get data(){
        return this._data;
    }
    
    requestData(data){
        //Crio o request
        let request = new XMLHttpRequest;
        this._data = data;//repare que eu pego a data como parametro pois ela é necessaria para minha query string ali
        request.open("GET",`
        https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${this._data}`,false);

        request.addEventListener("load",() =>{
            if(request.status == 200){//status 200 significa que o pedido foi respondido e o objeto retornado ent posso pegar a imagem e a descrição
                let response = JSON.parse(request.responseText);
    
                this._img = response.url;
                this._descricao = response.explanation;
               
            }
            else{//caso não vá, ele mostra o erro
                console.log(`Algo deu errado :/ Erro:[${request.status}] ${request.statusText}`);
            }
        })        
        
        request.send();

    }
    

}

class nasaViews {
    constructor(model){//Recebo meu model com os dados 
        //Crio todos os meus elementos
        this._data = document.createElement("p");
        this._descricao = document.createElement("p");
        if(model.img.match(/\.(jpg|gif|png)$/)!= null){//verifica se o link é uma imagem
            this._img = document.createElement("img");
        }
        else{
            this._img = document.createElement("iframe");
        }
        //Atribuo os dados do model aos meus elementos
        this._img.src = model.img;
        this._data.innerText = model.data;
        this._descricao.innerText = `Explicação: ${model.descricao}`;
        // Atribuo um id pra data pra poder pegar depois
        this._data.setAttribute("id", "data");

        
        
    }
    
    criarElementos(){
        //Crio uma div e coloco todos os meus elementos nela
        this._div = document.createElement("div");
        this._div.appendChild(this._data);
        this._div.appendChild(this._img);
        this._div.appendChild(this._descricao);
        //Atribuo um id para a div
        this._div.setAttribute("id","divContainer");
        //Jogo minha div no main para fica entre o header e footer
        document.getElementById('main').appendChild(this._div);
        
    }

}

class nasaController {
    
    buscaImagem(data)
    {
        let model = new nasaModel;//Cria meu model com atributos vazios
        model.requestData(data);//Incrementa os atributos
        let views = new nasaViews(model);//Armazena os atributos nos elementos
        views.criarElementos();//Joga os elementos na tela

    }
    verificaData(input,data,operador)
    {   
        
        //Pego a data e adiciono a hora como meia noite para que não interfira
        let auxDate = new Date(data+"T00:00:00");

        
        

            //Verifico se vai ir pra dia anterior ou posterior
            if(operador == "+"){
                if(auxDate.getTime() == new Date("Jun 16 1995").getTime()){
                    //Correção de bug: os dias 17,18 e 19 não possuem dados
                    //Pulo 4 dias: do dia 16 para o 20
                    auxDate.setDate(auxDate.getDate() + 4);
                }
                else{
                    auxDate.setDate(auxDate.getDate() + 1);//Se for posterior acrescenta um dia
                    if(auxDate > Date.now()){
                        alert("Você não pode buscar imagens de dias futuros");
                        auxDate = new Date(data+"T00:00:00");
                        
                    }
                }
            }
            else if(operador == "-"){
                
                if(auxDate.getTime() == new Date("Jun 20 1995").getTime()){
                    //Correção de bug: os dias 17,18 e 19 não possuem dados
                    //Pulo 4 dias: do dia 20 para o 16
                    auxDate.setDate(auxDate.getDate() - 4);
                }
                else{
                    auxDate.setDate(auxDate.getDate() - 1);//Se for anterior tira um dia

                    if(auxDate < new Date("Jun 16 1995")){//Se for menor que a data minima volta para a data minima
                        alert("A data minima é 16/06/1995");
                        auxDate.setDate(auxDate.getDate() + 1);
                    }
                }    
                
            }
            else{
                auxDate = new Date(input.value + "T00:00:00");
                if(input.validity.badInput)//verifico se a data inserida é invalida
                {
                    alert(input.validationMessage);//se for disparo uma mensagem de erro e retorno para a 
                    auxDate =  new Date(data+"T00:00:00");   
                }
                else{
                    if(auxDate > Date.now()){
                        //Se for maior que o dia atual (now()) volta para o dia atual
                        alert("Você  não pode buscar imagens de dias futuros");
                        auxDate = new Date(data+"T00:00:00");
                    }
                    if(auxDate < new Date("Jun 16 1995")){
                        //Se for menor que a data minima volta para o dial atual
                        alert("A data minima é 16/06/1995");
                        auxDate = new Date(data+"T00:00:00");
                    }
                    if(auxDate.getTime() == new Date("Jun 17 1995").getTime() || auxDate.getTime() == new Date("Jun 18 1995").getTime() || auxDate.getTime() == new Date("Jun 19 1995").getTime()){
                        //Se for os dias 17,18 e 19 de junho de 1995. Avisa que não é possivel ver este dia e volta para o dia atual
                        alert("Parabéns, você chegou no limbo! essa data não esta nosso banco de dados");
                        auxDate = new Date();
                    }
                }
                
            }
        //Pego essa nova data e converto para YYYY-MM-DD
        let ArrayData = auxDate.toISOString();
        // A string vai ficar mais ou menos assim: "2002-03-14T00:00:00"
        let auxDate2 = ArrayData.split("T");
        //Eu só quero a data, ent divido essa string em duas partes: "2002-03-14" e "00:00:00" usando o split pra dividir pelo T
        return auxDate2[0];
    }
    
    
}
// Pega meus inputs: data e os 3 botões
let date = document.getElementById("date"); // M
let buttonDiaEspecifico = document.getElementById("btnDiaEspecifico"); //M
let buttonDiaAnterior = document.getElementById("btnOntem"); //M
let buttonDiaPosterior = document.getElementById("btnAmanha"); //M
// Cria meu objeto nasa, que por sua conta cria um modelo e joga esse modelo no views
let nasa = new nasaController;
// Pega o dia atual e coloca no formato YYYY-MM-DD (ano-mês-dia)
var diaAtual = new Date();
var dd = diaAtual.getDate();
var mm = diaAtual.getMonth()+1; 
var yyyy = diaAtual.getFullYear();
if(dd<10) 
{
    dd='0'+dd;
} 

if(mm<10) 
{
    mm='0'+mm;
} 
diaAtual = yyyy+'-'+mm+'-'+dd;


// Quando a página carrega ele busca a imagem do dia atual
window.onload = nasa.buscaImagem(diaAtual);
// Adicionando o evento de buscar um dia específico, também remove o dia que estava sendo mostrado
buttonDiaEspecifico.addEventListener("click",function(){
    let diaAtual = document.getElementById("data");//pega o paragrafo do meu dia atual
    diaAtual = diaAtual.textContent;
    document.getElementById("divContainer").remove();
    let data = nasa.verificaData(date,diaAtual,"");
    date.value = "";//limpa meu input data
    nasa.buscaImagem(data);//adiciona o dia especifico na tela
     
});
// Busca o dia posterior e remove o dia atual
buttonDiaPosterior.addEventListener("click",function(){
    let diaAtual = document.getElementById("data");//pega o paragrafo do meu dia atual
    diaAtual = diaAtual.textContent;//pega o texto desse paragrafo
    let novoDia = nasa.verificaData(date,diaAtual,"+");//verifico o dia e retorno o dia posterior
    document.getElementById("divContainer").remove();//removo o dia anterior
    
    nasa.buscaImagem(novoDia);//adiciono o proximo dia;
     
});
// Busca o dia anterior e remove o dia atual
buttonDiaAnterior.addEventListener("click",function(){
    let diaAtual = document.getElementById("data");
    diaAtual = diaAtual.textContent;
    let novoDia = nasa.verificaData(date,diaAtual,"-");//verifico o dia e retorno o dia anterior
    document.getElementById("divContainer").remove();
    nasa.buscaImagem(novoDia);
     
});
console.log(`Datas para testar: 4/01/2019 - gif
            24/04/2020 - video
            29/02/2020 - ano bissexto`);