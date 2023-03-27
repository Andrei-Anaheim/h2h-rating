const menu_ratings = document.getElementById('menu_ratings').children;
const menu_dates = document.getElementById('menu_dates').children;
for (let i=1; i<menu_ratings.length; i+=1) {
    menu_ratings[i].addEventListener('click', ()=>{changeMenu(i)})
}
for (let i=0; i<menu_dates.length; i+=1) {
    menu_dates[i].addEventListener('click', ()=>{changeDates(i)})
}

document.getElementById('home_menu').addEventListener('click', ()=>{document.getElementById('menu_dates').classList.add('hide')})
document.getElementById('anaheim_card').addEventListener('click', ()=>{changeMenu(2)});
document.getElementById('knyazev_card').addEventListener('click', ()=>{changeMenu(5)});
document.getElementById('anisimov_card').addEventListener('click', ()=>{changeMenu(3)});
document.getElementById('elo_card').addEventListener('click', ()=>{changeMenu(4)});
document.getElementById('EGF_card').addEventListener('click', ()=>{changeMenu(2)});
document.getElementById('procent_card').addEventListener('click', ()=>{changeMenu(4)});
document.getElementById('trophy_card').addEventListener('click', ()=>{changeMenu(9)});
document.getElementById('history_card').addEventListener('click', ()=>{changeMenu(7)});
document.getElementById('svodka_card').addEventListener('click', ()=>{changeMenu(6)});
document.getElementById('record_card').addEventListener('click', ()=>{changeMenu(8)});

function changeMenu(j) {
    for(let i=1; i<menu_ratings.length-1; i+=1) {
        document.getElementById('menu_dates').classList.remove('hide');
        if (i===j) {
            menu_ratings[i].classList.add('selected');
            document.getElementById(`rating_block_${i}`).classList.remove('hide');
        } else {
            menu_ratings[i].classList.remove('selected');
            document.getElementById(`rating_block_${i}`).classList.add('hide');
        }
    }
    if(j==2) openAnaheimPlus();
    else if(j==3) openAnisimov();
    else if(j==4) openElo();
    else if(j==5) openKnyazev();
    else if(j==6) openSvodka();
    else if(j==7) openHistory();
    else if(j==8) openRecords();
    else if(j==9) openTrophy();

}

function changeDates(j) {
    for(let i=0; i<menu_dates.length; i+=1) {
        if (i===j) {
            menu_dates[i].classList.add('selected');
        } else {
            menu_dates[i].classList.remove('selected');
        }
    }
    if (menu_ratings[0].classList=='nav_item selected') {
        changeMenu(0); 
        document.getElementById('menu_dates').classList.add('hide');
    } else if (menu_ratings[1].classList=='nav_item selected') {changeMenu(1)}
    else if (menu_ratings[2].classList=='nav_item selected') {changeMenu(2)}
    else if (menu_ratings[3].classList=='nav_item selected') {changeMenu(3)}
    else if (menu_ratings[4].classList=='nav_item selected') {changeMenu(4)}
    else if (menu_ratings[5].classList=='nav_item selected') {changeMenu(5)}
    else if (menu_ratings[6].classList=='nav_item selected') {changeMenu(6)}
    else if (menu_ratings[7].classList=='nav_item selected') {changeMenu(7)}
    else if (menu_ratings[8].classList=='nav_item selected') {changeMenu(8)}
}
window.onload = showButtons();
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
        for (let i=0; i<turnir.length; i+=1) {
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
    .then(rep=>{
        document.getElementById('knyazev_menu').classList.remove('inactive');
    })
}
const knyazev_checked = ['checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked'];
let knyazev_sorting_status = [0];
function openKnyazev() {
    document.getElementById('knyazev').innerHTML="";
    let final_res_date_filter=[];
    let date_filter = '';
    let default_header = ['№','FFC','Sum','En','Ru','Es','De','It','Fr','Ship','Nl','Tr','Pt','MxA','MxK','SK'];
    let diff_tournaments = ['MxA', 'MxK', 'SK'];
    if (menu_dates[0].classList=='nav_item2 selected') {
        final_res_date_filter = Array.from(final_res)
        drawKnyazevTable(final_res_date_filter, default_header, diff_tournaments);
    } else {
        if (menu_dates[1].classList=='nav_item2 selected') {date_filter = "21_22"}
        else if (menu_dates[2].classList=='nav_item2 selected') {date_filter = "20_21"}
        else if (menu_dates[3].classList=='nav_item2 selected') {date_filter = "19_20"}
        else if (menu_dates[4].classList=='nav_item2 selected') {date_filter = "18_19"}
        else if (menu_dates[5].classList=='nav_item2 selected') {date_filter = "17_18"}
        else if (menu_dates[6].classList=='nav_item2 selected') {date_filter = "16_17"; diff_tournaments = ['SK'];}
        fetch(`archive${date_filter}.json`)
        .then(res => res.json())
        .then(data => {
            final_res_date_filter = Array.from(data.knyazev);
            drawKnyazevTable(final_res_date_filter, default_header, diff_tournaments);
        })
    }
}


