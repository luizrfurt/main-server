import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager, runSeeder } from "typeorm-extension";
import ApplicationSeeder from "./application.seed";
import TermConditionSeeder from "./termCondition.seed";

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    await runSeeder(dataSource, ApplicationSeeder);
    await runSeeder(dataSource, TermConditionSeeder);

  }
}
