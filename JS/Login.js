
(function (){
let isLogin = localStorage.getItem('login');

if(!isLogin || isLogin == 0)
	ShowLoginUI();
else
	HideLoginUI(localStorage.getItem('un'));
})();

document.getElementById('Sair').onclick = function ()
{
	/****Process logout****/

	localStorage.setItem('login', 0);

	localStorage.removeItem('psw');
	localStorage.removeItem('un');
	localStorage.removeItem('id');
	localStorage.removeItem('nick');

	ShowLoginUI();
}


document.getElementById("LoginBtn").onclick = function ()
{
	let user = document.getElementById("UserInput").value;
	let psw = document.getElementById("PswInput").value;
	
	$.ajax({
            url:'PHP/DBConn.php',    
            type: 'get',    
            data: {request:"1", username: user, psw: psw},
            success:function(result){
		if(result == 'none') 
			window.alert("Falha no login");
		else
		{
			let user = JSON.parse(result);

			localStorage.setItem('login', 1);

			localStorage.setItem('psw', user["psw"]);
			localStorage.setItem('un', user["userName"]);
			localStorage.setItem('id',user["id"]);
			localStorage.setItem('nick',user["nick"]);

			HideLoginUI(user["userName"]);
		}

		document.getElementById("UserInput").value = document.getElementById("PswInput").value = '';
            }
        });
}

function ShowLoginUI()
{
	let login = document.getElementById('Login');
	login.style.display = 'block';

	var sair = document.getElementById('Sair');
	sair.style.display = 'none';
	var un = document.getElementById('UsernameTxt');
	un.style.display = 'none';
}

function HideLoginUI(username)
{
	let login = document.getElementById('Login');
	login.style.display = 'none';
	
	let un = document.getElementById('UsernameTxt');
	un.style.display = 'block';

	let sair = document.getElementById('Sair');
	sair.style.display = 'block';

	document.getElementById('UsernameTxt').innerText = username;
}
