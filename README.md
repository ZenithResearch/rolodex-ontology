# Rolodex ontology

Proposed dedicated canonical authoring repository for the directory vocabulary. It is independent of Rolodex App Server, which is a private docs-first scaffold for a read-only hosted mobile contact projection API.

## Split scope

The initial review source extracts exactly seven existing DevGraph v0.12 definitions, preserving their term IRIs and all source-authored axioms:

- Entity, Person, Agent and Organization;
- Actor, the existing equivalent compatibility name for Entity;
- MEMBER_OF and OPERATED_BY.

Work assignment, stewardship and work/evidence attribution relationships stay in the DevGraph integration boundary. Their current declarations are preserved in the provenance snapshot; they are not silently moved or broadened. Private contacts, wallet custody, credentials, authentication, profile storage and runtime API schemas are outside this directory-core extraction. New directory and participation extensions require their own review.

Start at [discovery](ontology/discovery.json), [ontology](ontology/ontology.jsonld) and [boundary record](ontology/boundaries.json). The initial `0.1.0-review.1` snapshot is under `releases/`. Its repository version is independent of the originating DevGraph version. The ontology document uses a review identifier; the existing HTTPS term identities are unchanged.

The original DevGraph ontology, context, manifest and Rolodex notes are retained under `provenance/` as historical evidence. Their original wording and ownership statements describe that producer release; the user has requested this new source split for future authoring.

## Compatibility and adoption

Existing DevGraph and Zendo releases remain pinned to their original complete bundles. Creating this repository does not change those imports or delete their repeated directory definitions. A future DevGraph release should explicitly consume a reviewed Rolodex source pin; consumers then upgrade through their own releases. Zenith hosting acceptance and source ownership/namespace decisions are separate from repository creation. No runtime routes, labels, credentials or authority are granted by this source.

Run `npm test` with Node 22 or newer. No third-party dependencies. Do not overwrite existing versioned snapshots.
