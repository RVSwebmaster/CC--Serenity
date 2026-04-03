import { el } from '../../../assets/js/ui.js';

const STORAGE_KEYS = {
  ships: 'verseTransitShips',
  routes: 'verseTransitRoutes'
};

const DEFAULT_LOCATIONS = [
  { name: 'Aberdeen', x: 16, y: 24 },
  { name: 'Angel', x: 46, y: 20 },
  { name: 'Ariel', x: 22, y: 16 },
  { name: 'Athens', x: 58, y: 24 },
  { name: 'Ares', x: 34, y: 12 },
  { name: 'Beaumonde', x: 14, y: 12 },
  { name: 'Bernadette', x: 32, y: 18 },
  { name: 'Bellerophon', x: 28, y: 10 },
  { name: 'Boros', x: 48, y: 24 },
  { name: 'Constance', x: 8, y: 24 },
  { name: 'Deadwood', x: 62, y: 20 },
  { name: 'Dyton', x: 40, y: 26 },
  { name: 'Ezra', x: 36, y: 28 },
  { name: 'Greenleaf', x: 26, y: 14 },
  { name: 'Harvest', x: 42, y: 30 },
  { name: 'Haven', x: 48, y: 34 },
  { name: 'Heinlein', x: 66, y: 30 },
  { name: 'Hera', x: 18, y: 8 },
  { name: "Higgins' Moon", x: 42, y: 22 },
  { name: 'Highgate', x: 12, y: 30 },
  { name: 'Jiangyin', x: 10, y: 22 },
  { name: 'Kalidasa', x: 30, y: 22 },
  { name: 'Kerry', x: 24, y: 10 },
  { name: 'Lilac', x: 50, y: 14 },
  { name: 'Liann Jiun', x: 20, y: 28 },
  { name: 'Londinium', x: 8, y: 8 },
  { name: 'Miranda', x: 70, y: 10 },
  { name: 'New Melbourne', x: 18, y: 30 },
  { name: 'Osiris', x: 6, y: 18 },
  { name: 'Paquin', x: 60, y: 10 },
  { name: 'Persephone', x: 24, y: 34 },
  { name: 'Regina', x: 52, y: 28 },
  { name: 'Santo', x: 44, y: 6 },
  { name: 'Shadow', x: 68, y: 18 },
  { name: 'Sihnon', x: 4, y: 28 },
  { name: 'St. Albans', x: 54, y: 18 },
  { name: 'Triumph', x: 64, y: 34 },
  { name: 'Whitefall', x: 34, y: 6 }
].sort((a, b) => a.name.localeCompare(b.name));

function routeKey(a, b) {
  return [a, b].sort((left, right) => left.localeCompare(right)).join('::');
}

const DEFAULT_SHIPS = [
  {
    name: 'Shuttle / Short Hauler',
    speed: 2,
    notes: 'Slow, steady, cheap. Fine for short hops, not fine for patience.'
  },
  {
    name: 'Heavy Commercial Freighter',
    speed: 3,
    notes: 'A plodding cargo beast. Carries more than it hurries.'
  },
  {
    name: 'Light Commercial / Private Transport',
    speed: 4,
    notes: 'A good default for the Verse. Honest speed, honest trouble.'
  },
  {
    name: 'Fast Courier / Smuggler',
    speed: 5,
    notes: 'Built to outrun bills, patrols, and second thoughts.'
  },
  {
    name: 'High End Yacht / Racing Pinnace',
    speed: 6,
    notes: 'Rich folk velocity. More money than mercy.'
  }
];

