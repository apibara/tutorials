import { OpenAI } from "langchain/llms/openai"
import { SqlDatabase } from "langchain/sql_db"
import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql"
import { DataSource } from 'typeorm'
import {} from 'pg'
import { input, confirm } from '@inquirer/prompts'
import chalk from 'chalk'

export async function main() {
    const datasource = new DataSource({
        type: 'postgres',
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        host: 'localhost',
        port: 54322,
    })

    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
    })
    const model = new OpenAI({
        temperature: 0,
        openAIApiKey: Deno.env.get('OPENAI_API_KEY')
    })
    const toolkit = new SqlToolkit(db, model)
    const executor = createSqlAgent(model, toolkit)

    while (true) {
        const query = await input({ message: 'Ask ChatGPT anything' })
        if (query.trim().length == 0) {
            break
        }

        const result = await executor.call({
            input: query
        })

        console.log(chalk.green('> '), result.output)

        const viewSteps = await confirm({ message: 'View steps?' })

        if (!viewSteps) {
            continue
        }

        let step = 0
        for (let { action, observation } of result.intermediateSteps) {
            step += 1
            console.log(chalk.red(`Step ${step}: ${action.tool}`))
            console.log(chalk.gray(`  ${action.log}`))
            console.log(chalk.blue(`  Observation`))
            console.log(chalk.gray(`    ${observation}`))
        }
    }
  
    await datasource.destroy();
}

main()