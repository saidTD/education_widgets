{% if params.variant == slide %}
{% if params.list_partenaires|length > 5 %}
    const ourPartnersSplide = new Splide('#our-partners', {
        type: 'loop',
        perPage: '1',
        perMove: '1',
        autoplay: 'play',
        interval: '1000',
        arrows: false,
        pagination: false,
        mediaQuery: 'min',
        breakpoints: {
            500: {
                perPage: 2
            },
            800: {
                perPage: 3
            },
            992: {
                perPage: 4
            }
        }
    });
    ourPartnersSplide?.mount();
{% endif %}
{% endif %}