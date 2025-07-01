import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'
import { describe, beforeEach, test, expect } from '@jest/globals'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  const testState = (initialState, action, expected) => {
    const state = initialState
    state && deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual(expected)
  }

  test('should return a proper initial state when called with undefined state', () => {
    testState(undefined, { type: 'DO_NOTHING' }, initialState)
  })

  test('good is incremented', () => {
    testState(initialState, { type: 'GOOD' }, {
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('ok is incremented', () => {
    testState(initialState, { type: 'OK' }, {
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    testState(initialState, { type: 'BAD' }, {
      good: 0,
      ok: 0,
      bad: 1
    })
  })
})