function update() {
    let container = document.querySelector('.container');
    container.innerHTML = "";
    fetch('https://acb-api.algoritmika.org/api/transaction')
        .then(r => r.json())
        .then(data => {
            data.forEach(i => {
                let box = document.createElement('div');
                box.classList.add('box');

                let p = document.createElement('p');
                p.innerText = i.from + '-->' + i.to + "$" + i.amount;

                let buttons = document.createElement('div');
                buttons.classList.add('buttons');

                let edit = document.createElement('button');
                edit.innerText = "Edit";

                edit.addEventListener('click', e => {
                    let editPart = document.querySelector('.edit');
                    editPart.dataset.id = i.id;
                    editPart.children[0].children[1].value = i.from;
                    editPart.children[0].children[3].value = i.to;
                    editPart.children[0].children[5].value = i.amount;
                    editPart.style.display = "flex";
                })


                let cancel = document.createElement('button');
                cancel.innerText = "Cancel";
                cancel.addEventListener('click', e => {
                    fetch(`https://acb-api.algoritmika.org/api/transaction/${i.id}`, {
                        method: 'DELETE'
                    }).then(() => update())

                })

                buttons.appendChild(edit);
                buttons.appendChild(cancel);
                box.appendChild(p)
                box.appendChild(buttons);
                container.appendChild(box);
            })
        })
}

update()

let editPart = document.querySelector('.edit');

editPart.addEventListener('click', e => {
    if (e.target == e.currentTarget) {
        editPart.style.display = 'none';
    }
})

editPart.addEventListener('submit', e => {
    e.preventDefault();
    let data = new FormData(e.target);
    fetch(`https://acb-api.algoritmika.org/api/transaction/${editPart.dataset.id}`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            from: data.get('from'),
            to: data.get('to'),
            amount: data.get('amount')
        })
    })
        .then(() => {
            update();
            editPart.style.display = 'none';
        });

})

let send = document.querySelector('.send');
let sendDiv = document.querySelector('.send-div')
send.addEventListener('click', e => {
    e.preventDefault();
    sendDiv.style.display = 'flex';
})

sendDiv.addEventListener('submit', e => {
    e.preventDefault();
    let formData = new FormData(e.target);
    fetch('https://acb-api.algoritmika.org/api/transaction', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            from: formData.get('from'),
            to: formData.get('to'),
            amount: formData.get('amount')
        })
    }).then(() => {
        update();
        sendDiv.style.display = 'none';
        sendDiv.children[0].children[1].value = "";
        sendDiv.children[0].children[3].value = "";
        sendDiv.children[0].children[5].value = "";
    })

})

