<html>
<head>
    <title>Canvas & Mootools</title>
    <style>
        button
        {
            height: 100px;
            width: 100px;
            text-align: center;
        }
    </style>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mootools/1.6.0/mootools-core.js"></script>
	<script type="text/javascript">
        let canvas, ctx, balls, idTimer, Make_bigger,speed, x, y, which;
        x = 4; y = 2; which = 0;
        Make_bigger = 0;
        speed_action = new Boolean(false);
        speed = 70;
		TBall = new Class({
			initialize: function(pX,pY) {
                this.figure = 1;
				this.posX = pX; //позиция шарика по X
                this.posY = pY; //позиция шарика по Y
                this.directX = Math.random()*-8 + 3;
                this.directY = Math.random()*-8 + 3;
				//цвет шарика, формируется случайным оьразом
				this.colBall = 'rgb('+Math.floor(Math.random()*256)+','
				+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')';
				// радиус шарика, случайное число от 5 до 30
				this.rBall = 5+Math.random()*25;
            },
            figure: 0,
			posX: 0,
            posY: 0,
            directX: 0,
            directY: 0,
			colBall:"rgb(0,0,0)",
			rBall: 0,
			colorBall: function(ctx){
				// формируем градиентную заливку для шарика
				with (this){
					var gradient = ctx.createRadialGradient(posX+rBall/4,
					posY-rBall/6, rBall/8, posX, posY, rBall);
					gradient.addColorStop(0, '#fff');
					gradient.addColorStop(0.85, colBall);
					return gradient;
				}
			},
			draw : function(ctx){
				// рисуем шарик на canvas
				with (this){
                    switch(figure){
                        case 1:
                            //alert(figure);
                            ctx.fillStyle = colorBall(ctx);
                            ctx.beginPath();
                            ctx.arc(posX, posY, rBall, 0, 2*Math.PI, false);
                            ctx.closePath();
                            ctx.fill();
                        break;
                        case 2:
                            ctx.fillStyle = colorBall(ctx);
                            ctx.beginPath();
                            ctx.fillRect(posX, posY, rBall * 2, rBall * 2);
                            ctx.closePath();
                            ctx.fill();
                        break;
                        case 3:
                            ctx.fillStyle = colorBall(ctx);
                            ctx.beginPath();
                            ctx.moveTo(posX, posY);
                            ctx.lineTo(posX - rBall - 12, posY);
                            ctx.lineTo(posX - rBall + 4, posY - rBall - 12);
                            ctx.closePath();
                            ctx.fill();
                        break;
                    }
				}
			}
        });
        Treugol = new Class({
            Extends: TBall,
            initialize: function()
            {
                this.figure = 2;
            }
        })
        
		function drawBack(ctx,col1,col2,w,h){
			// закрашиваем канвас градиентным фоном
			ctx.save();
			var g = ctx.createLinearGradient(0,0,0,h);
			g.addColorStop(1,col1);
			g.addColorStop(0,col2);
			ctx.fillStyle = g;
			ctx.fillRect(0,0,w,h);
			ctx.restore();
		}
		// инициализация работы
		function init(){
			canvas = document.getElementById('canvas');
			if (canvas.getContext){
				ctx = canvas.getContext('2d');
				//рисуем фон
				drawBack(ctx,'#202020','#aaa',canvas.width,canvas.height);
				//создаем 10 шариков, заноси их в массив и выводим на canvas
				balls = [];
				for (var i = 1; i<=10;i++){
					var item = new TBall(10+Math.random()*(canvas.width-30),
					10+Math.random()*(canvas.height-30));
					item.draw(ctx);
					balls.push(item);
				}
			}
		}
		// создаем новый шарик по щелчку мыши, добавляем его в массив шариков и рисуем его
		function goInput(event){
			var x = event.clientX;
			var y = event.clientY;
            var item = new TBall(x,y);
            item.figure = Math.floor(Math.random()*3 + 1);
			item.draw(ctx);
			balls.push(item);
		}
		function moveBall(x, y){
			//реализация движения шариков, находящихся в массиве balls
			drawBack(ctx,'#202020','#aaa',canvas.width,canvas.height);
			for (var i = 0; i < balls.length;i){
                if (balls[i].rBall >=40) balls.splice(i, 1);
                else{
                    balls[i].posX = balls[i].posX + (Math.random()*x-y);
                    balls[i].posY = balls[i].posY + (Math.random()*y-x);
                    balls[i].rBall += Make_bigger;
                    balls[i].draw(ctx);
                   /* for (let j = i-1; j >= 0; j--)
                    {
                        if (((Math.pow(Math.abs(balls[i].posX - balls[j].posX), 2) + Math.pow(Math.abs(balls[j].posY - balls[j].posY), 2)) - Math.pow(balls[i].rBall, 2) + Math.pow(balls[j].rBall, 2)) < 0)                        
                        balls.splice(i,1);
                    }*/
                    
                    if ((balls[i].posX > canvas.width)||(balls[i].posX < 0) ||(balls[i].posY < 0)||(balls[i].posY > canvas.height)) 
                        balls.splice(i,1);
                    else 
                        i++;
                }
			}
        }
        function moveBall_chaos(a){
			//реализация движения шариков, находящихся в массиве balls
			drawBack(ctx,'#202020','#aaa',canvas.width,canvas.height);
			for (var i = 0; i < balls.length;i){
                if (balls[i].rBall >=40) balls.splice(i, 1);
                else{
                    balls[i].posX = balls[i].posX + (Math.random()*4-2);
                    balls[i].posY = balls[i].posY + (Math.random()*4-2);
                    balls[i].rBall += Make_bigger;
                    balls[i].draw(ctx);
                   /* for (let j = i-1; j >= 0; j--)
                    {
                        if (((Math.pow(Math.abs(balls[i].posX - balls[j].posX), 2) + Math.pow(Math.abs(balls[j].posY - balls[j].posY), 2)) - Math.pow(balls[i].rBall, 2) + Math.pow(balls[j].rBall, 2)) < 0)                        
                        balls.splice(i,1);
                    }*/
                    if ((balls[i].posX > canvas.width)||(balls[i].posX < 0) ||(balls[i].posY < 0)||(balls[i].posY > canvas.height)) 
                        balls.splice(i,1);
                    else 
                        i++;
                }
			}
        }
        function moveBall_direct(z){
			//реализация движения шариков, находящихся в массиве balls
			drawBack(ctx,'#202020','#aaa',canvas.width,canvas.height);
			for (let i = 0; i < balls.length;i){
                if (balls[i].rBall >=40) balls.splice(i, 1);
                else{
                    balls[i].posX = balls[i].posX + (Math.random()*balls[i].directX * z);
                    balls[i].posY = balls[i].posY + (Math.random()*balls[i].directY * z);
                    balls[i].rBall += Make_bigger;
                    balls[i].draw(ctx);
                   /* for (let j = i-1; j >= 0; j--)
                    {
                        if (((Math.pow(Math.abs(balls[i].posX - balls[j].posX), 2) + Math.pow(Math.abs(balls[j].posY - balls[j].posY), 2)) - Math.pow(balls[i].rBall, 2) + Math.pow(balls[j].rBall, 2)) < 0)                        
                        balls.splice(i,1);
                    }*/
                    if ((balls[i].posX > canvas.width)||(balls[i].posX < 0) ||(balls[i].posY < 0)||(balls[i].posY > canvas.height)) 
                        balls.splice(i,1);
                    else 
                        i++;
                }
			}
        }
        
        
        function move_up()
        {
            x = Math.abs(x); y = Math.abs(y);
            which = 0;
            clearInterval(idTimer);
			idTimer = setInterval('moveBall(x, y);',speed);
        }
        function move_left()
        {
            x = Math.abs(x); y = Math.abs(y);
            which = 1;
            clearInterval(idTimer);
			idTimer = setInterval('moveBall(y, x);',speed);
        }
        function move_right()
        {
            x = Math.abs(x) * -1; y = Math.abs(y) * -1;
            which = 2;
            clearInterval(idTimer);
			idTimer = setInterval('moveBall(y, x);',speed);
        }
        function move_down()
        {
            x = Math.abs(x) * -1; y = Math.abs(y) * -1;
            which = 3;
            clearInterval(idTimer);
			idTimer = setInterval('moveBall(x, y);',speed);
        }
        function move_chaos(Make_bigger)
        {
            clearInterval(idTimer);
            which = 4;
			idTimer = setInterval('moveBall_chaos();',speed);
        }
        function move_direct()
        {
            clearInterval(idTimer);
            which = 5;
			idTimer = setInterval('moveBall_direct(1);',speed);
        }
        function move_undirect()
        {
            clearInterval(idTimer);
            which = 6;
			idTimer = setInterval('moveBall_direct(-1);',speed);
        }
        function big()
        {
            if (Make_bigger > 0) Make_bigger = 0;
            else Make_bigger = 0.1;
        }
        function Speed_up()
        {
            speed -=10;
            switch (which)
            {
                case 0: move_up(); break;
                case 1: move_left(); break;
                case 2: move_right(); break;
                case 3: move_down(); break;
                case 4: move_chaos(Make_bigger); break;
                case 5: move_direct(); break;
                case 6: move_undirect(); break;
            }
        }
        function Speed_down()
        {
            speed +=10;
            switch (which)
            {
                case 0: move_up(); break;
                case 1: move_left(); break;
                case 2: move_right(); break;
                case 3: move_down(); break;
                case 4: move_chaos(Make_bigger); break;
                case 5: move_direct(); break;
                case 6: move_undirect(); break;
            }
        }
	</script>
	<style type="text/css">
		canvas { border: 1px solid blue; }
	</style>
</head>
<body onload="init();">
	<canvas id="canvas" width="600" height="400" onclick="goInput(event);">
	</canvas>
	<form>
        <input type = "button" value = "вверх" onclick="move_up()">
        <input type = "button" value = "налево" onclick="move_left()">
        <input type = "button" value = "направо" onclick="move_right()">
        <input type = "button" value = "вниз" onclick="move_down()">
        <input type = "button" value = "хаос" onclick="move_chaos()">
        <input type = "button" value = "по своим делам" onclick="move_direct()">
        <input type = "button" value = "возвращаемся со своих дел" onclick="move_undirect()">
        <input type = "button" value = "стоп" onclick="clearInterval(idTimer);"></br>
        <input type = "button" value = "включить увеличение" onclick="big()">
        <input type = "button" value = "побыстрее" onclick="Speed_up()">
        <input type = "button" value = "помедленнее" onclick="Speed_down()">
    </form>
</br>
    
</body>
</html>
