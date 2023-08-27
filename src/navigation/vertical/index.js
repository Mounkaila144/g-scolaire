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
      title: 'Date Pickers',
      action: 'read',
      subject: 'acl-page',
      icon: 'carbon:categories',
      path: '/forms/form-elements/pickers'
    },
  ]
}

export default navigation
