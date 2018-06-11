import { Runner } from "./app/runner";

const runner = new Runner();
runner.run().then(() => process.exit(0));
