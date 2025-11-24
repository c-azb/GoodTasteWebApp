
//body{background-image: url("../Images/img.jpg");}


let photo = Math.floor(Math.random() * (4));
document.body.style.backgroundImage = "url('Images/BGImgs/img" + photo + ".jpg')";
document.body.style.backgroundSize = "contain"; //cover,contain


