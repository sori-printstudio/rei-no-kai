// Toggle navigation OPEN / CLOSE on mobile
function toggleNav(){
  document.getElementById("mySidepanel").classList.toggle('open');
  document.getElementById("sidepanelBackground").classList.toggle('open');

  var x = document.getElementById("openbtn");
  if (x.innerHTML === "x") {
    x.innerHTML = "&#9776;";
  } else {
    x.innerHTML = "x";
  }
}

// Toggle year range ON / OFF
function activateYearFilter() {
    const yearBtn = document.getElementById("yearbtn");
    const minSlider = document.getElementById("yearMinSlider");
    const maxSlider = document.getElementById("yearMaxSlider");
    const sliderContainer = document.querySelector(".yearslider");

    const turningOn = (minSlider.dataset.active === "false");

    if (turningOn) {
        // turn ON
        minSlider.dataset.active = "true";
        maxSlider.dataset.active = "true";

        minSlider.disabled = false;
        maxSlider.disabled = false;

        sliderContainer.style.opacity = "1";
        sliderContainer.classList.remove("disabled");

        yearBtn.textContent = "Year Range: ON";
        yearBtn.classList.add("active");
    } else {
        // turn OFF
        minSlider.dataset.active = "false";
        maxSlider.dataset.active = "false";

        minSlider.disabled = true;
        maxSlider.disabled = true;

        sliderContainer.style.opacity = "0.4";
        sliderContainer.classList.add("disabled");

        yearBtn.textContent = "Year Range: OFF";
        yearBtn.classList.remove("active");
    }

    updateYearSliderGradient();
}

// Update range highlight (color between handles)
function updateYearSliderGradient() {
    const minSlider = document.getElementById("yearMinSlider");
    const maxSlider = document.getElementById("yearMaxSlider");
    const sliderContainer = document.querySelector(".yearslider");

    const min = Number(minSlider.min);
    const max = Number(maxSlider.max);

    let minVal = Number(minSlider.value);
    let maxVal = Number(maxSlider.value);

    if (minVal > maxVal) minVal = maxVal;

    const minPercent = ((minVal - min) / (max - min)) * 100;
    const maxPercent = ((maxVal - min) / (max - min)) * 100;

    const active = (minSlider.dataset.active === "true");

    const color = active ? "black" : "black";   


    sliderContainer.style.background = `
        linear-gradient(
            to right,
            #d3d3d3 0%,
            #d3d3d3 ${minPercent}%,
            ${color} ${minPercent}%,
            ${color} ${maxPercent}%,
            #d3d3d3 ${maxPercent}%,
            #d3d3d3 100%
        )`;
}


function initializeYearSlider() {
    const minSlider = document.getElementById("yearMinSlider");
    const maxSlider = document.getElementById("yearMaxSlider");
    const minLabel = document.getElementById("minYearLabel");
    const maxLabel = document.getElementById("maxYearLabel");
    const sliderContainer = document.querySelector(".yearslider");

    if (!minSlider || !maxSlider || !minLabel || !maxLabel) return;

    // OFF on load
    minSlider.dataset.active = "false";
    maxSlider.dataset.active = "false";
    minSlider.disabled = true;
    maxSlider.disabled = true;
    sliderContainer.style.opacity = "0.4";

    // Update labels
    minLabel.textContent = minSlider.value;
    maxLabel.textContent = maxSlider.value;

    // Update colors
    updateYearSliderGradient();

    // Live value update
    function updateValues() {
        let minVal = Number(minSlider.value);
        let maxVal = Number(maxSlider.value);
        if (minVal > maxVal) minSlider.value = maxVal;

        minLabel.textContent = minSlider.value;
        maxLabel.textContent = maxSlider.value;

        updateYearSliderGradient();
    }

    minSlider.addEventListener("input", updateValues);
    maxSlider.addEventListener("input", updateValues);
}

document.addEventListener("DOMContentLoaded", initializeYearSlider);

