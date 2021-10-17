var  cart = [];

// Mostar el carrito con dos artíclos pre-cargados.
function showCart(array) {

         let htmlContentToAppend = "";
            for (let i = 0; i < array.length; i++) {
                let article = array[i];
                
                htmlContentToAppend += `
                    <div id="productBox" class="container">
                    <div class="row">
                    <div class = "col-sm">
                    <img  id="imgProd" src=" ` + article.src + `" class="img-fluid img-thumbnail" width="200">
                    <p><b>Nombre:</b> ` + article.name + `</p>
                    <p><b>Cantidad: </b><input type="number" value="`+ article.count +`" class="productCount"></p>
                    <p><b>Precio unitario:</b> ` + article.unitCost + `</p>
                    <p><b>Moneda:</b> ` + article.currency + `</p>
                    <p><b> Subtotal: </b><span class="subTotal"></span></p>
                    <hr>
                    </div>
                    </div>
                    </div>
                    
                    `

            }
            document.getElementById("cartField").innerHTML = htmlContentToAppend;
    subtotalCost();
    
}

// Obtener el subtotal de los artículos que están en el carrito.
function subtotalCost() {
    
    let finalTotal = 0;
    let almostTotal = 0;
    let sub = document.getElementsByClassName("subTotal"); // Especifico donde voy a colocar el resultado del subtotal
    let count = document.getElementsByClassName("productCount");// Especifico de dónde voy a obtener el dato de la cantidad de productos
    let send = document.getElementById("sendProduct").value;
    
    for (let i = 0; i < cart.length; i++) {
        let result; // Resultado del subtotal
        let result2; // Resultado del total final 
        
        let cost = cart[i].unitCost;// Variable que contiene el costo unitario de los productos.
        cart[i].count = count[i].value;// Variable que contiene el value del input de la cantidad de productos.
        
        // Si la moneda del costo del producto es en USD, se pasa a pesos, multiplicandolo por 40, sino solo se hace precio por cantidad.
        if (cart[i].currency == 'USD') {
            result = cost * cart[i].count * 40;
        } else {
            result = cost * cart[i].count;
        }
        
        sub[i].innerHTML = result + " UYU"; // Agrega el subtotal al html
        almostTotal += result; 

        // Calcula el precio de envío según el porcentaje seleccionado.
        if (send == 1) {
            result2 = result + (result * 0.05); // Satndard
        } else if (send == 2) {
            result2 = result + (result * 0.07); // Express
        } else if (send == 3) {
            result2 = result + (result * 0.15); // Premium
        } else {
            result2 = result;
        }

        finalTotal += result2;
    
        
    }
    document.getElementById("casiTotal").innerHTML = almostTotal;// Agrega el total al html.
    document.getElementById("finalTotal").innerHTML = finalTotal;
    
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CART_INFO_URL_2).then(function (resultObj) {
        if (resultObj.status === "ok") {
            cart = resultObj.data.articles;


            showCart(cart);
        }
        
        let prodCount = document.getElementsByClassName("productCount");

        // Cada vez que agrego un número en la cantidad de productos(input) me realiza la función de subtotal.
        for (let i = 0; i < prodCount.length; i++) {
            prodCount[i].addEventListener("input", function () {
                subtotalCost();
                
            });
        
        }

        document.getElementById("cardPayment").addEventListener("click", function () {
            document.getElementById("accountNum").removeAttribute("required");
            document.getElementById("cardExpDate").setAttribute("required", "");
            document.getElementById("cardCVV").setAttribute("required", "");
            document.getElementById("cardNum").setAttribute("required", "");
           
            
        });
        
        document.getElementById("transferPayment").addEventListener("click", function () {
            document.getElementById("cardExpDate").removeAttribute("required");
            document.getElementById("cardCVV").removeAttribute("required");
            document.getElementById("cardNum").removeAttribute("required");
            document.getElementById("accountNum").setAttribute("required", "");
            
        });

    
    });
});