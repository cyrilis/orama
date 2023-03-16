import { Orama, Schema, OpaqueDocumentStore, OpaqueIndex, SynonymConfig, ClearSynonymscConfig } from "../types.js";

export async function addSynonyms<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Orama<S, I, D>,
  config: SynonymConfig,
) {
  db.synonyms.add(db.data.synonyms, config);
}

export async function removeSynonyms<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Orama<S, I, D>,
  config: SynonymConfig,
) {
  db.synonyms.remove(db.data.synonyms, config);
}

export async function clearSynonyms<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Orama<S, I, D>,
  config: ClearSynonymscConfig,
) {
  db.synonyms.clear(db.data.synonyms, config);
}

export async function getSynonyms<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  db: Orama<S, I, D>,
  config: ClearSynonymscConfig,
) {
  return db.synonyms.get(db.data.synonyms, config);
}