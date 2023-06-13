function burgerMenu() {
    var x = document.getElementById("menu_ratings");
    if (x.className === "navigation") {
        x.className += " responsive";
    } else {
        x.className = "navigation";
    }
}

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
    for(let i=1; i<menu_ratings.length-2; i+=1) {
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

// document.getElementById('knyazev_menu').addEventListener('click',openKnyazev);
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


// document.getElementById('anisimov_menu').addEventListener('click',openAnisimov);
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
const anisimov_checked = ['checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked','checked'];
function openAnisimov() {
    document.getElementById('anisimov').innerHTML="";
    let default_header = ['№','FFC','Sum','Last','En','Ru','Es','De','It','Fr','Ship','Nl','Tr','Pt','MxA','MxK','SK','UCL','UEL','Euro','WC','CA']
    let diff_tournaments = ['MxA', 'MxK', 'SK','Euro','WC','CA'];
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
        else if (menu_dates[6].classList=='nav_item2 selected') {date_filter = "16_17"; diff_tournaments = ['Last','SK','Euro','WC','CA'];}
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
            if (anisimov_checked[13]=="checked" && anisimov_res[x].ucl_total && anisimov_res[x].uclpo_total) {total_sum += (Number(anisimov_res[x].ucl_total)+Number(anisimov_res[x].uclpo_total)); last_sum += (Number(anisimov_res[x].ucl_total)+Number(anisimov_res[x].uclpo_total))}
            if (anisimov_checked[14]=="checked" && anisimov_res[x].uel_total && anisimov_res[x].uelpo_total) {total_sum += (Number(anisimov_res[x].uel_total)+Number(anisimov_res[x].uelpo_total)); last_sum += (Number(anisimov_res[x].uel_total)+Number(anisimov_res[x].uelpo_total))}
            if (anisimov_checked[15]=="checked" && anisimov_res[x].euro_total) {total_sum += (Number(anisimov_res[x].euro_total)); last_sum += (Number(anisimov_res[x].euro_total))}
            if (anisimov_checked[16]=="checked" && anisimov_res[x].wc_total) {total_sum += (Number(anisimov_res[x].wc_total)); last_sum += (Number(anisimov_res[x].wc_total))}
            if (anisimov_checked[17]=="checked" && anisimov_res[x].ca_total) {total_sum += (Number(anisimov_res[x].ca_total)); last_sum += (Number(anisimov_res[x].ca_total))}
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
    if (anisimov_sorting_status[0] == 17) anisimov_res.sort((a,b)=> b.euro_total - a.euro_total);
    if (anisimov_sorting_status[0] == 18) anisimov_res.sort((a,b)=> b.wc_total - a.wc_total);
    if (anisimov_sorting_status[0] == 19) anisimov_res.sort((a,b)=> b.ca_total - a.ca_total);
    
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
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'supercell maincell': 'hide';
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
                } else if (j===19 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].euro_total)?Number(anisimov_res[i-2].euro_total): '-')}`;
                    if(anisimov_checked[15]!='checked') td.className = 'supercell negative';
                } else if (j===20 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].wc_total)?Number(anisimov_res[i-2].wc_total):'-')}`;
                    if(anisimov_checked[16]!='checked') td.className = 'supercell negative';
                } else if (j===21 && i>1) {
                    td.innerText= `${(Number(anisimov_res[i-2].ca_total)? Number(anisimov_res[i-2].ca_total) : '-')}`;
                    if(anisimov_checked[17]!='checked') td.className = 'supercell negative';
                }
            };
        }
    }
    document.getElementById('anisimov').appendChild(table);
}