function drawKnyazevTable(final_res_date_filter, default_header, diff_tournaments) {
    for (let x=0; x<final_res_date_filter.length; x+=1) {
        let turnir_sum = 0;
        let total_point = 0;
        if (final_res_date_filter[x].en_pos && final_res_date_filter[x].en_pos !=  "-" && knyazev_checked[0]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].en_points);}
        if (final_res_date_filter[x].ru_pos && final_res_date_filter[x].ru_pos !=  "-" && knyazev_checked[1]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].ru_points);}
        if (final_res_date_filter[x].es_pos && final_res_date_filter[x].es_pos !=  "-" && knyazev_checked[2]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].es_points);}
        if (final_res_date_filter[x].de_pos && final_res_date_filter[x].de_pos !=  "-" && knyazev_checked[3]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].de_points);}
        if (final_res_date_filter[x].it_pos && final_res_date_filter[x].it_pos !=  "-" && knyazev_checked[4]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].it_points);}
        if (final_res_date_filter[x].fr_pos && final_res_date_filter[x].fr_pos !=  "-" && knyazev_checked[5]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].fr_points);}
        if (final_res_date_filter[x].ship_pos && final_res_date_filter[x].ship_pos !=  "-" && knyazev_checked[6]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].ship_points);}
        if (final_res_date_filter[x].nl_pos && final_res_date_filter[x].nl_pos !=  "-" && knyazev_checked[7]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].nl_points);}
        if (final_res_date_filter[x].tr_pos && final_res_date_filter[x].tr_pos !=  "-" && knyazev_checked[8]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].tr_points);}
        if (final_res_date_filter[x].pt_pos && final_res_date_filter[x].pt_pos !=  "-" && knyazev_checked[9]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].pt_points);}
        if (final_res_date_filter[x].mxa_pos && final_res_date_filter[x].mxa_pos !=  "-" && knyazev_checked[10]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].mxa_points);}
        if (final_res_date_filter[x].mxk_pos && final_res_date_filter[x].mxk_pos !=  "-" && knyazev_checked[11]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].mxk_points);}
        if (final_res_date_filter[x].sk_pos && final_res_date_filter[x].sk_pos !=  "-" && knyazev_checked[12]=="checked") {turnir_sum += 1; total_point += Number(final_res_date_filter[x].sk_points);}
        final_res_date_filter[x].sum = total_point;
        final_res_date_filter[x].active_turnir = turnir_sum;
        const kef = [0.6,0.6,1,1,1,1,1,1,1,1,1,1,1];
        final_res_date_filter[x].final_sum = Math.round((total_point/turnir_sum)*(1+turnir_sum/100)*kef[turnir_sum-1]*100)/100;
    }
    if (knyazev_sorting_status[0] == 0) final_res_date_filter.sort((a,b)=> b.final_sum - a.final_sum);
    if (knyazev_sorting_status[0] == 1) final_res_date_filter.sort((a,b)=> b.en_points - a.en_points);
    if (knyazev_sorting_status[0] == 2) final_res_date_filter.sort((a,b)=> b.ru_points - a.ru_points);
    if (knyazev_sorting_status[0] == 3) final_res_date_filter.sort((a,b)=> b.es_points - a.es_points);
    if (knyazev_sorting_status[0] == 4) final_res_date_filter.sort((a,b)=> b.de_points - a.de_points);
    if (knyazev_sorting_status[0] == 5) final_res_date_filter.sort((a,b)=> b.it_points - a.it_points);
    if (knyazev_sorting_status[0] == 6) final_res_date_filter.sort((a,b)=> b.fr_points - a.fr_points);
    if (knyazev_sorting_status[0] == 7) final_res_date_filter.sort((a,b)=> b.ship_points - a.ship_points);
    if (knyazev_sorting_status[0] == 8) final_res_date_filter.sort((a,b)=> b.nl_points - a.nl_points);
    if (knyazev_sorting_status[0] == 9) final_res_date_filter.sort((a,b)=> b.tr_points - a.tr_points);
    if (knyazev_sorting_status[0] == 10) final_res_date_filter.sort((a,b)=> b.pt_points - a.pt_points);
    if (knyazev_sorting_status[0] == 11) final_res_date_filter.sort((a,b)=> b.mxa_points - a.mxa_points);
    if (knyazev_sorting_status[0] == 12) final_res_date_filter.sort((a,b)=> b.mxk_points - a.mxk_points);
    if (knyazev_sorting_status[0] == 13) final_res_date_filter.sort((a,b)=> b.sk_points - a.sk_points);

    const table = document.createElement('table');
    table.className = 'supertable';
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const players_column_width = (width - 50) / 13;
    const header = Array.from(default_header)
    for (let i=0; i<=final_res_date_filter.length+1; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<default_header.length; j+=1) {
            const td = tr.insertCell();
            if (i===0) {
                if (j<=1) {
                    td.appendChild(document.createTextNode(`${header[j]}`));
                    td.className = 'maincell';
                } else if(j>1) {
                    td.addEventListener('click', (e)=>{
                        knyazev_sorting_status[0]=j-2;
                        openKnyazev();
                    })
                    if (j == knyazev_sorting_status[0]+2 && diff_tournaments.indexOf(header[j]) == -1) {
                        td.className = 'maincell clickable sorted';
                        td.innerText = `${header[j]} ↓`
                    } else if (diff_tournaments.indexOf(header[j]) == -1){
                        td.className = 'maincell clickable';
                        td.innerText = `${header[j]}`
                    } else {
                        td.className = 'hide';
                    }
                }
                  
            }
            if (i===1 && j>2) {
                if(diff_tournaments.indexOf(header[j]) == -1){
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
                } else {
                    td.className = 'hide';
                }
            }
            if (j===0 && i>1) {
                td.className = 'ordercell';
                td.appendChild(document.createTextNode(`${i-1}`))
            } else {
                if (i!==0) {
                    td.className = 'supercell'; td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'supercell': 'hide';
                }
                td.style.width = (j===1)? `${players_column_width*2.5}px`:  `${players_column_width*0.7}px`;
                if (j===1 && i>1) {
                    td.className = 'supercell maincell';
                    td.appendChild(document.createTextNode(`${final_res_date_filter[i-2].team=='4-4-2002'?'4-4-2':final_res_date_filter[i-2].team}`))
                } else if (j===2 && i>1) {
                    td.className = 'supercell maincell';
                    td.appendChild(document.createTextNode(`${Number(final_res_date_filter[i-2].final_sum).toLocaleString('en-US', { minimumFractionDigits: 2 })}`))
                } else if (j===3 && i>1) {
                    if (final_res_date_filter[i-2].en_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].en_div}">${final_res_date_filter[i-2].en_div}</div><p class="points">${Math.round(Number(final_res_date_filter[i-2].en_points)*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].en_pos}</p></div>`
                    if(knyazev_checked[0]!='checked') td.className = 'supercell negative';
                } else if (j===4 && i>1) {
                    if (final_res_date_filter[i-2].ru_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].ru_div}">${final_res_date_filter[i-2].ru_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].ru_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].ru_pos}</p></div>`
                    if(knyazev_checked[1]!='checked') td.className = 'supercell negative';
                } else if (j===5 && i>1) {
                    if (final_res_date_filter[i-2].es_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].es_div}">${final_res_date_filter[i-2].es_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].es_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].es_pos}</p></div>`
                    if(knyazev_checked[2]!='checked') td.className = 'supercell negative';
                } else if (j===6 && i>1) {
                    if (final_res_date_filter[i-2].de_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].de_div}">${final_res_date_filter[i-2].de_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].de_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].de_pos}</p></div>`
                    if(knyazev_checked[3]!='checked') td.className = 'supercell negative';
                } else if (j===7 && i>1) {
                    if (final_res_date_filter[i-2].it_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].it_div}">${final_res_date_filter[i-2].it_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].it_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].it_pos}</p></div>`
                    if(knyazev_checked[4]!='checked') td.className = 'supercell negative';
                } else if (j===8 && i>1) {
                    if (final_res_date_filter[i-2].fr_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].fr_div}">${final_res_date_filter[i-2].fr_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].fr_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].fr_pos}</p></div>`
                    if(knyazev_checked[5]!='checked') td.className = 'supercell negative';
                } else if (j===9 && i>1) {
                    if (final_res_date_filter[i-2].ship_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].ship_div}">${final_res_date_filter[i-2].ship_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].ship_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].ship_pos}</p></div>`
                    if(knyazev_checked[6]!='checked') td.className = 'supercell negative';
                } else if (j===10 && i>1) {
                    if (final_res_date_filter[i-2].nl_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].nl_div}">${final_res_date_filter[i-2].nl_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].nl_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].nl_pos}</p></div>`
                    if(knyazev_checked[7]!='checked') td.className = 'supercell negative';
                } else if (j===11 && i>1) {
                    if (final_res_date_filter[i-2].tr_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].tr_div}">${final_res_date_filter[i-2].tr_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].tr_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].tr_pos}</p></div>`
                    if(knyazev_checked[8]!='checked') td.className = 'supercell negative';
                } else if (j===12 && i>1) {
                    if (final_res_date_filter[i-2].pt_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].pt_div}">${final_res_date_filter[i-2].pt_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].pt_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].pt_pos}</p></div>`
                    if(knyazev_checked[9]!='checked') td.className = 'supercell negative';
                } else if (j===13 && i>1) {
                    if (final_res_date_filter[i-2].mxa_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].mxa_div}">${final_res_date_filter[i-2].mxa_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].mxa_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].mxa_pos}</p></div>`
                    if(knyazev_checked[10]!='checked') td.className = 'supercell negative';
                } else if (j===14 && i>1) {
                    if (final_res_date_filter[i-2].mxk_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].mxk_div}">${final_res_date_filter[i-2].mxk_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].mxk_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].mxk_pos}</p></div>`
                    if(knyazev_checked[11]!='checked') td.className = 'supercell negative';
                } else if (j===14 && i>1) {
                    if (final_res_date_filter[i-2].sk_div=='-') td.innerHTML= `<div class="td_data"><p class="points">-</p></div>`;
                    else td.innerHTML = `<div class="td_data"><div class="div_${final_res_date_filter[i-2].sk_div}">${final_res_date_filter[i-2].sk_div}</div><p class="points">${Math.round(final_res_date_filter[i-2].sk_points*10)/10}</p><p class="small">Место: ${final_res_date_filter[i-2].sk_pos}</p></div>`
                    if(knyazev_checked[12]!='checked') td.className = 'supercell negative';
                }
            };
        }
    }
    document.getElementById('knyazev').appendChild(table);
}


document.getElementById('anisimov_menu').addEventListener('click',openAnisimov);
document.getElementById('anisimov_?').addEventListener('click',showAnisimovInfo);
function showAnisimovInfo() {
    if (document.getElementById('anisimov_info').style.display == 'none') {
        document.getElementById('anisimov_info').style.display = 'block'
        document.getElementById('anisimov_?').style.background = 'pink'
    } else {
        document.getElementById('anisimov_info').style.display = 'none';
        document.getElementById('anisimov_?').style.background = 'lightskyblue'
    }
}

window.onload = loadAnisimov();
let anisimov = [];

