$(function(){
    if($.cookie("SBauth")){
        window.location.replace("index.html");
    }
    
    var loginForm = {
        readiness: true,
    };

    $(".login-form").each(function(ind, obj){
        $(this).change($.proxy(handleFormChange, this, event, loginForm));
    });

    $("#form").submit(function(){
        handelSend(event, loginForm);
    });
});


function handelSend(event, readinessObj){

    readinessObj.readiness = true;
    
    $(".login-form").change();
    
    if(readinessObj.readiness){
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
    window.event.preventDefault();
}


function handleFormChange(event, readinessObj){

    var element = this;
    
    var elementLength = element.value.length;
    var elementMinLength = element.getAttribute("min");
    var elementId = element.getAttribute("id");
    var fieldName = elementId.charAt(0).toUpperCase() + elementId.slice(1);
    var errorMessageId = element.getAttribute("id") + "-error";

    if(elementLength < elementMinLength){
        readinessObj.readiness = readinessObj.readiness && false;
        $("#" + errorMessageId).text(fieldName+" field should be at least "+elementMinLength+" symbols long");
    }else{
        readinessObj.readiness = readinessObj.readiness && true;
        $("#" + errorMessageId).text("");
    }
}
