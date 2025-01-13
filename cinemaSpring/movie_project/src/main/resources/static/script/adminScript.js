$(function(){

    $(".mainLi").on("mouseover",function(){
        $(this).find(".subLi").stop().slideDown();
    })
    $(".mainLi").on("mouseout",function(){
        $(this).find(".subLi").stop().slideUp();
    })

})