function loadAnisimov() {
    fetch('https://script.google.com/macros/s/AKfycbz7UbKGINKjYqgXtzQdsSAImgPaT46sXVa2psx9forjrPSeh7rCFHaw_I0XdO0oJNhQtw/exec')
    .then(res => res.text())
    .then(rep => {
        anisimov = JSON.parse(rep);
    })
    .then(rep=>{
        document.getElementById('anisimov_menu').classList.remove('inactive');
    })    
}
const anisimov_res=[]
const anisimov_sorting_status = [0];
const anisimov_checked = ['checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked'];
function openAnisimov() {
    document.getElementById('anisimov').innerHTML="";
    let default_header = ['№','FFC','Sum','Last','En','Ru','Es','De','It','Fr','Ship','Nl','Tr','Pt','MxA','MxK','SK','UCL','UEL']
    let diff_tournaments = ['MxA', 'MxK', 'SK'];
    if (menu_dates[0].classList=='nav_item2 selected') {
        for (let x=0; x<anisimov[0].length; x+=1) {
            anisimov_res[x]={};
            let total_sum = 0;
            let last_sum = 0;
            
            anisimov_res[x].en_total = Number(anisimov[0][x][1]);
            anisimov_res[x].en_last = Number(anisimov[0][x][2]);
            anisimov_res[x].ru_total = Number(anisimov[1][x][1]);
            anisimov_res[x].ru_last = Number(anisimov[1][x][2]);
            anisimov_res[x].es_total = Number(anisimov[2][x][1]);
            anisimov_res[x].es_last = Number(anisimov[2][x][2]);
            anisimov_res[x].de_total = Number(anisimov[3][x][1]);
            anisimov_res[x].de_last = Number(anisimov[3][x][2]);
            anisimov_res[x].it_total = Number(anisimov[4][x][1]);
            anisimov_res[x].it_last = Number(anisimov[4][x][2]);
            anisimov_res[x].fr_total = Number(anisimov[5][x][1]);
            anisimov_res[x].fr_last = Number(anisimov[5][x][2]);
            anisimov_res[x].ship_total = Number(anisimov[6][x][1]);
            anisimov_res[x].ship_last = Number(anisimov[6][x][2]);
            anisimov_res[x].nl_total = Number(anisimov[7][x][1]);
            anisimov_res[x].nl_last = Number(anisimov[7][x][2]);
            anisimov_res[x].tr_total = Number(anisimov[8][x][1]);
            anisimov_res[x].tr_last = Number(anisimov[8][x][2]);
            anisimov_res[x].pt_total = Number(anisimov[9][x][1]);
            anisimov_res[x].pt_last = Number(anisimov[9][x][2]);
            anisimov_res[x].ucl_total = Number(anisimov[10][x][1])+Number(anisimov[11][x][1]);
            anisimov_res[x].ucl_last = Number(anisimov[10][x][2])+Number(anisimov[11][x][2]);
            anisimov_res[x].uel_total = Number(anisimov[12][x][1])+Number(anisimov[13][x][1]);
            anisimov_res[x].uel_last = Number(anisimov[12][x][2])+Number(anisimov[13][x][2]);
    
            if (anisimov_checked[0]=="checked") {total_sum += Number(anisimov_res[x].en_total); last_sum += Number(anisimov_res[x].en_last)}
            if (anisimov_checked[1]=="checked") {total_sum += Number(anisimov_res[x].ru_total); last_sum += Number(anisimov_res[x].ru_last)}
            if (anisimov_checked[2]=="checked") {total_sum += Number(anisimov_res[x].es_total); last_sum += Number(anisimov_res[x].es_last)}
            if (anisimov_checked[3]=="checked") {total_sum += Number(anisimov_res[x].de_total); last_sum += Number(anisimov_res[x].de_last)}
            if (anisimov_checked[4]=="checked") {total_sum += Number(anisimov_res[x].it_total); last_sum += Number(anisimov_res[x].it_last)}
            if (anisimov_checked[5]=="checked") {total_sum += Number(anisimov_res[x].fr_total); last_sum += Number(anisimov_res[x].fr_last)}
            if (anisimov_checked[6]=="checked") {total_sum += Number(anisimov_res[x].ship_total); last_sum += Number(anisimov_res[x].ship_last)}
            if (anisimov_checked[7]=="checked") {total_sum += Number(anisimov_res[x].nl_total); last_sum += Number(anisimov_res[x].nl_last)}
            if (anisimov_checked[8]=="checked") {total_sum += Number(anisimov_res[x].tr_total); last_sum += Number(anisimov_res[x].tr_last)}
            if (anisimov_checked[9]=="checked") {total_sum += Number(anisimov_res[x].pt_total); last_sum += Number(anisimov_res[x].pt_last)}
            if (anisimov_checked[13]=="checked") {total_sum += (Number(anisimov_res[x].ucl_total)); last_sum += (Number(anisimov_res[x].ucl_last))}
            if (anisimov_checked[14]=="checked") {total_sum += (Number(anisimov_res[x].uel_total)); last_sum += (Number(anisimov_res[x].uel_last))}
            
            anisimov_res[x].team = anisimov[0][x][0];
            anisimov_res[x].index = x;
            anisimov_res[x].sum = total_sum;
            anisimov_res[x].last = last_sum;
        }
        drawAnisimovTable(anisimov_res,default_header, diff_tournaments);
    } else {
        if (menu_dates[1].classList=='nav_item2 selected') {date_filter = "21_22"}
        else if (menu_dates[2].classList=='nav_item2 selected') {date_filter = "20_21"}
        else if (menu_dates[3].classList=='nav_item2 selected') {date_filter = "19_20"}
        else if (menu_dates[4].classList=='nav_item2 selected') {date_filter = "18_19"}
        else if (menu_dates[5].classList=='nav_item2 selected') {date_filter = "17_18"}
        else if (menu_dates[6].classList=='nav_item2 selected') {date_filter = "16_17"; diff_tournaments = ['SK','UCL','UEL'];}
        fetch(`archive${date_filter}.json`)
        .then(res => res.json())
        .then(data => {
            let anisimov_res = Array.from(data.anisimov);
            for (let x=0; x<anisimov_res.length; x+=1) {
            let total_sum = 0;
            let last_sum = 0;
            if (anisimov_checked[0]=="checked" && anisimov_res[x].en_total) {total_sum += Number(anisimov_res[x].en_total); last_sum += Number(anisimov_res[x].en_total)}
            if (anisimov_checked[1]=="checked" && anisimov_res[x].ru_total) {total_sum += Number(anisimov_res[x].ru_total); last_sum += Number(anisimov_res[x].ru_total)}
            if (anisimov_checked[2]=="checked" && anisimov_res[x].es_total) {total_sum += Number(anisimov_res[x].es_total); last_sum += Number(anisimov_res[x].es_total)}
            if (anisimov_checked[3]=="checked" && anisimov_res[x].de_total) {total_sum += Number(anisimov_res[x].de_total); last_sum += Number(anisimov_res[x].de_total)}
            if (anisimov_checked[4]=="checked" && anisimov_res[x].it_total) {total_sum += Number(anisimov_res[x].it_total); last_sum += Number(anisimov_res[x].it_total)}
            if (anisimov_checked[5]=="checked" && anisimov_res[x].fr_total) {total_sum += Number(anisimov_res[x].fr_total); last_sum += Number(anisimov_res[x].fr_total)}
            if (anisimov_checked[6]=="checked" && anisimov_res[x].ship_total) {total_sum += Number(anisimov_res[x].ship_total); last_sum += Number(anisimov_res[x].ship_total)}
            if (anisimov_checked[7]=="checked" && anisimov_res[x].nl_total) {total_sum += Number(anisimov_res[x].nl_total); last_sum += Number(anisimov_res[x].nl_total)}
            if (anisimov_checked[8]=="checked" && anisimov_res[x].tr_total) {total_sum += Number(anisimov_res[x].tr_total); last_sum += Number(anisimov_res[x].tr_total)}
            if (anisimov_checked[9]=="checked" && anisimov_res[x].pt_total) {total_sum += Number(anisimov_res[x].pt_total); last_sum += Number(anisimov_res[x].pt_total)}
            if (anisimov_checked[10]=="checked" && anisimov_res[x].mxa_total) {total_sum += (Number(anisimov_res[x].mxa_total)); last_sum += (Number(anisimov_res[x].mxa_total))}
            if (anisimov_checked[11]=="checked" && anisimov_res[x].mxk_total) {total_sum += (Number(anisimov_res[x].mxk_total)); last_sum += (Number(anisimov_res[x].mxk_total))}
            if (anisimov_checked[12]=="checked" && anisimov_res[x].sk_total) {total_sum += (Number(anisimov_res[x].sk_total)); last_sum += (Number(anisimov_res[x].sk_total))}
            if (anisimov_checked[13]=="checked" && anisimov_res[x].ucl_total) {total_sum += (Number(anisimov_res[x].ucl_total)); last_sum += (Number(anisimov_res[x].ucl_total))}
            if (anisimov_checked[14]=="checked" && anisimov_res[x].uel_total) {total_sum += (Number(anisimov_res[x].uel_total)); last_sum += (Number(anisimov_res[x].uel_total))}
            
            anisimov_res[x].index = x;
            anisimov_res[x].sum = total_sum;
            anisimov_res[x].last = last_sum;
            }
            drawAnisimovTable(anisimov_res, default_header, diff_tournaments);
        })
    }
}
function drawAnisimovTable(anisimov_res, default_header, diff_tournaments) {
    
    if (anisimov_sorting_status[0] == 0) anisimov_res.sort((a,b)=> b.sum - a.sum);
    if (anisimov_sorting_status[0] == 1) anisimov_res.sort((a,b)=> b.last - a.last);
    if (anisimov_sorting_status[0] == 2) anisimov_res.sort((a,b)=> b.en_total - a.en_total);
    if (anisimov_sorting_status[0] == 3) anisimov_res.sort((a,b)=> b.ru_total - a.ru_total);
    if (anisimov_sorting_status[0] == 4) anisimov_res.sort((a,b)=> b.es_total - a.es_total);
    if (anisimov_sorting_status[0] == 5) anisimov_res.sort((a,b)=> b.de_total - a.de_total);
    if (anisimov_sorting_status[0] == 6) anisimov_res.sort((a,b)=> b.it_total - a.it_total);
    if (anisimov_sorting_status[0] == 7) anisimov_res.sort((a,b)=> b.fr_total - a.fr_total);
    if (anisimov_sorting_status[0] == 8) anisimov_res.sort((a,b)=> b.ship_total - a.ship_total);
    if (anisimov_sorting_status[0] == 9) anisimov_res.sort((a,b)=> b.nl_total - a.nl_total);
    if (anisimov_sorting_status[0] == 10) anisimov_res.sort((a,b)=> b.tr_total - a.tr_total);
    if (anisimov_sorting_status[0] == 11) anisimov_res.sort((a,b)=> b.pt_total - a.pt_total);
    if (anisimov_sorting_status[0] == 12) anisimov_res.sort((a,b)=> b.mxa_total - a.mxa_total);
    if (anisimov_sorting_status[0] == 13) anisimov_res.sort((a,b)=> b.mxk_total - a.mxk_total);
    if (anisimov_sorting_status[0] == 14) anisimov_res.sort((a,b)=> b.sk_total - a.sk_total);
    if (anisimov_sorting_status[0] == 15) anisimov_res.sort((a,b)=> b.ucl_total - a.ucl_total);
    if (anisimov_sorting_status[0] == 16) anisimov_res.sort((a,b)=> b.uel_total - a.uel_total);
    
    const table = document.createElement('table');
    table.className = 'supertable';
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const players_column_width = (width - 50) / 15;
    // const header = ['№','FFC','Sum','Last','En','Ru','Es','De','It','Fr','Ship','Nl','Tr','Pt','UCL','UEL']
    const header = Array.from(default_header);
    for (let i=0; i<=anisimov_res.length+1; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<header.length; j+=1) {
            const td = tr.insertCell();
            if (i===0) {
                if (j<=1) {
                    td.appendChild(document.createTextNode(`${header[j]}`));
                    td.className = 'maincell';
                } else if(j>1) {
                    td.addEventListener('click', (e)=>{
                        anisimov_sorting_status[0]=j-2;
                        openAnisimov();
                    })
                    if (j == anisimov_sorting_status[0]+2 && diff_tournaments.indexOf(header[j]) == -1) {
                        td.className = 'maincell clickable sorted';
                        td.innerText = `${header[j]} ↓`
                    } else if (diff_tournaments.indexOf(header[j]) == -1){
                        td.className = 'maincell clickable';
                        td.innerText = `${header[j]}`
                    } else {
                        td.className = 'hide';
                    }
                }
            }
            if (i===1 && j>3) {
                td.innerHTML = `<input type="checkbox" id="${header[j]}_mark2" name="${header[j]}_mark2" ${anisimov_checked[j-4]}>`
                td.addEventListener('click',(e)=>{
                    e.preventDefault();
                    if(e.target.children[0]){
                        if(e.target.children[0].checked) {
                            e.target.children[0].checked=false;
                            anisimov_checked[j-4]="unchecked";
                        } else {
                            e.target.children[0].checked=true;
                            anisimov_checked[j-4]="checked";
                        }
                    } else {
                        if(anisimov_checked[j-4]=="checked") {
                            e.target.checked=false;
                            anisimov_checked[j-4]="unchecked";
                        } else {
                            e.target.checked=true;
                            anisimov_checked[j-4]="checked";
                        }
                    } 
                    setTimeout(()=>{openAnisimov()},100);
                });
                td.className = 'maincell';
            }
            if (j===0 && i>1) {
                td.className = 'ordercell';
                td.appendChild(document.createTextNode(`${i-1}`))
            } else {
                if (i!==0) {
                    td.className = 'supercell'; td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'supercell': 'hide';
                }
                td.style.width = (j===1)? `${players_column_width*3}px`:  `${players_column_width*0.7}px`;
                if (j===1 && i>1) {
                    td.className = 'supercell maincell';
                    td.appendChild(document.createTextNode(`${anisimov_res[i-2].team=='4-4-2002'?'4-4-2':anisimov_res[i-2].team.replace(/(&quot\;)/g,"\"").replace(/(&#039\;)/g,"\'")}`))
                } else if (j===2 && i>1) {
                    td.className = 'supercell maincell';
                    td.appendChild(document.createTextNode(`${anisimov_res[i-2].sum}`))
                } else if (j===3 && i>1) {
                    td.className = 'supercell maincell';
                    td.appendChild(document.createTextNode(`${anisimov_res[i-2].last}`))
                } else if (j===4 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].en_total)?Number(anisimov_res[i-2].en_total):'-')}`;
                    if(anisimov_checked[0]!='checked') td.className = 'supercell negative';
                } else if (j===5 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].ru_total)?Number(anisimov_res[i-2].ru_total):'-')}`;
                    if(anisimov_checked[1]!='checked') td.className = 'supercell negative';
                } else if (j===6 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].es_total)?Number(anisimov_res[i-2].es_total):'-')}`;
                    if(anisimov_checked[2]!='checked') td.className = 'supercell negative';
                } else if (j===7 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].de_total)?Number(anisimov_res[i-2].de_total):'-')}`;
                    if(anisimov_checked[3]!='checked') td.className = 'supercell negative';
                } else if (j===8 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].it_total)?Number(anisimov_res[i-2].it_total):'-')}`;
                    if(anisimov_checked[4]!='checked') td.className = 'supercell negative';
                } else if (j===9 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].fr_total)?Number(anisimov_res[i-2].fr_total):'-')}`;
                    if(anisimov_checked[5]!='checked') td.className = 'supercell negative';
                } else if (j===10 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].ship_total)?Number(anisimov_res[i-2].ship_total):'-')}`;
                    if(anisimov_checked[6]!='checked') td.className = 'supercell negative';
                } else if (j===11 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].nl_total)?Number(anisimov_res[i-2].nl_total):'-')}`;
                    if(anisimov_checked[7]!='checked') td.className = 'supercell negative';
                } else if (j===12 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].tr_total)?Number(anisimov_res[i-2].tr_total):'-')}`;
                    if(anisimov_checked[8]!='checked') td.className = 'supercell negative';
                } else if (j===13 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].pt_total)?Number(anisimov_res[i-2].pt_total): '-')}`;
                    if(anisimov_checked[9]!='checked') td.className = 'supercell negative';
                } else if (j===14 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].mxa_total)?Number(anisimov_res[i-2].mxa_total): '-')}`;
                    if(anisimov_checked[10]!='checked') td.className = 'supercell negative';
                } else if (j===15 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].mxk_total)?Number(anisimov_res[i-2].mxk_total): '-')}`;
                    if(anisimov_checked[11]!='checked') td.className = 'supercell negative';
                } else if (j===16 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].sk_total)?Number(anisimov_res[i-2].sk_total): '-')}`;
                    if(anisimov_checked[12]!='checked') td.className = 'supercell negative';
                } else if (j===17 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].ucl_total)?Number(anisimov_res[i-2].ucl_total):'-')}`;
                    if(anisimov_checked[13]!='checked') td.className = 'supercell negative';
                } else if (j===18 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].uel_total)? Number(anisimov_res[i-2].uel_total) : '-')}`;
                    if(anisimov_checked[14]!='checked') td.className = 'supercell negative';
                }
            };
        }
    }
    document.getElementById('anisimov').appendChild(table);
}

document.getElementById('elo_menu').addEventListener('click',openElo);
function openElo() {
    document.getElementById('elo_table').classList.remove('hide');
    document.getElementById('elo').innerHTML=`<div><button class="header_text" id="toggle">Показать/скрыть все</button><button class="header_text" id="top5">Топ5</button><canvas id="myChart"></canvas></div>`;
    if (menu_dates[0].classList=='nav_item2 selected') {
        document.getElementById('elo_table').innerText = 'Данные рейтинга Эло доступны только для завершенных сезонов. Выберите другой сезон.';
    } else {
        if (menu_dates[1].classList=='nav_item2 selected') {date_filter = "21_22"}
        else if (menu_dates[2].classList=='nav_item2 selected') {date_filter = "20_21"}
        else if (menu_dates[3].classList=='nav_item2 selected') {date_filter = "19_20"}
        else if (menu_dates[4].classList=='nav_item2 selected') {date_filter = "18_19"}
        else if (menu_dates[5].classList=='nav_item2 selected') {date_filter = "17_18"}
        else if (menu_dates[6].classList=='nav_item2 selected') {date_filter = "16_17"}
        fetch(`archive${date_filter}.json`)
        .then(res => res.json())
        .then(data => {
            let elo_labels = Array.from(data.elo_distance[0].date);
            let elo_data = data.elo_distance.slice(1,data.elo_distance.length);
            let wtl_data = data.elo;
            setTimeout(()=>{
                buildGraphElo(elo_labels, elo_data);
                buildTableElo(elo_labels, elo_data, wtl_data);
            },100)
        })
    }
}
function buildGraphElo(labels, elo_data) {
    let ctx = document.getElementById('myChart').getContext('2d');
    ctx.canvas.parentNode.style.height = '90vh';
    ctx.canvas.parentNode.style.width = '90vw';
    const new_datasets = [];
    for (let i=1; i<elo_data.length; i+=1) {
        new_datasets.push({
            label: `${elo_data[i].team}`,
            data: elo_data[i].date,
            borderWidth: i<6? 2: 1,
            borderColor: `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`,
            fill: false,
            tension: 0.1,
        })
    }
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: new_datasets
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
        }
    });
    
    document.getElementById("toggle").addEventListener('click',()=>{
        for (let i=0; i<myChart.data.datasets.length ; i+=1) {
            if(myChart.data.datasets[myChart.data.datasets.length-1].hidden) myChart.data.datasets[i].hidden = false;
            else  myChart.data.datasets[i].hidden = true;
        }
        myChart.update();
    });

    document.getElementById("top5").addEventListener('click',()=>{
        for (let i=0; i<myChart.data.datasets.length ; i+=1) {
            if(i<5) myChart.data.datasets[i].hidden = false;
            else  myChart.data.datasets[i].hidden = true;
        }
        myChart.update();
    })
}

document.getElementById("change_elo_type").addEventListener('click',changeEloType);
function changeEloType() {
    if (document.getElementById("change_elo_type").innerText == 'Показать таблицу') {
        document.getElementById("change_elo_type").innerText = 'Показать график';
        document.getElementById("elo").classList.add('hide');
        document.getElementById("elo_table").classList.remove('hide');
    } else {
        document.getElementById("change_elo_type").innerText = 'Показать таблицу';
        document.getElementById("elo").classList.remove('hide');
        document.getElementById("elo_table").classList.add('hide');
    }
}

let elo_sorting_status=[0];
function buildTableElo(elo_labels, elo_data, wtl_data) {
    if (elo_sorting_status[0] == 0) wtl_data.sort((a,b)=> Number(b.elo) - Number(a.elo));
    if (elo_sorting_status[0] == 1) wtl_data.sort((a,b)=> Number(b.elo_start) - Number(a.elo_start));
    if (elo_sorting_status[0] == 2) wtl_data.sort((a,b)=> (Number(b.elo)-Number(b.elo_start)) - (Number(a.elo)-Number(a.elo_start)));
    if (elo_sorting_status[0] == 3) wtl_data.sort((a,b)=> Number(b.win) - Number(a.win));
    if (elo_sorting_status[0] == 4) wtl_data.sort((a,b)=> Number(b.tie) - Number(a.tie));
    if (elo_sorting_status[0] == 5) wtl_data.sort((a,b)=> Number(b.lose) - Number(a.lose));
    if (elo_sorting_status[0] == 6) wtl_data.sort((a,b)=> Number(b.procent) - Number(a.procent));
    document.getElementById('elo_table').innerHTML="";
    const table = document.createElement('table');
    table.className = 'supertable';
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const players_column_width = (width - 50) / 11;
    const header = ['№','FFC','Elo finish','Elo start','+-','W','T','L','%']
    for (let i=0; i<elo_data.length+1; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<header.length; j+=1) {
            const td = tr.insertCell();
            if (i===0) {
                if (j<=1) {
                    td.appendChild(document.createTextNode(`${header[j]}`));
                    td.className = 'maincell';
                } else if(j>1) {
                    td.addEventListener('click', (e)=>{
                        elo_sorting_status[0]=j-2;
                        buildTableElo(elo_labels, elo_data, wtl_data);
                    })
                    if (j == elo_sorting_status[0]+2) {
                        td.className = 'maincell clickable sorted';
                        td.innerText = `${header[j]} ↓`
                    } else {
                        td.className = 'maincell clickable';
                        td.innerText = `${header[j]}`
                    }
                }
            }
            if (j===0 && i>0) {
                td.className = 'ordercell';
                td.appendChild(document.createTextNode(`${i}`))
            } else {
                if (i!==0) td.className = 'supercell';
                td.style.width = (j===1)? `${players_column_width*3}px`:  `${players_column_width*0.7}px`;
                if (j===1 && i>0) {
                    td.className = 'supercell maincell';
                    td.appendChild(document.createTextNode(`${wtl_data[i-1].team=='4-4-2002'?'4-4-2':wtl_data[i-1].team.replace(/(&quot\;)/g,"\"").replace(/(&#039\;)/g,"\'")}`))
                } else if (j===2 && i>0) {
                    td.className = 'supercell maincell';
                    td.appendChild(document.createTextNode(`${(Math.round(Number(wtl_data[i-1].elo)*100)/100).toFixed(2)}`))
                } else if (j===3 && i>0) {
                    td.appendChild(document.createTextNode(`${(Math.round(Number(wtl_data[i-1].elo_start)*100)/100).toFixed(2)}`))
                } else if (j===4 && i>0) {
                    td.innerText= `${(Math.round(Number(wtl_data[i-1].elo)*100)/100 - Math.round(Number(wtl_data[i-1].elo_start)*100)/100).toFixed(2)}`;
                    if (Math.round(Number(wtl_data[i-1].elo)*100)/100 - Math.round(Number(wtl_data[i-1].elo_start)*100)/100 > 0) td.classList.add('green_td');
                    else td.classList.add('red_td');
                } else if (j===5 && i>0) {
                    td.innerText= `${wtl_data[i-1].win}`;
                } else if (j===6 && i>0) {
                    td.innerText= `${wtl_data[i-1].tie}`;
                } else if (j===7 && i>0) {
                    td.innerText= `${wtl_data[i-1].lose}`;
                } else if (j===8 && i>0) {
                    td.innerText= `${(Math.round(Number(wtl_data[i-1].procent)*10000)/100).toFixed(2)} %`;
                }
            };
        }
    }
    document.getElementById('elo_table').appendChild(table);
}


