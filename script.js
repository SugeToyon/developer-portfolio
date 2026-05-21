// ========================================================
// SECTION 1: SPOTLIGHT (EL FENERİ) EFEKTİ
// ========================================================
const container = document.getElementById('container');
const textLayer = document.getElementById('textLayer');

// Masaüstü mouse takibi
container.addEventListener('mousemove', (e) => {
  const x = e.clientX + 'px';
  const y = e.clientY + 'px';
  textLayer.style.setProperty('--x', x);
  textLayer.style.setProperty('--y', y);
});

// Mobil dokunma takibi
container.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const x = touch.clientX + 'px';
  const y = touch.clientY + 'px';
  textLayer.style.setProperty('--x', x);
  textLayer.style.setProperty('--y', y);
});


// ========================================================
// SECTION 2: SÜREKLİ YÜZEN VE INTERAKTIF CAM KARTLAR (PARALLAX + FLOAT)
// ========================================================
const container1 = document.getElementById('parallaxContainer');
const cards = document.querySelectorAll('.glass-card');

// Mouse konumlarını tutacak değişkenler (0 = Merkez)
let mouseX = 0;
let mouseY = 0;

// Kartların pürüzsüzce kayması için mevcut ve hedef konumları takip eden nesne
let cardPositions = Array.from(cards).map(() => ({ currentX: 0, currentY: 0 }));

// Sürekli kendi kendine dönen animasyon zamanlayıcısı
let time = 0;

// Mouse hareket ettiğinde hedefleri güncelle
container1.addEventListener('mousemove', (e) => {
  // -0.5 ile 0.5 arasında bir oran alır
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;
});

// Mouse section'dan çıkınca kartların sadece kendi salınımı kalsın, mouse etkisi sıfırlansın
container1.addEventListener('mouseleave', () => {
  mouseX = 0;
  mouseY = 0;
});

// SÜREKLİ ÇALIŞAN ANA ANIMASYON DÖNGÜSÜ (Sihirli Kısım)
function animate() {
  time += 0.02; // Kartların kendi kendine yüzme hızı. Azaltırsan daha yavaş, arttırırsan daha hızlı sallanırlar.

  cards.forEach((card, index) => {
    const speed = parseFloat(card.getAttribute('data-speed'));
    
    // Orijinal eğiklik açıları
    let baseRotation = 0;
    if(card.classList.contains('card-1')) baseRotation = -10;
    if(card.classList.contains('card-2')) baseRotation = -30;
    if(card.classList.contains('card-3')) baseRotation = 25;

    // 1. KENDİ KENDİNE SÜREKLİ SALINIM (Sürekli dalgalanma efekti için Trigonometri - Sinüs ve Kosinüs)
    // Her kartın index'ine göre farklı açılar veriyoruz ki aynı anda, tek tip sallanmasınlar
    const autoX = Math.sin(time + index * 2) * 15; // 15px sağa sola salınım payı
    const autoY = Math.cos(time + index * 1.5) * 15; // 15px yukarı aşağı salınım payı

    // 2. MOUSE PARALLAX HEDEFİ
    const targetX = mouseX * speed * 2.5;
    const targetY = mouseY * speed * 2.5;

    // 3. PÜRÜZSÜZ GEÇİŞ (LERP - Linear Interpolation)
    // Kartların aniden zıplamasını engeller, yağ gibi pürüzsüz akmasını sağlar
    cardPositions[index].currentX += (targetX - cardPositions[index].currentX) * 0.1;
    cardPositions[index].currentY += (targetY - cardPositions[index].currentY) * 0.1;

    // Toplam hareket = Mouse Etkisi + Kendi Kendine Sürekli Yüzme Etkisi
    const finalX = cardPositions[index].currentX + autoX;
    const finalY = cardPositions[index].currentY + autoY;

    // CSS'e uygula
    card.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${baseRotation}deg)`;
  });

  // Döngüyü tarayıcı yenilendikçe (60fps) sürekli tetikle
  requestAnimationFrame(animate);
}

// Animasyon döngüsünü başlat
animate();

// ========================================================
// SECTION 3: PERSPECTIVE TEXT BLUR SCROLL ANIMATION
// ========================================================
const sec3Container = document.getElementById('sec3ScrollContainer');
const sec3Wrapper = document.getElementById('sec3TextWrapper');
const sec3Lines = document.querySelectorAll('.sec3-line');

function updateTextBlur() {
  // Section 3'ün ekranın tepesine göre olan konumunu alıyoruz
  const rect = sec3Container.getBoundingClientRect();
  const sectionHeight = rect.height;
  
  // Kullanıcı henüz bu section'a gelmediyse veya geçtiyse boşuna hesaplama yapma
  if (rect.top > window.innerHeight || rect.bottom < 0) return;

  // Kaydırma oranını hesapla (0 ile 1 arasında)
  const totalScrollable = sectionHeight - window.innerHeight;
  const scrolled = Math.max(0, Math.min(1, -rect.top / totalScrollable));

  // Yazıların toplamda yukarı doğru ne kadar kayacağını belirliyoruz
  // -150px ile 150px arasında satırları yukarı öteler
  const totalMoveRange = (sec3Lines.length * 60); 
  const currentTranslation = (scrolled * totalMoveRange) - (totalMoveRange / 2);

  // Ekranın tam dikey merkezi
  const screenCenterY = window.innerHeight / 2;

  sec3Lines.forEach((line) => {
    // Önce satırı temel konumuna kaydırıyoruz
    line.style.transform = `translateY(${-currentTranslation}px)`;

    // Satırın şu anki gerçek ekran koordinatlarını al
    const lineRect = line.getBoundingClientRect();
    const lineCenterY = lineRect.top + (lineRect.height / 2);

    // Satırın ekran merkezine olan mutlak uzaklığını bul
    const distanceFromCenter = Math.abs(screenCenterY - lineCenterY);

    // Dinamik efekt çarpanları (İstediğin gibi oynayabilirsin kanka)
    // Merkezden 200px uzaklaştıktan sonra blur sertleşmeye başlar
    const blurAmount = Math.max(0, (distanceFromCenter - 50) / 45); 
    
    // Merkezden uzaklaştıkça görünürlüğü (opacity) hafifçe azaltalım
    const opacityAmount = Math.max(0.1, 1 - (distanceFromCenter / (window.innerHeight * 0.4)));

    // 3D Derinlik hissi için hafif küçülme (Perspective scale)
    const scaleAmount = Math.max(0.75, 1 - (distanceFromCenter / (window.innerHeight * 1.5)));

    // Değerleri satıra pürüzsüzce giydir
    line.style.filter = `blur(${blurAmount}px)`;
    line.style.opacity = opacityAmount;
    line.style.transform = `translateY(${-currentTranslation}px) scale(${scaleAmount})`;
  });
}

// Hem sayfa kaydırıldığında çalıştır hem de tarayıcı yenilendiğinde konumu eşitle
window.addEventListener('scroll', updateTextBlur);
window.addEventListener('resize', updateTextBlur);
// Sayfa ilk yüklendiğinde tetikle
updateTextBlur();