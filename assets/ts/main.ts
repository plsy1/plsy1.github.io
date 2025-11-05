/*!
*   Hugo Theme Stack
*
*   @author: Jimmy Cai
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
import StackGallery from "ts/gallery";
import { getColor } from 'ts/color';
import menu from 'ts/menu';
import createElement from 'ts/createElement';
import StackColorScheme from 'ts/colorScheme';
import { setupScrollspy } from 'ts/scrollspy';
import { setupSmoothAnchors } from "ts/smoothAnchors";

let Stack = {
    init: () => {
        /**
         * Bind menu event
         */
        menu();

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            new StackGallery(articleContent);
            setupSmoothAnchors();
            setupScrollspy();
        }

        /**
         * Add linear gradient background to tile style article
         */
        const articleTile = document.querySelector('.article-list--tile');
        if (articleTile) {
            let observer = new IntersectionObserver(async (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);

                    const articles = entry.target.querySelectorAll('article.has-image');
                    articles.forEach(async articles => {
                        const image = articles.querySelector('img'),
                            imageURL = image.src,
                            key = image.getAttribute('data-key'),
                            hash = image.getAttribute('data-hash'),
                            articleDetails: HTMLDivElement = articles.querySelector('.article-details');

                        const colors = await getColor(key, hash, imageURL);

                        articleDetails.style.background = `
                        linear-gradient(0deg, 
                            rgba(${colors.DarkMuted.rgb[0]}, ${colors.DarkMuted.rgb[1]}, ${colors.DarkMuted.rgb[2]}, 0.5) 0%, 
                            rgba(${colors.Vibrant.rgb[0]}, ${colors.Vibrant.rgb[1]}, ${colors.Vibrant.rgb[2]}, 0.75) 100%)`;
                    })
                })
            });

            observer.observe(articleTile)
        }



        /*
         * Add copy button to code block
        */
        const highlights = document.querySelectorAll('.article-content div.highlight');
        const copyText = '✂ Copy';
        const copiedText = '✔ Copied';

        highlights.forEach(highlight => {
            const codeBlock = highlight.querySelector('code[data-lang]');
            // console.log("Raw data-lang:", codeBlock?.getAttribute('data-lang'));
            if (!codeBlock) return;

            // Get language
            const rawLang = codeBlock.getAttribute('data-lang');
            const lang = (rawLang === "fallback" || !rawLang) ? "TEXT" : rawLang.toUpperCase();
            // console.log("Final language:", lang); 
            const langTag = createButton(lang, 'languageTagButton');

            // New copy button
            const copyButton = createButton(copyText, 'copyCodeButton');

            // Create toolbar
            const toolbar = document.createElement('div');
            toolbar.classList.add('toolbar');
            toolbar.appendChild(langTag);
            toolbar.appendChild(copyButton);

            highlight.insertBefore(toolbar, highlight.firstChild);

            // Copy function
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeBlock.textContent)
                    .then(() => {
                        copyButton.textContent = copiedText;

                        setTimeout(() => {
                            copyButton.textContent = copyText;
                        }, 1000);
                    })
                    .catch(err => {
                        alert(err);
                        console.error('Copy failed:', err);
                    });
            });
        });

        // helper function
        function createButton(text, className) {
            const button = document.createElement('button');
            button.innerHTML = text;
            button.classList.add(className);
            return button;
        }

        new StackColorScheme(document.getElementById('dark-mode-toggle'));

    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        Stack.init();
    }, 0);
})

declare global {
    interface Window {
        createElement: any;
        Stack: any
    }
}

window.Stack = Stack;
window.createElement = createElement;