document.getElementById('history_menu').addEventListener('click',openHistory);
let matches1617 = [];
let ffc = [];
let history_type_option = ['full'];
let history_type_procent_option = ['spare'];
function openHistory() {
    document.getElementById('menu_dates').classList.add('hide');
    document.getElementById('history_table').innerHTML=``;
    document.getElementById('history_table_procent').innerHTML=``;
    document.getElementById('select_1').value = 'Выберите Команду №1';
    document.getElementById('select_2').value = 'Выберите Команду №2';
    let select_1 = document.getElementById('select_1');
    let select_2 = document.getElementById('select_2');
    document.getElementById('history_table').classList.add('hide');
    document.getElementById('show_history_type').classList.add('hide');
    document.getElementById('history_table_procent').classList.add('hide');
    document.getElementById('show_history_procent_type').classList.add('hide');
    document.getElementById('history_?').classList.add('hide');
    fetch(`archive16_17.json`)
        .then(res => res.json())
        .then(data => {
            matches1617 = data.matches;
            ffc = data.teams
            for (let i=0; i<ffc.length; i+=1) {
                let option = document.createElement('option');
                option.innerText = ffc[i];
                let option2 = document.createElement('option');
                option2.innerText = ffc[i];
                select_1.appendChild(option);
                select_2.appendChild(option2);
            }
            buildHistoryTable(history_type_option[0],history_type_procent_option[0]);
        })

}

