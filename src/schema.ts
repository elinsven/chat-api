import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from "./graphql"; //You are importing the graphql model which exports the Link object type through index.ts. The import is named types.

export const schema = makeSchema({
  types, //You are passing types to the makeSchema function. Nexus will do its thing to generate the SDL from this.
  outputs: {
    schema: join(process.cwd(), "schema.graphql"),
    typegen: join(process.cwd(), "nexus-typegen.ts")
  },
  contextType: {
    module: join(process.cwd(), "./src/context.ts"),  //Path to the file (also sometimes called a module) where the context interface (or type) is exported.
    export: "Context",  //Name of the exported interface in that module.
  }
})