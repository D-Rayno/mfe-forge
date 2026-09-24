import React from 'react'
import { describe, expect, it } from 'vitest'
import { generateRoutes } from './index.js'

function Checkout() {
  return React.createElement('div', null, 'checkout')
}

function Dashboard() {
  return React.createElement('div', null, 'dashboard')
}

describe('generateRoutes', () => {
  it('prefixes registered routes with their scope', () => {
    const [route] = generateRoutes({
      checkout: [{ path: '/cart', component: Checkout }],
    })

    expect(route.props.path).toBe('/checkout/cart')
    expect(route.props.element.type).toBe(Checkout)
  })

  it('supports multiple scopes without changing route definitions', () => {
    const routes = generateRoutes({
      checkout: [{ path: '/', component: Checkout }],
      admin: [{ path: '/dashboard', component: Dashboard }],
    })

    expect(routes).toHaveLength(2)
    expect(routes.map((route) => route.props.path)).toEqual(['/checkout/', '/admin/dashboard'])
  })
})
