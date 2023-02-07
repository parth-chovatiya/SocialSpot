exports.createPage = ({ Pages, filter, newData, projection }) =>
  Pages.insertOne(newData);

exports.givePermission = ({ Permissions, filter, newData, projection }) =>
  Permissions.updateOne(filter, newData, projection);
