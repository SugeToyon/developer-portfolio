
const container = document.getElementById('container');
const textLayer = document.getElementById('textLayer');

container.addEventListener('mousemove', (e) => {
  const x = e.clientX + 'px';
  const y = e.clientY + 'px';
  textLayer.style.setProperty('--x', x);
  textLayer.style.setProperty('--y', y);
});

container.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const x = touch.clientX + 'px';
  const y = touch.clientY + 'px';
  textLayer.style.setProperty('--x', x);
  textLayer.style.setProperty('--y', y);
});


const container1 = document.getElementById('parallaxContainer');
const cards = document.querySelectorAll('.glass-card');

let mouseX = 0;
let mouseY = 0;

let cardPositions = Array.from(cards).map(() => ({ currentX: 0, currentY: 0 }));

let time = 0;

container1.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;
  mouseY = (e.clientY / window.innerHeight) - 0.5;
});

container1.addEventListener('mouseleave', () => {
  mouseX = 0;
  mouseY = 0;
});

function animate() {
  time += 0.02; 

  cards.forEach((card, index) => {
    const speed = parseFloat(card.getAttribute('data-speed'));
    
    let baseRotation = 0;
    if(card.classList.contains('card-1')) baseRotation = -10;
    if(card.classList.contains('card-2')) baseRotation = -30;
    if(card.classList.contains('card-3')) baseRotation = 25;

    const autoX = Math.sin(time + index * 2) * 15; 
    const autoY = Math.cos(time + index * 1.5) * 15; 

    const targetX = mouseX * speed * 2.5;
    const targetY = mouseY * speed * 2.5;

    cardPositions[index].currentX += (targetX - cardPositions[index].currentX) * 0.1;
    cardPositions[index].currentY += (targetY - cardPositions[index].currentY) * 0.1;

    const finalX = cardPositions[index].currentX + autoX;
    const finalY = cardPositions[index].currentY + autoY;

    card.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${baseRotation}deg)`;
  });

  requestAnimationFrame(animate);
}

animate();

const sec3Container = document.getElementById('sec3ScrollContainer');
const sec3Wrapper = document.getElementById('sec3TextWrapper');
const sec3Lines = document.querySelectorAll('.sec3-line');

function updateTextBlur() {
  const rect = sec3Container.getBoundingClientRect();
  const sectionHeight = rect.height;
  
  if (rect.top > window.innerHeight || rect.bottom < 0) return;

  const totalScrollable = sectionHeight - window.innerHeight;
  const scrolled = Math.max(0, Math.min(1, -rect.top / totalScrollable));

  const totalMoveRange = (sec3Lines.length * 60); 
  const currentTranslation = (scrolled * totalMoveRange) - (totalMoveRange / 2);

  const screenCenterY = window.innerHeight / 2;

  sec3Lines.forEach((line) => {
    line.style.transform = `translateY(${-currentTranslation}px)`;

    const lineRect = line.getBoundingClientRect();
    const lineCenterY = lineRect.top + (lineRect.height / 2);

    const distanceFromCenter = Math.abs(screenCenterY - lineCenterY);

    const blurAmount = Math.max(0, (distanceFromCenter - 50) / 45); 
    
    const opacityAmount = Math.max(0.1, 1 - (distanceFromCenter / (window.innerHeight * 0.4)));

    const scaleAmount = Math.max(0.75, 1 - (distanceFromCenter / (window.innerHeight * 1.5)));

    line.style.filter = `blur(${blurAmount}px)`;
    line.style.opacity = opacityAmount;
    line.style.transform = `translateY(${-currentTranslation}px) scale(${scaleAmount})`;
  });
}

window.addEventListener('scroll', updateTextBlur);
window.addEventListener('resize', updateTextBlur);
updateTextBlur();
