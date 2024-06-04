import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { TermCondition } from "../entities/termCondition.entity";

export default class TermConditionSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    // Repositories
    const termConditionRepository = dataSource.getRepository(TermCondition);

    console.log("Seeding terms and conditions...");

    const termsConditionsData = `
Bem-vindo(a).
Ao utilizar nosso site e serviços, você concorda com os seguintes termos e condições:
    
   1. Uso do Serviço
     1.1. Você deve ter pelo menos 18 anos para usar nosso serviço.
     1.2. Você é responsável por manter a segurança da sua conta.
    
   2. Conteúdo do Usuário
     2.1. Você mantém a propriedade de todo o conteúdo que publicar.
     2.2. Não é permitido publicar conteúdo que seja ilegal,
          ofensivo ou que viole direitos de terceiros.
    
   3. Privacidade
     3.1. Respeitamos sua privacidade e protegemos suas informações pessoais.
     3.2. Leia nossa Política de Privacidade para mais detalhes.
    
   4. Modificações dos Termos
     4.1. Reservamos o direito de modificar estes termos a qualquer momento.
     4.2. Notificaremos você sobre quaisquer alterações substanciais.
    
   5. Contato
     5.1. Se você tiver qualquer dúvida sobre estes termos,
          entre em contato conosco pelo e-mail suporte@main.com.
    
Obrigado por usar nossos serviços!

Última atualização: 03 de junho de 2024.
`;

    const termsConditions = termConditionRepository.create({
      content: termsConditionsData.trim(),
    });

    await termConditionRepository.save(termsConditions);
  }
}
