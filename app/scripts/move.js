jQuery(document).ready(function(){
    
    $(function(){
        $("#areas").focus();
        $("#inputmarker1").addClass("show");
        $(".clouds").addClass("move");
        $(".birds").addClass("fly");
    });

    $("#btn").click(function(){ 
        $(".clouds").toggleClass("swipe"); 
        $("#mobhouses").addClass("hide");
    }); 
    
    $("#areas").focus(function(){ 
        $("#inputmarker2").removeClass("show");
        $("#inputmarker1").addClass("show");
    }); 

    $("#amount").focus(function(){ 
        $("#inputmarker1").removeClass("show");
        $("#inputmarker2").addClass("show");
    }); 

});