document.getElementById('select_1').addEventListener('change',()=>{buildHistoryTable(history_type_option[0],history_type_procent_option[0]);})
document.getElementById('select_2').addEventListener('change',()=>{buildHistoryTable(history_type_option[0],history_type_procent_option[0]);})
const champs = ['Всего','2016/17', 'ЛЧ', 'ЛЕ', 'Россия чемпионат', 'Россия кубок', 'Голландия чемпионат', 'Голландия кубок', 'Англия чемпионат' ,'Англия кубок', 'Германия чемпионат', 'Германия кубок', 'Испания чемпионат', 'Испания кубок', 'Италия чемпионат', 'Италия кубок', 'Франция чемпионат', 'Франция кубок', 'Чемпионшип чемпионат', 'Чемпионшип кубок', 'Португалия чемпионат', 'Португалия кубок', 'Мексика чемпионат', 'Мексика кубок', 'Турция чемпионат', 'Турция кубок'];
const champs_code = ['all','1617','ucl','uel','ru_ch','ru_cup','nl_ch','nl_cup','en_ch','en_cup','de_ch','de_cup','es_ch','es_cup','it_ch','it_cup','fr_ch','fr_cup','ship_ch','ship_cup','pt_ch','pt_cup','mx_ch','mx_cup','tr_ch','tr_cup'];
function buildHistoryTable(type, type_procent){
    document.getElementById('history_table').innerHTML='';
    document.getElementById('history_table_procent').innerHTML=``;
    let team1 = document.getElementById('select_1').value;
    let team2 = document.getElementById('select_2').value;
    let pair_res = {};
    let tournirs_all = ['Всего'];
    let tournirs_1617 = ['2016/17'];
    if (team1 != "Выберите Команду №1" && team2 != "Выберите Команду №2") {
        document.getElementById('history_table').classList.remove('hide');
        document.getElementById('show_history_type').classList.remove('hide');
        document.getElementById('history_table_procent').classList.remove('hide');
        document.getElementById('show_history_procent_type').classList.remove('hide');
        document.getElementById('history_?').classList.remove('hide');
        let matches_filter_1617 = matches1617.filter((el)=>((el.team1 == team1 &&el.team2==team2) || (el.team1 == team2 &&el.team2==team1)));
        for (let i=0; i<matches_filter_1617.length; i+=1){
            tournirs_1617.push(matches_filter_1617[i].competition);
            tournirs_all.push(matches_filter_1617[i].competition);
            if (matches_filter_1617[i].team1 == team1 && Number(matches_filter_1617[i].diff)>0) {
                pair_res.win1_all = (pair_res.win1_all || 0) + 1; 
                pair_res.win1_1617 = (pair_res.win1_1617 || 0) + 1; 
                pair_res[`win1_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] = (pair_res[`win_1${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] || 0) + 1;
                pair_res[`win1_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] = (pair_res[`win1_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] || 0) + 1;
            }
            else if (matches_filter_1617[i].team1 == team1 && Number(matches_filter_1617[i].diff)<0) {
                pair_res.win2_all = (pair_res.win2_all || 0) + 1; 
                pair_res.win2_1617 = (pair_res.win2_1617 || 0) + 1; 
                pair_res[`win2_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] = (pair_res[`win2_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] || 0) + 1;
                pair_res[`win2_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] = (pair_res[`win2_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] || 0) + 1;
            }
            else if (matches_filter_1617[i].team1 == team2 && Number(matches_filter_1617[i].diff)>0) {
                pair_res.win2_all = (pair_res.win2_all || 0) + 1; 
                pair_res.win2_1617 = (pair_res.win2_1617 || 0) + 1; 
                pair_res[`win2_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] = (pair_res[`win2_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] || 0) + 1;
                pair_res[`win2_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] = (pair_res[`win2_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] || 0) + 1;
            }
            else if (matches_filter_1617[i].team1 == team2 && Number(matches_filter_1617[i].diff)<0) {
                pair_res.win1_all = (pair_res.win1_all || 0) + 1; 
                pair_res.win1_1617 = (pair_res.win1_1617 || 0) + 1; 
                pair_res[`win1_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] = (pair_res[`win_1${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] || 0) + 1;
                pair_res[`win1_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] = (pair_res[`win1_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] || 0) + 1;
            }
            else if (Number(matches_filter_1617[i].diff)==0) {
                pair_res.tie_all = (pair_res.tie_all || 0) + 1; 
                pair_res.tie_1617 = (pair_res.tie_1617 || 0) + 1; 
                pair_res[`tie_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] = (pair_res[`tie${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}_16/17`] || 0) + 1;
                pair_res[`tie_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] = (pair_res[`tie_${champs_code[champs.indexOf(matches_filter_1617[i].competition)]}`] || 0) + 1;
            }
        }
    }
    tournirs_all = Array.from(new Set(tournirs_all))
    tournirs_1617 = Array.from(new Set(tournirs_1617));

