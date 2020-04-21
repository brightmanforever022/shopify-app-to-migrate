import Home from './views/pages'

import Template from './views/pages/templates'
import NewTemplate from './views/pages/templates/detail'
import EditTemplate from './views/pages/templates/detail'

import Attribute from './views/pages/attributes'
import NewAttribute from './views/pages/attributes/detail'
import EditAttribute from './views/pages/attributes/detail'

import Freightoption from './views/pages/freightoptions'
import NewFreightoption from './views/pages/freightoptions/detail'
import EditFreightoption from './views/pages/freightoptions/detail'

import Vendor from './views/pages/vendors'
import NewVendor from './views/pages/vendors/detail'
import EditVendor from './views/pages/vendors/detail'

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
  },
  {
    path: '/freightoptions',
    exact: true,
    component: Freightoption
  },
  {
    path: '/freightoptions/new',
    exact: true,
    component: NewFreightoption
  },
  {
    path: '/freightoptions/:id/edit',
    exact: true,
    component: EditFreightoption
  },
  {
    path: '/vendors',
    exact: true,
    component: Vendor
  },
  {
    path: '/vendors/new',
    exact: true,
    component: NewVendor
  },
  {
    path: '/vendors/:id/edit',
    exact: true,
    component: EditVendor
  }
]

export default routes