
new Splide("#testimonials__carousel", {
  //   type: "loop",
  {% if params.variant == "three"%}
  perPage: 3,
  gap : "2rem",
  breakpoints: {
		768: {
			perPage: 1,
		},
		992: {
			perPage: 2,
		},
  },
  {% else %}
  perPage : 1,
  {% endif %}
  autoplay: true,
  pauseOnHover: false
}).mount();