/*Таблица % набранных очков*/
    const table_procent = document.createElement('table');
    table_procent.className = 'supertable';
    const width_procent = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const years_column_width = (width_procent - 50) / 6;
    const header_procent = ['Сезон',`% очков ${team1}`,`% очков ${team2}`]
    const procent_results = {};
    for (let i=0;i<7;i+=1) {
        procent_results[`win1_rate_${16+i}${17+i}`] = (Math.round(((pair_res[`win1_${16+i}${17+i}`] || 0) * 3 + (pair_res[`tie_${16+i}${17+i}`] || 0))/ ((pair_res[`win1_${16+i}${17+i}`] || 0) + (pair_res[`tie_${16+i}${17+i}`] || 0) + (pair_res[`win2_${16+i}${17+i}`] || 0)) / 3 *10000)/100 || 0);
        procent_results[`win2_rate_${16+i}${17+i}`] = (Math.round(((pair_res[`win2_${16+i}${17+i}`] || 0) * 3 + (pair_res[`tie_${16+i}${17+i}`] || 0))/ ((pair_res[`win1_${16+i}${17+i}`] || 0) + (pair_res[`tie_${16+i}${17+i}`] || 0) + (pair_res[`win2_${16+i}${17+i}`] || 0)) / 3 *10000)/100 || 0);
        /* c добавлением нового чемпа добавлть в сумму их матчи*/
        procent_results[`win1_rate_sum_${16+i}${17+i}`] = (Math.round(((pair_res[`win1_${16+i}${17+i}`] || 0) * 3 + (pair_res[`tie_${16+i}${17+i}`] || 0))/ ((pair_res[`win1_${16+i}${17+i}`] || 0) + (pair_res[`tie_${16+i}${17+i}`] || 0) + (pair_res[`win2_${16+i}${17+i}`] || 0)) / 3 *10000)/100 || 0);
        procent_results[`win2_rate_sum_${16+i}${17+i}`] = (Math.round(((pair_res[`win2_${16+i}${17+i}`] || 0) * 3 + (pair_res[`tie_${16+i}${17+i}`] || 0))/ ((pair_res[`win1_${16+i}${17+i}`] || 0) + (pair_res[`tie_${16+i}${17+i}`] || 0) + (pair_res[`win2_${16+i}${17+i}`] || 0)) / 3 *10000)/100 || 0);
        procent_results.win1 = (Math.round(((pair_res.win1_all || 0) * 3 + (pair_res.tie_all || 0)) / ((pair_res.win1_all || 0) + (pair_res.tie_all || 0) + (pair_res.win2_all || 0)) /3*10000)/100 || "");
        procent_results.win2 = (Math.round(((pair_res.win2_all || 0) * 3 + (pair_res.tie_all || 0)) / ((pair_res.win1_all || 0) + (pair_res.tie_all || 0) + (pair_res.win2_all || 0)) /3*10000)/100 || "");
    }
    for (let i=0; i<9; i+=1) {
        const tr = table_procent.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<header_procent.length; j+=1) {
            const td = tr.insertCell();
            if (i===0) {
                td.appendChild(document.createTextNode(`${header_procent[j]}`));
                td.className = 'maincell';
            }
            if (i!==0) td.className = 'supercell';
            td.style.width = (j===0)? `${years_column_width*1.2}px`:  `${years_column_width*1.2}px`;
            if (j===0 && i>0) {
                td.className = i==1?'supercell great': 'supercell maincell';
                td.innerText = i==1? `Всего` : `20${14+i}/${15+i}`;
            } else if (j===1 && i>0) {
                td.className = i==1?'supercell great': 'supercell maincell';
                td.innerText = i==1? procent_results.win1 : type_procent=='spare'? procent_results[`win1_rate_${14+i}${15+i}`] : procent_results[`win1_rate_sum_${14+i}${15+i}`];
            } else if (j===2 && i>0) {
                td.className = i==1?'supercell great': 'supercell maincell';
                td.innerText = i==1? procent_results.win2 : type_procent=='spare'? procent_results[`win2_rate_${14+i}${15+i}`] : procent_results[`win2_rate_sum_${14+i}${15+i}`];
            }
        }
    }
    document.getElementById('history_table_procent').appendChild(table_procent);
