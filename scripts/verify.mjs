import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const raw=n=>fs.readFile(path.join(root,n));
const json=async n=>JSON.parse(await raw(n));
const sha=b=>createHash('sha256').update(b).digest('hex');
const safe=n=>{assert(!path.isAbsolute(n)&&!n.split('/').includes('..'));return n;};
async function verifyManifest(name){
 const manifest=await json(name);assert.equal(manifest.pathBase,'repository-root');
 assert.equal(new Set(manifest.files.map(f=>f.path)).size,manifest.files.length);
 for(const f of manifest.files){const bytes=await raw(safe(f.path));assert.equal(bytes.length,f.bytes,f.path);assert.equal(sha(bytes),f.sha256,f.path);}
 const lines=manifest.files.toSorted((a,b)=>a.path<b.path?-1:1).map(f=>`${f.sha256}  ${f.path}\n`).join('');assert.equal(sha(lines),manifest.bundleDigest);
 return manifest.files.length;
}
const discovery=await json('ontology/discovery.json');assert.equal(discovery.status,'review');assert.equal(discovery.runtimeAdmission,false);assert.equal(discovery.authorityTransfer,false);
assert.equal(discovery.schemaVersion,'rolodex.ontology-discovery.v1');
let result;
 const boundaries=await json('ontology/boundaries.json'),source=await json('provenance/devgraph/v0.12.0/ontology.jsonld'),context=await json('ontology/context.jsonld'),model=await json('ontology/ontology.jsonld');
 const extracted=model['@graph'].filter(n=>n['@id']!==discovery.ontologyId);
 assert.deepEqual(extracted,source['@graph'].filter(n=>boundaries.ownedTerms.includes(n['@id'])));assert.equal(extracted.length,7);assert.deepEqual(model['@context'],context['@context']);
 assert.equal(new Set(extracted.map(n=>n['@id'])).size,7);assert(!extracted.some(n=>['zn:Task','zn:Issue','zn:Arena','zn:Todo'].includes(n['@id'])));
 assert.equal(extracted.find(n=>n['@id']==='zn:Actor').equivalentClass,'zn:Entity');
 for(const n of extracted.filter(n=>n['@type']==='owl:Class'))assert.equal(n.runtimeLabel,false);
 const producer=await json('provenance/devgraph/v0.12.0/manifest.json');
 for(const file of ['ontology.jsonld','context.jsonld','rolodex.md']){const descriptor=producer.files.find(f=>f.path===file),bytes=await raw('provenance/devgraph/v0.12.0/'+file);assert.equal(sha(bytes),descriptor.sha256);assert.equal(bytes.length,descriptor.bytes);}
 const files=await verifyManifest(discovery.releaseManifest);
 for(const file of ['ontology.jsonld','context.jsonld','boundaries.json'])assert.deepEqual(await raw('ontology/'+file),await raw('releases/v0.1.0-review.1/ontology/'+file));
 result={directoryDefinitions:7,sourceTermsAndIRIsPreserved:true,releaseFiles:files,runtimeAdmission:false};
console.log(JSON.stringify(result));
