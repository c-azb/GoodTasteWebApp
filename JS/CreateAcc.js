


document.getElementById("CreateAccBtn").onclick = function ()
{
	let user = document.getElementById("User_").value;
	let nick = document.getElementById("Nick_").value;
	let psw = document.getElementById("Psw_").value;
	let confPsw = document.getElementById("Conf_Psw_").value;
	
	$.ajax({
            url:'PHP/DBConn.php',    
            type: 'post',    
            data: {request:"0", username: user, psw: psw, confPsw: confPsw, nick: nick},
            success:function(result)
	    {
		if(result == 'none') 
			window.alert("Não foi possível criar a sua conta... Tente novamente.");
		else if(result.substring(0,4) == "Erro")
			window.alert(result);
		else
		{
			window.alert("Conta criada com sucesso!");

			localStorage.setItem('login', 1);

			localStorage.setItem('psw', psw);
			localStorage.setItem('un', user);
			localStorage.setItem('id', result);
			localStorage.setItem('nick', nick);

			window.open('Index.html',"_self").focus();
		}
            }
        });
}




