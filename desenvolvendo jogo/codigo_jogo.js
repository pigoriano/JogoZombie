//Variáveis
var 
 canvas,
 ctx,
 altura,
 largura,
 frames = 0,
 maxPulos = 2,
 velocidade = 6,
 estadoAtual,
 record,
 
 //enumeração
 estados ={
	 jogar: 0,
	 jogando: 1,
	 perdeu: 2
 },//fim enumeração

//Objeto chão
	chao = {
		//atributos para o chão
		y: 550,
		altura: 50,
		cor:"#8B795E",
		
	
		
		//método desenhar o chão
		desenha: function(){
			//Desenhar o chão
	var imagemChao = new Image();
	imagemChao.onload = function(){
	ctx.drawImage(imagemChao,0, chao.y,
					largura, chao.altura);
		};
	imagemChao.src='imagens/chao.jpg';
	ctx.drawImage(imagemChao, 0, chao.y,
			largura, chao.altura);
			
		}//fecha método desenha
	},//fecha método chao
	
	
	
	//Objeto do bloco(personagem)
	bloco = {
		//Atributos para o bloco
		x:50,
		y:0,
		altura:50,
		largura:50,
		gravidade: 1.5,
		velocidade: 0,
		forcaDoPulo: 22,
		qntPulos: 0,
		score: 0,
		
		
		//Grávidade do Bloco
		atualiza: function(){
			bloco.velocidade += bloco.gravidade;
			bloco.y += bloco.velocidade;
			
			//If para o bloco não ultrapassar o chão
			//Porém se o estado receber "perdeu" ele desliga a gravidade e o bloco cai
			if (bloco.y > chao.y - bloco.altura && 
				estadoAtual != estados.perdeu){
				bloco.y = chao.y - bloco.altura;
				bloco.qntPulos = 0;
				bloco.velocidade = 0;
				
			}//fecha if gravidade
		},// fecha método gravidade
		
		//Definindo o pulo
		pula: function(){
			if (bloco.qntPulos < maxPulos){
			bloco.velocidade = - bloco.forcaDoPulo;
			bloco.qntPulos++;
			
	//Som do Pulo
	var somPulo = new Audio();
		somPulo.src = 'som/pulo.wav';
		somPulo.volume = 0.2;
		somPulo.load();
	
			somPulo.currentTime = 0.0;
			somPulo.play();
			
			}//fecha if pulo
		},//fecha método pulo
		
		//Volta os atributos do bloco ao normal
		reset: function(){
			bloco.velocidade = 0;
			bloco.y = 0;
			
			//Score Record
			if (bloco.score > record){
				localStorage.setItem("record", bloco.score);
				record = bloco.score;
			}
			
			bloco.score = 0;
		},//fecha reset
		
		//desenhar o bloco
		desenha: function(){
	
	//Desenhar o Hunter
	var imagemBloco = new Image();
	imagemBloco.onload = function(){
	ctx.drawImage(imagemBloco,bloco.x, bloco.y,
					bloco.altura, bloco.largura);
		};
	imagemBloco.src='imagens/hunter.png';
	ctx.drawImage(imagemBloco, bloco.x, bloco.y,
					bloco.altura, bloco.largura);
			
			
			
		}//fecha método desenhar
	},//fecha metodo bloco
	
	//objeto obstaculo
	obstaculos = {
		//vetores
		_obs: [],
		cores: ["#000"],
		tempoInsere: 0,
		
		//método inserir elemento
		insere: function(){
		obstaculos._obs.push({
				x: largura,
				//rever variáveis dos obstaculos
				//larguraObs: 30 + Math.floor(21 * Math.random()),
				larguraObs: 50,
				alturaObs: 50,
				
			});	
			obstaculos.tempoInsere = 30+ Math.floor(21 * Math.random());
			
		},//fecha o insere
		
		//Atualizar obstaculos
		atualiza: function(){
			
			if(this.tempoInsere == 0)
				obstaculos.insere();
			else
				obstaculos.tempoInsere--;
			
			//rodar o array de obstaculos
			for (var i = 0, tam = obstaculos._obs.length; i<tam; i++){
				var obs = obstaculos._obs[i];
				obs.x -= velocidade;
				
				//impacto do personagem ao objeto
				if (bloco.x < obs.x + obs.larguraObs && 
				bloco.x + bloco.largura >= obs.x &&
				bloco.y + bloco.altura >= chao.y - obs.alturaObs)
					estadoAtual = estados.perdeu;
				
				//Score
				else if(obs.x == 0)
					bloco.score++;
					
				
				
				/*
					~ está dando erro ~
					
				remover obstaculos do array pra não gastar processamento e memória
				if(obs.x <= -obs.larguraObs){
					this._obs.splice(i, 1);
					tam--;
					i--;
				}fecha if
				
				*/
				
				
			}//fecha for
		},//fecha atualiza
		
		//limpa o array
		limpa: function(){
			obstaculos._obs = [];
		},//fecha limpa
		
		//Desenhar obstaculo
		desenha: function (){
			//Indice para desenhar os obstaculos
			for (var i=0, tam = obstaculos._obs.length; i <tam; i++){
				//selecionando o elemento que vai desenhar
				var obs = obstaculos._obs[i];
				
				
					//Desenhar o Hunter
	var imagemObs = new Image();
	imagemObs.onload = function(){
	ctx.drawImage(imagemObs,obs.x, chao.y - obs.alturaObs, 
					obs.larguraObs, obs.alturaObs);
		};
	imagemObs.src='imagens/zumbi.png';
	ctx.drawImage(imagemObs,obs.x, chao.y - obs.alturaObs, 
					obs.larguraObs, obs.alturaObs);
				//y do chao subtrai da altura do obs
				
			
			}//fecha for
		}//fecha desenha
	};//fecha método obstaculos

