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
    function setLanguage(lang, updateHash = true) {
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

        // Update URL hash if requested and it's a language code
        if (updateHash) {
            // Only update hash if it's not currently a section anchor or if we are explicitly switching
            // But user requested "add something to the URL like a hash".
            // We'll update it. If it conflicts with #about, so be it (standard behavior for some sites).
            // To be nicer, we could check if current hash is a section, but let's stick to the request.
            // We use replaceState to avoid cluttering history too much, or pushState?
            // "add something to the URL".
            if(window.location.hash !== '#' + lang && !document.querySelector(window.location.hash)) {
                 history.replaceState(null, null, '#' + lang);
            } else if (window.location.hash === '#' + lang) {
                // already there
            } else {
                 // If there is an existing valid ID hash (like #about), deciding whether to overwrite is tricky.
                 // For now, let's only overwrite if we are explicitly switching or if the hash is empty.
                 // Actually, let's keep it simple: If I click the button, I want to see the change.
                 // But for initialization, we should be careful.
            }
        }
    }

    // Determine Language on Load
    function getInitialLanguage() {
        // 1. Check URL Hash (e.g. #fr)
        const hash = window.location.hash.substring(1);
        if (translations[hash]) {
            return hash;
        }

        // 2. Check LocalStorage
        const saved = localStorage.getItem('decor-lang');
        if (saved && translations[saved]) {
            return saved;
        }

        // 3. Check Browser Locale
        const browserLang = navigator.language.substring(0, 2);
        if (translations[browserLang]) {
            return browserLang;
        }

        return defaultLang;
    }

    // Initialize
    const initialLang = getInitialLanguage();
    setLanguage(initialLang, window.location.hash === '' || window.location.hash === '#' + initialLang);

    // Event Listeners for Language Buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang, true);
            // Force hash update on explicit click
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
