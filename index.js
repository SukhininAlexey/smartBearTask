$(function(){
    var auth = $.cookie("SBauth");
    if(!auth){
        window.location.replace("login.html");
    }
    
    getUser(auth, "user");
    
    var table = new Table("test");
    table.initialaze(auth);
    
    $("#logout").click(handelLogout);
    $("#name-filter").keyup(function(){
        table.filter();
    });
    $("#age-filter").keyup(function(){
        table.filter();
    });
    $("#desc-filter").keyup(function(){
        table.filter();
    });
});

function handelLogout(){
    $.cookie("SBauth", null);
    window.location.replace("login.html");
}

function getUser(auth, idToPlace){

    var posting = $.post(
        "https://smartbear.ru/Pretender/state.asp", 
        {auth: auth},
    ).done(function(data){
        $("#"+idToPlace).text(data.User.name + " " + data.User.family);
    }).fail(function(xhr, status, error){
        handelLogout();
    });
}


function Table(frameId){

    this.tbody = null;
    this.pager = null;
    this.pages = 1;
    this.page = 1;
    this.content = [];
    this.contentFiltered = [];
    this.frameId = frameId;
}

Table.prototype.initialaze = function(auth){
    this.getGrid(auth, this.saveArrays.bind(this));
}

Table.prototype.getGrid = function(auth, callback){
    var instance = this; 
    $.get(
        "https://smartbear.ru/Pretender/grid.asp", 
        {auth: auth},
    ).done(function(gridData){
        instance.getList(auth, gridData, callback);
    }).fail(function(xhr, status, error){
        return null;
    });
}

Table.prototype.getList = function(auth, gridData, callback){
    var instance = this; 
    $.get(
        "https://smartbear.ru/Pretender/list.asp", 
        {auth: auth},
    ).done(function(listData){
        callback(gridData, listData)
        
    }).fail(function(xhr, status, error){
        return null;
    });
}


Table.prototype.saveArrays = function(gridData, listData){
    
    imax = gridData.results.length;

    for(var i = 0; i < imax; ++i){
        this.content[i] = {
            Name: gridData.results[i].Name,
            Age: listData.results[i].Age,
            Description: gridData.results[i].Description,
        }
    }
    this.filter();
}

Table.prototype.filter = function(){
    var name = $("#name-filter").val();
    var desc = $("#desc-filter").val();
    var age = $("#age-filter").val();
    var instance = this; 
    this.contentFiltered = [];
    
    this.content.forEach(function(element){
        var nameCheck = element.Name.indexOf(name) != -1;
        var ageCheck = (element.Age === +age) || (+age === 0);
        var descriptionCheck = element.Description.indexOf(desc) != -1;
        
        if(nameCheck && ageCheck && descriptionCheck){
            instance.contentFiltered.push(element);
        }
    });
    
    this.pages = Math.ceil(this.contentFiltered.length / 10);
    this.page = 1;
    this.addPagenation();
    this.render();
}

Table.prototype.addPagenation = function(){
    $("#pager").remove();
    var pager = document.createElement("div");
    pager.setAttribute("id", "pager");
    pager.classList.add("d-flex");
    for(var i = 0; i < this.pages; ++i){
        var button = document.createElement("button");
        button.textContent = (i+1);
        if(i == 0){
            button.classList.add("active");
        }
        button.classList.add("pager-page", "btn", "btn-primary");
        pager.appendChild(button);
    }
    
    pager.addEventListener("click", function(event){
        $("#pager > button").each(function(indx, element){
            element.classList.remove("active");
        });
        event.target.classList.add("active");
        this.page = event.target.textContent;
        this.render();
    }.bind(this));
    
    this.pager = pager;
    $("#for-pager").append(pager);
}

Table.prototype.render = function(){
    $("#tbody").remove();
    var tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody");
    
    var imin = (this.page - 1) * 10;
    var imax = this.page * 10;
    if(imax > this.contentFiltered.length){
        imax = this.contentFiltered.length;
    }
    
    for(var i = imin; i < imax; ++i){
        
        var tr = document.createElement("tr");
        var name = document.createElement("td");
        var age = document.createElement("td");
        var description = document.createElement("td");
        
        name.textContent = this.contentFiltered[i].Name;
        age.textContent = this.contentFiltered[i].Age;
        description.textContent = this.contentFiltered[i].Description;
        
        tr.appendChild(name);
        tr.appendChild(age) ;
        tr.appendChild(description);
        
        tbody.appendChild(tr);
    }
    
    this.tbody = tbody;
    $("#table").append(this.tbody);
}
