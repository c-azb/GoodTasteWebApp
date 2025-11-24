

(function (){CheckLogin();})();

function CheckLogin()
{
	let isLogin = localStorage.getItem('login');
	if(!isLogin || isLogin == 0)
	{
		window.alert("Atencao! Voce deve fazer login para postar uma receita.");
		return 0;
	}
	return 1;
}


let idCount = 1;

document.getElementById("AddIngBtn").onclick = function()
{
    let input = document.createElement("input"); 
    input.setAttribute("type", "text");
    input.setAttribute("name", "ing");
    input.setAttribute("id", "ing"+ ++idCount);
    input.setAttribute("placeholder", "Ingrediente");

    document.getElementById("ingsBlock").appendChild(input);
}

document.getElementById("RemoveIngBtn").onclick = function()
{
	if(idCount == 1){window.alert("Um ingrediente no minimo e necessario"); return;}
	document.getElementById("ing" + (idCount--)).remove();	
}

document.getElementById("PostRecipeBtn").onclick = function()
{
	if(CheckLogin() == 0) return;

	let title = document.getElementById("titRec").value;
	let desc = document.getElementById("descRec").value;
	let method = document.getElementById("methodRec").value;
	let obs = document.getElementById("obsRec").value;
	let ings = [];

	for(let i=0;i<idCount;i++)
		ings.push(document.getElementById("ing" + (i+1)).value);
	
	let uid = localStorage.getItem('id');
	let psw = localStorage.getItem('psw');
	let un = localStorage.getItem('un');
	
	$.ajax({
            url:'PHP/DBConn.php',    
            type: 'post',    
            data: {request:"1",uid:uid,psw:psw,un:un,title:title,desc:desc,method:method,obs:obs,ings:ings},
            success:function(result){
		if(result != 'OK') 
			window.alert(result);
		else
		{
			window.alert("Receita postada com sucesso.");
			window.open('Index.html',"_self").focus();
		}
            }
        });
}


