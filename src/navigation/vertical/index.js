const navigation = () => {
  return [
    {
      sectionTitle: ''
    },
    {
      sectionTitle: ''
    },

    {
      title: 'Dashboard',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:home-outline',
      badgeColor: 'error',
      path: '/mkl'
    },
    {
      title: 'Users',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:account-outline',
      path: '/mkl/user'
    },
    {
      title: 'All Student',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:account-outline',
      path: '/mkl/student/all'
    },

    {
      title: 'Class',
      action: 'read',
      subject: 'acl-page',
      icon: 'carbon:categories',
      path: '/mkl/classe'
    },
{
      title: 'Promotion',
      action: 'read',
      subject: 'acl-page',
      icon: 'carbon:categories',
      path: '/mkl/promotion'
    },
    {
      title: 'Depense',
      action: 'read',
      subject: 'acl-page',
      icon: 'carbon:categories',
      path: '/mkl/depense'
    },

 {
      title: 'Pay teacher',
      action: 'read',
      subject: 'acl-page',
      icon: 'carbon:categories',
      path: '/mkl/payteacher'
    },
    {
      title: 'Pay Admin',
      action: 'read',
      subject: 'acl-page',
      icon: 'carbon:categories',
      path: '/mkl/payadmin'
    },

 {
      title: 'Professeur',
      action: 'read',
      subject: 'acl-page',
      icon: 'carbon:categories',
      path: '/mkl/professeur'
    },


  ]
}

export default navigation
