"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_CUSTOMTABLES = exports.CREATE_CTFIELD = exports.CREATE_CUSTOMTABLE = void 0;
exports.CREATE_CUSTOMTABLE = "\nmutation MyMutation($user_id: String!, $name: String!) {\n  insert_customtable(objects: {name: $name, user_id: $user_id}) {\n    returning {\n      id\n    }\n  }\n}\n";
// {
//   "name": "test",
//   "user_id": "..."
// }
exports.CREATE_CTFIELD = "\nmutation MyMutation($type: String!, $label: String!, $customtable: uuid!) {\n  insert_ctfield(objects: {label: $label, type: $type, customtable: $customtable}) {\n    returning {\n      id\n    }\n  }\n}\n";
// {
//   "label": "numNote",
//   "type": "number",
//   "customtable": "..."
// }
exports.GET_CUSTOMTABLES = "\nquery MyQuery {\n  customtable {\n    ctfields {\n      label\n      type\n    }\n    name\n    user_id\n  }\n}\n";
