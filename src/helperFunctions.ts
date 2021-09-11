import { KeyWordInfo, TableInput } from "./types"
const fs = require('fs')
const levenshtein = require('js-levenshtein');
const fetch = require('node-fetch');

export const fetchGraphQL = async (
  schema: string,
  variables: any = {},
): Promise<any> => {
  const graphql = JSON.stringify({
    query: schema,
    variables,
  });
  console.log(process.env.ADMIN_SECRET);
  
  const requestOptions = {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': `${process.env.ADMIN_SECRET}`,
    },
    body: graphql,
  };
  const database_url = "https://data-logger.hasura.app/v1/graphql";
  const res = await fetch(database_url, requestOptions).then((res: any) =>
    res.json()
  );
  
  return res;
};

export const numberEdgeCases = (numberString: string): string => {
  switch (numberString) {
    case 'one':
      return '1'
    case 'two':
    case 'to':
    case 'too':
      return '2'
    case 'three':
    case 'tree':
      return '3'
    case 'four':
    case 'for':
      return '4'
    case 'five':
    case 'hive':
      return '5'
    case 'six':
    case 'sex':
      return '6'
    case 'seven':
      return '7'
    case 'eight':
    case 'ate':
      return '8'
    case 'nine':
      return '9'
    default:
      return numberString
  }
}
// numberEdgeCases('to')

export const keyWordInfo = (parsedTranscription: string[], keyWords: string[], targetType: string = 'string'): KeyWordInfo => {
  const keyWordSymbol = parsedTranscription.find(word => keyWords.find(keyWord => levenshtein(word, keyWord) < 2))
  let keyWordIndex
  if (keyWordSymbol) {
    keyWordIndex = parsedTranscription.indexOf(keyWordSymbol)
  } else {
    keyWordIndex = 1
  }
  let keyWordTarget
  switch (targetType) {
    case 'int':
      keyWordTarget = parseInt(numberEdgeCases(parsedTranscription[keyWordIndex - 1]))
      break;
    case 'float':
      keyWordTarget = parseFloat(numberEdgeCases(parsedTranscription[keyWordIndex - 1]))
      break;
    default:
      keyWordTarget = parsedTranscription[keyWordIndex - 1]
      break;
  }
  

  console.log({symbol: keyWordSymbol, index: keyWordIndex, target: keyWordTarget});

  return {symbol: keyWordSymbol, index: keyWordIndex, target: keyWordTarget}
}

export const createM4AFile = async (m4aStringified: string): Promise<String> => {
  await fs.writeFileSync('./toTranscribe.m4a', m4aStringified, {encoding: 'base64'}, (err: any) => {console.error(err)})
  console.log('File downloaded');
  return './toTranscribe.m4a'
}
export const deleteFileLocally = (fileName: string) => {
  fs.unlink(`./${fileName}`, (err: any) => {
    if (err) {
      console.error('ERROR: ', err)
      return
    }
  })
}

export const createTableBody = (input: TableInput, user_id: string): any => {
  const user_id_regex = user_id.replace(/[^a-zA-Z0-9]/g, '').slice(-12)
  const tableName = `u_${user_id_regex}_${input.name}`
  const typeParser = (type: String) => {
    switch (type) {
      case 'number':
        return 'int'
      case 'string':
        return 'text'
      default:
        return 'text'
    }
  }
  const customFields = input.fields.map(field => {
    return `${field.label} ${typeParser(field.type)}`
  }).join(', ')
  const baseFields = [`id serial NOT NULL`, `user_id text NOT NULL`, `dateTime text NOT NULL`].join(', ')
  const bulkBody = {
    "type": "bulk",
    "args": [
      {
        "type": "run_sql",
        "args": {
          "sql": `CREATE TABLE ${tableName}(${baseFields}, ${customFields}, PRIMARY KEY (id));`
        }
      },
      {
        "type": "track_table",
        "args": {
          "schema": "public",
          "name": tableName
        }
      },
      {
        "type": "run_sql",
        "args": {
          "sql": `ALTER TABLE ${tableName} ADD FOREIGN KEY (user_id) REFERENCES users(id)`
        }
      },
      {
        "type": "create_object_relationship",
        "args": {
          "table": tableName,
          "name": "user",
          "using": {
            "foreign_key_constraint_on": "user_id"
          }
        }
      },
      {
        "type": "create_array_relationship",
        "args": {
          "table": "users",
          "name": tableName,
          "using": {
            "foreign_key_constraint_on": {
              "table": tableName,
              "column": "user_id"
            }
          }
        }
      },
      {
        "type": "create_insert_permission",
        "args": {
          "table": tableName,
          "role": "user",
          "permission": {
            "columns": "*",
            "check": {
              "user_id": {"_eq": "X-Hasura-User-Id"}
            }
          }
        }
      },
      {
        "type": "create_select_permission",
        "args": {
          "table": tableName,
          "role": "user",
          "permission": {
            "columns": "*",
            "filter": {
              "user_id": {"_eq": "X-Hasura-User-Id"}
            }
          }
        }
      },
      {
        "type": "create_update_permission",
        "args": {
          "table": tableName,
          "role": "user",
          "permission": {
            "columns": "*",
            "filter": {
              "user_id": {"_eq": "X-Hasura-User-Id"}
            }
          }
        }
      },
      {
        "type": "create_delete_permission",
        "args": {
          "table": tableName,
          "role": "user",
          "permission": {
            "columns": "*",
            "filter": {
              "user_id": {"_eq": "X-Hasura-User-Id"}
            }
          }
        }
      }
    ]
  }
  console.log('bulkBody: ', JSON.stringify(bulkBody));
  
  return bulkBody
} 