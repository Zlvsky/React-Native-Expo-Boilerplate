import assert from 'node:assert/strict'
import test from 'node:test'

import { parseStoredSession, serializeStoredSession } from './sessionPersistence'

const STORED_SESSION = {
  session: 'session-token',
  user: {
    id: 'user-1',
    email: 'person@example.com',
    name: 'Example Person'
  }
}

test('session persistence round-trips valid data', () => {
  const serialized = serializeStoredSession(STORED_SESSION)

  assert.deepEqual(parseStoredSession(serialized), STORED_SESSION)
})

test('session persistence rejects incomplete data', () => {
  assert.equal(parseStoredSession('{"session":"token"}'), null)
  assert.equal(parseStoredSession('{"user":{"id":1}}'), null)
})

test('session persistence rejects missing and malformed values', () => {
  assert.equal(parseStoredSession(null), null)
  assert.equal(parseStoredSession('not-json'), null)
})