// document.getElementById('elo_menu').addEventListener('click',openElo);
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
            let elo_labels = Array.from(data.elo_distance[0].data);
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
    for (let i=0; i<elo_data.length; i+=1) {
        new_datasets.push({
            label: `${elo_data[i].team}`,
            data: elo_data[i].data,
            borderWidth: i<6? 2: 1,
            borderColor: `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`,
            fill: false,
            tension: 0.1,
        })
    }
    new_datasets.sort((a,b)=>b.data[b.data.length-1] - a.data[a.data.length-1]);
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
    if (anaheim_sorting_status[0] == 11) anaheim_data.sort((a,b)=> Number(b.kn_mxa) - Number(a.kn_mxa));
    if (anaheim_sorting_status[0] == 12) anaheim_data.sort((a,b)=> Number(b.kn_mxk) - Number(a.kn_mxk));
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
    if (anaheim_sorting_status[0] == 27) anaheim_data.sort((a,b)=> Number(b.EGF_mxa) - Number(a.EGF_mxa));
    if (anaheim_sorting_status[0] == 28) anaheim_data.sort((a,b)=> Number(b.EGF_mxk) - Number(a.EGF_mxk));
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
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_mxa==""?"":Math.round(Number(anaheim_data[i-2].kn_mxa)*10)/10}`))
                 } else if (j===14 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].kn_mxk==""?"":Math.round(Number(anaheim_data[i-2].kn_mxk)*10)/10}`))
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
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_mxa==""?"":Math.round(Number(anaheim_data[i-2].EGF_mxa)*10)/10}`))
                 } else if (j===30 && i>1) {
                    td.className = (diff_tournaments.indexOf(header[j]) == -1) ? 'mediumcell': 'hide';
                    td.appendChild(document.createTextNode(`${anaheim_data[i-2].EGF_mxk==""?"":Math.round(Number(anaheim_data[i-2].EGF_mxk)*10)/10}`))
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
    document.getElementById('svodka').innerHTML=`<table class="supertable svodka_ratings" id="svodka_ratings"></table>
    <div class="svodka_players_spfp" id="svodka_players_spfp_block">
        <table class="supertable svodka_players_spfp_table" id="svodka_players_spfp"></table>
    </div>
    <div class="svodka_players_stat" id="svodka_players_stat"></div>
    <div class="svodka_tournaments_stat" id="svodka_tournaments_stat"></div>
    <div class="svodka_opponents_list" id="svodka_opponents_list"></div>
    <div class="svodka_long_block" id="svodka_long_block">
        <p class="stat_title">Распределение счетов</p>
        <div class="svodka_matches_score_full">
            <div class="svodka_matches_scores" id="svodka_matches_scores">
                <select class="svodka_players_ffc" id="svodka_matches_scores_opponent"><option>Все соперники</option></select>
                <div class="canvas_radar">
                    <canvas id="scores-chart""></canvas>
                </div>
            </div>
            <div class="svodka_matches_scores_facts" id="svodka_matches_scores_facts"></div>
        </div>
        <p class="stat_title">Динамика Эло</p>
        <div class="svodka_elo_updates" id="svodka_elo_updates">
            <p>Добавить франшизу для сравнения:</p>
            <select class="svodka_players_ffc" id="svodka_elo_opponent"></select>
            <div class="buttons_row">
                <div class="button_graph" id="add_enemy_to_elo">Добавить в сравнение</div>
                <div class="button_graph" id="add_all_enemies_to_elo">Показать все</div>
                <div class="button_graph" id="reset_elo">Очистить график</div>
            </div>
            <div class="canvas_radar">
                <canvas id="elo-chart"></canvas>
            </div>
        </div>
        <p class="stat_title">Динамика процента набранных очков</p>
        <div class="svodka_procent_updates" id="svodka_procent_updates">
                <p>Добавить франшизу для сравнения:</p>
                <select class="svodka_players_ffc" id="svodka_procent_opponent"></select>
                <div class="buttons_row">
                    <div class="button_graph" id="add_enemy_to_procent">Добавить в сравнение</div>
                    <div class="button_graph" id="add_all_enemies_to_procent">Показать все</div>
                    <div class="button_graph" id="reset_procent">Очистить график</div>
                </div>
                <div>
                    <canvas id="procent-chart"></canvas>
                </div>
        </div>
    </div>`;
    let final_res_date_filter=[];
    let date_filter = '';
    let default_header = ['Cостав','En','Ru','Es','De','It','Fr','Ship','Nl','Tr','Pt','MxA','MxK','SK','UCL','UCLPO','UEL','UELPO','WC','Euro','CA'];
    let diff_tournaments = ['MxA', 'MxK', 'SK'];
    if (menu_dates[0].classList=='nav_item2 selected') {
        document.getElementById('svodka_select_ffc').classList.add('hide');
        document.getElementById('svodka').innerText = 'Просмотр сводки по выступлению франшизы доступен только для завершенных сезонов. Выберите другой сезон.';
        // final_res_date_filter = Array.from(final_res)
        // drawKnyazevTable(final_res_date_filter, default_header, diff_tournaments); переписать, тут пока ина с князева, а надо со всех мест
    } else {
        document.getElementById('svodka_select_ffc').classList.remove('hide');
        if (menu_dates[1].classList=='nav_item2 selected') {date_filter = "21_22"}
        else if (menu_dates[2].classList=='nav_item2 selected') {date_filter = "20_21"}
        else if (menu_dates[3].classList=='nav_item2 selected') {date_filter = "19_20"}
        else if (menu_dates[4].classList=='nav_item2 selected') {date_filter = "18_19"}
        else if (menu_dates[5].classList=='nav_item2 selected') {date_filter = "17_18"}
        else if (menu_dates[6].classList=='nav_item2 selected') {date_filter = "16_17"; diff_tournaments = ['SK','WC','Euro','CA'];}
        fetch(`archive${date_filter}.json`)
        .then(res => res.json())
        .then(data => {
            final_res_date_filter = data;
            updateSvodkaTables(final_res_date_filter, default_header, diff_tournaments);
        })
    }
    
}
function updateSvodkaTables(final_res_date_filter, default_header, diff_tournaments) {
    updateSvodkaFFC(final_res_date_filter);
    updateSvodkaTablesData(final_res_date_filter, default_header, diff_tournaments, final_res_date_filter.teams[0])
    document.getElementById('svodka_select_ffc').addEventListener('change',()=> {
        updateSvodkaTablesData(final_res_date_filter, default_header, diff_tournaments, document.getElementById('svodka_select_ffc').value)
    })  
}
let opponents_sorting = [0];
function updateSvodkaTablesData (final_res_date_filter, default_header, diff_tournaments, ffc) {
    document.getElementById('svodka').innerHTML=`<table class="supertable svodka_ratings" id="svodka_ratings"></table>
    <div class="svodka_players_spfp" id="svodka_players_spfp_block">
        <table class="supertable svodka_players_spfp_table" id="svodka_players_spfp"></table>
    </div>
    <div class="svodka_players_stat" id="svodka_players_stat"></div>
    <div class="svodka_tournaments_stat" id="svodka_tournaments_stat"></div>
    <div class="svodka_opponents_list" id="svodka_opponents_list"></div>
    <div class="svodka_long_block" id="svodka_long_block">
        <p class="stat_title">Распределение счетов</p>
        <div class="svodka_matches_score_full">
            <div class="svodka_matches_scores" id="svodka_matches_scores">
                <select class="svodka_players_ffc" id="svodka_matches_scores_opponent"><option>Все соперники</option></select>
                <div class="canvas_radar">
                    <canvas id="scores-chart""></canvas>
                </div>
            </div>
            <div class="svodka_matches_scores_facts" id="svodka_matches_scores_facts"></div>
        </div>
        <p class="stat_title">Динамика Эло</p>
        <div class="svodka_elo_updates" id="svodka_elo_updates">
            <p>Добавить франшизу для сравнения:</p>
            <select class="svodka_players_ffc" id="svodka_elo_opponent"></select>
            <div class="buttons_row">
                <div class="button_graph" id="add_enemy_to_elo">Добавить в сравнение</div>
                <div class="button_graph" id="add_all_enemies_to_elo">Показать все</div>
                <div class="button_graph" id="reset_elo">Очистить график</div>
            </div>
            <div>
                <canvas id="elo-chart"></canvas>
            </div>
        </div>
        <p class="stat_title">Динамика процента набранных очков</p>
        <div class="svodka_procent_updates" id="svodka_procent_updates">
                <p>Добавить франшизу для сравнения:</p>
                <select class="svodka_players_ffc" id="svodka_procent_opponent"></select>
                <div class="buttons_row">
                    <div class="button_graph" id="add_enemy_to_procent">Добавить в сравнение</div>
                    <div class="button_graph" id="add_all_enemies_to_procent">Показать все</div>
                    <div class="button_graph" id="reset_procent">Очистить график</div>
                </div>
                <div>
                    <canvas id="procent-chart"></canvas>
                </div>
        </div>
    </div>`;
    updateSvodkaRatings(final_res_date_filter, ffc);
    updateSvodkaPlayersSPFP(final_res_date_filter, default_header, diff_tournaments, ffc);
    updateSvodkaPLayersStat(final_res_date_filter, default_header, diff_tournaments, ffc);
    document.getElementById('svodka_players_ffc').addEventListener('change', ()=>{updateSvodkaPLayersStat(final_res_date_filter, default_header, diff_tournaments, ffc)})
    updateSvodkaTournamentsStat(final_res_date_filter, default_header, diff_tournaments, ffc);
    updateSvodkaMatches(final_res_date_filter, ffc, opponents_sorting);
    updateSvodkaMatchesResults(final_res_date_filter, ffc);
    updateSvodkaEloGraph(final_res_date_filter, ffc);
    updateSvodkaPercentGraph(final_res_date_filter, ffc);
}
function updateSvodkaFFC(final_res_date_filter) {
    document.getElementById('svodka_select_ffc').innerHTML='';
    for (let i=0; i<final_res_date_filter.teams.length; i+=1) {
        let option = document.createElement('option');
        option.innerText = final_res_date_filter.teams[i];
        document.getElementById('svodka_select_ffc').append(option);
    } 
}
function updateSvodkaRatings(final_res_date_filter, ffc) {
    const table = document.getElementById('svodka_ratings');
    const upper_header = [`${ffc}`,'Анахайм', "Князев", "Анисимов", "Эло", "ФО", "Коэффициенты"]
    // const background_img = ['','anaheim_card', 'knyazev_card', 'anisimov_card', 'elo_card', 'EGF_card']
    const col_Span = [1,1,1,1,1,1,3]
    const row_Span = [2,2,2,2,2,2,1,1,1];
    const header = ['EGF','% очков','Трофеи'];
    for (let i=0; i<4; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<upper_header.length+2; j+=1) {
            const td = tr.insertCell();
            if (i===0 && j<7) {
                td.appendChild(document.createTextNode(`${upper_header[j]}`));
                td.className = 'maincell';
                td.colSpan = col_Span[j];
                if(j<6) td.rowSpan = row_Span[j]; 
                // if(j>0 && j<6) td.classList.add(`${background_img[j]}`)
            }
            if (i===1 && j<3) {
                td.appendChild(document.createTextNode(`${header[j]}`));
                td.className = 'maincell';
            }
            if (j==0 && i==2) {
                td.appendChild(document.createTextNode(`Место`));
                td.className = 'maincell';
            } else if (j==0 && i==3) {
                td.appendChild(document.createTextNode(`Результат`));
                td.className = 'maincell';
            } else if (j==1 && i>1) {
                let sort_anaheim = final_res_date_filter.anaheim.sort((a,b)=> b.anah - a.anah);
                let index = sort_anaheim.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                td.className = 'supercell bold';
                if (i==2) td.appendChild(document.createTextNode(`${index}`));
                if (i==3) td.appendChild(document.createTextNode(`${sort_anaheim[index-1].anah}`)); 
            } else if (j==2 && i>1) {
                let sort_knyazev = final_res_date_filter.knyazev.sort((a,b)=> b.knyazev - a.knyazev);
                let index = sort_knyazev.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                td.className = 'supercell bold';
                if (i==2) td.appendChild(document.createTextNode(`${index}`));
                if (i==3) td.appendChild(document.createTextNode(`${sort_knyazev[index-1].knyazev}`)); 
            } else if (j==3 && i>1) {
                let sort_anisimov = final_res_date_filter.anisimov.sort((a,b)=> b.sum - a.sum);
                let index = sort_anisimov.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                td.className = 'supercell bold';
                if (i==2) td.appendChild(document.createTextNode(`${index}`));
                if (i==3) td.appendChild(document.createTextNode(`${sort_anisimov[index-1].sum}`)); 
            } else if (j==4 && i>1) {
                let sort_elo = final_res_date_filter.elo.sort((a,b)=> b.elo - a.elo);
                let index = sort_elo.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                td.className = 'supercell bold';
                if (i==2) td.appendChild(document.createTextNode(`${index}`));
                if (i==3) td.appendChild(document.createTextNode(`${sort_elo[index-1].elo}`)); 
            } else if (j==5 && i>1) {
                let sort_egf = final_res_date_filter.anaheim.sort((a,b)=> b.EGF_total - a.EGF_total);
                let index = sort_egf.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                td.className = 'supercell bold';
                if (i==2) td.appendChild(document.createTextNode(`${index}`));
                if (i==3) td.appendChild(document.createTextNode(`${sort_egf[index-1].EGF_total}`)); 
            } else if (j==6 && i>1) {
                let sort_egf_kef = final_res_date_filter.anaheim.sort((a,b)=> b.kef_supremacy - a.kef_supremacy);
                let index = sort_egf_kef.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                td.className = 'supercell bold';
                if (i==2) td.appendChild(document.createTextNode(`${index}`));
                if (i==3) td.appendChild(document.createTextNode(`${sort_egf_kef[index-1].kef_supremacy}`)); 
            } else if (j==7 && i>1) {
                let sort_procent_kef = final_res_date_filter.anaheim.sort((a,b)=> b.kef_procent - a.kef_procent);
                let index = sort_procent_kef.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                td.className = 'supercell bold';
                if (i==2) td.appendChild(document.createTextNode(`${index}`));
                if (i==3) td.appendChild(document.createTextNode(`${Math.round(sort_procent_kef[index-1].kef_procent*10000)/100} %`)); 
            } else if (j==8 && i>1) {
                let sort_trophy_kef = final_res_date_filter.anaheim.sort((a,b)=> b.kef_trophy - a.kef_trophy);
                let index = sort_trophy_kef.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                td.className = 'supercell bold';
                if (i==2) td.appendChild(document.createTextNode(`${index}`));
                if (i==3) td.appendChild(document.createTextNode(`${sort_trophy_kef[index-1].kef_trophy}`)); 
            }
        }
    }
}
function updateSvodkaPlayersSPFP(final_res_date_filter, default_header, diff_tournaments, ffc) {
    const table = document.getElementById('svodka_players_spfp');
    const header = ['en','ru','es','de','it','fr','ship','nl','tr','pt','mxa','mxk','sk','ucl','uclpo','uel','uelpo','wc','euro','ca'];
    const index = final_res_date_filter.anisimov.findIndex(el=>el.team.toLowerCase() == ffc.toLowerCase());
    const index2 = final_res_date_filter.personal.findIndex(el=>el.team.toLowerCase() == ffc.toLowerCase())
    const players = final_res_date_filter.anisimov[index].players;
    console.log(players);
    console.log(diff_tournaments);
    for (let i=0; i<Number(players)+2; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<default_header.length; j+=1) {
            const td = tr.insertCell();
            if (i>1) { td.className = 'supercell'};
            if (i===0 && j==0) {
                td.appendChild(document.createTextNode(`${ffc}`));
                td.className = 'maincell';
                td.rowSpan = 2; 
            } else if (i===0 && j==1) {
                td.appendChild(document.createTextNode(`Место в общем зачете`));
                td.className = 'maincell';
                td.colSpan = default_header.length - 1; 
            } else if (i===1 && j<default_header.length - 1) {
                diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j].toLowerCase()) == -1? td.className = `maincell ${header[j]}` : td.className = `maincell ${header[j]} hide`;
                td.title = `${header[j]}`;
                td.style.height = `30px`;
            } else if (i>1 && j==0) {
                td.className = 'maincell'
                td.appendChild(document.createTextNode(`${i-1}. ${final_res_date_filter.personal[index2].results[i-2].player}`))
            } else if (i>1 && j==1) {
                const pos = final_res_date_filter.personal[index2].results[i-2].en_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==2) {
                const pos = final_res_date_filter.personal[index2].results[i-2].ru_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==3) {
                const pos = final_res_date_filter.personal[index2].results[i-2].es_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==4) {
                const pos = final_res_date_filter.personal[index2].results[i-2].de_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==5) {
                const pos = final_res_date_filter.personal[index2].results[i-2].it_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==6) {
                const pos = final_res_date_filter.personal[index2].results[i-2].fr_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==7) {
                const pos = final_res_date_filter.personal[index2].results[i-2].ship_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==8) {
                const pos = final_res_date_filter.personal[index2].results[i-2].nl_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==9) {
                const pos = final_res_date_filter.personal[index2].results[i-2].tr_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==10) {
                const pos = final_res_date_filter.personal[index2].results[i-2].pt_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==11) {
                const pos = final_res_date_filter.personal[index2].results[i-2].mxa_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==12) {
                const pos = final_res_date_filter.personal[index2].results[i-2].mxk_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==13) {
                const pos = final_res_date_filter.personal[index2].results[i-2].sk_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==14) {
                const pos = final_res_date_filter.personal[index2].results[i-2].ucl_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==15) {
                const pos = final_res_date_filter.personal[index2].results[i-2].uclpo_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==16) {
                const pos = final_res_date_filter.personal[index2].results[i-2].uel_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==17) {
                const pos = final_res_date_filter.personal[index2].results[i-2].uelpo_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==18) {
                const pos = final_res_date_filter.personal[index2].results[i-2].wc_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==19) {
                const pos = final_res_date_filter.personal[index2].results[i-2].euro_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            } else if (i>1 && j==20) {
                const pos = final_res_date_filter.personal[index2].results[i-2].ca_pos;
                pos == 1? td.classList.add('gold_bcg') : (pos < 11 && pos >1)? td.classList.add('silver_bcg') : (pos < 101 && pos >10)? td.classList.add('bronze_bcg') : diff_tournaments.map(el=>el.toLowerCase()).indexOf(header[j-1].toLowerCase()) == -1? td.className = `supercell mw40` : td.className = `supercell hide`;;
                td.appendChild(document.createTextNode(`${pos != 0?pos:"-"}`));
            }
        }
    }
    const block = document.getElementById('svodka_players_spfp_block');
    const achievements = document.createElement('div');
    achievements.innerHTML=`
    <p class="stat_title">Личные достижения</p>
    <div class="svodka_achievements">
        <div class="achievements_text">
            <p>Наибольшее число матчей в основе: <span class="bold">${"Игрок1"}</span></p>
            <p>Наибольшее число побед в основе: <span class="bold">${"Игрок1"}</span></p>
            <p>Наибольшее процент набранных очков: <span class="bold">${"Игрок1"}</span></p>
            <p>Наибольшее число попаданий в ТОП100: <span class="bold">${"Игрок2"}</span></p>
            <p>Наивысший результат в общем зачете: <span class="bold">${"Игрок2"}</span></p>
            <p>Наивысший средний результат в общем зачете: <span class="bold">${"Игрок2"}</span></p>
            <p>Наивысший результат по общему числу ФО: <span class="bold">${"Игрок2"}</span></p>
            <p>Лучший новичок: <span class="bold">${"Игрок3"}</span></p>
            <p>Лучший прогресс за сезон: <span class="bold">${"Игрок2"}</span></p>
        </div>
        <div class="trophies" id="achievements"></div>
    </div>`
    //доделать цикл после получения статы
    block.append(achievements);
    let badge = document.createElement('div');
    badge.className="badge";
    badge.title = "VGR22.Россия"
    let badge_left = document.createElement('div');
    badge_left.className="badge_left";
    let flag = document.createElement('div');
    flag.className="flag en";
    badge_left.appendChild(flag);
    let season = document.createElement('span');
    season.className="season";
    season.innerText = "16/17";
    badge_left.appendChild(season);
    badge.appendChild(badge_left);
    let badge_center = document.createElement('div');
    badge_center.className="badge_center gold";
    badge_center.innerText="1";
    badge.appendChild(badge_center);
    let badge_right = document.createElement('div');
    badge_right.className="badge_right silver_bcg";
    let nick = document.createElement('p');
    nick.className="nick";
    nick.innerText = "VRG22";
    badge_right.appendChild(nick);
    let champ = document.createElement('p');
    champ.className="champ";
    champ.innerText = "Премьер-Лига";
    badge_right.appendChild(champ);
    badge.appendChild(badge_right);
    document.getElementById('achievements').appendChild(badge);

}

const labelImages = [
    'https://s5o.ru/storage/simple/ru/edt/77/67/63/80/rueda85fa80f7.png',
    'https://s5o.ru/storage/simple/ru/edt/79/43/f0/e5/rue3c19a797c5.jpg',
    'https://s5o.ru/storage/simple/ru/edt/b7/ae/c8/d2/rue2115022372.jpg',
    'https://s5o.ru/storage/simple/ru/edt/fd/6b/60/cc/rue5348097547.jpg',
    'https://s5o.ru/storage/simple/ru/edt/2c/5a/63/a8/ruec39af23db2.png',
    'https://s5o.ru/storage/simple/ru/edt/83/4a/6a/da/rue3d84a06084.jpg',
    'https://s5o.ru/storage/simple/ru/edt/4a/49/62/d7/rue4c942938a2.jpg',
    'https://s5o.ru/storage/simple/ru/edt/60/ef/da/41/ruef316106fab.jpg',
    'https://s5o.ru/storage/simple/ru/edt/f9/a2/da/33/rue58738f2a8d.jpg',
    'https://s5o.ru/storage/simple/ru/edt/07/ed/9e/e1/ruefd758d30ee.jpg',
    'https://s5o.ru/storage/simple/ru/edt/90/70/32/47/rue57eae276d8.jpg',
    'https://s5o.ru/storage/simple/ru/edt/90/70/32/47/rue57eae276d8.jpg',
    'https://s5o.ru/storage/simple/ru/edt/28/04/8b/34/rueea6561abe1.jpg',
    'https://s5o.ru/storage/simple/ru/edt/18/36/93/26/rue7b8f14fb68.jpg',
    'https://s5o.ru/storage/simple/ru/edt/18/36/93/26/rue7b8f14fb68.jpg',
    'https://s5o.ru/storage/simple/ru/edt/e1/28/98/6d/ruefdb7d07651.png',
    'https://s5o.ru/storage/simple/ru/edt/e1/28/98/6d/ruefdb7d07651.png',
    'https://s5o.ru/storage/dumpster/f/65/62d0a2bd2f14d1af60938b30ceac7.png',
    'https://s5o.ru/storage/dumpster/c/a2/870be44226899e5e8a0a91ae24ec3.png',
    'https://s5o.ru/storage/simple/ru/edt/19/71/df/4a/rue12c9362597.jpg'
]
const champs_full = ['Англия', 'Россия', 'Испания', 'Германия', 'Италия', 'Франция', 'Чемпионшип','Нидерланды', 'Турция', 'Португалия', 'Мексика Апертура', 'Мексика Клаусура', 'Южная Корея', 'Лига Чемпионов', 'Лига Чемпионов ПО', 'Лига Европы', 'Лига Европы ПО', 'Чемпионат Мира', 'Чемпионат Европы', 'Кубок Америки']
function updateSvodkaPLayersStat(final_res_date_filter, default_header, diff_tournaments, ffc) {
    const block = document.getElementById('svodka_players_stat');
    block.innerHTML='<p class="stat_title">Статистика игроков</p><select class="svodka_players_ffc" id="svodka_players_ffc"></select><div class="canvas_radar"><canvas id="radar-chart" style="display: block;width: 200px;height: 150px;"></canvas></div>';
    
    for (let i=0; i<11/* должно быть по кол-ву игроков в франшизе*/; i+=1) {
        document.getElementById('svodka_players_ffc').innerHTML += `<option>Игрок ${i+1}</option>`
    }
    let current_champs = [];
    let current_images = [];
    let current_champs_full = [];
    for (let i=1;i<default_header.length; i+=1) {
        if (diff_tournaments.indexOf(default_header[i]) == -1) {
            current_champs.push(default_header[i]);
            current_images.push(labelImages[i-1]);
            current_champs_full.push(champs_full[i-1]);
        }
    }
    let marksCanvas = document.getElementById("radar-chart");
    let marksData = {
        labels: current_champs,
        datasets: [{
            backgroundColor: "transparent",
            borderColor: "red",
            fill: "start",
            backgroundColor: 'rgba(0, 99, 132, 0.2)',
            pointRadius: 3,
            pointHitRadius: 12,
            pointBorderWidth: 3,
            pointBackgroundColor: "pink",
            pointBorderColor: "black",
            pointHoverRadius: 5,
            pointStyle: "triangle",
            data: [0, 2, 5, 3.4, 8, 6.9, 5.5 ,0.1, 2, 5, 3.4, 2.7, 6.9, 7.8]
        }]
    };

    let chartOptions = {
        plugins: {
            legend: {
            display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let place = 0;
                        if (context.parsed.r != 15){
                            place += Math.ceil(Math.pow(2.5,context.parsed.r));
                            return `${current_champs_full[current_champs.indexOf(context.label)]}. Место: ${place}`;
                        } else return '';
                    }
                }
            },
        },
        scales: {
            r: {
                max: 11,
                min: 0,
                reverse:true,
                ticks: {
                    display: false,
                    stepSize: 1,
                    backdropColor: "orange",
                    color: "white"
                },
                grid: {
                    color: "black"
                },
                pointLabels: {
                    font: {
                        size: 20,
                    },
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    };

    let radarChart = new Chart(marksCanvas, {
    type: 'radar',
    plugins: [
        {
        id: 'Label images',
        beforeDraw: (chart) => {
            for (const i in chart.scales.r._pointLabelItems) {
                const point = chart.scales.r._pointLabelItems[i];
                var image = new Image();
                image.style.zIndex = "-1";
                image.src = labelImages[default_header.indexOf(chart.scales.r._pointLabels[i])-1];
                let move = [0,0] 
                if (i==0 ) move = [-25,-25];
                else if (i == chart.scales.r._pointLabelItems.length/2) move = [-25,5];
                else if (i<chart.scales.r._pointLabelItems.length/2) move = [5,-25+30*i/(chart.scales.r._pointLabelItems.length/2)]
                else if (i>chart.scales.r._pointLabelItems.length/2) move = [-50,5-30*(i-chart.scales.r._pointLabelItems.length/2)/(chart.scales.r._pointLabelItems.length/2)]
                chart.ctx.drawImage(image, point.x+move[0], point.y+move[1], 50, 50);
                }
            }
        }
    ],
    data: marksData,
    options: chartOptions
    });
}
function updateSvodkaTournamentsStat(final_res_date_filter, default_header, diff_tournaments, ffc) {
    const block = document.getElementById('svodka_tournaments_stat');
    let width = document.getElementById('svodka_tournaments_stat').offsetWidth;
    block.innerHTML='<p class="stat_title">Статистика турниров</p><table class="supertable svodka_tournaments" id="svodka_tournaments"></table>';
    const table = document.getElementById('svodka_tournaments');
    const header = [`Турнир`,'Дивизион', "Место", "Win", "Tie", "Loss", "% очков", "EGF", "Князев", "Анисимов", "Кубок", "Серии чемпионат", "Серии кубок"];
    let diff_tournaments_new = Array.from(diff_tournaments);
    if (menu_dates[6].classList=='nav_item2 selected') diff_tournaments_new.push('UEL','UEL-PO');
    let current_champs = [];
    let current_images = [];
    let current_champs_full = [];
    for (let i=1;i<default_header.length; i+=1) {
        if (diff_tournaments_new.indexOf(default_header[i]) == -1) {
            current_champs.push(default_header[i]);
            current_images.push(labelImages[i-1]);
            current_champs_full.push(champs_full[i-1]);
        }
    }
    for (let i=0; i<default_header.length-diff_tournaments_new.length+1; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<header.length+6; j+=1) {
            const td = tr.insertCell();
            if (i===0 && j<11) {
                td.appendChild(document.createTextNode(`${header[j]}`));
                td.className = 'maincell';
                td.width = j==0? `${0.12*width}px`: j==1? `${0.11*width}px`: j<6? `${0.035*width}px`: j<9? `${0.05*width}px`: j==9? `${0.055*width}px`:`${0.035*width}px`;
                td.rowSpan = 2;
            } else if (i===0 && j>10&&j<13) {
                td.appendChild(document.createTextNode(`${header[j]}`));
                td.className = 'maincell';
                td.width =`${0.17*width}px`
                td.colSpan = 4;
            } else if (i===1 && (j==0||j==4)) {
                td.appendChild(document.createTextNode(`W`));
                td.className = 'maincell';
            } else if (i===1 && (j==1||j==5)) {
                td.appendChild(document.createTextNode(`WT`));
                td.className = 'maincell';
            } else if (i===1 && (j==2||j==6)) {
                td.appendChild(document.createTextNode(`TL`));
                td.className = 'maincell';
            } else if (i===1 && (j==3||j==7)) {
                td.appendChild(document.createTextNode(`L`));
                td.className = 'maincell';
            } else if (j===0 && i>1) {
                td.appendChild(document.createTextNode(`${current_champs_full[i-2]}`));
                td.className = 'maincell';
            } else if (j===1 && i>1) {
                const div = `${current_champs[i-2].toLowerCase()}_div`
                const pos = `${current_champs[i-2].toLowerCase()}_pos`
                const franchise = final_res_date_filter.knyazev.filter((el)=>el.team == ffc);
                const grades = final_res_date_filter.upgrades[0];
                if (franchise[0][div]) {
                    let division = franchise[0][div] == 1? "Высшая Лига": franchise[0][div] == 2? "Первый Дивизион": franchise[0][div] == 3? "Второй Дивизион": "";
                    td.appendChild(document.createTextNode(`${division}`));
                    if (franchise[0][pos] && franchise[0][div]) {
                        const up = `${current_champs[i-2].toLowerCase()}_${franchise[0][div]}_upgrade`;
                        const down = `${current_champs[i-2].toLowerCase()}_${franchise[0][div]}_downgrade`;
                        if (grades[up] || grades[down]) {
                            if (Number(franchise[0][pos])<= Number(grades[up])) td.innerHTML = `${division}  <span class="green_status bold">↑</span>`;
                            else if (Number(franchise[0][pos])>= Number(grades[down])) td.innerHTML = `${division}  <span class="red_status bold">↓</span>`;
                            else td.innerHTML = `${division}`;
                        } 
                    };
                };
                td.className = 'supercell';
            } else if (j===2 && i>1) {
                const pos = `${current_champs[i-2].toLowerCase()}_pos`
                const franchise = final_res_date_filter.knyazev.filter((el)=>el.team == ffc);
                if (franchise[0][pos]) {
                    franchise[0][pos] >= 1 ? td.appendChild(document.createTextNode(`${franchise[0][pos]}`)) : td.appendChild(document.createTextNode(``))
                };
                td.className = 'supercell';
            } else if (j===3 && i>1) {
                const win = `${current_champs[i-2].toLowerCase()}_w`
                const proc = `${current_champs[i-2].toLowerCase()}_proc`
                const franchise = final_res_date_filter.wtl.filter((el)=>el.team == ffc);
                if (franchise[0][win]) {
                    franchise[0][proc] != "" ? td.appendChild(document.createTextNode(`${franchise[0][win]}`)) : td.appendChild(document.createTextNode(``))
                };
                td.className = 'supercell';
            } else if (j===4 && i>1) {
                const tie = `${current_champs[i-2].toLowerCase()}_t`
                const proc = `${current_champs[i-2].toLowerCase()}_proc`
                const franchise = final_res_date_filter.wtl.filter((el)=>el.team == ffc);
                if (franchise[0][tie]) {
                    franchise[0][proc] != "" ? td.appendChild(document.createTextNode(`${franchise[0][tie]}`)) : td.appendChild(document.createTextNode(``))
                };
                td.className = 'supercell';
            } else if (j===5 && i>1) {
                const lose = `${current_champs[i-2].toLowerCase()}_l`
                const proc = `${current_champs[i-2].toLowerCase()}_proc`
                const franchise = final_res_date_filter.wtl.filter((el)=>el.team == ffc);
                if (franchise[0][lose]) {
                    franchise[0][proc] != "" ? td.appendChild(document.createTextNode(`${franchise[0][lose]}`)) : td.appendChild(document.createTextNode(``))
                };
                td.className = 'supercell';
            } else if (j===6 && i>1) {
                const proc = `${current_champs[i-2].toLowerCase()}_proc`
                const franchise = final_res_date_filter.wtl.filter((el)=>el.team == ffc);
                if (franchise[0][proc]) {
                    franchise[0][proc] != "" ? td.appendChild(document.createTextNode(`${Math.round(Number(franchise[0][proc])*10000)/100} %`)) : td.appendChild(document.createTextNode(``))
                };
                td.className = 'supercell';
            } else if (j===7 && i>1) {
                const champ = `EGF_${current_champs[i-2].toLowerCase()}`
                let egf_sort = final_res_date_filter.egf.sort((a,b)=> b[champ] - a[champ]);
                let index = egf_sort.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                const franchise = final_res_date_filter.egf.filter((el)=>el.team == ffc);
                if (franchise[0][champ]) {
                    franchise[0][champ] != "" ? td.innerHTML = `${franchise[0][champ]}<br/><span class="medium">(${index} место)</span>` : td.appendChild(document.createTextNode(``))
                };
                td.className = 'supercell';
            } else if (j===8 && i>1) {
                const knyaz = `kn_${current_champs[i-2].toLowerCase()}`
                let kn_sort = final_res_date_filter.anaheim.sort((a,b)=> b[knyaz] - a[knyaz]);
                let index = kn_sort.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                const franchise = final_res_date_filter.anaheim.filter((el)=>el.team == ffc);
                if (franchise[0][knyaz]) {
                    franchise[0][knyaz] != "" ? td.innerHTML = `${franchise[0][knyaz]}<br/><span class="medium">(${index} место)</span>` : td.appendChild(document.createTextNode(``))
                };
                td.className = 'supercell';
            } else if (j===9 && i>1) {
                const anisimov = `${current_champs[i-2].toLowerCase()}_total`;
                let anisimov_sort = final_res_date_filter.anisimov.sort((a,b)=> b[anisimov] - a[anisimov]);
                let index = anisimov_sort.map(function (obj) { return obj.team; }).indexOf(ffc) + 1;
                const franchise = final_res_date_filter.anisimov.filter((el)=>el.team == ffc);
                if (franchise[0][anisimov]) {
                    franchise[0][anisimov] != "" ? td.innerHTML =`${franchise[0][anisimov]}<br/><span class="medium">(${index} место)</span>` : td.appendChild(document.createTextNode(``))
                };
                td.className = 'supercell';
            } else if (j===10 && i>1) {
                const cups = `cup_${current_champs[i-2].toLowerCase()}`
                const franchise = final_res_date_filter.cup_elimination.filter((el)=>el.team == ffc);
                if (franchise[0][cups]) {
                    isNaN(franchise[0][cups]) ? td.appendChild(document.createTextNode(`${franchise[0][cups]}`)) : td.appendChild(document.createTextNode(`${franchise[0][cups]} место`))
                };
                td.className = 'supercell';
            } else if (j===11 && i>1) {
                const champ = current_champs_full[i-2]+" чемпионат_max";
                const div = `${current_champs[i-2].toLowerCase()}_div`;
                const franchise = final_res_date_filter.knyazev.filter((el)=>el.team == ffc);
                const franchise_2 = final_res_date_filter.win_series.filter((el)=>el.team == ffc);
                if (franchise[0][div]!="-" && franchise_2[0][champ]) {
                    final_res_date_filter.win_series.sort((a,b)=>Number(b[champ][0])-Number(a[champ][0]));
                    td.innerHTML =`${franchise_2[0][champ][0]}<br/><span class="medium">(${final_res_date_filter.win_series.findIndex(el=>el.team == ffc)+1} место)</span>`
                }
                td.className = 'supercell';
            } else if (j===12 && i>1) {
                const champ = current_champs_full[i-2]+" чемпионат_max";
                const div = `${current_champs[i-2].toLowerCase()}_div`;
                const franchise = final_res_date_filter.knyazev.filter((el)=>el.team == ffc);
                const franchise_2 = final_res_date_filter.win_series.filter((el)=>el.team == ffc);
                if (franchise[0][div]!="-" && franchise_2[0][champ]) {
                    final_res_date_filter.win_series.sort((a,b)=>Number(b[champ][1])-Number(a[champ][1]));
                    td.innerHTML =`${franchise_2[0][champ][1]}<br/><span class="medium">(${final_res_date_filter.win_series.findIndex(el=>el.team == ffc)+1} место)</span>`
                }
                td.className = 'supercell';
            } else if (j===13 && i>1) {
                const champ = current_champs_full[i-2]+" чемпионат_max";
                const div = `${current_champs[i-2].toLowerCase()}_div`;
                const franchise = final_res_date_filter.knyazev.filter((el)=>el.team == ffc);
                const franchise_2 = final_res_date_filter.win_series.filter((el)=>el.team == ffc);
                if (franchise[0][div]!="-" && franchise_2[0][champ]) {
                    final_res_date_filter.win_series.sort((a,b)=>Number(b[champ][2])-Number(a[champ][2]));
                    td.innerHTML =`${franchise_2[0][champ][2]}<br/><span class="medium">(${final_res_date_filter.win_series.findIndex(el=>el.team == ffc)+1} место)</span>`
                }
                td.className = 'supercell';
            } else if (j===14 && i>1) {
                const champ = current_champs_full[i-2]+" чемпионат_max";
                const div = `${current_champs[i-2].toLowerCase()}_div`;
                const franchise = final_res_date_filter.knyazev.filter((el)=>el.team == ffc);
                const franchise_2 = final_res_date_filter.win_series.filter((el)=>el.team == ffc);
                if (franchise[0][div]!="-" && franchise_2[0][champ]) {
                    final_res_date_filter.win_series.sort((a,b)=>Number(b[champ][3])-Number(a[champ][3]));
                    td.innerHTML =`${franchise_2[0][champ][3]}<br/><span class="medium">(${final_res_date_filter.win_series.findIndex(el=>el.team == ffc)+1} место)</span>`
                }
                td.className = 'supercell';
            } else if (j===15 && i>1) {
                const champ = current_champs_full[i-2]+" кубок_max";
                const cups = `cup_${current_champs[i-2].toLowerCase()}`
                const next_cups = `cup_${current_champs[i-1]?current_champs[i-1].toLowerCase():0}`
                const franchise = final_res_date_filter.cup_elimination.filter((el)=>el.team == ffc);
                const franchise_2 = final_res_date_filter.win_series.filter((el)=>el.team == ffc);
                if ((franchise[0][cups]||(franchise[0][next_cups]&&(champ=="Лига Чемпионов кубок_max"||champ=="Лига Европы кубок_max"))) && franchise_2[0][champ]) {
                    final_res_date_filter.win_series.sort((a,b)=>Number(b[champ][0])-Number(a[champ][0]));
                    td.innerHTML =`${franchise_2[0][champ][0]}<br/><span class="medium">(${final_res_date_filter.win_series.findIndex(el=>el.team == ffc)+1} место)</span>`
                }
                td.className = 'supercell';
            } else if (j===16 && i>1) {
                const champ = current_champs_full[i-2]+" кубок_max";
                const cups = `cup_${current_champs[i-2].toLowerCase()}`
                const next_cups = `cup_${current_champs[i-1]?current_champs[i-1].toLowerCase():0}`
                const franchise = final_res_date_filter.cup_elimination.filter((el)=>el.team == ffc);
                const franchise_2 = final_res_date_filter.win_series.filter((el)=>el.team == ffc);
                if ((franchise[0][cups]||(franchise[0][next_cups]&&(champ=="Лига Чемпионов кубок_max"||champ=="Лига Европы кубок_max"))) && franchise_2[0][champ]) {
                    final_res_date_filter.win_series.sort((a,b)=>Number(b[champ][1])-Number(a[champ][1]));
                    td.innerHTML =`${franchise_2[0][champ][1]}<br/><span class="medium">(${final_res_date_filter.win_series.findIndex(el=>el.team == ffc)+1} место)</span>`
                }
                td.className = 'supercell';
            } else if (j===17 && i>1) {
                const champ = current_champs_full[i-2]+" кубок_max";
                const cups = `cup_${current_champs[i-2].toLowerCase()}`
                const next_cups = `cup_${current_champs[i-1]?current_champs[i-1].toLowerCase():0}`
                const franchise = final_res_date_filter.cup_elimination.filter((el)=>el.team == ffc);
                const franchise_2 = final_res_date_filter.win_series.filter((el)=>el.team == ffc);
                if ((franchise[0][cups]||(franchise[0][next_cups]&&(champ=="Лига Чемпионов кубок_max"||champ=="Лига Европы кубок_max"))) && franchise_2[0][champ]) {
                    final_res_date_filter.win_series.sort((a,b)=>Number(b[champ][2])-Number(a[champ][2]));
                    td.innerHTML =`${franchise_2[0][champ][2]}<br/><span class="medium">(${final_res_date_filter.win_series.findIndex(el=>el.team == ffc)+1} место)</span>`
                }
                td.className = 'supercell';
            } else if (j===18 && i>1) {
                const champ = current_champs_full[i-2]+" кубок_max";
                const cups = `cup_${current_champs[i-2].toLowerCase()}`
                const next_cups = `cup_${current_champs[i-1]?current_champs[i-1].toLowerCase():0}`
                const franchise = final_res_date_filter.cup_elimination.filter((el)=>el.team == ffc);
                const franchise_2 = final_res_date_filter.win_series.filter((el)=>el.team == ffc);
                if ((franchise[0][cups]||(franchise[0][next_cups]&&(champ=="Лига Чемпионов кубок_max"||champ=="Лига Европы кубок_max"))) && franchise_2[0][champ]) {
                    final_res_date_filter.win_series.sort((a,b)=>Number(b[champ][3])-Number(a[champ][3]));
                    td.innerHTML =`${franchise_2[0][champ][3]}<br/><span class="medium">(${final_res_date_filter.win_series.findIndex(el=>el.team == ffc)+1} место)</span>`
                }
                td.className = 'supercell';
            }
        }
    }
    const winners = document.createElement('div');
    winners.innerHTML='<p class="stat_title">Награды</p><div class="trophies" id="trophies"></div>';
    block.append(winners);
    for (let i=1; i<default_header.length-diff_tournaments_new.length; i+=1) {
        let tournament = final_res_date_filter.cups.filter((el)=>el.champ == current_champs[i-1].toLowerCase())[0];
        if (tournament && tournament.place1_1 == ffc) document.getElementById('trophies').innerHTML += `<div title="${current_champs_full[i-1]}. Высшая Лига. 1 место" class="${tournament.champ}_cup cup_box"><span class="round">В</span></div>`
        else if (tournament && tournament.place2_1 == ffc) document.getElementById('trophies').innerHTML += `<div title="${current_champs_full[i-1]}. Первый дивизион. 1 место" class="${tournament.champ}_cup cup_box"><span class="round">1</span></div>`
        else if (tournament && tournament.place3_1 == ffc) document.getElementById('trophies').innerHTML += `<div title="${current_champs_full[i-1]}. Второй дивизион. 1 место" class="${tournament.champ}_cup cup_box"><span class="round">2</span></div>`
        if (tournament && tournament.cup_1 == ffc) document.getElementById('trophies').innerHTML += `<div title="${current_champs_full[i-1]}. Кубок" class="${tournament.champ}_cup_cup cup_box"><span class="round">К</span></div>`
    }
}
let enemies = [];
let score_results = [];
let filter_opponent = ['0'];
let opponents = []
function updateSvodkaMatches(final_res_date_filter, ffc, opponents_sorting) {
    enemies = [];
    score_results = [];
    const matches = final_res_date_filter.matches.filter((el)=>(el.team1 == ffc || el.team2 == ffc));
    opponents = [];
    for (let i=0; i<matches.length; i+=1) {
        if (matches[i].team1 == ffc) {
            if (opponents.filter((el)=>el.enemy == matches[i].team2).length == 0) {
                opponents.push({"enemy":matches[i].team2,"frequency":1,"win":0,"tie":0,"lose":0});
                Number(matches[i].score1) > Number(matches[i].score2)? opponents[opponents.length-1].win+=1 : Number(matches[i].score1) < Number(matches[i].score2)? opponents[opponents.length-1].lose+=1 : opponents[opponents.length-1].tie +=1;
            } else {
                opponents[opponents.findIndex(el=>el.enemy == matches[i].team2)].frequency +=1
                Number(matches[i].score1) > Number(matches[i].score2)? opponents[opponents.findIndex(el=>el.enemy == matches[i].team2)].win +=1 : Number(matches[i].score1) < Number(matches[i].score2)? opponents[opponents.findIndex(el=>el.enemy == matches[i].team2)].lose +=1 : opponents[opponents.findIndex(el=>el.enemy == matches[i].team2)].tie +=1
            }
            if (filter_opponent[0] == '0') score_results.push(`${matches[i].score1}-${matches[i].score2}`)
            else if (filter_opponent[0] == matches[i].team2) score_results.push(`${matches[i].score1}-${matches[i].score2}`)
        } else if (matches[i].team2 == ffc) {
            if (opponents.filter((el)=>el.enemy == matches[i].team1).length == 0) {
                opponents.push({"enemy":matches[i].team1,"frequency":1,"win":0,"tie":0,"lose":0});
                Number(matches[i].score2) > Number(matches[i].score1)? opponents[opponents.length-1].win+=1 : Number(matches[i].score2) < Number(matches[i].score1)? opponents[opponents.length-1].lose+=1 : opponents[opponents.length-1].tie +=1;
            } else {
                opponents[opponents.findIndex(el=>el.enemy == matches[i].team1)].frequency +=1;
                Number(matches[i].score2) > Number(matches[i].score1)? opponents[opponents.findIndex(el=>el.enemy == matches[i].team1)].win +=1 : Number(matches[i].score2) < Number(matches[i].score1)? opponents[opponents.findIndex(el=>el.enemy == matches[i].team1)].lose +=1 : opponents[opponents.findIndex(el=>el.enemy == matches[i].team1)].tie +=1
            }
            if (filter_opponent[0] == '0') score_results.push(`${matches[i].score2}-${matches[i].score1}`)
            else if (filter_opponent[0] == matches[i].team1) score_results.push(`${matches[i].score2}-${matches[i].score1}`)
        }
    }
    const header = ['Матчи','Win','Tie','Lose','%'];
    if (opponents_sorting[0] == 0) {opponents.sort((a,b)=> b.frequency - a.frequency)}
    if (opponents_sorting[0] == 1) {opponents.sort((a,b)=> b.win - a.win)}
    if (opponents_sorting[0] == 2) {opponents.sort((a,b)=> b.tie - a.tie)}
    if (opponents_sorting[0] == 3) {opponents.sort((a,b)=> b.lose - a.lose)}
    if (opponents_sorting[0] == 4) {opponents.sort((a,b)=> (b.win*3 + b.tie)/3/b.frequency - (a.win*3 + a.tie)/3/a.frequency)}
    header[opponents_sorting[0]] += ' ↓';
    const block = document.getElementById('svodka_opponents_list');
    block.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'supertable svodka_opponents_table';
    for (let i=0; i<opponents.length+2; i+=1) {
        const tr = table.insertRow();
        tr.className = 'superrow';
        for (let j=0; j<6; j+=1) {
            const td = tr.insertCell();
            if (i===0 && j==0) {
                td.appendChild(document.createTextNode(`Соперники`));
                td.className = 'maincell';
                td.rowSpan = 2; 
            } else if (i===0 && j==1) {
                td.appendChild(document.createTextNode(`${ffc}`));
                td.className = 'maincell';
                td.colSpan = 5; 
            } else if (i===1 && j<5) {
                td.className = `maincell clickable`;
                if (j == opponents_sorting[0]) {td.className = `maincell clickable sorted`;}
                td.innerText = `${header[j]}`;
                td.addEventListener('click', (e)=>{
                    opponents_sorting[0] = j;
                    updateSvodkaMatches(final_res_date_filter, ffc, [j]);
                })
            } else if (i>1 && j==0) {
                td.className = 'supercell'
                td.style.width = '15vw';
                td.appendChild(document.createTextNode(`${opponents[i-2].enemy}`));
                enemies.push(opponents[i-2].enemy);
            } else if (i>1 && j==1) {
                td.className = 'supercell'
                td.appendChild(document.createTextNode(`${opponents[i-2].frequency}`));
            } else if (i>1 && j==2) {
                td.className = 'supercell'
                td.appendChild(document.createTextNode(`${opponents[i-2].win}`));
            } else if (i>1 && j==3) {
                td.className = 'supercell'
                td.appendChild(document.createTextNode(`${opponents[i-2].tie}`));
            } else if (i>1 && j==4) {
                td.className = 'supercell'
                td.appendChild(document.createTextNode(`${opponents[i-2].lose}`));
            } else if (i>1 && j==5) {
                td.className = 'supercell'
                const proc = Math.round((opponents[i-2].win*3 + opponents[i-2].tie)/3/opponents[i-2].frequency*1000)/10;
                proc >= 50? td.classList.add('green_td'):td.classList.add('red_td')
                td.appendChild(document.createTextNode(`${proc} %`));
            }
        }
    }
    block.append(table);
    enemies.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
}

function updateSvodkaMatchesResults(final_res_date_filter, ffc) {
    for (let i=0; i<enemies.length; i+=1) {
        document.getElementById('svodka_matches_scores_opponent').innerHTML += `<option>${enemies[i]}</option>`
    }
    if (filter_opponent[0]!='0') document.getElementById('svodka_matches_scores_opponent').value = filter_opponent[0]
    const scores = [{'-6':['0-6'],'-5':['0-5'],'-4':['1-5','0-4'],'-3':['1-4','0-3'],'-2':['2-4','1-3','0-2'],'-1':['2-3','1-2','0-1'],'0':['3-3','2-2','1-1','0-0'],'1':['3-2','2-1','1-0'],'2':['4-2','3-1','2-0'],'3':['4-1','3-0'],'4':['5-1','4-0'],'5':['5-0'],'6':['6-0']}];
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    for (let i=0;i<13;i+=1) {
        let diff = `${i-6}`
        if (scores[0][diff][0]) {
            data1.push(score_results.filter((el)=> el == scores[0][diff][0]).length);
        } else {
            data1.push(0);
        }
        if (scores[0][diff][1]) {
            data2.push(score_results.filter((el)=> el == scores[0][diff][1]).length);
        } else {
            data2.push(0);
        }
        if (scores[0][diff][2]) {
            data3.push(score_results.filter((el)=> el == scores[0][diff][2]).length);
        } else {
            data3.push(0);
        }
        if (scores[0][diff][3]) {
            data4.push(score_results.filter((el)=> el == scores[0][diff][3]).length);
        } else {
            data4.push(0);
        }
        
    }
    let chartStatus = Chart.getChart("scores-chart");
    if (chartStatus != undefined) {
    chartStatus.destroy();
    }
    let marksCanvas = document.getElementById("scores-chart");
    let marksData = {
        labels: [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6],
        datasets: [{
            data: data1
        },{
            data: data2
        },{
            data: data3
        },{
            data: data4
        },]
    };

    let chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.datasetIndex==0) return `${scores[0][context.dataIndex-6][0]}: ${context.parsed._stacks.y[context.datasetIndex]} шт.`;
                        if (context.datasetIndex==1) return `${scores[0][context.dataIndex-6][1]}: ${context.parsed._stacks.y[context.datasetIndex]} шт.`;
                        if (context.datasetIndex==2) return `${scores[0][context.dataIndex-6][2]}: ${context.parsed._stacks.y[context.datasetIndex]} шт.`;
                        if (context.datasetIndex==3) return `${scores[0][context.dataIndex-6][3]}: ${context.parsed._stacks.y[context.datasetIndex]} шт.`;
                    }
                }
            },
        },
        scales: {
            y: {
                stacked: true
            },
            x: {
                stacked: true
            }
        }
    };

    let radarChart = new Chart(marksCanvas, {
    type: 'bar',
    data: marksData,
    options: chartOptions
    });
    document.getElementById('svodka_matches_scores_opponent').addEventListener('change', ()=> {
        document.getElementById('svodka_matches_scores_opponent').value != "Все соперники"? filter_opponent[0] = document.getElementById('svodka_matches_scores_opponent').value: filter_opponent[0] = '0';
        radarChart.destroy()
        updateSvodkaMatches(final_res_date_filter, ffc, opponents_sorting);
        updateSvodkaMatchesResults(final_res_date_filter, ffc);
    })
    const facts = document.getElementById('svodka_matches_scores_facts');
    const index = final_res_date_filter.wtl.findIndex((el)=>el.team == ffc);
    facts.innerHTML = ` <p class="bold">${ffc}:</p>
                        <p>Матчей: <span class="bold">${Number(final_res_date_filter.wtl[index].total_w) + Number(final_res_date_filter.wtl[index].total_t) + Number(final_res_date_filter.wtl[index].total_l)}</span></p>
                        <p>Побед: <span class="bold">${Number(final_res_date_filter.wtl[index].total_w)}</span></p>
                        <p>Ничьих: <span class="bold">${Number(final_res_date_filter.wtl[index].total_t)}</span></p>
                        <p>Поражений: <span class="bold">${Number(final_res_date_filter.wtl[index].total_l)}</span></p>
                        <p>Процент набранных очков: <span class="bold">${Math.round((Number(final_res_date_filter.wtl[index].total_w)*3+Number(final_res_date_filter.wtl[index].total_t))/3/(Number(final_res_date_filter.wtl[index].total_w) + Number(final_res_date_filter.wtl[index].total_t) + Number(final_res_date_filter.wtl[index].total_l))*1000)/10} %</span></p>
                        <p>Самый частый соперник:               <span class="bold">${opponents.sort((a,b)=>b.frequency-a.frequency)[0].enemy}</span></p>
                        <p>Самый удобный соперник (>5 игр):    <span class="bold">${opponents.filter((el)=>el.frequency>4).length>0? opponents.filter((el)=>el.frequency>4).sort((a,b)=>b.frequency-a.frequency).sort((a,b)=> (b.win*3 + b.tie)/3/b.frequency - (a.win*3 + a.tie)/3/a.frequency)[0].enemy:""}</span></p>
                        <p>Самый удобный соперник:             <span class="bold">${opponents.sort((a,b)=>b.frequency-a.frequency).sort((a,b)=> (b.win*3 + b.tie)/3/b.frequency - (a.win*3 + a.tie)/3/a.frequency)[0].enemy}</span></p>
                        <p>Самый неудобный соперник (>5 игр):  <span class="bold">${opponents.filter((el)=>el.frequency>4).length>0? opponents.filter((el)=>el.frequency>4).sort((a,b)=>b.frequency-a.frequency).sort((a,b)=> (a.win*3 + a.tie)/3/a.frequency - (b.win*3 + b.tie)/3/b.frequency)[0].enemy:""}</span></p>
                        <p>Самый неудобный соперник:           <span class="bold">${opponents.sort((a,b)=>b.frequency-a.frequency).sort((a,b)=> (a.win*3 + a.tie)/3/a.frequency - (b.win*3 + b.tie)/3/b.frequency)[0].enemy}</span></p>
                        <p>Самый миролюбивый соперник:         <span class="bold">${opponents.sort((a,b)=>b.frequency-a.frequency).sort((a,b)=> b.tie - a.tie)[0].enemy}</span></p>
                        <p>Самый равный соперник (>5 игр):     <span class="bold">${opponents.filter((el)=>el.frequency>4).length>0? opponents.filter((el)=>el.frequency>4).sort((a,b)=>b.frequency-a.frequency).sort((a,b)=> Math.abs(0.5-(a.win*3 + a.tie)/3/a.frequency) - Math.abs(0.5-(b.win*3 + b.tie)/3/b.frequency))[0].enemy:""}</span></p>`
}

let svodka_elo_enemies = [];
function updateSvodkaEloGraph(final_res_date_filter, ffc) {
    document.getElementById('add_enemy_to_elo').outerHTML = document.getElementById('add_enemy_to_elo').outerHTML;
    document.getElementById('add_all_enemies_to_elo').outerHTML = document.getElementById('add_all_enemies_to_elo').outerHTML;
    document.getElementById('reset_elo').outerHTML = document.getElementById('reset_elo').outerHTML;
    document.getElementById('add_enemy_to_elo').addEventListener('click', ()=>{
        svodka_elo_enemies.push(document.getElementById('svodka_elo_opponent').value);
        updateSvodkaEloGraph(final_res_date_filter, ffc)
    })
    document.getElementById('add_all_enemies_to_elo').addEventListener('click', ()=>{
        for (let i=0; i<final_res_date_filter.teams.length; i+=1) {
            svodka_elo_enemies.push(final_res_date_filter.teams[i])
        }
        updateSvodkaEloGraph(final_res_date_filter, ffc)
    })
    document.getElementById('reset_elo').addEventListener('click', ()=>{
        svodka_elo_enemies = [];
        updateSvodkaEloGraph(final_res_date_filter, ffc)
    })
    let graphs_teams = Array.from(svodka_elo_enemies);
    graphs_teams.push(ffc);
    for (let i=0; i<final_res_date_filter.teams.length; i+=1) {
        if (final_res_date_filter.teams[i] != ffc) document.getElementById('svodka_elo_opponent').innerHTML += `<option>${final_res_date_filter.teams[i]}</option>`
    }
    graphs_teams = Array.from(new Set(graphs_teams));
    const index = final_res_date_filter.elo_distance.findIndex((el)=>el.team == ffc);
    let chartStatus = Chart.getChart("elo-chart");
    if (chartStatus != undefined) {
    chartStatus.destroy();
    }
    let marksCanvas = document.getElementById("elo-chart");
    let data_draw=[];
    for (let i=0; i<graphs_teams.length; i+=1) {
        const index = final_res_date_filter.elo_distance.findIndex((el)=>el.team == graphs_teams[i]);
        let obj = {};
        obj.data = final_res_date_filter.elo_distance[index].data;
        obj.label = final_res_date_filter.elo_distance[index].team;
        obj.fill = false;
        if (final_res_date_filter.elo_distance[index].team == ffc) {
            obj.borderColor = "red";
            obj.borderWidth = 5;
        } else {
            obj.borderColor = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
            obj.borderWidth = 2;
        }
        data_draw.push(obj)
        
    }
    let marksData = {
        labels: final_res_date_filter.elo_distance[0].data,
        datasets: data_draw
      };

    let chartOptions = {
        plugins: {
            legend: {
              display: data_draw.length > 9? false : true
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const index_day = final_res_date_filter.elo_distance[0].data.indexOf(context.label);
                        const index_team = final_res_date_filter.elo_distance.findIndex((el)=>el.team == context.dataset.label);
                        const elo_week = Math.round((final_res_date_filter.elo_distance[index_team].data[index_day-1] ? Number(final_res_date_filter.elo_distance[index_team].data[index_day]) - Number(final_res_date_filter.elo_distance[index_team].data[index_day-1]):final_res_date_filter.elo_distance[index_team].data[index_day])*100)/100;
                        const elo_month = Math.round((final_res_date_filter.elo_distance[index_team].data[index_day-4] ? Number(final_res_date_filter.elo_distance[index_team].data[index_day]) - Number(final_res_date_filter.elo_distance[index_team].data[index_day-4]):final_res_date_filter.elo_distance[index_team].data[index_day])*100)/100;
                        const elo_season = Math.round((Number(final_res_date_filter.elo_distance[index_team].data[index_day]) - Number(final_res_date_filter.elo_distance[index_team].data[0]))*100)/100;
                        let result = [
                        `FFC: ${context.dataset.label}`,
                        `Текущий Эло: ${final_res_date_filter.elo_distance[index_team].data[index_day]}`,
                        `За неделю: ${elo_week>0? "+"+elo_week: elo_week}`,
                        `За месяц: ${elo_month>0? "+"+elo_month: elo_month}`,
                        `За сезон: ${elo_season>0? "+"+elo_season: elo_season}`,
                    ]
                        return result;
                    }
                }
            },
        },
        
    };

    let radarChart = new Chart(marksCanvas, {
    type: 'line',
    data: marksData,
    options: chartOptions
    });
}

let svodka_procent_enemies = [];
function updateSvodkaPercentGraph(final_res_date_filter, ffc) {
    document.getElementById('add_enemy_to_procent').outerHTML = document.getElementById('add_enemy_to_procent').outerHTML;
    document.getElementById('add_all_enemies_to_procent').outerHTML = document.getElementById('add_all_enemies_to_procent').outerHTML;
    document.getElementById('reset_procent').outerHTML = document.getElementById('reset_procent').outerHTML;
    document.getElementById('add_enemy_to_procent').addEventListener('click', ()=>{
        svodka_procent_enemies.push(document.getElementById('svodka_procent_opponent').value);
        updateSvodkaPercentGraph(final_res_date_filter, ffc)
    })
    document.getElementById('add_all_enemies_to_procent').addEventListener('click', ()=>{
        for (let i=0; i<final_res_date_filter.teams.length; i+=1) {
            svodka_procent_enemies.push(final_res_date_filter.teams[i])
        }
        updateSvodkaPercentGraph(final_res_date_filter, ffc)
    })
    document.getElementById('reset_procent').addEventListener('click', ()=>{
        svodka_procent_enemies = [];
        updateSvodkaPercentGraph(final_res_date_filter, ffc)
    })
    let graphs_teams = Array.from(svodka_procent_enemies);
    graphs_teams.push(ffc);
    for (let i=0; i<final_res_date_filter.teams.length; i+=1) {
        if (final_res_date_filter.teams[i] != ffc) document.getElementById('svodka_procent_opponent').innerHTML += `<option>${final_res_date_filter.teams[i]}</option>`
    }
    graphs_teams = Array.from(new Set(graphs_teams));
    const index = final_res_date_filter.procent_distance.findIndex((el)=>el.team == ffc);
    let chartStatus = Chart.getChart("procent-chart");
    if (chartStatus != undefined) {
    chartStatus.destroy();
    }
    let marksCanvas = document.getElementById("procent-chart");
    let data_draw=[];
    for (let i=0; i<graphs_teams.length; i+=1) {
        const index = final_res_date_filter.procent_distance.findIndex((el)=>el.team == graphs_teams[i]);
        let obj = {};
        obj.data = final_res_date_filter.procent_distance[index].data2.map((el)=>Math.round(Number(el)*100)/100);
        obj.label = final_res_date_filter.procent_distance[index].team;
        obj.fill = false;
        if (final_res_date_filter.procent_distance[index].team == ffc) {
            obj.borderColor = "red";
            obj.borderWidth = 5;
        } else {
            obj.borderColor = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0");
            obj.borderWidth = 2;
        }
        data_draw.push(obj) 
    }
    let marksData = {
        labels: final_res_date_filter.procent_distance[0].data,
        datasets: data_draw
      };

    let chartOptions = {
        plugins: {
            legend: {
              display: data_draw.length > 9? false : true
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const index_month = final_res_date_filter.procent_distance[0].data.indexOf(context.label);
                        const index_team = final_res_date_filter.procent_distance.findIndex((el)=>el.team == context.dataset.label);
                        const w_month = final_res_date_filter.procent_distance[index_team].data[index_month-1]?(Number(final_res_date_filter.procent_distance[index_team].data[index_month].split('-')[0]) - Number(final_res_date_filter.procent_distance[index_team].data[index_month-1].split('-')[0])):Number(final_res_date_filter.procent_distance[index_team].data[index_month].split('-')[0]);
                        const t_month = final_res_date_filter.procent_distance[index_team].data[index_month-1]?(Number(final_res_date_filter.procent_distance[index_team].data[index_month].split('-')[1]) - Number(final_res_date_filter.procent_distance[index_team].data[index_month-1].split('-')[1])):Number(final_res_date_filter.procent_distance[index_team].data[index_month].split('-')[1]);
                        const l_month = final_res_date_filter.procent_distance[index_team].data[index_month-1]?(Number(final_res_date_filter.procent_distance[index_team].data[index_month].split('-')[2]) - Number(final_res_date_filter.procent_distance[index_team].data[index_month-1].split('-')[2])):Number(final_res_date_filter.procent_distance[index_team].data[index_month].split('-')[2]);
                        let result = [
                        `FFC: ${context.dataset.label}`,
                        `Всего: `,
                        `Победы: ${final_res_date_filter.procent_distance[index_team].data[index_month].split('-')[0]}`,
                        `Ничьи: ${final_res_date_filter.procent_distance[index_team].data[index_month].split('-')[1]}`, 
                        `Поражения: ${final_res_date_filter.procent_distance[index_team].data[index_month].split('-')[2]}`,
                        `Процент: ${context.raw} %`,
                        ``,
                        `За месяц: `,
                        `Победы: ${w_month}`,
                        `Ничьи: ${t_month}`,
                        `Поражения: ${l_month}`,
                        `Процент: ${Math.round((w_month*3+t_month)/3/(w_month+t_month+l_month)*10000)/100 || 0}%`    
                    ]
                        return result;
                    }
                }
            },
        },
        
    };

    let radarChart = new Chart(marksCanvas, {
    type: 'line',
    data: marksData,
    options: chartOptions
    });

    document.getElementById('svodka_long_block').style.height = document.getElementById('svodka_opponents_list').offsetHeight+"px";
}

// document.getElementById('records_menu').addEventListener('click',openRecords);
document.getElementById('records_?').addEventListener('click',showRecordsInfo);
function showRecordsInfo() {
    if (document.getElementById('records_info').style.display == 'none') {
        document.getElementById('records_info').style.display = 'block'
        document.getElementById('records_?').style.background = 'pink'
    } else {
        document.getElementById('records_info').style.display = 'none';
        document.getElementById('records_?').style.background = 'lightskyblue'
    }
}
function openRecords() {
    document.getElementById('menu_dates').classList.add('hide');
    document.getElementById('records_table').innerHTML=``;
    document.getElementById('records_table').classList.remove('hide');
    document.getElementById('history_?').classList.add('hide');
    fetch(`archive16_17.json`)
        .then(res => res.json())
        .then(data => {
            let table = document.getElementById('records_table');
            const table_records = document.createElement('table');
            table_records.className = 'supertable table_records';
            const tr = table_records.insertRow();
            tr.className = 'superrow';
            const td = tr.insertCell();
            td.colSpan = 5;
            td.className = 'maincell clickable';
            td.innerText = "2016/2017";
            td.addEventListener('click',(e)=>{
                const index = e.target.closest('tr').rowIndex;
                if (e.target.className == 'maincell clickable') {
                    e.target.className = 'maincell clickable clicked';
                    for (let i=0; i<(Object.keys(data.win_series[0]).length-1)/2+1; i+=1) {
                        document.querySelector("#records_table > table > tbody").rows[index +1 + i].classList.add('hide')
                    }
                } else {
                    e.target.className = 'maincell clickable';
                    for (let i=0; i<(Object.keys(data.win_series[0]).length-1)/2+1; i+=1) {
                        document.querySelector("#records_table > table > tbody").rows[index +1 + i].classList.remove('hide')
                    }
                }
                
            })
            header = ['Чемпионат','W','WT','TL','L'];
            for (let i=0; i<(Object.keys(data.win_series[0]).length-1)/2+1; i+=1) {
                const ordered = Object.keys(data.win_series[0]).sort().reduce((obj, key) => { 
                      obj[key] = data.win_series[0][key]; 
                      return obj;
                    },{}
                );
                const tr = table_records.insertRow();
                const champ = Object.keys(ordered)[2*i];
                for (let j=0; j<5; j+=1) {
                    const td = tr.insertCell();
                    td.className= "supercell";
                    if (i==0) {
                        td.innerText = header[j];
                        td.className="maincell";
                    } else if (j==0 && i>0) {
                        td.innerText = champ.split('_max')[0].split('_current')[0];
                        td.className="maincell";
                        td.width = '20%';
                    } else if (j==1 && i>0) {
                        td.innerHTML = `<p>${data.win_series.sort((a,b)=>Number(b[champ][0])-Number(a[champ][0]))[0].team} (${data.win_series.sort((a,b)=>Number(b[champ][0])-Number(a[champ][0]))[0][champ][0]})</p>`;
                        td.width = '20%';
                    } else if (j==2 && i>0) {
                        td.innerHTML = `<p>${data.win_series.sort((a,b)=>Number(b[champ][1])-Number(a[champ][1]))[0].team} (${data.win_series.sort((a,b)=>Number(b[champ][1])-Number(a[champ][1]))[0][champ][1]})</p>`;
                        td.width = '20%';
                    } else if (j==3 && i>0) {
                        td.innerHTML = `<p>${data.win_series.sort((a,b)=>Number(b[champ][2])-Number(a[champ][2]))[0].team} (${data.win_series.sort((a,b)=>Number(b[champ][2])-Number(a[champ][2]))[0][champ][2]})</p>`;
                        td.width = '20%';
                    } else if (j==4 && i>0) {
                        td.innerHTML = `<p>${data.win_series.sort((a,b)=>Number(b[champ][3])-Number(a[champ][3]))[0].team} (${data.win_series.sort((a,b)=>Number(b[champ][3])-Number(a[champ][3]))[0][champ][3]})</p>`
                        td.width = '20%';
                    }
                }
            }
            table.appendChild(table_records);
        })
}

function openTrophy() {

}

// document.getElementById('header_text').addEventListener('click', getRecordWins);
function getRecordWins() {
    fetch(`archive16_17.json`)
        .then(res => res.json())
        .then(data => {
            final_res_date_filter = Array.from(data.matches);
            let tournaments = ['Мексика Апертура чемпионат', 'Мексика Апертура кубок', 'Россия чемпионат', 'Голландия чемпионат', 'Чемпионшип чемпионат', 'Франция чемпионат', 'Португалия чемпионат', 'Англия чемпионат', 'Турция чемпионат', 'Испания чемпионат', 'Италия чемпионат', 'Германия чемпионат', 'Лига Чемпионов кубок', 'Англия кубок', 'Россия кубок', 'Германия кубок', 'Мексика Клаусура чемпионат', 'Италия кубок', 'Турция кубок', 'Голландия кубок', 'Португалия кубок', 'Испания кубок', 'Мексика Клаусура кубок', 'Франция кубок', 'Чемпионшип кубок', 'Лига Чемпионов ПО кубок'];
            // Получение списка турниров:
            // let tournaments = [];
            // for (let i=0; i<final_res_date_filter.length; i+=1) {
            //     tournaments.push(final_res_date_filter[i].competition)
            // }
            // tournaments = Array.from(new Set(tournaments));
            // console.log (tournaments);
            let ffc_database = [];
            for (let i=0; i<data.teams.length; i+=1) {
                ffc_database.push({});
                ffc_database[i].team = data.teams[i];
                for (let j=0; j<tournaments.length; j+=1) {
                    let current = tournaments[j]+"_current"
                    let max = tournaments[j]+"_max"
                    ffc_database[i][current] = [0,0,0,0];
                    ffc_database[i][max] = [0,0,0,0];
                }
            }
            for (let i=0; i<final_res_date_filter.length; i+=1) {
                const index1 = ffc_database.findIndex(el=>el.team.toLowerCase() == final_res_date_filter[i].team1.toLowerCase());
                const index2 = ffc_database.findIndex(el=>el.team.toLowerCase() == final_res_date_filter[i].team2.toLowerCase());
                let current_champ =  final_res_date_filter[i].competition + "_current";
                let max_champ =  final_res_date_filter[i].competition + "_max";
                if(final_res_date_filter[i].diff>0) {
                    ffc_database[index1][current_champ][0] +=1;
                    ffc_database[index1][current_champ][1] +=1;
                    if (ffc_database[index1][max_champ][0] < ffc_database[index1][current_champ][0]) ffc_database[index1][max_champ][0] = ffc_database[index1][current_champ][0];
                    if (ffc_database[index1][max_champ][1] < ffc_database[index1][current_champ][1]) ffc_database[index1][max_champ][1] = ffc_database[index1][current_champ][1];
                    ffc_database[index2][current_champ][2] +=1;
                    ffc_database[index2][current_champ][3] +=1;
                    if (ffc_database[index2][max_champ][2] < ffc_database[index2][current_champ][2]) ffc_database[index2][max_champ][2] = ffc_database[index2][current_champ][2];
                    if (ffc_database[index2][max_champ][3] < ffc_database[index2][current_champ][3]) ffc_database[index2][max_champ][3] = ffc_database[index2][current_champ][3];
                    
                    if (ffc_database[index2][max_champ][0] < ffc_database[index2][current_champ][0]) ffc_database[index2][max_champ][0] = ffc_database[index2][current_champ][0];
                    if (ffc_database[index2][max_champ][1] < ffc_database[index2][current_champ][1]) ffc_database[index2][max_champ][1] = ffc_database[index2][current_champ][1];
                    ffc_database[index2][current_champ][0] = 0;
                    ffc_database[index2][current_champ][1] = 0;
                    if (ffc_database[index1][max_champ][2] < ffc_database[index1][current_champ][2]) ffc_database[index1][max_champ][2] = ffc_database[index1][current_champ][2];
                    if (ffc_database[index1][max_champ][3] < ffc_database[index1][current_champ][3]) ffc_database[index1][max_champ][3] = ffc_database[index1][current_champ][3];
                    ffc_database[index1][current_champ][2] = 0;
                    ffc_database[index1][current_champ][3] = 0;
                } else if (final_res_date_filter[i].diff<0) {
                    if (ffc_database[index1][max_champ][0] < ffc_database[index1][current_champ][0]) ffc_database[index1][max_champ][0] = ffc_database[index1][current_champ][0];
                    if (ffc_database[index1][max_champ][1] < ffc_database[index1][current_champ][1]) ffc_database[index1][max_champ][1] = ffc_database[index1][current_champ][1];
                    ffc_database[index1][current_champ][0] = 0;
                    ffc_database[index1][current_champ][1] = 0;
                    if (ffc_database[index2][max_champ][2] < ffc_database[index2][current_champ][2]) ffc_database[index2][max_champ][2] = ffc_database[index2][current_champ][2];
                    if (ffc_database[index2][max_champ][3] < ffc_database[index2][current_champ][3]) ffc_database[index2][max_champ][3] = ffc_database[index2][current_champ][3];
                    ffc_database[index2][current_champ][2] = 0;
                    ffc_database[index2][current_champ][3] = 0;

                    ffc_database[index2][current_champ][0] +=1;
                    ffc_database[index2][current_champ][1] +=1;
                    if (ffc_database[index2][max_champ][0] < ffc_database[index2][current_champ][0]) ffc_database[index2][max_champ][0] = ffc_database[index2][current_champ][0];
                    if (ffc_database[index2][max_champ][1] < ffc_database[index2][current_champ][1]) ffc_database[index2][max_champ][1] = ffc_database[index2][current_champ][1];
                    ffc_database[index1][current_champ][2] +=1;
                    ffc_database[index1][current_champ][3] +=1;
                    if (ffc_database[index1][max_champ][2] < ffc_database[index1][current_champ][2]) ffc_database[index1][max_champ][2] = ffc_database[index1][current_champ][2];
                    if (ffc_database[index1][max_champ][3] < ffc_database[index1][current_champ][3]) ffc_database[index1][max_champ][3] = ffc_database[index1][current_champ][3];
                }  else if (final_res_date_filter[i].diff==0) {
                    if (ffc_database[index1][max_champ][0] < ffc_database[index1][current_champ][0]) ffc_database[index1][max_champ][0] = ffc_database[index1][current_champ][0];
                    if (ffc_database[index1][max_champ][3] < ffc_database[index1][current_champ][3]) ffc_database[index1][max_champ][3] = ffc_database[index1][current_champ][3];
                    ffc_database[index1][current_champ][0] = 0;
                    ffc_database[index1][current_champ][3] = 0;
                    if (ffc_database[index2][max_champ][0] < ffc_database[index2][current_champ][0]) ffc_database[index2][max_champ][0] = ffc_database[index2][current_champ][0];
                    if (ffc_database[index2][max_champ][3] < ffc_database[index2][current_champ][3]) ffc_database[index2][max_champ][3] = ffc_database[index2][current_champ][3];
                    ffc_database[index2][current_champ][0] = 0;
                    ffc_database[index2][current_champ][3] = 0;

                    ffc_database[index2][current_champ][2] +=1;
                    ffc_database[index2][current_champ][1] +=1;
                    if (ffc_database[index2][max_champ][2] < ffc_database[index2][current_champ][2]) ffc_database[index2][max_champ][2] = ffc_database[index2][current_champ][2];
                    if (ffc_database[index2][max_champ][1] < ffc_database[index2][current_champ][1]) ffc_database[index2][max_champ][1] = ffc_database[index2][current_champ][1];
                    ffc_database[index1][current_champ][2] +=1;
                    ffc_database[index1][current_champ][1] +=1;
                    if (ffc_database[index1][max_champ][2] < ffc_database[index1][current_champ][2]) ffc_database[index1][max_champ][2] = ffc_database[index1][current_champ][2];
                    if (ffc_database[index1][max_champ][1] < ffc_database[index1][current_champ][1]) ffc_database[index1][max_champ][1] = ffc_database[index1][current_champ][1];
                }

            }
            let myJsonString = JSON.stringify(ffc_database);
            console.log(myJsonString);
        })   
}

