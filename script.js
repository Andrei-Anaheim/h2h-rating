const menu_ratings = document.getElementById('menu_ratings').children;
const menu_dates = document.getElementById('menu_dates').children;
for (let i=0; i<menu_ratings.length; i+=1) {
    menu_ratings[i].addEventListener('click', ()=>{changeMenu(i)})
}
for (let i=0; i<menu_dates.length; i+=1) {
    menu_dates[i].addEventListener('click', ()=>{changeDates(i)})
}

function changeMenu(j) {
    for(let i=0; i<menu_ratings.length; i+=1) {
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