/*Mudar o clique para setas do teclado*/
function keyDown(event){
	
	if (estadoAtual == estados.jogando)
	bloco.pula();
	
	
	/*
	if(event.keyCode = 32)
    {
     bloco.pula();
		
    }
    */
    


	//muda estado jogar para jogando
	else if (estadoAtual == estados.jogar){
		estadoAtual = estados.jogando;
	}//fecha else if
	
	//Quando clica na tela de perdeu ele limpa o array de blocos
	else if (estadoAtual == estados.perdeu &&
		bloco.y >= 2* altura){
		estadoAtual = estados.jogar;
		obstaculos.limpa();
		bloco.reset();
	}//fecha else if
	
}//fecha clique

/* Principal */
function main(){

	largura = window.innerWidth;
	altura = window.innerHeight;
	
	//atribuindo valores para variaveis
	if (largura >=500){
		largura = 600;
		altura  = 600;		
	}//fecha if
	
	 canvas = document.createElement("canvas");
	 canvas.width = largura;
	 canvas.height = altura;
	 canvas.style.border ="1px solid #000";
	 
	 //adicionar a canvas
	 ctx = canvas.getContext("2d");
	 document.body.appendChild(canvas);
	 
	 //ID
	 canvas = document.getElementById("canvas");
	 
	 //evento de clique
	 document.addEventListener('keydown', keyDown);
	 
	 //estados do jogo
	 estadoAtual = estados.jogar;
	 
	 //Acessa localStorage e acessa o "record"
	 record = localStorage.getItem("record");
	 if(record == null)
		record = 0;
	
	 //função rodar o jogo
	 roda();
}//fecha main

/*Deixa o jogo rodando*/
function roda(){
	atualiza();
	desenha();
	window.requestAnimationFrame(roda);
	}//fecha roda

	
/*Atualiza os status do personagem e os obstaculos do jogo*/
function atualiza(){
	//deixando o jogo em looping aumentando os frames
	frames++;
	
	//Sempre atualiza o bloco
	bloco.atualiza();
	
	//Objetos só atualiza se estiver jogando
	if(estadoAtual == estados.jogando)
		obstaculos.atualiza();
	
}//fecha atualiza



/* desenha o jogo */
function desenha(){
	//Imagem de fundo Jogar
	var imagemJogar = new Image();
	imagemJogar.onload = function(){
	ctx.drawImage(imagemJogar, 0, 0);
		};
imagemJogar.src='imagens/jogar.png';
	
	//Variavel para Imagem de fundo Jogando
	var imagemJogando = new Image();
	imagemJogando.onload = function(){
	ctx.drawImage(imagemJogando, 0, 0);
		};
imagemJogando.src='imagens/jogando.png';

	//Variavel para Imagem de fundo Jogando
	var imagemPerdeu = new Image();
	imagemPerdeu.onload = function(){
	ctx.drawImage(imagemPerdeu, 0, 0);
		};
imagemPerdeu.src='imagens/perdeu.png';

	//Variavel para Imagem de fundo Jogando
	var imagemNovoRecord = new Image();
	imagemNovoRecord.onload = function(){
	ctx.drawImage(imagemNovoRecord, 0, 0);
		};
	imagemNovoRecord.src='imagens/novo_record.png';

	//Score
	ctx.fillStyle = "#000";
	ctx.font = "20px Arial";
	ctx.fillText(bloco.score, -150, 20);
	
	
	//Estado Jogar
	if (estadoAtual == estados.jogar){
		//EUREKA, DEU CERTO!
		//Imagem de fundo Jogar
		ctx.drawImage(imagemJogar, 0, 0);
		
	}//fecha if jogar
	
	
	//Estado Perdeu:
	else if (estadoAtual == estados.perdeu){
		//Imagem de fundo Perdeu
		ctx.drawImage(imagemPerdeu, 0, 0);
		
		//Score do momento
		ctx.save();
		ctx.translate(largura/2, altura/2);
		ctx.fillStyle = "#000";
		
		//Alinhamento de Msg de Record batido (acima do bloco vermelho)
		if (bloco.score > record)
			ctx.drawImage(imagemNovoRecord, -105, 15),
			ctx.fillText(bloco.score, 0, 40);
			
		else if(record < 10)
			ctx.fillText(record, 0, 40);
		
		else if(record >= 10 &&
				record < 100)
			ctx.fillText(record, -10, 40);
			
		else ctx.fillText (record, -20, 40);
		
		
		//Alinhamento do Score (dentro do bloco vermelho)
		if (bloco.score < 10)
			ctx.fillText(bloco.score, 0, -5);
		else if (bloco.score >= 10 &&
				 bloco.score < 100)
			ctx.fillText(bloco.score, -5, -5);	 
		else 
			ctx.fillText(bloco.score, -10, -5);
		
		ctx.restore();
	}//fecha if perdeu
	
	//Cria os obstaculos se o Estado estiver como Jogando
	else if(estadoAtual == estados.jogando)
		
	//Imagem Jogando
		ctx.drawImage(imagemJogando, 0, 0);
		ctx.fillText(bloco.score, 196, 100);
	obstaculos.desenha();

	//chamando métodos chão e bloco
	chao.desenha();
	bloco.desenha();
	
}//fecha desenha