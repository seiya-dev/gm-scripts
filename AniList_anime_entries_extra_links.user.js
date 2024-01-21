// ==UserScript==
// @namespace   seiya-anilist-extra-links
// @name        AniList anime entries extra links
// @version     0.1.20
// @description AniList extra links for anime entries
// @author      Seiya
// @homepageURL https://twitter.com/seiya_loveless
// @icon        https://anilist.co/img/icons/favicon-32x32.png
// @match       https://anilist.co/anime/*
// @grant       none
// @run-at      document-end
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {

    const doc = window.document;

    function quoteattr(s) {
        return ('' + s)
            .replace(/`/g, '\'')
            .replace(/&/g, '&amp;')
            .replace(/'/g, '&apos;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\r\n/g, '&#13;')
            .replace(/[\r\n]/g, '&#13;');
    }

    do {
        await sleep(100);
    } while (doc.querySelector('div.content') === null);

    const dataSets = doc.querySelectorAll('.data-set');
    let titleText = '';

    for(let i in [...dataSets]){
        if(dataSets[i].querySelector('.type').innerText == 'Romaji'){
            titleText = dataSets[i].querySelector('.value').innerText.replace(/Gekijouban/,'').replace(/\(\d{4}\)/, '').replace(/ +/g, ' ').trim();
        }
    }

    if(titleText == ''){
        console.log('[:ERROR:] Title is empty!');
        return;
    }

    const rtSec     = [
        '181,1900,208,209,2258,2343,2365,4,484,521,539,822,84,930',
        '1460,815,816,921',
        '1105,1386,1387,1389,1390,1391,1642,2484,2491,2544,33,404,599,809,893',
    ].join(',');

    const links = [
        { name: 'AniDB',             domain: 'anidb.net',       icon: 'i.imgur.com/n28vPkj.png', urlPrefix: '/anime/?do.search=1&adb.search=' },
        { name: 'Shikimori',         domain: 'shikimori.me',    icon: 'i.imgur.com/FCEAKfv.png', urlPrefix: '/animes?search=' },
        { name: 'NyaaV2',            domain: 'nyaa.si',         icon: 'i.imgur.com/rGFiDrK.png', urlPrefix: '/?c=1_0&q=' },
        { name: 'SukebeiV2',         domain: 'sukebei.nyaa.si', icon: 'i.imgur.com/7O8uBsn.png', urlPrefix: '/?c=1_1&q=' },
        { name: 'AniDex',            domain: 'anidex.info',     icon: 'i.imgur.com/vApI8cH.png', urlPrefix: '/?q=' },
        { name: 'AnimeTosho-Search', domain: 'animetosho.org',  icon: 'i.imgur.com/bMpKDYG.png', urlPrefix: '/search?q=' },
        { name: 'RuTracker',         domain: 'rutracker.org',   icon: 'i.imgur.com/W5VLN29.png', urlPrefix: `/forum/search.php?f=${rtSec}&nm=` },
    ];

    const extraLinks = doc.createElement('div');
    extraLinks.classList.add('ext-icons');
    extraLinks.innerHTML = '';

    for(const icon of links){
        const classList = `i_icon i_resource_${icon.name}`;
        const uriHref = `https://${icon.domain}${icon.urlPrefix}${quoteattr(titleText)}`;
        extraLinks.innerHTML += `<a class="${classList}" href="${uriHref}" target="_blank" title="${icon.name}">`
            + `<span class="text">${icon.name}</span>`
            + '</a>';
    }

    const targetInsert = '.page-content .header .content h1';
    doc.querySelector(targetInsert).insertAdjacentElement('afterend', extraLinks);

    const styleEl = document.createElement('style');
    styleEl.id = 'customLinks';
    
    if(document.querySelector('#customLinks') !== null){
        return;
    }
    
    doc.head.appendChild(styleEl);
    
    styleEl.sheet.insertRule(''
        + `.i_icon{`
        + `    min-height: 16px;`
        + `    margin: .075em .125em;`
        + `}`
    );
    
    styleEl.sheet.insertRule(''
        + `.i_icon span{`
        + `    display: none;`
        + `}`
    );

    for(const icon of links){
        const icoUrl = !icon.icon.match(/^\//) ? icon.icon : `${icon.domain}${icon.icon}`;
        styleEl.sheet.insertRule(''
            + `.i_resource_${icon.name}{`
            + `    background-image: url('https://${icoUrl}');`
            + `    background-size: contain;`
            + `    display: inline-block;`
            + `    height: 16px;`
            + `    width: 16px;`
            + `}`
        );
    }

})();
