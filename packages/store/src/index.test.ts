import { beforeEach, describe, expect, it } from 'vitest'
import { createScopedStore, useGlobalStore } from './index.js'

describe('useGlobalStore', () => {
  beforeEach(() => {
    useGlobalStore.setState({
      user: null,
      theme: 'system',
      locale: 'en',
      features: {},
    })
  })

  it('updates global user, theme, locale and feature state', () => {
    useGlobalStore.getState().setUser({
      id: '1',
      name: 'Rayno',
      email: 'rayno@example.test',
      roles: ['admin'],
    })
    useGlobalStore.getState().setTheme('dark')
    useGlobalStore.getState().setLocale('fr')
    useGlobalStore.getState().toggleFeature('new-dashboard')

    expect(useGlobalStore.getState()).toMatchObject({
      user: expect.objectContaining({ id: '1' }),
      theme: 'dark',
      locale: 'fr',
      features: { 'new-dashboard': true },
    })
  })
})

describe('createScopedStore', () => {
  it('creates isolated state with a reset action', () => {
    const store = createScopedStore('cart', { items: [], total: 0 })

    store.setState({ items: ['item-1'], total: 10 })
    expect(store.getState()).toMatchObject({ items: ['item-1'], total: 10 })

    store.getState().reset()
    expect(store.getState()).toEqual({ items: [], total: 0, reset: expect.any(Function) })
  })
})