/**/

    const table = document.createElement('table');
    table.className = 'supertable';
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const players_column_width = (width - 50) / 8;
    const header = ['Турнир',`${team1}`,'Ничья',`${team2}`]
    for (let i=0; i<tournirs_all.length+1; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<header.length; j+=1) {
            const td = tr.insertCell();
            if (i===0) {
                td.appendChild(document.createTextNode(`${header[j]}`));
                td.className = 'maincell';
            }
            if (i!==0) td.className = 'supercell';
            td.style.width = (j===0)? `${players_column_width*1.5}px`:  `${players_column_width*1.2}px`;
            if (j===0 && i>0) {
                td.className = i==1?'supercell great': type == 'full'?'supercell maincell':'hide';
                td.appendChild(document.createTextNode(`${tournirs_all[i-1]}`))
            } else if (j===1 && i>0) {
                td.className = i==1?'supercell great': type == 'full'?'supercell':'hide';
                td.innerText = (pair_res[`win1_${champs_code[champs.indexOf(tournirs_all[i-1])]}`] || "" );
            } else if (j===2 && i>0) {
                td.className = i==1?'supercell great': type == 'full'?'supercell':'hide';
                td.innerText = (pair_res[`tie_${champs_code[champs.indexOf(tournirs_all[i-1])]}`] || "" );
            } else if (j===3 && i>0) {
                td.className = i==1?'supercell great': type == 'full'?'supercell':'hide';
                td.innerText = (pair_res[`win2_${champs_code[champs.indexOf(tournirs_all[i-1])]}`] || "" );
            }
        }
    }
    document.getElementById('history_table').appendChild(table);
    const table1617 = document.createElement('table');
    table1617.className = 'supertable';
    for (let i=1; i<tournirs_1617.length+1; i+=1) {
        const tr = table1617.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<header.length; j+=1) {
            const td = tr.insertCell();
            td.className = 'supercell';
            td.style.width = (j===0)? `${players_column_width*1.5}px`:  `${players_column_width*1.2}px`;
            if (j===0 && i>0) {
                td.className = i==1?'supercell great': type == 'full'?'supercell maincell':'hide';
                td.appendChild(document.createTextNode(`${tournirs_1617[i-1]}`))
            } else if (j===1 && i>0) {
                td.className = i==1?'supercell great': type == 'full'?'supercell':'hide';
                td.innerText = (pair_res[`win1_${champs_code[champs.indexOf(tournirs_1617[i-1])]}`] || "" );
            } else if (j===2 && i>0) {
                td.className = i==1?'supercell great': type == 'full'?'supercell':'hide';
                td.innerText = (pair_res[`tie_${champs_code[champs.indexOf(tournirs_1617[i-1])]}`] || "" );
            } else if (j===3 && i>0) {
                td.className = i==1?'supercell great': type == 'full'?'supercell':'hide';
                td.innerText = (pair_res[`win2_${champs_code[champs.indexOf(tournirs_1617[i-1])]}`] || "" );
            }
        }
    }
    document.getElementById('history_table').appendChild(table1617);
}

document.getElementById('show_history_type').addEventListener('click', ()=>{
    if (document.getElementById('show_history_type').innerText == 'Показать краткую таблицу') {
        document.getElementById('show_history_type').innerText = 'Показать полную таблицу';
        history_type_option[0] = 'short'
        buildHistoryTable(history_type_option[0],history_type_procent_option[0]);
    } else {
        document.getElementById('show_history_type').innerText = 'Показать краткую таблицу';
        history_type_option[0] = 'full';
        buildHistoryTable(history_type_option[0],history_type_procent_option[0]);
    }
})

document.getElementById('show_history_procent_type').addEventListener('click', ()=>{
    if (document.getElementById('show_history_procent_type').innerText == 'Показать процент накопительно') {
        document.getElementById('show_history_procent_type').innerText = 'Показать процент по годам';
        history_type_procent_option[0] = 'sum'
        buildHistoryTable(history_type_option[0],history_type_procent_option[0]);
    } else {
        document.getElementById('show_history_procent_type').innerText = 'Показать процент накопительно';
        history_type_procent_option[0] = 'spare';
        buildHistoryTable(history_type_option[0],history_type_procent_option[0]);
    }
}) 

document.getElementById('history_?').addEventListener('click',showHistoryProcentInfo);
function showHistoryProcentInfo() {
    if (document.getElementById('history_info').style.display == 'none') {
        document.getElementById('history_info').style.display = 'block'
        document.getElementById('history_?').style.background = 'pink'
    } else {
        document.getElementById('history_info').style.display = 'none';
        document.getElementById('history_?').style.background = 'lightskyblue'
    }
}

document.getElementById('anaheim_plus_menu').addEventListener('click',openAnaheimPlus);
let anaheim_sorting_status = [0];
function openAnaheimPlus() {
    document.getElementById('anaheim_plus').innerHTML=``;
    if (menu_dates[0].classList=='nav_item2 selected') {
        document.getElementById('anaheim_plus').innerText = 'Данные рейтинга Анахайма доступны только для завершенных сезонов. Выберите другой сезон.';
    } else {
        if (menu_dates[1].classList=='nav_item2 selected') {date_filter = "21_22"}
        else if (menu_dates[2].classList=='nav_item2 selected') {date_filter = "20_21"}
        else if (menu_dates[3].classList=='nav_item2 selected') {date_filter = "19_20"}
        else if (menu_dates[4].classList=='nav_item2 selected') {date_filter = "18_19"}
        else if (menu_dates[5].classList=='nav_item2 selected') {date_filter = "17_18"}
        else if (menu_dates[6].classList=='nav_item2 selected') {date_filter = "16_17", diff_tournaments=['Sk']}
        fetch(`archive${date_filter}.json`)
        .then(res => res.json())
        .then(data => {
            let anaheim_data = Array.from(data.anaheim);
            buildAnaheimTable(anaheim_data,diff_tournaments);
        })
    }
}

