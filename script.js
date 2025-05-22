document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
        });
    });

    // Star Rating
    // Ambil elemen
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');

    // Data review awal
    let reviews = [
        {
            name: "Fatimah Az Zahra",
            rating: 5,
            review: "Pelayanan sangat memuaskan! Pemandu wisata profesional dan ramah.",
            date: "21 Mei 2025"
        },
        {
            name: "Muhammad Indra",
            rating: 4,
            review: "Paket wisatanya lengkap dan harga terjangkau. Sangat recommended!",
            date: "22 Mei 2025"
        },
        {
            name: "Ryan Candra Bachtiar",
            rating: 5,
            review: "Pengalaman wisata terbaik yang pernah saya dapatkan. Terima kasih Nagantour!",
            date: "23 Mei 2025"
        }
    ];

    // Fungsi tampilkan review
    function displayReviews() {
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';

            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rating) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }

            reviewCard.innerHTML = `
            <div class="review-header">
                <span class="review-user">${review.name}</span>
                <span class="review-rating">${starsHtml}</span>
            </div>
            <p>${review.review}</p>
            <div class="review-date">${review.date}</div>
        `;

            reviewsContainer.appendChild(reviewCard);
        });
    }

    // Tampilkan review awal
    displayReviews();

    // Fungsi saat klik bintang
    stars.forEach(star => {
        star.addEventListener('click', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;

            // Atur tampilan bintang
            stars.forEach(s => {
                const starValue = parseInt(s.getAttribute('data-rating'));
                if (starValue <= rating) {
                    s.classList.add('active');
                    s.innerHTML = '<i class="fas fa-star"></i>';
                } else {
                    s.classList.remove('active');
                    s.innerHTML = '<i class="far fa-star"></i>';
                }
            });
        });
    });

    // Saat form dikirim
    reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const rating = parseInt(ratingInput.value);
        const reviewText = document.getElementById('review').value.trim();

        if (!rating || rating === 0) {
            alert('Silakan pilih rating bintang terlebih dahulu.');
            return;
        }

        const newReview = {
            name: name,
            rating: rating,
            review: reviewText,
            date: new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        reviews.unshift(newReview);
        displayReviews();

        // Reset form
        reviewForm.reset();
        ratingInput.value = "0";
        stars.forEach(star => {
            star.classList.remove('active');
            star.innerHTML = '<i class="far fa-star"></i>';
        });

        alert('Terima kasih atas ulasan Anda!');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
});

// Koordinat Modang, Kuaro, Paser
var koordinatDesa = [-1.7367895, 116.153936]; // kamu bisa sesuaikan kalau titik pastinya beda

// Inisialisasi peta
var map = L.map('map').setView(koordinatDesa, 13);

// Tambahkan tile dari OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tambahkan marker lokasi desa
L.marker(koordinatDesa).addTo(map)
    .bindPopup("<b>Desa Modang</b><br>Kecamatan Kuaro, Kabupaten Paser")
    .openPopup();
document.addEventListener('DOMContentLoaded', function () {
    const asalSelect = document.getElementById('asal');
    const tujuanSelect = document.getElementById('tujuan');
    const btnModa = document.querySelectorAll('.btn-moda');
    const jarakSpan = document.getElementById('jarak');
    const tarifSpan = document.getElementById('tarif');
    const hasilDiv = document.getElementById('hasil');

    const kota = [
        'Balikpapan', 'Banjarmasin', 'Pontianak', 'Palangka Raya', 'Samarinda', 'Tarakan'
    ];

    // Jarak dari masing-masing kota ke Desa Modang (dalam km)
    const jarakKeModang = {
        'Balikpapan': 150,
        'Banjarmasin': 400,
        'Pontianak': 700,
        'Palangka Raya': 450,
        'Samarinda': 200,
        'Tarakan': 600
    };

    const tarifPerKm = {
        ferry: 2500,
        bus: 2000,
        travel: 3000
    };

    // Isi dropdown asal
    kota.forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = k;
        asalSelect.appendChild(opt);
    });

    // Tujuan hanya ke Desa Modang
    const optModang = document.createElement('option');
    optModang.value = 'Desa Modang';
    optModang.textContent = 'Desa Modang';
    tujuanSelect.appendChild(optModang);
    tujuanSelect.disabled = true; // tidak bisa diganti

    let modaTerpilih = 'ferry';

    btnModa.forEach(btn => {
        btn.addEventListener('click', () => {
            btnModa.forEach(b => b.classList.remove('aktif'));
            btn.classList.add('aktif');
            modaTerpilih = btn.dataset.moda;
            hitungTarif();
        });
    });

    asalSelect.addEventListener('change', hitungTarif);

    function hitungTarif() {
        const asal = asalSelect.value;
        const tujuan = 'Desa Modang';

        if (!asal) {
            hasilDiv.classList.add('hidden');
            return;
        }

        const jarak = jarakKeModang[asal] || null;

        if (!jarak) {
            jarakSpan.textContent = '-';
            tarifSpan.textContent = 'Data jarak tidak tersedia';
            hasilDiv.classList.remove('hidden');
            return;
        }

        const tarif = jarak * tarifPerKm[modaTerpilih];

        jarakSpan.textContent = jarak.toLocaleString();
        tarifSpan.textContent = `IDR ${tarif.toLocaleString('id-ID')}`;
        hasilDiv.classList.remove('hidden');
    }
});
