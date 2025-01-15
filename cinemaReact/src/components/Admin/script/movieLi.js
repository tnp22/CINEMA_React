$(function(){

    $(".mainLi").on("mouseover",function(){
        $(this).find(".movieLi").stop().slideDown();
    })
    $(".mainLi").on("mouseout",function(){
        $(this).find(".movieLi").stop().slideUp();
    })

})