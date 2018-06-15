import * as program from "commander";
import { Runner } from "./app/runner";

try {
  program
    .version("1.0.0")
    .option("-h, --host [type]", "Endpoint to load", "http://localhost:8081/graphql")
    .option("-o, --output [u]", "Output folder", "./output")
    .option("-n, --node", "make node endpoint")
    .parse(process.argv);

} catch (error) {
  console.log(error);
}

const runner = new Runner(program.host, program.output, program.node);
runner.run().then(() => process.exit(0));
