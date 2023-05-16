{% if params.list_partenaires|length > 5 %}


    import Splide from '@splidejs/splide';

    const splide = new Splide('.splide.our-partners', {
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

    splide.mount();
{% endif %}