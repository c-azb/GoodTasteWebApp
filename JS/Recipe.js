

(function ()
{	
	document.getElementById("RecipeTitle").innerText = sessionStorage.getItem('titulo');
	document.getElementById("RecipeAutor").innerText = sessionStorage.getItem('autor');
	document.getElementById("RecipeIngredients").innerText = sessionStorage.getItem('ingredientes');
	document.getElementById("RecipeMethod").innerText = sessionStorage.getItem('modoPreparo');
	document.getElementById("RecipeObs").innerText = sessionStorage.getItem('obs');
})();