const DEFAULT_ROUTE_OVERRIDES = [
  { from: 'Persephone', to: 'Triumph', units: 40 },
  { from: 'Persephone', to: 'Regina', units: 28 },
  { from: 'Persephone', to: 'Sihnon', units: 21 },
  { from: 'Persephone', to: 'Ariel', units: 19 },
  { from: 'Persephone', to: 'Osiris', units: 25 },
  { from: 'Regina', to: 'Triumph', units: 15 },
  { from: 'Regina', to: 'Athens', units: 11 },
  { from: 'Regina', to: 'Haven', units: 9 },
  { from: 'Ariel', to: 'Osiris', units: 16 },
  { from: 'Ariel', to: 'Santo', units: 18 },
  { from: 'Ariel', to: 'Beaumonde', units: 9 },
  { from: 'Sihnon', to: 'Osiris', units: 10 },
  { from: 'Sihnon', to: 'Londinium', units: 16 },
  { from: 'Santo', to: 'Whitefall', units: 11 },
  { from: 'Santo', to: 'Paquin', units: 18 },
  { from: 'Triumph', to: 'Athens', units: 12 },
  { from: 'Triumph', to: 'Paquin', units: 24 },
  { from: 'Paquin', to: 'Shadow', units: 13 },
  { from: 'Bellerophon', to: 'Ariel', units: 7 },
  { from: 'Beaumonde', to: 'Bellerophon', units: 7 }
].map((route) => ({ ...route, key: routeKey(route.from, route.to) }));

