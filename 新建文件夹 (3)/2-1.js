
            function fillData(data){   
                let ul1=document.createElement("ul");
                document.body.append(ul1);
                data.forEach(element => {
                    let li1=document.createElement("li");
                    li1.innerHTML=element['text'];
                    ul1.append(li1);
                    //
                    if(element['child'] != undefined){
                        element['child'].forEach((ele1,index1)=>{
                            let ul2=document.createElement('ul');
                            ul1.append(ul2);
                            let li2=document.createElement('li');
                            ul2.append(li2);
                            li2.innerHTML=ele1['text'];

                            ele1['child'].forEach((ele2,index2)=>{
                                let ul3=document.createElement('ul');
                                ul2.append(ul3);
                                let li3=document.createElement('li');
                                ul3.append(li3);
                                li3.innerHTML=ele2;
                            });
                        })
                    }    
                });
            }