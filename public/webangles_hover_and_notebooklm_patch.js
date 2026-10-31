(function() {
  const lessonData = {
    id: "birds-of-israel-eilat",
    title: "עוֹלַם הַצִּפּוֹרִים בְּיִשְׂרָאֵל וּפְנִינַת הַצַּפְרָאוּת בְּאֵילַת",
    notebookId: "5e674188-c91b-45f1-9b5b-3fe62c291e0f",
    description: "מַעֲרַךְ שִׁעוּר מְנֻקָּד עַל עוֹלַם הַצִּפּוֹרִים בְּיִשְׂרָאֵל וּפְנִינַת הַצַּפְרָאוּת בְּאֵילַת",
    content: "עוֹלַם הַצִּפּוֹרִים בְּיִשְׂרָאֵל וּפְנִינַת הַצַּפְרָאוּת בְּאֵילַת - מַעֲרַךְ שִׁעוּר מְנֻקָּד."
  };

  if (typeof window !== 'undefined') {
    window.BUILTIN_LESSONS = window.BUILTIN_LESSONS || {};
    if (Array.isArray(window.BUILTIN_LESSONS)) {
      window.BUILTIN_LESSONS.push(lessonData);
    } else {
      window.BUILTIN_LESSONS['birds-of-israel-eilat'] = lessonData;
    }

    window.lessonsVault = window.lessonsVault || {};
    if (Array.isArray(window.lessonsVault)) {
      window.lessonsVault.push(lessonData);
    } else {
      window.lessonsVault['birds-of-israel-eilat'] = lessonData;
    }

    try {
      const v = JSON.parse(localStorage.getItem('lessonsVault') || '{}');
      v['birds-of-israel-eilat'] = lessonData;
      localStorage.setItem('lessonsVault', JSON.stringify(v));
      const b = JSON.parse(localStorage.getItem('BUILTIN_LESSONS') || '{}');
      b['birds-of-israel-eilat'] = lessonData;
      localStorage.setItem('BUILTIN_LESSONS', JSON.stringify(b));
    } catch (e) {}
  }

  function initHover() {
    ['webanglesArcContainer', 'carousel3dViewport'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      let ticking = false;
      el.addEventListener('mouseenter', () => {
        el.dataset.hover = 'true';
        if (window.autoRotateTimer) clearInterval(window.autoRotateTimer);
        window.autoRotate = false;
      });
      el.addEventListener('mouseleave', () => {
        el.dataset.hover = 'false';
        if (typeof window.resumeAutoRotate === 'function') window.resumeAutoRotate();
      });
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        const my = (e.clientY - rect.top) / rect.height - 0.5;
        if (!ticking) {
          window.requestAnimationFrame(() => {
            Array.from(el.children).forEach((child, idx) => {
              const rx = -my * 20;
              const ry = mx * 20;
              child.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
              child.style.zIndex = Math.round(100 + idx);
            });
            ticking = false;
          });
          ticking = true;
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHover);
  } else {
    initHover();
  }
})();
