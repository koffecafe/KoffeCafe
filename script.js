let slideIndex = 0;
        const slides = document.querySelectorAll('.slide');

        function showSlides(index) {
            if (index >= slides.length) {
                slideIndex = 0;
            } else if (index < 0) {
                slideIndex = slides.length - 1;
            } else {
                slideIndex = index;
            }

            // Move the slider to the appropriate slide
            const slider = document.querySelector('.slider');
            slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        }

        function plusSlides(n) {
            showSlides(slideIndex + n);
        }

        // Initially show the first slide
        showSlides(slideIndex);