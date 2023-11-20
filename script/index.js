const htmlBox = $('.display__code--box');
const buttons = $('.display__container--buttons button');
const accordionClassActive = 'accordion--title--active';
const accordionTitle = $('.accordion--title');
const accordionContent= $('.accordion--content');
const resultContainer = '.result__container--outer';
const resultRenderContainer = '.result__container--outer-render';

const toogleDisplayFunction = () => {
    if(buttons.length) {
        $(buttons).on('click', (e) => {
            if(!$(e.currentTarget).hasClass('active')) {
                $(e.currentTarget).addClass('active');
                $(e.currentTarget).siblings('button').removeClass('active');

                const containerCode = $(e.currentTarget).parent('.display__container--buttons').siblings('.display__container--code');
                const buttonName = $(e.currentTarget).attr('name');

                if(buttonName === 'html') {
                    containerCode.find('div[data-box="html"]').addClass('active');
                    containerCode.find('div[data-box="html"]').siblings('.display__code--box').removeClass('active');
                } else {
                    if(buttonName === 'css') {
                        containerCode.find('div[data-box="css"]').addClass('active');
                        containerCode.find('div[data-box="css"]').siblings('.display__code--box').removeClass('active');
                    } else {
                        containerCode.find('div[data-box="js"]').addClass('active');
                        containerCode.find('div[data-box="js"]').siblings('.display__code--box').removeClass('active');
                    }
                }
            }                   
        })
    }
}

const fetchDisplayFunction = () => {
    $('.display__container--outer').each((index, el) => {
        const htmlAttr = $(el).data('html');
        
        if(htmlAttr !== '' && htmlAttr !== null && htmlAttr !== undefined) {
            $.get(`./html/${htmlAttr}.html`, (data) => {
                // Parse the HTML content
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                
                // Get all elements and their contents
                const elements = doc.body.getElementsByTagName('*');
                const headElements = doc.head.getElementsByTagName('*');
                
                // Create an HTML string with highlighting
                let htmlString = '';
                let cssString = '';
                let scriptString = '';
                let formattedScriptInnerHtml = '';
                let formattedCSSInnerHTML = '';

                // Result rendered to result container
                $(el).siblings(resultContainer).find(resultRenderContainer).html(data);

                if(headElements.length) {
                    for (const head of headElements) {

                        const tagName = head.tagName.toLowerCase();
                        const highlightedElement = `<span style="color: #a7925a;">${tagName}</span>`;
                        const cssInnerHtml = head.innerHTML;

                        if (tagName === 'style') {
                            for (let i = 0; i < cssInnerHtml.length; i++) {
                                const char = cssInnerHtml[i];
                                formattedCSSInnerHTML += char;
                
                                if (char === ';' || char === '{' || char === '}') {
                                    formattedCSSInnerHTML += '<br />';
                                }
                            }
                
                            cssString += `<${highlightedElement}><br /><br />${formattedCSSInnerHTML}<br /><br />&lt/${highlightedElement}>`;
                        }
                    }
                }

                if(elements.length) {
                    for (const element of elements) {
                        const tagName = element.tagName.toLowerCase();
                        const isSelfClosing = ['img', 'br'].includes(tagName);
                    
                        const highlightedElement = `<span style="color: #a7925a;">${tagName}</span>`;
                        const attributes = Array.from(element.attributes).map(attr => {
                            return `<span style="color:#e6e600;">${attr.name}</span>=${attr.value}`;
                        }).join(' ');
                        const scriptInnerHtml = element.innerHTML;
                        if (tagName === 'script') {            
                            for (let i = 0; i < scriptInnerHtml.length; i++) {
                                const char = scriptInnerHtml[i];
                                formattedScriptInnerHtml += char;
                
                                if (char === ';') {
                                    formattedScriptInnerHtml += '<br />';
                                }
                            }
                
                            scriptString += `<${highlightedElement} ${attributes}><br /><br />${formattedScriptInnerHtml}<br /><br />&lt/${highlightedElement}>`;
    
                        } else {
                            if (isSelfClosing) {
                                htmlString += `<${highlightedElement} ${attributes} />`;
                            } else {
                                htmlString += `<${highlightedElement} ${attributes}>${element.innerHTML}&lt/${highlightedElement}>`;
                            }
                        }    
                    }
                }

                // Write the HTML string to a specific container
                if(htmlString !== '' && cssString !== '' && scriptString !=='') {
                    $(el).find(htmlBox).eq(0).html(htmlString);
                    $(el).find(htmlBox).eq(1).html(cssString);
                    $(el).find(htmlBox).eq(2).html(scriptString);
                } else {
                    $(el).find(htmlBox).eq(0).html(htmlString);
                    $(el).find(htmlBox).eq(1).html(scriptString);                  
                }
            })
            .fail(() => {
                console.error('Error loading the file');
            });
        }
        
    })
    
}

const toggleAccordionFunction = () => {
    $(accordionTitle).click((e) => {
        $(e.currentTarget).toggleClass(accordionClassActive);
    
        if($(e.currentTarget).hasClass(accordionClassActive)) {
            $(e.currentTarget).siblings(accordionContent).slideDown();
        } else {
            $(e.currentTarget).siblings(accordionContent).slideUp();
        }
    });
}

//invoke all function
fetchDisplayFunction();
toogleDisplayFunction();
toggleAccordionFunction();


