/**
 * TOOD
 *  - Case hospitalisation rate since omicron first case
 *  - Fatality rate since omicron first case
 */

import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

// 2021 Q4
const NZ_POPULATION = 5127200
const FIRST_OMICRON_CASE_DATE = '16/12/2021'

export interface SingleStats {
  'Active cases as percentage of population': number
}

const CURRENT_CASES_DIRECTORY_PATH =
  'nz-covid19-data/data/moh/covid-19-current-cases'

const getLatestJsonData = (directoryPath: string) => {
  const dirContents = readdirSync(directoryPath)

  const latestJson = dirContents
    .reverse()
    .find((name) => name.endsWith('.json'))

  const latestJsonPath = join(directoryPath, latestJson)

  const jsonData = JSON.parse(
    readFileSync(latestJsonPath, {
      encoding: 'utf-8',
    })
  )

  return {
    data: jsonData,
    date: latestJson.replace(/\.json$/, ''),
  }
}

export const getSingleStats = (): SingleStats => {
  const { date, data: currentCasesData } = getLatestJsonData(
    CURRENT_CASES_DIRECTORY_PATH
  )

  const activeCases =
    currentCasesData['Number of active cases']['Total']['Total at present']

  return {
    'Active cases as percentage of population':
      (activeCases / NZ_POPULATION) * 100,
  }
}
