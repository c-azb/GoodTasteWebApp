<?php

function ConnectDB()
{
$servidor = "localhost";
$usuario = "root";
$senha = "";
$nomeDB = "RecipeDB";

$conn = new mysqli($servidor,$usuario,$senha,$nomeDB);

if($conn->connect_error) {
	echo "Erro na conecção";
}

return $conn;

}

if(array_key_exists('request',$_GET))
{
	if ($_GET['request'] == "0") //busca receita
	{		
		$searchInput = $_GET['searchTxt'];
  	      	echo SearchRecipe($searchInput);
	}
	else if($_GET['request'] == "1") //faz login
	{	
		$username = $_GET['username'];
		$psw = $_GET['psw'];
		echo Login($username,$psw);
	}
	else if($_GET['request'] == "2")
	{
		echo SearchRecentRecipes();
	}
}
else if(array_key_exists('request',$_POST))
{
	if($_POST['request'] == "0") //criar conta
	{	
		$un = $_POST['username'];
		$psw = $_POST['psw'];
		$confPsw = $_POST['confPsw'];
		$nick = $_POST['nick'];
		echo CreateAccount($un,$psw,$confPsw,$nick);
	}
	if($_POST['request'] == "1") //postar receita
	{
		$un = $_POST['un'];
		$psw = $_POST['psw'];
		$userID = $_POST['uid'];

		$title = $_POST['title'];
		$desc = $_POST['desc'];
		$method = $_POST['method'];
		$obs = $_POST['obs'];
		$ing = $_POST['ings'];

		echo InsertRecipe($un,$psw,$userID,$title,$desc,$method,$obs,$ing);
	}
}


function CreateAccount($un,$psw,$confPsw,$nick)
{
	if(ctype_space($un) || ctype_space($psw) || ctype_space($confPsw) || ctype_space($nick))
		return "Erro, entrada de texto vazia ou com espaços em branco.";

	if($psw != $confPsw) return "Erro, senha e confirmação não são iguais.";
	if(strlen($un) > 20 || strlen($un) < 5) return "Erro, usuário deve ter entre 5 e 20 caracteres.";
	if(strlen($psw) > 20 || strlen($psw) < 5) return "Erro, senha deve conter entre 5 e 20 caracteres.";
	if(strlen($nick) > 20 || strlen($nick) < 3) return "Erro, apelido deve conter entre 3 e 20 caracteres.";

	$conn = ConnectDB();
	
	$sql = "select u.userName from User_ u where u.userName = '{$un}';";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) return "Erro, nome do usuário deve ser único.";
	
	$sql = "insert into User_ (userName,psw,nickname) values ('{$un}','{$psw}','{$nick}');";
	
	if ($conn->query($sql) === TRUE) 
	{
		$last_id = $conn->insert_id;
		$conn->close();
  		return $last_id;
	}
	
	return "none";
	$conn->close();
}


function Login($username,$psw)
{
	$conn = ConnectDB();
	$sql = "select * from User_ u where u.userName = '{$username}' and u.psw = '{$psw}';";

	$result = $conn->query($sql);

	if ($result->num_rows > 0)
	{
		$row = $result->fetch_assoc();
		$accInfo = Array("id"=>$row["id"],"userName"=>$row["userName"],"psw"=>$row["psw"],"nick"=>$row["nickname"]);
		$conn->close();
		return json_encode($accInfo);
	}
	$conn->close();
	return "none";
}

