import { ATTRIBUTE_LIST, DIE_COSTS, HEROIC_LEVEL, SPECIALTY_DIE_COSTS } from './data/defaults.js';
import { getAllowedRoleSkills } from './data/roles.js';
import { getSpecialtyDisplayName } from './data/specialties.js';
import { MUTUALLY_EXCLUSIVE_TRAIT_PAIRS } from './data/traits.js';

const GENERAL_SKILL_STEPS = ['none', 'd2', 'd4', 'd6'];
const ASSIGNED_ATTRIBUTE_VALUES = ['d2', 'd4', 'd6', 'd8', 'd10', 'd12'];

export function dieCost(die) {
  return DIE_COSTS[die] ?? 0;
}

export function specialtyDieCost(die) {
  return SPECIALTY_DIE_COSTS[die] ?? 0;
}

export function isAssignedAttributeDie(die) {
  return ASSIGNED_ATTRIBUTE_VALUES.includes(die);
}

export function stepUpGeneralSkill(die) {
  const index = GENERAL_SKILL_STEPS.indexOf(die);
  if (index === -1) return 'd2';
  return GENERAL_SKILL_STEPS[Math.min(index + 1, GENERAL_SKILL_STEPS.length - 1)];
}

export function effectiveGeneralRating(character, skillName) {
  const purchased = character.skills?.[skillName]?.generalRating || 'none';
  if ((character.basics?.roleSkill || '') === skillName) {
    return stepUpGeneralSkill(purchased);
  }
  return purchased;
}

export function calculateAttributePoints(character) {
  return ATTRIBUTE_LIST.reduce((sum, attribute) => sum + dieCost(character.attributes[attribute]), 0);
}

export function calculateTraitPoints(character) {
  const assetCost = character.traits.assets.reduce((sum, trait) => sum + dieCost(trait.rating), 0);
  const complicationGain = character.traits.complications.reduce((sum, trait) => sum + dieCost(trait.rating), 0);
  return HEROIC_LEVEL.traitPoints + complicationGain - assetCost;
}

export function calculateSkillPoints(character) {
  let total = 0;
  Object.values(character.skills).forEach((skill) => {
    total += dieCost(skill.generalRating || 'none');
    (skill.specialties || []).forEach((specialty) => {
      total += specialtyDieCost(specialty.rating || 'none');
    });
  });
  return total;
}

export function lifePoints(character) {
  if (!isAssignedAttributeDie(character.attributes.Vitality) || !isAssignedAttributeDie(character.attributes.Willpower)) {
    return '-';
  }
  return dieCost(character.attributes.Vitality) + dieCost(character.attributes.Willpower);
}

export function initiative(character) {
  if (!isAssignedAttributeDie(character.attributes.Agility) || !isAssignedAttributeDie(character.attributes.Alertness)) {
    return '-';
  }
  return `${character.attributes.Agility} + ${character.attributes.Alertness}`;
}

export function remainingBudgets(character) {
  return {
    attributes: HEROIC_LEVEL.attributePoints - calculateAttributePoints(character),
    traits: calculateTraitPoints(character),
    skills: HEROIC_LEVEL.skillPoints - calculateSkillPoints(character)
  };
}

export function validateCharacter(character) {
  const errors = [];
  const budgets = remainingBudgets(character);
  const unassignedAttributes = ATTRIBUTE_LIST.filter((attribute) => !isAssignedAttributeDie(character.attributes[attribute]));

  if (unassignedAttributes.length > 0) {
    errors.push(`Assign all Attributes before the build can be finished. Remaining: ${unassignedAttributes.join(', ')}.`);
  }

  if (budgets.attributes !== 0) {
    errors.push(`Attribute Points must spend exactly ${HEROIC_LEVEL.attributePoints}. Current remainder: ${budgets.attributes}.`);
  }

  if (budgets.skills < 0) {
    errors.push(`Skill Points overspent by ${Math.abs(budgets.skills)}.`);
  }

  if (budgets.traits < 0) {
    errors.push(`Trait Points overspent by ${Math.abs(budgets.traits)}.`);
  }

  const assetCount = character.traits.assets.filter((trait) => trait.name && trait.rating !== 'none').length;
  const complicationCount = character.traits.complications.filter((trait) => trait.name && trait.rating !== 'none').length;
  const selectedTraitNames = [
    ...character.traits.assets,
    ...character.traits.complications
  ].filter((trait) => trait.name && trait.rating !== 'none').map((trait) => trait.name);

  if (assetCount < 1) errors.push('At least one Asset is required.');
  if (complicationCount < 1) errors.push('At least one Complication is required.');
  if (assetCount > 5) errors.push('No more than five Assets.');
  if (complicationCount > 5) errors.push('No more than five Complications.');

  MUTUALLY_EXCLUSIVE_TRAIT_PAIRS.forEach(([left, right]) => {
    if (selectedTraitNames.includes(left) && selectedTraitNames.includes(right)) {
      errors.push(`Mutually exclusive traits cannot be taken together: ${left} and ${right}.`);
    }
  });

  Object.entries(character.skills).forEach(([skillName, skill]) => {
    const specialties = (skill.specialties || []).filter((item) => item.rating !== 'none');
    if (specialties.length > 0 && effectiveGeneralRating(character, skillName) !== 'd6') {
      errors.push(`${skillName} needs a final General rating of d6 before specialties can count.`);
    }
    specialties.forEach((specialty) => {
      if (!getSpecialtyDisplayName(specialty)) {
        errors.push(`${skillName} has a specialty with a die rating but no name.`);
      }
    });
  });

  if (!character.basics.name.trim()) errors.push('Character name is blank.');
  if (!character.basics.concept.trim()) errors.push('Character concept is blank.');
  if (!character.basics.role.trim()) errors.push('Role on the Crew is blank.');
  if (!character.basics.roleSkill.trim()) {
    errors.push('Role Skill is blank.');
  } else {
    const allowedRoleSkills = getAllowedRoleSkills(character.basics.role || '');
    if (allowedRoleSkills.length && !allowedRoleSkills.includes(character.basics.roleSkill)) {
      errors.push(`Role Skill ${character.basics.roleSkill} does not fit the chosen crew role.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    budgets,
    lifePoints: lifePoints(character),
    initiative: initiative(character)
  };
}
