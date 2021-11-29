var num_stars = 1;
var product = {};

//Mostrar imágenes del producto en un carrusel.
function showImagesGallery(array) {
  let htmlContentToAppend = "";

  for (let i = 0; i < array.length; i++) {
    if (i == 0) {
      htmlContentToAppend += ` 
          <div class="carousel-item active">
              <img class="d-block w-100" src="` + array[i] + `" > 
          </div> 
          `
    } else {
      htmlContentToAppend += `
          <div class="carousel-item">
              <img class="d-block w-100" src="` + array[i] + `">
          </div>
          `
    }
  }
  document.getElementById("theCarousel").innerHTML = htmlContentToAppend;
}

//Muestra los productos relacionados
function related_products(similarProduct) {

  getJSONData(PRODUCTS_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      let htmlContentToAppend = "";
      for (let i = 0; i < similarProduct.length; i++) {
        let product = resultObj.data[similarProduct[i]];
        htmlContentToAppend += ` 
          <a href = "product-info.html?product=` + product.name + `" class="list-group-item-action col-6">
          </br>
          </br>
          <h4><b> ` + product.name + ` </b></h4>
          <p><b> ` + product.currency + ` ` + product.cost + ` </b></p>
          <img  src=" ` + product.imgSrc + `" class="img-fluid img-thumbnail">
          </a>
      `
      }

      document.getElementById('related_products').innerHTML = htmlContentToAppend;
    };

  });
}
  
  //------ COMENTARIOS (DEL USUARIO Y PRECARGADOS)------
  // Mostar el nombre del usuario actual en el formulario de nuevo comentario.
  var userComment = localStorage.getItem("nombre_usuario");
  document.getElementById("userCom").innerHTML = userComment;
  
  
  // Mostar el 'div' que contiene las 5 estrellas para la calificación, en el formulario.
  function stars_score(num_stars) {
    stars = "";
    for (let n = 0; n < 5; n++) {
      if (n < num_stars) {
        stars += `<span class="fa fa-star float-right"></span>`
      } else {
        stars += `<span class="fa fa-star checked float-right"></span>`
      }
      document.getElementById("stars_rating").innerHTML = stars;
    }
  }
  
  
  // Agregar estrellas a la calificación en el formulario.
  function add_star() {
    if (num_stars < 5) {
      num_stars++;
    }
  }
  
  // Restar estrellas a la calificación en el formulario.
  function take_star() {
    if (num_stars > 1) {
      num_stars--;
    }
  }
  
  // Mostrar las estrellas que se agregó o restó a la calificación del comentario actual.
  function show_rating(num) {
    let rating = "";
  
    for (let x = 5; x > 0; x--) {
  
      if (x > num) {
        rating += `<span class="fa fa-star float-right"></span>`
      } else {
        rating += `<span class="fa fa-star checked float-right"></span>`
      }
      document.getElementById("stars_rating").innerHTML = rating;
  
    }
  }
  
  
  // Añadir comentario en la pantalla actual.
  function addComment(event) {
    event.preventDefault();
    let opinion = document.getElementById("opinion").value;
  
  
    let comment = "";
    var today = new Date();
    var todayDate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    comment = `
            <img src="img/usuario_predeterminado.png" alt="Usuario" style="float: left; padding: 10px; width: 90px;">
            <h4><b>Su comentario:</b></h4>
            <p><b>Usuario: ` + userComment + `</b></p>
            <p><b>Comentario:</b> ` + opinion + `</p>
            <p><b>Calificación:</b> `
    for (let y = 0; y < 5; y++) {
  
      if (y < num_stars) {
        comment += `<span class="fa fa-star checked"></span>`
      } else {
        comment += `<span class="fa fa-star"></span>`
      }
    }
    comment +=
      `</p>
            <p><b>Fecha:</b> ` + todayDate + `</p>
            <hr>
          `
    document.getElementById("users").innerHTML += comment;
  }


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      product = resultObj.data;

      let productName = document.getElementById("productName");
      let productDescription = document.getElementById("productDescription");
      let productCost = document.getElementById("productCost");
      let productCurrency = document.getElementById("productCurrency");
      let productCategory = document.getElementById("productCategory");

      let paramsURL = new URLSearchParams(location.search);
      let currentProduct = paramsURL.get('product');

      productName.innerHTML = currentProduct;
      productDescription.innerHTML = product.description;
      productCost.innerHTML = product.cost;
      productCurrency.innerHTML = product.currency;
      productCategory.innerHTML = product.category;

      showImagesGallery(product.images);
      related_products(resultObj.data.relatedProducts);
    }

  });

  //Mostrar los comentarios que están en el JSON
  getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      product = resultObj.data;
      let htmlContentToAppend = "";

      for (let i = 0; i < product.length; i++) {
        let comment = product[i];

        htmlContentToAppend += `
                 
              <img src="img/usuario_predeterminado.png" alt="Usuario" style="float: left; padding: 10px; width: 90px;">
              <p><b>Usuario: ` + comment.user + `:</b></p>
              <p><b>Comentario:</b> ` + comment.description + `</p>
              <p><b>Calificación:</b> ` + comment.score + `  <i class="fas fa-star"></i></p>
              <p><b>Fecha:</b> ` + comment.dateTime + `</p>
             <hr>
            `

        stars_score();
        document.getElementById("users").innerHTML = htmlContentToAppend;

      }
    }
  });


});