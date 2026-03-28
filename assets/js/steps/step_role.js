import { ROLE_OPTIONS, getAllowedRoleSkills, getDefaultRoleSkill, getRoleGuidance, resolveRoleLabel } from '../data/roles.js';
import { el, field, sectionHeader } from '../ui.js';

function buildSelect(options, current) {
  const select = document.createElement('select');
  const blank = document.createElement('option');
  blank.value = '';
  blank.textContent = 'Choose...';
  select.append(blank);
  options.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    if (current === option) opt.selected = true;
    select.append(opt);
  });
  return select;
}

export function renderRoleStep(state, onChange) {
  const root = el('div');
  root.append(sectionHeader('Step 2: Role on the Crew', 'A boat runs on jobs, not vibes. Pick the lane this character fills aboard ship, then choose the one core skill that gets the free d2 training bump during creation.'));

  const grid = el('div', { cls: 'grid-2' });
  const left = el('div', { cls: 'field-card' });
  const right = el('div', { cls: 'field-card' });

  const currentRoleValue = ROLE_OPTIONS.includes(state.character.basics.role || '') ? (state.character.basics.role || '') : ((state.character.basics.role || '') ? 'Other' : '');
  const roleSelect = buildSelect(ROLE_OPTIONS, currentRoleValue);
  roleSelect.addEventListener('change', (event) => onChange((draft) => {
    const nextRole = event.target.value;
    draft.basics.role = nextRole;
    const allowed = getAllowedRoleSkills(nextRole);
    if (!allowed.includes(draft.basics.roleSkill || '')) {
      draft.basics.roleSkill = getDefaultRoleSkill(nextRole);
    }
  }));
  left.append(field('Role on the Crew', roleSelect, 'This is the job the crew expects you to be able to do when things go wrong.'));

  const customRole = document.createElement('input');
  customRole.value = state.character.basics.customRole || '';
  customRole.placeholder = 'Only used if Role on the Crew is Other';
  customRole.disabled = (state.character.basics.role || '') !== 'Other';
  customRole.addEventListener('input', (event) => onChange((draft) => { draft.basics.customRole = event.target.value; }));
  left.append(field('Custom Role Label', customRole, 'Leave blank unless you chose Other.'));

  const roleSkillOptions = getAllowedRoleSkills(currentRoleValue);
  const currentRoleSkill = roleSkillOptions.includes(state.character.basics.roleSkill || '') ? (state.character.basics.roleSkill || '') : '';
  const roleSkillSelect = buildSelect(roleSkillOptions, currentRoleSkill);
  roleSkillSelect.disabled = !currentRoleValue;
  roleSkillSelect.addEventListener('change', (event) => onChange((draft) => { draft.basics.roleSkill = event.target.value; }));
  left.append(field('Role Skill (Free d2 at Creation)', roleSkillSelect, currentRoleValue === 'Other'
    ? 'Other lets you choose any one core skill. All listed roles are narrowed to the short skill list that actually fits the job.'
    : 'The chosen core skill gets a free d2 step during creation only. It is not a live roll bonus at the table.'));

  const crewValue = document.createElement('textarea');
  crewValue.value = state.character.basics.crewValue || '';
  crewValue.addEventListener('input', (event) => onChange((draft) => { draft.basics.crewValue = event.target.value; }));
  left.append(field('Why the Crew Keeps You Aboard', crewValue, 'One or two sentences. What do you contribute that makes your berth make sense?'));

  right.append(el('div', { cls: 'summary-card guide-card' }, [
    el('h3', { text: resolveRoleLabel(state.character.basics) === '—' ? 'Pick a role' : resolveRoleLabel(state.character.basics) }),
    el('p', { text: currentRoleValue ? getRoleGuidance(currentRoleValue) : 'If nobody aboard can fly, fix, patch, talk, or keep watch, the campaign gets short in ugly ways.' }),
    el('p', { cls: 'muted', text: roleSkillOptions.length ? `Allowed role skills: ${roleSkillOptions.join(', ')}` : 'Choose a role to see the available role skills.' })
  ]));

  right.append(el('div', { cls: 'summary-card' }, [
    el('h3', { text: 'House Rule Reminder' }),
    el('p', { text: state.character.basics.roleSkill
      ? `${state.character.basics.roleSkill} gets the free d2 training bump at creation, which makes the skill cheaper to build and helps the character fit the job they claim to do.`
      : 'The role skill exists to keep characters from claiming a job aboard ship that their sheet cannot back up.' })
  ]));

  grid.append(left, right);
  root.append(grid);
  return root;
}
