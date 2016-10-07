			function show(id){
				var node_answer=document.getElementById(id);
				var node_selected=document.getElementsByClassName("answer_selected");
				var node_finished=document.getElementsByClassName("answer_finished");
				
				var number=id.split("_")[1];
				var optionId=document.getElementById("option"+number);
				var optionSelected=document.getElementsByClassName("option_menu_selected");
				var trianDisplay=document.getElementById("trian"+number);
				var trianHide=document.getElementsByClassName("trianDisplay");
				var answerExplationDisplay=document.getElementById("answer_explation"+number);
				var answerExplationHide=document.getElementsByClassName("answer_explation_display");
				if(node_selected.length!=0){
					
					node_selected[0].className="answer";
					optionSelected[0].className="option_menu_wrapper";
					node_answer.className="answer_selected";
					optionId.className="option_menu_selected";

					trianHide[0].className="trianHide";
					trianDisplay.className="trianDisplay";
				}
				else{
					if(node_answer.className!="answer_right" && 
						node_answer.className!="answer_false" &&
						node_answer.className!="answer_empty"){
							node_answer.className="answer_selected";
							optionId.className="option_menu_selected";
							}
					if(trianHide.length==0){
						trianDisplay.className="trianDisplay";
					}
					else{
						trianHide[0].className="trianHide";
						trianDisplay.className="trianDisplay";
					}
					if(optionId.className=="option_menu_false" || 
						optionId.className=="option_menu_right"){
						if(answerExplationHide.length==0){
							answerExplationDisplay.className="answer_explation_display";
						}	
						else{
							answerExplationHide[0].className="answer_explation_hide";
							answerExplationDisplay.className="answer_explation_display";
						}
					}
				}
			}

			function assignFun(){
				var allAns=document.getElementsByClassName("answer");
				var answer_option=document.getElementById("answer_option");
				for(var i=0;i<allAns.length;i++){
					(function(i){
						allAns[i].onclick=function(){
							show(this.id);
						}
					})(i)
				}

				for(var i=1;i<11;i++){
					var newTd=document.createElement("td");
					var newSpan=document.createElement("span");
					var newLink=document.createElement("a");
					var trian=document.createElement("div")
					var parentNode=document.getElementById("menu_tr")
					newLink.href="#answer_"+i;
					newLink.className="option_menu";
					newLink.innerHTML=i;
					trian.className="trianHide";
					trian.id="trian"+i;
					newSpan.id="option"+i;
					newSpan.className="option_menu_wrapper";
					newSpan.appendChild(newLink);
					newSpan.appendChild(trian);
					newTd.appendChild(newSpan);
					parentNode.appendChild(newTd);
					(function(i){
						newLink.onclick=function(){
							show("answer_"+i);
						}
					})(i)
				}
				var answerArr=["common","results","consequently","basis","detection","monitor","symbols","average","dramatically","symptoms","reason","distributed","including","developing","shared"];
				for(var i=0;i<5;i++){
					var answerTr=document.createElement("tr");
					for(var j=0;j<3;j++){
						var index=Math.floor(Math.random()*answerArr.length);
						var answerTd=document.createElement("td");
						var answerText=document.createElement("p");
						answerText.className="answerText";
						answerText.innerText=answerArr[index];
						answerTd.width="200px";
						(function(i){
							answerTd.onclick=function(){
								var answer=document.getElementsByClassName("answer_selected");
								if(answer[0]){
									var trianId=answer[0].id.split("_")[1];
									var trian=document.getElementById("trian"+trianId);
									answer[0].innerHTML=this.innerText;
									answer[0].className="answer_finished";
									trian.className="trianHide";
									this.className="answertext_selected";
								}
							}
							answerTd.onmouseover=function(){
								
								var answer=document.getElementsByClassName("answer_selected");
								if(answer[0]){
									answer[0].innerHTML=this.innerText;
								}
							}
							answerTd.onmouseout=function(){
								var answer=document.getElementsByClassName("answer_selected");
								if(answer[0]){
									answer[0].innerHTML="";
								}
							}
						})(i)
						answerTd.appendChild(answerText);
						answerTr.appendChild(answerTd);
						answerArr.splice(index,1);
					}
					
					answer_option.appendChild(answerTr);
				}
				for(var i=1;i<=10;i++){
					var pareNode=document.getElementById("navigator_menu");
					(function(i){
						var answerExplation=document.createElement("div");
						answerExplation.className="answer_explation_hide";
						answerExplation.id="answer_explation"+i;
						answerExplation.innerText="this is answer explation"+i;
						pareNode.appendChild(answerExplation);
					})(i)
					
				}
			}
			function handIn(){
				document.getElementById("handIn").disabled="disabled";
				var rightAnswer=["developing","average","dramatically","results","shared","basis"
				,"monitor","including","detection","symptoms"];
				var accuracy=0;
				var answerList=[];
				var answer_result=document.getElementById("answer_result");
				document.body.style.backgroundColor="#8b7e66";
				document.getElementById("reportCard").style.display="block";
				for(var i=1;i<=10;i++){
					(function(i){
						var answer=document.getElementById("answer_"+i);
						answerList.push(answer.innerText);
					})(i)
				}
				for(var j=0;j<10;j++){
					(function(j){
						if(answerList[j]===rightAnswer[j]){
							accuracy+=1;
						}
					})(j)
				}
				document.getElementById("accuracy").innerText=
					(accuracy/rightAnswer.length)*100+"%";

					for(var i=0;i<2;i++){
						var answer_result_tr=document.createElement("tr");
						for(var j=1;j<=5;j++){
							var answer_result_td=document.createElement("td");		
							(function(j){
								if(answerList[j+i*5-1]===rightAnswer[j+i*5-1]){
									answer_result_td.className="report_correct";		
								}
								else{
									answer_result_td.className="report_false";
								}
								answer_result_td.innerHTML=j+i*5;
							})(j)
							answer_result_tr.appendChild(answer_result_td);
						}
						answer_result.appendChild(answer_result_tr);
				}
			}

			function checkAnswer(){
				document.getElementById("reportCard").style.display="none";
				document.body.style.backgroundColor="#fff";
				var rightAnswer=["developing","average","dramatically","results","shared","basis"
				,"monitor","including","detection","symptoms"];
				for(var i=1;i<=10;i++){
					(function(i){
						var answer=document.getElementById("answer_"+i);
							if(answer.innerText===rightAnswer[i-1]){
								var optionRight=document.getElementById("option"+i);
								optionRight.className="option_menu_right";
								answer.className="answer_right";
							}
							else if(!answer.innerText){
								var j=i+1;
								answer.className="answer_empty";
								var correctAnswer=document.createElement("span");
								var answer_wrapper=document.getElementById("answer_wrapper_"+i);
								var optionRight=document.getElementById("option"+i);
								optionRight.className="option_menu_false";
								correctAnswer.className="answer_correct";
								correctAnswer.innerText=rightAnswer[i-1];
								answer_wrapper.style.width="260px";
								answer_wrapper.appendChild(correctAnswer);
							}
							else{
								answer.className="answer_false";
								var correctAnswer=document.createElement("span");
								var answer_wrapper=document.getElementById("answer_wrapper_"+i);
								var optionRight=document.getElementById("option"+i);
								optionRight.className="option_menu_false";
								correctAnswer.className="answer_correct";
								correctAnswer.innerText=rightAnswer[i-1];
								answer_wrapper.style.width="260px";
								answer_wrapper.appendChild(correctAnswer);
								
							}
					})(i)
				}
						document.getElementById("answer_option").style.display="none";
				
			}









