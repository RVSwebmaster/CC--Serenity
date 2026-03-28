import { GENERAL_SKILL_OPTIONS, SPECIALTY_OPTIONS, createEmptySpecialty } from '../data/defaults.js';
import { SKILLS } from '../data/skills.js';
import { getAllowedRoleSkills, resolveRoleLabel } from '../data/roles.js';
import { getSpecialtyDisplayName } from '../data/specialties.js';
import { dieCost, specialtyDieCost, effectiveGeneralRating } from '../rules.js';
import { el, sectionHeader } from '../ui.js';

function buildOptions(select, options, current) {
  options.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option === 'none' ? '—' : option;
    if (current === option) opt.selected = true;
    select.append(opt);
  });
}

export function renderSkillsStep(state, onChange) {
  const root = el('div');
  root.append(sectionHeader('Step 6: Skills', 'Skills are where the role turns into reality. Buy what this character actually does, not what sounds flattering in a bar.' ));

  const roleSkillList = getAllowedRoleSkills(state.character.basics.role || '');
  if (state.character.basics.role) {
    root.append(el('div', { cls: 'summary-card guide-card' }, [
      el('h3', { text: `${resolveRoleLabel(state.character.basics)} skill lane` }),
      el('p', { text: roleSkillList.length
        ? `This role usually leans on ${roleSkillList.join(', ')}. You do not have to buy all of them, but if you ignore them entirely, the role may be more aspiration than truth.`
        : 'This role does not have a fixed lane, so buy the skills that prove why the crew lets this character stay aboard.' })
    ]));
  }

  if (state.character.basics.roleSkill) {
    const purchased = state.character.skills[state.character.basics.roleSkill]?.generalRating || 'none';
    const effective = effectiveGeneralRating(state.character, state.character.basics.roleSkill);
    root.append(el('div', { cls: 'summary-card role-training-card' }, [
      el('h3', { text: 'Role Training Bonus' }),
      el('p', { html: `<strong>${state.character.basics.roleSkill}</strong> gets a free <strong>+d2 step</strong> during character creation only.` }),
      el('p', { cls: 'muted', text: `Purchased rating: ${purchased === 'none' ? '—' : purchased}. Final rating after role training: ${effective}.` }),
      el('p', { cls: 'muted', text: 'This discount applies only to the chosen core skill. It is not a live play bonus once the character is built.' })
    ]));
  }

  const wrap = el('div', { cls: 'table-wrap' });
  wrap.append(el('div', { cls: 'skill-row header' }, [
    el('div', { text: 'Skill' }),
    el('div', { text: 'Purchased' }),
    el('div', { text: 'Cost' }),
    el('div', { text: 'Specialties' }),
    el('div', { text: 'SP' }),
    el('div', { text: '' })
  ]));

  SKILLS.forEach((skillMeta) => {
    const skill = state.character.skills[skillMeta.name];
    const currentEffective = effectiveGeneralRating(state.character, skillMeta.name);
    const generalSelect = document.createElement('select');
    generalSelect.style.width = '100%';
    buildOptions(generalSelect, GENERAL_SKILL_OPTIONS, skill.generalRating);
    generalSelect.addEventListener('change', (event) => onChange((draft) => {
      draft.skills[skillMeta.name].generalRating = event.target.value;
      const nextEffective = effectiveGeneralRating(draft, skillMeta.name);
      if (nextEffective !== 'd6') {
        draft.skills[skillMeta.name].specialties = draft.skills[skillMeta.name].specialties.map((specialty) => ({ ...specialty, rating: 'none' }));
      }
    }));

    const specialtyWrap = el('div');
    skill.specialties.forEach((specialty) => {
      const line = el('div', { cls: 'inline-fields' });
      const nameInput = document.createElement('input');
      nameInput.value = getSpecialtyDisplayName(specialty);
      nameInput.placeholder = skillMeta.specialties[0] || 'Specialty name';
      nameInput.addEventListener('input', (event) => onChange((draft) => {
        const target = draft.skills[skillMeta.name].specialties.find((item) => item.id === specialty.id);
        target.name = event.target.value;
      }));

      const ratingSelect = document.createElement('select');
      buildOptions(ratingSelect, SPECIALTY_OPTIONS, specialty.rating);
      ratingSelect.disabled = currentEffective !== 'd6';
      ratingSelect.addEventListener('change', (event) => onChange((draft) => {
        const target = draft.skills[skillMeta.name].specialties.find((item) => item.id === specialty.id);
        target.rating = event.target.value;
      }));

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.textContent = 'X';
      removeButton.addEventListener('click', () => onChange((draft) => {
        draft.skills[skillMeta.name].specialties = draft.skills[skillMeta.name].specialties.filter((item) => item.id !== specialty.id);
      }));

      line.append(nameInput, ratingSelect, removeButton);
      specialtyWrap.append(line);
    });

    const addSpecButton = document.createElement('button');
    addSpecButton.type = 'button';
    addSpecButton.textContent = 'Add Specialty';
    addSpecButton.disabled = currentEffective !== 'd6';
    addSpecButton.addEventListener('click', () => onChange((draft) => {
      draft.skills[skillMeta.name].specialties.push(createEmptySpecialty());
    }));
    specialtyWrap.append(el('div', { cls: 'section-actions' }, [addSpecButton]));

    const specialtyPoints = skill.specialties.reduce((sum, specialty) => sum + specialtyDieCost(specialty.rating), 0);
    const isRoleSkill = state.character.basics.roleSkill === skillMeta.name;
    const roleTag = isRoleSkill ? el('span', { cls: 'role-tag', text: 'Role Training' }) : null;
    const purchasedText = isRoleSkill && currentEffective !== skill.generalRating
      ? `${skill.generalRating === 'none' ? '—' : skill.generalRating} → ${currentEffective}`
      : (skill.generalRating === 'none' ? '—' : skill.generalRating);

    wrap.append(el('div', { cls: `skill-row${isRoleSkill ? ' role-skill' : ''}` }, [
      el('div', { html: `<strong>${skillMeta.name}</strong><br><span class="muted">Examples: ${skillMeta.specialties.slice(0, 4).join(', ') || 'none listed'}</span>` }, roleTag ? [roleTag] : []),
      el('div', {}, [
        generalSelect,
        isRoleSkill ? el('small', { cls: 'help muted', text: `Final core rating ${currentEffective}` }) : null
      ]),
      el('div', { html: `<span class="points-badge">${dieCost(skill.generalRating)}</span>` }),
      specialtyWrap,
      el('div', { html: `<span class="points-badge">${specialtyPoints}</span>` }),
      el('div')
    ]));
  });

  root.append(wrap);
  return root;
}
