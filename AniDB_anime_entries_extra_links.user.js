// ==UserScript==
// @namespace   seiya-anidb-extra-links
// @name        AniDB anime entries extra links
// @version     1.7.58
// @description AniDB extra links for anime entries
// @author      Seiya
// @homepageURL https://twitter.com/seiya_loveless
// @match       https://anidb.net/anime/*
// @grant       none
// @run-at      document-end
// ==/UserScript==

(()=>{
    
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
    
    if(!doc.querySelector('.pane.info')){
        console.error('[error] panel info not found!')
        return;
    }
    
    let reOdd = false;
    let isOdd = true;
    
    if(!doc.querySelector('.pane.info .resources')){
        const afterEl = doc.querySelector('.pane.info .tags') ? '.pane.info .tags' : '.pane.info .year';
        const trEl = doc.createElement('tr');
        trEl.classList.add('resources');
        trEl.innerHTML = '<th class="field">Resources</th><td class="value"></td>';
        doc.querySelector(afterEl).insertAdjacentElement('afterend', trEl);
        reOdd = true;
    }
    
    if(reOdd){
        const trSel = doc.querySelectorAll('.pane.info .g_definitionlist > table > tbody > tr');
        for(const e of trSel){
            if(e.classList.contains('g_odd')){
                e.classList.remove('g_odd');
            }
            if(isOdd){
                e.classList.add('g_odd');
                isOdd = false;
            }
            else if(!isOdd){
                isOdd = true;
            }
        }
    }
    
    const targetEl = '.pane.info .resources .value .group.thirdparty.english';
    
    if(!doc.querySelector(targetEl)){
        const divEl = doc.createElement('div');
        divEl.classList.add('group','thirdparty','english');
        doc.querySelector('.pane.info .resources .value').insertAdjacentElement('beforeend', divEl);
    }
    
    const titleEl   = doc.querySelector('.pane.info .romaji .value span');
    const titleText = titleEl.textContent.replace(/Gekijouban/,'').replace(/ +/g, ' ').trim();
    const titleId   = doc.querySelector('.shortlink').textContent.replace(/a/, '.');
    
    const links = [
        { name: 'AniList',           domain: 'anilist.co',      icon: '/img/icons/favicon-32x32.png',     urlPrefix: '/search/anime?sort=SEARCH_MATCH&search=' },
        { name: 'Shikimori',         domain: 'shikimori.one',   icon: '/favicons/android-icon-36x36.png', urlPrefix: '/animes?search=' },
        { name: 'NyaaV2',            domain: 'nyaa.si',         icon: '/static/favicon.png',              urlPrefix: '/?q=' },
        { name: 'SukebeiV2',         domain: 'sukebei.nyaa.si', icon: '/static/favicon.png',              urlPrefix: '/?q=' },
        { name: 'AnimeTosho-Series', domain: 'animetosho.org',  icon: '/favicon.ico',                     urlPrefix: `/series/anidb${titleId}#` },
        { name: 'AnimeTosho-Search', domain: 'animetosho.org',  icon: '/favicon.ico',                     urlPrefix: '/search?q=' },
        { name: 'RuTracker',         domain: 'rutracker.org',   icon: '/favicon.ico',                     urlPrefix: '/forum/search.php?nm=' },
        { name: 'PornoLab',          domain: 'pornolab.net',    icon: '/favicon.ico',                     urlPrefix: '/forum/search.php?nm=' },
        // { name: '', domain: '', icon: '', urlPrefix: '' },
    ];
    
    const extraLinks = doc.createElement('div');
    extraLinks.classList.add('icons');
    extraLinks.innerHTML = '';
    
    for(const icon of links){
        const classList = `i_icon i_resource_${icon.name} brand`;
        const uriHref = `https://${icon.domain}${icon.urlPrefix}${quoteattr(titleText)}`;
        // data-anidb-rel="anidb::extern" itemprop="sameAs"
        extraLinks.innerHTML += `<a class="${classList}" href="${uriHref}" target="_blank" title="${icon.name}">`
            + `<span class="text">${icon.name}</span>`
            + '</a>';
    }
    
    doc.querySelector(targetEl).insertAdjacentElement('beforeend', extraLinks);
    
    const styleEl = document.createElement('style');
    doc.head.appendChild(styleEl);
    
    for(const icon of links){
        styleEl.sheet.insertRule(
            `.i_resource_${icon.name}{`
            + `    background-image: url('https://${icon.domain}${icon.icon}');`
            + '    background-size: contain;'
            + '    height: 16px;'
            + '    width: 16px;'
            + '}'
        );
    }
    
})();
