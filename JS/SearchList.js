(function (){

if(document.getElementById("searchBtn") != null)
	document.getElementById("searchBtn").onclick = OnClickSearch;
else
	FillWithRecentRecipes();

})();

function FillWithRecentRecipes()
{
	$.ajax({
            url:'PHP/DBConn.php',    
            type: 'get',    
            data: {request:"2"},
            success:function(result){
		if(result == 'none') 
			window.alert("Nenhum resultado encontrado.");
		else
		{
			let recepies = JSON.parse(result);
			AddItems(recepies);
		}
            }
        });
}

function OnClickSearch ()
{
    let inputValue = document.getElementById("searchInput").value;
    if (!inputValue) { window.alert("Digite algum texto para buscar uma receita!!"); return; }
	
    SearchData(inputValue);
}

function SearchData(searchTxt)
{
        $.ajax({
            url:'PHP/DBConn.php',    
            type: 'get',    
            data: {request:"0", searchTxt: searchTxt},
            success:function(result){
		if(result == 'none') 
			window.alert("Nenhum resultado encontrado.");
		else
		{
			let recepies = JSON.parse(result);
			AddItems(recepies);
		}
            }
        });
}

function AddItems(recepies)
{
    ClearList();
    for (let i = 0; i < recepies.length; i++)
        AddListElement(recepies[i],i);
}

function AddListElement(receita,index)
{
    const item = document.createElement('div');
    item.className = 'searchItem'; 

    item.innerHTML = `
    <a class="tituloItmList" id = "i${index}" >${receita['Title']}</a>
    <p class="autorItmList">${receita['nick']}</p>
    <p class="descItmList">${receita['Desc']}</p>
    `;
    
    document.getElementById('RecipeList').appendChild(item);
    document.getElementById('i'+index).onclick = function(){ OnClickElement(receita);}
}

function OnClickElement(receita)
{
	sessionStorage.setItem('titulo', receita['Title']); //localStorage.setItem('label', 'value')
	sessionStorage.setItem('autor', receita['nick']);
	sessionStorage.setItem('desc', receita['Desc']);
	sessionStorage.setItem('modoPreparo', receita['method']);
	sessionStorage.setItem('ingredientes', receita['ing']);
	sessionStorage.setItem('obs', receita['obs']);
	
	window.open('Recipe.html', '_blank').focus();
}

function ClearList()
{
    document.getElementById('RecipeList').innerHTML = ``;
}


/********************/
/***Test functions***/
/********************/
/*
class Receita
{
    constructor(autor, descricao, titulo, modoPreparo, ingredientes,obs) {
        this.autor = autor;
        this.descricao = descricao;
        this.titulo = titulo;
        this.modoPreparo = modoPreparo;
        this.ingredientes = ingredientes;
	this.obs = obs;
    }
}

function AddItems(receitas)
{
    ClearList();
    for (let i = 0; i < receitas.length; i++)
        AddListElement(receitas[i],i);
}

function AddListElement(receita,index)
{
    const item = document.createElement('div');
    item.className = 'searchItem'; 

    item.innerHTML = `
    <a class="tituloItmList" id = "i${index}" >${receita.titulo}</a>
    <p class="autorItmList">${receita.autor}</p>
    <p class="descItmList">${receita.descricao}</p>
    `;
    
    document.getElementById('RecipeList').appendChild(item);
    document.getElementById('i'+index).onclick = function(){ OnClickElement(receita);}
}

function OnClickElement(receita)
{
	sessionStorage.setItem('titulo', receita.titulo); //localStorage.setItem('label', 'value')
	sessionStorage.setItem('autor', receita.autor);
	sessionStorage.setItem('desc', receita.descricao);
	sessionStorage.setItem('modoPreparo', receita.modoPreparo);
	sessionStorage.setItem('ingredientes', receita.ingredientes);
	sessionStorage.setItem('obs', receita.obs);
	
	window.open('Recipe.html', '_blank').focus();
	
}

function CreateRandomData(searchTxt)
{
    let searchCount = Math.random() * 10;
    let receitas_ = [];
    for (let i = 0; i < searchCount; i++) {
        let autor = 'Nome Autor' + (i + 1);
        let titulo = 'Titulo' + (i + 1) + ": " + searchTxt;
        let desc = 'Descricao aleatoria, texto aleatorio texto aleatorio texto aleatorio texto aleatorio texto aleatorio texto aleatorio texto aleatorio texto aleatorio';
        let methodPrep = 'Modo de preparo aleatorio ' + (i+1);
	let ingredients = CreateRandIngr();
	let obs = 'Observacao aleatoria ' + (i+1);
	receitas_.push(new Receita(autor, desc, titulo, methodPrep, ingredients,obs));
    }
    return receitas_;
}

function CreateRandIngr()
{
	let lCount = Math.random() * 10 + 1;
	let randomData = '';
	for(let i =0;i<lCount;i++)
	{
		randomData += (i+1) + ': Ingrediente aleatorio ' + (i+1) + '\n';
	}
	return randomData;
}

*/
