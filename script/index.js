// import componentFunction from "./include/component.js";
const htmlBox = $('.display__code--box');
const buttons = $('.display__container--buttons button');
const accordionTitle = $('.accordion--title');
const accordionContent= $('.accordion--content');

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
                
                // Create an HTML string with highlighting
                let htmlString = '';
                let cssString = '';
                let scriptString = '';
                for (const element of elements) {
                    const tagName = element.tagName.toLowerCase();
                    const isSelfClosing = ['img', 'br'].includes(tagName); // Add other self-closing elements as needed
                
                    const highlightedElement = `<span style="color: #a7925a;">${tagName}</span>`;
                    const attributes = Array.from(element.attributes).map(attr => {
                        return `<span style="color:#e6e600;">${attr.name}</span>=${attr.value}`;
                    }).join(' ');

                    if (tagName === 'script') {
                        scriptString += `<${highlightedElement} ${attributes}>${element.innerHTML}&lt/${highlightedElement}>`;
                    } else {
                        if (isSelfClosing) {
                            htmlString += `<${highlightedElement} ${attributes} />`;
                        } else {
                            htmlString += `<${highlightedElement} ${attributes}>${element.innerHTML}&lt/${highlightedElement}>`;
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
        $(e.currentTarget).toggleClass(`${accordionTitle}--active`);
    
        if($(e.currentTarget).hasClass(`${accordionTitle}--active`)) {
            $(e.currentTarget).siblings(accordionContent).slideDown();
        } else {
            $(e.currentTarget).siblings(accordionContent).slideUp();
        }
    });
}

//invoke all function
// componentFunction();
fetchDisplayFunction();
toogleDisplayFunction();
toggleAccordionFunction();