function buildAnaheimTable(anaheim_data, diff_tournaments) {
    if (anaheim_sorting_status[0] == 0) anaheim_data.sort((a,b)=> Number(b.anah) - Number(a.anah));
    if (anaheim_sorting_status[0] == 1) anaheim_data.sort((a,b)=> Number(b.kn_ru) - Number(a.kn_ru));
    if (anaheim_sorting_status[0] == 2) anaheim_data.sort((a,b)=> Number(b.kn_en) - Number(a.kn_en));
    if (anaheim_sorting_status[0] == 3) anaheim_data.sort((a,b)=> Number(b.kn_es) - Number(a.kn_es));
    if (anaheim_sorting_status[0] == 4) anaheim_data.sort((a,b)=> Number(b.kn_it) - Number(a.kn_it));
    if (anaheim_sorting_status[0] == 5) anaheim_data.sort((a,b)=> Number(b.kn_de) - Number(a.kn_de));
    if (anaheim_sorting_status[0] == 6) anaheim_data.sort((a,b)=> Number(b.kn_fr) - Number(a.kn_fr));
    if (anaheim_sorting_status[0] == 7) anaheim_data.sort((a,b)=> Number(b.kn_nl) - Number(a.kn_nl));
    if (anaheim_sorting_status[0] == 8) anaheim_data.sort((a,b)=> Number(b.kn_ship) - Number(a.kn_ship));
    if (anaheim_sorting_status[0] == 9) anaheim_data.sort((a,b)=> Number(b.kn_pt) - Number(a.kn_pt));
    if (anaheim_sorting_status[0] == 10) anaheim_data.sort((a,b)=> Number(b.kn_tr) - Number(a.kn_tr));
    if (anaheim_sorting_status[0] == 11) anaheim_data.sort((a,b)=> Number(b.kn_mex_ap) - Number(a.kn_mex_ap));
    if (anaheim_sorting_status[0] == 12) anaheim_data.sort((a,b)=> Number(b.kn_mex_kl) - Number(a.kn_mex_kl));
    if (anaheim_sorting_status[0] == 13) anaheim_data.sort((a,b)=> Number(b.kn_sk) - Number(a.kn_sk));
    if (anaheim_sorting_status[0] == 14) anaheim_data.sort((a,b)=> Number(b.kn_total) - Number(a.kn_total));
    if (anaheim_sorting_status[0] == 15) anaheim_data.sort((a,b)=> Number(b.anisimov)-Number(a.anisimov));
    if (anaheim_sorting_status[0] == 16) anaheim_data.sort((a,b)=> Number(b.elo) - Number(a.elo));
    if (anaheim_sorting_status[0] == 17) anaheim_data.sort((a,b)=> Number(b.EGF_ru) - Number(a.EGF_ru));
    if (anaheim_sorting_status[0] == 18) anaheim_data.sort((a,b)=> Number(b.EGF_en) - Number(a.EGF_en));
    if (anaheim_sorting_status[0] == 19) anaheim_data.sort((a,b)=> Number(b.EGF_es) - Number(a.EGF_es));
    if (anaheim_sorting_status[0] == 20) anaheim_data.sort((a,b)=> Number(b.EGF_it) - Number(a.EGF_it));
    if (anaheim_sorting_status[0] == 21) anaheim_data.sort((a,b)=> Number(b.EGF_de) - Number(a.EGF_de));
    if (anaheim_sorting_status[0] == 22) anaheim_data.sort((a,b)=> Number(b.EGF_fr) - Number(a.EGF_fr));
    if (anaheim_sorting_status[0] == 23) anaheim_data.sort((a,b)=> Number(b.EGF_nl) - Number(a.EGF_nl));
    if (anaheim_sorting_status[0] == 24) anaheim_data.sort((a,b)=> Number(b.EGF_ship) - Number(a.EGF_ship));
    if (anaheim_sorting_status[0] == 25) anaheim_data.sort((a,b)=> Number(b.EGF_pt) - Number(a.EGF_pt));
    if (anaheim_sorting_status[0] == 26) anaheim_data.sort((a,b)=> Number(b.EGF_tr) - Number(a.EGF_tr));
    if (anaheim_sorting_status[0] == 27) anaheim_data.sort((a,b)=> Number(b.EGF_mex_ap) - Number(a.EGF_mex_ap));
    if (anaheim_sorting_status[0] == 28) anaheim_data.sort((a,b)=> Number(b.EGF_mex_kl) - Number(a.EGF_mex_kl));
    if (anaheim_sorting_status[0] == 29) anaheim_data.sort((a,b)=> Number(b.EGF_sk) - Number(a.EGF_sk));
    if (anaheim_sorting_status[0] == 30) anaheim_data.sort((a,b)=> Number(b.EGF_total) - Number(a.EGF_total));
    if (anaheim_sorting_status[0] == 31) anaheim_data.sort((a,b)=> Number(b.kef_supremacy) - Number(a.kef_supremacy));
    if (anaheim_sorting_status[0] == 32) anaheim_data.sort((a,b)=> Number(b.kef_procent) - Number(a.kef_procent));
    if (anaheim_sorting_status[0] == 33) anaheim_data.sort((a,b)=> Number(b.kef_trophy) - Number(a.kef_trophy));
    document.getElementById('anaheim_plus').innerHTML="";
    const table = document.createElement('table');
    table.className = 'supertable';
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const players_column_width = (width-50) / 35;
    const upper_header = ['','Anaheim', "Князев модифицированный", "Анисимов", "Эло", "Результаты по ФО", "Коэффициенты"]
    const col_Span = [2,1,14-diff_tournaments.length,1,1,14-diff_tournaments.length,3];
    const header = ['№','FFC','Anaheim','Ru','En','Es','It','De','Fr','Nl','Ship','Pt','Tr','MxA','MxK','Sk','∑',`${date_filter}`,`${date_filter}`,'Ru','En','Es','It','De','Fr','Nl','Ship','Pt','Tr','MxA','MxK','Sk','∑',"EGF", "% очков", "Трофеи"];
    for (let i=0; i<anaheim_data.length+2; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<header.length; j+=1) {
            const td = tr.insertCell();
            if (i===0 && j<7) {
                td.appendChild(document.createTextNode(`${upper_header[j]}`));
                td.className = 'maincell';
                td.colSpan = col_Span[j];
            }
            if (i===1) {
                if (j<=1) {
                    td.appendChild(document.createTextNode(`${header[j]}`));
                    td.className = 'maincell_small';
                } else if(j>1) {
                    td.addEventListener('click', (e)=>{
                        anaheim_sorting_status[0]=Number(e.target.id.split('header_anaheim_')[1]) - 2;
                        buildAnaheimTable(anaheim_data,diff_tournaments);
                    })
                    if (j == anaheim_sorting_status[0]+2 && diff_tournaments.indexOf(header[j]) == -1) {
                        td.className = 'maincell_small clickable sorted';
                        td.id = `header_anaheim_${j}`
                        td.innerText = `${header[j]} ↓`
                    } else if (diff_tournaments.indexOf(header[j]) == -1){
                        td.className = 'maincell_small clickable';
                        td.innerText = `${header[j]}`
                        td.id = `header_anaheim_${j}`
                    } else {
                        td.id = `header_anaheim_${j}`
                        td.className = 'hide';
                    }
                }
            }
            if (j===0 && i>1) {
                td.className = 'ordercell';
                td.appendChild(document.createTextNode(`${i-1}`));
            } else {
                if (i>1) {
                    td.className = 'supercell'; td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'supercell': 'hide';
                }
                if(i>0) td.style.width = (j===1)? `${players_column_width*4}px`: (j===2)? `${players_column_width*1.5}px`: `${players_column_width*0.9}px`;
                if (j===1 && i>1) {
                    td.className = 'supercell maincell_medium';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].team=='4-4-2002'?'4-4-2':anaheim_data[i-2].team}`))
                } else if (j===2 && i>1) {
                    td.className = 'supercell maincell_medium';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].anah}`))
                }  else if (j===3 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_ru==""?"":Math.round(Number(anaheim_data[i-2].kn_ru)*10)/10}`))
                 } else if (j===4 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_en==""?"":Math.round(Number(anaheim_data[i-2].kn_en)*10)/10}`))
                 } else if (j===5 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_es==""?"":Math.round(Number(anaheim_data[i-2].kn_es)*10)/10}`))
                 } else if (j===6 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_it==""?"":Math.round(Number(anaheim_data[i-2].kn_it)*10)/10}`))
                 } else if (j===7 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_de==""?"":Math.round(Number(anaheim_data[i-2].kn_de)*10)/10}`))
                 } else if (j===8 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_fr==""?"":Math.round(Number(anaheim_data[i-2].kn_fr)*10)/10}`))
                 } else if (j===9 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_nl==""?"":Math.round(Number(anaheim_data[i-2].kn_nl)*10)/10}`))
                 } else if (j===10 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_ship==""?"":Math.round(Number(anaheim_data[i-2].kn_ship)*10)/10}`))
                 } else if (j===11 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_pt==""?"":Math.round(Number(anaheim_data[i-2].kn_pt)*10)/10}`))
                 } else if (j===12 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_tr==""?"":Math.round(Number(anaheim_data[i-2].kn_tr)*10)/10}`))
                 } else if (j===13 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_mex_ap==""?"":Math.round(Number(anaheim_data[i-2].kn_mex_ap)*10)/10}`))
                 } else if (j===14 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_mex_kl==""?"":Math.round(Number(anaheim_data[i-2].kn_mex_kl)*10)/10}`))
                 } else if (j===15 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_sk==""?"":Math.round(Number(anaheim_data[i-2].kn_sk)*10)/10}`))
                 } else if (j===16 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_total==""?"":Math.round(Number(anaheim_data[i-2].kn_total)*10)/10}`))
                 } else if (j===17 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].anisimov==""?"":Number(anaheim_data[i-2].anisimov)}`))
                 } else if (j===18 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].elo==""?"":Number(anaheim_data[i-2].elo)}`))
                 }  else if (j===19 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_ru==""?"":Math.round(Number(anaheim_data[i-2].EGF_ru)*10)/10}`))
                 } else if (j===20 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_en==""?"":Math.round(Number(anaheim_data[i-2].EGF_en)*10)/10}`))
                 } else if (j===21 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_es==""?"":Math.round(Number(anaheim_data[i-2].EGF_es)*10)/10}`))
                 } else if (j===22 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_it==""?"":Math.round(Number(anaheim_data[i-2].EGF_it)*10)/10}`))
                 } else if (j===23 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_de==""?"":Math.round(Number(anaheim_data[i-2].EGF_de)*10)/10}`))
                 } else if (j===24 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_fr==""?"":Math.round(Number(anaheim_data[i-2].EGF_fr)*10)/10}`))
                 } else if (j===25 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_nl==""?"":Math.round(Number(anaheim_data[i-2].EGF_nl)*10)/10}`))
                 } else if (j===26 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_ship==""?"":Math.round(Number(anaheim_data[i-2].EGF_ship)*10)/10}`))
                 } else if (j===27 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_pt==""?"":Math.round(Number(anaheim_data[i-2].EGF_pt)*10)/10}`))
                 } else if (j===28 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_tr==""?"":Math.round(Number(anaheim_data[i-2].EGF_tr)*10)/10}`))
                 } else if (j===29 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_mex_ap==""?"":Math.round(Number(anaheim_data[i-2].EGF_mex_ap)*10)/10}`))
                 } else if (j===30 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_mex_kl==""?"":Math.round(Number(anaheim_data[i-2].EGF_mex_kl)*10)/10}`))
                 } else if (j===31 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_sk==""?"":Math.round(Number(anaheim_data[i-2].EGF_sk)*10)/10}`))
                 } else if (j===32 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_total==""?"":Math.round(Number(anaheim_data[i-2].EGF_total)*10)/10}`))
                 } else if (j===33 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kef_supremacy==""?"":Math.round(Number(anaheim_data[i-2].kef_supremacy)*100)/100}`))
                 } else if (j===34 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kef_procent==""?"":Math.round(Number(anaheim_data[i-2].kef_procent)*10000)/100}`))
                 } else if (j===35 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kef_trophy==""?"":Math.round(Number(anaheim_data[i-2].kef_trophy)*1000)/1000}`))
                 }
            };
        }
    }
    document.getElementById('anaheim_plus').appendChild(table);
}

function openSvodka() {

}

function openRecords() {

}

function openTrophy() {

}