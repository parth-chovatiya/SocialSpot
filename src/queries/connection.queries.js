exports.followPage = ({ Connections, filter, newData, projection }) =>
  Connections.insertOne(newData);

exports.unfollowPage = ({ Connections, filter, newData, projection }) =>
  Connections.deleteOne(filter);
