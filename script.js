const menu_ratings = document.getElementById('menu_ratings').children;
const menu_dates = document.getElementById('menu_dates').children;
for (let i=1; i<menu_ratings.length; i+=1) {
    menu_ratings[i].addEventListener('click', ()=>{changeMenu(i)})
}
for (let i=0; i<menu_dates.length; i+=1) {
    menu_dates[i].addEventListener('click', ()=>{changeDates(i)})
}

function changeMenu(j) {
    for(let i=1; i<menu_ratings.length-1; i+=1) {
        if (i===j) {
            menu_ratings[i].classList.add('selected');
            document.getElementById(`rating_block_${i}`).classList.remove('hide');
        } else {
            menu_ratings[i].classList.remove('selected');
            document.getElementById(`rating_block_${i}`).classList.add('hide');
        }
    }
}

function changeDates(j) {
    for(let i=0; i<menu_dates.length; i+=1) {
        if (i===j) {
            menu_dates[i].classList.add('selected');
        } else {
            menu_dates[i].classList.remove('selected');
        }
    }
}
window.omload = showButtons();
document.getElementById('pass').addEventListener('change',showButtons);
function showButtons() {
    if (document.getElementById('pass').value=='bigboss') {
        document.querySelectorAll('.superhide').forEach((el)=>el.classList.remove('superhide'));
    } else {
        document.querySelectorAll('.button').forEach((el)=>el.classList.add('superhide'));
    }
} 

document.getElementById('knyazev_refresh').addEventListener('click',getId);

