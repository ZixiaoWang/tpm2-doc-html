function showDocByCmd(cmd = '') {
    if (cmds.includes(cmd.toLocaleLowerCase()) === false) {
        return void 0;
    }

}
function getCandidates(keywordString = '') {
    if (keywordString.length < 3) {
        return [];
    }

    const keywords = keywordString.toLocaleLowerCase().split(' ');
    return cmds
        .map((cmd) => {
            const matchedKeywords = [];
            for (let keyword of keywords) {
                if (cmd.includes(keyword)) {
                    matchedKeywords.push(keyword);
                }
            }

            if (matchedKeywords.length === 0) {
                return false;
            } else {
                return {
                    cmd,
                    matchedKeywords
                }
            }
        })
        .filter(item => !!item)
}

function displayListByCandidates(candidates) {
    const list = document.getElementById('candidates');
    if (list) {
        let bullets = '';
        candidates.forEach((candidate) => {
            const reg = new RegExp(`(${candidate.matchedKeywords.join('|')})`, 'g');
            const innerContent = candidate.cmd.replace(reg, `<b data-id="${candidate.cmd}">$1</b>`);
            bullets += `<li data-id="${candidate.cmd}">tpm2 ${innerContent}</li>`;
        });

        if (bullets.length > 0) {
            fillElement(list, bullets);
        }
    }
}

function resetElement(element) {
    if (element) {
        element.classList.add('hidden');
        element.innerHTML = '';
    }
}

function fillElement(element, innerHTML) {
    if (element) {
        element.classList.remove('hidden');
        element.innerHTML = innerHTML;
    }
}



window.addEventListener('load', () => {
    const input = document.getElementById('input');
    const list = document.getElementById('candidates');
    const docContainer = document.getElementById('doccontainer');
    const themeSwitch = document.getElementById('themeswitch');

    if (input && list && docContainer) {
        input.addEventListener('keyup', (event) => {
            const keywords = event.target.value || '';
            const candidates = getCandidates(keywords);
            resetElement(docContainer);

            if (candidates.length > 0) {
                displayListByCandidates(candidates);
            } else {
                resetElement(list);
            }
        });

        list.addEventListener('click', (event) => {
            const id = event.target.dataset.id;
            const template = document.getElementById(id);
            input.value = 'tpm2 ' + id;
            resetElement(list);
            if (template) {
                fillElement(docContainer, template.innerHTML);
            }
        })
    }

    if (themeSwitch) {
        if (localStorage.getItem('TPM_DOC_THEME') === 'DARK') {
            document.body.classList.add('dark-mode');
            themeSwitch.classList.add('dark');
        }
        themeSwitch.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeSwitch.classList.toggle('dark');
            if (document.body.className.includes('dark-mode')) {
                localStorage.setItem('TPM_DOC_THEME', 'DARK');
            } else {
                localStorage.setItem('TPM_DOC_THEME', 'LIGHT');
            }
        });
    }
})