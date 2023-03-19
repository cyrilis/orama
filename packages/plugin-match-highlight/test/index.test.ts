import { create, insertWithHooks } from '@orama/orama'
import t from 'tap'
import { afterInsert, OramaWithHighlight, searchWithHighlight } from '../src/index.js'

t.test('it should store the position of tokens', async t => {
  const schema = {
    text: 'string'
  } as const

  const db = (await create({ schema, hooks: { afterInsert } })) as OramaWithHighlight<typeof schema>

  await insertWithHooks(db, { text: 'hello world' })

  t.same(db.positions[Object.keys(db.docs)[0]], {
    text: { hello: [{ start: 0, length: 5 }], world: [{ start: 6, length: 5 }] }
  })
})

t.test('it should manage nested schemas', async t => {
  const schema = {
    other: {
      text: 'string'
    }
  } as const

  const db = (await create({ schema, hooks: { afterInsert } })) as OramaWithHighlight<typeof schema>

  await insertWithHooks(db, { other: { text: 'hello world' } })

  t.same(db.positions[Object.keys(db.docs)[0]], {
    'other.text': { hello: [{ start: 0, length: 5 }], world: [{ start: 6, length: 5 }] }
  })
})

t.test("it shouldn't stem tokens", async t => {
  const schema = {
    text: 'string'
  } as const

  const db = (await create({ schema, hooks: { afterInsert } })) as OramaWithHighlight<typeof schema>

  await insertWithHooks(db, { text: 'hello personalization' })

  t.same(db.positions[Object.keys(db.docs)[0]], {
    text: { hello: [{ start: 0, length: 5 }], person: [{ start: 6, length: 15 }] }
  })
})

t.test('should retrieve positions', async t => {
  const schema = {
    text: 'string'
  } as const

  const db = (await create({ schema, hooks: { afterInsert } })) as OramaWithHighlight<typeof schema>

  await insertWithHooks(db, { text: 'hello world' })

  const results = await searchWithHighlight(db, { term: 'hello' })
  t.same(results[0].positions, { text: { hello: [{ start: 0, length: 5 }] } })
})

t.test('should work with texts containing constructor and __proto__ properties', async t => {
  const schema = {
    text: 'string'
  } as const

  const db = (await create({ schema, hooks: { afterInsert } })) as OramaWithHighlight<typeof schema>

  await insertWithHooks(db, { text: 'constructor __proto__' })

  const results = await searchWithHighlight(db, { term: 'constructor' })
  t.same(results[0].positions, {
    text: { constructor: [{ start: 0, length: 11 }] }
  })
})