document.addEventListener("DOMContentLoaded", function() {
  // Collapsible filter sections
  var coll = document.getElementsByClassName("filter-title");
  for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      content.style.display = (content.style.display === "block") ? "none" : "block";
    });
  }

  // Interactive map + filtering
  var svgPrefectures = document.querySelectorAll("#features > *");
  var checkboxPrefectures = document.querySelectorAll('input[name="prefecture"]');
  var labelPrefectures = document.querySelectorAll('.filter-controls label');
  var images = Array.from(document.querySelectorAll('.image'));

  function findLabelByPrefecture(prefId) {
    return document.querySelector('.filter-controls input[data-state="' + prefId + '"]')?.closest('label') || null;
  }
  function findSvgByPrefecture(prefId) {
    var features = document.getElementById('features');
    return features ? features.querySelector('[id="' + (prefId || '') + '"]') : null;
  }

  // Click region checkbox -> toggle prefecture checkboxes
  document.querySelectorAll('input[name="region"]').forEach(function(rcb) {
    rcb.addEventListener('change', function() {
      var ids = (rcb.dataset.state || '').trim().split(/\s+/).filter(Boolean);
      ids.forEach(function(id) {
        var pref = document.querySelector('input[name="prefecture"][data-state="' + id + '"]');
        if (!pref) return;
        pref.checked = rcb.checked;
        // trigger existing checkbox change handler so map/labels update
        pref.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });

  // Deselect region if all its prefectures are unchecked (and the other way around)
  function updateRegionCheckboxes() {
    document.querySelectorAll('input[name="region"]').forEach(function(regionCb) {
      const ids = (regionCb.dataset.state || '').trim().split(/\s+/).filter(Boolean);
      const allUnchecked = ids.every(function(id) {
        const prefCb = document.querySelector('input[name="prefecture"][data-state="' + id + '"]');
        return prefCb && !prefCb.checked;
      });
      const allChecked = ids.every(function(id) {
        const prefCb = document.querySelector('input[name="prefecture"][data-state="' + id + '"]');
        return prefCb && prefCb.checked;
      });

      if (allUnchecked) {
        regionCb.checked = false;
      } 
      if (allChecked) {
        regionCb.checked = true;
      }
    });
  }

  // Click map -> toggle prefecture checkbox
  svgPrefectures.forEach(function(el) {
    el.style.cursor = 'pointer';
    el.addEventListener('click', function() {
      var prefId = (el.id || '').trim();
      if (!prefId) return;
      var input = document.querySelector('.filter-controls input[data-state="' + prefId + '"]');
      if (!input) return;
      input.checked = !input.checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    el.addEventListener('mouseenter', function() {
      var id = el.id;
      var input = document.querySelector('.filter-controls input[data-state="' + id + '"]');
      if (input && input.checked) return;
      el.classList.add('hover');
      var label = findLabelByPrefecture(id);
      if (label) label.classList.add('hover');
    });
    el.addEventListener('mouseleave', function() {
      var id = el.id;
      var input = document.querySelector('.filter-controls input[data-state="' + id + '"]');
      if (input && input.checked) return;
      el.classList.remove('hover');
      var label = findLabelByPrefecture(id);
      if (label) label.classList.remove('hover');
    });
  });

  // Hover prefecture OR region label -> svg (only when unchecked)
  labelPrefectures.forEach(function(label) {
    label.addEventListener('mouseenter', function() {
      var input = label.querySelector('input[data-state]');
      if (input && input.checked) return;

      var prefIds = input ? input.getAttribute('data-state').trim().split(/\s+/) : [];

      label.classList.add('on');

      prefIds.forEach(function(id) {
        var svg = findSvgByPrefecture(id);
        if (svg) svg.classList.add('on');
      });
    });

    label.addEventListener('mouseleave', function() {
      var input = label.querySelector('input[data-state]');
      if (input && input.checked) return;

      var prefIds = input ? input.getAttribute('data-state').trim().split(/\s+/) : [];

      label.classList.remove('on');

      prefIds.forEach(function(id) {
        var svg = findSvgByPrefecture(id);
        if (svg) svg.classList.remove('on');
      });
    });
  });

  // Sync prefecture checkboxes -> prefecture highlights
  function updateSelectedPrefectures() {
    var selected = Array.from(document.querySelectorAll('input[name="prefecture"]:checked'))
      .map(i => (i.getAttribute('data-state') || i.value || i.id || '').trim());

    svgPrefectures.forEach(function(svg) {
      var id = (svg.id || '').trim();
      if (!id) return;
      if (selected.includes(id)) svg.classList.add('on'); else svg.classList.remove('on');
    });
    labelPrefectures.forEach(function(label) {
      var input = label.querySelector('input[name="prefecture"]');
      var id = input ? (input.getAttribute('data-state') || input.value || input.id || '').trim() : '';
      if (id && selected.includes(id)) label.classList.add('on'); else label.classList.remove('on');
    });
  }

  // Includes region deselect logic
  checkboxPrefectures.forEach(function(cb) {
    cb.addEventListener('change', function() {
      updateSelectedPrefectures();
      updateRegionCheckboxes(); // <-- added here
    });
  });
  updateSelectedPrefectures();

  // Apply filters only when button clicked (images filtering)
  var filterBtn = document.getElementById("filterbutton");
  function applyFilter() {
  const selectedRegions = Array.from(document.querySelectorAll('input[name="region"]:checked'))
    .map(i => (i.dataset.state || '').split(/\s+/).filter(Boolean))
    .flat();
  const selectedPrefectures = Array.from(document.querySelectorAll('input[name="prefecture"]:checked'))
    .map(i => (i.getAttribute('data-state') || i.value || i.id || '').trim())
    .filter(Boolean);
  const selectedArchitects = Array.from(document.querySelectorAll('input[name="architect"]:checked'))
    .map(i => (i.getAttribute('data-state') || i.value || i.id || '').trim())
    .filter(Boolean);

  // Unknown year checkbox
  const unknownYearCheckbox = document.querySelector('input[name="UnknownYear"]');
  const includeUnknownYear = unknownYearCheckbox && unknownYearCheckbox.checked;

  // Determine year filter if user touched local slider AND slider is active
  let yearsFilterActive = false;
  let minYear = null, maxYear = null;
  try {
      const minSlider = document.getElementById("yearMinSlider");
      const maxSlider = document.getElementById("yearMaxSlider");
      const isActive = minSlider.dataset.active === "true" && maxSlider.dataset.active === "true";

      if (isActive && minSlider && maxSlider) {
        yearsFilterActive = true;
        minYear = Number(minSlider.value);
        maxYear = Number(maxSlider.value);
      }
  } catch (e) {}

  // If nothing selected (no regions/prefectures/architects) AND no year controls active/checked, hide all images
  if (
    selectedRegions.length === 0 &&
    selectedPrefectures.length === 0 &&
    selectedArchitects.length === 0 &&
    !yearsFilterActive &&
    !includeUnknownYear
  ) {
    images.forEach(img => img.style.display = 'none');
    return; // exit so we don't continue with the loop below
  }

  // Otherwise, show/hide images according to filters
  images.forEach(function(img) {
    const cats = (img.dataset.category || '').split(/\s+/).filter(Boolean);

    const matchesArchitects = selectedArchitects.length === 0 || selectedArchitects.some(a => cats.includes(a));
    const matchesPrefectures = selectedPrefectures.length === 0 || selectedPrefectures.some(p => cats.includes(p));
    const matchesRegions = selectedRegions.length === 0 || selectedRegions.some(r => cats.includes(r));

    const imgYear = parseImageYear(img);
    let matchesYears = true;

    if (yearsFilterActive && includeUnknownYear) {
      // accept either unknown or in-range known
      matchesYears = (imgYear === null) || (imgYear !== null && imgYear >= minYear && imgYear <= maxYear);
    } else if (yearsFilterActive) {
      // only known years in range
      matchesYears = (imgYear !== null && imgYear >= minYear && imgYear <= maxYear);
    } else if (includeUnknownYear) {
      // only unknown year images
      matchesYears = (imgYear === null);
    } else {
      // neither active: don't restrict by year
      matchesYears = true;
    }


    // Final AND logic: all categories must match
    // if (matchesArchitects && matchesPrefectures && matchesRegions && matchesYears) {
    if (matchesArchitects && matchesPrefectures && matchesYears) {
      img.style.display = '';
    } else {
      img.style.display = 'none';
    }
  });

  // Keep map/labels synced
  svgPrefectures.forEach(f => f.classList.remove('on'));
  labelPrefectures.forEach(l => l.classList.remove('on'));
  [...selectedRegions, ...selectedPrefectures, ...selectedArchitects].forEach(function(id) {
    const feat = findSvgByPrefecture(id);
    if (feat) feat.classList.add('on');
    const lab = findLabelByPrefecture(id);
    if (lab) lab.classList.add('on');
  });
}

  if (filterBtn) filterBtn.addEventListener("click", function(e) {
    //e.preventDefault();
    applyFilter();
  });

  // Clear all button
  var clearBtn = document.getElementById("clearallbutton");
  if (clearBtn) {
    clearBtn.addEventListener("click", function() {
      checkboxPrefectures.forEach(function(cb) {
        cb.checked = false;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      })

      // Clear UnknownYear checkbox
      const unknownCb = document.querySelector('input[name="UnknownYear"]');
      if (unknownCb) unknownCb.checked = false;

      svgPrefectures.forEach(svg => svg.classList.remove('on'));
      labelPrefectures.forEach(label => label.classList.remove('on'));
      sessionStorage.removeItem('selectedRegions');
      sessionStorage.removeItem('selectedPrefectures');
      sessionStorage.removeItem('selectedArchitects');
      sessionStorage.removeItem('selectedFilters');

      images.forEach(img => img.style.display = '');
    });
  }


  // Save selection before navigation and apply selection on images page
  if (filterBtn) {
    function saveSelection() {
      var selectedRegions = Array.from(document.querySelectorAll('input[name="region"]:checked'))
        .map(i => (i.dataset.state || '').trim().split(/\s+/).filter(Boolean))
        .flat();
      var selectedPrefectures = Array.from(document.querySelectorAll('input[name="prefecture"]:checked'))
        .map(i => (i.getAttribute('data-state') || i.value || i.id || '').trim())
        .filter(Boolean);
      var selectedArchitects = Array.from(document.querySelectorAll('input[name="architect"]:checked'))
        .map(i => (i.getAttribute('data-state') || i.value || i.id || '').trim())
        .filter(Boolean);

      const data = {
        regions: selectedRegions,
        prefectures: selectedPrefectures,
        architects: selectedArchitects
      };

      // Save unknown year state
    const unknownYearCb = document.querySelector('input[name="UnknownYear"]');
    if (unknownYearCb && unknownYearCb.checked) {
        data.unknownYear = true;
    }

      // Add years only if user interacted with the slider
      try {
        const minSlider = document.getElementById("yearMinSlider");
        const maxSlider = document.getElementById("yearMaxSlider");
        if (minSlider.dataset.active === "true" && maxSlider.dataset.active === "true") {
          data.years = { min: Number(minSlider.value), max: Number(maxSlider.value) };
       }
      } catch (e) { /* ignore */ }

      if (
        data.regions.length ||
        data.prefectures.length ||
        data.architects.length ||
        data.years ||
        data.unknownYear
      ) {
        sessionStorage.setItem('selectedFilters', JSON.stringify(data));
      } else {
        sessionStorage.removeItem('selectedFilters');
      }
    }

    // Save on pointerdown (fires before navigation) and keep a click fallback
    filterBtn.addEventListener('pointerdown', saveSelection);
    filterBtn.addEventListener('click', saveSelection);
  }

  // Helper to extract year from image's data-category (returns Number or null)
  function parseImageYear(img) {
    const cat = (img.dataset.category || '');
    const m = cat.match(/\b(19|20)\d{2}\b/);
    return m ? Number(m[0]) : null;
  }

  // Apply stored selection on load (images page)
  var raw = sessionStorage.getItem('selectedFilters');
  var stored = raw ? JSON.parse(raw) : { regions: [], prefectures: [], architects: [] };

  // Restore UnknownYear checkbox
    const restoreUnknownCb = document.querySelector('input[name="UnknownYear"]');
    if (restoreUnknownCb && stored.unknownYear) {
        restoreUnknownCb.checked = true;
    }     

  if (images.length) {
    if (
        (!stored.regions || stored.regions.length === 0) &&
        (!stored.prefectures || stored.prefectures.length === 0) &&
        (!stored.architects || stored.architects.length === 0) &&
        !stored.years &&
        !stored.unknownYear
      ) {
        images.forEach(img => img.style.display = 'none');
    } else {
      images.forEach(function(img) {
        const cats = (img.dataset.category || '').split(/\s+/).filter(Boolean);
        const matchesArchitects = !stored.architects || stored.architects.length === 0 || stored.architects.some(a => cats.includes(a));
        const matchesPrefectures = !stored.prefectures || stored.prefectures.length === 0 || stored.prefectures.some(p => cats.includes(p));
        const matchesRegions = !stored.regions || stored.regions.length === 0 || stored.regions.some(r => cats.includes(r));

        const imgYear = parseImageYear(img);
        let matchesYears = true;

        if (stored.years && stored.unknownYear) {
            matchesYears = (imgYear === null) || (imgYear !== null && imgYear >= stored.years.min && imgYear <= stored.years.max);
        } else if (stored.years) {
            matchesYears = (imgYear !== null && imgYear >= stored.years.min && imgYear <= stored.years.max);
        } else if (stored.unknownYear) {
            matchesYears = (imgYear === null);
        } else {
            matchesYears = true;
        }

        // Allow unknown year if stored
        if (stored.unknownYear && imgYear === null) {
            matchesYears = true;
        }

        //if (matchesArchitects && matchesPrefectures && matchesRegions && matchesYears) {
        if (matchesArchitects && matchesPrefectures && matchesYears) {
          img.style.display = '';
        } else {
          img.style.display = 'none';
        }
      });
     // if (typeof applyFilter === 'function') applyFilter();
    }
  }
  
  const popup = document.querySelector('.popup');
  const iframe = document.querySelector('.iframe');
  const closeBtn = document.querySelector('.close');
  const thumbs = document.querySelectorAll('.image');
  const about = document.querySelectorAll('.about');

  thumbs.forEach(img => {
    img.addEventListener('click', () => {
      const link = img.dataset.url; // get URL from data-url
      iframe.src = link;
      popup.style.display = 'flex';
    });
  });

  about.forEach(img => {
    img.addEventListener('click', () => {
      const link = img.dataset.url; // get URL from data-url
      iframe.src = link;
      popup.style.display = 'flex';
    });
  });

  // Close popup
  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    iframe.src = '';
  });

  // Close when clicking outside modal-content
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      popup.style.display = 'none';
      iframe.src = '';
    }
  });
});

// Slideshow
document.addEventListener('DOMContentLoaded', function() {
  var currentImg = 0;
  var imgs = document.querySelectorAll('.slider img');
  let dots = document.querySelectorAll('.dot');
  var interval = 1000;

  var timer = setInterval(changeSlide, interval);

  function changeSlide(n) {
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].style.opacity = 0;
      dots[i].className = dots[i].className.replace(' active', '');
    }

    currentImg = (currentImg + 1) % imgs.length;

    if (n != undefined) {
      clearInterval(timer);
      timer = setInterval(changeSlide, interval);
      currentImg = n;
    }

    imgs[currentImg].style.opacity = 1;
    dots[currentImg].className += ' active';
  }

  window.changeSlide = changeSlide;
});
