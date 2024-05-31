import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { Application } from "../entities/application.entity";

export default class ApplicationSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    // Repositories
    const applicationRepository = dataSource.getRepository(Application);

    console.log("Seeding applications...");

    const applicationsData = [
      {
        name: "Sub 1",
        description: "Sistema de testes 1",
        logo: "https://prime-repo.s3.sa-east-1.amazonaws.com/main/applications/default-application-logo.jpeg",
      },
      {
        name: "Sub 2",
        description: "Sistema de testes 2",
        logo: "https://prime-repo.s3.sa-east-1.amazonaws.com/main/applications/default-application-logo.jpeg",
      },
      {
        name: "Sub 3",
        description: "Sistema de testes 3",
        logo: "https://prime-repo.s3.sa-east-1.amazonaws.com/main/applications/default-application-logo.jpeg",
      },
      {
        name: "Sub 4",
        description: "Sistema de testes 4",
        logo: "https://prime-repo.s3.sa-east-1.amazonaws.com/main/applications/default-application-logo.jpeg",
      },
      {
        name: "Sub 5",
        description: "Sistema de testes 5",
        logo: "https://prime-repo.s3.sa-east-1.amazonaws.com/main/applications/default-application-logo.jpeg",
      },
    ];

    const applications = await Promise.all(
      applicationsData.map(async (app) => {
        const foundApp = await applicationRepository.findOne({
          where: { name: app.name },
        });

        if (foundApp) {
          Object.assign(foundApp, {
            name: app.name,
            description: app.description,
            logo: app.logo,
          });
          return await applicationRepository.save(foundApp);
        } else {
          const newApplication = applicationRepository.create({
            name: app.name,
            description: app.description,
            logo: app.logo,
          });
          return await applicationRepository.save(newApplication);
        }
      })
    );
  }
}
