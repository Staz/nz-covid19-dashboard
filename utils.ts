import { parse } from 'papaparse'
import { table } from 'table'
import { createReadStream, readFileSync } from 'fs'

export const parseJson = <T>(filePath: string) => {
  const jsonString = readFileSync(filePath, { encoding: 'utf-8' })
  return JSON.parse(jsonString) as Array<T>
}

// TODO: Trim headings!!! Just got bitten
export const parseCsv = <T>(filePath: string, withHeader = false) => {
  const file = createReadStream(filePath)

  return new Promise<T[]>((resolve, reject) => {
    parse<T>(file, {
      complete: (results) => {
        if (results.errors.length) {
          reject(JSON.stringify(results.errors))
        }

        resolve(results.data)
      },
      error: (error) => reject(error),
      delimiter: ',',
      header: withHeader, // If true, the first row of parsed data will be interpreted as field names.
      dynamicTyping: true, // If true, numeric and boolean data will be converted to their type instead of remaining strings
    })
  })
}

/**
 * Convert a flat object to an array of values suitable for use with [table]{@link https://npmjs.com/package/table}.
 *
 * @param {Object} obj source of plain values
 * @param {Object} [options]
 * @param {string[]} [options.columns] the key names to use. Order is respected. Default is the result of `Object.keys(obj)`
 * @param {Object} [options.custom=null] additional values to use. Keys must not overlap with source obj.
 * @param {*} [options.default=''] value to use if a column name is not found in either the source obj or additional custom values.
 * @returns {Array} values in the same order as the specified columns
 */
function rowify(obj, options) {
  const columns = (options && options.columns) || Object.keys(obj)
  const custom = options && options.custom
  const missingValue = (options && options['default']) || ''
  const row = []

  // add keys if no columns were specified
  if (custom && !options.columns) {
    columns.push(...Object.keys(custom))
  }

  for (const column of columns) {
    if (obj.hasOwnProperty(column)) {
      row.push(obj[column])
    } else if (custom && custom.hasOwnProperty(column)) {
      row.push(custom[column])
    } else {
      row.push(missingValue)
    }
  }

  return row
}

export const display = (
  data: Array<Array<unknown>> | Array<{}>,
  columnNames?: string[]
) => {
  let transformedData

  if (!data.length) {
    return
  }

  if (Array.isArray(data[0])) {
    transformedData = [...data]

    if (columnNames) {
      transformedData = [columnNames, ...data]
    }
  } else {
    const columnsToDisplay = columnNames ?? Object.keys(data[0])
    transformedData = data.map((x) =>
      rowify(x, { columnNames: columnsToDisplay })
    )

    transformedData.unshift(columnsToDisplay)
  }

  console.log(table(transformedData))
}
