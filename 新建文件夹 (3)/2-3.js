    function createNodeByJQ(obj){
        $ul=$("<ul class=ul1>");
           $('body').append($ul);
           obj.forEach((ele,index)=>{
               $li1=$('<li>');
               $li1.html(ele['text']);
               $ul.append($li1);
               $ul2=$('<ul class=ul2>');
               $ul.append($ul2);
               ele['child'].forEach((ele1,index1)=>{
                   $li2=$('<li>');
                   $ul2.append($li2);
                   $li2.html(ele1['text']);
                   $ul3=$('<ul class=ul3>');
                   $ul2.append($ul3);
                   ele1['child'].forEach(ele2=>{
                       $li3=$('<li>');
                       $ul3.append($li3);
                       $li3.html(ele2);
                   })
               });
        });
        $('.ul3').click(function(e){
            $(this).toggle();
            e.stopPropagation();
        });
        $('.ul2').click(function(){
            $('.ul3').toggle();
            e.stopPropagation();
        });

        $('.ul1').click(function(){
            $('.ul2').toggle();
            e.stopPropagation();
        })
    }