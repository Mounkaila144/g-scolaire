const navigation = () => {
  return [
    {
      icon: 'mdi:school',
      title: 'Ecole',
      children: [
        {
          title: 'Informations de l\'École',
          path: '/ecole',
          action: 'read',
          subject: 'ecole'
        }
      ]
    },
    {
      icon: 'mdi:account-circle',
      title: 'Utilisateurs',
      children: [
        {
          title: 'Gérer les Utilisateurs',
          path: '/users/manage',
          action: 'manage',
          subject: 'user'
        }
      ]
    },
    {
      icon: 'mdi:school',
      title: 'Gestion Académique',
      children: [
        {
          title: 'Promotions',
          path: '/promotions',
          action: 'manage',
          subject: 'promotion'
        },
        {
          title: 'Classes',
          path: '/classes',
          action: 'manage',
          subject: 'classe'
        },
        {
          title: 'Matières',
          path: '/matieres',
          action: 'manage',
          subject: 'matiere'
        },
        {
          title: 'Professeurs',
          path: '/professeurs',
          action: 'manage',
          subject: 'professeur'
        }
      ]
    },
    {
      icon: 'mdi:timetable',
      title: 'Horaires',
      path: '/schedules',
      action: 'manage',
      subject: 'schedule'
    },
    {
      icon: 'mdi:account-child',
      title: 'Gestion des Élèves',
      children: [
        {
          title: 'Inscription des Élèves',
          path: '/eleves/inscription',
          action: 'manage',
          subject: 'eleve'
        },
        {
          title: 'Suivi des Absences',
          path: '/eleves/absences',
          action: 'read',
          subject: 'absence'
        }
      ]
    },
    {
      icon: 'mdi:book-open-page-variant',
      title: 'Activités Académiques',
      children: [
        {
          title: 'Cours',
          path: '/cours',
          action: 'read',
          subject: 'cour'
        },
        {
          title: 'Évaluations',
          path: '/evaluations',
          action: 'manage',
          subject: 'evaluation'
        }
      ]
    },
    {
      icon: 'mdi:currency-usd',
      title: 'Finances',
      children: [
        {
          title: 'Gestion des Scolarités',
          path: '/finances/scolarites',
          action: 'manage',
          subject: 'scolarite'
        },
        {
          title: 'Dépenses',
          path: '/finances/depenses',
          action: 'manage',
          subject: 'depense'
        },
        {
          title: 'Paiements des Salaires',
          path: '/finances/paiements-salaires',
          action: 'manage',
          subject: 'payteacher'
        }
      ]
    },
    {
      icon: 'mdi:file-document',
      title: 'Ressources Pédagogiques',
      path: '/ressources-pedagogiques',
      action: 'manage',
      subject: 'texte'
    },
    {
      icon: 'mdi:bell-alert',
      title: 'Communication et Rapports',
      path: '/communication',
      action: 'read',
      subject: 'communication'
    },
    {
      icon: 'mdi:view-dashboard',
      title: 'Dashboard',
      path: '/dashboard',
      action: 'read',
      subject: 'dashboard'
    }
  ];
};

export default navigation;

