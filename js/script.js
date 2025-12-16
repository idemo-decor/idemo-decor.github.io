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

    // Function to set language (View Update Only)
    function setLanguage(lang) {
        if (!window.translations[lang]) return;

        // Update active button state
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update text content for all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (window.translations[lang][key]) {
                // Handle elements that contain HTML tags (like bold text)
                if (element.innerHTML !== window.translations[lang][key]) {
                     element.innerHTML = window.translations[lang][key]; 
                }
            }
        });

        // Save preference
        localStorage.setItem('decor-lang', lang);
        
        // Update html lang attribute for accessibility
        document.documentElement.lang = lang;
    }

    // Determine Language on Load
    function getInitialLanguage() {
        // 1. Check URL Hash (e.g. #fr)
        const hash = window.location.hash.substring(1);
        if (window.translations[hash]) {
            return hash;
        }

        // 2. Check LocalStorage
        const saved = localStorage.getItem('decor-lang');
        if (saved && window.translations[saved]) {
            return saved;
        }

        // 3. Check Browser Locale
        const browserLang = navigator.language.substring(0, 2);
        if (window.translations[browserLang]) {
            return browserLang;
        }

        return defaultLang;
    }

    // Initialize
    const initialLang = getInitialLanguage();
    setLanguage(initialLang);
    
    // Set initial hash if it's empty and we are using a non-default language
    // or if we simply want to reflect the current state
    if (window.location.hash === '' && initialLang !== defaultLang) {
        history.replaceState(null, null, '#' + initialLang);
    } else if (window.location.hash === '#' + initialLang) {
        // All good
    }

    // Event Listeners for Language Buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            // Update hash
            history.pushState(null, null, '#' + lang);
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
