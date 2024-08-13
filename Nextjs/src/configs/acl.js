import { AbilityBuilder, Ability } from '@casl/ability';

export const AppAbility = Ability;

const defineRulesFor = (role) => {
  const { can, cannot, rules } = new AbilityBuilder(AppAbility);

  switch (role) {
    case 'superadmin':
      can('manage', 'all');
      break;
    case 'admin':
      can('read', 'all');
      can('manage', 'all');
      cannot('manage', 'superadmin-acl');
      break;
    case 'prof':
      can('read', ['academic', 'personal']);
      cannot('manage', 'all');
      break;
    case 'eleve':
      can('read', ['personal', 'academic']);
      cannot('manage', 'all');
      break;
    default:
      can('read', 'public');
      break;
  }
  return rules;
};

export const buildAbilityFor = (role) => {
  return new AppAbility(defineRulesFor(role), {
    detectSubjectType: object => object.type
  });
};

export const defaultACLObj = {
  action: 'read',
  subject: 'acl-page'
}

export default defineRulesFor
