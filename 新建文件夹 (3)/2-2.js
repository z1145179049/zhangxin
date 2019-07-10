function showNode(node){
                if(node.innerHTML!=undefined && node.innerHTML!='')
                    console.log(node.innerHTML);
                if(node.firstChild!=undefined){
                    for(let i in node.children){
                        showNode(node.children[i]);
                    }
                }
                if(node.nextElementSubling!=undefined){
                    showNode(node.nextSubling);
                }
            }