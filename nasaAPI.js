class nasaModel  {
    constructor(){
        this._descricao = "";
        this._img = "";
        this._data = "";
        

    }

    get descricao(){
        return this._descricao;
    }
    get img(){
        return this._img;
    }
    get data(){
        return this._data;
    }
    
    requestData(data){
        let request = new XMLHttpRequest;
        this._data = data;
        request.open("GET",`
        https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${this._data}`,false);

        request.addEventListener("load",() =>{
            if(request.status == 200){
                let response = JSON.parse(request.responseText);
    
                this._img = response.url;
                this._descricao = response.explanation;
               
            }
            else{
                console.log(`Algo deu errado :/ Erro:[${request.status}] ${request.statusText}`);
            }
        })        
        
        request.send();

    }
    

}

class nasaViews {
    constructor(model){
        
        this._data = document.createElement("p");
        this._descricao = document.createElement("p");
        this._img = document.createElement("img");
        
        this._img.src = model.img;
        this._data.innerText = model.data;
        this._data.setAttribute("id", "data");
        this._data.setAttribute("value", model.data);

        this._descricao.innerText = `Explicação: ${model.descricao}`;
        
    }
    
    criarElementos(){
        this._div = document.createElement("div");
        this._div.appendChild(this._data);
        this._div.appendChild(this._img);
        this._div.appendChild(this._descricao);

        this._div.setAttribute("id","divContainer");

        document.getElementById('main').appendChild(this._div);
        
    }

}

class nasaController {
    
    buscaImagem(data)
    {
        let model = new nasaModel;
        model.requestData(data);
        let views = new nasaViews(model);
        views.criarElementos();

    }
    
}











let date = document.getElementById("date"); // M
let buttonDiaEspecifico = document.getElementById("btnDiaEspecifico"); //M
let buttonDiaAnterior = document.getElementById("btnOntem"); //M
let buttonDiaPosterior = document.getElementById("btnAmanha"); //M

var temImagem = false;//C

let nasa = new nasaController;
//V--C
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



window.onload = nasa.buscaImagem(diaAtual);
buttonDiaEspecifico.addEventListener("click",function(){
    document.getElementById("divContainer").remove();
    nasa.buscaImagem(date.value);
     
});
buttonDiaPosterior.addEventListener("click",function(){
    let diaAtual = document.getElementById("data");
    diaAtual = diaAtual.textContent;
    let novoDia = diaAtual.split("-");
    novoDia[2] = parseInt(novoDia[2]) + 1;
    diaAtual = novoDia.join("-")
    console.log(diaAtual);
    document.getElementById("divContainer").remove();
    
     nasa.buscaImagem(diaAtual);
     
});
buttonDiaAnterior.addEventListener("click",function(){
    let diaAtual = document.getElementById("data");
    diaAtual = diaAtual.textContent;
    let novoDia = diaAtual.split("-");
    novoDia[2] = parseInt(novoDia[2]) - 1;
    diaAtual = novoDia.join("-")
    console.log(diaAtual);
    document.getElementById("divContainer").remove();
    
     nasa.buscaImagem(diaAtual);
     
});