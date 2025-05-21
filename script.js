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


document.addEventListener('DOMContentLoaded', () => {
    const asalSelect = document.getElementById('asal');
    const tujuanSelect = document.getElementById('tujuan');
    const btnModa = document.querySelectorAll('.btn-moda');
    const jarakSpan = document.getElementById('jarak');
    const tarifSpan = document.getElementById('tarif');
    const hasilDiv = document.getElementById('hasil');

    const kota = [
        'Balikpapan', 'Banjarmasin', 'Pontianak', 'Palangka Raya', 'Samarinda', 'Tarakan'
    ];

    // Data jarak antar kota (km)
    const jarakAntarKota = {
        'Balikpapan-Banjarmasin': 430,
        'Balikpapan-Pontianak': 670,
        'Balikpapan-Palangka Raya': 390,
        'Balikpapan-Samarinda': 120,
        'Balikpapan-Tarakan': 590,
        'Banjarmasin-Pontianak': 830,
        'Banjarmasin-Palangka Raya': 300,
        'Banjarmasin-Samarinda': 520,
        'Banjarmasin-Tarakan': 760,
        'Pontianak-Palangka Raya': 490,
        'Pontianak-Samarinda': 790,
        'Pontianak-Tarakan': 860,
        'Palangka Raya-Samarinda': 390,
        'Palangka Raya-Tarakan': 620,
        'Samarinda-Tarakan': 520
    };

    // Tarif per km moda transportasi (IDR)
    const tarifPerKm = {
        ferry: 2500,
        bus: 2000,
        travel: 3000
    };

    // Isi dropdown asal dan tujuan
    kota.forEach(k => {
        const opt1 = document.createElement('option');
        opt1.value = k.toLowerCase();
        opt1.textContent = k;
        asalSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = k.toLowerCase();
        opt2.textContent = k;
        tujuanSelect.appendChild(opt2);
    });

    // Aktifkan dropdown tujuan kalau asal sudah dipilih
    asalSelect.addEventListener('change', () => {
        tujuanSelect.disabled = !asalSelect.value;

        // Reset tujuan kalau sama dengan asal
        if (tujuanSelect.value === asalSelect.value) {
            tujuanSelect.value = '';
        }

        hitungTarif();
    });

    // Event change tujuan
    tujuanSelect.addEventListener('change', () => {
        // Disable pilihan tujuan yang sama dengan asal supaya gak bisa dipilih
        Array.from(tujuanSelect.options).forEach(opt => {
            opt.disabled = (opt.value === asalSelect.value && opt.value !== '');
        });

        hitungTarif();
    });

    // Pilih moda transportasi
    let modaTerpilih = 'ferry';
    btnModa.forEach(btn => {
        btn.addEventListener('click', () => {
            btnModa.forEach(b => b.classList.remove('aktif'));
            btn.classList.add('aktif');
            modaTerpilih = btn.dataset.moda;
            hitungTarif();
        });
    });

    // Fungsi hitung jarak dan tarif
    function hitungTarif() {
        const asal = asalSelect.value;
        const tujuan = tujuanSelect.value;

        if (!asal || !tujuan || asal === tujuan) {
            hasilDiv.classList.add('hidden');
            return;
        }

        // Kapitalisasi setiap kata agar cocok key
        function capitalizeEachWord(str) {
            return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        const k1 = capitalizeEachWord(asal) + '-' + capitalizeEachWord(tujuan);
        const k2 = capitalizeEachWord(tujuan) + '-' + capitalizeEachWord(asal);

        let jarak = jarakAntarKota[k1] || jarakAntarKota[k2] || null;

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
