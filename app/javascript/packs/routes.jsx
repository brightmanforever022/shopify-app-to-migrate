import Home from './views/pages'

import Template from './views/pages/templates'
import NewTemplate from './views/pages/templates/detail'
import EditTemplate from './views/pages/templates/detail'

import Attribute from './views/pages/attributes'
import NewAttribute from './views/pages/attributes/detail'
import EditAttribute from './views/pages/attributes/detail'

const routes = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/templates',
    exact: true,
    component: Template
  },
  {
    path: '/templates/new',
    exact: true,
    component: NewTemplate
  },
  {
    path: '/templates/:id/edit',
    exact: true,
    component: EditTemplate
  },
  {
    path: '/attributes',
    exact: true,
    component: Attribute
  },
  {
    path: '/attributes/new',
    exact: true,
    component: NewAttribute
  },
  {
    path: '/attributes/:id/edit',
    exact: true,
    component: EditAttribute
  }
]

export default routes