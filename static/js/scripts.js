const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications'];
const content_version = '20260723-7';


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file + '?v=' + content_version)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md?v=' + content_version)
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

    // 添加对News部分的支持
    if (document.getElementById('news-md')) {
        const newsContainer = document.getElementById('news-md');
        fetch('contents/news.md?v=' + content_version)
            .then(response => response.text())
            .then(text => {
                newsContainer.innerHTML = marked.parse(text);
            });

        newsContainer.addEventListener('click', event => {
            const link = event.target.closest('a[href^="#pub-"]');
            if (!link) return;

            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;

            event.preventDefault();
            document.querySelectorAll('.publication-hit').forEach(item => {
                item.classList.remove('publication-hit');
            });

            const publicationItem = target.closest('li');
            if (publicationItem) {
                publicationItem.classList.add('publication-hit');
            }

            history.replaceState(null, '', link.getAttribute('href'));
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 88,
                behavior: 'smooth'
            });
        });
    }

}); 