function getId() {
    const turnir = [];
    const code = [];
    const quantity = [];
    const results=[];
    const all_results={}
    document.getElementById('knyazev_status').innerText = 'Обновляются таблицы по чемпионатам. Пожалуйста, подождите';
    fetch('https://script.google.com/macros/s/AKfycbxlfVjxoLaSGpiN1XqcIZWwCWykvmSUikldRcVLcyd-6RbCWQ3CFopvE2idX0HgwewQjQ/exec')
    .then(res => res.text())
    .then(rep => {
        const data = JSON.parse(rep);
        for (let i=1; i<data.length; i+=1) {
            turnir.push(data[i][0])
            code.push(data[i][1])
            quantity.push(data[i][2])
            results.push(data[i].slice(3,33));
        }
    })
    .then(rep=>{
        let temp_result=[];
        for(let i=0; i<turnir.length; i+=1) {
            let temp_result_2=[];
            if(code[i].split('_').length>1){
                for(let x=0; x<code[i].split('_').length;x+=1) {
                    let req = new XMLHttpRequest();  
                    req.open('GET', `https://fantasy-h2h.ru/h2h/data/group_table/${code[i].split('_')[x]}`, false);   
                    req.send(null);  
                    if(req.status == 200) {
                        for(let j=0; j<quantity[i]/code[i].split('_').length; j+=1) {
                            temp_result_2.push(req.response.split('div class="inner team_name" title="')[j+1].split('">')[0]);
                        }       
                    }
                }
            } else {
                let req = new XMLHttpRequest();  
                req.open('GET', `https://fantasy-h2h.ru/h2h/data/group_table/${code[i]}`, false);   
                req.send(null);  
                if(req.status == 200) {
                    for(let j=0; j<quantity[i]; j+=1) {
                        temp_result_2.push(req.response.split('div class="inner team_name" title="')[j+1].split('">')[0]);
                    }       
                }
            }
            temp_result.push(temp_result_2);
            all_results[turnir[i]]=temp_result[i];
        }
    })
    .then(rep=>{
        for (let i=0; i<3/*turnir.length*/; i+=1) {
            fetch(`https://sheetdb.io/api/v1/cm1u7k6z6rd10/id/${code[i]}?sheet=knyazev`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data:{
                        '1': `${all_results[turnir[i]].length>0? all_results[turnir[i]][0]:results[i][0]}`,
                        '2': `${all_results[turnir[i]].length>1? all_results[turnir[i]][1]:results[i][1]}`,
                        '3': `${all_results[turnir[i]].length>2? all_results[turnir[i]][2]:results[i][2]}`,
                        '4': `${all_results[turnir[i]].length>3? all_results[turnir[i]][3]:results[i][3]}`,
                        '5': `${all_results[turnir[i]].length>4? all_results[turnir[i]][4]:results[i][4]}`, 
                        '6': `${all_results[turnir[i]].length>5? all_results[turnir[i]][5]:results[i][5]}`, 
                        '7': `${all_results[turnir[i]].length>6? all_results[turnir[i]][6]:results[i][6]}`, 
                        '8': `${all_results[turnir[i]].length>7? all_results[turnir[i]][7]:results[i][7]}`, 
                        '9': `${all_results[turnir[i]].length>8? all_results[turnir[i]][8]:results[i][8]}`, 
                        '10': `${all_results[turnir[i]].length>9? all_results[turnir[i]][9]:results[i][9]}`, 
                        '11': `${all_results[turnir[i]].length>10? all_results[turnir[i]][10]:results[i][10]}`,
                        '12': `${all_results[turnir[i]].length>11? all_results[turnir[i]][11]:results[i][11]}`,
                        '13': `${all_results[turnir[i]].length>12? all_results[turnir[i]][12]:results[i][12]}`,
                        '14': `${all_results[turnir[i]].length>13? all_results[turnir[i]][13]:results[i][13]}`,
                        '15': `${all_results[turnir[i]].length>14? all_results[turnir[i]][14]:results[i][14]}`, 
                        '16': `${all_results[turnir[i]].length>15? all_results[turnir[i]][15]:results[i][15]}`, 
                        '17': `${all_results[turnir[i]].length>16? all_results[turnir[i]][16]:results[i][16]}`, 
                        '18': `${all_results[turnir[i]].length>17? all_results[turnir[i]][17]:results[i][17]}`, 
                        '19': `${all_results[turnir[i]].length>18? all_results[turnir[i]][18]:results[i][18]}`, 
                        '20': `${all_results[turnir[i]].length>19? all_results[turnir[i]][19]:results[i][19]}`,
                        '21': `${all_results[turnir[i]].length>20? all_results[turnir[i]][20]:results[i][20]}`,
                        '22': `${all_results[turnir[i]].length>21? all_results[turnir[i]][21]:results[i][21]}`,
                        '23': `${all_results[turnir[i]].length>22? all_results[turnir[i]][22]:results[i][22]}`,
                        '24': `${all_results[turnir[i]].length>23? all_results[turnir[i]][23]:results[i][23]}`,
                        '25': `${all_results[turnir[i]].length>24? all_results[turnir[i]][24]:results[i][24]}`, 
                        '26': `${all_results[turnir[i]].length>25? all_results[turnir[i]][25]:results[i][25]}`, 
                        '27': `${all_results[turnir[i]].length>26? all_results[turnir[i]][26]:results[i][26]}`, 
                        '28': `${all_results[turnir[i]].length>27? all_results[turnir[i]][27]:results[i][27]}`, 
                        '29': `${all_results[turnir[i]].length>28? all_results[turnir[i]][28]:results[i][28]}`, 
                        '30': `${all_results[turnir[i]].length>29? all_results[turnir[i]][29]:results[i][29]}`,  
                    }
                })
            })
        } 
    })
    .then(rep=>{
        document.getElementById('knyazev_status').innerText = 'Данные успешно загружены';
        setTimeout(()=>{document.getElementById('knyazev_status').innerText = ''},2500)
    })
}

document.getElementById('knyazev_menu').addEventListener('click',openKnyazev);
document.getElementById('knyazev_?').addEventListener('click',showKnyazevInfo);
function showKnyazevInfo() {
    if (document.getElementById('knyazev_info').style.display == 'none') {
        document.getElementById('knyazev_info').style.display = 'block'
        document.getElementById('knyazev_?').style.background = 'pink'
    } else {
        document.getElementById('knyazev_info').style.display = 'none';
        document.getElementById('knyazev_?').style.background = 'lightskyblue'
    }
}

