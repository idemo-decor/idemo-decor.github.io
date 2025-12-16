document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Language Switcher Logic
    const langBtns = document.querySelectorAll('.lang-btn');
    const defaultLang = 'en';

    // Function to set language
    function setLanguage(lang) {
        if (!translations[lang]) return;

        // Update active button state
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update text content for all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Handle elements that contain HTML tags (like bold text)
                if (element.innerHTML !== translations[lang][key]) {
                     element.innerHTML = translations[lang][key]; 
                }
            }
        });

        // Save preference
        localStorage.setItem('decor-lang', lang);
        
        // Update html lang attribute for accessibility
        document.documentElement.lang = lang;
    }

    // Initialize Language
    const savedLang = localStorage.getItem('decor-lang') || defaultLang;
    setLanguage(savedLang);

    // Event Listeners for Language Buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});
