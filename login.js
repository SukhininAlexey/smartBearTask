$(function(){
    if($.cookie("SBauth")){
        window.location.replace("index.html");
    }
    
    $(".login-form").each(function(index, element){
        element.addEventListener("change", function(event){
            handleFormChange("login-form");
        });
    })
    
    $("#send").click(handelSend);
});


function handelSend(){
     var login = $("#login").val();
     var password = $("#password").val();
    
    var posting = $.post(
        "https://smartbear.ru/Pretender/login.asp", 
        {login: login, password: password},
    ).done(function(data){
        $.cookie("SBauth", data.auth, {expires: 1});
        window.location.replace("index.html");
    }).fail(function(xhr, status, error){
        $("#send-error").text(error);
    });
}


function handleFormChange(className){
    $("."+className).each(function(index,element){
        
        var elementLength = element.value.length;
        var elementMinLength = element.getAttribute("min");
        var elementId = element.getAttribute("id");
        var fieldName = elementId.charAt(0).toUpperCase() + elementId.slice(1);
        var errorMessageId = element.getAttribute("id") + "-error";
        
        if(elementLength < elementMinLength){
            $("#send").prop('disabled', true);
            $("#" + errorMessageId).text(fieldName+" field should be at least "+elementMinLength+" symbols long");
        }else{
            $("#send").prop('disabled', false);
            $("#" + errorMessageId).text("");
        }
    });
}
