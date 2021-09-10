export const CREATE_CUSTOMTABLE = `
mutation MyMutation($user_id: String!, $name: String!) {
  insert_customtable(objects: {name: $name, user_id: $user_id}) {
    returning {
      id
    }
  }
}
`
// {
//   "name": "test",
//   "user_id": "..."
// }

export const CREATE_CTFIELD = `
mutation MyMutation($type: String!, $label: String!, $customtable: uuid!) {
  insert_ctfield(objects: {label: $label, type: $type, customtable: $customtable}) {
    returning {
      id
    }
  }
}
`
// {
//   "label": "numNote",
//   "type": "number",
//   "customtable": "..."
// }

export const GET_CUSTOMTABLES = `
query MyQuery {
  customtable {
    ctfields {
      label
      type
    }
    name
    user_id
  }
}
`