window.onload = loadKnyazev();
const final_res = [];
function loadKnyazev() {
    const turnir = [];
    const results = [];
    fetch('https://script.google.com/macros/s/AKfycbxlfVjxoLaSGpiN1XqcIZWwCWykvmSUikldRcVLcyd-6RbCWQ3CFopvE2idX0HgwewQjQ/exec')
    .then(res => res.text())
    .then(rep => {
        const data = JSON.parse(rep);
        for (let i=1; i<data.length; i+=1) {
            turnir.push(data[i][0])
            results.push(data[i].slice(3,33));
        }
    })
    .then(rep=>{
        let arr2 = [...new Set(results.flat(1))].filter(Boolean);
        for (let x=0; x<arr2.length; x+=1) {
            final_res[x]={};
            final_res[x].team = arr2[x];
            /* En */
            if (results[0].indexOf(arr2[x]) !== -1) {
                final_res[x].en_points = Math.round((100 - 80*results[0].indexOf(arr2[x])/(results[0].filter(Boolean).length-1))*100)/100;
                final_res[x].en_div = 1;
                final_res[x].en_pos = results[0].indexOf(arr2[x])+1;
            } else if (results[1].indexOf(arr2[x]) !== -1) {
                final_res[x].en_points = Math.round((90 - 80*results[1].indexOf(arr2[x])/(results[1].filter(Boolean).length-1))*100)/100;
                final_res[x].en_div = 2;
                final_res[x].en_pos = results[1].indexOf(arr2[x])+1;
            } else if (results[2].indexOf(arr2[x]) !== -1) {
                final_res[x].en_points = Math.round((80 - 80*results[2].indexOf(arr2[x])/(results[2].filter(Boolean).length-1))*100)/100;
                final_res[x].en_div = 3;
                final_res[x].en_pos = results[2].indexOf(arr2[x])+1;
            } else {
                final_res[x].en_points = '-';
                final_res[x].en_div = '-';
                final_res[x].en_pos = '-';
            }
            /*Ru */
            if (results[3].indexOf(arr2[x]) !== -1) {
                final_res[x].ru_points = Math.round((100 - 80*results[3].indexOf(arr2[x])/(results[3].filter(Boolean).length-1))*100)/100;
                final_res[x].ru_div = 1;
                final_res[x].ru_pos = results[3].indexOf(arr2[x])+1;
            } else if (results[4].indexOf(arr2[x]) !== -1) {
                final_res[x].ru_points = Math.round((90 - 80*results[4].indexOf(arr2[x])/(results[4].filter(Boolean).length-1))*100)/100;
                final_res[x].ru_div = 2;
                final_res[x].ru_pos = results[4].indexOf(arr2[x])+1;
            } else if (results[5].indexOf(arr2[x]) !== -1) {
                final_res[x].ru_points = Math.round((90 - 80*results[5].indexOf(arr2[x])/(results[5].filter(Boolean).length-1))*100)/100;
                final_res[x].ru_div = 2;
                final_res[x].ru_pos = results[5].indexOf(arr2[x])+1;
            } else if (results[6].indexOf(arr2[x]) !== -1) {
                final_res[x].ru_points = Math.round((80 - 80*results[6].indexOf(arr2[x])/(results[6].filter(Boolean).length-1))*100)/100;
                final_res[x].ru_div = 3;
                final_res[x].ru_pos = results[6].indexOf(arr2[x])+1;
            } else {
                final_res[x].ru_points = '-';
                final_res[x].ru_div = '-';
                final_res[x].ru_pos = '-';
            }
            /* Es */
            if (results[7].indexOf(arr2[x]) !== -1) {
                final_res[x].es_points = Math.round((100 - 80*results[7].indexOf(arr2[x])/(results[7].filter(Boolean).length-1))*100)/100;
                final_res[x].es_div = 1;
                final_res[x].es_pos = results[7].indexOf(arr2[x])+1;
            } else if (results[8].indexOf(arr2[x]) !== -1) {
                final_res[x].es_points = Math.round((90 - 80*results[8].indexOf(arr2[x])/(results[8].filter(Boolean).length-1))*100)/100;
                final_res[x].es_div = 2;
                final_res[x].es_pos = results[8].indexOf(arr2[x])+1;
            } else if (results[9].indexOf(arr2[x]) !== -1) {
                final_res[x].es_points = Math.round((80 - 80*results[9].indexOf(arr2[x])/(results[9].filter(Boolean).length-1))*100)/100;
                final_res[x].es_div = 3;
                final_res[x].es_pos = results[9].indexOf(arr2[x])+1;
            } else {
                final_res[x].es_points = '-';
                final_res[x].es_div = '-';
                final_res[x].es_pos = '-';
            }
            /* De */
            if (results[10].indexOf(arr2[x]) !== -1) {
                final_res[x].de_points = Math.round((100 - 80*results[10].indexOf(arr2[x])/(results[10].filter(Boolean).length-1))*100)/100;
                final_res[x].de_div = 1;
                final_res[x].de_pos = results[10].indexOf(arr2[x])+1;
            } else if (results[11].indexOf(arr2[x]) !== -1) {
                final_res[x].de_points = Math.round((90 - 80*results[11].indexOf(arr2[x])/(results[11].filter(Boolean).length-1))*100)/100;
                final_res[x].de_div = 2;
                final_res[x].de_pos = results[11].indexOf(arr2[x])+1;
            } else if (results[12].indexOf(arr2[x]) !== -1) {
                final_res[x].de_points = Math.round((80 - 80*results[12].indexOf(arr2[x])/(results[12].filter(Boolean).length-1))*100)/100;
                final_res[x].de_div = 3;
                final_res[x].de_pos = results[12].indexOf(arr2[x])+1;
            } else {
                final_res[x].de_points = '-';
                final_res[x].de_div = '-';
                final_res[x].de_pos = '-';
            }
            /* it */
            if (results[13].indexOf(arr2[x]) !== -1) {
                final_res[x].it_points = Math.round((100 - 80*results[13].indexOf(arr2[x])/(results[13].filter(Boolean).length-1))*100)/100;
                final_res[x].it_div = 1;
                final_res[x].it_pos = results[13].indexOf(arr2[x])+1;
            } else if (results[14].indexOf(arr2[x]) !== -1) {
                final_res[x].it_points = Math.round((90 - 80*results[14].indexOf(arr2[x])/(results[14].filter(Boolean).length-1))*100)/100;
                final_res[x].it_div = 2;
                final_res[x].it_pos = results[14].indexOf(arr2[x])+1;
            } else if (results[15].indexOf(arr2[x]) !== -1) {
                final_res[x].it_points = Math.round((80 - 80*results[15].indexOf(arr2[x])/(results[15].filter(Boolean).length-1))*100)/100;
                final_res[x].it_div = 3;
                final_res[x].it_pos = results[15].indexOf(arr2[x])+1;
            } else {
                final_res[x].it_points = '-';
                final_res[x].it_div = '-';
                final_res[x].it_pos = '-';
            }
            /* fr */
            if (results[16].indexOf(arr2[x]) !== -1) {
                final_res[x].fr_points = Math.round((100 - 80*results[16].indexOf(arr2[x])/(results[16].filter(Boolean).length-1))*100)/100;
                final_res[x].fr_div = 1;
                final_res[x].fr_pos = results[16].indexOf(arr2[x])+1;
            } else if (results[17].indexOf(arr2[x]) !== -1) {
                final_res[x].fr_points = Math.round((90 - 80*results[17].indexOf(arr2[x])/(results[17].filter(Boolean).length-1))*100)/100;
                final_res[x].fr_div = 2;
                final_res[x].fr_pos = results[17].indexOf(arr2[x])+1;
            } else if (results[18].indexOf(arr2[x]) !== -1) {
                final_res[x].fr_points = Math.round((80 - 80*results[18].indexOf(arr2[x])/(results[18].filter(Boolean).length-1))*100)/100;
                final_res[x].fr_div = 3;
                final_res[x].fr_pos = results[18].indexOf(arr2[x])+1;
            } else {
                final_res[x].fr_points = '-';
                final_res[x].fr_div = '-';
                final_res[x].fr_pos = '-';
            }
            /* ship */
            if (results[19].indexOf(arr2[x]) !== -1) {
                final_res[x].ship_points = Math.round((100 - 80*results[19].indexOf(arr2[x])/(results[19].filter(Boolean).length-1))*100)/100;
                final_res[x].ship_div = 1;
                final_res[x].ship_pos = results[19].indexOf(arr2[x])+1;
            } else if (results[20].indexOf(arr2[x]) !== -1) {
                final_res[x].ship_points = Math.round((90 - 80*results[20].indexOf(arr2[x])/(results[20].filter(Boolean).length-1))*100)/100;
                final_res[x].ship_div = 2;
                final_res[x].ship_pos = results[20].indexOf(arr2[x])+1;
            } else {
                final_res[x].ship_points = '-';
                final_res[x].ship_div = '-';
                final_res[x].ship_pos = '-';
            }
            /* nl */
            if (results[21].indexOf(arr2[x]) !== -1) {
                final_res[x].nl_points = Math.round((100 - 80*results[21].indexOf(arr2[x])/(results[21].filter(Boolean).length-1))*100)/100;
                final_res[x].nl_div = 1;
                final_res[x].nl_pos = results[21].indexOf(arr2[x])+1;
            } else if (results[22].indexOf(arr2[x]) !== -1) {
                final_res[x].nl_points = Math.round((90 - 80*results[22].indexOf(arr2[x])/(results[22].filter(Boolean).length-1))*100)/100;
                final_res[x].nl_div = 2;
                final_res[x].nl_pos = results[22].indexOf(arr2[x])+1;
            } else {
                final_res[x].nl_points = '-';
                final_res[x].nl_div = '-';
                final_res[x].nl_pos = '-';
            }
            /* tr */
            if (results[23].indexOf(arr2[x]) !== -1) {
                final_res[x].tr_points = Math.round((100 - 80*results[23].indexOf(arr2[x])/(results[23].filter(Boolean).length-1))*100)/100;
                final_res[x].tr_div = 1;
                final_res[x].tr_pos = results[23].indexOf(arr2[x])+1;
            } else if (results[24].indexOf(arr2[x]) !== -1) {
                final_res[x].tr_points = Math.round((90 - 80*results[24].indexOf(arr2[x])/(results[24].filter(Boolean).length-1))*100)/100;
                final_res[x].tr_div = 2;
                final_res[x].tr_pos = results[24].indexOf(arr2[x])+1;
            } else {
                final_res[x].tr_points = '-';
                final_res[x].tr_div = '-';
                final_res[x].tr_pos = '-';
            }
            /* pt */
            if (results[25].indexOf(arr2[x]) !== -1) {
                final_res[x].pt_points = Math.round((100 - 80*results[25].indexOf(arr2[x])/(results[25].filter(Boolean).length-1))*100)/100;
                final_res[x].pt_div = 1;
                final_res[x].pt_pos = results[25].indexOf(arr2[x])+1;
            } else if (results[26].indexOf(arr2[x]) !== -1) {
                final_res[x].pt_points = Math.round((90 - 80*results[26].indexOf(arr2[x])/(results[26].filter(Boolean).length-1))*100)/100;
                final_res[x].pt_div = 2;
                final_res[x].pt_pos = results[26].indexOf(arr2[x])+1;
            } else {
                final_res[x].pt_points = '-';
                final_res[x].pt_div = '-';
                final_res[x].pt_pos = '-';
            }
        }
    })
}
const knyazev_checked = ['checked','checked','checked','checked','checked','checked','checked','checked','checked','checked'];
function openKnyazev() {
    document.getElementById('knyazev').innerHTML="";
    for (let x=0; x<final_res.length; x+=1) {
        let turnir_sum = 0;
        let total_point = 0;
        if (final_res[x].en_points !=  "-" && knyazev_checked[0]=="checked") {turnir_sum += 1; total_point += final_res[x].en_points;}
        if (final_res[x].ru_points !=  "-" && knyazev_checked[1]=="checked") {turnir_sum += 1; total_point += final_res[x].ru_points;}
        if (final_res[x].es_points !=  "-" && knyazev_checked[2]=="checked") {turnir_sum += 1; total_point += final_res[x].es_points;}
        if (final_res[x].de_points !=  "-" && knyazev_checked[3]=="checked") {turnir_sum += 1; total_point += final_res[x].de_points;}
        if (final_res[x].it_points !=  "-" && knyazev_checked[4]=="checked") {turnir_sum += 1; total_point += final_res[x].it_points;}
        if (final_res[x].fr_points !=  "-" && knyazev_checked[5]=="checked") {turnir_sum += 1; total_point += final_res[x].fr_points;}
        if (final_res[x].ship_points !=  "-" && knyazev_checked[6]=="checked") {turnir_sum += 1; total_point += final_res[x].ship_points;}
        if (final_res[x].nl_points !=  "-" && knyazev_checked[7]=="checked") {turnir_sum += 1; total_point += final_res[x].nl_points;}
        if (final_res[x].tr_points !=  "-" && knyazev_checked[8]=="checked") {turnir_sum += 1; total_point += final_res[x].tr_points;}
        if (final_res[x].pt_points !=  "-" && knyazev_checked[9]=="checked") {turnir_sum += 1; total_point += final_res[x].pt_points;}
        final_res[x].sum = total_point;
        final_res[x].active_turnir = turnir_sum;
        const kef = [0.6,0.6,1,1,1,1,1,1,1,1];
        final_res[x].final_sum = Math.round((total_point/turnir_sum)*(1+turnir_sum/100)*kef[turnir_sum-1]*100)/100;
    }
    final_res.sort((a,b)=> b.final_sum - a.final_sum);
    
    const table = document.createElement('table');
    table.className = 'supertable';
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const players_column_width = (width - 50) / 12;
    const header = ['№','FFC','Sum','En','Ru','Es','De','It','Fr','Ship','Nl','Tr','Pt']
    for (let i=0; i<=final_res.length+1; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<=12; j+=1) {
            const td = tr.insertCell();
            if (i===0) {
                td.appendChild(document.createTextNode(`${header[j]}`));
                td.className = 'maincell';
            }
            if (i===1 && j>2) {
                td.innerHTML = `<input type="checkbox" id="${header[j]}_mark" name="${header[j]}_mark" ${knyazev_checked[j-3]}>`
                td.addEventListener('click',(e)=>{
                    e.preventDefault();
                    if(e.target.children[0]){
                        if(e.target.children[0].checked) {
                            e.target.children[0].checked=false;
                            knyazev_checked[j-3]="unchecked";
                        } else {
                            e.target.children[0].checked=true;
                            knyazev_checked[j-3]="checked";
                        }
                    } else {
                        if(knyazev_checked[j-3]=="checked") {
                            e.target.checked=false;
                            knyazev_checked[j-3]="unchecked";
                        } else {
                            e.target.checked=true;
                            knyazev_checked[j-3]="checked";
                        }
                    } 
                    setTimeout(()=>{openKnyazev()},100);
                });
                td.className = 'maincell';
            }
            if (j===0 && i>1) {
                td.className = 'ordercell';
                td.appendChild(document.createTextNode(`${i-1}`))
            } else {
                if (i!==0) td.className = 'supercell';
                td.style.width = (j===1)? `${players_column_width*2.5}px`:  `${players_column_width*0.7}px`;
                if (j===1 && i>1) {
                    td.className = 'supercell maincell';
                    td.appendChild(document.createTextNode(`${final_res[i-2].team=='4-4-2002'?'4-4-2':final_res[i-2].team}`))
                } else if (j===2 && i>1) {
                    td.className = 'supercell maincell';
                    td.appendChild(document.createTextNode(`${final_res[i-2].final_sum}`))
                } else if (j===3 && i>1) {
                    if (final_res[i-2].en_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].en_div}">${final_res[i-2].en_div}</div><p class="points">${Math.round(final_res[i-2].en_points*10)/10}</p><p class="small">Место: ${final_res[i-2].en_pos}</p></div>`
                    if(knyazev_checked[0]!='checked') td.className = 'supercell negative';
                } else if (j===4 && i>1) {
                    if (final_res[i-2].ru_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].ru_div}">${final_res[i-2].ru_div}</div><p class="points">${Math.round(final_res[i-2].ru_points*10)/10}</p><p class="small">Место: ${final_res[i-2].ru_pos}</p></div>`
                    if(knyazev_checked[1]!='checked') td.className = 'supercell negative';
                } else if (j===5 && i>1) {
                    if (final_res[i-2].es_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].es_div}">${final_res[i-2].es_div}</div><p class="points">${Math.round(final_res[i-2].es_points*10)/10}</p><p class="small">Место: ${final_res[i-2].es_pos}</p></div>`
                    if(knyazev_checked[2]!='checked') td.className = 'supercell negative';
                } else if (j===6 && i>1) {
                    if (final_res[i-2].de_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].de_div}">${final_res[i-2].de_div}</div><p class="points">${Math.round(final_res[i-2].de_points*10)/10}</p><p class="small">Место: ${final_res[i-2].de_pos}</p></div>`
                    if(knyazev_checked[3]!='checked') td.className = 'supercell negative';
                } else if (j===7 && i>1) {
                    if (final_res[i-2].it_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].it_div}">${final_res[i-2].it_div}</div><p class="points">${Math.round(final_res[i-2].it_points*10)/10}</p><p class="small">Место: ${final_res[i-2].it_pos}</p></div>`
                    if(knyazev_checked[4]!='checked') td.className = 'supercell negative';
                } else if (j===8 && i>1) {
                    if (final_res[i-2].fr_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].fr_div}">${final_res[i-2].fr_div}</div><p class="points">${Math.round(final_res[i-2].fr_points*10)/10}</p><p class="small">Место: ${final_res[i-2].fr_pos}</p></div>`
                    if(knyazev_checked[5]!='checked') td.className = 'supercell negative';
                } else if (j===9 && i>1) {
                    if (final_res[i-2].ship_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].ship_div}">${final_res[i-2].ship_div}</div><p class="points">${Math.round(final_res[i-2].ship_points*10)/10}</p><p class="small">Место: ${final_res[i-2].ship_pos}</p></div>`
                    if(knyazev_checked[6]!='checked') td.className = 'supercell negative';
                } else if (j===10 && i>1) {
                    if (final_res[i-2].nl_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].nl_div}">${final_res[i-2].nl_div}</div><p class="points">${Math.round(final_res[i-2].nl_points*10)/10}</p><p class="small">Место: ${final_res[i-2].nl_pos}</p></div>`
                    if(knyazev_checked[7]!='checked') td.className = 'supercell negative';
                } else if (j===11 && i>1) {
                    if (final_res[i-2].tr_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].tr_div}">${final_res[i-2].tr_div}</div><p class="points">${Math.round(final_res[i-2].tr_points*10)/10}</p><p class="small">Место: ${final_res[i-2].tr_pos}</p></div>`
                    if(knyazev_checked[8]!='checked') td.className = 'supercell negative';
                } else if (j===12 && i>1) {
                    if (final_res[i-2].pt_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res[i-2].pt_div}">${final_res[i-2].pt_div}</div><p class="points">${Math.round(final_res[i-2].pt_points*10)/10}</p><p class="small">Место: ${final_res[i-2].pt_pos}</p></div>`
                    if(knyazev_checked[9]!='checked') td.className = 'supercell negative';
                }
            };
        }
    }
    document.getElementById('knyazev').appendChild(table);
}
