const ORDER_ASC_BY_COST  = "De menor a mayor";
const ORDER_DESC_BY_COST = "De mayor a menor";
const ORDER_BY_PROD_REL  = "Relevancia";
const ORDER_BY_SEARCH    = "según búsqueda";
var currentSortCriterio  = undefined;
var minCost              = undefined;
var maxCost              = undefined;

// Muestro lo lista de productos
function showProductsList(){
    
    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product       = currentProductsArray[i];
        let searchProduct =document.getElementById("searchTXT").value.toLowerCase(); 

        // Si el usuario no seleccionó mínimo o máximo muestro todos los artículos
        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost)) &&
            product.name.toLowerCase().includes(searchProduct)){

        htmlContentToAppend += `
                <div class="col-12 col-md-4 mb-4">
                <a href="product-info.html?product=`+ product.name +`">
                <div class="card">
                    <div class="card-body">
                        <img src="` + product.imgSrc + `" alt="` + product.desc + `" class="img-thumbnail">
                        <h4 class="card-title"><b>`+ product.name +`</b></h4>
                        <p><b>`+ product.currency + ` ` + product.cost + `</b></p>
                        <p>` + product.description + `</p>
                        <div class="card-footer">
                            <small class="text-muted">` + product.soldCount + ` artículos vendidos</small>
                        </div>
                    </div>
                </div>
                </a>
                </div>
            
        
        `
        }
    }
    document.getElementById("showPRODUCTS").innerHTML = htmlContentToAppend;
}


// Establezco los criterios para ordenar los productos
function sortProducts(criterio, array){
    let result = [];
    if (criterio === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criterio === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criterio === ORDER_BY_PROD_REL){
        result = array.sort(function(a, b) {
            let aSold = parseInt(a.soldCount);
            let bSold = parseInt(b.soldCount);

            if ( aSold > bSold ){ return -1; }
            if ( aSold < bSold ){ return 1; }
            return 0;
        });
    }

    return result;
}

// Ordena y muestra los productos ordenados según el criterio seleccionado
function sortAndShowProducts(sortCriterio, productsArray){
    currentSortCriterio = sortCriterio;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriterio, currentProductsArray);

    //Muestro los productos ordenados según el criterio elegido
    showProductsList();
}

//------HASTA ACÁ DEFINÍ LAS FUNCIONES------

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowProducts(ORDER_ASC_BY_COST, resultObj.data);
        } 
    });// Automáticamente se muestra por orden de menor a mayor

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortBySoldCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_REL);
    });

    
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCost").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por precio
        
        minCost = document.getElementById("rangeFilterCostMin").value;
        maxCost = document.getElementById("rangeFilterCostMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
            minCost = parseInt(minCost);
        }
        else{
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
            maxCost = parseInt(maxCost);
        }
        else{
            maxCost = undefined;
        }

        showProductsList();
    });
    
});