function makeId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `transit_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function roundToTenth(value) {
  return Math.round(value * 10) / 10;
}

function formatDecimal(value) {
  const rounded = roundToTenth(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatTime(daysDecimal) {
  const safeDays = Math.max(0, daysDecimal);
  const wholeDays = Math.floor(safeDays);
  let hours = Math.round((safeDays - wholeDays) * 24);
  let adjustedDays = wholeDays;

  if (hours === 24) {
    adjustedDays += 1;
    hours = 0;
  }

  if (adjustedDays === 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  if (hours === 0) {
    return `${adjustedDays} day${adjustedDays === 1 ? '' : 's'}`;
  }
  return `${adjustedDays} day${adjustedDays === 1 ? '' : 's'}, ${hours} hour${hours === 1 ? '' : 's'}`;
}

function calculateStraightLineDistance(locationA, locationB) {
  const dx = locationB.x - locationA.x;
  const dy = locationB.y - locationA.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function cloneDefaultShips() {
  return DEFAULT_SHIPS.map((ship) => ({ ...ship, id: makeId() }));
}

function cloneDefaultRoutes() {
  return DEFAULT_ROUTE_OVERRIDES.map((route) => ({ ...route }));
}

function loadShips() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.ships) || 'null');
    if (Array.isArray(stored) && stored.length > 0) {
      return stored
        .filter((ship) => ship && ship.name && Number.isFinite(Number(ship.speed)))
        .map((ship) => ({
          id: ship.id || makeId(),
          name: String(ship.name),
          speed: Number(ship.speed),
          notes: String(ship.notes || '')
        }));
    }
  } catch (error) {
    console.warn('Could not load saved transit ships.', error);
  }
  return cloneDefaultShips();
}

function loadRoutes() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.routes) || 'null');
    if (Array.isArray(stored) && stored.length > 0) {
      return stored
        .filter((route) => route && route.from && route.to && Number.isFinite(Number(route.units)))
        .map((route) => ({
          key: routeKey(route.from, route.to),
          from: String(route.from),
          to: String(route.to),
          units: Number(route.units)
        }));
    }
  } catch (error) {
    console.warn('Could not load saved transit routes.', error);
  }
  return cloneDefaultRoutes();
}

function saveShips(ships) {
  localStorage.setItem(STORAGE_KEYS.ships, JSON.stringify(ships));
}

function saveRoutes(routes) {
  localStorage.setItem(STORAGE_KEYS.routes, JSON.stringify(routes));
}

function getLocationByName(name) {
  return DEFAULT_LOCATIONS.find((location) => location.name === name) || null;
}

function createTransitStatCard(label, valueId, detailId) {
  return el('article', { cls: 'gm-transit-stat-card' }, [
    el('span', { cls: 'gm-stat-label', text: label }),
    el('strong', { cls: 'gm-transit-stat-value', attrs: { id: valueId }, text: '-' }),
    el('small', { cls: 'gm-copy gm-transit-stat-detail', attrs: { id: detailId }, text: '' })
  ]);
}

export function renderTransitPanel() {
  let ships = loadShips();
  let routeOverrides = loadRoutes();

  const originSelect = el('select');
  const destinationSelect = el('select');
  const shipTypeSelect = el('select');
  const routeTypeSelect = el('select', {}, [
    el('option', { attrs: { value: '1' }, text: 'Standard route' }),
    el('option', { attrs: { value: '2' }, text: 'Avoiding standard routes' })
  ]);
  const hardBurnCheckbox = el('input', { attrs: { type: 'checkbox' } });

  const travelTimeEl = el('strong', { cls: 'gm-transit-stat-value', text: '-' });
  const travelTimeDetailEl = el('small', { cls: 'gm-copy gm-transit-stat-detail', text: '' });
  const distanceUnitsEl = el('strong', { cls: 'gm-transit-stat-value', text: '-' });
  const distanceDetailEl = el('small', { cls: 'gm-copy gm-transit-stat-detail', text: '' });
  const fuelIndexEl = el('strong', { cls: 'gm-transit-stat-value', text: '-' });
  const fuelDetailEl = el('small', { cls: 'gm-copy gm-transit-stat-detail', text: '' });
  const speedClassEl = el('strong', { cls: 'gm-transit-stat-value', text: '-' });
  const speedDetailEl = el('small', { cls: 'gm-copy gm-transit-stat-detail', text: '' });
  const routeNoteEl = el('div', { cls: 'gm-transit-route-note muted' });

  const worldListEl = el('div', { cls: 'gm-chip-list' });

  const shipForm = el('form', { cls: 'gm-transit-form' });
  const shipEditIdInput = el('input', { attrs: { type: 'hidden' } });
  const shipNameInput = el('input', { attrs: { type: 'text', maxlength: '80', placeholder: 'Fast Courier / Smuggler', required: 'required' } });
  const shipSpeedInput = el('input', { attrs: { type: 'number', min: '1', max: '12', step: '1', value: '4', required: 'required' } });
  const shipNotesInput = el('input', { attrs: { type: 'text', maxlength: '180', placeholder: 'Built to outrun bills, patrols, and second thoughts.' } });
  const clearShipBtn = el('button', { cls: 'gm-button', attrs: { type: 'button' }, text: 'Clear form' });
  const resetShipsBtn = el('button', { cls: 'gm-button', attrs: { type: 'button' }, text: 'Restore default ships' });
  const shipProfilesEl = el('div', { cls: 'gm-editable-list' });

  const routeForm = el('form', { cls: 'gm-transit-form' });
  const routeEditKeyInput = el('input', { attrs: { type: 'hidden' } });
  const routeOriginSelect = el('select');
  const routeDestinationSelect = el('select');
  const routeUnitsInput = el('input', { attrs: { type: 'number', min: '0.1', max: '999', step: '0.1', value: '10', required: 'required' } });
  const clearRouteBtn = el('button', { cls: 'gm-button', attrs: { type: 'button' }, text: 'Clear form' });
  const resetRoutesBtn = el('button', { cls: 'gm-button', attrs: { type: 'button' }, text: 'Restore default routes' });
  const routeOverridesEl = el('div', { cls: 'gm-editable-list' });

  function populateWorldSelect(select, selectedValue) {
    select.innerHTML = '';
    DEFAULT_LOCATIONS.forEach((location, index) => {
      const option = el('option', { attrs: { value: location.name }, text: location.name });
      option.selected = selectedValue ? location.name === selectedValue : index === 0;
      select.append(option);
    });
  }

  function renderWorldList() {
    worldListEl.innerHTML = '';
    DEFAULT_LOCATIONS.forEach((location) => {
      worldListEl.append(el('span', { cls: 'gm-chip', text: location.name }));
    });
  }

  function renderShipSelect(preferredName) {
    shipTypeSelect.innerHTML = '';
    ships
      .slice()
      .sort((a, b) => a.speed - b.speed || a.name.localeCompare(b.name))
      .forEach((ship, index) => {
        const option = el('option', {
          attrs: { value: ship.id },
          text: `${ship.name} | Speed ${ship.speed}`
        });
        option.selected = preferredName ? ship.name === preferredName : index === 2;
        shipTypeSelect.append(option);
      });
  }

  function renderRouteSelects() {
    populateWorldSelect(routeOriginSelect, routeOriginSelect.value || 'Persephone');
    populateWorldSelect(routeDestinationSelect, routeDestinationSelect.value || 'Triumph');
  }

  function getRouteOverride(from, to) {
    const key = routeKey(from, to);
    return routeOverrides.find((route) => route.key === key) || null;
  }

  function renderShipProfiles() {
    shipProfilesEl.innerHTML = '';
    ships
      .slice()
      .sort((a, b) => a.speed - b.speed || a.name.localeCompare(b.name))
      .forEach((ship) => {
        shipProfilesEl.append(el('article', { cls: 'gm-editable-card' }, [
          el('div', { cls: 'gm-editable-card-top' }, [
            el('div', {}, [
              el('h3', { text: ship.name }),
              el('div', { cls: 'gm-copy muted', text: `Cruise Speed Class ${ship.speed}` })
            ]),
            el('div', { cls: 'gm-editable-card-actions' }, [
              el('button', {
                cls: 'gm-button gm-button-compact',
                attrs: { type: 'button' },
                text: 'Edit',
                dataset: { action: 'edit-ship', id: ship.id }
              }),
              el('button', {
                cls: 'gm-button gm-button-compact',
                attrs: { type: 'button' },
                text: 'Delete',
                dataset: { action: 'delete-ship', id: ship.id }
              })
            ])
          ]),
          el('p', { cls: 'gm-copy', text: ship.notes || 'No notes. A vessel of mystery and unpaid docking fees.' })
        ]));
      });
  }

  function renderRouteOverrides() {
    routeOverridesEl.innerHTML = '';
    routeOverrides
      .slice()
      .sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to))
      .forEach((route) => {
        routeOverridesEl.append(el('article', { cls: 'gm-editable-card' }, [
          el('div', { cls: 'gm-editable-card-top' }, [
            el('div', {}, [
              el('h3', { text: `${route.from} to ${route.to}` }),
              el('div', { cls: 'gm-copy muted', text: `Base route ${formatDecimal(route.units)} RU` })
            ]),
            el('div', { cls: 'gm-editable-card-actions' }, [
              el('button', {
                cls: 'gm-button gm-button-compact',
                attrs: { type: 'button' },
                text: 'Edit',
                dataset: { action: 'edit-route', key: route.key }
              }),
              el('button', {
                cls: 'gm-button gm-button-compact',
                attrs: { type: 'button' },
                text: 'Delete',
                dataset: { action: 'delete-route', key: route.key }
              })
            ])
          ]),
          el('p', { cls: 'gm-copy', text: 'When selected, this fixed value overrides straight-line map distance for both directions on this route.' })
        ]));
      });
  }

  function calculateTransit() {
    const origin = getLocationByName(originSelect.value);
    const destination = getLocationByName(destinationSelect.value);
    const ship = ships.find((entry) => entry.id === shipTypeSelect.value);
    const routeMultiplier = Number(routeTypeSelect.value);
    const hardBurn = hardBurnCheckbox.checked;

    if (!origin || !destination || !ship) return;

    if (origin.name === destination.name) {
      travelTimeEl.textContent = '0 days';
      travelTimeDetailEl.textContent = 'You are already there. No pilot medals for that.';
      distanceUnitsEl.textContent = '0 RU';
      distanceDetailEl.textContent = 'Route Units measure the baseline lane distance.';
      fuelIndexEl.textContent = '0';
      fuelDetailEl.textContent = 'No travel, no fuel, no drama.';
      speedClassEl.textContent = String(hardBurn ? ship.speed + 2 : ship.speed);
      speedDetailEl.textContent = hardBurn ? 'Hard burn is available, it just has nothing to chew on.' : 'Cruise speed.';
      routeNoteEl.textContent = 'Pick two different worlds and the Black will start whispering numbers.';
      return;
    }

    const routeOverride = getRouteOverride(origin.name, destination.name);
    const baseDistance = routeOverride ? routeOverride.units : calculateStraightLineDistance(origin, destination);
    const effectiveDistance = baseDistance * routeMultiplier;
    const effectiveSpeed = hardBurn ? ship.speed + 2 : ship.speed;
    const travelDays = effectiveDistance / effectiveSpeed;
    const fuelIndex = effectiveDistance * (hardBurn ? 2 : 1);
    const routeLabel = routeMultiplier === 1 ? 'standard routes' : 'non-standard routes';
    const routeSource = routeOverride ? 'saved route override' : 'map estimate';

    travelTimeEl.textContent = `${formatDecimal(travelDays)} days`;
    travelTimeDetailEl.textContent = formatTime(travelDays);
    distanceUnitsEl.textContent = `${formatDecimal(effectiveDistance)} RU`;
    distanceDetailEl.textContent = `Base distance ${formatDecimal(baseDistance)} RU from ${routeSource}, adjusted for ${routeLabel}.`;
    fuelIndexEl.textContent = formatDecimal(fuelIndex);
    fuelDetailEl.textContent = hardBurn ? 'Fuel index doubles under hard burn. Fast costs.' : 'Fuel index at cruise burn.';
    speedClassEl.textContent = String(effectiveSpeed);
    speedDetailEl.textContent = hardBurn
      ? `Cruise ${ship.speed}, hard burn pushes it to ${effectiveSpeed}.`
      : `Cruise speed for ${ship.name}.`;
    routeNoteEl.textContent = `Route: ${origin.name} to ${destination.name}. Ship: ${ship.name}. Source: ${routeSource}. ${hardBurn ? 'Hard burn engaged.' : 'Cruise burn.'} ${routeMultiplier === 2 ? 'Avoiding standard routes doubles effective distance, time, and fuel index.' : 'Standard lanes assumed.'}`;
  }

  function clearShipForm() {
    shipEditIdInput.value = '';
    shipNameInput.value = '';
    shipSpeedInput.value = '4';
    shipNotesInput.value = '';
  }

  function clearRouteForm() {
    routeEditKeyInput.value = '';
    routeOriginSelect.value = 'Persephone';
    routeDestinationSelect.value = 'Triumph';
    routeUnitsInput.value = '10';
  }

  function resetCalculator() {
    originSelect.value = 'Persephone';
    destinationSelect.value = 'Triumph';
    routeTypeSelect.value = '1';
    hardBurnCheckbox.checked = false;
    const preferredShip = ships.find((ship) => ship.name === 'Light Commercial / Private Transport') || ships[0];
    if (preferredShip) shipTypeSelect.value = preferredShip.id;
    calculateTransit();
  }

  function swapLocations() {
    const currentOrigin = originSelect.value;
    originSelect.value = destinationSelect.value;
    destinationSelect.value = currentOrigin;
    calculateTransit();
  }

  function restoreDefaultShips() {
    ships = cloneDefaultShips();
    saveShips(ships);
    renderShipSelect('Light Commercial / Private Transport');
    renderShipProfiles();
    clearShipForm();
    calculateTransit();
  }

  function restoreDefaultRoutes() {
    routeOverrides = cloneDefaultRoutes();
    saveRoutes(routeOverrides);
    renderRouteOverrides();
    clearRouteForm();
    calculateTransit();
  }

  shipForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = shipEditIdInput.value || makeId();
    const name = shipNameInput.value.trim();
    const speed = Number(shipSpeedInput.value);
    const notes = shipNotesInput.value.trim();
    if (!name || !Number.isFinite(speed) || speed < 1) return;

    const profile = { id, name, speed, notes };
    const existingIndex = ships.findIndex((ship) => ship.id === id);
    if (existingIndex >= 0) {
      ships[existingIndex] = profile;
    } else {
      ships.push(profile);
    }

    saveShips(ships);
    renderShipSelect(name);
    renderShipProfiles();
    clearShipForm();
    calculateTransit();
  });

  routeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const originalKey = routeEditKeyInput.value;
    const from = routeOriginSelect.value;
    const to = routeDestinationSelect.value;
    const units = Number(routeUnitsInput.value);
    if (!from || !to || from === to || !Number.isFinite(units) || units <= 0) return;

    const key = routeKey(from, to);
    const profile = { key, from, to, units };
    if (originalKey && originalKey !== key) {
      routeOverrides = routeOverrides.filter((route) => route.key !== originalKey);
    }

    const existingIndex = routeOverrides.findIndex((route) => route.key === key);
    if (existingIndex >= 0) {
      routeOverrides[existingIndex] = profile;
    } else {
      routeOverrides.push(profile);
    }

    saveRoutes(routeOverrides);
    renderRouteOverrides();
    clearRouteForm();
    calculateTransit();
  });

  shipProfilesEl.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;

    if (action === 'edit-ship') {
      const ship = ships.find((entry) => entry.id === id);
      if (!ship) return;
      shipEditIdInput.value = ship.id;
      shipNameInput.value = ship.name;
      shipSpeedInput.value = String(ship.speed);
      shipNotesInput.value = ship.notes || '';
      shipNameInput.focus();
      return;
    }

    if (action === 'delete-ship') {
      if (ships.length === 1) {
        window.alert('You need at least one ship profile. Even the Black wants a ride.');
        return;
      }
      ships = ships.filter((entry) => entry.id !== id);
      saveShips(ships);
      renderShipSelect();
      renderShipProfiles();
      clearShipForm();
      calculateTransit();
    }
  });

  routeOverridesEl.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, key } = button.dataset;

    if (action === 'edit-route') {
      const route = routeOverrides.find((entry) => entry.key === key);
      if (!route) return;
      routeEditKeyInput.value = route.key;
      routeOriginSelect.value = route.from;
      routeDestinationSelect.value = route.to;
      routeUnitsInput.value = String(route.units);
      routeOriginSelect.focus();
      return;
    }

    if (action === 'delete-route') {
      routeOverrides = routeOverrides.filter((entry) => entry.key !== key);
      saveRoutes(routeOverrides);
      renderRouteOverrides();
      clearRouteForm();
      calculateTransit();
    }
  });

  [originSelect, destinationSelect, shipTypeSelect, routeTypeSelect, hardBurnCheckbox].forEach((node) => {
    node.addEventListener('change', calculateTransit);
  });
  clearShipBtn.addEventListener('click', clearShipForm);
  clearRouteBtn.addEventListener('click', clearRouteForm);
  resetShipsBtn.addEventListener('click', restoreDefaultShips);
  resetRoutesBtn.addEventListener('click', restoreDefaultRoutes);

  const swapBtn = el('button', { cls: 'gm-button', attrs: { type: 'button' }, text: 'Swap locations' });
  const resetBtn = el('button', { cls: 'gm-button', attrs: { type: 'button' }, text: 'Reset' });
  swapBtn.addEventListener('click', swapLocations);
  resetBtn.addEventListener('click', resetCalculator);

  const panel = el('section', {
    cls: 'gm-main-panel gm-transit-panel',
    attrs: { style: '--tab-accent: #86a7ff;' }
  }, [
    el('header', { cls: 'gm-panel-header' }, [
      el('div', {}, [
        el('p', { cls: 'gm-kicker', text: 'Pinned Utility Tab' }),
        el('h2', { cls: 'gm-panel-title', text: 'Transit' }),
        el('p', {
          cls: 'gm-panel-copy',
          text: 'Estimate travel time through the Black, tune ship speed profiles, and pin house-route distances where straight-line math is too blunt.'
        })
      ])
    ]),
    el('div', { cls: 'gm-transit-layout' }, [
      el('section', { cls: 'gm-utility-card' }, [
        el('h3', { cls: 'gm-utility-title', text: 'Transit Controls' }),
        el('div', { cls: 'gm-form-grid' }, [
          el('label', { cls: 'gm-form-field' }, [el('span', { text: 'Location A' }), originSelect]),
          el('label', { cls: 'gm-form-field' }, [el('span', { text: 'Location B' }), destinationSelect]),
          el('label', { cls: 'gm-form-field' }, [el('span', { text: 'Ship Class' }), shipTypeSelect]),
          el('label', { cls: 'gm-form-field' }, [el('span', { text: 'Route Type' }), routeTypeSelect])
        ]),
        el('label', { cls: 'gm-transit-checkbox' }, [
          hardBurnCheckbox,
          el('span', { text: 'Hard burn' })
        ]),
        el('div', { cls: 'gm-toolbar' }, [swapBtn, resetBtn])
      ]),
      el('section', { cls: 'gm-utility-card' }, [
        el('h3', { cls: 'gm-utility-title', text: 'Transit Estimate' }),
        el('div', { cls: 'gm-transit-results' }, [
          el('article', { cls: 'gm-transit-stat-card' }, [
            el('span', { cls: 'gm-stat-label', text: 'Estimated Travel Time' }),
            travelTimeEl,
            travelTimeDetailEl
          ]),
          el('article', { cls: 'gm-transit-stat-card' }, [
            el('span', { cls: 'gm-stat-label', text: 'Effective Distance' }),
            distanceUnitsEl,
            distanceDetailEl
          ]),
          el('article', { cls: 'gm-transit-stat-card' }, [
            el('span', { cls: 'gm-stat-label', text: 'Fuel Use Index' }),
            fuelIndexEl,
            fuelDetailEl
          ]),
          el('article', { cls: 'gm-transit-stat-card' }, [
            el('span', { cls: 'gm-stat-label', text: 'Effective Speed Class' }),
            speedClassEl,
            speedDetailEl
          ])
        ]),
        el('div', { cls: 'gm-editable-card gm-transit-formula' }, [
          el('h3', { text: 'House Math in Use' }),
          el('p', {
            cls: 'gm-copy',
            text: 'Base distance comes from a saved route override when one exists, otherwise from map distance between worlds. Standard route uses x1 distance. Avoiding standard routes uses x2 distance, which also doubles time and fuel. Hard burn uses speed class +2 and doubles fuel use. Travel time equals effective distance divided by effective speed.'
          })
        ]),
        routeNoteEl
      ]),
      el('section', { cls: 'gm-utility-card' }, [
        el('h3', { cls: 'gm-utility-title', text: 'World Catalog' }),
        el('p', { cls: 'gm-copy', text: 'Expanded with more Verse worlds. Route overrides let you pin house values where straight-line estimates are too blunt.' }),
        worldListEl
      ]),
      el('section', { cls: 'gm-utility-card' }, [
        el('div', { cls: 'gm-panel-header' }, [
          el('div', {}, [
            el('h3', { cls: 'gm-utility-title', text: 'Ship Profiles' }),
            el('p', { cls: 'gm-copy', text: 'Edit, add, or delete ship classes. Changes are saved in this browser.' })
          ]),
          resetShipsBtn
        ]),
        shipForm
      ]),
      shipProfilesEl,
      el('section', { cls: 'gm-utility-card' }, [
        el('div', { cls: 'gm-panel-header' }, [
          el('div', {}, [
            el('h3', { cls: 'gm-utility-title', text: 'Route Overrides' }),
            el('p', { cls: 'gm-copy', text: 'Use fixed base route units for common lanes or your own house canon. These values override map distance.' })
          ]),
          resetRoutesBtn
        ]),
        routeForm
      ]),
      routeOverridesEl
    ])
  ]);

  shipForm.append(
    shipEditIdInput,
    el('div', { cls: 'gm-form-grid gm-transit-tri-grid' }, [
      el('label', { cls: 'gm-form-field' }, [el('span', { text: 'Ship class name' }), shipNameInput]),
      el('label', { cls: 'gm-form-field' }, [el('span', { text: 'Cruise speed class' }), shipSpeedInput]),
      el('label', { cls: 'gm-form-field gm-form-field-wide' }, [el('span', { text: 'Notes' }), shipNotesInput])
    ]),
    el('div', { cls: 'gm-toolbar' }, [
      el('button', { cls: 'gm-button gm-button-primary', attrs: { type: 'submit' }, text: 'Save ship profile' }),
      clearShipBtn
    ])
  );

  routeForm.append(
    routeEditKeyInput,
    el('div', { cls: 'gm-form-grid gm-transit-tri-grid' }, [
      el('label', { cls: 'gm-form-field' }, [el('span', { text: 'From' }), routeOriginSelect]),
      el('label', { cls: 'gm-form-field' }, [el('span', { text: 'To' }), routeDestinationSelect]),
      el('label', { cls: 'gm-form-field' }, [el('span', { text: 'Base route units' }), routeUnitsInput])
    ]),
    el('div', { cls: 'gm-toolbar' }, [
      el('button', { cls: 'gm-button gm-button-primary', attrs: { type: 'submit' }, text: 'Save route override' }),
      clearRouteBtn
    ])
  );

  populateWorldSelect(originSelect, 'Persephone');
  populateWorldSelect(destinationSelect, 'Triumph');
  renderRouteSelects();
  renderWorldList();
  renderShipSelect('Light Commercial / Private Transport');
  renderShipProfiles();
  renderRouteOverrides();
  resetCalculator();

  return panel;
}