function InsertRecipe($un,$psw,$userID,$title,$desc,$method,$obs,$ing)
{

	if(ctype_space($title) || ctype_space($desc) || ctype_space($method) || ctype_space($obs))
		return "Erro, entrada de texto vazia ou com espaços em branco.";

	foreach ($ing as &$val)
	{
		if(ctype_space($val)) 
			return "Erro, entrada de texto vazia ou com espaços em branco.";
		else if(strlen($val) > 100 || strlen($val) < 2) 
			return "Erro, ingrediente deve ter entre 2 e 100 caracteres.";
	}

	if(strlen($title) > 20 || strlen($title) < 5) 
		return "Erro, titulo deve ter entre 5 e 20 caracteres.";
	if(strlen($desc) > 100 || strlen($desc) < 5) 
		return "Erro, descrição deve conter entre 5 e 100 caracteres.";
	if(strlen($method) > 10000 || strlen($method) < 10) 
		return "Erro, modo de preparo deve conter entre 10 e 10000 caracteres.";
	if(strlen($obs) > 100 || strlen($obs) < 3) 
		return "Erro, observação deve conter entre 3 e 100 caracteres.";


	$conn = ConnectDB();

	if(CheckLogin($un,$psw,$userID,$conn) == 0){$conn->close(); return "Voce deve estar logado para postar uma receita.";}


	$sql = "insert into Recipe (userId,title,description,method,obs) 
	values ({$userID},'{$title}','{$desc}','{$method}','{$obs}');";
	
	if ($conn->query($sql) === TRUE) 
	{
		$last_id = $conn->insert_id;
		foreach ($ing as &$val)
		{
			$sql = "insert into Ingredient (recipeId,ingredient) 
			values ({$last_id},'{$val}');";
			if ($conn->query($sql) === FALSE) break; 
		}
		$conn->close();
		return "OK";
	}

	$conn->close();
	return "none";
}


function SearchRecipe($searchInfo)
{
    $conn = ConnectDB();

	$sql = "select r.*,u.nickname from Recipe r inner join User_ u on r.userId = u.id and
	r.title like '%${searchInfo}%';";

	$result = $conn->query($sql);

	if ($result->num_rows > 0)
	{
	    $resultArray = Array();

  		while($row = $result->fetch_assoc())
		{

    			array_push($resultArray,
			array(
			"nick"=>$row["nickname"],
			"Title"=>$row["title"],
			"Desc"=>$row["description"],
			"method"=>$row["method"],
			"obs"=>$row["obs"],
			"ing"=> SearchIng($row["id"],$conn)
			));
 		}

		$conn->close();
		return json_encode($resultArray);
	}

	$conn->close();
	return "none";
}

function SearchRecentRecipes()
{
	$conn = ConnectDB();

	$sql = "select r.*,u.nickname from Recipe r inner join User_ u on r.userId = u.id
	order by r.recipeDate DESC LIMIT 10;";

	$result = $conn->query($sql);

	if ($result->num_rows > 0)
	{
	    $resultArray = Array();

  		while($row = $result->fetch_assoc())
		{

    			array_push($resultArray,
			array(
			"nick"=>$row["nickname"],
			"Title"=>$row["title"],
			"Desc"=>$row["description"],
			"method"=>$row["method"],
			"obs"=>$row["obs"],
			"ing"=> SearchIng($row["id"],$conn)
			));
 		}

		$conn->close();
		return json_encode($resultArray);
	}

	$conn->close();
	return "none";
}



function SearchIng($recipeId,$conn)
{
	$sql =
	"select i.ingredient from Ingredient i inner join Recipe r on
	i.recipeId = r.id and r.id = {$recipeId};";

	$result = $conn->query($sql);

	if ($result->num_rows > 0)
	{
		$resultStr="";
		$cont = 1;

  		while($row = $result->fetch_assoc())
		{
			$resultStr .= $cont++."- ". $row["ingredient"]."\n";
	
 		}

		return $resultStr;
	}

	return "Nenhum ingrediente informado";
}

function CheckLogin($un,$psw,$userID,$conn)
{
	$sql = "select u.id from User_ u where u.userName = '{$un}' and u.psw = '{$psw}';";

	try
	{
		$result = $conn->query($sql);

		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$u_id = $row["id"];
			if($u_id == $userID) return 1;
		}

		return 0;
	}
	catch(Exception $e)
	{
		return 0;
	}
}


?>
